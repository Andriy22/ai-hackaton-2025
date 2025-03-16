import React from 'react';
import useAuthStore from '@/features/auth/store/useAuthStore';
import { Shield, Mail, Calendar, User, Key, Clock } from 'lucide-react';
import { getReadablUserRole } from '@/lib/utils';
import { UserRole } from '@/features/dashboard/modules/users/types/types';

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
    <div className="flex items-center gap-2 py-3 border-b border-gray-100 last:border-0">
      <div className="text-primary">{icon}</div>
      <div className="flex flex-col sm:flex-row sm:items-center w-full">
        <span className="font-medium text-gray-500 min-w-[120px]">{label}</span>
        <span className="text-gray-900">{value}</span>
      </div>
    </div>
  );

  const avatarUrl = user?.firstName 
    ? `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=6366f1&color=fff`
    : "https://via.placeholder.com/150";

  // Get readable role
  const getRole = () => {
    if (!user) return 'User';
    try {
      return getReadablUserRole(user.role as UserRole);
    } catch (error) {
      return String(user.role);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          {/* Header with background */}
          <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 h-32 sm:h-48">
            <div className="absolute -bottom-16 left-6 sm:left-10">
              <div className="relative">
                <div className="h-32 w-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
                  <img
                    src={avatarUrl}
                    alt={user ? `${user.firstName} ${user.lastName}` : 'Profile'}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 px-6 sm:px-10 pb-8 sm:flex sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user ? `${user.firstName} ${user.lastName}` : 'John Doe'}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-gray-600">
                <Shield className="h-4 w-4 text-primary" />
                <span>{getRole()}</span>
              </div>
            </div>
          </div>

          {/* Tabs & Sections */}
          <div className="border-t border-gray-200">
            {/* Tabs - can be expanded in the future */}
            <div className="flex border-b border-gray-200 overflow-x-auto">
              <button className="px-6 py-3 text-primary font-medium border-b-2 border-primary whitespace-nowrap">
                Profile
              </button>
            </div>

            {/* User Information Section */}
            <div className="p-6 sm:p-10">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Personal Information</h2>
              
              {user ? (
                <div className="space-y-1 divide-y divide-gray-100">
                  <InfoRow 
                    icon={<User className="h-5 w-5" />} 
                    label="User ID" 
                    value={user.id} 
                  />
                  <InfoRow 
                    icon={<Mail className="h-5 w-5" />} 
                    label="Email" 
                    value={user.email} 
                  />
                  <InfoRow 
                    icon={<Key className="h-5 w-5" />} 
                    label="Role" 
                    value={getRole()} 
                  />
                  {user.organizationId && (
                    <InfoRow 
                      icon={<Shield className="h-5 w-5" />} 
                      label="Organization" 
                      value={user.organizationId} 
                    />
                  )}
                  <InfoRow 
                    icon={<Calendar className="h-5 w-5" />} 
                    label="Joined" 
                    value={formattedDate(user.createdAt)} 
                  />
                  <InfoRow 
                    icon={<Clock className="h-5 w-5" />} 
                    label="Last Updated" 
                    value={formattedDate(user.updatedAt)} 
                  />
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-gray-50 text-gray-600">
                  No user information available. Please log in again.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
