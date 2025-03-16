import { User, UserRole } from '@/features/dashboard/modules/users/types/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash, UserCog, UserPlus } from 'lucide-react';
import { getReadablUserRole } from '@/lib/utils';
import { LoadingState, ErrorState } from '@/components/ui/feedback';
import { useState } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';

interface OrganizationUsersProps {
  organizationId: string;
  users: User[];
  isLoading: boolean;
  error: string | null;
  onRemoveUser: (userId: string) => void;
  onUpdateRole: (userId: string, role: UserRole) => void;
}

export const OrganizationUsers = ({
  organizationId,
  users,
  isLoading,
  error,
  onRemoveUser,
  onUpdateRole,
}: OrganizationUsersProps) => {
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.ADMIN);

  if (isLoading) {
    return <LoadingState message="Loading users..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  const handleAddUser = () => {
    // In a real implementation, this would open a modal or navigate to add user page
    console.log(`Adding user to organization ${organizationId}`);
  };

  const handleOpenRoleDialog = (user: User) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setIsRoleDialogOpen(true);
  };

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleRoleUpdate = () => {
    if (selectedUser) {
      onUpdateRole(selectedUser.id, selectedRole);
      setIsRoleDialogOpen(false);
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
                      variant={user.role === UserRole.SUPER_ADMIN ? "destructive" : 
                             user.role === UserRole.ADMIN ? "default" : "outline"}
                      className="font-normal"
                    >
                      {getReadablUserRole(user.role)}
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
                        onClick={() => onRemoveUser(user.id)}
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
              {Object.values(UserRole).map((role) => (
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
                    {getReadablUserRole(role)}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={handleRoleUpdate}>Update Role</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
