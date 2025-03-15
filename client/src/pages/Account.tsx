import React from 'react';
import useAuthStore from '@/features/auth/store/useAuthStore';

const Account: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full">
              <img
                src="https://via.placeholder.com/150"
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold">{user ? user.firstName + ' ' + user.lastName : 'John Doe'}</h1>
            <p className="text-gray-600">{user ? user.role : 'Software Developer'}</p>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h1 className="text-2xl font-bold mb-4">User Information</h1>
              {user ? (
                <div className="space-y-2">
                  <p><strong>ID:</strong> {user.id}</p>
                  <p><strong>First Name:</strong> {user.firstName}</p>
                  <p><strong>Last Name:</strong> {user.lastName}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                  <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
                  <p><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
                </div>
              ) : (
                <p>No user information available.</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
