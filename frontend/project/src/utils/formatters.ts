import { format, parseISO } from 'date-fns';

// Format a date string to a readable format
export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'PPpp'); // Format like "Apr 29, 2023, 9:30 AM"
  } catch (error) {
    return dateString;
  }
};

// Format a price to currency
export const formatCurrency = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

// Truncate a string if it's too long
export const truncateString = (str: string, maxLength: number = 50): string => {
  if (str.length <= maxLength) return str;
  return `${str.substring(0, maxLength)}...`;
};

// Format an action string to be more readable
export const formatAction = (action: string): string => {
  return action.charAt(0).toUpperCase() + action.slice(1);
};

// Format a quantity change with a sign
export const formatQuantityChange = (change: number): string => {
  return change > 0 ? `+${change}` : change.toString();
};