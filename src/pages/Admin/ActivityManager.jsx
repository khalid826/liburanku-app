// src/pages/Admin/ActivityManager.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { activityService, categoryService } from '../../api'; // Assuming these are named exports or an object
import AdminLayout from '../../components/Layout/AdminLayout';
import Loader from '../../components/UI/Loader';
import ErrorMessage from '../../components/UI/ErrorMessage';
import ActivityFilters from '../../components/Activity/ActivityFilters';
import PriceDisplay from '../../components/Common/PriceDisplay'; // Fixed import path
import Rating from '../../components/Common/Rating'; // Fixed import path
import Button from '../../components/UI/Button'; // Import Button
import Modal from '../../components/UI/Modal'; // Import Modal
import Pagination from '../../components/UI/Pagination'; // Import Pagination
import usePagination from '../../hooks/usePagination'; // Import usePagination hook
import { exportToCSV, exportToExcel, exportToPDF } from '../../utils/exportUtils';
import {
  Activity,
  Plus,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  FileText,
  FileSpreadsheet,
  FileDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DEFAULT_CURRENCY } from '../../utils/constants';
import ActivityForm from '../../components/Activity/ActivityForm';

const ITEMS_PER_PAGE = 10; // Constant for pagination items per page

const ActivityManager = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: 'all',
    minPrice: '',
    maxPrice: '',
    location: ''
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activityToDeleteId, setActivityToDeleteId] = useState(null);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Assuming activityService.getActivities and categoryService.getCategories are named exports
      const [activitiesRes, categoriesRes] = await Promise.allSettled([
        activityService.getActivities(),
        categoryService.getCategories()
      ]);

      if (activitiesRes.status === 'fulfilled' && activitiesRes.value?.data) {
        setActivities(activitiesRes.value.data);
      } else if (activitiesRes.status === 'rejected') {
         console.error("Failed to fetch activities:", activitiesRes.reason);
         setError(prev => prev ? prev + " And activities." : "Failed to load activities.");
      }

      if (categoriesRes.status === 'fulfilled' && categoriesRes.value?.data) {
        setCategories(categoriesRes.value.data);
      } else if (categoriesRes.status === 'rejected') {
          console.error("Failed to fetch categories:", categoriesRes.reason);
          setError(prev => prev ? prev + " And categories." : "Failed to load categories.");
      }

    } catch (err) {
      // This catch might only trigger if Promise.allSettled itself fails, or initial setup fails
      console.error('Unexpected error in fetchData:', err);
      setError('An unexpected error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (activityId) => {
    setActivityToDeleteId(activityId);
    setShowDeleteModal(true);
  };

  const confirmDeleteActivity = async () => {
    if (!activityToDeleteId) return;

    try {
      await activityService.deleteActivity(activityToDeleteId);
      setActivities(activities.filter(activity => activity.id !== activityToDeleteId));
      setShowDeleteModal(false);
      setActivityToDeleteId(null);
    } catch (err) {
      setError('Failed to delete activity');
    }
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = !filters.searchTerm || 
      activity.title?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      activity.description?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      activity.city?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      activity.province?.toLowerCase().includes(filters.searchTerm.toLowerCase());

    const matchesCategory = filters.category === 'all' || activity.categoryId === parseInt(filters.category);

    const matchesLocation = !filters.location || 
      activity.city?.toLowerCase().includes(filters.location.toLowerCase()) ||
      activity.province?.toLowerCase().includes(filters.location.toLowerCase());

    const matchesMinPrice = !filters.minPrice || 
      (activity.price_discount || activity.price) >= parseInt(filters.minPrice);

    const matchesMaxPrice = !filters.maxPrice || 
      (activity.price_discount || activity.price) <= parseInt(filters.maxPrice);

    return matchesSearch && matchesCategory && matchesLocation && matchesMinPrice && matchesMaxPrice;
  });

  // Pagination hook
  const { currentPage, totalPages, startIndex, endIndex, goToPage } = usePagination(filteredActivities.length, ITEMS_PER_PAGE);

  const paginatedActivities = filteredActivities.slice(startIndex, endIndex);

  const openCreateModal = () => {
    setEditingActivity(null);
    setShowActivityModal(true);
  };
  const openEditModal = (activity) => {
    setEditingActivity(activity);
    setShowActivityModal(true);
  };
  const closeActivityModal = () => {
    setShowActivityModal(false);
    setEditingActivity(null);
    setFormLoading(false);
  };

  const handleActivityFormSubmit = async (data) => {
    setFormLoading(true);
    try {
      if (editingActivity) {
        // Update
        await activityService.updateActivity(editingActivity.id, data);
      } else {
        // Create
        await activityService.createActivity(data);
      }
      await fetchData();
      closeActivityModal();
    } catch (err) {
      setError('Failed to save activity');
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Activity Manager">
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Activity Manager">
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      {/* Filters */}
      <ActivityFilters
        categories={categories}
        filters={filters}
        onApplyFilters={handleApplyFilters}
      />

      {/* Top Bar: Add New + Export Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 mt-4">
        <Button onClick={openCreateModal} variant="primary" size="md" className="flex items-center gap-2">
          <Plus size={18} /> Add New Activity
        </Button>
        <div className="flex flex-row gap-2 sm:justify-end">
          <Button
            onClick={() => exportToCSV(filteredActivities, 'activities.csv')}
            variant="success"
            size="sm"
            className="flex items-center"
          >
            <FileText size={16} className="mr-1" />
            CSV
          </Button>
          <Button
            onClick={() => exportToExcel(filteredActivities, 'activities.xlsx', 'Activities')}
            variant="success"
            size="sm"
            className="flex items-center"
          >
            <FileSpreadsheet size={16} className="mr-1" />
            Excel
          </Button>
          <Button
            onClick={() => exportToPDF(filteredActivities, 'activities.pdf', 'Activities Report')}
            variant="success"
            size="sm"
            className="flex items-center"
          >
            <FileDown size={16} className="mr-1" />
            PDF
          </Button>
        </div>
      </div>

      {/* Activities Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedActivities.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-lg object-cover"
                        src={activity.imageUrls?.[0] || 'https://placehold.co/40x40/EBF4FF/76A9FA?text=No+Image'}
                        alt={activity.title}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{activity.title}</div>
                        <div className="text-sm text-gray-500">{activity.description?.substring(0, 50)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {categories.find(cat => cat.id === activity.categoryId)?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {activity.city}, {activity.province}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex flex-col">
                      <PriceDisplay amount={activity.price} currency={DEFAULT_CURRENCY} size="sm" />
                      {activity.price_discount && activity.price_discount < activity.price && (
                        <span className="text-xs text-gray-500">
                          (Disc. <PriceDisplay amount={activity.price_discount} currency={DEFAULT_CURRENCY} size="xs" />)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <Rating rating={activity.rating} totalReviews={activity.total_reviews} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => window.open(`/activity/${activity.id}`, '_blank')}
                      >
                        <Eye size={14} />
                      </Button>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => openEditModal(activity)}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClick(activity.id)}
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
            Are you sure you want to delete this activity? This action cannot be undone.
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
              onClick={confirmDeleteActivity}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create/Edit Activity Modal */}
      <Modal
        isOpen={showActivityModal}
        onClose={closeActivityModal}
        title={editingActivity ? 'Edit Activity' : 'Add New Activity'}
        size="lg"
      >
        <ActivityForm
          initialValues={editingActivity}
          categories={categories}
          onSubmit={handleActivityFormSubmit}
          loading={formLoading}
        />
      </Modal>
    </AdminLayout>
  );
};

export default ActivityManager;