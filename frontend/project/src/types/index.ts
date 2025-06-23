export interface Item {
    item_id: number;
    name: string;
    description: string;
    quantity: number;
    price: number;
    category_id: number;
    low_stock_threshold: number;
  }
  
  export interface InventoryLog {
    _id: string;
    item_id: number;
    action: 'add' | 'remove' | 'update';
    quantity_change: number;
    timestamp: string;
  }
  
  export interface Notification {
    _id: string;
    item_id: number;
    type: string;
    message: string;
    timestamp: string;
    status: 'read' | 'unread';
  }
  
  export interface ApiError {
    message: string;
  }
  
  export interface Category {
    category_id: number;
    name: string;
    description: string;
    created_at: string;
  }
  
  
  export interface SpendingAnalytics {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  }