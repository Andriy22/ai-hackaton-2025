import { useEffect, useState } from 'react';
import { RetinaPhoto, employeeApi } from '../api/employeeApi';
import { Trash, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface RetinaPhotoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  photo: RetinaPhoto | null;
  employeeId: string;
  organizationId: string;
  onDeleteClick: () => void;
}

export const RetinaPhotoDialog = ({
  open,
  onOpenChange,
  photo,
  employeeId,
  organizationId,
  onDeleteClick,
}: RetinaPhotoDialogProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRetinaPhotoData = async () => {
      if (!open || !photo || !employeeId || !organizationId) return;
      
      setIsLoading(true);
      try {
        const imageLink = await employeeApi.getRetinaPhotoById(organizationId, employeeId, photo.id);
        console.log('Retina photo image link:', imageLink);
        setImageUrl(imageLink);
      } catch (error) {
        toast.error('Failed to fetch retina photo');
        console.error('Error fetching retina photo:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRetinaPhotoData();
  }, [open, photo, employeeId, organizationId]);

  // Clean up URL object when component unmounts
  useEffect(() => {
    return () => {
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);
  
  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      // If closing, clean up the blob URL
      if (!newOpen && imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
        setImageUrl(null);
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Retina Photo</DialogTitle>
          <DialogDescription>
            {photo && `Uploaded on ${formatDate(photo.createdAt)}`}
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="relative mt-4 overflow-hidden rounded-lg">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Retina photo"
                  className="h-auto w-full object-contain"
                />
              ) : (
                <div className="flex h-64 items-center justify-center bg-muted/30">
                  <p className="text-muted-foreground">No image available</p>
                </div>
              )}
            </div>
            
            <DialogFooter className="mt-6 flex justify-end">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Close
                </Button>
                <Button
                  variant="destructive"
                  onClick={onDeleteClick}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
