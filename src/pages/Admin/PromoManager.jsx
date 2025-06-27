import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { promoService } from '../../api';
import AdminLayout from '../../components/Layout/AdminLayout';
import Loader from '../../components/UI/Loader';
import ErrorMessage from '../../components/UI/ErrorMessage';
import ModernFilters from '../../components/Common/ModernFilters';
import { exportToCSV, exportToExcel, exportToPDF } from '../../utils/exportUtils';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import Pagination from '../../components/UI/Pagination';
import usePagination from '../../hooks/usePagination';
import PriceDisplay from '../../components/Common/PriceDisplay';
import {
  Settings,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  FileText,
  FileSpreadsheet,
  FileDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DEFAULT_CURRENCY } from '../../utils/constants';
import PromoForm from '../../components/Promo/PromoForm';

const ITEMS_PER_PAGE = 10;

const PromoManager = () => {
  const { user } = useAuth();
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    dateFrom: '',
    dateTo: '',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [promoToDeleteId, setPromoToDeleteId] = useState(null);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await promoService.getPromos();
      if (response?.data) {
        setPromos(response.data);
      }
    } catch (err) {
      setError('Failed to load promos');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (promoId) => {
    setPromoToDeleteId(promoId);
    setShowDeleteModal(true);
  };

  const confirmDeletePromo = async () => {
    if (!promoToDeleteId) return;

    try {
      await promoService.deletePromo(promoToDeleteId);
      setPromos(promos.filter(promo => promo.id !== promoToDeleteId));
      setShowDeleteModal(false);
      setPromoToDeleteId(null);
    } catch (err) {
      setError('Failed to delete promo');
    }
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredPromos = promos.filter(promo => {
    const matchesSearch =
      promo.title?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      promo.promo_code?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      promo.description?.toLowerCase().includes(filters.searchTerm.toLowerCase());

    const promoDate = new Date(promo.created_at);
    const filterDateFrom = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const filterDateTo = filters.dateTo ? new Date(filters.dateTo) : null;

    const matchesDate = (!filterDateFrom || promoDate >= filterDateFrom) &&
                       (!filterDateTo || promoDate <= filterDateTo);

    return matchesSearch && matchesDate;
  });

  const { currentPage, totalPages, startIndex, endIndex, goToPage } = usePagination(filteredPromos.length, ITEMS_PER_PAGE);
  const paginatedPromos = filteredPromos.slice(startIndex, endIndex);

  const openCreateModal = () => {
    setEditingPromo(null);
    setShowPromoModal(true);
  };

  const openEditModal = (promo) => {
    setEditingPromo(promo);
    setShowPromoModal(true);
  };

  const closePromoModal = () => {
    setShowPromoModal(false);
    setEditingPromo(null);
    setFormLoading(false);
  };

  const handlePromoFormSubmit = async (data) => {
    setFormLoading(true);
    try {
      if (editingPromo) {
        await promoService.updatePromo(editingPromo.id, data);
      } else {
        await promoService.createPromo(data);
      }
      await fetchPromos();
      closePromoModal();
    } catch (err) {
      setError('Failed to save promo');
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Promo Manager">
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Promo Manager">
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
          <Plus size={18} /> Add New Promo
        </Button>
        <div className="flex flex-row gap-2 sm:justify-end">
          <Button
            onClick={() => exportToCSV(filteredPromos, 'promos.csv')}
            variant="success"
            size="sm"
            className="flex items-center"
          >
            <FileText size={16} className="mr-1" />
            CSV
          </Button>
          <Button
            onClick={() => exportToExcel(filteredPromos, 'promos.xlsx', 'Promos')}
            variant="success"
            size="sm"
            className="flex items-center"
          >
            <FileSpreadsheet size={16} className="mr-1" />
            Excel
          </Button>
          <Button
            onClick={() => exportToPDF(filteredPromos, 'promos.pdf', 'Promos Report')}
            variant="success"
            size="sm"
            className="flex items-center"
          >
            <FileDown size={16} className="mr-1" />
            PDF
          </Button>
        </div>
      </div>

      {/* Promos Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Promo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min Claim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedPromos.map((promo) => (
                <tr key={promo.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-lg object-cover"
                        src={promo.imageUrl || 'https://placehold.co/40x40/EBF4FF/76A9FA?text=No+Image'}
                        alt={promo.title}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{promo.title}</div>
                        <div className="text-sm text-gray-500">{promo.description?.substring(0, 50)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {promo.promo_code}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <PriceDisplay amount={promo.promo_discount_price} currency={DEFAULT_CURRENCY} size="sm" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <PriceDisplay amount={promo.minimum_claim_price} currency={DEFAULT_CURRENCY} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => openEditModal(promo)}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClick(promo.id)}
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
            Are you sure you want to delete this promo? This action cannot be undone.
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
              onClick={confirmDeletePromo}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Promo Form Modal */}
      <Modal
        isOpen={showPromoModal}
        onClose={closePromoModal}
        title={editingPromo ? 'Edit Promo' : 'Add New Promo'}
        size="lg"
      >
        <PromoForm
          initialValues={editingPromo}
          onSubmit={handlePromoFormSubmit}
          loading={formLoading}
        />
      </Modal>
    </AdminLayout>
  );
};

export default PromoManager;