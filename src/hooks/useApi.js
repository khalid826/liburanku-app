// src/hooks/useApi.js
import { useState, useCallback } from 'react';

/**
 * Custom hook for making API calls and managing their loading, error, and data states.
 * Ideal for fetching data, but can be adapted for mutations too.
 *
 * @param {function} apiFunction - The asynchronous function from your API service (e.g., `userService.getLoggedUser`).
 * @param {Array<any>} [initialArgs=[]] - Initial arguments to pass to the API function if it's called immediately.
 * @param {boolean} [callImmediately=false] - If true, the API function is called on component mount.
 * @returns {object} An object containing API call state and a trigger function.
 * @returns {any | null} return.data - The data returned from the API call.
 * @returns {boolean} return.loading - True if the API call is in progress.
 * @returns {string | null} return.error - Any error message from the API call.
 * @returns {function} return.execute - A function to manually trigger the API call. Takes optional arguments that override initialArgs.
 * @returns {function} return.setData - Function to manually set the data state.
 * @returns {function} return.setError - Function to manually set the error state.
 */
function useApi(apiFunction, initialArgs = [], callImmediately = false) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      // Use provided args, or initialArgs if no new args are given
      const params = args.length > 0 ? args : initialArgs;
      const result = await apiFunction(...params);
      setData(result);
      return { success: true, data: result }; // Return result for caller if needed
    } catch (err) {
      console.error('useApi error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred.';
      setError(errorMessage);
      return { success: false, error: errorMessage }; // Return error for caller
    } finally {
      setLoading(false);
    }
  }, [apiFunction, initialArgs]); // Re-create execute if apiFunction or initialArgs change

  // Optional: Call API immediately on component mount
  useEffect(() => {
    if (callImmediately) {
      execute();
    }
  }, [execute, callImmediately]); // Re-run effect if execute or callImmediately changes

  return { data, loading, error, execute, setData, setError };
}

export default useApi;