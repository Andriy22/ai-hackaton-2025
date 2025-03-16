import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Building, Trash, Users, UserRound } from 'lucide-react';
import useOrganizationsStore from '../store/useOrganizationsStore';
import { UpdateOrganizationDto, Employee, UpdateUserRoleDto, UserRole } from '../types/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { toast } from '@/lib/toast';
import { paths } from '@/routes/paths';
import { LoadingState, ErrorState, NotFoundState } from '@/components/ui/feedback';
import { Confirm } from '@/components/ui/confirm';
import { OrganizationTabs, OrganizationTabContent } from './OrganizationTabs';
import { OrganizationUsers } from './OrganizationUsers';
import { OrganizationEmployees } from './OrganizationEmployees';

export const OrganizationDetails = () => {
  const { organizationId } = useParams<{ organizationId: string }>();
  const navigate = useNavigate();
  const {
    selectedOrganization,
    fetchOrganization,
    updateOrganization,
    deleteOrganization,
    error,
    isLoading,
    organizationUsers,
    organizationEmployees,
    isLoadingUsers,
    isLoadingEmployees,
    removeUserFromOrganization,
    updateUserRole,
    deleteEmployee,
  } = useOrganizationsStore();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const [formData, setFormData] = useState<UpdateOrganizationDto>({
    name: '',
  });

  useEffect(() => {
    if (organizationId) {
      fetchOrganization(organizationId);
    }
  }, [organizationId, fetchOrganization]);

  useEffect(() => {
    if (selectedOrganization) {
      setFormData({
        name: selectedOrganization.name,
      });
    }
  }, [selectedOrganization]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationId || !selectedOrganization) return;

    try {
      await updateOrganization(organizationId, formData);
      setIsSheetOpen(false);
      toast.success('Organization updated successfully');
    } catch (error) {
      toast.error('Failed to update organization');
    }
  };

  const handleDelete = async () => {
    if (!organizationId) return;

    try {
      await deleteOrganization(organizationId);
      toast.success('Organization deleted successfully');
      navigate(paths.organizations.root);
    } catch (error) {
      toast.error('Failed to delete organization');
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // User management handlers
  const handleRemoveUser = async (userId: string) => {
    try {
      await removeUserFromOrganization(organizationId || '', userId);
    } catch (error) {
      console.error('Failed to remove user:', error);
    }
  };

  const handleUpdateUserRole = async (userId: string, role: UserRole) => {
    try {
      await updateUserRole(organizationId || '', userId, { role });
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  // Employee management handlers
  const handleEditEmployee = (employee: Employee) => {
    console.log('Edit employee:', employee);
    // In a real implementation, this would open a modal or navigate to edit employee page
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      await deleteEmployee(employeeId);
    } catch (error) {
      console.error('Failed to delete employee:', error);
    }
  };

  const handleAddEmployee = () => {
    console.log('Add employee to organization:', organizationId);
    // In a real implementation, this would open a modal or navigate to add employee page
  };

  if (isLoading) {
    return <LoadingState fullScreen message="Loading organization..." />;
  }

  if (error) {
    return (
      <ErrorState 
        message={error} 
        className="mt-8"
      />
    );
  }

  if (!selectedOrganization) {
    return (
      <NotFoundState
        title="Organization Not Found"
        message="The organization you are looking for does not exist or you do not have permission to view it."
        className="mt-8"
        action={{
          label: "Back to Organizations",
          onClick: () => navigate(paths.dashboard),
          variant: "outline"
        }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Organization Details</h1>
          <p className="text-gray-500">
            View and manage organization information
          </p>
        </div>
        <div className="flex gap-2">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="inline-flex items-center">
                Edit Organization
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Edit Organization</SheetTitle>
                <SheetDescription>
                  Make changes to your organization here. Click save when you're done.
                </SheetDescription>
              </SheetHeader>
              <form onSubmit={handleSubmit}>
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-4 items-center gap-3">
                    <Label htmlFor="name" className="text-right text-sm font-medium">
                      Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ name: e.target.value })}
                      placeholder="Enter name"
                      className="col-span-3"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
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
            aria-label="Delete organization"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center">
          <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Building className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{selectedOrganization.name}</h1>
            <p className="text-sm text-gray-500">ID: {selectedOrganization.id}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Created At</p>
            <p className="text-base text-gray-900">{new Date(selectedOrganization.createdAt).toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Updated At</p>
            <p className="text-base text-gray-900">{new Date(selectedOrganization.updatedAt).toLocaleString()}</p>
          </div>
        </div>
        
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{selectedOrganization._count?.users || 0}</p>
            </div>
          </div>
          <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
              <UserRound className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{selectedOrganization._count?.employees || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <OrganizationTabs defaultValue={activeTab} onChange={handleTabChange}>
          <OrganizationTabContent value="users">
            <OrganizationUsers
              organizationId={organizationId || ''}
              users={organizationUsers}
              isLoading={isLoadingUsers}
              error={error}
              onRemoveUser={handleRemoveUser}
              onUpdateRole={handleUpdateUserRole}
            />
          </OrganizationTabContent>
          <OrganizationTabContent value="employees">
            <OrganizationEmployees
              organizationId={organizationId || ''}
              employees={organizationEmployees}
              isLoading={isLoadingEmployees}
              error={error}
              onEditEmployee={handleEditEmployee}
              onDeleteEmployee={handleDeleteEmployee}
              onAddEmployee={handleAddEmployee}
            />
          </OrganizationTabContent>
        </OrganizationTabs>
      </div>

      <Confirm
        open={isDeleteConfirmOpen}
        setOpen={setIsDeleteConfirmOpen}
        title="Delete Organization"
        message="Are you sure you want to delete this organization? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="destructive"
        confirmIcon={<Trash className="h-4 w-4" />}
        onConfirm={handleDelete}
      />
    </div>
  );
};
