// src/hooks/usePagination.js
import { useState, useMemo } from 'react';

/**
 * Custom hook for managing pagination logic.
 *
 * @param {number} totalItems - The total number of items to paginate.
 * @param {number} itemsPerPage - The number of items to display per page.
 * @returns {object} An object containing pagination state and functions.
 * @returns {number} return.currentPage - The current active page (1-indexed).
 * @returns {number} return.totalPages - The total number of pages.
 * @returns {Array<any>} return.currentItems - The slice of items for the current page.
 * @returns {function} return.goToPage - Function to change the current page.
 * @returns {function} return.nextPage - Function to go to the next page.
 * @returns {function} return.prevPage - Function to go to the previous page.
 */
function usePagination(totalItems, itemsPerPage) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => {
    if (totalItems === 0 || itemsPerPage === 0) return 1;
    return Math.ceil(totalItems / itemsPerPage);
  }, [totalItems, itemsPerPage]);

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    // Note: This hook provides the *logic* for slicing.
    // The actual data slicing should be done by the component using this hook,
    // as this hook doesn't have access to the actual 'items' array.
    // It returns startIndex and endIndex for the consumer to use.
    return { startIndex, endIndex };
  }, [currentPage, itemsPerPage, totalItems]);

  const goToPage = (page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    goToPage(currentPage + 1);
  };

  const prevPage = () => {
    goToPage(currentPage - 1);
  };

  return {
    currentPage,
    totalPages,
    // currentItems, // Leaving this commented as it's better for consumer to slice data
    startIndex: currentItems.startIndex,
    endIndex: currentItems.endIndex,
    goToPage,
    nextPage,
    prevPage,
    setCurrentPage, // Expose setter for external control if needed
  };
}

export default usePagination;