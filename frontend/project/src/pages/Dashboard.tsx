import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package2, ClipboardList, Bell, DollarSign, Download } from 'lucide-react';
import { useItemsStore } from '../store/itemsStore';
import { useLogsStore } from '../store/logsStore';
import { useNotificationsStore } from '../store/notificationsStore';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import { exportSpendingToPDF } from '../utils/pdfExport';
import { toast } from 'react-toastify';

const Dashboard: React.FC = () => {
  const { items, loading: itemsLoading, error: itemsError, fetchItems } = useItemsStore();
  const { logs, spendingAnalytics, loading: logsLoading, error: logsError, fetchLogs } = useLogsStore();
  const { notifications, loading: notificationsLoading, error: notificationsError, fetchNotifications } = useNotificationsStore();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data for dashboard
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await fetchItems(); // Fetch items first for price data
        await Promise.all([fetchLogs(), fetchNotifications()]);
      } catch (error) {
        console.error('Dashboard: Error fetching data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchItems, fetchLogs, fetchNotifications]);

  // Show error toasts
  useEffect(() => {
    if (itemsError) toast.error(itemsError);
    if (logsError) toast.error(logsError);
    if (notificationsError) toast.error(notificationsError);
  }, [itemsError, logsError, notificationsError]);

  // Calculate metrics
  const totalItems = items.length;
  const recentLogs = logs.slice(0, 5);
  const unreadNotifications = notifications.filter((n) => n.status === 'unread');

  const handleExportPDF = () => {
    try {
      exportSpendingToPDF(spendingAnalytics);
      toast.success('Spending report exported successfully!');
    } catch (error) {
      toast.error('Failed to export spending report');
      console.error('PDF export error:', error);
    }
  };

  if (isLoading || itemsLoading || logsLoading || notificationsLoading) {
    return (
        <div className="py-10 flex justify-center">
          <Spinner size="lg" />
        </div>
    );
  }

  return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Items */}
          <Link to="/items" className="transition-transform hover:-translate-y-1">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="flex items-center">
                <Package2 size={32} className="mr-4" />
                <div>
                  <h3 className="text-xl font-semibold">Total Items</h3>
                  <p className="text-3xl font-bold mt-2">{totalItems}</p>
                </div>
              </div>
            </Card>
          </Link>

          {/* Recent Logs */}
          <Link to="/inventory-logs" className="transition-transform hover:-translate-y-1">
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <div className="flex items-center">
                <ClipboardList size={32} className="mr-4" />
                <div>
                  <h3 className="text-xl font-semibold">Inventory Logs</h3>
                  <p className="text-3xl font-bold mt-2">{logs.length}</p>
                </div>
              </div>
            </Card>
          </Link>

          {/* Unread Notifications */}
          <Link to="/notifications" className="transition-transform hover:-translate-y-1">
            <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
              <div className="flex items-center">
                <Bell size={32} className="mr-4" />
                <div>
                  <h3 className="text-xl font-semibold">Unread Notifications</h3>
                  <p className="text-3xl font-bold mt-2">{unreadNotifications.length}</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Logs */}
          <Card title="Recent Inventory Logs">
            {recentLogs.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {recentLogs.map((log) => {
                    const item = items.find((i) => i.item_id === log.item_id);
                    return (
                        <li key={log._id} className="py-3">
                          <div className="flex justify-between">
                            <span className="font-medium">{item?.name || `Item #${log.item_id}`}</span>
                            <span className="text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleDateString()}
                      </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {log.action.charAt(0).toUpperCase() + log.action.slice(1)}:{' '}
                            {log.quantity_change > 0 ? `+${log.quantity_change}` : log.quantity_change}
                          </p>
                        </li>
                    );
                  })}
                </ul>
            ) : (
                <p className="text-gray-500 text-center py-4">No recent logs</p>
            )}
            <div className="mt-4">
              <Link
                  to="/inventory-logs"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View all logs →
              </Link>
            </div>
          </Card>

          {/* Unread Notifications */}
          <Card title="Unread Notifications">
            {unreadNotifications.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {unreadNotifications.slice(0, 5).map((notification) => {
                    const item = items.find((i) => i.item_id === notification.item_id);
                    return (
                        <li key={notification._id} className="py-3">
                          <div className="flex justify-between">
                      <span className="font-medium">
                        {item?.name || `Item #${notification.item_id}`}
                      </span>
                            <span className="text-sm text-gray-500">
                        {new Date(notification.timestamp).toLocaleDateString()}
                      </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        </li>
                    );
                  })}
                </ul>
            ) : (
                <p className="text-gray-500 text-center py-4">No unread notifications</p>
            )}
            <div className="mt-4">
              <Link
                  to="/notifications"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View all notifications →
              </Link>
            </div>
          </Card>
        </div>

        {/* Spending Overview */}
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">Spending Overview</h3>
            <Button
                variant="outline"
                size="sm"
                leftIcon={<Download size={16} />}
                onClick={handleExportPDF}
            >
              Export PDF
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Daily</p>
              <p className="text-lg font-semibold text-gray-900">
                ${spendingAnalytics.daily.toLocaleString()}
              </p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Weekly</p>
              <p className="text-lg font-semibold text-gray-900">
                ${spendingAnalytics.weekly.toLocaleString()}
              </p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Monthly</p>
              <p className="text-lg font-semibold text-gray-900">
                ${spendingAnalytics.monthly.toLocaleString()}
              </p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Yearly</p>
              <p className="text-lg font-semibold text-gray-900">
                ${spendingAnalytics.yearly.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>
  );
};

export default Dashboard;