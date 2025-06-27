import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  BarChart3, 
  Activity, 
  Tag, 
  MapPin, 
  Settings, 
  Receipt, 
  Users,
  Home
} from 'lucide-react';

const AdminNav = () => {
  const location = useLocation();
  const { isAdmin } = useAuth();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: BarChart3 },
    { path: '/admin/activities', label: 'Activities', icon: Activity },
    { path: '/admin/categories', label: 'Categories', icon: Tag },
    { path: '/admin/banners', label: 'Banners', icon: MapPin },
    { path: '/admin/promos', label: 'Promos', icon: Settings },
    { path: '/admin/transactions', label: 'Transactions', icon: Receipt },
    { path: '/admin/users', label: 'Users', icon: Users },
  ];

  // Don't render if user is not admin
  if (!isAdmin()) {
    return null;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>
        <Link 
          to="/" 
          className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
        >
          <Home size={16} className="mr-1" />
          Back to Site
        </Link>
      </div>
      
      <nav className="flex flex-wrap gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon size={16} className="mr-2" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminNav; 