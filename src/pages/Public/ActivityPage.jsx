import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { activityService, categoryService } from '../../api';
import ActivityCard from '../../components/Activity/ActivityCard';
import ActivityFilters from '../../components/Activity/ActivityFilters';
import Breadcrumb from '../../components/Common/Breadcrumb';
import Loader from '../../components/UI/Loader';
import ErrorMessage from '../../components/UI/ErrorMessage';
import Pagination from '../../components/UI/Pagination';
import usePagination from '../../hooks/usePagination';
import { Activity, MapPin, Search } from 'lucide-react';

const ActivityPage = () => {
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: 'all',
    minPrice: '',
    maxPrice: '',
    location: ''
  });

  const ITEMS_PER_PAGE = 12;
  const { currentPage, totalPages, startIndex, endIndex, goToPage } = usePagination(activities.length, ITEMS_PER_PAGE);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [activitiesRes, categoriesRes] = await Promise.allSettled([
        activityService.getActivities(),
        categoryService.getCategories()
      ]);

      if (activitiesRes.status === 'fulfilled' && activitiesRes.value?.data) {
        setActivities(activitiesRes.value.data);
      }

      if (categoriesRes.status === 'fulfilled' && categoriesRes.value?.data) {
        setCategories(categoriesRes.value.data);
      }
    } catch (err) {
      setError('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         activity.description?.toLowerCase().includes(filters.searchTerm.toLowerCase());

    const matchesCategory = filters.category === 'all' || activity.categoryId === filters.category;

    const matchesPrice = (!filters.minPrice || activity.price >= parseFloat(filters.minPrice)) &&
                        (!filters.maxPrice || activity.price <= parseFloat(filters.maxPrice));

    const matchesLocation = !filters.location || 
                           activity.city?.toLowerCase().includes(filters.location.toLowerCase()) ||
                           activity.province?.toLowerCase().includes(filters.location.toLowerCase());

    return matchesSearch && matchesCategory && matchesPrice && matchesLocation;
  });

  const paginatedActivities = filteredActivities.slice(startIndex, endIndex);

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
          <Activity size={36} className="sm:w-12 sm:h-12 text-[#0B7582] mr-3 sm:mr-4" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Explore Activities</h1>
        </div>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
          Discover amazing travel experiences across Indonesia. From adventure sports to cultural tours, find your perfect getaway.
        </p>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      {/* Filters */}
      <div className="mb-6 sm:mb-8">
        <ActivityFilters
          categories={categories}
          filters={filters}
          onApplyFilters={handleApplyFilters}
        />
      </div>

      {/* Results Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-2 text-gray-600 mb-2 sm:mb-0">
          <MapPin size={16} className="sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">{filteredActivities.length} activities found</span>
        </div>
        <div className="flex items-center space-x-2">
          <Search size={16} className="text-gray-400 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm text-gray-500">Showing {startIndex + 1}-{Math.min(endIndex, filteredActivities.length)} of {filteredActivities.length}</span>
        </div>
      </div>

      {/* Activities Grid */}
      {filteredActivities.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <Activity size={48} className="sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No activities found</h3>
          <p className="text-sm sm:text-base text-gray-500">Try adjusting your filters to find more activities.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {paginatedActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </div>
      )}
    </div>
  );
};

export default ActivityPage;
