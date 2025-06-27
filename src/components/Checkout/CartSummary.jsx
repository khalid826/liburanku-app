import React from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import PriceDisplay from '../Common/PriceDisplay';
import { ShoppingCart, ArrowRight } from 'lucide-react';

const CartSummary = ({ selectedItems = [] }) => {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  // Get items to display - either selected items or all items
  const displayItems = selectedItems.length > 0 
    ? cartItems.filter(item => selectedItems.includes(item.id))
    : cartItems;

  // Simple calculation of total price for display items
  const totalPrice = displayItems.reduce((total, item) => {
    if (!item.activity) return total;
    const price = item.activity.price_discount < item.activity.price 
      ? item.activity.price_discount 
      : item.activity.price;
    return total + (price * item.quantity);
  }, 0);

  if (displayItems.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>
        <div className="text-center py-8">
          <ShoppingCart size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">
            {selectedItems.length > 0 ? 'No items selected' : 'Your cart is empty'}
          </p>
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

          const displayPrice = activity.price_discount < activity.price 
            ? activity.price_discount 
            : activity.price;

          return (
            <div key={item.id} className="flex items-center space-x-3">
              <img
                src={activity.imageUrls?.[0] || 'https://placehold.co/60x60/EBF4FF/76A9FA?text=No+Image'}
                alt={activity.title}
                className="w-12 h-12 object-cover rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/60x60/EBF4FF/76A9FA?text=No+Image';
                }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 text-sm truncate">{activity.title}</h3>
                <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 text-sm">
                  <PriceDisplay amount={displayPrice * item.quantity} />
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Price Breakdown */}
      <div className="border-t pt-4 space-y-2 mb-4 sm:mb-6">
        <div className="flex justify-between text-gray-600">
          <span className="text-sm">Subtotal</span>
          <PriceDisplay amount={totalPrice} />
        </div>
        
        <div className="flex justify-between text-gray-600">
          <span className="text-sm">Shipping</span>
          <span className="text-green-500 text-sm">FREE</span>
        </div>
      </div>

      {/* Total */}
      <div className="border-t pt-4 mb-4 sm:mb-6">
        <div className="flex justify-between text-lg font-bold text-gray-900">
          <span>Total</span>
          <PriceDisplay amount={totalPrice} size="lg" />
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
