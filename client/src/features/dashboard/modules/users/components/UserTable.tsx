import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types/types';
import useUsersStore from '../store/useUsersStore';
import { 
  ChevronLeft, 
  ChevronRight, 
  Trash, 
  Edit, 
  Eye, 
  Filter,
  UserPlus
} from 'lucide-react';
import { paths } from '@/routes/paths';
import { UserForm } from './UserForm';
import { getReadableUserRole } from '@/lib/utils';
import { Confirm } from '@/components/ui/confirm';

export const UserTable = () => {
  const navigate = useNavigate();
  const { 
    users = [], 
    total = 0,
    page = 1,
    limit = 10,
    totalPages = 0,
    role,
    isLoading = false, 
    error = null,
    fetchUsers, 
    deleteUser,
    setPage,
    setLimit,
    setRole,
    fetchUserById,
    selectedUser
  } = useUsersStore() || {}; 

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editUserId, setEditUserId] = useState<string | null>(null);

  useEffect(() => {
    if (fetchUsers) {
      fetchUsers();
    }
  }, [fetchUsers]);

  useEffect(() => {
    if (editUserId && fetchUserById) {
      fetchUserById(editUserId);
    }
  }, [editUserId, fetchUserById]);

  const handleRoleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!setRole) return;
    const selectedRole = e.target.value === 'ALL' ? null : e.target.value as UserRole;
    setRole(selectedRole);
  };

  const handlePageChange = (newPage: number) => {
    if (!setPage) return;
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!setLimit) return;
    setLimit(Number(e.target.value));
  };

  const handleViewUser = (userId: string) => {
    navigate(paths.users.details(userId));
  };

  const handleEditUser = (userId: string) => {
    setEditUserId(userId);
    setIsEditFormOpen(true);
  };

  const handleCloseEditForm = () => {
    setIsEditFormOpen(false);
    setEditUserId(null);
  };

  const handleDeleteClick = (userId: string) => {
    setShowDeleteConfirm(userId);
  };

  const handleDeleteConfirm = async (userId: string) => {
    if (!deleteUser) return;
    try {
      await deleteUser(userId);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(null);
  };

  const handleCreateUser = () => {
    setIsCreateFormOpen(true);
  };

  const handleCloseCreateForm = () => {
    setIsCreateFormOpen(false);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getRoleColorClass = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'bg-purple-100 text-purple-800';
      case UserRole.ADMIN:
        return 'bg-blue-100 text-blue-800';
      case UserRole.VALIDATOR:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-xl font-bold text-gray-800">Users</h2>
        
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={role || 'ALL'}
              onChange={handleRoleFilterChange}
              className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              aria-label="Filter by role"
            >
              <option value="ALL">All Roles</option>
              <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
              <option value={UserRole.ADMIN}>Admin</option>
              <option value={UserRole.VALIDATOR}>Validator</option>
            </select>
          </div>
          
          <button
            onClick={handleCreateUser}
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Create new user"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateUser()}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Create User
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-lg font-medium text-gray-600">Loading users...</p>
          </div>
        </div>
      ) : (!users || users.length === 0) ? (
        <div className="flex h-64 flex-col items-center justify-center">
          <p className="mb-4 text-lg font-medium text-gray-600">No users found</p>
          <p className="text-sm text-gray-500">
            Create a new user to get started.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 font-medium text-primary">
                        {getInitials(user.firstName, user.lastName)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getRoleColorClass(user.role)}`}>
                      {getReadableUserRole(user.role)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleViewUser(user.id)}
                        className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        aria-label={`View details for ${user.firstName} ${user.lastName}`}
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleViewUser(user.id)}
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEditUser(user.id)}
                        className="rounded p-1 text-blue-500 hover:bg-blue-100 hover:text-blue-700"
                        aria-label={`Edit ${user.firstName} ${user.lastName}`}
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleEditUser(user.id)}
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user.id)}
                        className="rounded p-1 text-red-500 hover:bg-red-100 hover:text-red-700"
                        aria-label={`Delete ${user.firstName} ${user.lastName}`}
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleDeleteClick(user.id)}
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Show</span>
            <select
              value={limit}
              onChange={handleLimitChange}
              className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              aria-label="Items per page"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span className="text-sm text-gray-700">per page</span>
          </div>
          
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(page * limit, total)}
            </span>{' '}
            of <span className="font-medium">{total}</span> users
          </div>
          
          <div className="flex space-x-1">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Previous page"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handlePageChange(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= page - 1 && pageNum <= page + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium ${
                      page === pageNum
                        ? 'bg-primary text-white'
                        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    aria-label={`Page ${pageNum}`}
                    aria-current={page === pageNum ? 'page' : undefined}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              }
              
              if (
                (pageNum === 2 && page > 3) ||
                (pageNum === totalPages - 1 && page < totalPages - 2)
              ) {
                return (
                  <span key={pageNum} className="inline-flex h-8 w-8 items-center justify-center text-sm text-gray-500">
                    ...
                  </span>
                );
              }
              
              return null;
            })}
            
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Next page"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handlePageChange(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      
      <Confirm
        open={!!showDeleteConfirm}
        setOpen={(open) => !open && setShowDeleteConfirm(null)}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="destructive"
        confirmIcon={<Trash className="h-4 w-4" />}
        onConfirm={() => showDeleteConfirm ? handleDeleteConfirm(showDeleteConfirm) : undefined}
        onCancel={handleDeleteCancel}
      />
      
      <UserForm
        isOpen={isCreateFormOpen}
        onClose={handleCloseCreateForm}
        isEditMode={false}
      />

      {selectedUser && (
        <UserForm
          user={selectedUser}
          isOpen={isEditFormOpen}
          onClose={handleCloseEditForm}
          isEditMode={true}
        />
      )}
    </div>
  );
};
