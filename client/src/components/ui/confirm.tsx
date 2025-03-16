import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { cva } from 'class-variance-authority';

// Define variants for different confirmation types
const iconContainerVariants = cva(
  "flex items-center justify-center w-12 h-12 rounded-full mb-4 mx-auto",
  {
    variants: {
      variant: {
        default: "bg-blue-100 text-blue-600",
        destructive: "bg-red-100 text-red-600",
        warning: "bg-amber-100 text-amber-600",
        success: "bg-green-100 text-green-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface ConfirmProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  confirmIcon?: React.ReactNode;
  icon?: React.ReactNode;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: 'default' | 'destructive' | 'warning' | 'success';
}

const MotionDialogContent = motion(AlertDialogContent);

export const Confirm: React.FC<ConfirmProps> = ({
  open,
  setOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'default',
  confirmIcon,
  icon,
  onConfirm,
  onCancel,
  variant = 'default',
}) => {
  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setOpen(false);
  };

  // Default icons based on variant
  const getDefaultIcon = () => {
    if (icon) return icon;
    
    switch (variant) {
      case 'destructive':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'success':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        );
      default:
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  // Animation variants
  const contentVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring",
        damping: 25,
        stiffness: 500
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: 20,
      transition: { 
        duration: 0.2 
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    },
    tap: { scale: 0.95 }
  };
  
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AnimatePresence>
        {open && (
          <MotionDialogContent
            className="rounded-xl border-none shadow-lg max-w-md"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={contentVariants}
          >
            <div className={iconContainerVariants({ variant })}>
              {getDefaultIcon()}
            </div>
            <AlertDialogHeader className="space-y-2 text-center">
              <AlertDialogTitle className={`text-xl font-bold ${
                variant === 'destructive' ? 'text-red-600' : 
                variant === 'warning' ? 'text-amber-600' : 
                variant === 'success' ? 'text-green-600' : 
                'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'
              }`}>
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 text-base">
                {message}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6">
              <AlertDialogCancel asChild>
                <motion.button
                  className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50 w-full sm:w-auto"
                  onClick={handleCancel}
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  aria-label={cancelText}
                  tabIndex={0}
                >
                  {cancelText}
                </motion.button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <motion.button
                  className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 w-full sm:w-auto ${
                    confirmVariant === 'destructive' 
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 focus:ring-red-500' 
                      : confirmVariant === 'outline'
                      ? 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-400'
                      : confirmVariant === 'secondary'
                      ? 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-400'
                      : confirmVariant === 'ghost'
                      ? 'bg-transparent text-gray-900 hover:bg-gray-100 focus:ring-gray-400'
                      : confirmVariant === 'link'
                      ? 'bg-transparent text-blue-600 underline hover:text-blue-700 focus:ring-blue-500 shadow-none'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 focus:ring-blue-500'
                  }`}
                  onClick={handleConfirm}
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  aria-label={confirmText}
                  tabIndex={0}
                >
                  {confirmIcon}
                  {confirmText}
                </motion.button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </MotionDialogContent>
        )}
      </AnimatePresence>
    </AlertDialog>
  );
};
