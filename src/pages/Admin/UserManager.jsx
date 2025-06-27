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

      {/* Export Buttons */}
      <div className="flex justify-end space-x-2 mb-6 mt-4">
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
                        onClick={() => alert('Edit functionality coming soon!')}
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
    </AdminLayout>
  );
};

export default UserManager;