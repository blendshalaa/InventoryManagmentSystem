import { create } from 'zustand';
import { notificationsApi } from '../api';
import { Notification } from '../types';

interface NotificationsState {
  notifications: Notification[];
  filteredNotifications: Notification[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchNotifications: () => Promise<void>;
  fetchNotificationsByItemId: (itemId: number) => Promise<void>;
  markAsRead: (id: string) => void; // Mock function, no backend implementation
  filterUnread: () => void;
  clearFilters: () => void;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  filteredNotifications: [],
  loading: false,
  error: null,
  
  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const notifications = await notificationsApi.getAll();
      set({ notifications, filteredNotifications: notifications, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch notifications', 
        loading: false 
      });
    }
  },
  
  fetchNotificationsByItemId: async (itemId) => {
    set({ loading: true, error: null });
    try {
      const notifications = await notificationsApi.getByItemId(itemId);
      set({ filteredNotifications: notifications, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch notifications for item', 
        loading: false 
      });
    }
  },
  
  // Mock function to mark notification as read (UI only)
  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((notification) => 
        notification._id === id ? { ...notification, status: 'read' } : notification
      ),
      filteredNotifications: state.filteredNotifications.map((notification) => 
        notification._id === id ? { ...notification, status: 'read' } : notification
      ),
    }));
  },
  
  // Filter to show only unread notifications
  filterUnread: () => {
    set((state) => ({
      filteredNotifications: state.notifications.filter(
        (notification) => notification.status === 'unread'
      ),
    }));
  },
  
  // Clear all filters
  clearFilters: () => {
    set((state) => ({ filteredNotifications: state.notifications }));
  },
}));