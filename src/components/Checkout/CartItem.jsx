import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import PriceDisplay from '../Common/PriceDisplay';
import { Trash2, Plus, Minus, AlertTriangle } from 'lucide-react';
import { DEFAULT_CURRENCY } from '../../utils/constants';
import { calculateCartItemPrices } from '../../utils/helpers';

const CartItem = ({ item, isSelected = false, onSelect }) => {
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

  const { displayPrice, originalPrice } = calculateCartItemPrices(item);

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
      {/* Mobile Layout */}
      <div className="block sm:hidden">
        {/* Top Row: Checkbox, Image, Category, Location */}
        <div className="flex items-start gap-3 mb-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="form-checkbox h-4 w-4 text-[#0B7582] mt-1 flex-shrink-0"
          />
          <Link to={`/activity/${activity.id}`} className="flex-shrink-0">
            <img
              src={activity.imageUrls && activity.imageUrls.length > 0 
                ? activity.imageUrls[0] 
                : 'https://placehold.co/80x80/EBF4FF/76A9FA?text=No+Image'
              }
              alt={activity.title}
              className="w-16 h-16 object-cover rounded-lg border border-gray-100 shadow-sm"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/80x80/EBF4FF/76A9FA?text=No+Image';
              }}
            />
          </Link>
          <div className="flex-1 min-w-0">
            <Link 
              to={`/activity/${activity.id}`} 
              className="block hover:text-[#0B7582] transition-colors"
            >
              <h3 className="font-semibold text-gray-900 text-sm truncate mb-1">
                {activity.title}
              </h3>
            </Link>
            <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500">
              <span className="bg-gray-100 px-2 py-0.5 rounded-full">
                {activity.category?.name || 'Uncategorized'}
              </span>
              <span className="bg-blue-100 px-2 py-0.5 rounded-full">
                {activity.location || activity.city || 'Location not specified'}
              </span>
            </div>
          </div>
        </div>

        {/* Middle Row: Quantity Controls */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
            <button 
              onClick={() => handleQuantityChange(item.quantity - 1)} 
              disabled={item.quantity <= 1}
              className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus size={14} className="text-gray-600" />
            </button>
            <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
            <button 
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              <Plus size={14} className="text-gray-600" />
            </button>
          </div>
          <button 
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
            title="Remove from cart"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Bottom Row: Price */}
        <div className="border-t pt-3">
          <div className="flex justify-end">
            <PriceDisplay
              amount={displayPrice}
              originalAmount={originalPrice}
              currency={DEFAULT_CURRENCY}
              size="md"
              showDiscount={true}
            />
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex flex-row items-stretch gap-4">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="form-checkbox h-4 w-4 text-[#0B7582] mt-4 flex-shrink-0"
        />
        {/* Activity Image */}
        <Link to={`/activity/${activity.id}`} className="flex-shrink-0">
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
              <PriceDisplay
                amount={displayPrice}
                originalAmount={originalPrice}
                currency={DEFAULT_CURRENCY}
                size="md"
                showDiscount={true}
              />
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
