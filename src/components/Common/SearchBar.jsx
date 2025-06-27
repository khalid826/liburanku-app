// src/components/UI/SearchBar.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Search, X, Loader as LucideLoader } from 'lucide-react'; // Lucide React icons

/**
 * Reusable Search Bar Component with Debounce functionality.
 *
 * @param {object} props - The component props.
 * @param {string} [props.placeholder='Search...'] - The placeholder text for the input.
 * @param {string} [props.value=''] - The current value of the search input.
 * @param {function} props.onChange - Callback function (newValue) => void, called on every input change.
 * @param {function} [props.onSearch] - Callback function (searchValue) => void, called after debounce period.
 * @param {number} [props.debounceMs=300] - The debounce delay in milliseconds.
 * @param {boolean} [props.loading=false] - If true, shows a loading spinner.
 * @param {string} [props.className=''] - Additional Tailwind CSS classes for the container.
 */
const SearchBar = ({
  placeholder = 'Search...',
  value = '',
  onChange,
  onSearch,
  debounceMs = 300,
  loading = false,
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const [isTyping, setIsTyping] = useState(false);

  // Update internal state if value prop changes (e.g., reset by parent)
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Debounce effect
  useEffect(() => {
    if (!onSearch) return; // Only apply debounce if onSearch callback is provided

    const handler = setTimeout(() => {
      setIsTyping(false);
      onSearch(searchTerm);
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, debounceMs, onSearch]);

  const handleChange = (e) => {
    setIsTyping(true);
    setSearchTerm(e.target.value);
    onChange && onChange(e.target.value); // Propagate change immediately
  };

  const handleClear = () => {
    setIsTyping(false);
    setSearchTerm('');
    onChange && onChange('');
    onSearch && onSearch(''); // Trigger immediate search with empty term
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="absolute left-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        className="w-full pl-9 sm:pl-10 pr-10 sm:pr-10 py-2 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-sm"
      />
      {(searchTerm || loading || isTyping) && (
        <div className="absolute right-3 flex items-center space-x-1">
          {loading || isTyping ? (
            <LucideLoader className="h-4 w-4 text-gray-500 animate-spin" />
          ) : (
            searchTerm && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                aria-label="Clear search"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func, // Not required if debounce isn't needed or handled externally
  debounceMs: PropTypes.number,
  loading: PropTypes.bool,
  className: PropTypes.string,
};

export default SearchBar;