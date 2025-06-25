import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Item, Category } from '../../types';
import Button from '../ui/Button';
import {categoriesApi} from "../../api";


interface ItemFormProps {
  item?: Item;
  onSubmit: (item: Omit<Item, 'item_id'> | Partial<Omit<Item, 'item_id'>>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const initialState: Omit<Item, 'item_id'> = {
  name: '',
  description: '',
  quantity: 0,
  price: 0,
  category_id: 1,
  low_stock_threshold: 5,
};

const ItemForm: React.FC<ItemFormProps> = ({ item, onSubmit, onCancel, isLoading }) => {
    const [formData, setFormData] = useState<Omit<Item, 'item_id'>>(initialState);
    const [errors, setErrors] = useState<Partial<Record<keyof Omit<Item, 'item_id'>, string>>>({});
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    // Fetch categories
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          console.log('Attempting categories fetch');
          const response = await categoriesApi.getAll();
          setCategories(response);
          setErrors((prev) => ({ ...prev, category_id: undefined }));
          console.log('Categories loaded:', response);
        } catch (err) {
          console.error('Category fetch error:', err);
          setErrors((prev) => ({ ...prev, category_id: 'Failed to load categories. Please try again.' }));
        } finally {
          setCategoriesLoading(false);
        }
      };
      fetchCategories();
    }, []);

  // Populate form when editing an item
  useEffect(() => {
    if (item) {
      const { item_id, ...rest } = item;
      setFormData(rest);
    }
  }, [item]);

  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;

    // Parse numeric values
    if (['quantity', 'price', 'category_id', 'low_stock_threshold'].includes(name)) {
      parsedValue = value === '' ? 0 : name === 'price' ? parseFloat(value) : parseInt(value, 10);
    }

    setFormData((prev) => ({ ...prev, [name]: parsedValue }));

    // Clear error when field is changed
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.quantity < 0) {
      newErrors.quantity = 'Quantity must be 0 or greater';
    }

    if (formData.price < 0) {
      newErrors.price = 'Price must be 0 or greater';
    }

    if (formData.category_id < 1 || !categories.some((c) => c.category_id === formData.category_id)) {
      newErrors.category_id = 'Please select a valid category';
    }

    if (formData.low_stock_threshold < 0) {
      newErrors.low_stock_threshold = 'Low stock threshold must be 0 or greater';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {item ? 'Edit Item' : 'Add New Item'}
          </h2>
          <button className="text-gray-500 hover:text-gray-700" onClick={onCancel}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Item Name
              </label>
              <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Quantity */}
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  className={`mt-1 block w-full rounded-md border ${
                      errors.quantity ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className={`block w-full rounded-md border ${
                        errors.price ? 'border-red-500' : 'border-gray-300'
                    } pl-7 pr-12 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                />
              </div>
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>

            {/* Category ID */}
            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  disabled={categoriesLoading}
                  className={`mt-1 block w-full rounded-md border ${
                      errors.category_id ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                    <option key={category.category_id} value={category.category_id}>
                      {category.name}
                    </option>
                ))}
              </select>
              {errors.category_id && <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>}
            </div>

            {/* Low Stock Threshold */}
            <div>
              <label htmlFor="low_stock_threshold" className="block text-sm font-medium text-gray-700">
                Low Stock Threshold
              </label>
              <input
                  type="number"
                  id="low_stock_threshold"
                  name="low_stock_threshold"
                  value={formData.low_stock_threshold}
                  onChange={handleChange}
                  min="0"
                  className={`mt-1 block w-full rounded-md border ${
                      errors.low_stock_threshold ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errors.low_stock_threshold && (
                  <p className="mt-1 text-sm text-red-600">{errors.low_stock_threshold}</p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isLoading}>
                {item ? 'Update Item' : 'Add Item'}
              </Button>
            </div>
          </div>
        </form>
      </div>
  );
};

export default ItemForm;