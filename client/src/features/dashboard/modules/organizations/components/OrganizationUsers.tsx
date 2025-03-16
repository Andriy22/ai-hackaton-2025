import { User, UserRole as UserModuleRole } from '@/features/dashboard/modules/users/types/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash, UserCog, UserPlus } from 'lucide-react';
import { getReadableUserRole } from '@/lib/utils';
import { LoadingState, ErrorState } from '@/components/ui/feedback';
import { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import useOrganizationsStore from '../store/useOrganizationsStore';
import { AddUserToOrgDto, UserRole as OrgUserRole, UpdateUserRoleDto } from '../types/types';

// Helper function to map organization role to user module role for display purposes
const mapToUserModuleRole = (orgRole: string): UserModuleRole => {
  switch (orgRole) {
    case OrgUserRole.SUPER_ADMIN:
      return UserModuleRole.SUPER_ADMIN;
    case OrgUserRole.ORG_ADMIN:
      return UserModuleRole.ADMIN;
    case OrgUserRole.VALIDATOR:
      return UserModuleRole.VALIDATOR;
    default:
      return UserModuleRole.VALIDATOR;
  }
};

interface OrganizationUsersProps {
  organizationId: string;
}

export const OrganizationUsers = ({
  organizationId,
}: OrganizationUsersProps) => {
  const {
    organizationUsers: users,
    isLoadingUsers: isLoading,
    error,
    fetchOrganizationUsers,
    addUserToOrganization,
    removeUserFromOrganization,
    updateUserRole,
  } = useOrganizationsStore();

  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<OrgUserRole>(OrgUserRole.ORG_ADMIN);
  
  // Form state for adding a new user
  const [formData, setFormData] = useState<AddUserToOrgDto>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    role: OrgUserRole.ORG_ADMIN
  });

  useEffect(() => {
    if (organizationId) {
      fetchOrganizationUsers(organizationId);
    }
  }, [organizationId, fetchOrganizationUsers]);

  if (isLoading) {
    return <LoadingState message="Loading users..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  const handleAddUser = () => {
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      role: OrgUserRole.ORG_ADMIN
    });
    setIsAddUserDialogOpen(true);
  };

  const handleOpenRoleDialog = (user: User) => {
    setSelectedUser(user);
    // Map user's role to organization user role
    const orgRole = user.role === 'ORG_ADMIN' 
      ? OrgUserRole.ORG_ADMIN 
      : user.role === 'SUPER_ADMIN'
      ? OrgUserRole.SUPER_ADMIN
      : OrgUserRole.VALIDATOR;
      
    setSelectedRole(orgRole);
    setIsRoleDialogOpen(true);
  };

  const handleRoleChange = (role: OrgUserRole) => {
    setSelectedRole(role);
  };

  const handleRoleUpdate = async () => {
    if (selectedUser && organizationId) {
      const updateData: UpdateUserRoleDto = {
        role: selectedRole,
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName
      };
      await updateUserRole(organizationId, selectedUser.id, updateData);
      setIsRoleDialogOpen(false);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (organizationId) {
      await removeUserFromOrganization(organizationId, userId);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (organizationId) {
      await addUserToOrganization(organizationId, formData);
      setIsAddUserDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Organization Users</h2>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={handleAddUser}
        >
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {users.length === 0 ? (
        <div className="rounded-md border border-dashed border-gray-300 p-8 text-center">
          <p className="text-gray-500">No users found in this organization</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={handleAddUser}
          >
            Add User
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Role
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {user.firstName?.charAt(0) || ''}{user.lastName?.charAt(0) || ''}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Badge 
                      variant={user.role === 'SUPER_ADMIN' ? "destructive" : 
                             user.role === 'ORG_ADMIN' ? "default" : "outline"}
                      className="font-normal"
                    >
                      {getReadableUserRole(mapToUserModuleRole(user.role))}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenRoleDialog(user)}
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                        aria-label={`Update role of ${user.firstName} ${user.lastName}`}
                      >
                        <UserCog className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveUser(user.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        aria-label={`Remove ${user.firstName} ${user.lastName}`}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Role Update Dialog */}
      <AlertDialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Update User Role</AlertDialogTitle>
            <AlertDialogDescription>
              Select a new role for {selectedUser?.firstName} {selectedUser?.lastName}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              {Object.values(OrgUserRole)
                .filter(role => role !== OrgUserRole.SUPER_ADMIN)
                .map((role) => (
                <div key={role} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`role-${role}`}
                    name="role"
                    value={role}
                    checked={selectedRole === role}
                    onChange={() => handleRoleChange(role)}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`role-${role}`} className="text-sm font-medium text-gray-700">
                    {getReadableUserRole(mapToUserModuleRole(role))}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button type="button" variant="outline" onClick={() => setIsRoleDialogOpen(false)}>Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={handleRoleUpdate}>Update Role</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add User Dialog */}
      <AlertDialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Add User to Organization</AlertDialogTitle>
            <AlertDialogDescription>
              Enter the details of the user you want to add to this organization.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form onSubmit={handleAddUserSubmit}>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleFormChange}
                  className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleFormChange}
                  className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-700">User Role *</span>
                <div className="flex flex-col gap-2">
                  {Object.values(OrgUserRole)
                    .filter(role => role !== OrgUserRole.SUPER_ADMIN)
                    .map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`add-role-${role}`}
                        name="role"
                        value={role}
                        checked={formData.role === role}
                        onChange={() => setFormData({...formData, role})}
                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`add-role-${role}`} className="text-sm font-medium text-gray-700">
                        {getReadableUserRole(mapToUserModuleRole(role))}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button type="button" variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>Cancel</Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button type="submit">Add User</Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
