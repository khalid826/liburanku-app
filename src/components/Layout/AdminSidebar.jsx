import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Activity,
  Tag,
  Image,
  Gift,
  CreditCard,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Home,
  BarChart3,
  FileText,
  Bell
} from 'lucide-react';

const AdminSidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedSubmenu, setExpandedSubmenu] = useState(null);
  const location = useLocation();
  const { logout, user } = useAuth();

  const navigationItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      href: '/admin',
      badge: null
    },
    {
      name: 'Activities',
      icon: Activity,
      href: '/admin/activities',
      badge: null
    },
    {
      name: 'Categories',
      icon: Tag,
      href: '/admin/categories',
      badge: null
    },
    {
      name: 'Banners',
      icon: Image,
      href: '/admin/banners',
      badge: null
    },
    {
      name: 'Promos',
      icon: Gift,
      href: '/admin/promos',
      badge: null
    },
    {
      name: 'Transactions',
      icon: CreditCard,
      href: '/admin/transactions',
      badge: '12'
    },
    {
      name: 'Users',
      icon: Users,
      href: '/admin/users',
      badge: null
    }
  ];

  const secondaryItems = [
    {
      name: 'Reports',
      icon: BarChart3,
      href: '/admin/reports',
      badge: null
    },
    {
      name: 'Settings',
      icon: Settings,
      href: '/admin/settings',
      badge: null
    }
  ];

  const isActive = (href) => {
    return location.pathname === href;
  };

  const handleLogout = async () => {
    await logout();
  };

  const toggleSubmenu = (itemName) => {
    setExpandedSubmenu(expandedSubmenu === itemName ? null : itemName);
  };

  const NavItem = ({ item }) => (
    <Link
      to={item.href}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
        isActive(item.href)
          ? 'bg-[#e6f0fd] text-[#0B7582] border-r-2 border-[#0B7582]'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <div className="flex items-center">
        <item.icon size={20} className="flex-shrink-0" />
        <span className="ml-3">{item.name}</span>
      </div>
      {item.badge && (
        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
          {item.badge}
        </span>
      )}
    </Link>
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-md bg-white shadow-lg border border-gray-200"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 bg-white shadow-lg border-r border-gray-200 transition-all duration-300 w-64 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[#0B7582] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="ml-3 font-semibold text-gray-900">Liburanku</span>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-200">
          <div className={`flex items-center`}>
            <div className="w-10 h-10 bg-[#e6f0fd] rounded-full flex items-center justify-center">
              <Users size={20} className="text-[#0B7582]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'Admin User'}
              </p>
              <p className="text-xs text-gray-500 truncate">Administrator</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {/* Main Navigation */}
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-4"></div>

          {/* Secondary Navigation */}
          <div className="space-y-1">
            {secondaryItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-2">
            {/* Back to Website */}
            <Link
              to="/"
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
            >
              <Home size={20} className="flex-shrink-0" />
              <span className="ml-3">Back to Website</span>
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
            >
              <LogOut size={20} className="flex-shrink-0" />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile content spacer */}
      <div className="lg:hidden h-16"></div>
    </>
  );
};

export default AdminSidebar; 