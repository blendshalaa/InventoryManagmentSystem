import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Items from './pages/Items';
import InventoryLogs from './pages/InventoryLogs';
import Notifications from './pages/Notifications';
import Categories from './pages/Categories';
import Login from './pages/Login';
import Register from './pages/Register';
import UsersManagement from './pages/UsersManagment.tsx';
import PrivateRoute from './components/PrivateRoute.tsx';
import ErrorBoundary from './utils/ErrorBoundary';

function App() {
  return (
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Layout />}>
              <Route
                  index
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
              />
              <Route
                  path="items"
                  element={
                    <PrivateRoute>
                      <Items />
                    </PrivateRoute>
                  }
              />
              <Route
                  path="categories"
                  element={
                    <PrivateRoute>
                      <Categories />
                    </PrivateRoute>
                  }
              />
              <Route
                  path="inventory-logs"
                  element={
                    <PrivateRoute>
                      <InventoryLogs />
                    </PrivateRoute>
                  }
              />
              <Route
                  path="notifications"
                  element={
                    <PrivateRoute>
                      <Notifications />
                    </PrivateRoute>
                  }
              />
              <Route
                  path="users-management"
                  element={
                    <PrivateRoute adminOnly>
                      <UsersManagement />
                    </PrivateRoute>
                  }
              />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
  );
}

export default App;