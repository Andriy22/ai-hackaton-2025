import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useUsersStore from '../store/useUsersStore';
import { ArrowLeft, Edit, Trash, User as UserIcon } from 'lucide-react';
import { paths } from '@/routes/paths';

export const UserDetails = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const {
    selectedUser,
    isLoading,
    error,
    fetchUserById,
    deleteUser
  } = useUsersStore();

  useEffect(() => {
    if (userId) {
      fetchUserById(userId);
    }
  }, [userId, fetchUserById]);

  const handleBack = () => {
    navigate(paths.dashboard);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      if (userId) {
        await deleteUser(userId);
        navigate(paths.dashboard);
      }
    }
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
          aria-label="Go back to dashboard"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleBack()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!selectedUser) {
    return (
      <div className="rounded-lg bg-yellow-50 p-6 text-center">
        <p className="text-lg font-medium text-yellow-600">User not found</p>
        <button
          onClick={handleBack}
          className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          aria-label="Go back to dashboard"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleBack()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          aria-label="Go back to dashboard"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleBack()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
            aria-label="Edit user"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            aria-label="Delete user"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleDelete()}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <UserIcon className="h-8 w-8 text-primary" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedUser.firstName} {selectedUser.lastName}
              </h1>
              <p className="text-sm text-gray-500">{selectedUser.email}</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">User ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{selectedUser.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Role</dt>
              <dd className="mt-1">
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${selectedUser.role === 'SUPER_ADMIN'
                  ? 'bg-purple-100 text-purple-800'
                  : selectedUser.role === 'ORG_ADMIN'
                    ? 'bg-blue-100 text-blue-800'
                    : selectedUser.role === 'VALIDATOR'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                  {selectedUser.role}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(selectedUser.createdAt).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(selectedUser.updatedAt).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};
