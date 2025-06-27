import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Loader from '../../components/UI/Loader';
import { USER_ROLES } from '../../utils/constants';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { token, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!token) {
    return (
      <Navigate to="/login" state={{ from: window.location.pathname }} replace />
    );
  }

  // Check if admin role is required but user is not admin
  if (requireAdmin && user?.role !== USER_ROLES.ADMIN) {
    return (
      <Navigate to="/" replace />
    );
  }

  return children;
};

ProtectedRoute.defaultProps = {
  children: null,
  requireAdmin: false,
};

export default ProtectedRoute;