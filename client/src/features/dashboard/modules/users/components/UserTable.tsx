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
  UserPlus,
  Users,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

  const handleRefresh = () => {
    if (fetchUsers) {
      fetchUsers();
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getRoleColorClass = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-200';
      case UserRole.ADMIN:
        return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200';
      case UserRole.VALIDATOR:
        return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-200';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-200';
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

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      <motion.div 
        variants={itemVariants}
        className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl shadow-sm"
      >
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-blue-700 bg-clip-text text-transparent">Users Management</h2>
          <p className="text-gray-600 mt-1">View and manage system users</p>
        </div>
        
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Filter className="h-4 w-4 text-indigo-500" />
            </div>
            <select
              value={role || 'ALL'}
              onChange={handleRoleFilterChange}
              className="w-full rounded-md border border-indigo-200 pl-10 pr-4 py-2 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 transition-all duration-200 bg-white"
              aria-label="Filter by role"
            >
              <option value="ALL">All Roles</option>
              <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
              <option value={UserRole.ADMIN}>Admin</option>
              <option value={UserRole.VALIDATOR}>Validator</option>
            </select>
          </div>
          
          <motion.button
            onClick={handleRefresh}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center rounded-md bg-white border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
            aria-label="Refresh users"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleRefresh()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </motion.button>
          
          <motion.button
            onClick={handleCreateUser}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 px-4 py-2 text-sm font-medium text-white shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
            aria-label="Create new user"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateUser()}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Create User
          </motion.button>
        </div>
      </motion.div>
      
      {error && (
        <motion.div 
          variants={itemVariants}
          className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-500 border border-red-200 shadow-sm"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="font-medium text-red-800">Error</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        </motion.div>
      )}
      
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-64 items-center justify-center rounded-xl bg-white p-8 shadow-sm border border-gray-100"
          >
            <div className="text-center">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full opacity-30 blur-sm"></div>
                <div className="relative h-12 w-12 animate-spin rounded-full border-4 border-indigo-400 border-t-transparent mx-auto"></div>
              </div>
              <p className="mt-4 text-lg font-medium text-gray-600">Loading users...</p>
            </div>
          </motion.div>
        ) : (!users || users.length === 0) ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-64 flex-col items-center justify-center rounded-xl bg-white p-8 shadow-sm border border-gray-100"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-500 mb-4">
              <Users className="h-8 w-8" />
            </div>
            <p className="mb-2 text-lg font-medium text-gray-800">No users found</p>
            <p className="text-sm text-gray-500 text-center max-w-md">
              {role ? `No users with the selected role found.` : `Create a new user to get started.`}
            </p>
            <motion.button
              onClick={handleCreateUser}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 inline-flex items-center rounded-md bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
              aria-label="Create new user"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateUser()}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Create First User
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            key="table"
            variants={itemVariants}
            className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-indigo-50 to-blue-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-indigo-700">
                      User
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-indigo-700">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-indigo-700">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-indigo-700">
                      Created
                    </th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-indigo-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  <AnimatePresence>
                    {users.map((user, index) => (
                      <motion.tr 
                        key={user.id}
                        custom={index}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-indigo-50/50 transition-colors duration-150"
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center">
                            <div className="relative group">
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-200"></div>
                              <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 font-medium text-indigo-700 border-2 border-white shadow-sm">
                                {getInitials(user.firstName, user.lastName)}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm text-gray-600">{user.email}</div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getRoleColorClass(user.role)}`}>
                            {getReadableUserRole(user.role)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                          <div className="flex justify-end space-x-1">
                            <motion.button
                              onClick={() => handleViewUser(user.id)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="rounded-full p-2 text-gray-500 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200"
                              aria-label={`View details for ${user.firstName} ${user.lastName}`}
                              tabIndex={0}
                              onKeyDown={(e) => e.key === 'Enter' && handleViewUser(user.id)}
                            >
                              <Eye className="h-5 w-5" />
                            </motion.button>
                            <motion.button
                              onClick={() => handleEditUser(user.id)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="rounded-full p-2 text-indigo-500 hover:bg-indigo-100 hover:text-indigo-700 transition-all duration-200"
                              aria-label={`Edit ${user.firstName} ${user.lastName}`}
                              tabIndex={0}
                              onKeyDown={(e) => e.key === 'Enter' && handleEditUser(user.id)}
                            >
                              <Edit className="h-5 w-5" />
                            </motion.button>
                            <motion.button
                              onClick={() => handleDeleteClick(user.id)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="rounded-full p-2 text-red-500 hover:bg-red-100 hover:text-red-700 transition-all duration-200"
                              aria-label={`Delete ${user.firstName} ${user.lastName}`}
                              tabIndex={0}
                              onKeyDown={(e) => e.key === 'Enter' && handleDeleteClick(user.id)}
                            >
                              <Trash className="h-5 w-5" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            
            {totalPages > 1 && (
              <div className="border-t border-gray-100 px-6 py-4 bg-gradient-to-r from-gray-50 to-indigo-50/30">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Show</span>
                    <select
                      value={limit}
                      onChange={handleLimitChange}
                      className="rounded-md border border-indigo-200 px-2 py-1 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-white transition-all duration-200"
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
                    <motion.button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      whileHover={page !== 1 ? { scale: 1.05 } : {}}
                      whileTap={page !== 1 ? { scale: 0.95 } : {}}
                      className="inline-flex items-center rounded-md border border-indigo-200 bg-white px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                      aria-label="Previous page"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handlePageChange(page - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </motion.button>
                    
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pageNum = i + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= page - 1 && pageNum <= page + 1)
                      ) {
                        return (
                          <motion.button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-all duration-200 ${
                              page === pageNum
                                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
                                : 'border border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50'
                            }`}
                            aria-label={`Page ${pageNum}`}
                            aria-current={page === pageNum ? 'page' : undefined}
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </motion.button>
                        );
                      }
                      
                      if (
                        (pageNum === 2 && page > 3) ||
                        (pageNum === totalPages - 1 && page < totalPages - 2)
                      ) {
                        return (
                          <span key={pageNum} className="inline-flex h-9 w-9 items-center justify-center text-sm text-gray-500">
                            ...
                          </span>
                        );
                      }
                      
                      return null;
                    })}
                    
                    <motion.button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      whileHover={page !== totalPages ? { scale: 1.05 } : {}}
                      whileTap={page !== totalPages ? { scale: 0.95 } : {}}
                      className="inline-flex items-center rounded-md border border-indigo-200 bg-white px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                      aria-label="Next page"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handlePageChange(page + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
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
    </motion.div>
  );
};
