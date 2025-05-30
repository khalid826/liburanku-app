import { useEffect, useState } from 'react';
import { bannerService } from '../../api';
import Loader from '../../components/UI/Loader';
import ErrorMessage from '../../components/UI/ErrorMessage';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HomePage = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await bannerService.getBanners();
        if (response && response.data) {
          setBanners(response.data);
        } else {
          setBanners([]); // Handle case where data might be empty but no error
        }

      } catch (err) {
        setError(err.message || 'Failed to load banners.');
        setBanners([]); // Ensure banners is an array on error

      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const nextBanner = () => {
    setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % (banners.length || 1));
  };

  const prevBanner = () => {
    setCurrentBannerIndex((prevIndex) => (prevIndex - 1 + (banners.length || 1)) % (banners.length || 1));
  };
  
  // Auto-slide function
  useEffect(() => {
    if (banners.length > 1) {
      const timer = setTimeout(() => {
        nextBanner();
      }, 5000);
      return () => clearTimeout(timer); // Component unmount when currentBannerIndex/banners change
    }
  }, [currentBannerIndex, banners]);

  if (loading) return <div className="flex justify-center items-center h-64"><Loader /></div>;
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Welcome to TravelApp!</h1>
      <p className="text-lg text-center text-gray-600 mb-12">
        Discover amazing destinations and plan your next adventure with us.
      </p>

      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      {/* Banners Section */}
      {banners && banners.length > 0 ? (
        <div className="relative w-full max-w-4xl mx-auto shadow-2xl rounded-lg overflow-hidden" style={{ height: '400px' }}>
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentBannerIndex ? 'opacity-100' : 'opacity-0'}`}
            >
              <img 
                src={banner.imageUrl} 
                alt={banner.name} 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/1200x400/EBF4FF/76A9FA?text=Image+Not+Available"; }}
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
        !loading && !error && <p className="text-center text-gray-500">No promotional banners available at the moment.</p>
      )}

      {/* Placeholder for other contents */}
      <div className="mt-16">
        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-8">Explore Categories</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Example Category Cards (Replace later) */}
          {['Adventure', 'Relaxation', 'Culture', 'Nature', 'City Escapes', 'Beaches'].map((cat) => (
            <div key={cat} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <img 
                src={`https://placehold.co/600x400/EBF4FF/76A9FA?text=${cat.replace(' ', '+')}`} 
                alt={cat} 
                className="w-full h-48 object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/grey/white?text=Image+Error"; }}
              />

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">{cat}</h3>
                <p className="text-gray-600 mt-2">Discover {cat.toLowerCase()} activities.</p>
                
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Explore
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;