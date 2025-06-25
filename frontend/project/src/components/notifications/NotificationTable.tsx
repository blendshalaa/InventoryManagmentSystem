import React from 'react';
import { format } from 'date-fns';
import { Check } from 'lucide-react';
import { Notification, Item } from '../../types';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

interface NotificationTableProps {
  notifications: Notification[];
  items: Item[];
  loading: boolean;
  onMarkAsRead: (id: string) => void;
}

const NotificationTable: React.FC<NotificationTableProps> = ({ 
  notifications, 
  items, 
  loading, 
  onMarkAsRead 
}) => {
  if (loading) {
    return (
      <div className="py-10 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No notifications found</p>
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

  // Helper function to get notification type badge color
  const getTypeBadgeColor = (type: string): string => {
    switch (type) {
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800';
      case 'restock':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Item
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Message
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Timestamp
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {notifications.map((notification) => (
            <tr 
              key={notification._id} 
              className={`hover:bg-gray-50 transition-colors ${
                notification.status === 'unread' ? 'bg-blue-50' : ''
              }`}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                {notification.status === 'unread' ? (
                  <span className="inline-flex h-2 w-2 rounded-full bg-blue-600\" title="Unread"></span>
                ) : (
                  <span className="inline-flex h-2 w-2 rounded-full bg-gray-300" title="Read"></span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeColor(notification.type)}`}>
                  {notification.type.replace('_', ' ')}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {getItemName(notification.item_id)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                <span className={notification.status === 'unread' ? 'font-medium' : ''}>
                  {notification.message}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatTimestamp(notification.timestamp)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {notification.status === 'unread' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMarkAsRead(notification._id)}
                    leftIcon={<Check size={16} />}
                  >
                    Mark as read
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NotificationTable;