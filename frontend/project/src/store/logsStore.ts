import { create } from 'zustand';
import { logsApi } from '../api';
import { InventoryLog, SpendingAnalytics } from '../types';
import { useItemsStore } from './itemsStore';

interface LogsState {
  logs: InventoryLog[];
  filteredLogs: InventoryLog[];
  spendingAnalytics: SpendingAnalytics;
  loading: boolean;
  error: string | null;
  fetchLogs: () => Promise<void>;
  fetchLogsByItemId: (itemId: number) => Promise<void>;
  createLog: (log: Omit<InventoryLog, '_id' | 'timestamp'>) => Promise<InventoryLog>;
  clearFilter: () => void;
}

export const useLogsStore = create<LogsState>((set, get) => ({
  logs: [],
  filteredLogs: [],
  spendingAnalytics: { daily: 0, weekly: 0, monthly: 0, yearly: 0 },
  loading: false,
  error: null,

  fetchLogs: async () => {
    set({ loading: true, error: null });
    try {
      console.log('Store: Fetching inventory logs');
      const logs = await logsApi.getAll();
      const { items } = useItemsStore.getState(); // Get items for price data
      const now = new Date();
      const periods = {
        daily: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        weekly: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        monthly: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        yearly: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000),
      };

      const totals: SpendingAnalytics = {
        daily: 0,
        weekly: 0,
        monthly: 0,
        yearly: 0,
      };

      logs.forEach((log: InventoryLog) => {
        if (log.action === 'add' && log.quantity_change > 0) {
          const item = items.find((i) => i.item_id === log.item_id);
          const price = item ? Number(item.price) : 0;
          const amount = log.quantity_change * price;
          const logDate = new Date(log.timestamp);
          if (logDate >= periods.daily) totals.daily += amount;
          if (logDate >= periods.weekly) totals.weekly += amount;
          if (logDate >= periods.monthly) totals.monthly += amount;
          if (logDate >= periods.yearly) totals.yearly += amount;
        }
      });

      console.log('Store: Spending analytics calculated', totals);
      set({ logs, filteredLogs: logs, spendingAnalytics: totals, loading: false });
    } catch (error) {
      console.error('Store: Error fetching logs', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch logs',
        loading: false,
      });
    }
  },

  fetchLogsByItemId: async (itemId: number) => {
    set({ loading: true, error: null });
    try {
      console.log('Store: Fetching logs for item', itemId);
      const logs = await logsApi.getByItemId(itemId);
      set({ filteredLogs: logs, loading: false });
    } catch (error) {
      console.error('Store: Error fetching logs by item', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch logs for item',
        loading: false,
      });
    }
  },

  createLog: async (log: Omit<InventoryLog, '_id' | 'timestamp'>) => {
    set({ loading: true, error: null });
    try {
      console.log('Store: Creating log', log);
      const newLog = await logsApi.create(log);
      set((state) => ({
        logs: [newLog, ...state.logs],
        filteredLogs:
            state.filteredLogs.length > 0 && state.filteredLogs[0].item_id === log.item_id
                ? [newLog, ...state.filteredLogs]
                : state.filteredLogs,
        loading: false,
      }));
      return newLog;
    } catch (error) {
      console.error('Store: Error creating log', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to create log',
        loading: false,
      });
      throw error;
    }
  },

  clearFilter: () => {
    set((state) => ({ filteredLogs: state.logs }));
  },
}));