import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState(null);
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('id');

  // Global loading state
  const showLoading = () => setIsLoading(true);
  const hideLoading = () => setIsLoading(false);

  // Global error handling
  const showError = (message) => setGlobalError(message);
  const clearError = () => setGlobalError(null);

  // Theme management
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Language management
  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  // Initialize theme and language from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedLanguage = localStorage.getItem('language');
    
    if (savedTheme) setTheme(savedTheme);
    if (savedLanguage) setLanguage(savedLanguage);
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const value = {
    // Loading state
    isLoading,
    showLoading,
    hideLoading,
    
    // Error handling
    globalError,
    showError,
    clearError,
    
    // Theme
    theme,
    toggleTheme,
    
    // Language
    language,
    changeLanguage,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
