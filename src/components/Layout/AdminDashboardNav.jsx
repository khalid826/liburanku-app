import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Activity,
  Tag,
  MapPin,
  Settings,
  Receipt,
  Users,
  Menu,
  X,
  LogOut,
  User
} from 'lucide-react';

const AdminDashboardNav = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      label: 'Dashboard',
      path: '/admin',
      icon: <LayoutDashboard size={20} />
    },
    {
      label: 'Activities',
      path: '/admin/activities',
      icon: <Activity size={20} />
    },
    {
      label: 'Categories',
      path: '/admin/categories',
      icon: <Tag size={20} />
    },
    {
      label: 'Banners',
      path: '/admin/banners',
      icon: <MapPin size={20} />
    },
    {
      label: 'Promos',
      path: '/admin/promos',
      icon: <Settings size={20} />
    },
    {
      label: 'Transactions',
      path: '/admin/transactions',
      icon: <Receipt size={20} />
    },
    {
      label: 'Users',
      path: '/admin/users',
      icon: <Users size={20} />
    }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Desktop Floating Navbar */}
      <nav className="hidden lg:block fixed top-0 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-gray-200/50 px-6 py-3">
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-[#0B7582] text-white shadow-md'
                      : 'text-gray-600 hover:text-[#0B7582] hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Floating Navbar */}
      <nav className="lg:hidden fixed top-0 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-gray-200/50 px-4 py-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-[#0B7582] text-white shadow-md"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            <span className="font-medium">Admin Panel</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30">
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-20 left-4 right-4 bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-[#0B7582] rounded-full flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-[#0B7582] text-white'
                          : 'text-gray-600 hover:text-[#0B7582] hover:bg-gray-100'
                      }`}
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Floating Button */}
      <div className="fixed top-0 right-6 z-40">
        <div className="bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-gray-200/50 px-4 py-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#0B7582] rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardNav; 