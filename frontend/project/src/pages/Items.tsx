import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Plus, Search } from 'lucide-react';
import { useItemsStore } from '../store/itemsStore.ts';
import { Item } from '../types';
import Button from '../components/ui/Button';
import ItemTable from '../components/items/ItemTable.tsx';
import ItemForm from '../components/items/ItemForm.tsx';

const Items: React.FC = () => {
  const { items, categories, loading, error, fetchItems, fetchCategories, addItem, updateItem, deleteItem } = useItemsStore();

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);

  // Fetch items and categories on component mount
  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, [fetchItems, fetchCategories]);

  // Update filtered items when items, categories, or search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredItems(items);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      setFilteredItems(
          items.filter((item) => {
            const categoryName = categories.find((c) => c.category_id === item.category_id)?.name.toLowerCase() || '';
            return (
                item.name.toLowerCase().includes(lowercasedSearch) ||
                item.description.toLowerCase().includes(lowercasedSearch) ||
                categoryName.includes(lowercasedSearch)
            );
          })
      );
    }
  }, [items, categories, searchTerm]);

  // Show error toast and retry category fetch if needed
  useEffect(() => {
    if (error) {
      toast.error(error);
      if (error.includes('categories')) {
        console.log('Retrying category fetch due to error');
        setTimeout(fetchCategories, 2000);
      }
    }
  }, [error, fetchCategories]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddClick = () => {
    setEditingItem(undefined);
    setShowForm(true);
  };

  const handleEditClick = (item: Item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(id);
        toast.success('Item deleted successfully');
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(error.message || 'Failed to delete item');
      }
    }
  };

  const handleFormSubmit = async (formData: Omit<Item, 'item_id'> | Partial<Omit<Item, 'item_id'>>) => {
    try {
      if (editingItem) {
        await updateItem(editingItem.item_id, formData);
        toast.success('Item updated successfully');
      } else {
        await addItem(formData as Omit<Item, 'item_id'>);
        toast.success('Item added successfully');
      }
      setShowForm(false);
      setEditingItem(undefined);
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.message || 'Failed to save item');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingItem(undefined);
  };

  return (
      <div className="space-y-6 p-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Items</h1>
          <Button
              variant="primary"
              leftIcon={<Plus size={16} />}
              onClick={handleAddClick}
          >
            Add New Item
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
              type="text"
              placeholder="Search items by name, description, or category..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white
                     placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Item Form Modal */}
        {showForm && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <ItemForm
                    item={editingItem}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                    isLoading={loading}
                />
              </div>
            </div>
        )}

        {/* Items Table */}
        <ItemTable
            items={filteredItems}
            categories={categories}
            loading={loading}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
        />
      </div>
  );
};

export default Items;