import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

const ActivityFilters = ({ categories = [], filters = {}, onApplyFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleApply = () => {
    onApplyFilters(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      searchTerm: '',
      category: 'all',
      minPrice: '',
      maxPrice: '',
      location: ''
    };
    setLocalFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  const handleInputChange = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-2">
          <Filter size={18} className="sm:w-5 sm:h-5 text-[#0B7582]" />
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Filter Activities</h2>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700 transition-colors p-1"
        >
          {isExpanded ? <X size={18} className="sm:w-5 sm:h-5" /> : <Filter size={18} className="sm:w-5 sm:h-5" />}
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="Search activities..."
            value={localFilters.searchTerm || ''}
            onChange={(e) => handleInputChange('searchTerm', e.target.value)}
            className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="space-y-3 sm:space-y-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Category</label>
            <select
              value={localFilters.category || 'all'}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Location</label>
            <input
              type="text"
              placeholder="Enter city or province..."
              value={localFilters.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>

          {/* Price Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Min Price</label>
              <input
                type="number"
                placeholder="0"
                value={localFilters.minPrice || ''}
                onChange={(e) => handleInputChange('minPrice', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Max Price</label>
              <input
                type="number"
                placeholder="Any"
                value={localFilters.maxPrice || ''}
                onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 gap-2 sm:gap-0">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors text-sm sm:text-base"
        >
          Reset
        </button>
        <button
          onClick={handleApply}
          className="px-4 sm:px-6 py-2 bg-[#0B7582] text-white rounded-lg hover:bg-[#095e68] font-medium transition-colors text-sm sm:text-base"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default ActivityFilters;
