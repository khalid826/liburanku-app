import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../../api';
import CategoryCard from '../../components/Category/CategoryCard';
import Breadcrumb from '../../components/Common/Breadcrumb';
import Loader from '../../components/UI/Loader';
import ErrorMessage from '../../components/UI/ErrorMessage';
import Pagination from '../../components/UI/Pagination';
import usePagination from '../../hooks/usePagination';
import { Tag, MapPin, Search } from 'lucide-react';

const ITEMS_PER_PAGE = 12; // Show 12 categories per page

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await categoryService.getCategories();
      if (response?.data) {
        setCategories(response.data);
      }
    } catch (err) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination hook
  const { currentPage, totalPages, startIndex, endIndex, goToPage } = usePagination(filteredCategories.length, ITEMS_PER_PAGE);
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      {/* Breadcrumb */}
      <Breadcrumb />
      
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="flex items-center justify-center mb-3 sm:mb-4">
          <Tag size={36} className="sm:w-12 sm:h-12 text-[#0B7582] mr-3 sm:mr-4" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Browse Categories</h1>
        </div>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
          Explore different types of travel experiences. From adventure sports to cultural tours, find the perfect category for your next adventure.
        </p>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      {/* Search */}
      <div className="max-w-md mx-auto mb-6 sm:mb-8">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:border-transparent text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-2 text-gray-600 mb-2 sm:mb-0">
          <MapPin size={16} className="sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">{filteredCategories.length} categories found</span>
        </div>
        {totalPages > 1 && (
          <div className="text-xs sm:text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
        )}
      </div>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <Tag size={48} className="sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No categories found</h3>
          <p className="text-sm sm:text-base text-gray-500">Try adjusting your search to find more categories.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {paginatedCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 sm:mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryPage;