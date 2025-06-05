import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart as useCartNav } from '../../context/CartContext'; // Aliased
import { LogIn, UserPlus, Home, UserCircle, LogOut, ShoppingCart } from 'lucide-react'; 

const Navbar = () => {
  const { user, token, logout, loading: authLoading } = useAuth(); 
  const { cartItemCount, clearCartLocally } = useCartNav();
  // const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(); // This will call AuthContext's logout
    clearCartLocally(); // Clear cart from CartContext as well
    // Navigation is handled by AuthContext's logout
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold hover:text-blue-200 transition duration-300">
            TravelApp
          </Link>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link to="/" className="flex items-center px-2 py-2 sm:px-3 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-300">
              <Home size={18} className="mr-1" /> Home
            </Link>
            {!authLoading && token ? (
              <>
                <Link to="/profile" className="flex items-center px-2 py-2 sm:px-3 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-300">
                  <UserCircle size={18} className="mr-1" /> 
                  <span className="hidden sm:inline">{user?.name?.split(' ')[0] || user?.email || 'Profile'}</span>
                </Link>
                <Link to="/cart" className="flex items-center px-2 py-2 sm:px-3 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-300 relative">
                  <ShoppingCart size={18} className="mr-1" /> Cart
                  {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center bg-red-500 hover:bg-red-600 px-2 py-2 sm:px-3 rounded-md text-sm font-medium transition duration-300"
                >
                  <LogOut size={18} className="mr-1" /> 
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : !authLoading ? ( // Ensure not to show login/register if auth is still loading
              <>
                <Link to="/login" className="flex items-center px-2 py-2 sm:px-3 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-300">
                  <LogIn size={18} className="mr-1" /> Login
                </Link>
                <Link to="/register" className="flex items-center bg-green-500 hover:bg-green-600 px-2 py-2 sm:px-3 rounded-md text-sm font-medium transition duration-300">
                  <UserPlus size={18} className="mr-1" /> Register
                </Link>
              </>
            ) : null } {/* Render nothing for auth links if authLoading is true */}
             {authLoading && <span className="text-sm px-3 py-2">Loading...</span>}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;