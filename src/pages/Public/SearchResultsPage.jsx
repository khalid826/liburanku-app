import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { activityService } from '../../api';
import Loader from '../../components/UI/Loader';
import ErrorMessage from '../../components/UI/ErrorMessage';
import ActivityCard from '../../components/Activity/ActivityCard';
import Breadcrumb from '../../components/Common/Breadcrumb';
import { Search, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SearchBar from '../../components/Common/SearchBar';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setSearchInput(query);
    if (query.trim()) {
      searchActivities();
    } else {
      setActivities([]);
    }
  }, [query]);

  const searchActivities = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await activityService.getActivities();
      if (response && response.data) {
        const filteredActivities = response.data.filter(activity => 
          activity.title?.toLowerCase().includes(query.toLowerCase()) ||
          activity.description?.toLowerCase().includes(query.toLowerCase()) ||
          activity.city?.toLowerCase().includes(query.toLowerCase()) ||
          activity.province?.toLowerCase().includes(query.toLowerCase())
        );
        setActivities(filteredActivities);
      } else {
        setActivities([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to search activities');
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    // Update the URL query param
    navigate(`/search?q=${encodeURIComponent(value)}`);
  };

  return (
    <div className="container mx-auto py-4 sm:py-8 px-4">
      {/* Breadcrumb */}
      <Breadcrumb />
      
      <div className="mb-6 sm:mb-8">
        <Link to="/" className="text-blue-600 hover:underline inline-flex items-center mb-3 sm:mb-4 text-sm sm:text-base">
          <ArrowLeft size={16} className="sm:w-5 sm:h-5 mr-2" /> Back to Home
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
          <Search size={24} className="sm:w-8 sm:h-8 mr-2 sm:mr-3 text-indigo-600" />
          Search Results
        </h1>
        <div className="mt-3 sm:mt-4 max-w-xl">
          <SearchBar
            placeholder="Search activities..."
            value={searchInput}
            onChange={setSearchInput}
            onSearch={handleSearch}
            debounceMs={400}
          />
        </div>
        {query && (
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Showing results for: <span className="font-semibold">"{query}"</span>
          </p>
        )}
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      {loading ? (
        <div className="flex justify-center items-center min-h-[calc(100vh-15rem)]">
          <Loader />
        </div>
      ) : activities.length > 0 ? (
        <div>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            Found {activities.length} activity{activities.length !== 1 ? 'ies' : ''}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      ) : query ? (
        <div className="text-center py-8 sm:py-10">
          <Search size={48} className="sm:w-16 sm:h-16 mx-auto text-gray-400 mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No activities found</h3>
          <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
            Try adjusting your search terms or browse our categories.
          </p>
          <Link 
            to="/" 
            className="px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors text-sm sm:text-base"
          >
            Browse All Activities
          </Link>
        </div>
      ) : (
        <div className="text-center py-8 sm:py-10">
          <Search size={48} className="sm:w-16 sm:h-16 mx-auto text-gray-400 mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">Enter a search term to find activities</h3>
          <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
            Search by activity name, description, or location.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
