import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Loader from '../../components/UI/Loader';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

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

  return children;
};

ProtectedRoute.defaultProps = {
  children: null, // Default to null if no children are provided
};

export default ProtectedRoute;