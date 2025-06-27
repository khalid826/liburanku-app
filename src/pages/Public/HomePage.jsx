import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, ArrowRight, Calendar, Users, Clock } from 'lucide-react';
import BannerCarousel from '../../components/Banner/BannerCarousel';
import SearchBar from '../../components/Common/SearchBar';
import PriceDisplay from '../../components/Common/PriceDisplay';
import Rating from '../../components/Common/Rating';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');

  // Mock data for offers/deals
  const offers = [
    {
      id: 1,
      title: "Early Bird Discount",
      description: "Book 30 days in advance and save up to 25%",
      discount: "25% OFF",
      validUntil: "2024-12-31",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Weekend Getaway",
      description: "Special rates for weekend trips",
      discount: "15% OFF",
      validUntil: "2024-11-30",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Group Booking",
      description: "Travel with friends and family",
      discount: "20% OFF",
      validUntil: "2024-12-15",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop"
    }
  ];

  // Mock data for favorite choices
  const favorites = [
    {
      id: 1,
      title: "Bali Adventure Tour",
      location: "Bali, Indonesia",
      price: 1500000,
      originalPrice: 2000000,
      rating: 4.8,
      reviews: 1247,
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop",
      duration: "3 Days",
      groupSize: "2-8 People"
    },
    {
      id: 2,
      title: "Yogyakarta Cultural Experience",
      location: "Yogyakarta, Indonesia",
      price: 1200000,
      originalPrice: 1500000,
      rating: 4.9,
      reviews: 892,
      image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=400&h=300&fit=crop",
      duration: "2 Days",
      groupSize: "1-6 People"
    },
    {
      id: 3,
      title: "Lombok Island Hopping",
      location: "Lombok, Indonesia",
      price: 1800000,
      originalPrice: 2200000,
      rating: 4.7,
      reviews: 567,
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
      duration: "4 Days",
      groupSize: "2-10 People"
    },
    {
      id: 4,
      title: "Komodo Dragon Safari",
      location: "Flores, Indonesia",
      price: 2500000,
      originalPrice: 3000000,
      rating: 4.9,
      reviews: 423,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      duration: "3 Days",
      groupSize: "4-12 People"
    }
  ];

  // Mock data for articles
  const articles = [
    {
      id: 1,
      title: "10 Hidden Gems in Indonesia You Must Visit",
      excerpt: "Discover the lesser-known destinations that will take your breath away...",
      author: "Travel Expert",
      date: "2024-01-15",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
      category: "Travel Tips"
    },
    {
      id: 2,
      title: "Best Time to Visit Bali: A Complete Guide",
      excerpt: "Plan your perfect Bali trip with our comprehensive seasonal guide...",
      author: "Local Guide",
      date: "2024-01-12",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=250&fit=crop",
      category: "Destination Guide"
    },
    {
      id: 3,
      title: "Budget Travel in Indonesia: How to Save Money",
      excerpt: "Travel smart and save money with these insider tips...",
      author: "Budget Traveler",
      date: "2024-01-10",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=400&h=250&fit=crop",
      category: "Budget Travel"
    }
  ];

  // Mock data for partnerships
  const partnerships = [
    { name: "Garuda Indonesia", logo: "/partners/logo-garuda-indonesia.png", type: "Airline" },
    { name: "Hotel Indonesia", logo: "/partners/logo-hotel-indonesia.png", type: "Hotel" },
    { name: "GoJek", logo: "/partners/logo-gojek.png", type: "Transport" },
    { name: "Bank Central Asia", logo: "/partners/logo-bca.png", type: "Banking" },
    { name: "Telkomsel", logo: "/partners/logo-telkomsel.png", type: "Telecom" },
    { name: "Indomaret", logo: "/partners/logo-indomaret.png", type: "Retail" }
  ];

  // Mock data for countries/cities
  const locations = [
    { name: "Bali", image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=300&h=200&fit=crop", country: "Indonesia" },
    { name: "Jakarta", image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=300&h=200&fit=crop", country: "Indonesia" },
    { name: "Yogyakarta", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop", country: "Indonesia" },
    { name: "Bandung", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop", country: "Indonesia" },
    { name: "Surabaya", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop", country: "Indonesia" },
    { name: "Lombok", image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=300&h=200&fit=crop", country: "Indonesia" }
  ];

  // Mock data for activities
  const activities = [
    { name: "Adventure", icon: "🏔️", count: 156, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop" },
    { name: "Cultural", icon: "🏛️", count: 89, image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=300&h=200&fit=crop" },
    { name: "Beach", icon: "🏖️", count: 234, image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop" },
    { name: "Food", icon: "🍜", count: 67, image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop" },
    { name: "Nature", icon: "🌿", count: 123, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop" },
    { name: "Shopping", icon: "🛍️", count: 45, image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=300&h=200&fit=crop" }
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Navigate to search results
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Carousel and Search */}
      <section className="relative">
        <BannerCarousel />
      </section>
      <section className="bg-white pt-4 sm:pt-8 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-4 text-center">
              Discover Amazing Destinations
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8 text-center px-4">
              Find the best travel experiences across Indonesia
            </p>
            
            {/* Beautiful Travel Search Bar */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Destination */}
                <div className="relative sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    <MapPin className="inline w-4 h-4 mr-1" />
                    Destination
                  </label>
                  <input
                    type="text"
                    placeholder="Where do you want to go?"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  />
                </div>

                {/* Activity Type */}
                <div className="relative sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    <Search className="inline w-4 h-4 mr-1" />
                    Activity Type
                  </label>
                  <select className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:border-transparent transition-all duration-200 appearance-none bg-white text-sm sm:text-base">
                    <option value="">All Activities</option>
                    <option value="adventure">Adventure</option>
                    <option value="cultural">Cultural</option>
                    <option value="beach">Beach</option>
                    <option value="food">Food & Dining</option>
                    <option value="nature">Nature</option>
                    <option value="shopping">Shopping</option>
                  </select>
                </div>

                {/* Date */}
                <div className="relative sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B7582] focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  />
                </div>

                {/* Search Button */}
                <div className="flex items-end sm:col-span-1">
                  <button
                    onClick={() => handleSearch(searchQuery)}
                    className="w-full bg-[#0B7582] text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold hover:bg-[#095e68] transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center text-sm sm:text-base"
                  >
                    <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Search
                  </button>
                </div>
              </div>

              {/* Quick Filters */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-600 mr-2">Popular:</span>
                  {['Bali', 'Yogyakarta', 'Lombok', 'Jakarta', 'Bandung'].map((destination) => (
                    <button
                      key={destination}
                      className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-[#e6f0fd] hover:text-[#0B7582] transition-colors duration-200"
                    >
                      {destination}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-[#fdf6ed]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">Special Offers & Deals</h2>
            <p className="text-base sm:text-lg text-gray-600">Don't miss out on these amazing deals</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {offers.map((offer) => (
              <div key={offer.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img src={offer.image} alt={offer.title} className="w-full h-40 sm:h-48 object-cover" />
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-red-500 text-white px-2 sm:px-3 py-1 rounded-full font-bold text-xs sm:text-sm">
                    {offer.discount}
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{offer.title}</h3>
                  <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">{offer.description}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                    <span className="text-xs sm:text-sm text-gray-500">Valid until {new Date(offer.validUntil).toLocaleDateString()}</span>
                    <button className="bg-[#EF7B24] text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-[#d96c1e] transition-colors text-sm sm:text-base">
                      Claim Offer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Favorite Choices Section */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-12">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">Favorite Choices</h2>
              <p className="text-base sm:text-lg text-gray-600">Most popular destinations loved by travelers</p>
            </div>
            <Link to="/activities" className="flex items-center text-[#0B7582] hover:text-[#095e68] font-semibold text-sm sm:text-base">
              See More <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {favorites.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative">
                  <img src={item.image} alt={item.title} className="w-full h-40 sm:h-48 object-cover" />
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs sm:text-sm font-semibold">
                    {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base">{item.title}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin size={14} className="mr-1 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">{item.location}</span>
                  </div>
                  <div className="flex items-center mb-2 sm:mb-3">
                    <Rating rating={item.rating} />
                    <span className="text-xs sm:text-sm text-gray-600 ml-2">({item.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <Clock size={12} className="mr-1" />
                      {item.duration}
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <Users size={12} className="mr-1" />
                      {item.groupSize}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                    <div>
                      <div className="text-base sm:text-lg font-bold text-gray-900">
                        <PriceDisplay amount={item.price} />
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 line-through">
                        <PriceDisplay amount={item.originalPrice} />
                      </div>
                    </div>
                    <button className="bg-[#EF7B24] text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-[#d96c1e] transition-colors text-xs sm:text-sm">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-[#0B7582]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-50 mb-2 sm:mb-4">Travel Articles & Tips</h2>
            <p className="text-base sm:text-lg text-gray-50">Get inspired with our latest travel stories and tips</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {articles.map((article) => (
              <div key={article.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <img src={article.image} alt={article.title} className="w-full h-40 sm:h-48 object-cover" />
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2 sm:gap-0">
                    <span className="inline-block w-fit bg-[#e6f0fd] text-[#0B7582] px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                      {article.category}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500">{article.readTime}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 line-clamp-2">{article.title}</h3>
                  <p className="text-gray-600 mb-3 sm:mb-4 line-clamp-3 text-sm sm:text-base">{article.excerpt}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                    <div className="text-xs sm:text-sm text-gray-500">
                      By {article.author} • {new Date(article.date).toLocaleDateString()}
                    </div>
                    <button className="text-[#0B7582] hover:text-[#095e68] font-semibold text-sm sm:text-base">
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">Our Trusted Partners</h2>
            <p className="text-base sm:text-lg text-gray-600">Working with the best brands to provide you exceptional service</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
            {partnerships.map((partner, index) => (
              <div key={index} className="flex items-center justify-center p-3 sm:p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 group">
                <img 
                  src={partner.logo} 
                  alt={`${partner.name} logo`} 
                  className="max-w-full h-8 sm:h-12 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://via.placeholder.com/120x60/2563eb/ffffff?text=${partner.name.replace(' ', '+')}`;
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Choose by Country/City Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">Explore by Destination</h2>
            <p className="text-base sm:text-lg text-gray-600">Discover amazing places across Indonesia</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
            {locations.map((location, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg sm:rounded-xl">
                  <img src={location.image} alt={location.name} className="w-full h-24 sm:h-32 object-cover group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h3 className="font-semibold text-sm sm:text-lg">{location.name}</h3>
                      <p className="text-xs sm:text-sm opacity-90">{location.country}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Choose by Activity Section */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-12">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">Explore by Activity</h2>
              <p className="text-base sm:text-lg text-gray-600">Find the perfect activity for your interests</p>
            </div>
            <Link to="/activities" className="flex items-center text-[#0B7582] hover:text-[#095e68] font-semibold text-sm sm:text-base">
              See More <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
            {activities.map((activity, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg sm:rounded-xl">
                  <img src={activity.image} alt={activity.name} className="w-full h-24 sm:h-32 object-cover group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{activity.icon}</div>
                    <div className="text-center text-white">
                      <h3 className="font-semibold text-xs sm:text-sm">{activity.name}</h3>
                      <p className="text-xs opacity-90">{activity.count} activities</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;