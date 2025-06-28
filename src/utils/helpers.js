// src/utils/helpers.js

/**
 * General utility functions for various common tasks.
 */

/**
 * Checks if an object is empty (has no own enumerable properties).
 * @param {object} obj - The object to check.
 * @returns {boolean} True if the object is empty, false otherwise.
 */
export const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

/**
 * Debounces a function, delaying its execution until after a specified delay.
 * @param {function} func - The function to debounce.
 * @param {number} delay - The debounce delay in milliseconds.
 * @returns {function} The debounced function.
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

/**
 * Clones an object deeply.
 * @param {object} obj - The object to clone.
 * @returns {object} A deep copy of the object.
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Generates a unique ID (e.g., for list keys).
 * Note: For robust unique IDs across sessions/multiple users, consider UUIDs.
 * @returns {string} A simple unique ID.
 */
export const generateUniqueId = () => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Removes duplicate objects from an array based on a specified key.
 * @param {Array<Object>} arr - The array to process.
 * @param {string} key - The key to use for identifying duplicates.
 * @returns {Array<Object>} The array with duplicates removed.
 */
export const removeDuplicatesByKey = (arr, key) => {
  return Array.from(new Map(arr.map(item => [item[key], item])).values());
};

/**
 * Scrolls to the top of the window or a specified element.
 * @param {HTMLElement | null} [element=null] - The element to scroll to. If null, scrolls window to top.
 */
export const scrollToTop = (element = null) => {
  if (element) {
    element.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

/**
 * Calculate the display price and original price for an activity
 * @param {Object} activity - The activity object
 * @returns {Object} - Object containing displayPrice and originalPrice
 */
export const calculateActivityPrices = (activity) => {
  if (!activity) {
    return { displayPrice: 0, originalPrice: null };
  }

  const hasDiscount = activity.price_discount && 
                     activity.price_discount < activity.price && 
                     activity.price_discount > 0;

  return {
    displayPrice: hasDiscount ? activity.price_discount : activity.price,
    originalPrice: hasDiscount ? activity.price : null
  };
};

/**
 * Calculate the total price for a cart item (price * quantity)
 * @param {Object} item - The cart item object
 * @returns {Object} - Object containing displayPrice and originalPrice for the total
 */
export const calculateCartItemPrices = (item) => {
  if (!item || !item.activity) {
    return { displayPrice: 0, originalPrice: null };
  }

  const { displayPrice, originalPrice } = calculateActivityPrices(item.activity);
  const quantity = item.quantity || 1;

  return {
    displayPrice: displayPrice * quantity,
    originalPrice: originalPrice ? originalPrice * quantity : null
  };
};

/**
 * Calculate the total price for multiple cart items
 * @param {Array} items - Array of cart items
 * @returns {Object} - Object containing displayPrice and originalPrice for the total
 */
export const calculateCartTotalPrices = (items) => {
  if (!items || items.length === 0) {
    return { displayPrice: 0, originalPrice: null };
  }

  let totalDisplayPrice = 0;
  let totalOriginalPrice = 0;
  let hasOriginalPrice = false;

  items.forEach(item => {
    const { displayPrice, originalPrice } = calculateCartItemPrices(item);
    totalDisplayPrice += displayPrice;
    if (originalPrice) {
      totalOriginalPrice += originalPrice;
      hasOriginalPrice = true;
    }
  });

  return {
    displayPrice: totalDisplayPrice,
    originalPrice: hasOriginalPrice ? totalOriginalPrice : null
  };
};