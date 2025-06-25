import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Item, Category } from '../../types';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

interface ItemTableProps {
  items: Item[];
  categories: Category[];
  loading: boolean;
  onEdit: (item: Item) => void;
  onDelete: (itemId: number) => void;
}

const ItemTable: React.FC<ItemTableProps> = ({ items, categories, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
        <div className="py-10 flex justify-center">
          <Spinner size="lg" />
        </div>
    );
  }

  if (items.length === 0) {
    return (
        <div className="text-center py-10">
          <p className="text-gray-500">No items found</p>
        </div>
    );
  }

  const getCategoryName = (category_id: number) => {
    const category = categories.find((c) => c.category_id === category_id);
    return category ? category.name : 'Unknown';
  };

  return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item) => (
              <tr key={item.item_id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.item_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {item.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${Number(item.price || 0).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getCategoryName(item.category_id)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(item)}
                        leftIcon={<Edit size={16} />}
                    >
                      Edit
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete(item.item_id)}
                        leftIcon={<Trash2 size={16} />}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
};

export default ItemTable;