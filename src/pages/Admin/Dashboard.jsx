import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { activityService, categoryService, transactionService, userService } from '../../api';
import AdminLayout from '../../components/Layout/AdminLayout';
import Loader from '../../components/UI/Loader';
import ErrorMessage from '../../components/UI/ErrorMessage';
import { 
  Users, 
  MapPin, 
  Tag, 
  Receipt, 
  TrendingUp, 
  Activity,
  Settings,
  BarChart3
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalActivities: 0,
    totalCategories: 0,
    totalTransactions: 0,
    pendingTransactions: 0,
    completedTransactions: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latest, setLatest] = useState({
    activities: [],
    users: [],
    transactions: []
  });

  useEffect(() => {
    fetchDashboardStats();
    fetchLatestLists();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch basic stats (in a real app, you'd have a dedicated stats endpoint)
      const [usersRes, activitiesRes, categoriesRes, transactionsRes] = await Promise.allSettled([
        userService.getAllUsers(),
        activityService.getActivities(),
        categoryService.getCategories(),
        transactionService.getAllTransactions()
      ]);

      const newStats = {
        totalUsers: usersRes.status === 'fulfilled' ? (usersRes.value?.data?.length || 0) : 0,
        totalActivities: activitiesRes.status === 'fulfilled' ? (activitiesRes.value?.data?.length || 0) : 0,
        totalCategories: categoriesRes.status === 'fulfilled' ? (categoriesRes.value?.data?.length || 0) : 0,
        totalTransactions: transactionsRes.status === 'fulfilled' ? (transactionsRes.value?.data?.length || 0) : 0,
        pendingTransactions: transactionsRes.status === 'fulfilled' 
          ? (transactionsRes.value?.data?.filter(t => t.status === 'pending')?.length || 0) : 0,
        completedTransactions: transactionsRes.status === 'fulfilled' 
          ? (transactionsRes.value?.data?.filter(t => t.status === 'success')?.length || 0) : 0
      };

      setStats(newStats);
    } catch (err) {
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestLists = async () => {
    try {
      const [usersRes, activitiesRes, , transactionsRes] = await Promise.allSettled([
        userService.getAllUsers(),
        activityService.getActivities(),
        categoryService.getCategories(), // still needed for stats, but ignore for latest
        transactionService.getAllTransactions()
      ]);
      const getSorted = (arr, dateKey = 'createdAt', count = 3) =>
        (arr || [])
          .slice()
          .sort((a, b) => new Date(b[dateKey] || b.created_at) - new Date(a[dateKey] || a.created_at))
          .slice(0, count);
      setLatest({
        activities: activitiesRes.status === 'fulfilled' ? getSorted(activitiesRes.value?.data, 'createdAt', 3) : [],
        users: usersRes.status === 'fulfilled' ? getSorted(usersRes.value?.data, 'created_at', 3) : [],
        transactions: transactionsRes.status === 'fulfilled' ? getSorted(transactionsRes.value?.data, 'createdAt', 3) : []
      });
    } catch (err) {
      // ignore for now
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="mb-8">
        <p className="text-gray-600">Welcome back, {user.name || user.email}!</p>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Activities</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalActivities}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Tag className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Categories</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalCategories}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Receipt className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Transactions</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalTransactions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Transactions</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingTransactions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Transactions</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.completedTransactions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Updates Section - Improved UI, no categories */}
      <div className="bg-white rounded-2xl shadow-lg border p-8 mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 tracking-tight">Latest Updates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Latest Activities */}
          <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-5 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="h-6 w-6 text-green-600" />
                <h3 className="font-semibold text-gray-700 text-lg">Activities</h3>
              </div>
              <Link to="/admin/activities" className="text-xs text-green-700 font-medium hover:underline">View All</Link>
            </div>
            <ul className="flex-1 space-y-3">
              {latest.activities.length === 0 && <li className="text-gray-400 text-sm">No data</li>}
              {latest.activities.map(act => (
                <li key={act.id} className="flex items-center gap-3 bg-white rounded-lg px-3 py-2 shadow border border-gray-100">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded bg-green-100 flex items-center justify-center">
                      <Activity className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{act.title}</div>
                    <div className="text-xs text-gray-500">{act.createdAt ? new Date(act.createdAt).toLocaleString() : ''}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* Latest Users */}
          <div className="bg-gradient-to-br from-[#e6f0fd] to-white rounded-xl p-5 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-[#0B7582]" />
                <h3 className="font-semibold text-gray-700 text-lg">Users</h3>
              </div>
              <Link to="/admin/users" className="text-xs text-[#0B7582] font-medium hover:underline">View All</Link>
            </div>
            <ul className="flex-1 space-y-3">
              {latest.users.length === 0 && <li className="text-gray-400 text-sm">No data</li>}
              {latest.users.map(user => (
                <li key={user.id} className="flex items-center gap-3 bg-white rounded-lg px-3 py-2 shadow border border-gray-100">
                  <img className="h-8 w-8 rounded-full object-cover" src={user.profile_picture || 'https://placehold.co/32x32/EBF4FF/76A9FA?text=U'} alt={user.name || user.email} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{user.name || user.email}</div>
                    <div className="text-xs text-gray-500">{user.created_at ? new Date(user.created_at).toLocaleString() : ''}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* Latest Transactions */}
          <div className="bg-gradient-to-br from-[#fff6ef] to-white rounded-xl p-5 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Receipt className="h-6 w-6 text-[#EF7B24]" />
                <h3 className="font-semibold text-gray-700 text-lg">Transactions</h3>
              </div>
              <Link to="/admin/transactions" className="text-xs text-[#EF7B24] font-medium hover:underline">View All</Link>
            </div>
            <ul className="flex-1 space-y-3">
              {latest.transactions.length === 0 && <li className="text-gray-400 text-sm">No data</li>}
              {latest.transactions.map(tx => (
                <li key={tx.id} className="flex items-center gap-3 bg-white rounded-lg px-3 py-2 shadow border border-gray-100">
                  <div className="flex-shrink-0">
                    <Receipt className="h-5 w-5 text-[#EF7B24]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{tx.id}</div>
                    <div className="text-xs text-gray-500">{tx.createdAt ? new Date(tx.createdAt).toLocaleString() : ''}</div>
                  </div>
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${tx.status === 'success' ? 'bg-[#fff6ef] text-[#EF7B24]' : tx.status === 'pending' ? 'bg-[#fff6ef] text-[#EF7B24]' : tx.status === 'failed' ? 'bg-[#fff6ef] text-[#EF7B24]' : 'bg-gray-100 text-gray-400'}`}>
                    {tx.status ? tx.status.charAt(0).toUpperCase() + tx.status.slice(1) : 'N/A'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
