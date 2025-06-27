// src/components/Admin/AdvancedFilters.jsx
import React, { useState, useEffect } from 'react';
import Button from '../UI/Button'; // Assuming Button component path

/**
 * AdvancedFilters Component
 * Provides UI elements for various filtering options for admin tables.
 *
 * @param {object} props
 * @param {object} props.initialFilters - Initial filter state (e.g., { dateFrom: '', dateTo: '', status: [], minPrice: '', maxPrice: '', searchTerm: '', role: 'all', category: 'all' }).
 * @param {function} props.onApplyFilters - Callback function (filters) => void, triggered when filters are applied.
 * @param {Array<object>} [props.statusOptions=[]] - Array of { value: string, label: string } for status dropdown.
 * @param {Array<object>} [props.roleOptions=[]] - Array of { value: string, label: string } for role dropdown.
 * @param {Array<object>} [props.categoryOptions=[]] - Array of { value: string, label: string } for category dropdown.
 * @param {boolean} [props.showDateRange=true] - Whether to show date range filters.
 * @param {boolean} [props.showPriceRange=true] - Whether to show price range filters.
 * @param {boolean} [props.showStatusFilter=true] - Whether to show status filter.
 * @param {boolean} [props.showRoleFilter=false] - Whether to show role filter.
 * @param {boolean} [props.showCategoryFilter=false] - Whether to show category filter.
 * @param {boolean} [props.showSearchField=true] - Whether to show generic search field.
 */
const AdvancedFilters = ({
  initialFilters = { dateFrom: '', dateTo: '', status: [], minPrice: '', maxPrice: '', searchTerm: '', role: 'all', category: 'all' },
  onApplyFilters,
  statusOptions = [],
  roleOptions = [],
  categoryOptions = [], // New prop for category filter options
  showDateRange = true,
  showPriceRange = true,
  showStatusFilter = true,
  showRoleFilter = false,
  showCategoryFilter = false, // New prop to control category filter visibility
  showSearchField = true,
}) => {
  const [filters, setFilters] = useState(initialFilters);

  // Sync initialFilters if they change from parent (e.g., when switching managed entities)
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleChange = (e) => {
    const { name, value, type, checked, options } = e.target;

    if (type === 'checkbox' && name === 'status') {
      const newStatus = checked
        ? [...filters.status, value]
        : filters.status.filter((s) => s !== value);
      setFilters((prev) => ({ ...prev, status: newStatus }));
    } else if (type === 'select-multiple' && name === 'status') {
       const selectedOptions = Array.from(options)
                                .filter(option => option.selected)
                                .map(option => option.value);
       setFilters((prev) => ({ ...prev, status: selectedOptions }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleApply = () => {
    // Clean up filters by removing empty strings/arrays before applying
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([key, value]) => {
        if (Array.isArray(value)) return value.length > 0;
        // Keep 'all' for select filters like role/category, but filter out truly empty strings for others
        if ((key === 'role' || key === 'category') && value === 'all') return true;
        return value !== null && value !== '';
      })
    );
    onApplyFilters(cleanedFilters);
  };

  const handleReset = () => {
    setFilters(initialFilters); // Reset to initial or default empty state
    onApplyFilters(initialFilters); [cite_start]// Pass initialFilters back to parent on reset [cite: 8]
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {showSearchField && (
          <div>
            <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="searchTerm"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleChange}
              placeholder="Search..."
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0B7582] focus:border-[#0B7582] sm:text-sm"
            />
          </div>
        )}

        {showDateRange && (
          <>
            <div>
              <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">
                Date From
              </label>
              <input
                type="date"
                id="dateFrom"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0B7582] focus:border-[#0B7582] sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">
                Date To
              </label>
              <input
                type="date"
                id="dateTo"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0B7582] focus:border-[#0B7582] sm:text-sm"
              />
            </div>
          </>
        )}

        {showPriceRange && (
          <>
            <div>
              <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Min Price
              </label>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleChange}
                placeholder="e.g., 100"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0B7582] focus:border-[#0B7582] sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Max Price
              </label>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleChange}
                placeholder="e.g., 500"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0B7582] focus:border-[#0B7582] sm:text-sm"
              />
            </div>
          </>
        )}

        {showStatusFilter && statusOptions.length > 0 && (
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="statusFilter"
              name="status"
              multiple // Allows multi-selection
              value={filters.status}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0B7582] focus:border-[#0B7582] sm:text-sm h-24" // Increased height for multiple
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
          </div>
        )}

        {showRoleFilter && roleOptions.length > 0 && (
          <div>
            <label htmlFor="roleFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              id="roleFilter"
              name="role"
              value={filters.role}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0B7582] focus:border-[#0B7582] sm:text-sm"
            >
              {/* Ensure "All Roles" is present, or the default from roleOptions */}
              {roleOptions.some(opt => opt.value === 'all') ? (
                roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))
              ) : (
                <>
                  <option value="all">All Roles</option>
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
        )}

        {showCategoryFilter && categoryOptions.length > 0 && (
          <div>
            <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="categoryFilter"
              name="category"
              value={filters.category}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0B7582] focus:border-[#0B7582] sm:text-sm"
            >
              {/* Ensure "All Categories" is present, or the default from categoryOptions */}
              {categoryOptions.some(opt => opt.value === 'all') ? (
                categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))
              ) : (
                <>
                  <option value="all">All Categories</option>
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <Button onClick={handleReset} variant="secondary">
          Reset Filters
        </Button>
        <Button onClick={handleApply}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default AdvancedFilters;