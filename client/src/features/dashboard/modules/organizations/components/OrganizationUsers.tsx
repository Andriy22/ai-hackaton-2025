import { User, UserRole as UserModuleRole } from '@/features/dashboard/modules/users/types/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash, UserCog, UserPlus, Users, RefreshCw, Mail, FileText } from 'lucide-react';
import { getReadableUserRole } from '@/lib/utils';
import { LoadingState, ErrorState } from '@/components/ui/feedback';
import { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import useOrganizationsStore from '../store/useOrganizationsStore';
import { AddUserToOrgDto, UserRole as OrgUserRole, UpdateUserRoleDto } from '../types/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      {/* Header section with title and actions */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl"
      >
        <div className="space-y-1">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
            Organization Users
          </h2>
          <p className="text-gray-600 text-sm">
            Manage user access and permissions
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost"
            size="sm" 
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            onClick={() => organizationId && fetchOrganizationUsers(organizationId)}
            aria-label="Refresh user data"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 shadow-sm hover:shadow transition-all duration-200"
            onClick={handleAddUser}
          >
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </motion.div>

      {/* Users Content */}
      <AnimatePresence>
        {users.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center"
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="rounded-full bg-blue-50 p-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-800">No users found</h3>
              <p className="text-gray-500 max-w-md">
                No users have been added to this organization yet. Add users to grant them access to organizational resources.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 shadow-sm hover:shadow transition-all duration-200"
                onClick={handleAddUser}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-700">
                  Total Users: {users.length}
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
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
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full opacity-50 group-hover:opacity-100 blur transition duration-200"></div>
                            <div className="relative h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center border-2 border-white">
                              <span className="text-blue-700 font-medium">
                                {user.firstName?.charAt(0) || ''}{user.lastName?.charAt(0) || ''}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          {user.email}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <Badge 
                          variant={user.role === 'SUPER_ADMIN' ? "destructive" : 
                                user.role === 'ORG_ADMIN' ? "default" : "outline"}
                          className={`font-normal px-2.5 py-0.5 ${
                            user.role === 'SUPER_ADMIN' ? "bg-red-100 hover:bg-red-200 text-red-800" : 
                            user.role === 'ORG_ADMIN' ? "bg-blue-100 hover:bg-blue-200 text-blue-800" : 
                            "bg-gray-100 hover:bg-gray-200 text-gray-800"
                          } transition-colors duration-200`}
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
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-all duration-200 rounded-full"
                            aria-label={`Update role of ${user.firstName} ${user.lastName}`}
                          >
                            <UserCog className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveUser(user.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 transition-all duration-200 rounded-full"
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Role Update Dialog */}
      <AlertDialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <AlertDialogContent className="sm:max-w-md border-blue-100">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 -m-6 mb-0 p-6 rounded-t-lg">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold text-blue-700">Update User Role</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                Select a new role for {selectedUser?.firstName} {selectedUser?.lastName}.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <div className="grid gap-4 py-6">
            <RadioGroup 
              value={selectedRole} 
              onValueChange={(value) => handleRoleChange(value as OrgUserRole)}
              className="flex flex-col gap-3"
            >
              {Object.values(OrgUserRole)
                .filter(role => role !== OrgUserRole.SUPER_ADMIN)
                .map((role) => (
                <div key={role} className="flex items-center space-x-2 rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition-colors duration-200">
                  <RadioGroupItem id={`role-${role}`} value={role} className="text-blue-600" />
                  <Label htmlFor={`role-${role}`} className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                    <FileText className={`h-4 w-4 ${
                      role === OrgUserRole.ORG_ADMIN ? "text-blue-600" : "text-gray-400"
                    }`} />
                    {getReadableUserRole(mapToUserModuleRole(role))}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsRoleDialogOpen(false)}
                className="border-gray-200 hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button 
                onClick={handleRoleUpdate}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
              >
                Update Role
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add User Dialog */}
      <AlertDialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <AlertDialogContent className="sm:max-w-md border-blue-100">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 -m-6 mb-0 p-6 rounded-t-lg">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold text-blue-700">Add User to Organization</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                Enter the details of the user you want to add to this organization.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <form onSubmit={handleAddUserSubmit} className="py-4">
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="border-blue-200 focus:border-blue-400 transition-all duration-200"
                  placeholder="user@example.com"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    className="border-blue-200 focus:border-blue-400 transition-all duration-200"
                    placeholder="John"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    className="border-blue-200 focus:border-blue-400 transition-all duration-200"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  className="border-blue-200 focus:border-blue-400 transition-all duration-200"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="text-sm font-medium text-gray-700">
                  User Role <span className="text-red-500">*</span>
                </div>
                <RadioGroup 
                  value={formData.role} 
                  onValueChange={(value) => setFormData({...formData, role: value as OrgUserRole})}
                  className="flex flex-col gap-3"
                >
                  {Object.values(OrgUserRole)
                    .filter(role => role !== OrgUserRole.SUPER_ADMIN)
                    .map((role) => (
                    <div key={role} className="flex items-center space-x-2 rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition-colors duration-200">
                      <RadioGroupItem id={`add-role-${role}`} value={role} className="text-blue-600" />
                      <Label htmlFor={`add-role-${role}`} className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                        <FileText className={`h-4 w-4 ${
                          role === OrgUserRole.ORG_ADMIN ? "text-blue-600" : "text-gray-400"
                        }`} />
                        {getReadableUserRole(mapToUserModuleRole(role))}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
            <AlertDialogFooter className="mt-8">
              <AlertDialogCancel asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddUserDialogOpen(false)}
                  className="border-gray-200 hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Add User
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};
