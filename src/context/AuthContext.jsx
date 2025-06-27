import { createContext, useState, useEffect, useContext } from "react";
import { authService } from "../api"; // Uses the re-exported services
import { USER_ROLES } from "../utils/constants";
// import { useNavigate, useLocation } from 'react-router-dom'; // Added useLocation

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [loading, setLoading] = useState(true); // To track initial auth check
  const [error, setError] = useState(null);
  // const navigate = useNavigate();
  // const location = useLocation(); // To get previous location for redirect after login

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("authToken");
      if (storedToken) {
        setToken(storedToken); // Set token first
        try {
          const userData = await authService.getLoggedUser();
          setUser(userData.data);
        } catch (err) {
          console.error(
            "Failed to fetch user with stored token, logging out.",
            err
          );
          localStorage.removeItem("authToken");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []); // Removed token from dependency array to avoid re-running on token set

  // This is the login function within your AuthContext or useAuth hook's definition
  // (This is NOT in LoginForm.jsx)
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Call authService.loginUser. As confirmed, this returns the full JSON object.
      const apiResponse = await authService.loginUser({ email, password });

      // 2. Destructure 'token' and 'data' directly from 'apiResponse'.
      //    'token' is at the top level. 'data' is the user object.
      const { token, data: userDataFromResponse } = apiResponse; // THIS LINE IS THE KEY

      if (token) {
        // This condition should now be true
        localStorage.setItem("authToken", token);
        setToken(token); // Update AuthContext's 'token' state
        setUser(userDataFromResponse); // Update AuthContext's 'user' state with profile
        return { success: true, user: userDataFromResponse };
      } else {
        // This 'else' block SHOULD NOT BE REACHED if the network response is as you provided.
        console.error(
          "Critical Error: Token was null/undefined despite good network response."
        );
        throw new Error("Login failed: Token missing unexpectedly.");
      }
    } catch (err) {
      // This catch block handles network errors or errors thrown by authService.loginUser
      console.error("Login caught an error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to login. Please check your credentials.";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.registerUser(userData);
      return {
        success: true,
        message: response.message || "Registration successful! Please log in.",
      };
    } catch (err) {
      const errorMsg = err.message || "Failed to register. Please try again.";
      setError(errorMsg);
      return { success: false, error: errorMsg };
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
      console.error(
        "Logout API call failed, proceeding with client-side logout:",
        err
      );
    } finally {
      localStorage.removeItem("authToken");
      setToken(null);
      setUser(null);
      setLoading(false);
      // navigate('/login');
    }
  };

  // Admin utility functions
  const isAdmin = () => user?.role === USER_ROLES.ADMIN;
  const isUser = () => user?.role === USER_ROLES.USER;
  const hasRole = (role) => user?.role === role;
  const canAccessAdmin = () => isAdmin() && token;

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    setUser,
    setError,
    // Admin utilities
    isAdmin,
    isUser,
    hasRole,
    canAccessAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
