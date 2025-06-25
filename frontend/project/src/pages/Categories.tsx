import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Plus } from 'lucide-react';
import { useCategoriesStore } from '../store/categoriesStore';
import { Category } from '../types';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';

const Categories: React.FC = () => {
    const { categories, loading, error, fetchCategories, addCategory, updateCategory, deleteCategory } = useCategoriesStore();
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '' });

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await updateCategory(editingCategory.category_id, formData);
                toast.success('Category updated successfully');
            } else {
                await addCategory(formData);
                toast.success('Category created successfully');
            }
            setShowForm(false);
            setEditingCategory(null);
            setFormData({ name: '', description: '' });
        } catch (error) {
            toast.error('Failed to save category');
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setFormData({ name: category.name, description: category.description });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await deleteCategory(id);
                toast.success('Category deleted successfully');
            } catch (error) {
                toast.error('Failed to delete category');
            }
        }
    };

    if (loading && categories.length === 0) {
        return (
            <div className="py-10 flex justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
                <Button
                    variant="primary"
                    leftIcon={<Plus size={16} />}
                    onClick={() => {
                        setEditingCategory(null);
                        setFormData({ name: '', description: '' });
                        setShowForm(true);
                    }}
                >
                    Add Category
                </Button>
            </div>

            {showForm && (
                <Card>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                rows={3}
                            />
                        </div>
                        <div className="flex justify-end space-x-3">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingCategory(null);
                                    setFormData({ name: '', description: '' });
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary" isLoading={loading}>
                                {editingCategory ? 'Update Category' : 'Create Category'}
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                    <Card key={category.category_id}>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                                <p className="mt-1 text-sm text-gray-500">{category.description}</p>
                                <p className="mt-2 text-xs text-gray-400">
                                    Created: {new Date(category.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(category)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(category.category_id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Categories;