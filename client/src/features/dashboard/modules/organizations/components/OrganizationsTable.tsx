import { useEffect, useState } from 'react';
import useOrganizationsStore from '../store/useOrganizationsStore';
import { Organization } from '../types/types';
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
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import { Edit, Plus, Trash } from 'lucide-react';

export const OrganizationsTable = () => {
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
  const [organizationName, setOrganizationName] = useState('');

  // Load organizations on mount
  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  const handleCreateSubmit = async () => {
    try {
      await createOrganization(organizationName);
      setIsCreateModalOpen(false);
      setOrganizationName('');
      toast.success('Organization created successfully');
    } catch (error) {
      toast.error('Failed to create organization');
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedOrganization) return;

    try {
      await updateOrganization(selectedOrganization.id, organizationName);
      setIsEditModalOpen(false);
      setSelectedOrganization(null);
      setOrganizationName('');
      toast.success('Organization updated successfully');
    } catch (error) {
      toast.error('Failed to update organization');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this organization?')) return;

    try {
      await deleteOrganization(id);
      toast.success('Organization deleted successfully');
    } catch (error) {
      toast.error('Failed to delete organization');
    }
  };

  const handleEditClick = (organization: Organization) => {
    setSelectedOrganization(organization);
    setOrganizationName(organization.name);
    setIsEditModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    fetchOrganizations(page, meta.limit);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-xl font-bold text-gray-800">Organizations</h2>
        
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => setIsCreateModalOpen(true)}
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
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {organizations.map((organization) => (
                <tr key={organization.id} className="hover:bg-gray-50">
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
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEditClick(organization)}
                        className="rounded p-1 text-blue-500 hover:bg-blue-100 hover:text-blue-700"
                        aria-label={`Edit ${organization.name}`}
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleEditClick(organization)}
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(organization.id)}
                        className="rounded p-1 text-red-500 hover:bg-red-100 hover:text-red-700"
                        aria-label={`Delete ${organization.name}`}
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleDelete(organization.id)}
                      >
                        <Trash className="h-5 w-5" />
                      </button>
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
              value={meta.limit}
              onChange={(e) => fetchOrganizations(meta.page, Number(e.target.value))}
              className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              aria-label="Items per page"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span className="text-sm text-gray-700">per page</span>
          </div>
          
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{(meta.page - 1) * meta.limit + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(meta.page * meta.limit, meta.total)}
            </span>{' '}
            of <span className="font-medium">{meta.total}</span> organizations
          </div>
          
          <div className="flex space-x-1">
            {Array.from({ length: meta.totalPages }).map((_, i) => {
              const pageNum = i + 1;
              if (
                pageNum === 1 ||
                pageNum === meta.totalPages ||
                (pageNum >= meta.page - 1 && pageNum <= meta.page + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium ${
                      pageNum === meta.page
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    aria-label={`Page ${pageNum}`}
                    aria-current={pageNum === meta.page ? 'page' : undefined}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              }
              if (
                (pageNum === 2 && meta.page > 3) ||
                (pageNum === meta.totalPages - 1 && meta.page < meta.totalPages - 2)
              ) {
                return <span key={pageNum} className="px-2 py-2 text-gray-500">...</span>;
              }
              return null;
            })}
          </div>
        </div>
      )}

      {/* Create Organization Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Organization</DialogTitle>
            <DialogDescription>
              Enter the details for the new organization.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Organization Name
              </label>
              <Input
                id="name"
                value={organizationName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOrganizationName(e.target.value)}
                placeholder="Enter organization name"
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button onClick={handleCreateSubmit} disabled={!organizationName.trim()}>
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
              Update the organization details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-name" className="text-sm font-medium text-gray-700">
                Organization Name
              </label>
              <Input
                id="edit-name"
                value={organizationName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOrganizationName(e.target.value)}
                placeholder="Enter organization name"
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} disabled={!organizationName.trim()}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
