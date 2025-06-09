import axios from 'axios';
import {Item, InventoryLog, Notification, Category} from '../types';

// Configure axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Items API
export const itemsApi = {
  getAll: async () => {
    const response = await api.get<Item[]>('/items');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get<Item>(`/items/${id}`);
    return response.data;
  },
  
  create: async (item: Omit<Item, 'item_id'>) => {
    const response = await api.post<Item>('/items', item);
    return response.data;
  },
  
  update: async (id: number, item: Partial<Omit<Item, 'item_id'>>) => {
    const response = await api.put<Item>(`/items/${id}`, item);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  },
};

// Inventory Logs API
export const logsApi = {
  getAll: async () => {
    const response = await api.get<InventoryLog[]>('/inventory_logs');
    return response.data;
  },
  
  getByItemId: async (itemId: number) => {
    const response = await api.get<InventoryLog[]>(`/inventory_logs/item/${itemId}`);
    return response.data;
  },
  
  create: async (log: Omit<InventoryLog, '_id' | 'timestamp'>) => {
    const response = await api.post<InventoryLog>('/inventory_logs', log);
    return response.data;
  },
};

// Notifications API
export const notificationsApi = {
  getAll: async () => {
    const response = await api.get<Notification[]>('/notifications');
    return response.data;
  },
  
  getByItemId: async (itemId: number) => {
    const response = await api.get<Notification[]>(`/notifications/item/${itemId}`);
    return response.data;
  },
  
  create: async (notification: Omit<Notification, '_id' | 'timestamp' | 'status'>) => {
    const response = await api.post<Notification>('/notifications', {
      ...notification,
      status: 'unread',
    });
    return response.data;
  },
};


export const categoriesApi = {
  getAll: async () => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },
  create: async (category: Omit<Category, 'id'>) => {
    const response = await api.post<Category>('/categories', category);
    return response.data;
  },
  update: async (id: number, category: Partial<Category>) => {
    const response = await api.put<Category>(`/categories/${id}`, category);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete<void>(`/categories/${id}`);
    return response.data;
  },
};

export default api;