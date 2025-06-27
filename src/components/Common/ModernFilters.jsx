import React, { useState } from 'react';
import { Search, Filter, X, MapPin, DollarSign, Calendar, Tag } from 'lucide-react';

const ModernFilters = ({ 
  filters = {}, 
  onApplyFilters, 
  onReset,
  options = {
    search: true,
    category: false,
    location: false,
    priceRange: false,
    dateRange: false,
    status: false,
    custom: []
  },
  categories = [],
  statusOptions = [],
  customFilters = []
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleApply = () => {
    onApplyFilters(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {};
    if (options.search) resetFilters.searchTerm = '';
    if (options.category) resetFilters.category = 'all';
    if (options.location) resetFilters.location = '';
    if (options.priceRange) {
      resetFilters.minPrice = '';
      resetFilters.maxPrice = '';
    }
    if (options.dateRange) {
      resetFilters.dateFrom = '';
      resetFilters.dateTo = '';
    }
    if (options.status) resetFilters.status = [];
    
    setLocalFilters(resetFilters);
    onReset ? onReset(resetFilters) : onApplyFilters(resetFilters);
  };

  const handleInputChange = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const hasActiveFilters = () => {
    return Object.values(localFilters).some(value => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== '' && value !== 'all';
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-[#0B7582]" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          {hasActiveFilters() && (
            <span className="bg-[#e6f0fd] text-[#0B7582] text-xs font-medium px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          {isExpanded ? <X size={20} /> : <Filter size={20} />}
        </button>
      </div>

      {/* Search Bar */}
      {options.search && (
        <div className="mb-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={localFilters.searchTerm || ''}
              onChange={(e) => handleInputChange('searchTerm', e.target.value)}
              className="w-full px-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="space-y-4">
          {/* Category Filter */}
          {options.category && categories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Tag size={16} className="mr-2" />
                Category
              </label>
              <select
                value={localFilters.category || 'all'}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Location Filter */}
          {options.location && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <MapPin size={16} className="mr-2" />
                Location
              </label>
              <input
                type="text"
                placeholder="Enter city or province..."
                value={localFilters.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:border-transparent"
              />
            </div>
          )}

          {/* Price Range */}
          {options.priceRange && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <DollarSign size={16} className="mr-2" />
                Price Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={localFilters.minPrice || ''}
                    onChange={(e) => handleInputChange('minPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={localFilters.maxPrice || ''}
                    onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Date Range */}
          {options.dateRange && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Calendar size={16} className="mr-2" />
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="date"
                    value={localFilters.dateFrom || ''}
                    onChange={(e) => handleInputChange('dateFrom', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="date"
                    value={localFilters.dateTo || ''}
                    onChange={(e) => handleInputChange('dateTo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Status Filter */}
          {options.status && statusOptions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                multiple
                value={localFilters.status || []}
                onChange={(e) => {
                  const selectedOptions = Array.from(e.target.options)
                    .filter(option => option.selected)
                    .map(option => option.value);
                  handleInputChange('status', selectedOptions);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:border-transparent h-24"
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

          {/* Custom Filters */}
          {customFilters.map((filter, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {filter.label}
              </label>
              {filter.type === 'select' ? (
                <select
                  value={localFilters[filter.key] || filter.defaultValue || ''}
                  onChange={(e) => handleInputChange(filter.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:border-transparent"
                >
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={filter.type || 'text'}
                  placeholder={filter.placeholder}
                  value={localFilters[filter.key] || ''}
                  onChange={(e) => handleInputChange(filter.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:border-transparent"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
        >
          Reset
        </button>
        <button
          onClick={handleApply}
          className="px-6 py-2 bg-[#0B7582] text-white rounded-lg hover:bg-[#095e68] font-medium transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default ModernFilters; 