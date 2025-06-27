import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const NotFoundPage = ({ admin = false }) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[calc(100vh-15rem)] text-center px-4 ${admin ? 'bg-white' : ''}`}>
      <AlertTriangle className="text-[#EF7B24] w-24 h-24 mb-6" />
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Oops! The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Link
        to={admin ? "/admin" : "/"}
        className="px-6 py-3 bg-[#0B7582] text-white font-semibold rounded-lg shadow-md hover:bg-[#095e68] transition-colors duration-300"
      >
        {admin ? 'Go to Admin Dashboard' : 'Go to Homepage'}
      </Link>
    </div>
  );
};

export default NotFoundPage;