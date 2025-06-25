import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Filter, BellOff } from 'lucide-react';
import { useNotificationsStore } from '../store/notificationsStore';
import { useItemsStore } from '../store/itemsStore';
import Button from '../components/ui/Button';
import NotificationTable from '../components/notifications/NotificationTable';
import Card from '../components/ui/Card';

const Notifications: React.FC = () => {
  const { 
    notifications,
    filteredNotifications, 
    loading, 
    error, 
    fetchNotifications, 
    fetchNotificationsByItemId,
    markAsRead,
    filterUnread,
    clearFilters
  } = useNotificationsStore();
  
  const { items, loading: itemsLoading, fetchItems } = useItemsStore();
  const [filterItemId, setFilterItemId] = useState<number>(0);
  const [showUnreadOnly, setShowUnreadOnly] = useState<boolean>(false);
  
  // Fetch data on component mount
  useEffect(() => {
    fetchNotifications();
    fetchItems();
  }, [fetchNotifications, fetchItems]);
  
  // Show error toast if error occurs
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const itemId = parseInt(e.target.value, 10);
    setFilterItemId(itemId);
    
    // Apply filters
    if (itemId === 0) {
      if (showUnreadOnly) {
        filterUnread();
      } else {
        clearFilters();
      }
    } else {
      fetchNotificationsByItemId(itemId);
    }
  };
  
  const handleUnreadFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowUnreadOnly(e.target.checked);
    
    if (e.target.checked) {
      filterUnread();
    } else if (filterItemId !== 0) {
      fetchNotificationsByItemId(filterItemId);
    } else {
      clearFilters();
    }
  };
  
  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
    toast.success('Notification marked as read');
  };
  
  const handleMarkAllAsRead = () => {
    filteredNotifications
      .filter(n => n.status === 'unread')
      .forEach(n => markAsRead(n._id));
    
    toast.success('All notifications marked as read');
  };
  
  const unreadCount = filteredNotifications.filter(n => n.status === 'unread').length;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        
        {unreadCount > 0 && (
          <Button
            variant="outline"
            leftIcon={<BellOff size={16} />}
            onClick={handleMarkAllAsRead}
          >
            Mark All as Read
          </Button>
        )}
      </div>
      
      <Card>
        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center">
            <Filter size={20} className="text-gray-500 mr-2" />
            <label htmlFor="item-filter" className="text-sm font-medium text-gray-700 mr-3">
              Filter by Item:
            </label>
            <select
              id="item-filter"
              value={filterItemId}
              onChange={handleFilterChange}
              className="block w-full max-w-xs rounded-md border border-gray-300 px-3 py-2 
                         shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={0}>All Items</option>
              {items.map(item => (
                <option key={item.item_id} value={item.item_id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="unread-filter"
              checked={showUnreadOnly}
              onChange={handleUnreadFilterChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="unread-filter" className="ml-2 text-sm text-gray-700">
              Show unread only
            </label>
          </div>
          
          {(filterItemId !== 0 || showUnreadOnly) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFilterItemId(0);
                setShowUnreadOnly(false);
                clearFilters();
              }}
            >
              Clear All Filters
            </Button>
          )}
        </div>
        
        {/* Table */}
        <NotificationTable
          notifications={filteredNotifications}
          items={items}
          loading={loading || itemsLoading}
          onMarkAsRead={handleMarkAsRead}
        />
      </Card>
    </div>
  );
};

export default Notifications;