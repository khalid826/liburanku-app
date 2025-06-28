// src/pages/User/CartPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartItem from '../../components/Checkout/CartItem';
import CartSummary from '../../components/Checkout/CartSummary';
import Breadcrumb from '../../components/Common/Breadcrumb';
import { ShoppingCart, ArrowRight } from 'lucide-react';

const CartPage = () => {
  const { 
    cartItems, 
    removeFromCart, 
    selectedItems, 
    toggleSelectAll, 
    selectItem 
  } = useCart();

  const allSelected = cartItems.length > 0 && selectedItems.length === cartItems.length;

  const handleSelectAll = (e) => {
    toggleSelectAll(e.target.checked);
  };

  const handleSelectItem = (id) => {
    selectItem(id);
  };

  const handleDeleteSelected = async () => {
    for (const id of selectedItems) {
      await removeFromCart(id);
    }
    window.location.reload();
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      {/* Breadcrumb */}
      <Breadcrumb />
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <ShoppingCart size={36} className="sm:w-12 sm:h-12 text-[#0B7582] mr-3 sm:mr-4" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
          <p className="text-base sm:text-lg text-gray-600">
            Review your selected activities before checkout
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <ShoppingCart size={64} className="sm:w-20 sm:h-20 text-gray-400 mx-auto mb-4 sm:mb-6" />
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-600 mb-3 sm:mb-4">Your cart is empty</h2>
            <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8">
              Start exploring our amazing activities and add them to your cart
            </p>
            <Link
              to="/activities"
              className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-[#0B7582] text-white font-semibold rounded-lg shadow-md hover:bg-[#095e68] transition-colors text-sm sm:text-base"
            >
              Browse Activities
              <ArrowRight size={18} className="sm:w-5 sm:h-5 ml-2" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="xl:col-span-3">
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                {/* Cart Items Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Cart Items ({cartItems.length})
                  </h2>
                  {cartItems.length > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={handleSelectAll}
                          className="form-checkbox h-4 w-4 text-[#0B7582]"
                        />
                        <span className="text-sm font-medium">Select All</span>
                      </div>
                      <button
                        onClick={handleDeleteSelected}
                        disabled={selectedItems.length === 0}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                      >
                        Delete Selected ({selectedItems.length})
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Cart Items List */}
                <div className="space-y-4 sm:space-y-6">
                  {cartItems.map((item) => (
                    <CartItem 
                      key={item.id} 
                      item={item} 
                      isSelected={selectedItems.includes(item.id)}
                      onSelect={() => handleSelectItem(item.id)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="xl:col-span-2">
              <div className="sticky top-4">
                <CartSummary selectedItems={selectedItems} />
                {cartItems.length > 0 && (
                  <Link
                    to="/checkout"
                    className={`block w-full mt-6 px-6 py-3 rounded-lg font-semibold text-center transition-colors text-base ${
                      selectedItems.length > 0 
                        ? 'bg-[#0B7582] text-white hover:bg-[#095e68]' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    onClick={(e) => {
                      if (selectedItems.length === 0) {
                        e.preventDefault();
                      }
                    }}
                  >
                    {selectedItems.length > 0 ? 'Proceed to Checkout' : 'Select items to checkout'}
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;