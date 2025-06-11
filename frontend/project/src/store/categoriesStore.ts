import { create } from 'zustand';
import { categoriesApi } from '../api';
import { Category } from '../types';

interface CategoriesState {
    categories: Category[];
    loading: boolean;
    error: string | null;

    // Actions
    fetchCategories: () => Promise<void>;
    addCategory: (category: Omit<Category, 'category_id' | 'created_at'>) => Promise<Category>;
    updateCategory: (id: number, category: Partial<Omit<Category, 'category_id' | 'created_at'>>) => Promise<Category>;
    deleteCategory: (id: number) => Promise<void>;
}

export const useCategoriesStore = create<CategoriesState>((set) => ({
    categories: [],
    loading: false,
    error: null,

    fetchCategories: async () => {
        set({ loading: true, error: null });
        try {
            const categories = await categoriesApi.getAll();
            set({ categories, loading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch categories',
                loading: false
            });
        }
    },

    addCategory: async (category) => {
        set({ loading: true, error: null });
        try {
            const newCategory = await categoriesApi.create(category);
            set((state) => ({ categories: [...state.categories, newCategory], loading: false }));
            return newCategory;
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to add category',
                loading: false
            });
            throw error;
        }
    },

    updateCategory: async (id, category) => {
        set({ loading: true, error: null });
        try {
            const updatedCategory = await categoriesApi.update(id, category);
            set((state) => ({
                categories: state.categories.map((c) => (c.category_id === id ? updatedCategory : c)),
                loading: false,
            }));
            return updatedCategory;
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to update category',
                loading: false
            });
            throw error;
        }
    },

    deleteCategory: async (id) => {
        set({ loading: true, error: null });
        try {
            await categoriesApi.delete(id);
            set((state) => ({
                categories: state.categories.filter((c) => c.category_id !== id),
                loading: false,
            }));
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to delete category',
                loading: false
            });
            throw error;
        }
    },
}));