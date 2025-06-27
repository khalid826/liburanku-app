// src/pages/Public/ActivityDetailPage.jsx
import { useEffect, useState as useStateActivityDetail } from "react"; // Aliased
import {
  useParams,
  Link as RouterLinkDetail,
  useNavigate as useNavigateDetail,
} from "react-router-dom"; // Aliased
import { getActivityById } from "../../api/activityService";
import { useAuth as useAuthDetail } from "../../context/AuthContext"; // Aliased
import { useCart as useCartDetail } from "../../context/CartContext"; // Aliased
import { useNotification } from "../../context/NotificationContext";
import Breadcrumb from "../../components/Common/Breadcrumb";
import Loader from "../../components/UI/Loader";
import ErrorMessage from "../../components/UI/ErrorMessage";
// Import the new components for PriceDisplay and Rating
import PriceDisplay from "../../components/Common/PriceDisplay";
import Rating from "../../components/Common/Rating";
import Button from "../../components/UI/Button"; // Import Button for the "Add to Cart" action
import { DEFAULT_CURRENCY } from "../../utils/constants";

import { 
  ArrowLeft, 
  MapPin, 
  ShoppingCart as ShoppingCartIcon, 
  Info, 
  AlertTriangle as AlertTriangleIcon, 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  Clock,
  Calendar,
  Star,
  ExternalLink,
  Heart,
  Share2,
  Phone,
  Mail
} from 'lucide-react';


const ActivityDetailPage = () => {
  const { id } = useParams();
  const [activity, setActivity] = useStateActivityDetail(null);
  const [loading, setLoading] = useStateActivityDetail(true);
  const [error, setError] = useStateActivityDetail(null);
  const [currentImageIndex, setCurrentImageIndex] = useStateActivityDetail(0);
  const [isFavorite, setIsFavorite] = useStateActivityDetail(false);

  const { token } = useAuthDetail();
  const { showError, showSuccess } = useNotification();
  const {
    addItemToCart,
    loading: cartLoading,
    error: cartError,
    setError: setCartError,
  } = useCartDetail();
  const navigate = useNavigateDetail();

  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getActivityById(id);
        console.log('Activity API response:', response); // Debug log
        if (response && response.data) {
          setActivity(response.data);
        } else {
          throw new Error("Activity not found.");
        }
      } catch (err) {
        setError(err.message || `Failed to load activity ${id}.`);
        showError(err.message || `Failed to load activity ${id}.`);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchActivity();
    }
  }, [id, showError]);

  const handleAddToCart = async () => {
    if (!token) {
      showError("Please log in to add items to your cart.");
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    if (activity && activity.id) {
      try {
        await addItemToCart(activity.id);
      } catch (err) {
        showError("Failed to add activity to cart.");
      }
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    showSuccess(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: activity?.title,
        text: activity?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showSuccess("Link copied to clipboard!");
    }
  };

  const openGoogleMaps = () => {
    const location = activity?.location || activity?.city || 'Indonesia';
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
    window.open(mapsUrl, '_blank');
  };

  const nextImage = () => {
    if (activity && activity.imageUrls && activity.imageUrls.length > 1) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % activity.imageUrls.length
      );
    }
  };

  const prevImage = () => {
    if (activity && activity.imageUrls && activity.imageUrls.length > 1) {
      setCurrentImageIndex(
        (prevIndex) =>
          (prevIndex - 1 + activity.imageUrls.length) %
          activity.imageUrls.length
      );
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-15rem)]">
        <Loader />
      </div>
    );
  if (error)
    return (
      <div className="container mx-auto py-8 text-center">
        <ErrorMessage message={error} onClose={() => setError(null)} />
        <RouterLinkDetail
          to="/"
          className="mt-4 inline-flex items-center px-4 py-2 bg-[#0B7582] text-white rounded-md hover:bg-[#095e68]"
        >
          <ArrowLeft size={18} className="mr-2" /> Go Back Home
        </RouterLinkDetail>
      </div>
    );
  if (!activity)
    return (
      <p className="text-center text-gray-500 text-lg py-10">
        Activity details not available.
      </p>
    );

  const displayPrice =
    activity.price_discount && activity.price_discount < activity.price
      ? activity.price_discount
      : activity.price;
  const originalPrice =
    activity.price_discount && activity.price_discount < activity.price
      ? activity.price
      : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-64 sm:h-80 lg:h-[500px]">
        {activity.imageUrls && activity.imageUrls.length > 0 ? (
          <>
            <img
              src={activity.imageUrls[currentImageIndex]}
              alt={`${activity.title} - image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/800x600/EBF4FF/76A9FA?text=Image+Not+Available";
              }}
            />
            {activity.imageUrls.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 sm:p-3 rounded-full hover:bg-black/70 transition-colors z-10"
                >
                  <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 sm:p-3 rounded-full hover:bg-black/70 transition-colors z-10"
                >
                  <ChevronRight size={20} className="sm:w-6 sm:h-6" />
                </button>
                <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1 sm:space-x-2">
                  {activity.imageUrls.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                        index === currentImageIndex
                          ? "bg-white"
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                    ></button>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <img
            src="https://placehold.co/800x600/EBF4FF/76A9FA?text=No+Image"
            alt="No image available"
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Back button and actions */}
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 flex items-center justify-between">
          <RouterLinkDetail
            to={activity.category ? `/category/${activity.categoryId}` : "/"}
            className="flex items-center bg-white/20 backdrop-blur-sm text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg hover:bg-white/30 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft size={14} className="sm:w-[18px] sm:h-[18px] mr-1 sm:mr-2" /> Back
          </RouterLinkDetail>
          
          <div className="flex space-x-1 sm:space-x-2">
            <button
              onClick={handleFavorite}
              className={`p-1 sm:p-2 rounded-lg backdrop-blur-sm transition-colors ${
                isFavorite 
                  ? 'bg-red-500/20 text-red-500' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Heart size={16} className="sm:w-5 sm:h-5" fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={handleShare}
              className="p-1 sm:p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
            >
              <Share2 size={16} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Breadcrumb */}
        <Breadcrumb />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-4 sm:gap-0">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{activity.title}</h1>
                  <div className="flex items-center text-gray-600 mb-2 sm:mb-3">
                    <MapPin size={14} className="sm:w-4 sm:h-4 mr-1" />
                    <span className="text-sm sm:text-base">{activity.location || activity.city}</span>
                    <button
                      onClick={openGoogleMaps}
                      className="ml-2 text-[#0B7582] hover:text-[#095e68] flex items-center"
                    >
                      <ExternalLink size={12} className="sm:w-[14px] sm:h-[14px]" />
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-0">
                    <div className="flex items-center">
                      <Rating rating={activity.rating || 0} />
                      <span className="ml-1">({activity.reviews || 0} reviews)</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={12} className="sm:w-[14px] sm:h-[14px] mr-1" />
                      <span>{activity.duration || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <Users size={12} className="sm:w-[14px] sm:h-[14px] mr-1" />
                      <span>{activity.maxParticipants || 'N/A'} people</span>
                    </div>
                  </div>
                </div>
                
                {/* Price Card */}
                <div className="bg-[#e6f0fd] rounded-lg p-3 sm:p-4 min-w-[150px] sm:min-w-[200px]">
                  <div className="text-center">
                    {originalPrice && (
                      <div className="text-xs sm:text-sm text-gray-500 line-through mb-1">
                        <span className="font-medium">Original Price:</span>
                        <br />
                        <PriceDisplay amount={originalPrice} />
                      </div>
                    )}
                    <div className="text-xs sm:text-sm text-green-600 font-medium mb-1">
                      {originalPrice ? 'Discounted Price:' : 'Price:'}
                    </div>
                    <div className="text-lg sm:text-2xl font-bold text-[#0B7582]">
                      <PriceDisplay amount={displayPrice} />
                    </div>
                    {originalPrice && (
                      <div className="text-xs text-green-600 font-medium mt-1">
                        Save {((originalPrice - displayPrice) / originalPrice * 100).toFixed(0)}%
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={handleAddToCart}
                  disabled={cartLoading}
                  className="flex-1 bg-[#0B7582] text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-[#095e68] disabled:opacity-50 transition-colors flex items-center justify-center text-sm sm:text-base"
                >
                  {cartLoading ? (
                    <Loader size="sm" />
                  ) : (
                    <>
                      <ShoppingCartIcon size={16} className="sm:w-5 sm:h-5 mr-2" />
                      Add to Cart
                    </>
                  )}
                </button>
                <button className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base">
                  Contact Us
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">About this activity</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{activity.description}</p>
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {activity.highlights?.map((highlight, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-[#0B7582] rounded-full mt-2 mr-2 sm:mr-3 flex-shrink-0"></div>
                    <span className="text-sm sm:text-base text-gray-700">{highlight}</span>
                  </div>
                )) || (
                  <div className="text-sm sm:text-base text-gray-500">No highlights available</div>
                )}
              </div>
            </div>

            {/* Map Section */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Location</h2>
              <div className="bg-gray-100 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                  <div className="flex items-center">
                    <MapPin size={16} className="sm:w-5 sm:h-5 text-[#0B7582] mr-2" />
                    <span className="text-sm sm:text-base text-gray-700">{activity.location || activity.city || 'Location not specified'}</span>
                  </div>
                  <button
                    onClick={openGoogleMaps}
                    className="flex items-center text-[#0B7582] hover:text-[#095e68] text-sm sm:text-base"
                  >
                    <span className="mr-1">View on Map</span>
                    <ExternalLink size={14} className="sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Info */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Info</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base text-gray-600">Duration</span>
                  <span className="text-sm sm:text-base font-medium">{activity.duration || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base text-gray-600">Group Size</span>
                  <span className="text-sm sm:text-base font-medium">{activity.maxParticipants || 'N/A'} people</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base text-gray-600">Language</span>
                  <span className="text-sm sm:text-base font-medium">{activity.language || 'English'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base text-gray-600">Cancellation</span>
                  <span className="text-sm sm:text-base font-medium text-green-600">Free cancellation</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Need Help?</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm sm:text-base text-gray-600">
                  <Phone size={16} className="sm:w-4 sm:h-4 mr-2 text-[#0B7582]" />
                  <span>+62 812-3456-7890</span>
                </div>
                <div className="flex items-center text-sm sm:text-base text-gray-600">
                  <Mail size={16} className="sm:w-4 sm:h-4 mr-2 text-[#0B7582]" />
                  <span>support@liburanku.com</span>
                </div>
              </div>
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
