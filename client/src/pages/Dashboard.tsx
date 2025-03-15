import { UserTable } from '@/features/dashboard/modules/users/components/UserTable';
import { OrganizationsTable } from '@/features/dashboard/modules/organizations/components/OrganizationsTable';

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">  
      {/* Dashboard stats cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold">Overview</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold">24</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Organizations</p>
              <p className="text-2xl font-bold">8</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <p className="text-sm text-gray-600">New user registered</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <p className="text-sm text-gray-600">Organization updated</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold">System Status</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">System Uptime</p>
              <p className="text-xs text-gray-500">99.9%</p>
            </div>
            <div>
              <p className="text-sm font-medium">API Performance</p>
              <p className="text-xs text-gray-500">Excellent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tables section */}
      <div className="space-y-12">
        {/* Users table section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Users</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <UserTable />
          </div>
        </section>
        
        {/* Organizations table section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Organizations</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <OrganizationsTable />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
