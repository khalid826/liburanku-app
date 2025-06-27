// src/components/UI/Pagination.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Assuming Lucide React icons are available

/**
 * Reusable Pagination Component.
 * Displays page numbers and navigation buttons.
 *
 * @param {object} props - The component props.
 * @param {number} props.currentPage - The currently active page number (1-indexed).
 * @param {number} props.totalPages - The total number of pages available.
 * @param {function} props.onPageChange - Callback function (pageNumber) => void, called when a page is clicked.
 * @param {boolean} [props.showPageNumbers=true] - If false, only shows prev/next buttons.
 * @param {number} [props.maxPageNumbers=5] - Maximum number of visible page number buttons (excluding ellipsis).
 */
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  maxPageNumbers = 5, // For ellipsis
}) => {
  if (totalPages <= 1) return null; // Don't render if there's only one or no page

  const getPageNumbers = () => {
    const pages = [];
    const delta = Math.floor(maxPageNumbers / 2); // Number of pages to show around current page

    let start = Math.max(1, currentPage - delta);
    let end = Math.min(totalPages, currentPage + delta);

    // Adjust start/end if they are at the boundaries
    if (end - start + 1 < maxPageNumbers) {
      if (start === 1) {
        end = Math.min(totalPages, start + maxPageNumbers - 1);
      } else if (end === totalPages) {
        start = Math.max(1, totalPages - maxPageNumbers + 1);
      }
    }

    // Add first page and ellipsis if needed
    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push('...');
      }
    }

    // Add actual page numbers in range
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add last page and ellipsis if needed
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = showPageNumbers ? getPageNumbers() : [];

  const handlePageChange = (page) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="flex justify-center items-center space-x-2 my-8" aria-label="Pagination">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-[#0B7582] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {showPageNumbers && pages.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="px-3 py-1.5 text-gray-500">...</span>
          ) : (
            <button
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors
                ${currentPage === page
                  ? 'bg-[#0B7582] text-white border border-[#0B7582]'
                  : 'bg-white text-gray-700 hover:bg-[#e6f0fd] hover:border-[#0B7582] border border-gray-300'
                }`}
              aria-current={currentPage === page ? 'page' : undefined}
              aria-label={`Page ${page}`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-[#0B7582] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </nav>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  showPageNumbers: PropTypes.bool,
  maxPageNumbers: PropTypes.number,
};

export default Pagination;