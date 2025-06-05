import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/Layout/ProtectedRoute';

import HomePage from './pages/Public/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/User/ProfilePage';
import CategoryPage from './pages/Public/CategoryPage';
import ActivityDetailPage from './pages/Public/ActivityDetailPage';
import CartPage from './pages/User/CartPage';

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/category/:categoryId" element={<CategoryPage />} />
    <Route path="/activity/:activityId" element={<ActivityDetailPage />} />

    {/* Protected Routes */}
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/cart"
      element={
        <ProtectedRoute>
          <CartPage />
        </ProtectedRoute>
      }
    />

    {/* 404 */}
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

function App() {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen font-sans">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;
