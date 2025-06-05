import { useEffect, useState as useStateActivityDetail } from 'react'; // Aliased
import { useParams, Link as RouterLinkDetail, useNavigate as useNavigateDetail } from 'react-router-dom'; // Aliased
import { activityService as activityServiceDetail } from '../../api'; // Aliased
import { useAuth as useAuthDetail } from '../../context/AuthContext'; // Aliased
import { useCart as useCartDetail } from '../../context/CartContext'; // Aliased
import Loader from '../../components/UI/Loader';
import ErrorMessage from '../../components/UI/ErrorMessage';
import { ArrowLeft, MapPin, Star, Users, DollarSign, ShoppingCart as ShoppingCartIcon, Info, AlertTriangle as AlertTriangleIcon } from 'lucide-react';

const ActivityDetailPage = () => {
  const { activityId } = useParams();
  const [activity, setActivity] = useStateActivityDetail(null);
  const [loading, setLoading] = useStateActivityDetail(true);
  const [error, setError] = useStateActivityDetail(null);
  const [currentImageIndex, setCurrentImageIndex] = useStateActivityDetail(0);

  const { token } = useAuthDetail();
  const { addItemToCart, loading: cartLoading, error: cartError, setError: setCartError } = useCartDetail();
  const navigate = useNavigateDetail();

  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await activityServiceDetail.getActivityById(activityId);
        if (response && response.data) {
          setActivity(response.data);
        } else {
          throw new Error("Activity not found.");
        }
      } catch (err) {
        setError(err.message || `Failed to load activity ${activityId}.`);
      } finally {
        setLoading(false);
      }
    };
    if (activityId) {
      fetchActivity();
    }
  }, [activityId]);

  const handleAddToCart = async () => {
    if (!token) {
      alert("Please log in to add items to your cart.");
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    if (activity && activity.id) {
      await addItemToCart(activity.id);
      // Feedback is handled by CartContext or can be enhanced here
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-5 h-5 text-yellow-400 fill-current" />);
    }
    if (halfStar) {
      stars.push(<Star key="half" className="w-5 h-5 text-yellow-400" style={{ clipPath: 'inset(0 50% 0 0)' }} />);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-gray-300 fill-current" />);
    }
    return stars;
  };

  const nextImage = () => {
    if (activity && activity.imageUrls && activity.imageUrls.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % activity.imageUrls.length);
    }
  };

  const prevImage = () => {
     if (activity && activity.imageUrls && activity.imageUrls.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + activity.imageUrls.length) % activity.imageUrls.length);
    }
  };


  if (loading) return <div className="flex justify-center items-center min-h-[calc(100vh-15rem)]"><Loader /></div>;
  if (error) return (
    <div className="container mx-auto py-8 text-center">
        <ErrorMessage message={error} onClose={() => setError(null)} />
        <RouterLinkDetail to="/" className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <ArrowLeft size={18} className="mr-2" /> Go Back Home
        </RouterLinkDetail>
    </div>
  );
  if (!activity) return <p className="text-center text-gray-500 text-lg py-10">Activity details not available.</p>;

  const displayPrice = activity.price_discount && activity.price_discount < activity.price ? activity.price_discount : activity.price;
  const originalPrice = activity.price_discount && activity.price_discount < activity.price ? activity.price : null;

  return (
    <div className="container mx-auto py-8 px-4">
      <RouterLinkDetail to={activity.category ? `/category/${activity.categoryId}` : "/"} className="text-blue-600 hover:underline inline-flex items-center mb-6 text-sm">
        <ArrowLeft size={18} className="mr-2" /> Back to {activity.category ? activity.category.name : "Categories"}
      </RouterLinkDetail>

      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="md:flex">
          {/* Image Gallery */}
          <div className="md:w-1/2 relative">
            {activity.imageUrls && activity.imageUrls.length > 0 ? (
              <>
                <img 
                    src={activity.imageUrls[currentImageIndex]} 
                    alt={`${activity.title} - image ${currentImageIndex + 1}`}
                    className="w-full h-64 md:h-96 object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x600/EBF4FF/76A9FA?text=Image+Not+Available"; }}
                />
                {activity.imageUrls.length > 1 && (
                    <>
                        <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors z-10">
                            <ChevronLeft size={24} />
                        </button>
                        <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors z-10">
                            <ChevronRight size={24} />
                        </button>
                         <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
                            {activity.imageUrls.map((_, index) => (
                                <button key={index} onClick={() => setCurrentImageIndex(index)} className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-gray-400 opacity-75'}`}></button>
                            ))}
                        </div>
                    </>
                )}
              </>
            ) : (
              <img src="https://placehold.co/800x600/EBF4FF/76A9FA?text=No+Image" alt={activity.title} className="w-full h-64 md:h-96 object-cover"/>
            )}
          </div>

          {/* Activity Info */}
          <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {activity.category && (
                <RouterLinkDetail to={`/category/${activity.categoryId}`} className="text-sm text-blue-500 hover:underline mb-1 inline-block">{activity.category.name}</RouterLinkDetail>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">{activity.title}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex mr-2">{renderStars(activity.rating)}</div>
                <span className="text-gray-600 text-sm">({activity.rating.toFixed(1)} stars, {activity.total_reviews} reviews)</span>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-bold text-indigo-600">
                  ${Number(displayPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                {originalPrice && (
                  <span className="ml-2 text-lg text-gray-500 line-through">
                    ${Number(originalPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                )}
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed" dangerouslySetInnerHTML={{ __html: activity.description || "No description available." }}></p>
            </div>

            <div className="mt-auto">
              {cartError && <ErrorMessage message={cartError} onClose={() => setCartError(null)} />}
              <button 
                onClick={handleAddToCart}
                disabled={cartLoading}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-300 flex items-center justify-center disabled:opacity-70"
              >
                {cartLoading ? <Loader size="sm" color="border-white"/> : <ShoppingCartIcon size={20} className="mr-2" />}
                Add to Cart
              </button>
              {!token && <p className="text-xs text-center mt-2 text-gray-500">You need to be <RouterLinkDetail to="/login" state={{from: window.location.pathname}} className="text-blue-600 underline">logged in</RouterLinkDetail> to add items to cart.</p>}
            </div>
          </div>
        </div>

        {/* Additional Details Section */}
        <div className="p-6 sm:p-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">More Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-md font-semibold text-gray-600 mb-1 flex items-center"><MapPin size={18} className="mr-2 text-blue-500"/>Location</h3>
                    <p className="text-gray-700">{activity.address}</p>
                    <p className="text-sm text-gray-500">{activity.city}, {activity.province}</p>
                     {/* Basic map placeholder - API provides iframe, but direct rendering is risky. Show text or static map image. */}
                    {activity.location_maps && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md border">
                            <Info size={16} className="inline mr-1 text-blue-500" />
                            Map data is available. <span className="text-xs">(Displaying actual map requires careful implementation)</span>
                            {/* For security, avoid dangerouslySetInnerHTML with iframes from unknown sources directly.
                                A safer approach would be to extract the src URL and use it if it's from a trusted domain,
                                or show a link to the map.
                                Example: <a href={extractedMapUrl} target="_blank" rel="noopener noreferrer">View Map</a> 
                            */}
                        </div>
                    )}
                </div>
                 <div>
                    <h3 className="text-md font-semibold text-gray-600 mb-1 flex items-center"><Users size={18} className="mr-2 text-green-500"/>Facilities</h3>
                    {activity.facilities ? (
                        <div className="text-gray-700 leading-relaxed prose prose-sm" dangerouslySetInnerHTML={{ __html: activity.facilities }}></div>
                    ) : (
                        <p className="text-gray-700">No specific facilities listed.</p>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

ActivityDetailPage.defaultProps = {
  activity: null, // Default to null if no activity is provided
};

export default ActivityDetailPage;