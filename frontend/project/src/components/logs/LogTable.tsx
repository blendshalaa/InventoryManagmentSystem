import React from 'react';
import { format } from 'date-fns';
import { InventoryLog, Item } from '../../types';
import Spinner from '../ui/Spinner';

interface LogTableProps {
  logs: InventoryLog[];
  items: Item[];
  loading: boolean;
}

const LogTable: React.FC<LogTableProps> = ({ logs, items, loading }) => {
  if (loading) {
    return (
      <div className="py-10 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No logs found</p>
      </div>
    );
  }

  // Helper function to get item name by id
  const getItemName = (itemId: number): string => {
    const item = items.find(item => item.item_id === itemId);
    return item ? item.name : `Item #${itemId}`;
  };

  // Helper function to format timestamp
  const formatTimestamp = (timestamp: string): string => {
    try {
      return format(new Date(timestamp), 'PPpp'); // Format like "Apr 29, 2023, 9:30 AM"
    } catch (error) {
      return timestamp;
    }
  };

  // Helper function to get action badge color
  const getActionBadgeColor = (action: string): string => {
    switch (action) {
      case 'add':
        return 'bg-green-100 text-green-800';
      case 'remove':
        return 'bg-red-100 text-red-800';
      case 'update':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
              Item
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity Change
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Timestamp
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {logs.map((log) => (
            <tr key={log._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {log._id.substring(0, 8)}...
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {getItemName(log.item_id)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getActionBadgeColor(log.action)}`}>
                  {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {log.quantity_change > 0 ? `+${log.quantity_change}` : log.quantity_change}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatTimestamp(log.timestamp)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogTable;