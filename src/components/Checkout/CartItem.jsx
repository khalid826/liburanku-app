import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import PriceDisplay from '../Common/PriceDisplay';
import { Trash2, Plus, Minus, AlertTriangle } from 'lucide-react';
import { DEFAULT_CURRENCY } from '../../utils/constants';

const CartItem = ({ item }) => {
  const { updateCartItem, removeFromCart, fetchCart } = useCart();
  const activity = item.activity;

  if (!activity) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 border border-red-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle size={20} className="text-red-500" />
            <p className="text-red-600">Invalid cart item data. Activity details missing.</p>
          </div>
          <button 
            onClick={() => removeFromCart(item.id)} 
            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    );
  }

  const displayPrice = activity.price_discount < activity.price 
    ? activity.price_discount 
    : activity.price;

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity >= 1) {
      await updateCartItem(item.id, newQuantity);
    }
  };

  const handleRemove = async () => {
    await removeFromCart(item.id);
    window.location.reload();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        {/* Activity Image */}
        <Link to={`/activity/${activity.id}`} className="flex-shrink-0 mx-auto sm:mx-0">
          <img
            src={activity.imageUrls && activity.imageUrls.length > 0 
              ? activity.imageUrls[0] 
              : 'https://placehold.co/100x100/EBF4FF/76A9FA?text=No+Image'
            }
            alt={activity.title}
            className="w-20 h-20 object-cover rounded-lg border border-gray-100 shadow-sm"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/100x100/EBF4FF/76A9FA?text=No+Image';
            }}
          />
        </Link>
        {/* Activity Details, Quantity, Price, Remove */}
        <div className="flex-1 flex flex-col gap-2 justify-between min-w-0">
          <div className="flex flex-col gap-1 min-w-0">
            <Link 
              to={`/activity/${activity.id}`} 
              className="block hover:text-[#0B7582] transition-colors"
            >
              <h3 className="font-semibold text-gray-900 text-base truncate mb-0.5">
                {activity.title}
              </h3>
            </Link>
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <span>{activity.category?.name || 'Uncategorized'}</span>
              <span className="hidden sm:inline">|</span>
              <span>{activity.location || activity.city || 'Location not specified'}</span>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between gap-2 mt-2">
            {/* Quantity Controls */}
            <div className="flex items-center space-x-2 bg-gray-50 rounded px-2 py-1">
              <button 
                onClick={() => handleQuantityChange(item.quantity - 1)} 
                disabled={item.quantity <= 1}
                className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus size={16} className="text-gray-600" />
              </button>
              <span className="text-base font-medium w-8 text-center">{item.quantity}</span>
              <button 
                onClick={() => handleQuantityChange(item.quantity + 1)}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <Plus size={16} className="text-gray-600" />
              </button>
            </div>
            {/* Price */}
            <div className="text-right min-w-[80px]">
              <p className="text-base font-semibold text-gray-900">
                <PriceDisplay amount={displayPrice * item.quantity} />
              </p>
              {activity.price_discount < activity.price && (
                <p className="text-xs text-gray-400 line-through">
                  <PriceDisplay amount={activity.price * item.quantity} />
                </p>
              )}
            </div>
            {/* Remove Button */}
            <button 
              onClick={handleRemove}
              className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
              title="Remove from cart"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
