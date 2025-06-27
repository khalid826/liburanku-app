// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

/**
 * Custom hook to manage a piece of state that is synchronized with local storage.
 *
 * @param {string} key - The key under which the value will be stored in local storage.
 * @param {any} initialValue - The initial value to use if nothing is found in local storage.
 * @returns {[any, (value: any) => void]} A stateful value and a function to update it.
 */
function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error, return initialValue
      console.error(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  });

  // useEffect to update local storage when the state changes
  useEffect(() => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        typeof storedValue === 'function'
          ? storedValue(storedValue)
          : storedValue;
      // Save state
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(`Error writing localStorage key “${key}”:`, error);
    }
  }, [key, storedValue]); // Only re-run if key or storedValue changes

  return [storedValue, setStoredValue];
}

export default useLocalStorage;