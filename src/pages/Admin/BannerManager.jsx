import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { bannerService } from '../../api';
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
  MapPin,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  FileText,
  FileSpreadsheet,
  FileDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import BannerForm from '../../components/Banner/BannerForm';

const ITEMS_PER_PAGE = 10;

const BannerManager = () => {
  const { user } = useAuth();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    dateFrom: '',
    dateTo: '',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bannerToDeleteId, setBannerToDeleteId] = useState(null);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await bannerService.getBanners();
      if (response?.data) {
        setBanners(response.data);
      }
    } catch (err) {
      setError('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (bannerId) => {
    setBannerToDeleteId(bannerId);
    setShowDeleteModal(true);
  };

  const confirmDeleteBanner = async () => {
    if (!bannerToDeleteId) return;

    try {
      await bannerService.deleteBanner(bannerToDeleteId);
      setBanners(banners.filter(banner => banner.id !== bannerToDeleteId));
      setShowDeleteModal(false);
      setBannerToDeleteId(null);
    } catch (err) {
      setError('Failed to delete banner');
    }
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredBanners = banners.filter(banner => {
    const matchesSearch =
      banner.name?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      banner.description?.toLowerCase().includes(filters.searchTerm.toLowerCase());

    const bannerDate = new Date(banner.created_at);
    const filterDateFrom = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const filterDateTo = filters.dateTo ? new Date(filters.dateTo) : null;

    const matchesDate = (!filterDateFrom || bannerDate >= filterDateFrom) &&
                       (!filterDateTo || bannerDate <= filterDateTo);

    return matchesSearch && matchesDate;
  });

  const { currentPage, totalPages, startIndex, endIndex, goToPage } = usePagination(filteredBanners.length, ITEMS_PER_PAGE);
  const paginatedBanners = filteredBanners.slice(startIndex, endIndex);

  const openCreateModal = () => {
    setEditingBanner(null);
    setShowBannerModal(true);
  };

  const openEditModal = (banner) => {
    setEditingBanner(banner);
    setShowBannerModal(true);
  };

  const closeBannerModal = () => {
    setShowBannerModal(false);
    setEditingBanner(null);
    setFormLoading(false);
  };

  const handleBannerFormSubmit = async (data) => {
    setFormLoading(true);
    try {
      if (editingBanner) {
        await bannerService.updateBanner(editingBanner.id, data);
      } else {
        await bannerService.createBanner(data);
      }
      await fetchBanners();
      closeBannerModal();
    } catch (err) {
      setError('Failed to save banner');
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Banner Manager">
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Banner Manager">
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
          <Plus size={18} /> Add New Banner
        </Button>
        <div className="flex flex-row gap-2 sm:justify-end">
          <Button
            onClick={() => exportToCSV(filteredBanners, 'banners.csv')}
            variant="success"
            size="sm"
            className="flex items-center"
          >
            <FileText size={16} className="mr-1" />
            CSV
          </Button>
          <Button
            onClick={() => exportToExcel(filteredBanners, 'banners.xlsx', 'Banners')}
            variant="success"
            size="sm"
            className="flex items-center"
          >
            <FileSpreadsheet size={16} className="mr-1" />
            Excel
          </Button>
          <Button
            onClick={() => exportToPDF(filteredBanners, 'banners.pdf', 'Banners Report')}
            variant="success"
            size="sm"
            className="flex items-center"
          >
            <FileDown size={16} className="mr-1" />
            PDF
          </Button>
        </div>
      </div>

      {/* Banners Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Banner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
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
              {paginatedBanners.map((banner) => (
                <tr key={banner.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      className="h-16 w-24 rounded-lg object-cover"
                      src={banner.imageUrl || 'https://placehold.co/96x64/EBF4FF/76A9FA?text=No+Image'}
                      alt={banner.name}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{banner.name}</div>
                    <div className="text-sm text-gray-500">{banner.description?.substring(0, 50) || 'No description'}...</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{banner.description?.substring(0, 50) || 'No description'}...</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => openEditModal(banner)}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClick(banner.id)}
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
            Are you sure you want to delete this banner? This action cannot be undone.
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
              onClick={confirmDeleteBanner}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Banner Form Modal */}
      <Modal
        isOpen={showBannerModal}
        onClose={closeBannerModal}
        title={editingBanner ? 'Edit Banner' : 'Add New Banner'}
        size="lg"
      >
        <BannerForm
          initialValues={editingBanner}
          onSubmit={handleBannerFormSubmit}
          loading={formLoading}
        />
      </Modal>
    </AdminLayout>
  );
};

export default BannerManager;