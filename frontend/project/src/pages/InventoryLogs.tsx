import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Filter } from 'lucide-react';
import { useLogsStore } from '../store/logsStore';
import { useItemsStore } from '../store/itemsStore';
import Button from '../components/ui/Button';
import LogTable from '../components/logs/LogTable';
import LogForm from '../components/logs/LogForm';
import Card from '../components/ui/Card';

const InventoryLogs: React.FC = () => {
  const { logs, filteredLogs, loading, error, fetchLogs, fetchLogsByItemId, createLog, clearFilter } = useLogsStore();
  const { items, loading: itemsLoading, fetchItems } = useItemsStore();
  const [filterItemId, setFilterItemId] = useState<number>(0);

  // Fetch data on component mount
  useEffect(() => {
    fetchLogs();
    fetchItems();
  }, [fetchLogs, fetchItems]);

  // Show error toast if error occurs
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const itemId = parseInt(e.target.value, 10);
    setFilterItemId(itemId);

    if (itemId === 0) {
      clearFilter();
    } else {
      fetchLogsByItemId(itemId);
    }
  };

  const handleCreateLog = async (formData: any) => {
    try {
      await createLog(formData);
      toast.success('Log created successfully');
    } catch (error) {
      toast.error('Failed to create log');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Inventory Logs</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Log Form */}
        <div className="lg:col-span-1">
          <LogForm
            items={items}
            onSubmit={handleCreateLog}
            isLoading={loading}
          />
        </div>

        {/* Logs Table with Filter */}
        <div className="lg:col-span-3">
          <Card>
            {/* Filter */}
            <div className="mb-6 flex items-center">
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

              {filterItemId !== 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2"
                  onClick={() => {
                    setFilterItemId(0);
                    clearFilter();
                  }}
                >
                  Clear Filter
                </Button>
              )}
            </div>

            {/* Table */}
            <LogTable
              logs={filteredLogs}
              items={items}
              loading={loading || itemsLoading}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InventoryLogs;