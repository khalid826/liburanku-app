import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../api';
import AdminLayout from '../../components/Layout/AdminLayout';
import Loader from '../../components/UI/Loader';
import ErrorMessage from '../../components/UI/ErrorMessage';
import ModernFilters from '../../components/Common/ModernFilters';
import { exportToCSV, exportToExcel, exportToPDF } from '../../utils/exportUtils';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import Pagination from '../../components/UI/Pagination';
import usePagination from '../../hooks/usePagination';
import {
  Users,
  Plus,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  FileText,
  FileSpreadsheet,
  FileDown
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ITEMS_PER_PAGE = 10;

const UserManager = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    dateFrom: '',
    dateTo: '',
    role: 'all'
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' }
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await userService.getAllUsers();
      if (response?.data) {
        setUsers(response.data);
      }
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (userId) => {
    setUserToDeleteId(userId);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDeleteId) return;

    try {
      await userService.deleteUser(userToDeleteId);
      setUsers(users.filter(user => user.id !== userToDeleteId));
      setShowDeleteModal(false);
      setUserToDeleteId(null);
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(filters.searchTerm.toLowerCase());

    const userDate = new Date(user.created_at);
    const filterDateFrom = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const filterDateTo = filters.dateTo ? new Date(filters.dateTo) : null;

    const matchesDate = (!filterDateFrom || userDate >= filterDateFrom) &&
                       (!filterDateTo || userDate <= filterDateTo);

    const matchesRole = filters.role === 'all' || user.role === filters.role;

    return matchesSearch && matchesDate && matchesRole;
  });

  const { currentPage, totalPages, startIndex, endIndex, goToPage } = usePagination(filteredUsers.length, ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const openCreateModal = () => {
    setEditingUser(null);
    setShowUserModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setEditingUser(null);
    setFormLoading(false);
  };

  const handleUserFormSubmit = async (data) => {
    setFormLoading(true);
    try {
      if (editingUser) {
        // Update
        await userService.updateUser(editingUser.id, data);
      } else {
        // Create
        await userService.createUser(data);
      }
      await fetchUsers();
      closeUserModal();
    } catch (err) {
      setError('Failed to save user');
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="User Manager">
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="User Manager">
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      {/* Filters */}
      <ModernFilters
        filters={filters}
        onApplyFilters={handleApplyFilters}
        options={{
          search: true,
          dateRange: true,
        }}
      />

      {/* Top Bar: Add New + Export Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 mt-4">
        <Button onClick={openCreateModal} variant="primary" size="md" className="flex items-center gap-2">
          <Plus size={18} /> Add New User
        </Button>
        <div className="flex flex-row gap-2 sm:justify-end">
          <Button
            onClick={() => exportToCSV(filteredUsers, 'users.csv')}
            variant="success"
            size="sm"
            className="flex items-center"
          >
            <FileText size={16} className="mr-1" />
            CSV
          </Button>
          <Button
            onClick={() => exportToExcel(filteredUsers, 'users.xlsx', 'Users')}
            variant="success"
            size="sm"
            className="flex items-center"
          >
            <FileSpreadsheet size={16} className="mr-1" />
            Excel
          </Button>
          <Button
            onClick={() => exportToPDF(filteredUsers, 'users.pdf', 'Users Report')}
            variant="success"
            size="sm"
            className="flex items-center"
          >
            <FileDown size={16} className="mr-1" />
            PDF
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={user.profile_picture || 'https://placehold.co/40x40/EBF4FF/76A9FA?text=U'}
                        alt={user.name}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.phone || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link to={`/admin/users/${user.id}`}>
                        <Button variant="info" size="sm">
                          <Eye size={14} />
                        </Button>
                      </Link>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => openEditModal(user)}
                      >
                        <Edit size={14} />
                      </Button>
                      {user.id !== currentUser?.id && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteClick(user.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete this user? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDeleteUser}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create/Edit User Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={closeUserModal}
        title={editingUser ? 'Edit User' : 'Add New User'}
        size="lg"
      >
        <div className="p-6">
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {
              name: formData.get('name'),
              email: formData.get('email'),
              phone: formData.get('phone'),
              role: formData.get('role'),
              profile_picture: formData.get('profile_picture')
            };
            if (!editingUser) {
              data.password = formData.get('password');
            }
            handleUserFormSubmit(data);
          }}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  defaultValue={editingUser?.name || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  defaultValue={editingUser?.email || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {!editingUser && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  defaultValue={editingUser?.phone || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  defaultValue={editingUser?.role || 'user'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label htmlFor="profile_picture" className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Picture URL
                </label>
                <input
                  type="url"
                  id="profile_picture"
                  name="profile_picture"
                  defaultValue={editingUser?.profile_picture || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={closeUserModal}
                disabled={formLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={formLoading}
              >
                {formLoading ? 'Saving...' : (editingUser ? 'Update User' : 'Create User')}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default UserManager;