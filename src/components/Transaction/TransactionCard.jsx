import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import PriceDisplay from '../Common/PriceDisplay';
import TransactionStatus from './TransactionStatus';
import { Eye, Calendar, MapPin, Users } from 'lucide-react';
import { DEFAULT_CURRENCY } from '../../utils/constants';
import { calculateCartItemPrices } from '../../utils/helpers';

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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#0B7582] rounded-lg flex items-center justify-center">
              <Calendar size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                Transaction #{transactionId}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                {formatDate(transaction.createdAt)}
              </p>
            </div>
          </div>
          <TransactionStatus status={transaction.status} />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium">Total:</span>
            <PriceDisplay 
              amount={transaction.totalAmount || 0} 
              className="ml-2"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {paymentMethodName || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Transaction Items */}
      {transaction.transaction_items && transaction.transaction_items.length > 0 && (
        <div className="p-4 sm:p-6">
          <h4 className="font-medium text-gray-900 mb-3">Items:</h4>
          <div className="space-y-3">
            {transaction.transaction_items.slice(0, 3).map((item, index) => {
              // Create a mock cart item structure for the utility function
              const mockCartItem = {
                activity: item,
                quantity: item.quantity || 1
              };
              const { displayPrice, originalPrice } = calculateCartItemPrices(mockCartItem);
              
              return (
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
                    <PriceDisplay
                      amount={displayPrice}
                      originalAmount={originalPrice}
                      currency={DEFAULT_CURRENCY}
                      size="sm"
                      showDiscount={true}
                    />
                  </div>
                </div>
              );
            })}
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
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin size={16} />
            <span>{transaction.transaction_items?.length || 0} items</span>
          </div>
          <Link
            to={`/transaction/${transactionId}`}
            className="inline-flex items-center px-3 py-2 bg-[#0B7582] text-white text-sm rounded-lg hover:bg-[#095e68] transition-colors"
          >
            <Eye size={16} className="mr-1" />
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
