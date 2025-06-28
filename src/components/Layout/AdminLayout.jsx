import React from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from './AdminSidebar';
import Breadcrumb from '../Common/Breadcrumb';
import { Shield, AlertTriangle, ChevronRight } from 'lucide-react';
import { USER_ROLES } from '../../utils/constants';

const AdminLayout = ({ children, title, breadcrumbs = [] }) => {
  const { user } = useAuth();

  // Check if user is admin
  if (!user || user.role !== USER_ROLES.ADMIN) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="lg:ml-64 transition-all duration-300">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:ml-0 mt-0">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Breadcrumb */}
          {breadcrumbs.length > 0 && (
            <div className="mb-6">
              <Breadcrumb items={breadcrumbs} />
            </div>
          )}
          
          {/* Page Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 