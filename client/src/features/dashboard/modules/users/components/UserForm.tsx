import { useState, useEffect } from 'react';
import { User, UserRole } from '../types/types';
import useUsersStore from '../store/useUsersStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

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

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setFormErrors({});
      clearError();
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
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit User' : 'Create New User'}
          </DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="my-2 p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-600">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={formErrors.firstName ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {formErrors.firstName && (
              <p className="text-xs text-red-500">{formErrors.firstName}</p>
            )}
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={formErrors.lastName ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {formErrors.lastName && (
              <p className="text-xs text-red-500">{formErrors.lastName}</p>
            )}
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={formErrors.email ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {formErrors.email && (
              <p className="text-xs text-red-500">{formErrors.email}</p>
            )}
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="password">
              Password {isEditMode && '(Leave blank to keep current password)'}
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={formErrors.password ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {formErrors.password && (
              <p className="text-xs text-red-500">{formErrors.password}</p>
            )}
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleSelectChange(value, 'role')}
              disabled={isLoading}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.SUPER_ADMIN}>Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : isEditMode ? 'Save Changes' : 'Create User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
