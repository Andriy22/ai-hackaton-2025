/* eslint-disable */
import { ErrorState, LoadingState, NotFoundState } from '@/components/ui/feedback';
import { paths } from '@/routes/paths';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useUsersStore from '../store/useUsersStore';
import { UserForm } from './UserForm';

export const UserEdit = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { selectedUser, isLoading, error, fetchUserById } = useUsersStore();
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
    return <LoadingState message="Loading user data..." />;
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        action={{
          label: "Back to User Details",
          onClick: handleBack
        }}
      />
    );
  }

  if (!selectedUser) {
    return (
      <NotFoundState
        title="User Not Found"
        message="The user you are looking for does not exist or you do not have permission to view it."
        action={{
          label: "Back to Dashboard",
          onClick: () => navigate(paths.dashboard)
        }}
      />
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
