import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useUsersStore from '../store/useUsersStore';
import { ArrowLeft, Edit, Trash, User as UserIcon, Mail, Calendar, Clock, Shield } from 'lucide-react';
import { paths } from '@/routes/paths';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole, UserUpdateDto } from '../types/types';
import { toast } from '@/lib/toast';
import { Confirm } from '@/components/ui/confirm';
import { motion, AnimatePresence } from 'framer-motion';
import { getReadableUserRole } from '@/lib/utils';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const UserDetails = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [formData, setFormData] = useState<UserUpdateDto>({});
  
  const {
    selectedUser,
    isLoading,
    error,
    fetchUserById,
    deleteUser,
    updateUser
  } = useUsersStore();

  useEffect(() => {
    if (userId) {
      fetchUserById(userId);
    }
  }, [userId, fetchUserById]);

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        email: selectedUser.email,
        role: selectedUser.role
      });
    }
  }, [selectedUser]);

  const handleBack = () => {
    navigate(paths.dashboard);
  };

  const handleDelete = async () => {
    if (userId) {
      await deleteUser(userId);
      toast.success('User deleted successfully');
      navigate(paths.dashboard);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      await updateUser(userId, formData);
      setIsSheetOpen(false);
      toast.success('User updated successfully');
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  if (isLoading) {
    return (
      <motion.div 
        className="flex h-screen w-full items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-t-4 border-b-4 border-primary"></div>
          <p className="text-lg font-medium text-gray-700">Loading user details...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="overflow-hidden rounded-lg bg-red-50 p-8 shadow-lg">
          <div className="mb-6 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <p className="mb-4 text-center text-xl font-bold text-red-600">Oops! Something went wrong</p>
          <p className="mb-6 text-center text-gray-700">{error}</p>
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="inline-flex items-center rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-md transition-all hover:from-blue-600 hover:to-indigo-700"
              aria-label="Go back to dashboard"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleBack()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!selectedUser) {
    return (
      <motion.div 
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="overflow-hidden rounded-lg bg-yellow-50 p-8 shadow-lg">
          <div className="mb-6 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
              <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <p className="mb-4 text-center text-xl font-bold text-yellow-600">User Not Found</p>
          <p className="mb-6 text-center text-gray-700">We couldn't find the user you're looking for.</p>
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="inline-flex items-center rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-md transition-all hover:from-blue-600 hover:to-indigo-700"
              aria-label="Go back to dashboard"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleBack()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div 
        className="container mx-auto px-4 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="mb-6 flex items-center justify-between"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50"
            aria-label="Go back to dashboard"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleBack()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </motion.button>
          <motion.div className="flex space-x-3">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-blue-600 hover:to-indigo-700"
                  aria-label="Edit user"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit User
                </motion.button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-md p-6">
                <SheetHeader className="mb-4">
                  <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">Edit User</SheetTitle>
                  <SheetDescription className="text-muted-foreground">
                    Make changes to user information here.
                  </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 pt-4">
                    <div className="grid grid-cols-4 items-center gap-3">
                      <Label htmlFor="firstName" className="text-right text-sm font-medium">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="Enter first name"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-3">
                      <Label htmlFor="lastName" className="text-right text-sm font-medium">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Enter last name"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-3">
                      <Label htmlFor="email" className="text-right text-sm font-medium">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter email"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-3">
                      <Label htmlFor="role" className="text-right text-sm font-medium">
                        Role
                      </Label>
                      <div className="col-span-3">
                        <Select
                          value={formData.role}
                          onValueChange={(value: string) => setFormData({ ...formData, role: value as UserRole })}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={UserRole.SUPER_ADMIN}>Super Admin</SelectItem>
                            <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                            <SelectItem value={UserRole.VALIDATOR}>Validator</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      className="px-4 py-2 rounded-md border border-gray-200 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 text-sm font-medium text-white shadow-md transition-all hover:from-blue-600 hover:to-indigo-700"
                    >
                      Save Changes
                    </motion.button>
                  </div>
                </form>
              </SheetContent>
            </Sheet>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center rounded-md bg-gradient-to-r from-red-500 to-pink-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-red-600 hover:to-pink-700"
              onClick={() => setIsDeleteConfirmOpen(true)}
              aria-label="Delete user"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete User
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={stagger}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          <motion.div 
            variants={fadeInUp}
            className="md:col-span-1"
          >
            <div className="overflow-hidden rounded-lg bg-white shadow-lg">
              <div className="p-6">
                <div className="flex flex-col items-center justify-center">
                  <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md">
                    <UserIcon className="h-12 w-12 text-white" />
                  </div>
                  <h2 className="text-center text-2xl font-bold text-gray-900">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h2>
                  <p className="mt-1 text-center text-sm text-gray-500 flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    {selectedUser.email}
                  </p>
                  <div className="mt-4 w-full">
                    <div className="flex justify-center">
                      <span className={`
                        inline-flex items-center rounded-full px-3 py-1 text-sm font-medium
                        ${selectedUser.role === UserRole.SUPER_ADMIN
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : selectedUser.role === UserRole.ADMIN
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : selectedUser.role === UserRole.VALIDATOR
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-gray-100 text-gray-800 border border-gray-200'
                        }
                      `}>
                        <Shield className="mr-1 h-4 w-4" />
                        {getReadableUserRole(selectedUser.role)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            className="md:col-span-2"
          >
            <div className="overflow-hidden rounded-lg bg-white shadow-lg">
              <div className="border-b border-gray-200 px-6 py-4">
                <h3 className="text-xl font-semibold text-gray-900">User Information</h3>
              </div>
              <div className="p-6">
                <dl className="space-y-6">
                  <motion.div variants={fadeInUp} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="overflow-hidden rounded-lg bg-blue-50 p-4">
                      <dt className="text-sm font-medium text-blue-500 flex items-center mb-1">
                        <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                        User ID
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-gray-900 truncate">{selectedUser.id}</dd>
                    </div>
                    <div className="overflow-hidden rounded-lg bg-indigo-50 p-4">
                      <dt className="text-sm font-medium text-indigo-500 flex items-center mb-1">
                        <Shield className="mr-2 h-4 w-4" />
                        Role
                      </dt>
                      <dd className="mt-1">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          selectedUser.role === UserRole.SUPER_ADMIN
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : selectedUser.role === UserRole.ADMIN
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : selectedUser.role === UserRole.VALIDATOR
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                          {getReadableUserRole(selectedUser.role)}
                        </span>
                      </dd>
                    </div>
                  </motion.div>
                  <motion.div variants={fadeInUp} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="overflow-hidden rounded-lg bg-green-50 p-4">
                      <dt className="text-sm font-medium text-green-500 flex items-center mb-1">
                        <Calendar className="mr-2 h-4 w-4" />
                        Created At
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-gray-900">
                        {new Date(selectedUser.createdAt).toLocaleString()}
                      </dd>
                    </div>
                    <div className="overflow-hidden rounded-lg bg-amber-50 p-4">
                      <dt className="text-sm font-medium text-amber-500 flex items-center mb-1">
                        <Clock className="mr-2 h-4 w-4" />
                        Last Updated
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-gray-900">
                        {new Date(selectedUser.updatedAt).toLocaleString()}
                      </dd>
                    </div>
                  </motion.div>
                  {/* Add additional user details here if needed */}
                </dl>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <Confirm
        open={isDeleteConfirmOpen}
        setOpen={setIsDeleteConfirmOpen}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="destructive"
        confirmIcon={<Trash className="h-4 w-4" />}
        onConfirm={handleDelete}
      />
    </AnimatePresence>
  );
};
