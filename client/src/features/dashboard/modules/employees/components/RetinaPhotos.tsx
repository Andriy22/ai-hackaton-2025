import { useEffect, useState } from 'react';
import { Dropzone } from '@/components/ui/dropzone';
import useRetinaPhotosStore from '../store/useRetinaPhotosStore';
import { RetinaPhoto } from '../api/employeeApi';
import { Button } from '@/components/ui/button';
import { Trash, Eye, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from '@/lib/toast';
import { formatDate } from '@/lib/utils';
import { Confirm } from '@/components/ui/confirm';
import { RetinaPhotoDialog } from './RetinaPhotoDialog';

interface RetinaPhotosProps {
  organizationId: string;
  employeeId: string;
}

export const RetinaPhotos = ({ organizationId, employeeId }: RetinaPhotosProps) => {
  const {
    photos,
    selectedPhoto,
    isLoading,
    error,
    fetchRetinaPhotos,
    uploadRetinaPhoto,
    deleteRetinaPhoto,
    setSelectedPhoto,
    clearError
  } = useRetinaPhotosStore();

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Clean up blob URLs when component unmounts
  useEffect(() => {
    return () => {
      photos.forEach(photo => {
        if (photo.blobUrl && photo.blobUrl.startsWith('blob:')) {
          URL.revokeObjectURL(photo.blobUrl);
        }
      });
    };
  }, [photos]);

  useEffect(() => {
    if (organizationId && employeeId) {
      fetchRetinaPhotos(organizationId, employeeId);
    }
  }, [organizationId, employeeId, fetchRetinaPhotos]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleUpload = async (file: File) => {
    try {
      await uploadRetinaPhoto(organizationId, employeeId, file);
      toast.success('Retina photo uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload retina photo');
    }
  };

  const handleDelete = async () => {
    if (!selectedPhoto) return;
    
    try {
      await deleteRetinaPhoto(organizationId, employeeId, selectedPhoto.id);
      
      // Clean up blob URL if it exists
      if (selectedPhoto.blobUrl && selectedPhoto.blobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(selectedPhoto.blobUrl);
      }
      
      setDeleteDialogOpen(false);
      setViewDialogOpen(false);
      toast.success('Retina photo deleted successfully');
    } catch (error) {
      toast.error('Failed to delete retina photo');
    }
  };

  const handleView = (photo: RetinaPhoto) => {
    setSelectedPhoto(photo);
    setViewDialogOpen(true);
  };

  const handleDeleteClick = (photo: RetinaPhoto) => {
    setSelectedPhoto(photo);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Retina Photos</h2>
      </div>

      <Dropzone 
        onUpload={handleUpload} 
        className="max-w-full"
      />

      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!isLoading && photos.length === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <ImageIcon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mt-4 text-sm font-medium">No retina photos</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Upload a retina photo using the dropzone above.
          </p>
        </div>
      )}

      {photos.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo) => (
            <div 
              key={photo.id} 
              className="group relative overflow-hidden rounded-lg border bg-background transition-all hover:shadow-md"
            >
              <div className="aspect-square w-full overflow-hidden">
                <img
                  src={photo.blobUrl || photo.url}
                  alt={photo.fileName}
                  className="h-full w-full object-cover transition-all group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => handleView(photo)}
                    aria-label="View retina photo"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleView(photo)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteClick(photo)}
                    aria-label="Delete retina photo"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleDeleteClick(photo)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-2">
                <p className="truncate text-xs text-muted-foreground">
                  {formatDate(photo.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Use the extracted RetinaPhotoDialog component */}
      <RetinaPhotoDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        photo={selectedPhoto}
        employeeId={employeeId}
        organizationId={organizationId}
        onDeleteClick={() => setDeleteDialogOpen(true)}
      />

      {/* Delete Confirmation Dialog */}
      <Confirm
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        title="Delete Retina Photo"
        message="Are you sure you want to delete this retina photo? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="destructive"
        confirmIcon={<Trash className="h-4 w-4" />}
        onConfirm={handleDelete}
      />
    </div>
  );
};
