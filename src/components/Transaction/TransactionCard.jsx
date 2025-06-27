import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import PriceDisplay from '../Common/PriceDisplay';
import TransactionStatus from './TransactionStatus';
import { Eye, Calendar, MapPin, Users } from 'lucide-react';
import { DEFAULT_CURRENCY } from '../../utils/constants';

const TransactionCard = ({ transaction }) => {
  const { removeFromCart } = useCart();

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get transaction ID (handle different possible field names)
  const transactionId = transaction.id || transaction._id || transaction.transactionId;
  
  // Get payment method name
  const paymentMethod = transaction.payment_method || transaction.paymentMethod || transaction.paymentMethodId;
  const paymentMethodName = typeof paymentMethod === 'object' ? paymentMethod.name : paymentMethod;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              Transaction #{transactionId?.slice(-8) || 'N/A'}
            </h3>
            <TransactionStatus status={transaction.status} />
          </div>
          <Link
            to={`/transaction/${transactionId}`}
            className="flex items-center text-[#0B7582] hover:text-[#095e68] text-sm font-medium"
          >
            <Eye size={16} className="mr-1" />
            View Details
          </Link>
        </div>

        {/* Transaction Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar size={14} className="text-gray-500" />
            <span className="text-gray-600">{formatDate(transaction.createdAt)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin size={14} className="text-gray-500" />
            <span className="text-gray-600">{paymentMethodName || 'N/A'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users size={14} className="text-gray-500" />
            <span className="text-gray-600">
              {transaction.transaction_items?.length || 0} items
            </span>
          </div>
        </div>
      </div>

      {/* Transaction Items */}
      {transaction.transaction_items && transaction.transaction_items.length > 0 && (
        <div className="p-4 sm:p-6">
          <h4 className="font-medium text-gray-900 mb-3">Items:</h4>
          <div className="space-y-3">
            {transaction.transaction_items.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <img 
                  src={item.imageUrls?.[0] || 'https://placehold.co/40x40/EBF4FF/76A9FA?text=No+Image'} 
                  alt={item.title} 
                  className="w-10 h-10 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/40x40/EBF4FF/76A9FA?text=No+Image';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {item.title || 'Unknown Activity'}
                  </p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    <PriceDisplay amount={(item.price_discount || item.price || 0) * item.quantity} />
                  </p>
                </div>
              </div>
            ))}
            {transaction.transaction_items.length > 3 && (
              <div className="text-center pt-2">
                <span className="text-sm text-gray-500">
                  +{transaction.transaction_items.length - 3} more items
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-lg sm:text-xl font-bold text-gray-900">
              <PriceDisplay amount={transaction.totalAmount || 0} size="lg" />
            </p>
          </div>
          <div className="flex space-x-2">
            {transaction.status?.toLowerCase() === 'pending' && (
              <Link
                to={`/transaction/${transactionId}`}
                className="px-3 py-2 bg-[#EF7B24] text-white text-sm rounded-lg hover:bg-[#d66a1a] transition-colors"
              >
                Upload Payment
              </Link>
            )}
            <Link
              to={`/transaction/${transactionId}`}
              className="px-3 py-2 bg-[#0B7582] text-white text-sm rounded-lg hover:bg-[#095e68] transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
