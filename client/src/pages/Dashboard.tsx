import { Dropzone } from '@/components/features/Dropzone';
import { UserTable } from '@/features/dashboard/components/UserTable';

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold">Quick Stats</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Total Projects</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Tasks</p>
              <p className="text-2xl font-bold">5</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <p className="text-sm text-gray-600">Project A updated</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <p className="text-sm text-gray-600">New task assigned</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold">Upcoming Deadlines</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Project B Review</p>
              <p className="text-xs text-gray-500">Due in 2 days</p>
            </div>
            <div>
              <p className="text-sm font-medium">Team Meeting</p>
              <p className="text-xs text-gray-500">Tomorrow at 10:00 AM</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <UserTable />
      </div>
    </div>
  );
};

export default Dashboard;
