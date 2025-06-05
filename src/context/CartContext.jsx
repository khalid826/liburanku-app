import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { cartService } from '../api';
import { useAuth as useAuthCart } from './AuthContext'; // Aliased to avoid naming conflict

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token, user } = useAuthCart(); // Get token from AuthContext

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
      setError("Please log in to add items to your cart.");
      // Optionally navigate to login page
      // navigate('/login', { state: { from: window.location.pathname } });
      return false;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.addToCart(activityId);
      if (response && response.message === "Item added to cart successfully") {
        await fetchCart(); // Refresh cart after adding
        alert("Item added to cart!"); // Simple feedback
        return true;
      } else {
        throw new Error(response.message || "Failed to add item to cart");
      }
    } catch (err) {
      setError(err.message || 'Failed to add item to cart.');
      setLoading(false);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const clearCartLocally = () => { // For logout
    setCartItems([]);
  };

  const value = {
    cartItems,
    loading,
    error,
    fetchCart,
    addItemToCart,
    cartItemCount: cartItems.reduce((count, item) => count + (item.quantity || 0), 0), // Calculate total quantity
    clearCartLocally, // Expose function to clear cart on logout
    setError, // To clear errors
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

