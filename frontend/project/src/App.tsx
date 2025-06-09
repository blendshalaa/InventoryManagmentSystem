import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Items from './pages/Items';
import InventoryLogs from './pages/InventoryLogs';
import Notifications from './pages/Notifications';
import ErrorBoundary from './utils/ErrorBoundary';
import Categories from "./pages/Categories.tsx";

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="items" element={<Items />} />
            <Route path="categories" element={<Categories />} />
            <Route path="inventory-logs" element={<InventoryLogs />} />
            <Route path="notifications" element={<Notifications />} />
            {/* Redirect any unknown routes to dashboard */}
            <Route path="*" element={<Navigate to="/\" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;