# Inventory Management System

A modern, responsive React frontend application for an Inventory Management System using Tailwind CSS for styling. This application integrates with a backend API to manage inventory data.

## Features

- Dashboard with overview metrics and recent activity
- Item management (view, add, edit, delete) with search functionality
- Inventory log tracking with filtering and form submission
- Notification system with read/unread status and filtering options
- Responsive design optimized for all device sizes

## Tech Stack

- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Zustand for state management
- Axios for API requests
- React Toastify for notifications
- Lucide React for icons
- Date-fns for date formatting

## Setup and Installation

1. Clone the repository
2. Install dependencies
   ```
   npm install
   ```
3. Start the development server
   ```
   npm run dev
   ```

## API Integration

The application integrates with a backend API running at http://localhost:5000, which uses PostgreSQL and MongoDB to manage inventory data. Make sure the backend server is running before using this application.

## Project Structure

- `/src/api`: API service modules
- `/src/components`: Reusable components
  - `/ui`: UI components (Button, Card, etc.)
  - `/layout`: Layout components (Sidebar, Header, etc.)
  - `/items`: Item-related components
  - `/logs`: Log-related components
  - `/notifications`: Notification-related components
- `/src/pages`: Page components
- `/src/store`: State management using Zustand
- `/src/types`: TypeScript type definitions
- `/src/utils`: Utility functions

## Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the application for production
- `npm run preview`: Preview the production build locally
- `npm run lint`: Run ESLint to check for code issues

## License

This project is licensed under the MIT License.