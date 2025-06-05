import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom'; // Aliased to avoid conflict with any other Link
import { bannerService, categoryService } from '../../api';
import Loader from '../../components/UI/Loader';
import ErrorMessage from '../../components/UI/ErrorMessage';
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react';

const HomePage = () => {
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorBanners, setErrorBanners] = useState(null);
  const [errorCategories, setErrorCategories] = useState(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoadingBanners(true);
        setErrorBanners(null);
        const response = await bannerService.getBanners();
        if (response && response.data) {
          setBanners(response.data);
        } else {
          setBanners([]); 
        }
      } catch (err) {
        setErrorBanners(err.message || 'Failed to load banners.');
        setBanners([]); 
      } finally {
        setLoadingBanners(false);
      }
    };

    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        setErrorCategories(null);
        const response = await categoryService.getCategories();
        if (response && response.data) {
          setCategories(response.data);
        } else {
          setCategories([]);
        }
      } catch (err) {
        setErrorCategories(err.message || 'Failed to load categories.');
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchBanners();
    fetchCategories();
  }, []);

  const nextBanner = () => {
    setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % (banners.length || 1));
  };

  const prevBanner = () => {
    setCurrentBannerIndex((prevIndex) => (prevIndex - 1 + (banners.length || 1)) % (banners.length || 1));
  };
  
  useEffect(() => {
    if (banners.length > 1) {
      const timer = setTimeout(() => {
        nextBanner();
      }, 5000); 
      return () => clearTimeout(timer); 
    }
  }, [currentBannerIndex, banners]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Welcome to TravelApp!</h1>
      <p className="text-lg text-center text-gray-600 mb-12">
        Discover amazing destinations and plan your next adventure with us.
      </p>

      {/* Banners Section */}
      {loadingBanners && <div className="flex justify-center items-center h-64"><Loader /></div>}
      {errorBanners && <ErrorMessage message={errorBanners} onClose={() => setErrorBanners(null)} />}
      {!loadingBanners && !errorBanners && banners && banners.length > 0 ? (
        <div className="relative w-full max-w-4xl mx-auto shadow-2xl rounded-lg overflow-hidden mb-16" style={{ height: '400px' }}>
          {banners.map((banner, index) => (
            <div
              key={banner.id || index} // Use banner.id if available, otherwise index
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentBannerIndex ? 'opacity-100' : 'opacity-0'}`}
            >
              <img 
                src={banner.imageUrl} 
                alt={banner.name} 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/1200x400/EBF4FF/76A9FA?text=Banner+Not+Available"; }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4">
                <h3 className="text-white text-xl font-semibold">{banner.name}</h3>
              </div>
            </div>
          ))}
          {banners.length > 1 && (
            <>
              <button 
                onClick={prevBanner} 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors z-10"
                aria-label="Previous Banner"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={nextBanner} 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors z-10"
                aria-label="Next Banner"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
      ) : (
        !loadingBanners && !errorBanners && <p className="text-center text-gray-500 mb-12">No promotional banners available at the moment.</p>
      )}

      {/* Categories Section */}
      <div className="mt-12">
        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-8">Explore Categories</h2>
        {loadingCategories && <div className="flex justify-center items-center h-32"><Loader /></div>}
        {errorCategories && <ErrorMessage message={errorCategories} onClose={() => setErrorCategories(null)} />}
        {!loadingCategories && !errorCategories && categories && categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <RouterLink to={`/category/${category.id}`} key={category.id} className="block group">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 h-full flex flex-col">
                  <img 
                    src={category.imageUrl} 
                    alt={category.name} 
                    className="w-full h-48 object-cover group-hover:opacity-90"
                    onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/600x400/E2E8F0/4A5568?text=${encodeURIComponent(category.name)}`; }}
                  />
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{category.name}</h3>
                        {/* Optional: Add a short description if available from API */}
                        {/* <p className="text-gray-600 mt-2 text-sm">Explore activities in {category.name.toLowerCase()}.</p> */}
                    </div>
                    <span className="mt-3 inline-flex items-center text-sm font-medium text-blue-600 group-hover:underline">
                        View Activities <ChevronRight size={16} className="ml-1" />
                    </span>
                  </div>
                </div>
              </RouterLink>
            ))}
          </div>
        ) : (
          !loadingCategories && !errorCategories && <p className="text-center text-gray-500">No categories available at the moment.</p>
        )}
      </div>
    </div>
  );
};

HomePage.defaultProps = {
  banners: [],
  categories: [],
  loadingBanners: false,
  loadingCategories: false,
  errorBanners: null,
  errorCategories: null,
};

export default HomePage;