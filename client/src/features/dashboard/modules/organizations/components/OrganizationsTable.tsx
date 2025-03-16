import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useOrganizationsStore from '../store/useOrganizationsStore';
import { Organization, CreateOrganizationDto, UpdateOrganizationDto } from '../types/types';
import { toast } from '@/lib/toast';
import { paths } from '@/routes/paths';
import { Confirm } from '@/components/ui/confirm';
import { Trash, Building, RefreshCw } from 'lucide-react';

// Import the separated components
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
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

  const handleRefresh = () => {
    fetchOrganizations(meta.page, meta.limit);
  };

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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      <motion.div 
        variants={itemVariants}
        className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm"
      >
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
            Organizations Management
          </h2>
          <p className="text-gray-600 mt-1">
            Manage your organizations and their members
          </p>
        </div>
        
        <div className="flex flex-col gap-3 sm:flex-row">
          <motion.button
            onClick={handleRefresh}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center rounded-md bg-white border border-blue-200 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
            aria-label="Refresh organizations"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleRefresh()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </motion.button>
          
          <motion.button
            onClick={() => {
              resetCreateForm();
              setIsCreateModalOpen(true);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-4 py-2 text-sm font-medium text-white shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
            aria-label="Create new organization"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                resetCreateForm();
                setIsCreateModalOpen(true);
              }
            }}
          >
            <Building className="mr-2 h-4 w-4" />
            Create Organization
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            variants={itemVariants}
            className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-500 border border-red-200 shadow-sm"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="font-medium text-red-800">Error</p>
                <p className="mt-1">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {isLoading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-xl bg-white p-8 shadow-sm border border-gray-100"
          >
            <LoadingState />
          </motion.div>
        ) : organizations.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-xl bg-white p-8 shadow-sm border border-gray-100"
          >
            <EmptyState onCreateClick={() => {
              resetCreateForm();
              setIsCreateModalOpen(true);
            }} />
          </motion.div>
        ) : (
          <motion.div 
            key="table"
            variants={itemVariants}
            className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100"
          >
            <OrganizationsTableContent
              organizations={organizations}
              onViewDetails={handleViewDetails}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
            
            {meta.totalPages > 1 && (
              <div className="border-t border-gray-100 px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50/30">
                <Pagination
                  meta={meta}
                  onPageChange={handlePageChange}
                  onLimitChange={handleLimitChange}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
    </motion.div>
  );
};
