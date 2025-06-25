import React, { useState } from 'react';
import { Item, InventoryLog } from '../../types';
import Button from '../ui/Button';

interface LogFormProps {
  items: Item[];
  onSubmit: (log: Omit<InventoryLog, '_id' | 'timestamp'>) => Promise<void>;
  isLoading: boolean;
}

const LogForm: React.FC<LogFormProps> = ({ items, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<Omit<InventoryLog, '_id' | 'timestamp'>>({
    item_id: 0,
    action: 'add',
    quantity_change: 1
  });
  
  const [errors, setErrors] = useState<{
    item_id?: string;
    quantity_change?: string;
  }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Parse values
    let parsedValue: string | number = value;
    if (name === 'item_id') {
      parsedValue = parseInt(value, 10);
    } else if (name === 'quantity_change') {
      parsedValue = parseInt(value, 10);
    }
    
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
    
    // Clear error when field is changed
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    
    if (!formData.item_id) {
      newErrors.item_id = 'Please select an item';
    } else if (!items.some(item => item.item_id === formData.item_id)) {
      newErrors.item_id = 'Selected item does not exist';
    }
    
    if (formData.quantity_change === 0) {
      newErrors.quantity_change = 'Quantity change cannot be zero';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      try {
        await onSubmit(formData);
        // Reset form after successful submission
        setFormData({
          item_id: 0,
          action: 'add',
          quantity_change: 1
        });
      } catch (error) {
        // Error handling is done in the parent component
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Create Inventory Log</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Item Selection */}
          <div>
            <label htmlFor="item_id" className="block text-sm font-medium text-gray-700">
              Select Item
            </label>
            <select
              id="item_id"
              name="item_id"
              value={formData.item_id}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.item_id ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
            >
              <option value={0}>Select an item...</option>
              {items.map(item => (
                <option key={item.item_id} value={item.item_id}>
                  {item.name} (ID: {item.item_id})
                </option>
              ))}
            </select>
            {errors.item_id && (
              <p className="mt-1 text-sm text-red-600">{errors.item_id}</p>
            )}
          </div>
          
          {/* Action */}
          <div>
            <label htmlFor="action" className="block text-sm font-medium text-gray-700">
              Action
            </label>
            <select
              id="action"
              name="action"
              value={formData.action}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="add">Add</option>
              <option value="remove">Remove</option>
              <option value="update">Update</option>
            </select>
          </div>
          
          {/* Quantity Change */}
          <div>
            <label htmlFor="quantity_change" className="block text-sm font-medium text-gray-700">
              Quantity Change
            </label>
            <input
              type="number"
              id="quantity_change"
              name="quantity_change"
              value={formData.quantity_change}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.quantity_change ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
            />
            {errors.quantity_change && (
              <p className="mt-1 text-sm text-red-600">{errors.quantity_change}</p>
            )}
          </div>
          
          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
            >
              Create Log
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LogForm;