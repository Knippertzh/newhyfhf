interface StatsGridProps {
  stats: {
    totalUsers: number;
    activeUsers: number;
    pendingUsers: number;
    totalCompanies: number;
  };
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
      <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/50">
        <h3 className="text-sm font-medium text-gray-400">Total Users</h3>
        <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
      </div>
      <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/50">
        <h3 className="text-sm font-medium text-gray-400">Active Users</h3>
        <p className="text-2xl font-bold text-white">{stats.activeUsers}</p>
      </div>
      <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/50">
        <h3 className="text-sm font-medium text-gray-400">Pending Users</h3>
        <p className="text-2xl font-bold text-white">{stats.pendingUsers}</p>
      </div>
      <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/50">
        <h3 className="text-sm font-medium text-gray-400">Companies</h3>
        <p className="text-2xl font-bold text-white">{stats.totalCompanies}</p>
      </div>
    </div>
  );
}