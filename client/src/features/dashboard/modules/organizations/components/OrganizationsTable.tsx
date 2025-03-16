import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useOrganizationsStore from '../store/useOrganizationsStore';
import { Organization, CreateOrganizationDto, UpdateOrganizationDto } from '../types/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/lib/toast';
import { formatDate } from '@/lib/utils';
import { Edit, Eye, Plus, Trash, Users, UserRound } from 'lucide-react';
import { paths } from '@/routes/paths';
import { Label } from '@/components/ui/label';
import { Confirm } from '@/components/ui/confirm';

export const OrganizationsTable = () => {
  const navigate = useNavigate();
  const {
    organizations,
    meta,
    isLoading,
    error,
    fetchOrganizations,
    createOrganization,
    updateOrganization,
    deleteOrganization,
  } = useOrganizationsStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  const [createFormData, setCreateFormData] = useState<CreateOrganizationDto>({
    name: '',
  });
  
  const [editFormData, setEditFormData] = useState<UpdateOrganizationDto>({
    name: '',
  });

  // Load organizations on mount
  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  const handleCreateSubmit = async () => {
    try {
      await createOrganization(createFormData);
      setIsCreateModalOpen(false);
      setCreateFormData({
        name: '',
      });
      toast.success('Organization created successfully');
    } catch (error) {
      toast.error('Failed to create organization');
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedOrganization) return;

    try {
      await updateOrganization(selectedOrganization.id, editFormData);
      setIsEditModalOpen(false);
      setSelectedOrganization(null);
      setEditFormData({
        name: '',
      });
      toast.success('Organization updated successfully');
    } catch (error) {
      toast.error('Failed to update organization');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteOrganization(id);
      toast.success('Organization deleted successfully');
    } catch (error) {
      toast.error('Failed to delete organization');
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmId(null);
  };

  const handleEditClick = (organization: Organization) => {
    setSelectedOrganization(organization);
    setEditFormData({
      name: organization.name,
    });
    setIsEditModalOpen(true);
  };

  const handleViewDetails = (organizationId: string) => {
    navigate(paths.organizations.details(organizationId));
  };

  const handlePageChange = (page: number) => {
    fetchOrganizations(page, meta.limit);
  };

  const resetCreateForm = () => {
    setCreateFormData({
      name: '',
    });
  };

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-xl font-bold text-gray-800">Organizations</h2>
        
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => {
              resetCreateForm();
              setIsCreateModalOpen(true);
            }}
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Create new organization"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setIsCreateModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Organization
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-lg font-medium text-gray-600">Loading organizations...</p>
          </div>
        </div>
      ) : organizations.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center">
          <p className="mb-4 text-lg font-medium text-gray-600">No organizations found</p>
          <p className="text-sm text-gray-500">
            Create a new organization to get started.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Created At
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Updated At
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  Users
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  Employees
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {organizations.map((organization) => (
                <tr 
                  key={organization.id} 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleViewDetails(organization.id)}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleViewDetails(organization.id)}
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {organization.name}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {formatDate(organization.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {formatDate(organization.updatedAt)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <Users className="mr-1 h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">{organization._count?.users || 0}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <UserRound className="mr-1 h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">{organization._count?.employees || 0}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(organization.id);
                        }}
                        className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        aria-label={`View details of ${organization.name}`}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.stopPropagation();
                            handleViewDetails(organization.id);
                          }
                        }}
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(organization);
                        }}
                        className="rounded p-1 text-blue-500 hover:bg-blue-100 hover:text-blue-700"
                        aria-label={`Edit ${organization.name}`}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.stopPropagation();
                            handleEditClick(organization);
                          }
                        }}
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(organization.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        aria-label={`Delete ${organization.name}`}
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

      {meta.totalPages > 1 && (
        <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Show</span>
            <select
              className="block w-20 rounded-md border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={meta.limit}
              onChange={(e) => fetchOrganizations(1, Number(e.target.value))}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(meta.page - 1)}
              disabled={meta.page === 1}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Previous page"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && meta.page > 1 && handlePageChange(meta.page - 1)}
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {meta.page} of {meta.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(meta.page + 1)}
              disabled={meta.page === meta.totalPages}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Next page"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && meta.page < meta.totalPages && handlePageChange(meta.page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Confirm
        open={!!deleteConfirmId}
        setOpen={(open) => !open && setDeleteConfirmId(null)}
        title="Delete Organization"
        message="Are you sure you want to delete this organization? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="destructive"
        confirmIcon={<Trash className="h-4 w-4" />}
        onConfirm={() => deleteConfirmId ? handleDelete(deleteConfirmId) : undefined}
        onCancel={handleDeleteCancel}
      />

      {/* Create Organization Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Organization</DialogTitle>
            <DialogDescription>
              Enter organization details below.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-4 items-center gap-3">
              <Label htmlFor="create-name" className="text-right text-sm font-medium">
                Name *
              </Label>
              <Input
                id="create-name"
                value={createFormData.name}
                onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                placeholder="Organization name"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateSubmit}
              disabled={!createFormData.name.trim()}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Organization Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Organization</DialogTitle>
            <DialogDescription>
              Update organization details below.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-4 items-center gap-3">
              <Label htmlFor="edit-name" className="text-right text-sm font-medium">
                Name *
              </Label>
              <Input
                id="edit-name"
                value={editFormData.name || ''}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                placeholder="Organization name"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditSubmit}
              disabled={!editFormData.name?.trim()}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
