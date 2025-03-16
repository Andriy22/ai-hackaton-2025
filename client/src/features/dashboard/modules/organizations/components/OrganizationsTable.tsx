import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useOrganizationsStore from '../store/useOrganizationsStore';
import { Organization, CreateOrganizationDto, UpdateOrganizationDto } from '../types/types';
import { toast } from '@/lib/toast';
import { paths } from '@/routes/paths';
import { Confirm } from '@/components/ui/confirm';
import { Trash } from 'lucide-react';

// Import the separated components
import TableHeader from './TableHeader';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import OrganizationsTableContent from './OrganizationsTableContent';
import Pagination from './Pagination';
import CreateOrganizationModal from './CreateOrganizationModal';
import EditOrganizationModal from './EditOrganizationModal';

// Main OrganizationsTable Component
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

  const handleLimitChange = (limit: number) => {
    fetchOrganizations(1, limit);
  };

  const resetCreateForm = () => {
    setCreateFormData({
      name: '',
    });
  };

  return (
    <div>
      <TableHeader
        onCreateClick={() => {
          resetCreateForm();
          setIsCreateModalOpen(true);
        }}
      />

      {error && <ErrorState error={error} />}

      {isLoading ? (
        <LoadingState />
      ) : organizations.length === 0 ? (
        <EmptyState />
      ) : (
        <OrganizationsTableContent
          organizations={organizations}
          onViewDetails={handleViewDetails}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}

      {meta.totalPages > 1 && (
        <Pagination
          meta={meta}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
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
      <CreateOrganizationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        formData={createFormData}
        onFormChange={setCreateFormData}
        onSubmit={handleCreateSubmit}
      />

      {/* Edit Organization Modal */}
      <EditOrganizationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        formData={editFormData}
        onFormChange={setEditFormData}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
};
