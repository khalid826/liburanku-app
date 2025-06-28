import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { transactionService } from '../../api';
import Loader from '../../components/UI/Loader';
import ErrorMessage from '../../components/UI/ErrorMessage';
import { ArrowLeft, Receipt, Clock, CheckCircle, XCircle, AlertCircle, Upload, Eye, Trash2 } from 'lucide-react';
import { DEFAULT_CURRENCY } from '../../utils/constants';
import { uploadImage } from '../../api/uploadService';
import { calculateCartItemPrices } from '../../utils/helpers';
import PriceDisplay from '../../components/Common/PriceDisplay';
import Breadcrumb from '../../components/Common/Breadcrumb';

const TransactionDetailPage = () => {
  const { id: transactionId } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [proofPaymentUrl, setProofPaymentUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(null);

  useEffect(() => {
    console.log('TransactionDetailPage - transactionId from params:', transactionId);
    console.log('TransactionDetailPage - transactionId type:', typeof transactionId);
    console.log('TransactionDetailPage - transactionId === "undefined":', transactionId === 'undefined');
    
    if (transactionId && transactionId !== 'undefined' && transactionId !== 'null') {
      fetchTransaction();
    } else {
      console.error('Invalid transaction ID received:', transactionId);
      setError('Invalid transaction ID');
      setLoading(false);
    }
  }, [transactionId]);

  const fetchTransaction = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching transaction with ID:', transactionId);
      const response = await transactionService.getTransactionById(transactionId);
      console.log('Transaction detail response:', response);
      console.log('Response structure:', {
        data: response?.data,
        direct: response,
        keys: response ? Object.keys(response) : 'no response'
      });
      
      if (response) {
        // Try different possible response structures
        const transactionData = response.data || response;
        console.log('Transaction data to set:', transactionData);
        setTransaction(transactionData);
      } else {
        throw new Error('Transaction not found');
      }
    } catch (err) {
      console.error('Error fetching transaction:', err);
      setError(err.message || 'Failed to fetch transaction details');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadProof = async () => {
    if (!proofPaymentUrl.trim()) {
      setError('Please enter a valid payment proof URL');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      await transactionService.updateTransactionProofPayment(transactionId, proofPaymentUrl);
      setSuccess('Payment proof uploaded successfully!');
      setProofPaymentUrl('');
      fetchTransaction(); // Refresh transaction data
    } catch (err) {
      setError(err.message || 'Failed to upload payment proof');
    } finally {
      setUploading(false);
    }
  };

  const handleCancelTransaction = async () => {
    if (!window.confirm('Are you sure you want to cancel this transaction? This action cannot be undone.')) {
      return;
    }

    try {
      setCancelling(true);
      setError(null);
      
      await transactionService.cancelTransaction(transactionId);
      
      // Update the transaction status locally
      setTransaction({ ...transaction, status: 'cancelled' });
      
      setSuccess('Transaction cancelled successfully!');
    } catch (err) {
      setError(err.message || 'Failed to cancel transaction');
    } finally {
      setCancelling(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    setUploadProgress(0);
    try {
      const response = await uploadImage(file);
      if (response && response.url) {
        setProofPaymentUrl(response.url);
        setUploadedImage(response.url);
        setSuccess('Image uploaded successfully!');
      } else {
        setError('Failed to upload image');
      }
    } catch (err) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'pending':
      case 'failed':
        return <CheckCircle size={24} className="text-[#EF7B24]" />;
      case 'cancelled':
        return <XCircle size={24} className="text-gray-500" />;
      default:
        return <AlertCircle size={24} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'failed':
      case 'pending':
        return 'text-[#EF7B24] bg-[#fff6ef]';
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

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><Loader /></div>;
  }

  if (error && !transaction) {
    return (
      <div className="container mx-auto py-8 px-4">
        <ErrorMessage message={error} onClose={() => setError(null)} />
        <button
          onClick={() => navigate('/transactions')}
          className="mt-4 px-4 py-2 bg-[#0B7582] text-white rounded-lg hover:bg-[#095e68]"
        >
          Back to Transactions
        </button>
      </div>
    );
  }

  if (!transaction) {
    return <div className="text-center py-10">Transaction not found.</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <Breadcrumb />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/transactions')}
              className="flex items-center text-[#0B7582] hover:text-[#095e68] mr-4"
            >
              <ArrowLeft size={20} className="mr-2" />
              <span className="hidden sm:inline">Back to Transactions</span>
              <span className="sm:hidden">Back</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
              <Receipt size={24} className="mr-3 text-[#0B7582] sm:w-8 sm:h-8" />
              <span className="hidden sm:inline">Transaction Details</span>
              <span className="sm:hidden">Details</span>
            </h1>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-3">
            {canCancelTransaction(transaction) && (
              <button
                onClick={handleCancelTransaction}
                disabled={cancelling}
                className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm sm:text-base"
              >
                {cancelling ? (
                  <Loader size={16} className="animate-spin mr-2" />
                ) : (
                  <Trash2 size={16} className="mr-2" />
                )}
                <span className="hidden sm:inline">Cancel Transaction</span>
                <span className="sm:hidden">Cancel</span>
              </button>
            )}
          </div>
        </div>

        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          {/* Transaction Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Transaction #{transaction.id?.slice(-8) || transaction._id?.slice(-8) || transaction.transactionId?.slice(-8) || 'N/A'}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">Created on {formatDate(transaction.createdAt || transaction.created_at || transaction.orderDate)}</p>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusIcon(transaction.status)}
              <span className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(transaction.status)}`}>
                {transaction.status || 'Unknown'}
              </span>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Transaction Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm sm:text-base">Total Amount:</span>
                  <p className="font-medium text-base sm:text-lg">
                    {transaction.totalAmount?.toLocaleString('id-ID', { 
                      style: 'currency', 
                      currency: DEFAULT_CURRENCY,
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }) || 'Rp 0'}
                  </p>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm sm:text-base">Payment Method:</span>
                  <span className="text-sm sm:text-base">{transaction.payment_method?.name || transaction.paymentMethod?.name || transaction.paymentMethodId || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm sm:text-base">Status:</span>
                  <span className="capitalize text-sm sm:text-base">{transaction.status || 'Unknown'}</span>
                </div>
                {transaction.promoCode && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm sm:text-base">Promo Code:</span>
                    <span className="text-green-600 text-sm sm:text-base">{transaction.promoCode}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Payment Information</h3>
              <div className="space-y-2">
                {transaction.proofPaymentUrl && (
                  <div>
                    <span className="text-gray-600 text-sm sm:text-base">Payment Proof:</span>
                    <a
                      href={transaction.proofPaymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:underline flex items-center text-sm sm:text-base"
                    >
                      <Eye size={16} className="mr-1" />
                      View Proof
                    </a>
                  </div>
                )}
                {!transaction.proofPaymentUrl && transaction.status?.toLowerCase() === 'pending' && (
                  <p className="text-yellow-600 text-sm">Payment proof not uploaded yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Transaction Items */}
          {transaction.transaction_items && transaction.transaction_items.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-700 mb-4">Items</h3>
              <div className="space-y-4">
                {transaction.transaction_items.map((item, index) => {
                  // Create a mock cart item structure for the utility function
                  const mockCartItem = {
                    activity: item,
                    quantity: item.quantity || 1
                  };
                  const { displayPrice, originalPrice } = calculateCartItemPrices(mockCartItem);
                  
                  return (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-4 bg-gray-50 rounded-lg">
                      <img 
                        src={item.imageUrls?.[0] || 'https://placehold.co/60x60/EBF4FF/76A9FA?text=No+Image'} 
                        alt={item.title} 
                        className="w-16 h-16 object-cover rounded self-start sm:self-auto"
                      />
                      <div className="flex-grow">
                        <h4 className="font-medium text-sm sm:text-base">{item.title || 'Unknown Activity'}</h4>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <PriceDisplay
                          amount={displayPrice}
                          originalAmount={originalPrice}
                          currency={DEFAULT_CURRENCY}
                          size="md"
                          showDiscount={true}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Upload Payment Proof Section */}
        {transaction.status?.toLowerCase() === 'pending' && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Upload size={20} className="mr-2 text-[#0B7582] sm:w-6 sm:h-6" />
              Upload Payment Proof
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="proofPaymentFile" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image (JPG, PNG, etc.)
                </label>
                <input
                  type="file"
                  id="proofPaymentFile"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {uploadedImage && (
                  <div className="mt-2">
                    <img src={uploadedImage} alt="Payment Proof Preview" className="h-32 rounded border" />
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="proofPaymentUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Or enter Payment Proof URL
                </label>
                <input
                  type="url"
                  id="proofPaymentUrl"
                  value={proofPaymentUrl}
                  onChange={(e) => setProofPaymentUrl(e.target.value)}
                  placeholder="Enter the URL of your payment proof (screenshot, receipt, etc.)"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>
              <button
                onClick={handleUploadProof}
                disabled={uploading || !proofPaymentUrl.trim()}
                className="px-4 py-2 bg-[#0B7582] text-white rounded-md hover:bg-[#095e68] disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {uploading ? <Loader size="sm" /> : 'Upload Proof'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionDetailPage;
