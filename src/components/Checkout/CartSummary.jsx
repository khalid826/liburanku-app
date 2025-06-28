import React from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import PriceDisplay from '../Common/PriceDisplay';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { calculateCartItemPrices, calculateCartTotalPrices } from '../../utils/helpers';
import { DEFAULT_CURRENCY } from '../../utils/constants';

const CartSummary = ({ selectedItems = [] }) => {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  // Get items to display - either selected items or empty array if none selected
  const displayItems = selectedItems.length > 0 
    ? cartItems.filter(item => selectedItems.includes(item.id))
    : [];

  // Calculate total prices using the utility function
  const { displayPrice: totalPrice, originalPrice: totalOriginalPrice } = calculateCartTotalPrices(displayItems);

  // Show empty state when no items are selected or cart is empty
  if (displayItems.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>
        <div className="text-center py-8">
          <ShoppingCart size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">
            {selectedItems.length > 0 ? 'No items selected' : 'Your cart is empty'}
          </p>
          <div className="text-lg font-bold text-gray-900 mb-4">
            Total: Rp 0
          </div>
          <button
            onClick={() => navigate('/activities')}
            className="inline-flex items-center px-4 py-2 bg-[#0B7582] text-white rounded-lg hover:bg-[#095e68] transition-colors text-sm"
          >
            Browse Activities
            <ArrowRight size={16} className="ml-2" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
        Order Summary
        {selectedItems.length > 0 && (
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({selectedItems.length} of {cartItems.length} items)
          </span>
        )}
      </h2>
      
      {/* Cart Items */}
      <div className="space-y-3 mb-4 sm:mb-6">
        {displayItems.map((item) => {
          const activity = item.activity;
          if (!activity) return null;

          const { displayPrice, originalPrice } = calculateCartItemPrices(item);

          return (
            <div key={item.id} className="flex items-start space-x-3">
              <img
                src={activity.imageUrls?.[0] || 'https://placehold.co/60x60/EBF4FF/76A9FA?text=No+Image'}
                alt={activity.title}
                className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/60x60/EBF4FF/76A9FA?text=No+Image';
                }}
              />
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="font-medium text-gray-900 text-sm truncate">{activity.title}</h3>
                <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
              </div>
              <div className="text-right flex-shrink-0 min-w-[120px] sm:min-w-[140px] lg:min-w-[160px]">
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
      </div>

      {/* Price Breakdown */}
      <div className="border-t pt-4 space-y-2 mb-4 sm:mb-6">
        {totalOriginalPrice && (
          <div className="flex justify-between items-center text-gray-600">
            <span className="text-sm">Original Subtotal</span>
            <div className="text-right">
              <PriceDisplay amount={totalOriginalPrice} />
            </div>
          </div>
        )}
        <div className="flex justify-between items-center text-gray-600">
          <span className="text-sm">Subtotal</span>
          <div className="text-right">
            <PriceDisplay amount={totalPrice} />
          </div>
        </div>
        
        <div className="flex justify-between items-center text-gray-600">
          <span className="text-sm">Shipping</span>
          <span className="text-green-500 text-sm font-medium">FREE</span>
        </div>
      </div>

      {/* Total */}
      <div className="border-t pt-4 mb-4 sm:mb-6">
        <div className="flex justify-between items-center text-lg font-bold text-gray-900">
          <span>Total</span>
          <div className="text-right">
            <PriceDisplay amount={totalPrice} size="lg" />
          </div>
        </div>
        {totalOriginalPrice && (
          <div className="text-center mt-3">
            <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
              You save {((totalOriginalPrice - totalPrice) / totalOriginalPrice * 100).toFixed(0)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSummary;
