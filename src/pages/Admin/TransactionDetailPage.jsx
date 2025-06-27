import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Clock, Eye, Download, Copy, AlertCircle } from 'lucide-react';
import AdminLayout from '../../components/Layout/AdminLayout';
import Button from '../../components/UI/Button';
import Loader from '../../components/UI/Loader';
import ErrorMessage from '../../components/UI/ErrorMessage';
import Modal from '../../components/UI/Modal';
import { transactionService } from '../../api';
import PriceDisplay from '../../components/Common/PriceDisplay';
import { DEFAULT_CURRENCY } from '../../utils/constants';

const AdminTransactionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  const fetchTransaction = async () => {
    try {
      setLoading(true);
      const response = await transactionService.getTransactionById(id);
      console.log('Transaction data:', response);
      // Extract the actual transaction data from the nested structure
      const transactionData = response.data || response;
      setTransaction(transactionData);
    } catch (err) {
      console.error('Error fetching transaction:', err);
      setError('Failed to fetch transaction details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = (status) => {
    setNewStatus(status);
    setShowStatusModal(true);
  };

  const confirmStatusUpdate = async () => {
    if (!newStatus) return;

    try {
      setUpdating(true);
      await transactionService.updateTransactionStatus(id, newStatus);
      setTransaction(prev => ({ ...prev, status: newStatus }));
      setShowStatusModal(false);
      setNewStatus('');
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update transaction status');
    } finally {
      setUpdating(false);
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
      case 'canceled':
        return <XCircle size={20} className="text-gray-500" />;
      default:
        return <Clock size={20} className="text-gray-500" />;
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const downloadReceipt = () => {
    // Generate and download receipt logic
    const receiptContent = `
Transaction Receipt
==================
Transaction ID: ${transaction?.id || 'N/A'}
Invoice ID: ${transaction?.invoiceId || 'N/A'}
Date: ${transaction?.createdAt ? new Date(transaction.createdAt).toLocaleString() : 'N/A'}
Customer: ${transaction?.user?.name || 'N/A'}
Email: ${transaction?.user?.email || 'N/A'}
Amount: ${transaction?.totalAmount ? `${DEFAULT_CURRENCY} ${transaction.totalAmount.toLocaleString()}` : 'N/A'}
Status: ${transaction?.status || 'N/A'}
Payment Method: ${transaction?.payment_method?.name || 'N/A'}

Items:
${transaction?.transaction_items?.map(item => 
  `- ${item.activity?.title || 'Unknown Activity'}: ${DEFAULT_CURRENCY} ${item.price?.toLocaleString() || 'N/A'}`
).join('\n') || 'No items'}
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transaction-${transaction?.id || 'receipt'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <AdminLayout title="Transaction Detail">
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader />
        </div>
      </AdminLayout>
    );
  }

  if (error || !transaction) {
    return (
      <AdminLayout title="Transaction Detail">
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Transaction Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The transaction you are looking for does not exist.'}</p>
          <Button onClick={() => navigate('/admin/transactions')} variant="primary">
            Back to Transactions
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Transaction Detail">
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate('/admin/transactions')}
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Transactions
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transaction #{transaction.id?.slice(-8) || 'N/A'}</h1>
            <p className="text-gray-600">Transaction Details</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={downloadReceipt}
            variant="success"
            size="sm"
            className="flex items-center"
          >
            <Download size={16} className="mr-2" />
            Download Receipt
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Transaction Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Transaction Status Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Status</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(transaction.status)}
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(transaction.status)}`}>
                  {transaction.status || 'Unknown'}
                </span>
              </div>
              <div className="flex space-x-2">
                {transaction.status?.toLowerCase() === 'pending' && (
                  <>
                    <Button
                      onClick={() => handleStatusUpdate('success')}
                      variant="success"
                      size="sm"
                      className="flex items-center"
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Accept Payment
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate('failed')}
                      variant="danger"
                      size="sm"
                      className="flex items-center"
                    >
                      <XCircle size={16} className="mr-2" />
                      Reject Payment
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Transaction Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Items</h3>
            <div className="space-y-4">
              {transaction.transaction_items?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.activity?.imageUrl || '/placeholder-activity.jpg'}
                      alt={item.activity?.title || 'Activity'}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{item.activity?.title || 'Unknown Activity'}</h4>
                      <p className="text-sm text-gray-600">{item.activity?.category?.name || 'No Category'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <PriceDisplay amount={item.price} currency={DEFAULT_CURRENCY} />
                    <p className="text-sm text-gray-600">Qty: {item.quantity || 1}</p>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-gray-500">
                  No items found in this transaction
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <p className="text-gray-900">{transaction.user?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900">{transaction.user?.email || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="text-gray-900">{transaction.user?.phone || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Transaction ID</label>
                <div className="flex items-center space-x-2">
                  <p className="text-gray-900 font-mono">{transaction.id || 'N/A'}</p>
                  <Button
                    onClick={() => copyToClipboard(transaction.id)}
                    variant="outline"
                    size="sm"
                    className="p-1"
                  >
                    <Copy size={14} />
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Invoice ID</label>
                <p className="text-gray-900">{transaction.invoiceId || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Payment Method</label>
                <p className="text-gray-900">{transaction.payment_method?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Total Amount</label>
                <p className="text-xl font-bold text-gray-900">
                  <PriceDisplay amount={transaction.totalAmount} currency={DEFAULT_CURRENCY} />
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Date</label>
                <p className="text-gray-900">
                  {transaction.createdAt ? new Date(transaction.createdAt).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Proof */}
          {transaction.proofPaymentUrl && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Proof</h3>
              <div className="space-y-3">
                <img
                  src={transaction.proofPaymentUrl}
                  alt="Payment Proof"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                />
                <Button
                  onClick={() => window.open(transaction.proofPaymentUrl, '_blank')}
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center justify-center"
                >
                  <Eye size={16} className="mr-2" />
                  View Full Size
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title={`Update Transaction Status to ${newStatus}`}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to update the transaction status to <strong>{newStatus}</strong>?
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              onClick={() => setShowStatusModal(false)}
              variant="outline"
              disabled={updating}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmStatusUpdate}
              variant={newStatus === 'success' ? 'success' : 'danger'}
              disabled={updating}
            >
              {updating ? 'Updating...' : 'Confirm Update'}
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default AdminTransactionDetailPage; 