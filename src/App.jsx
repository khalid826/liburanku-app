import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AppProvider } from './context/AppContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Navbar from './components/Layout/Navbar';
import WhatsAppButton from './components/Common/WhatsAppButton';
import Footer from './components/Layout/Footer';
import ScrollDirectionButton from './components/Common/ScrollDirectionButton';

// Public Pages
import HomePage from './pages/Public/HomePage';
import ActivityPage from './pages/Public/ActivityPage';
import CategoryPage from './pages/Public/CategoryPage';
import ActivityDetailPage from './pages/Public/ActivityDetailPage';
import SearchResultsPage from './pages/Public/SearchResultsPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import ErrorPage from './pages/ErrorPage';
import CategoryDetailPage from './pages/Public/CategoryDetailPage';

// User Pages
import ProfilePage from './pages/User/ProfilePage';
import CartPage from './pages/User/CartPage';
import CheckoutPage from './pages/User/CheckoutPage';
import TransactionPage from './pages/User/TransactionPage';
import TransactionDetailPage from './pages/User/TransactionDetailPage';

// Admin Pages
import Dashboard from './pages/Admin/Dashboard';
import ActivityManager from './pages/Admin/ActivityManager';
import CategoryManager from './pages/Admin/CategoryManager';
import BannerManager from './pages/Admin/BannerManager';
import PromoManager from './pages/Admin/PromoManager';
import TransactionManager from './pages/Admin/TransactionManager';
import AdminTransactionDetailPage from './pages/Admin/TransactionDetailPage';
import UserManager from './pages/Admin/UserManager';

// Admin CRUD Pages
import ActivityCreatePage from './pages/Admin/ActivityCreatePage';
import ActivityEditPage from './pages/Admin/ActivityEditPage';
import CategoryCreatePage from './pages/Admin/CategoryCreatePage';
import CategoryEditPage from './pages/Admin/CategoryEditPage';
import BannerCreatePage from './pages/Admin/BannerCreatePage';
import BannerEditPage from './pages/Admin/BannerEditPage';
import PromoCreatePage from './pages/Admin/PromoCreatePage';
import PromoEditPage from './pages/Admin/PromoEditPage';
import UserCreatePage from './pages/Admin/UserCreatePage';
import UserEditPage from './pages/Admin/UserEditPage';

// Conditional Navbar Component
function NavbarWrapper() {
  const { user } = useAuth();
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) {
    return null;
  }
  return <Navbar />;
}

// Conditional Footer Component
function FooterWrapper() {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) {
    return null;
  }
  return <Footer />;
}

// Conditional WhatsApp Button Component
function WhatsAppButtonWrapper() {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) {
    return null;
  }
  return <WhatsAppButton />;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollToTop />
      {/* Conditional Navbar Rendering */}
      <NavbarWrapper />
      
      {/* Main Content */}
      <main className="pt-0">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/activities" element={<ActivityPage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/category/:id" element={<CategoryDetailPage />} />
          <Route path="/activity/:id" element={<ActivityDetailPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* User Routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path="/transactions" element={
            <ProtectedRoute>
              <TransactionPage />
            </ProtectedRoute>
          } />
          <Route path="/transaction/:id" element={
            <ProtectedRoute>
              <TransactionDetailPage />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/activities" element={
            <ProtectedRoute requireAdmin>
              <ActivityManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/activities/create" element={
            <ProtectedRoute requireAdmin>
              <ActivityCreatePage />
            </ProtectedRoute>
          } />
          <Route path="/admin/activities/:id/edit" element={
            <ProtectedRoute requireAdmin>
              <ActivityEditPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/categories" element={
            <ProtectedRoute requireAdmin>
              <CategoryManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/categories/create" element={
            <ProtectedRoute requireAdmin>
              <CategoryCreatePage />
            </ProtectedRoute>
          } />
          <Route path="/admin/categories/:id/edit" element={
            <ProtectedRoute requireAdmin>
              <CategoryEditPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/banners" element={
            <ProtectedRoute requireAdmin>
              <BannerManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/banners/create" element={
            <ProtectedRoute requireAdmin>
              <BannerCreatePage />
            </ProtectedRoute>
          } />
          <Route path="/admin/banners/:id/edit" element={
            <ProtectedRoute requireAdmin>
              <BannerEditPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/promos" element={
            <ProtectedRoute requireAdmin>
              <PromoManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/promos/create" element={
            <ProtectedRoute requireAdmin>
              <PromoCreatePage />
            </ProtectedRoute>
          } />
          <Route path="/admin/promos/:id/edit" element={
            <ProtectedRoute requireAdmin>
              <PromoEditPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/transactions" element={
            <ProtectedRoute requireAdmin>
              <TransactionManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/transactions/:id" element={
            <ProtectedRoute requireAdmin>
              <AdminTransactionDetailPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute requireAdmin>
              <UserManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/users/create" element={
            <ProtectedRoute requireAdmin>
              <UserCreatePage />
            </ProtectedRoute>
          } />
          <Route path="/admin/users/:id/edit" element={
            <ProtectedRoute requireAdmin>
              <UserEditPage />
            </ProtectedRoute>
          } />
          
          {/* Admin 404 Route: must be before the global * route */}
          <Route path="/admin/*" element={
            <ProtectedRoute requireAdmin>
              <NotFoundPage admin={true} />
            </ProtectedRoute>
          } />
          
          {/* Error Routes */}
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="/terms" element={<ErrorPage />} />
          <Route path="/privacy" element={<ErrorPage />} />
          <Route path="/cookies" element={<ErrorPage />} />
          <Route path="/sitemap" element={<ErrorPage />} />
          <Route path="/help" element={<ErrorPage />} />
          <Route path="/faq" element={<ErrorPage />} />
          <Route path="/refund" element={<ErrorPage />} />
          <Route path="/about" element={<ErrorPage />} />
          <Route path="/contact" element={<ErrorPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>
      
      {/* Footer - Only show on public/user pages */}
      <FooterWrapper />
      
      {/* WhatsApp Button - Only show on public/user pages */}
      <WhatsAppButtonWrapper />
      
      {/* Floating Scroll Direction Button */}
      <ScrollDirectionButton />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <CartProvider>
          <AppProvider>
            <AppContent />
          </AppProvider>
        </CartProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
