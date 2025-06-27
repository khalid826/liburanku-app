import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { cartService } from '../api';
import { useAuth as useAuthCart } from './AuthContext'; // Aliased to avoid naming conflict
import { useNotification } from './NotificationContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const { token, user } = useAuthCart(); // Get token from AuthContext
  const { showSuccess, showError } = useNotification();

  const fetchCart = useCallback(async () => {
    if (!token || !user) { // Only fetch if user is logged in
      setCartItems([]); // Clear cart if not logged in
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.getCartItems();
      if (response && response.data) {
        setCartItems(response.data);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch cart items.');
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [token, user]); // Add user to dependencies

  useEffect(() => {
    fetchCart();
  }, [fetchCart]); // fetchCart is memoized with useCallback

  const addItemToCart = async (activityId) => {
    if (!token) {
      showError("Please log in to add items to your cart.");
      return false;
    }
    setLoading(true);
    try {
      const response = await cartService.addToCart(activityId);
      if (response && (response.success || response.status === 'success' || response.message?.toLowerCase().includes('added'))) {
        await fetchCart(); // Refresh cart after adding
        showSuccess("Item added to cart!");
        return true;
      } else {
        throw new Error(response.message || "Failed to add item to cart");
      }
    } catch (err) {
      showError(err.message || 'Failed to add item to cart.');
      setLoading(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (cartId, quantity) => {
    if (!token) {
      showError("Please log in to update your cart.");
      return false;
    }
    setLoading(true);
    try {
      const response = await cartService.updateCartItem(cartId, quantity);
      if (response && (response.success || response.status === 'success' || response.message?.toLowerCase().includes('updated'))) {
        await fetchCart(); // Refresh cart after updating
        showSuccess("Cart updated successfully!");
        return true;
      } else {
        throw new Error(response.message || "Failed to update cart item");
      }
    } catch (err) {
      showError(err.message || 'Failed to update cart item.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartId) => {
    if (!token) {
      showError("Please log in to remove items from your cart.");
      return false;
    }
    setLoading(true);
    try {
      const response = await cartService.deleteCartItem(cartId);
      if (response && (response.success || response.status === 'success' || response.message?.toLowerCase().includes('removed'))) {
        await fetchCart(); // Refresh cart after removing
        showSuccess("Item removed from cart.");
        return true;
      } else {
        throw new Error(response.message || "Failed to remove item from cart");
      }
    } catch (err) {
      showError(err.message || 'Failed to remove item from cart.');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const clearCartLocally = () => { // For logout
    setCartItems([]);
    setAppliedPromo(null);
    setPromoDiscount(0);
  };

  const clearCart = async () => {
    if (!token) {
      clearCartLocally();
      return;
    }
    
    try {
      // Clear all cart items by setting quantity to 0 or deleting them
      const clearPromises = cartItems.map(item => 
        cartService.updateCartItem(item.id, 0)
      );
      
      await Promise.all(clearPromises);
      clearCartLocally();
      showSuccess("Cart cleared successfully!");
    } catch (err) {
      console.error('Error clearing cart:', err);
      // Still clear locally even if API call fails
      clearCartLocally();
    }
  };

  // Calculate subtotal (before promo discount)
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.activity?.price_discount < item.activity?.price 
        ? item.activity?.price_discount 
        : item.activity?.price;
      return total + (price || 0) * (item.quantity || 0);
    }, 0);
  };

  // Calculate total (after promo discount)
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return Math.max(0, subtotal - promoDiscount);
  };

  // Apply promo code
  const applyPromoCode = (promoData) => {
    setAppliedPromo(promoData.promo);
    setPromoDiscount(promoData.discountAmount);
  };

  // Remove promo code
  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoDiscount(0);
  };

  const value = {
    cartItems,
    loading,
    error,
    fetchCart,
    addItemToCart,
    updateCartItem,
    removeFromCart,
    cartItemCount: cartItems.reduce((count, item) => count + (item.quantity || 0), 0), // Calculate total quantity
    clearCartLocally, // Expose function to clear cart on logout
    setError, // To clear errors
    // Promo code functionality
    appliedPromo,
    promoDiscount,
    applyPromoCode,
    removePromoCode,
    calculateSubtotal,
    calculateTotal,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

