import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { transactionService } from '../../api';
import Loader from '../../components/UI/Loader';
import ErrorMessage from '../../components/UI/ErrorMessage';
import { Receipt, Clock, CheckCircle, XCircle, AlertCircle, Eye, Trash2, CheckSquare, Square, Filter, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { DEFAULT_CURRENCY } from '../../utils/constants';
import TransactionCard from '../../components/Transaction/TransactionCard';
import Breadcrumb from '../../components/Common/Breadcrumb';
import Pagination from '../../components/UI/Pagination';
import usePagination from '../../hooks/usePagination';

const TransactionPage = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ field: 'createdAt', direction: 'desc' });

  const { currentPage, totalPages, goToPage, startIndex, endIndex } = usePagination(
    transactions.length, 
    10 // items per page
  );

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionService.getMyTransactions();
      setTransactions(response.data || []);
    } catch (err) {
      setError('Failed to fetch transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTransaction = async (transactionId) => {
    if (!window.confirm('Are you sure you want to cancel this transaction? This action cannot be undone.')) {
      return;
    }

    try {
      setCancellingId(transactionId);
      setError(null);
      
      await transactionService.cancelTransaction(transactionId);
      
      // Update the transaction status locally
      setTransactions(transactions.map(transaction => {
        const currentTransactionId = transaction.id || transaction._id || transaction.transactionId;
        return currentTransactionId === transactionId 
          ? { ...transaction, status: 'cancelled' }
          : transaction;
      }));
      
      showSuccess('Transaction cancelled successfully!');
    } catch (err) {
      setError(err.message || 'Failed to cancel transaction');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'failed':
        return <XCircle size={20} className="text-red-500" />;
      case 'pending':
        return <Clock size={20} className="text-yellow-500" />;
      case 'cancelled':
        return <XCircle size={20} className="text-gray-500" />;
      default:
        return <AlertCircle size={20} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canCancelTransaction = (transaction) => {
    // Only pending transactions can be cancelled
    return transaction.status?.toLowerCase() === 'pending';
  };

  const handleSelectTransaction = (transactionId) => {
    setSelectedTransactions(prev => 
      prev.includes(transactionId) 
        ? prev.filter(id => id !== transactionId)
        : [...prev, transactionId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTransactions.length === transactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(transactions.map(t => t.id || t._id || t.transactionId).filter(Boolean));
    }
  };

  const handleBulkCancel = async () => {
    if (!window.confirm(`Are you sure you want to cancel ${selectedTransactions.length} transaction(s)? This action cannot be undone.`)) {
      return;
    }

    try {
      setError(null);
      const cancelPromises = selectedTransactions.map(id => transactionService.cancelTransaction(id));
      await Promise.all(cancelPromises);
      
      // Update transactions locally
      setTransactions(transactions.map(transaction => {
        const transactionId = transaction.id || transaction._id || transaction.transactionId;
        return selectedTransactions.includes(transactionId) 
          ? { ...transaction, status: 'cancelled' }
          : transaction;
      }));
      
      setSelectedTransactions([]);
      showSuccess(`${selectedTransactions.length} transaction(s) cancelled successfully!`);
    } catch (err) {
      showError(err.message || 'Failed to cancel some transactions');
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedTransactions.length} transaction(s)? This action cannot be undone.`)) {
      return;
    }

    try {
      setError(null);
      // Note: If there's no delete endpoint, we'll just remove from local state
      // You can add actual delete API calls here if available
      
      // Remove selected transactions from local state
      setTransactions(transactions.filter(transaction => {
        const transactionId = transaction.id || transaction._id || transaction.transactionId;
        return !selectedTransactions.includes(transactionId);
      }));
      
      setSelectedTransactions([]);
      showSuccess(`${selectedTransactions.length} transaction(s) deleted successfully!`);
    } catch (err) {
      showError(err.message || 'Failed to delete some transactions');
    }
  };

  const handleSort = (field) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (field) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown size={16} className="text-gray-400" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={16} className="text-blue-600" />
      : <ArrowDown size={16} className="text-blue-600" />;
  };

  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = !searchTerm || 
      transaction.id?.toString().includes(searchTerm) ||
      transaction.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.transaction_items?.some(item => 
        item.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus = !statusFilter || 
      transaction.status?.toLowerCase() === statusFilter.toLowerCase();

    const matchesDate = !dateFilter || (() => {
      const transactionDate = new Date(transaction.createdAt);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          return transactionDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return transactionDate >= weekAgo;
        case 'month':
          return transactionDate.getMonth() === now.getMonth() && 
                 transactionDate.getFullYear() === now.getFullYear();
        case 'year':
          return transactionDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Sort filtered transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let aValue = a[sortConfig.field];
    let bValue = b[sortConfig.field];

    // Handle date fields
    if (sortConfig.field === 'createdAt') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    // Handle numeric fields
    if (sortConfig.field === 'totalAmount') {
      aValue = parseFloat(aValue) || 0;
      bValue = parseFloat(bValue) || 0;
    }

    // Handle string fields
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Get paginated transactions
  const paginatedTransactions = sortedTransactions.slice(startIndex, endIndex);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><Loader /></div>;
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      {/* Breadcrumb */}
      <Breadcrumb />
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <Receipt size={36} className="sm:w-12 sm:h-12 text-[#0B7582] mr-3 sm:mr-4" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">My Trips</h1>
          </div>
          <p className="text-base sm:text-lg text-gray-600">
            Track your travel bookings and transaction history
          </p>
        </div>

        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

        {/* Filters and Sorting */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
            <div className="flex items-center space-x-2">
              <Filter size={18} className="sm:w-5 sm:h-5 text-gray-500" />
              <span className="text-sm sm:text-base font-medium text-gray-700">Filter & Sort:</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Search */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 sm:w-4 sm:h-4" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:border-transparent text-sm sm:text-base"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:border-transparent text-sm sm:text-base"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {/* Date Filter */}
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:border-transparent text-sm sm:text-base"
              >
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>

              {/* Sort Options */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort:</span>
                <button
                  onClick={() => handleSort('id')}
                  className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  title="Sort by ID"
                >
                  <span>ID</span>
                  {getSortIcon('id')}
                </button>
                <button
                  onClick={() => handleSort('createdAt')}
                  className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  title="Sort by date"
                >
                  <span>Date</span>
                  {getSortIcon('createdAt')}
                </button>
                <button
                  onClick={() => handleSort('totalAmount')}
                  className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  title="Sort by amount"
                >
                  <span>Amount</span>
                  {getSortIcon('totalAmount')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
          <div className="flex items-center space-x-2 text-gray-600 mb-2 sm:mb-0">
            <Receipt size={16} className="sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">{filteredTransactions.length} transactions found</span>
          </div>
          {totalPages > 1 && (
            <div className="text-xs sm:text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
          )}
        </div>

        {/* Transactions */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Receipt size={64} className="sm:w-20 sm:h-20 text-gray-400 mx-auto mb-4 sm:mb-6" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No transactions found</h3>
            <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8">
              {searchTerm || statusFilter || dateFilter 
                ? 'Try adjusting your filters to find more transactions.'
                : 'Start exploring our activities to create your first booking.'
              }
            </p>
            {!searchTerm && !statusFilter && !dateFilter && (
              <Link
                to="/activities"
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-[#0B7582] text-white font-semibold rounded-lg shadow-md hover:bg-[#095e68] transition-colors text-sm sm:text-base"
              >
                Browse Activities
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-4 sm:space-y-6">
              {paginatedTransactions.map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 sm:mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionPage;