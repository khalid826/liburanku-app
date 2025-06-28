import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { categoryService } from '../../api';
import AdminLayout from '../../components/Layout/AdminLayout';
import Loader from '../../components/UI/Loader';
import ErrorMessage from '../../components/UI/ErrorMessage';
import ModernFilters from '../../components/Common/ModernFilters';
import { exportToCSV, exportToExcel, exportToPDF } from '../../utils/exportUtils';
import Button from '../../components/UI/Button'; // Import Button component
import Modal from '../../components/UI/Modal'; // Import Modal component
import Pagination from '../../components/UI/Pagination'; // Import Pagination component
import usePagination from '../../hooks/usePagination'; // Import usePagination hook
import {
  Tag,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  FileText,
  FileSpreadsheet,
  FileDown
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CategoryForm from '../../components/Category/CategoryForm';

const ITEMS_PER_PAGE = 10; // Constant for pagination items per page

const CategoryManager = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    dateRange: null,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDeleteId, setCategoryToDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await categoryService.getCategories();
      if (response?.data) {
        setCategories(response.data);
      }
    } catch (err) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (categoryId) => { // New handler for opening modal
    setCategoryToDeleteId(categoryId);
    setShowDeleteModal(true);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDeleteId) return;

    try {
      await categoryService.deleteCategory(categoryToDeleteId);
      setCategories(categories.filter(category => category.id !== categoryToDeleteId));
      setShowDeleteModal(false);
      setCategoryToDeleteId(null);
    } catch (err) {
      setError('Failed to delete category');
    }
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch =
      category.name?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(filters.searchTerm.toLowerCase());

    const categoryDate = new Date(category.created_at);
    const filterDateFrom = filters.dateRange ? new Date(filters.dateRange.start) : null;
    const filterDateTo = filters.dateRange ? new Date(filters.dateRange.end) : null;

    const matchesDate = (!filterDateFrom || categoryDate >= filterDateFrom) &&
                       (!filterDateTo || categoryDate <= filterDateTo);

    return matchesSearch && matchesDate;
  });

  // Pagination hook
  const { currentPage, totalPages, startIndex, endIndex, goToPage } = usePagination(filteredCategories.length, ITEMS_PER_PAGE);
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

  const openCreateModal = () => {
    navigate('/admin/categories/create');
  };

  const openEditModal = (category) => {
    navigate(`/admin/categories/${category.id}/edit`);
  };

  if (loading) {
    return (
      <AdminLayout title="Category Manager">
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Category Manager">
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
          <Plus size={18} /> Add New Category
        </Button>
        <div className="flex flex-row gap-2 sm:justify-end">
          <Button
            onClick={() => exportToCSV(filteredCategories, 'categories.csv')}
            variant="success"
            size="sm"
            className="flex items-center"
          >
            <FileText size={16} className="mr-1" />
            CSV
          </Button>
          <Button
            onClick={() => exportToExcel(filteredCategories, 'categories.xlsx', 'Categories')}
            variant="success"
            size="sm"
            className="flex items-center"
          >
            <FileSpreadsheet size={16} className="mr-1" />
            Excel
          </Button>
          <Button
            onClick={() => exportToPDF(filteredCategories, 'categories.pdf', 'Categories Report')}
            variant="success"
            size="sm"
            className="flex items-center"
          >
            <FileDown size={16} className="mr-1" />
            PDF
          </Button>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-lg object-cover"
                        src={category.imageUrl || 'https://placehold.co/40x40/EBF4FF/76A9FA?text=No+Image'}
                        alt={category.name}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {category.description?.substring(0, 50) || 'No description'}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => openEditModal(category)}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClick(category.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
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
            Are you sure you want to delete this category? This action cannot be undone.
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
              onClick={confirmDeleteCategory}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default CategoryManager;