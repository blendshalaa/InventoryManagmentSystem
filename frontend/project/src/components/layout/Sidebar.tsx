import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package2, ClipboardList, Bell, Box, Tags, LogOut, Users } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-toastify';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, token, logout } = useAuthStore();
  const linkClass = 'flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors';
  const activeLinkClass = 'bg-blue-50 text-blue-600 font-medium';

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    onClose();
  };

  return (
      <>
        {/* Overlay for mobile */}
        {isOpen && (
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                onClick={onClose}
            />
        )}

        {/* Sidebar */}
        <aside
            className={`
          fixed top-0 left-0 z-30 h-full w-64 bg-white border-r border-gray-200 
          transform transition-transform duration-300 ease-in-out lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        >
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <Box className="h-6 w-6 text-blue-600 mr-2" />
            <h1 className="text-xl font-semibold text-gray-800">Inventory System</h1>
          </div>

          {/* Navigation */}
          <nav className="mt-6 px-4 space-y-1">
            {token && user ? (
                <>
                  <NavLink
                      to="/"
                      className={({ isActive }) =>
                          `${linkClass} ${isActive ? activeLinkClass : ''}`
                      }
                      onClick={() => onClose()}
                  >
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                  </NavLink>
                  <NavLink
                      to="/items"
                      className={({ isActive }) =>
                          `${linkClass} ${isActive ? activeLinkClass : ''}`
                      }
                      onClick={() => onClose()}
                  >
                    <Package2 size={20} />
                    <span>Items</span>
                  </NavLink>
                  <NavLink
                      to="/categories"
                      className={({ isActive }) =>
                          `${linkClass} ${isActive ? activeLinkClass : ''}`
                      }
                      onClick={() => onClose()}
                  >
                    <Tags size={20} />
                    <span>Categories</span>
                  </NavLink>
                  <NavLink
                      to="/inventory-logs"
                      className={({ isActive }) =>
                          `${linkClass} ${isActive ? activeLinkClass : ''}`
                      }
                      onClick={() => onClose()}
                  >
                    <ClipboardList size={20} />
                    <span>Inventory Logs</span>
                  </NavLink>
                  <NavLink
                      to="/notifications"
                      className={({ isActive }) =>
                          `${linkClass} ${isActive ? activeLinkClass : ''}`
                      }
                      onClick={() => onClose()}
                  >
                    <Bell size={20} />
                    <span>Notifications</span>
                  </NavLink>
                  {user.role === 'admin' && (
                      <NavLink
                          to="/users-management"
                          className={({ isActive }) =>
                              `${linkClass} ${isActive ? activeLinkClass : ''}`
                          }
                          onClick={() => onClose()}
                      >
                        <Users size={20} />
                        <span>Users</span>
                      </NavLink>
                  )}
                  <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors w-full text-left"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </>
            ) : (
                <>
                  <NavLink
                      to="/login"
                      className={({ isActive }) =>
                          `${linkClass} ${isActive ? activeLinkClass : ''}`
                      }
                      onClick={() => onClose()}
                  >
                    <LogOut size={20} />
                    <span>Login</span>
                  </NavLink>
                  <NavLink
                      to="/register"
                      className={({ isActive }) =>
                          `${linkClass} ${isActive ? activeLinkClass : ''}`
                      }
                      onClick={() => onClose()}
                  >
                    <Users size={20} />
                    <span>Register</span>
                  </NavLink>
                </>
            )}
          </nav>
        </aside>
      </>
  );
};

export default Sidebar;