import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BannerCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
      title: "Explore Beautiful Indonesia",
      subtitle: "Discover amazing destinations and unforgettable experiences",
      cta: "Start Exploring"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=1200&h=600&fit=crop",
      title: "Adventure Awaits",
      subtitle: "From mountains to beaches, find your perfect adventure",
      cta: "Find Adventure"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=1200&h=600&fit=crop",
      title: "Cultural Experiences",
      subtitle: "Immerse yourself in rich Indonesian culture and traditions",
      cta: "Learn More"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=600&fit=crop",
      title: "Island Paradise",
      subtitle: "Escape to pristine beaches and crystal clear waters",
      cta: "Book Now"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden">
      {/* Slides */}
      <div className="relative h-full">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30"></div>
            
            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white max-w-4xl mx-auto px-4 sm:px-6">
                <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-4 animate-fade-in leading-tight">
                  {banner.title}
                </h2>
                <p className="text-sm sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 lg:mb-8 opacity-90 animate-fade-in-delay px-2 sm:px-0">
                  {banner.subtitle}
                </p>
                <button className="bg-[#0B7582] hover:bg-[#095e68] text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-lg text-sm sm:text-base lg:text-lg font-semibold transition-colors duration-300 animate-fade-in-delay-2">
                  {banner.cta}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white flex items-center justify-center p-1 sm:p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6">
          <ChevronLeft size={14} className="" />
        </span>
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white flex items-center justify-center p-1 sm:p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6">
          <ChevronRight size={14} className="" />
        </span>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-1.5 sm:bottom-6 left-1/2 -translate-x-1/2 flex space-x-1 sm:space-x-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-1.5 h-1.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div
          className="h-full bg-white transition-all duration-1000 ease-linear"
          style={{
            width: `${((currentSlide + 1) / banners.length) * 100}%`
          }}
        />
      </div>
    </div>
  );
};

export default BannerCarousel;
