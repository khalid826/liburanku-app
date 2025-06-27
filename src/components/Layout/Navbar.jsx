import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import {
  Home,
  Activity,
  Tag,
  ShoppingCart,
  User,
  Menu,
  X,
  Search,
  LogOut,
  Heart,
  LayoutDashboard // Importing for admin dashboard link
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems, cartItemCount } = useCart();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    {
      label: 'Home',
      path: '/',
      icon: <Home size={20} />
    },
    {
      label: 'Activities',
      path: '/activities',
      icon: <Activity size={20} />
    },
    {
      label: 'Categories',
      path: '/categories',
      icon: <Tag size={20} />
    },
  ];

  // Add Admin Dashboard link if user is admin
  if (user && user.role === 'admin') {
    navItems.push({
      label: 'Admin Dashboard',
      path: '/admin',
      icon: <LayoutDashboard size={20} />
    });
  }

  return (
    <>
      {/* Desktop Navbar */}
      <nav className={`hidden lg:block w-full z-40 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 shadow-md backdrop-blur-sm' : 'bg-white'
      }`}>
        <div className="mx-auto flex w-full px-8 py-3 max-w-5xl items-center">
          {/* Left: Logo */}
          <div className="flex items-center flex-shrink-0 min-w-[180px]">
            <Link
              to="/"
              className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gray-100 transition-all duration-200"
            >
              <img 
                src="/liburanku.png" 
                alt="Liburanku Logo" 
                className="h-6 w-auto"
              />
            </Link>
          </div>

          {/* Center: Navigation Items */}
          <div className="flex-1 flex items-center justify-center space-x-2 px-4">
            <Link
              to="/activities"
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                location.pathname === '/activities'
                  ? 'bg-[#0B7582] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#0B7582] hover:bg-gray-100'
              }`}
            >
              <Activity size={20} />
              <span className="font-medium">Activities</span>
            </Link>
            <Link
              to="/categories"
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                location.pathname === '/categories'
                  ? 'bg-[#0B7582] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#0B7582] hover:bg-gray-100'
              }`}
            >
              <Tag size={20} />
              <span className="font-medium">Categories</span>
            </Link>
          </div>

          {/* Right: Cart and Profile */}
          <div className="flex items-center min-w-[180px] justify-end space-x-1 flex-shrink-0">
            <Link
              to="/cart"
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-all duration-200 relative"
              title="Cart"
            >
              <ShoppingCart size={20} className="text-gray-600" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gray-100 transition-all duration-200"
                  onClick={() => setIsProfileOpen((open) => !open)}
                  aria-haspopup="true"
                  aria-expanded={isProfileOpen}
                >
                  <div className="w-8 h-8 bg-[#0B7582] rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <span className="font-medium text-gray-900">{user.name}</span>
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200/50 transition-all duration-200 z-50">
                    <div className="p-2">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
                      >
                        <User size={16} className="text-gray-600" />
                        <span className="text-gray-700">Profile</span>
                      </Link>
                      <Link
                        to="/transactions"
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
                      >
                        <Activity size={16} className="text-gray-600" />
                        <span className="text-gray-700">My Trips</span>
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
                        >
                          <LayoutDashboard size={16} className="text-gray-600" />
                          <span className="text-gray-700">Admin Dashboard</span>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 w-full text-left transition-all duration-200"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-600 hover:text-[#0B7582] font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-[#0B7582] text-white rounded-full hover:bg-[#095e68] font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Floating Navbar */}
      <nav className={`lg:hidden fixed top-0 left-1/2 transform -translate-x-1/2 z-40 transition-all duration-300 ${
        isScrolled ? 'mt-4' : 'mt-8' // Adjust top margin based on scroll for a floating effect
      }`}>
        <div className="bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-gray-200/50 px-4 py-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-[#0B7582] text-white shadow-md"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            <span className="font-medium">Menu</span>
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
              {/* Search Bar */}
              <div className="flex items-center space-x-2 mb-4 p-3 bg-gray-50 rounded-xl">
                <Search size={18} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search activities..."
                  className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-500 flex-1"
                />
              </div>

              {/* Navigation Items */}
              <div className="space-y-1 mb-4">
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

              {/* User Actions */}
              <div className="space-y-1 mb-4">
                <Link
                  to="/cart"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:text-[#0B7582] hover:bg-gray-100 transition-all duration-200 relative"
                >
                  <ShoppingCart size={20} />
                  <span className="font-medium">Cart</span>
                  {cartItemCount > 0 && (
                    <span className="absolute right-4 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* User Section */}
              {user ? (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-[#0B7582] rounded-full flex items-center justify-center">
                      <User size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:text-[#0B7582] hover:bg-gray-100 transition-all duration-200"
                    >
                      <User size={20} />
                      <span className="font-medium">Profile</span>
                    </Link>
                    <Link
                      to="/transactions"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:text-[#0B7582] hover:bg-gray-100 transition-all duration-200"
                    >
                      <Activity size={20} />
                      <span className="font-medium">My Trips</span>
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:text-[#0B7582] hover:bg-gray-100 transition-all duration-200"
                      >
                        <LayoutDashboard size={20} />
                        <span className="font-medium">Admin Dashboard</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                    >
                      <LogOut size={20} />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full px-4 py-3 text-center text-gray-600 hover:text-[#0B7582] font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full px-4 py-3 text-center bg-[#0B7582] text-white rounded-xl hover:bg-[#095e68] font-medium transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;