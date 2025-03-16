import { UserTable } from '@/features/dashboard/modules/users/components/UserTable';
import { OrganizationsTable } from '@/features/dashboard/modules/organizations/components/OrganizationsTable';
import { SystemValidationStatistics } from '@/features/dashboard/modules/admin/components/SystemValidationStatistics';
import useAuthStore from '@/features/auth/store/useAuthStore';
import { UserRole } from '@/features/dashboard/modules/users/types/types';
import { motion } from 'framer-motion';
import { BarChart3, Users, Building2, Activity } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto px-4 py-8"
    >  
      {/* Dashboard stats cards */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10"
      >
        <div className="rounded-lg bg-gradient-to-br from-blue-50 to-white p-6 shadow-md border border-blue-100">
          <div className="flex items-center mb-4">
            <Users className="h-6 w-6 text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-800">24</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Organizations</p>
              <p className="text-2xl font-bold text-gray-800">8</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-gradient-to-br from-green-50 to-white p-6 shadow-md border border-green-100">
          <div className="flex items-center mb-4">
            <Activity className="h-6 w-6 text-green-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
          </div>
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
        <div className="rounded-lg bg-gradient-to-br from-purple-50 to-white p-6 shadow-md border border-purple-100">
          <div className="flex items-center mb-4">
            <Building2 className="h-6 w-6 text-purple-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">System Status</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600">System Uptime</p>
              <p className="text-lg font-semibold text-gray-800">99.9%</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">API Performance</p>
              <p className="text-lg font-semibold text-gray-800">Excellent</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* System-wide Validation Statistics for Super Admin */}
      {isSuperAdmin && (
        <motion.section 
          variants={itemVariants}
          className="mb-12"
        >
          <div className="flex items-center mb-4">
            <BarChart3 className="h-6 w-6 text-indigo-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">System-wide Validation Analytics</h2>
          </div>
          <SystemValidationStatistics />
        </motion.section>
      )}

      {/* Tables section */}
      <motion.div 
        variants={itemVariants}
        className="space-y-12"
      >
        {/* Users table section */}
        <section>
          <div className="flex items-center mb-4">
            <Users className="h-6 w-6 text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Users</h2>
          </div>
          <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
            <UserTable />
          </div>
        </section>
        
        {/* Organizations table section */}
        <section>
          <div className="flex items-center mb-4">
            <Building2 className="h-6 w-6 text-purple-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Organizations</h2>
          </div>
          <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
            <OrganizationsTable />
          </div>
        </section>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
