import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true); // To track initial auth check
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const userData = await authService.getLoggedUser();
          setUser(userData.data); 

        } catch (err) {
          console.error("Failed to fetch user with stored token, logging out.", err);
          localStorage.removeItem('authToken');

          setToken(null);
          setUser(null);
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.loginUser({ email, password });

      if (response.data && response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        setToken(response.data.token);
        setUser(response.data.user || response.data);

        navigate('/');
        return true;

      } else {
        throw new Error(response.message || "Login failed: No token received");
      }

    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
      setLoading(false);

      return false;

    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.registerUser(userData);
      alert(response.message || "Registration successful! Please log in.");

      navigate('/login');
      return true;

    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
      setLoading(false);

      return false;

    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      await authService.logoutUser();

    } catch (err) {
      // Log error but proceed with client-side logout
      console.error("Logout API call failed, proceeding with client-side logout:", err);

    } finally {
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      setLoading(false);

      navigate('/login');
    }
  };
  
  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    setUser, // manual user update if needed
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};