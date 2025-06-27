# 🏝️ Liburanku - Travel Booking Application

A modern, responsive travel booking platform built with React and Vite. Liburanku allows users to discover, book, and manage travel activities with a seamless user experience.

![Liburanku App](public/liburanku.png)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Integration](#-api-integration)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🎯 User Features
- **Activity Discovery**: Browse and search through various travel activities
- **Category Filtering**: Filter activities by categories and locations
- **Advanced Search**: Search by activity name, location, and price range
- **Shopping Cart**: Add activities to cart with quantity management
- **Promo Codes**: Apply discount codes during checkout
- **Secure Checkout**: Multiple payment methods with secure transaction processing
- **Order Management**: View and track booking history
- **Payment Proof Upload**: Upload payment confirmation for pending transactions
- **User Profile**: Manage personal information and preferences
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 🔧 Admin Features
- **Dashboard**: Overview of transactions, users, and activities
- **Activity Management**: Create, edit, and delete travel activities
- **Category Management**: Manage activity categories
- **Banner Management**: Upload and manage promotional banners
- **Promo Management**: Create and manage discount codes
- **Transaction Management**: View and manage all user transactions
- **User Management**: Manage user accounts and roles
- **Advanced Filtering**: Filter and search through admin data

### 🎨 UI/UX Features
- **Modern Design**: Clean, intuitive interface with Tailwind CSS
- **Dark/Light Theme**: Toggle between themes (planned)
- **Loading States**: Smooth loading animations and skeleton screens
- **Error Handling**: Comprehensive error messages and fallbacks
- **Notifications**: Real-time success and error notifications
- **Breadcrumbs**: Easy navigation throughout the application
- **Image Carousel**: Interactive image galleries for activities
- **Responsive Grid**: Adaptive layouts for all screen sizes

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - Modern React with latest features
- **Vite 6.3.5** - Fast build tool and development server
- **React Router DOM 7.6.1** - Client-side routing
- **Tailwind CSS 4.1.8** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **Axios** - HTTP client for API requests

### State Management
- **React Context API** - Built-in state management
- **Custom Hooks** - Reusable logic and state management

### UI Components
- **Headless UI** - Unstyled, accessible UI components
- **Custom Components** - Tailored components for specific needs

### Development Tools
- **ESLint** - Code linting and formatting
- **PropTypes** - Runtime type checking
- **Vite** - Build tool and development server

### Additional Libraries
- **React Icons** - Icon library
- **React Toastify** - Toast notifications
- **jsPDF** - PDF generation for reports
- **XLSX** - Excel file handling
- **HTML2Canvas** - Screenshot functionality

## 📸 Screenshots

### Homepage
![Homepage](public/liburanku.png)

### Activity Details
- Interactive image carousel
- Price display with discount information
- Add to cart functionality
- Activity information and highlights

### Shopping Cart
- Item selection with checkboxes
- Real-time price updates
- Bulk delete functionality
- Proceed to checkout

### Checkout Process
- Payment method selection
- Promo code application
- Order summary
- Terms and conditions

### Admin Dashboard
- Transaction overview
- User management
- Activity management
- Analytics and reports

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/liburanku-app.git
cd liburanku-app
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
```

### Step 3: Environment Setup
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=https://travel-journal-api-bootcamp.do.dibimbing.id
VITE_API_KEY=24405e01-fbc1-45a5-9f5a-be13afcd757c
```

### Step 4: Start Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## 🔧 Environment Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `VITE_API_BASE_URL` | Base URL for API endpoints | `https://travel-journal-api-bootcamp.do.dibimbing.id` |
| `VITE_API_KEY` | API key for authentication | `24405e01-fbc1-45a5-9f5a-be13afcd757c` |

## 📖 Usage

### For Users
1. **Browse Activities**: Visit the homepage to see featured activities
2. **Search & Filter**: Use the search bar and filters to find specific activities
3. **View Details**: Click on any activity to see detailed information
4. **Add to Cart**: Select quantity and add activities to your cart
5. **Checkout**: Review cart, apply promo codes, and complete purchase
6. **Track Orders**: View transaction history and upload payment proofs

### For Admins
1. **Access Dashboard**: Login with admin credentials
2. **Manage Content**: Add, edit, or delete activities, categories, and banners
3. **Monitor Transactions**: View and manage user transactions
4. **User Management**: Manage user accounts and roles
5. **Analytics**: View reports and analytics

## 📁 Project Structure

```
liburanku-app/
├── public/                 # Static assets
│   ├── liburanku.png      # App logo
│   └── partners/          # Partner logos
├── src/
│   ├── api/              # API service files
│   │   ├── activityService.js
│   │   ├── authService.js
│   │   ├── bannerService.js
│   │   ├── cartService.js
│   │   ├── categoryService.js
│   │   ├── paymentService.js
│   │   ├── promoService.js
│   │   ├── transactionService.js
│   │   ├── uploadService.js
│   │   └── userService.js
│   ├── components/        # Reusable components
│   │   ├── Activity/      # Activity-related components
│   │   ├── Admin/         # Admin-specific components
│   │   ├── Auth/          # Authentication components
│   │   ├── Banner/        # Banner components
│   │   ├── Category/      # Category components
│   │   ├── Checkout/      # Checkout components
│   │   ├── Common/        # Shared components
│   │   ├── Layout/        # Layout components
│   │   ├── Promo/         # Promo components
│   │   ├── Transaction/   # Transaction components
│   │   └── UI/            # UI components
│   ├── context/           # React Context providers
│   │   ├── AppContext.jsx
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── NotificationContext.jsx
│   ├── hooks/             # Custom React hooks
│   │   ├── useApi.js
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   ├── useDebounce.js
│   │   ├── useImageUpload.js
│   │   ├── useLocalStorage.js
│   │   └── usePagination.js
│   ├── pages/             # Page components
│   │   ├── Admin/         # Admin pages
│   │   ├── Auth/          # Authentication pages
│   │   ├── Public/        # Public pages
│   │   └── User/          # User pages
│   ├── services/          # Service utilities
│   │   ├── apiClient.js
│   │   ├── errorHandler.js
│   │   └── tokenManager.js
│   ├── styles/            # Global styles
│   │   ├── components.css
│   │   └── index.css
│   ├── utils/             # Utility functions
│   │   ├── constants.js
│   │   ├── exportUtils.js
│   │   ├── formatters.js
│   │   ├── helpers.js
│   │   ├── testUtils.js
│   │   └── validators.js
│   ├── App.jsx            # Main App component
│   └── index.jsx          # Entry point
├── .env                   # Environment variables
├── .gitignore            # Git ignore file
├── eslint.config.js      # ESLint configuration
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
└── README.md             # This file
```

## 🔌 API Integration

The application integrates with a RESTful API with the following endpoints:

### Authentication
- `POST /api/v1/register` - User registration
- `POST /api/v1/login` - User login
- `GET /api/v1/user` - Get logged user info
- `POST /api/v1/logout` - User logout

### Activities
- `GET /api/v1/activities` - Get all activities
- `GET /api/v1/activity/:id` - Get activity by ID
- `GET /api/v1/activities-by-category/:id` - Get activities by category

### Cart & Transactions
- `GET /api/v1/carts` - Get user cart
- `POST /api/v1/add-cart` - Add item to cart
- `POST /api/v1/update-cart/:id` - Update cart item
- `DELETE /api/v1/delete-cart/:id` - Remove cart item
- `GET /api/v1/my-transactions` - Get user transactions
- `POST /api/v1/create-transaction` - Create transaction

### Admin Endpoints
- `GET /api/v1/all-user` - Get all users (admin)
- `POST /api/v1/update-user-role/:id` - Update user role
- `GET /api/v1/all-transactions` - Get all transactions (admin)

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables in Vercel dashboard

3. **Environment Variables in Vercel**
   - `VITE_API_BASE_URL`: Your API base URL
   - `VITE_API_KEY`: Your API key

4. **Deploy**
   - Vercel will automatically build and deploy your application
   - Your app will be available at `https://your-app.vercel.app`

### Build Commands
```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add proper error handling
- Include loading states
- Test on multiple devices
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Lucide](https://lucide.dev/) - Beautiful & consistent icon toolkit
- [Axios](https://axios-http.com/) - Promise based HTTP client

## 📞 Support

If you have any questions or need support, please:

1. Check the [Issues](https://github.com/yourusername/liburanku-app/issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

**Made with ❤️ by the Liburanku Team**
