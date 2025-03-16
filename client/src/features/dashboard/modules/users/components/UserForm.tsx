import { useState, useEffect } from 'react';
import { User, UserRole } from '../types/types';
import useUsersStore from '../store/useUsersStore';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { User as UserIcon, Mail, Lock, Shield, X, Check, Loader2 } from 'lucide-react';

interface UserFormProps {
  user?: User;
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
}

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}

const MotionDialog = motion(DialogContent);

export const UserForm = ({ user, isOpen, onClose, isEditMode }: UserFormProps) => {
  const { createUser, updateUser, isLoading, error, clearError } = useUsersStore();
  
  const initialFormData: UserFormData = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    password: '',
    role: user?.role || UserRole.SUPER_ADMIN,
  };

  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setFormErrors({});
      clearError();
      setIsSubmitting(false);
    }
  }, [isOpen, user, clearError]);

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof UserFormData, string>> = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!isEditMode && !formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (!isEditMode && formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (formErrors[name as keyof UserFormData]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (value: string, name: keyof UserFormData) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      if (isEditMode && user) {
        // For edit mode, we don't send the password if it's empty
        const updateData = { ...formData };
        if (!updateData.password.trim()) {
          delete (updateData as any).password;
        }
        await updateUser(user.id, updateData);
      } else {
        await createUser(formData);
      }
      onClose();
    } catch (err) {
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring",
        damping: 25,
        stiffness: 500,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 10
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 500, damping: 25 }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <MotionDialog 
        className="sm:max-w-md rounded-xl shadow-lg overflow-hidden border-none"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={formVariants}
      >
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 -mx-6 -mt-6 px-6 py-4 mb-4">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold text-white">
              {isEditMode ? 'Edit User' : 'Create New User'}
            </DialogTitle>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="rounded-full p-1 text-white/80 hover:text-white hover:bg-white/20 transition-colors"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </motion.button>
          </div>
          {isEditMode ? (
            <p className="text-white/80 text-sm mt-1">Update user information</p>
          ) : (
            <p className="text-white/80 text-sm mt-1">Create a new user account</p>
          )}
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="my-2 p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-600 flex items-start"
          >
            <X className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div 
            className="space-y-1.5"
            variants={itemVariants}
          >
            <Label htmlFor="firstName" className="text-sm font-medium flex items-center">
              <UserIcon className="h-4 w-4 mr-2 text-gray-500" />
              First Name
            </Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all ${formErrors.firstName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
              disabled={isLoading || isSubmitting}
              placeholder="Enter first name"
            />
            {formErrors.firstName && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-xs text-red-500 mt-1 flex items-center"
              >
                <X className="h-3 w-3 mr-1" />
                {formErrors.firstName}
              </motion.p>
            )}
          </motion.div>
          
          <motion.div 
            className="space-y-1.5"
            variants={itemVariants}
          >
            <Label htmlFor="lastName" className="text-sm font-medium flex items-center">
              <UserIcon className="h-4 w-4 mr-2 text-gray-500" />
              Last Name
            </Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all ${formErrors.lastName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
              disabled={isLoading || isSubmitting}
              placeholder="Enter last name"
            />
            {formErrors.lastName && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-xs text-red-500 mt-1 flex items-center"
              >
                <X className="h-3 w-3 mr-1" />
                {formErrors.lastName}
              </motion.p>
            )}
          </motion.div>
          
          <motion.div 
            className="space-y-1.5"
            variants={itemVariants}
          >
            <Label htmlFor="email" className="text-sm font-medium flex items-center">
              <Mail className="h-4 w-4 mr-2 text-gray-500" />
              Email
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all ${formErrors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
              disabled={isLoading || isSubmitting}
              placeholder="name@example.com"
            />
            {formErrors.email && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-xs text-red-500 mt-1 flex items-center"
              >
                <X className="h-3 w-3 mr-1" />
                {formErrors.email}
              </motion.p>
            )}
          </motion.div>
          
          <motion.div 
            className="space-y-1.5"
            variants={itemVariants}
          >
            <Label htmlFor="password" className="text-sm font-medium flex items-center">
              <Lock className="h-4 w-4 mr-2 text-gray-500" />
              Password {isEditMode && (
                <span className="ml-1 text-xs text-gray-500 font-normal">(Leave blank to keep current password)</span>
              )}
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all ${formErrors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
              disabled={isLoading || isSubmitting}
              placeholder={isEditMode ? "••••••••" : "Enter password"}
            />
            {formErrors.password && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-xs text-red-500 mt-1 flex items-center"
              >
                <X className="h-3 w-3 mr-1" />
                {formErrors.password}
              </motion.p>
            )}
          </motion.div>
          
          <motion.div 
            className="space-y-1.5"
            variants={itemVariants}
          >
            <Label htmlFor="role" className="text-sm font-medium flex items-center">
              <Shield className="h-4 w-4 mr-2 text-gray-500" />
              Role
            </Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleSelectChange(value, 'role')}
              disabled={isLoading || isSubmitting}
            >
              <SelectTrigger 
                id="role"
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 w-full"
              >
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.SUPER_ADMIN}>Super Admin</SelectItem>
                <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                <SelectItem value={UserRole.VALIDATOR}>Validator</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
          
          <motion.div 
            className="mt-6 pt-4 border-t border-gray-100 flex justify-end space-x-3"
            variants={itemVariants}
          >
            <motion.button
              type="button"
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              onClick={onClose}
              disabled={isLoading || isSubmitting}
              className="px-4 py-2 rounded-md border border-gray-200 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              disabled={isLoading || isSubmitting}
              className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 text-sm font-medium text-white shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
            >
              {isLoading || isSubmitting ? (
                <span className="flex items-center">
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  {isEditMode ? 'Saving...' : 'Creating...'}
                </span>
              ) : (
                <span className="flex items-center">
                  <Check className="h-4 w-4 mr-2" />
                  {isEditMode ? 'Save Changes' : 'Create User'}
                </span>
              )}
            </motion.button>
          </motion.div>
        </form>
      </MotionDialog>
    </Dialog>
  );
};
