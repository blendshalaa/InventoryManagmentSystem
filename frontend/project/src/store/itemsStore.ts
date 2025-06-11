import { create } from 'zustand';
import { itemsApi, categoriesApi } from '../api';
import { Item, Category } from '../types';

interface ItemsState {
  items: Item[];
  categories: Category[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchItems: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  addItem: (item: Omit<Item, 'item_id'>) => Promise<Item>;
  updateItem: (id: number, item: Partial<Omit<Item, 'item_id'>>) => Promise<Item>;
  deleteItem: (id: number) => Promise<void>;
}

export const useItemsStore = create<ItemsState>((set, get) => ({
  items: [],
  categories: [],
  loading: false,
  error: null,

  fetchItems: async () => {
    set({ loading: true, error: null });
    try {
      console.log('Store: Fetching items');
      const items = await itemsApi.getAll();
      const normalizedItems = items.map((item: Item) => ({
        ...item,
        price: Number(item.price) || 0, // Ensure price is a number, fallback to 0
      }));
      console.log('Store: Items fetched', normalizedItems);
      set({ items: normalizedItems, loading: false });
    } catch (error) {
      console.error('Store: Error fetching items', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch items',
        loading: false,
      });
    }
  },

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const categories = await categoriesApi.getAll();
      set({ categories, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch categories',
        loading: false,
      });
    }
  },

  addItem: async (item) => {
    set({ loading: true, error: null });
    try {
      const newItem = await itemsApi.create({
        ...item,
        price: Number(item.price) || 0, // Ensure price is a number
      });
      set((state) => ({ items: [...state.items, newItem], loading: false }));
      return newItem;
    } catch (error) {
      console.error('Store: Error adding item', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to add item',
        loading: false,
      });
      throw error;
    }
  },
  updateItem: async (id, item) => {
    set({ loading: true, error: null });
    try {
      const updatedItem = await itemsApi.update(id, {
        ...item,
        price: Number(item.price) || 0, // Ensure price is a number
      });
      set((state) => ({
        items: state.items.map((i) => (i.item_id === id ? updatedItem : i)),
        loading: false,
      }));
      return updatedItem;
    } catch (error) {
      console.error('Store: Error updating item', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to update item',
        loading: false,
      });
      throw error;
    }
  },



  deleteItem: async (id) => {
    set({ loading: true, error: null });
    try {
      await itemsApi.delete(id);
      set((state) => ({
        items: state.items.filter((i) => i.item_id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete item',
        loading: false,
      });
      throw error;
    }
  },
}));

