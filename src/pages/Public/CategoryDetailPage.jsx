import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Clock, Users, Filter, Tag, Search } from 'lucide-react';
import { categoryService } from '../../api';
import { activityService } from '../../api';
import ActivityCard from '../../components/Activity/ActivityCard';
import ActivityFilters from '../../components/Activity/ActivityFilters';
import Loader from '../../components/UI/Loader';
import ErrorMessage from '../../components/UI/ErrorMessage';
import Breadcrumb from '../../components/Common/Breadcrumb';
import Pagination from '../../components/UI/Pagination';
import usePagination from '../../hooks/usePagination';

const CategoryDetailPage = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: id,
    minPrice: '',
    maxPrice: '',
    location: ''
  });
  const { currentPage, totalPages, goToPage } = usePagination();

  useEffect(() => {
    fetchCategoryAndActivities();
  }, [id]);

  const fetchCategoryAndActivities = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch category details
      const categoryResponse = await categoryService.getCategoryById(id);
      if (categoryResponse?.data) {
        setCategory(categoryResponse.data);
      }

      // Fetch activities for this category
      const activitiesResponse = await activityService.getActivities();
      if (activitiesResponse?.data) {
        const categoryActivities = activitiesResponse.data.filter(
          activity => activity.categoryId === parseInt(id)
        );
        setActivities(categoryActivities);
      }
    } catch (err) {
      setError('Failed to load category details');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = !filters.searchTerm || 
      activity.title?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      activity.description?.toLowerCase().includes(filters.searchTerm.toLowerCase());

    const matchesLocation = !filters.location || 
      activity.location?.toLowerCase().includes(filters.location.toLowerCase());

    const matchesMinPrice = !filters.minPrice || 
      (activity.price_discount || activity.price) >= parseInt(filters.minPrice);

    const matchesMaxPrice = !filters.maxPrice || 
      (activity.price_discount || activity.price) <= parseInt(filters.maxPrice);

    return matchesSearch && matchesLocation && matchesMinPrice && matchesMaxPrice;
  });

  const paginatedActivities = filteredActivities.slice((currentPage - 1) * 10, currentPage * 10);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error} onClose={() => setError(null)} />
        <Link
          to="/categories"
          className="mt-4 inline-flex items-center px-4 py-2 bg-[#0B7582] text-white rounded-md hover:bg-[#095e68]"
        >
          <ArrowLeft size={18} className="mr-2" /> Back to Categories
        </Link>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Category not found</h2>
        <Link
          to="/categories"
          className="inline-flex items-center px-4 py-2 bg-[#0B7582] text-white rounded-md hover:bg-[#095e68]"
        >
          <ArrowLeft size={18} className="mr-2" /> Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      {/* Breadcrumb */}
      <Breadcrumb />
      
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <Link to="/categories" className="text-blue-600 hover:underline inline-flex items-center mb-3 sm:mb-4 text-sm sm:text-base">
          <ArrowLeft size={16} className="sm:w-5 sm:h-5 mr-2" /> Back to Categories
        </Link>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <Tag size={36} className="sm:w-12 sm:h-12 text-[#0B7582] mr-3 sm:mr-4" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{category?.name || 'Category'}</h1>
          </div>
          {category?.description && (
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              {category.description}
            </p>
          )}
        </div>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      {/* Search */}
      <div className="max-w-md mx-auto mb-6 sm:mb-8">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="Search activities in this category..."
            value={filters.searchTerm}
            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
            className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:border-transparent text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-2 text-gray-600 mb-2 sm:mb-0">
          <MapPin size={16} className="sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">{filteredActivities.length} activities found</span>
        </div>
        {totalPages > 1 && (
          <div className="text-xs sm:text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
        )}
      </div>

      {/* Activities Grid */}
      {filteredActivities.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <Tag size={48} className="sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No activities found</h3>
          <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
            Try adjusting your search or browse other categories.
          </p>
          <Link 
            to="/categories" 
            className="px-4 sm:px-6 py-2 sm:py-3 bg-[#0B7582] text-white font-semibold rounded-lg shadow-md hover:bg-[#095e68] transition-colors text-sm sm:text-base"
          >
            Browse All Categories
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {paginatedActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
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

export default CategoryDetailPage; 