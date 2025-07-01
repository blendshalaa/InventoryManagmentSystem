import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-toastify';

interface PrivateRouteProps {
    adminOnly?: boolean;
    children?: React.ReactNode; // Add children prop
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ adminOnly = false, children }) => {
    const { user, token } = useAuthStore();

    if (!token || !user) {
        toast.error('Please log in to access this page.');
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && user.role !== 'admin') {
        toast.error('Access denied. Admins only.');
        return <Navigate to="/dashboard" replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;