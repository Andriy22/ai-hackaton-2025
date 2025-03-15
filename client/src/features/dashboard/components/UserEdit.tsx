import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useDashboardStore from '../store/useDashboardStore';
import { UserForm } from './UserForm';
import { ArrowLeft } from 'lucide-react';
import { paths } from '@/routes/paths';

export const UserEdit = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { selectedUser, isLoading, error, fetchUserById } = useDashboardStore();
  const [isFormOpen, setIsFormOpen] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchUserById(userId);
    }
  }, [userId, fetchUserById]);

  const handleBack = () => {
    navigate(paths.users.details(userId));
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    navigate(paths.users.details(userId));
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg font-medium text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center">
        <p className="text-lg font-medium text-red-600">{error}</p>
        <button
          onClick={handleBack}
          className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          aria-label="Go back to user details"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleBack()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to User Details
        </button>
      </div>
    );
  }

  if (!selectedUser) {
    return (
      <div className="rounded-lg bg-yellow-50 p-6 text-center">
        <p className="text-lg font-medium text-yellow-600">User not found</p>
        <button
          onClick={() => navigate(paths.dashboard)}
          className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          aria-label="Go back to dashboard"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate(paths.dashboard)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <button
          onClick={handleBack}
          className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          aria-label="Go back to user details"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleBack()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to User Details
        </button>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h1 className="mb-6 text-2xl font-bold">Edit User</h1>
        <p className="mb-4 text-gray-600">
          You are editing user: <span className="font-medium">{selectedUser.firstName} {selectedUser.lastName}</span>
        </p>
      </div>

      <UserForm 
        user={selectedUser}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        isEditMode={true}
      />
    </div>
  );
};
