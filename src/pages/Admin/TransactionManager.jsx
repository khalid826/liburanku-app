import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { transactionService } from '../../api';
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
  Receipt,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  FileSpreadsheet,
  FileDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DEFAULT_CURRENCY } from '../../utils/constants';

const ITEMS_PER_PAGE = 10;

const TransactionManager = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    dateFrom: '',
    dateTo: '',
    status: [],
    minPrice: '',
    maxPrice: ''
  });
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'success', label: 'Success' },
    { value: 'failed', label: 'Failed' },
    { value: 'canceled', label: 'Canceled' }
  ];

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await transactionService.getAllTransactions();
      if (response?.data) {
        setTransactions(response.data);
      }
    } catch (err) {
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = (transaction, status) => {
    setSelectedTransaction(transaction);
    setNewStatus(status);
    setShowStatusModal(true);
  };

  const confirmStatusUpdate = async () => {
    if (!selectedTransaction || !newStatus) return;

    try {
      await transactionService.updateTransactionStatus(selectedTransaction.id, newStatus);
      setTransactions(prevTransactions =>
        prevTransactions.map(transaction =>
          transaction.id === selectedTransaction.id
            ? { ...transaction, status: newStatus }
            : transaction
        )
      );
      setShowStatusModal(false);
      setSelectedTransaction(null);
      setNewStatus('');
    } catch (err) {
      setError('Failed to update transaction status');
    }
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch =
      transaction.id?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      transaction.user?.name?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      transaction.user?.email?.toLowerCase().includes(filters.searchTerm.toLowerCase());

    const matchesStatus = filters.status.length === 0 ||
      filters.status.includes(transaction.status?.toLowerCase());

    const transactionDate = new Date(transaction.createdAt);
    const filterDateFrom = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const filterDateTo = filters.dateTo ? new Date(filters.dateTo) : null;

    const matchesDate = (!filterDateFrom || transactionDate >= filterDateFrom) &&
                       (!filterDateTo || transactionDate <= filterDateTo);

    const matchesPrice = (!filters.minPrice || transaction.totalAmount >= parseFloat(filters.minPrice)) &&
                        (!filters.maxPrice || transaction.totalAmount <= parseFloat(filters.maxPrice));

    return matchesSearch && matchesStatus && matchesDate && matchesPrice;
  });

  const { currentPage, totalPages, startIndex, endIndex, goToPage } = usePagination(filteredTransactions.length, ITEMS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'failed':
        return <XCircle size={16} className="text-red-500" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      case 'canceled':
        return <XCircle size={16} className="text-gray-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'canceled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Transaction Manager">
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Transaction Manager">
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      {/* Filters */}
      <ModernFilters
        filters={filters}
        onApplyFilters={handleApplyFilters}
        options={{
          search: true,
          dateRange: true,
          priceRange: true,
          status: true
        }}
        statusOptions={statusOptions}
      />

      {/* Export Buttons */}
      <div className="flex justify-end space-x-2 mb-6 mt-4">
        <Button
          onClick={() => exportToCSV(filteredTransactions, 'transactions.csv')}
          variant="success"
          size="sm"
          className="flex items-center"
        >
          <FileText size={16} className="mr-1" />
          CSV
        </Button>
        <Button
          onClick={() => exportToExcel(filteredTransactions, 'transactions.xlsx', 'Transactions')}
          variant="success"
          size="sm"
          className="flex items-center"
        >
          <FileSpreadsheet size={16} className="mr-1" />
          Excel
        </Button>
        <Button
          onClick={() => exportToPDF(filteredTransactions, 'transactions.pdf', 'Transactions Report')}
          variant="success"
          size="sm"
          className="flex items-center"
        >
          <FileDown size={16} className="mr-1" />
          PDF
        </Button>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{transaction.id?.slice(-8) || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{transaction.user?.name || 'Unknown'}</div>
                    <div className="text-sm text-gray-500">{transaction.user?.email || 'No email'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <PriceDisplay amount={transaction.totalAmount} currency={DEFAULT_CURRENCY} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(transaction.status)}
                      <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                        {transaction.status || 'Unknown'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link to={`/admin/transactions/${transaction.id}`}>
                        <Button variant="info" size="sm">
                          <Eye size={14} />
                        </Button>
                      </Link>
                      {transaction.status === 'pending' && (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleStatusUpdate(transaction, 'success')}
                          >
                            <CheckCircle size={14} />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleStatusUpdate(transaction, 'failed')}
                          >
                            <XCircle size={14} />
                          </Button>
                        </>
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

      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Update Transaction Status"
        size="sm"
      >
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Are you sure you want to update the status of transaction #{selectedTransaction?.id?.slice(-8)} to "{newStatus}"?
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowStatusModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={confirmStatusUpdate}
            >
              Update Status
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default TransactionManager;