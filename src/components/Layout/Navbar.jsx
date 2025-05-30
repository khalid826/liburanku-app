import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, UserPlus, Home, UserCircle, LogOut } from 'lucide-react'; 

const Navbar = () => {
  const { user, token, logout, loading: authLoading } = useAuth(); // Get user and logout from context
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold hover:text-blue-200 transition duration-300">
            TravelApp
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-300">
              <Home size={18} className="mr-1" /> Home
            </Link>

            {!authLoading && token ? (
              <>
                <Link to="/profile" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-300">
                  <UserCircle size={18} className="mr-1" /> {user?.name || user?.email || 'Profile'}
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  <LogOut size={18} className="mr-1" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-300">
                  <LogIn size={18} className="mr-1" /> Login
                </Link>

                <Link to="/register" className="flex items-center bg-green-500 hover:bg-green-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300">
                  <UserPlus size={18} className="mr-1" /> Register
                </Link>
              </>
            )}

             {authLoading && <span className="text-sm">Loading...</span>}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;