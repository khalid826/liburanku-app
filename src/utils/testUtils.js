// Test utilities for admin integration testing

export const mockAdminUser = {
  id: 1,
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin',
  is_active: true,
  created_at: '2024-01-01T00:00:00Z'
};

export const mockRegularUser = {
  id: 2,
  name: 'Regular User',
  email: 'user@example.com',
  role: 'user',
  is_active: true,
  created_at: '2024-01-01T00:00:00Z'
};

export const mockActivities = [
  {
    id: 1,
    title: 'Bali Adventure',
    description: 'Explore the beautiful island of Bali',
    price: 1500000,
    price_discount: 1200000,
    city: 'Denpasar',
    province: 'Bali',
    rating: 4.5,
    total_reviews: 120,
    is_active: true,
    categoryId: 1,
    imageUrls: ['https://example.com/bali.jpg'],
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    title: 'Jakarta City Tour',
    description: 'Discover the capital city of Indonesia',
    price: 800000,
    price_discount: null,
    city: 'Jakarta',
    province: 'DKI Jakarta',
    rating: 4.2,
    total_reviews: 85,
    is_active: true,
    categoryId: 2,
    imageUrls: ['https://example.com/jakarta.jpg'],
    created_at: '2024-01-02T00:00:00Z'
  }
];

export const mockCategories = [
  {
    id: 1,
    name: 'Adventure',
    description: 'Thrilling outdoor activities',
    is_active: true,
    imageUrl: 'https://example.com/adventure.jpg',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'City Tour',
    description: 'Urban exploration experiences',
    is_active: true,
    imageUrl: 'https://example.com/city-tour.jpg',
    created_at: '2024-01-02T00:00:00Z'
  }
];

export const mockBanners = [
  {
    id: 1,
    name: 'Summer Sale',
    description: 'Get 20% off on all activities',
    imageUrl: 'https://example.com/summer-sale.jpg',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  }
];

export const mockPromos = [
  {
    id: 1,
    title: 'Summer Discount',
    promo_code: 'SUMMER20',
    description: 'Get 20% off on all activities',
    promo_discount_price: 200000,
    minimum_claim_price: 1000000,
    is_active: true,
    imageUrl: 'https://example.com/summer-promo.jpg',
    created_at: '2024-01-01T00:00:00Z'
  }
];

export const mockTransactions = [
  {
    id: 1,
    user: {
      id: 2,
      name: 'John Doe',
      email: 'john@example.com'
    },
    totalAmount: 1200000,
    status: 'success',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    user: {
      id: 3,
      name: 'Jane Smith',
      email: 'jane@example.com'
    },
    totalAmount: 800000,
    status: 'pending',
    createdAt: '2024-01-02T00:00:00Z'
  }
];

export const mockUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+6281234567890',
    role: 'admin',
    is_active: true,
    profile_picture: 'https://example.com/admin.jpg',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Regular User',
    email: 'user@example.com',
    phone: '+6281234567891',
    role: 'user',
    is_active: true,
    profile_picture: 'https://example.com/user.jpg',
    created_at: '2024-01-02T00:00:00Z'
  }
];

// Test helper functions
export const testAdminAccess = (component, userRole = 'admin') => {
  const mockUser = userRole === 'admin' ? mockAdminUser : mockRegularUser;
  return { user: mockUser };
};

export const testApiResponse = (data, success = true) => {
  if (success) {
    return Promise.resolve({ data });
  } else {
    return Promise.reject(new Error('API Error'));
  }
};

export const testFilters = {
  searchTerm: '',
  dateFrom: '',
  dateTo: '',
  status: [],
  category: 'all',
  minPrice: '',
  maxPrice: ''
}; 