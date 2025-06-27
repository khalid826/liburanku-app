import { useAuth } from '../../context/AuthContext';

const LogoutButton = ({ onLogout }) => {
  const { logout } = useAuth();
  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    } else {
      await logout();
    }
  };
  return (
    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
      Logout
    </button>
  );
};

export default LogoutButton;
