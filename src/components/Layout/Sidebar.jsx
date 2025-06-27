const Sidebar = () => (
  <aside className="w-64 bg-gray-100 p-4 rounded-lg shadow-md">
    <nav>
      <ul className="space-y-2">
        <li><a href="/admin" className="text-blue-700 hover:underline">Dashboard</a></li>
        <li><a href="/admin/activities" className="text-blue-700 hover:underline">Activities</a></li>
        <li><a href="/admin/categories" className="text-blue-700 hover:underline">Categories</a></li>
        <li><a href="/admin/banners" className="text-blue-700 hover:underline">Banners</a></li>
        <li><a href="/admin/promos" className="text-blue-700 hover:underline">Promos</a></li>
        <li><a href="/admin/transactions" className="text-blue-700 hover:underline">Transactions</a></li>
        <li><a href="/admin/users" className="text-blue-700 hover:underline">Users</a></li>
      </ul>
    </nav>
  </aside>
);

export default Sidebar;
