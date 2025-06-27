// src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a value.
 * Useful for delaying expensive operations like API calls triggered by user input (e.g., search).
 *
 * @param {any} value - The value to debounce.
 * @param {number} delay - The delay in milliseconds before the debounced value is updated.
 * @returns {any} The debounced value.
 */
function useDebounce(value, delay) {
  // State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if the value changes or the component unmounts
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-run the effect if value or delay changes

  return debouncedValue;
}

export default useDebounce;