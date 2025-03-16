import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useUsersStore from '../store/useUsersStore';
import { ArrowLeft, Edit, Trash, User as UserIcon } from 'lucide-react';
import { paths } from '@/routes/paths';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
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
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
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
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                className="inline-flex items-center"
                aria-label="Edit user"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md p-6">
              <SheetHeader>
                <SheetTitle>Edit User</SheetTitle>
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
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsSheetOpen(false)}
                    className="px-3"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="px-3">
                    Save Changes
                  </Button>
                </div>
              </form>
            </SheetContent>
          </Sheet>
          <Button
            variant="destructive"
            className="inline-flex items-center"
            onClick={() => setIsDeleteConfirmOpen(true)}
            aria-label="Delete user"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
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
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                  selectedUser.role === UserRole.SUPER_ADMIN
                    ? 'bg-purple-100 text-purple-800'
                    : selectedUser.role === UserRole.ADMIN
                    ? 'bg-blue-100 text-blue-800'
                    : selectedUser.role === UserRole.VALIDATOR
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
    </div>
  );
};
