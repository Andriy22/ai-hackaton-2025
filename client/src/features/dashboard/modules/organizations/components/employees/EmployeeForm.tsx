import React from 'react';
import { motion } from 'framer-motion';
import { X, User, Briefcase, Calendar, Check, Loader2 } from 'lucide-react';
import {
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogContent
} from '@/components/ui/alert-dialog';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../../types/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface EmployeeFormProps {
  formData: CreateEmployeeDto | UpdateEmployeeDto;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isEdit: boolean;
  isLoading?: boolean;
}

const MotionAlertDialogContent = motion(AlertDialogContent);

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  formData,
  onChange,
  onSubmit,
  onClose,
  isEdit,
  isLoading = false
}) => {
  const title = isEdit ? 'Edit Employee' : 'Add New Employee';
  const description = isEdit
    ? 'Update the employee\'s information below.'
    : 'Enter the details of the new employee below.';
  const submitText = isEdit ? 'Update Employee' : 'Add Employee';
  const idPrefix = isEdit ? 'edit-' : '';

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
    exit: { opacity: 0, scale: 0.95, y: 10 }
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
      e.preventDefault();
      const form = (e.target as HTMLInputElement).form;
      if (form) {
        const inputs = Array.from(form.elements) as HTMLElement[];
        const index = inputs.indexOf(e.target as HTMLElement);
        if (index !== -1 && inputs[index + 1]) {
          (inputs[index + 1] as HTMLElement).focus();
        }
      }
    }
  };

  return (
    <MotionAlertDialogContent
      className="max-w-md rounded-xl shadow-lg overflow-hidden border-none"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={formVariants}
    >
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 -mx-6 -mt-6 px-6 py-4 mb-4">
        <div className="flex justify-between items-center">
          <AlertDialogTitle className="text-xl font-bold text-white">
            {title}
          </AlertDialogTitle>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="rounded-full p-1 text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            aria-label="Close dialog"
            tabIndex={0}
          >
            <X className="h-5 w-5" />
          </motion.button>
        </div>
        <AlertDialogDescription className="text-white/80 text-sm mt-1">
          {description}
        </AlertDialogDescription>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor={`${idPrefix}firstName`} className="text-sm font-medium flex items-center">
              <User className="h-4 w-4 mr-2 text-gray-500" />
              First Name
            </Label>
            <Input
              id={`${idPrefix}firstName`}
              name="firstName"
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={formData.firstName}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter first name"
              disabled={isLoading}
              required
              tabIndex={0}
              aria-label="First Name"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`${idPrefix}lastName`} className="text-sm font-medium flex items-center">
              <User className="h-4 w-4 mr-2 text-gray-500" />
              Last Name
            </Label>
            <Input
              id={`${idPrefix}lastName`}
              name="lastName"
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={formData.lastName}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter last name"
              disabled={isLoading}
              required
              tabIndex={0}
              aria-label="Last Name"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`${idPrefix}position`} className="text-sm font-medium flex items-center">
              <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
              Position
            </Label>
            <Input
              id={`${idPrefix}position`}
              name="position"
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={formData.position}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter position"
              disabled={isLoading}
              required
              tabIndex={0}
              aria-label="Position"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`${idPrefix}birthDate`} className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              Birth Date
            </Label>
            <Input
              id={`${idPrefix}birthDate`}
              name="birthDate"
              type="date"
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={formData.birthDate}
              onChange={onChange}
              disabled={isLoading}
              required
              tabIndex={0}
              aria-label="Birth Date"
            />
          </div>
        </motion.div>

        <motion.div
          className="mt-6 pt-4 border-t border-gray-100 flex justify-end space-x-3"
          variants={itemVariants}
        >
          <AlertDialogCancel asChild>
            <motion.button
              type="button"
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              className="px-4 py-2 rounded-md border border-gray-200 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50"
              disabled={isLoading}
              tabIndex={0}
              aria-label="Cancel"
            >
              Cancel
            </motion.button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <motion.button
              type="submit"
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 text-sm font-medium text-white shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
              disabled={isLoading}
              tabIndex={0}
              aria-label={submitText}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  {isEdit ? 'Updating...' : 'Adding...'}
                </span>
              ) : (
                <span className="flex items-center">
                  <Check className="h-4 w-4 mr-2" />
                  {submitText}
                </span>
              )}
            </motion.button>
          </AlertDialogAction>
        </motion.div>
      </form>
    </MotionAlertDialogContent>
  );
};

export default EmployeeForm;
