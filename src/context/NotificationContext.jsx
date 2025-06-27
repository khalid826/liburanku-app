import React, { createContext, useContext, useState } from 'react';
import Notification from '../components/UI/Notification';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = 'info', duration = 5000, position = 'top-right') => {
    // Remove any existing notification with the same message and type
    setNotifications(prev => prev.filter(n => !(n.message === message && n.type === type)));
    const id = Date.now() + Math.random();
    const newNotification = { id, message, type, duration, position };
    setNotifications(prev => [...prev, newNotification]);
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const showSuccess = (message, duration = 5000) => {
    return showNotification(message, 'success', duration);
  };

  const showError = (message, duration = 5000) => {
    return showNotification(message, 'error', duration);
  };

  const showWarning = (message, duration = 5000) => {
    return showNotification(message, 'warning', duration);
  };

  const showInfo = (message, duration = 5000) => {
    return showNotification(message, 'info', duration);
  };

  const value = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {/* Render notifications */}
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          position={notification.position}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext; 