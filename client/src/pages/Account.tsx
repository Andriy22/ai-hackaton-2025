import { Button } from '@/components/ui/button';
import useAuthStore from '@/features/auth/store/useAuthStore';
import { UserRole } from '@/features/dashboard/modules/users/types/types';
import { getReadableUserRole } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Building, Calendar, Clock, Key, Mail, RefreshCw, Shield, User } from 'lucide-react';
import React from 'react';

const Account: React.FC = () => {
  const { user } = useAuthStore();

  const formattedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const InfoRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <motion.div 
      className="flex items-center gap-3 py-4 px-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg transition-all duration-200"
      whileHover={{ x: 5 }}
    >
      <div className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
        {icon}
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center w-full">
        <span className="font-medium text-gray-500 min-w-[140px]">{label}</span>
        <span className="text-gray-900 font-medium">{value}</span>
      </div>
    </motion.div>
  );

  const avatarUrl = user?.firstName ? `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=6366f1&color=fff` : "https://via.placeholder.com/150";

  // Get readable role
  const getRole = () => {
    if (!user) return 'User';
    try {
      return getReadableUserRole(user.role as UserRole);
    } catch (error) {
      return String(user.role);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="mx-auto max-w-5xl space-y-8 p-4"
    >
      {/* Header section with title and actions */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
            My Account
          </h1>
          <p className="text-gray-600 mt-1">
            View and manage your personal information
          </p>
        </div>
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            className="inline-flex items-center bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300 transition-all duration-200"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="mr-2 h-4 w-4 text-blue-600" />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Profile Card */}
      <motion.div 
        variants={itemVariants}
        className="rounded-xl bg-white p-8 shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-center mb-8 gap-6">
          <div className="flex-shrink-0">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-200"></div>
              <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-white">
                <img
                  src={avatarUrl}
                  alt={user ? `${user.firstName} ${user.lastName}` : 'Profile'}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
          <div className="flex-grow space-y-1 md:border-r md:pr-6 md:mr-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {user ? `${user.firstName} ${user.lastName}` : 'John Doe'}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium flex items-center">
                <Shield className="h-4 w-4 mr-1.5" />
                {getRole()}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium flex items-center">
                <Mail className="h-4 w-4 mr-1.5" />
                {user?.email || 'email@example.com'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Personal Information
            </h3>
            <div className="space-y-1">
              {user ? (
                <>
                  <InfoRow 
                    icon={<Key className="h-4 w-4" />} 
                    label="User ID" 
                    value={user.id} 
                  />
                  <InfoRow 
                    icon={<Mail className="h-4 w-4" />} 
                    label="Email" 
                    value={user.email} 
                  />
                  <InfoRow 
                    icon={<Shield className="h-4 w-4" />} 
                    label="Role" 
                    value={getRole()} 
                  />
                  {user.organizationId && (
                    <InfoRow 
                      icon={<Building className="h-4 w-4" />} 
                      label="Organization" 
                      value={user.organizationId} 
                    />
                  )}
                </>
              ) : (
                <div className="p-4 rounded-lg bg-gray-50 text-gray-600">
                  No user information available. Please log in again.
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Account Timeline
            </h3>
            <div className="space-y-1">
              {user ? (
                <>
                  <InfoRow 
                    icon={<Calendar className="h-4 w-4" />} 
                    label="Joined" 
                    value={formattedDate(user.createdAt)} 
                  />
                  <InfoRow 
                    icon={<Clock className="h-4 w-4" />} 
                    label="Last Updated" 
                    value={formattedDate(user.updatedAt)} 
                  />
                </>
              ) : (
                <div className="p-4 rounded-lg bg-gray-50 text-gray-600">
                  No timeline information available.
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Account;
