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
import { Label } from '@/components/ui/label';
import { CreateOrganizationDto } from '../types/types';

interface CreateOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: CreateOrganizationDto;
  onFormChange: (data: CreateOrganizationDto) => void;
  onSubmit: () => void;
}

const CreateOrganizationModal = ({ 
  isOpen, 
  onClose, 
  formData, 
  onFormChange, 
  onSubmit 
}: CreateOrganizationModalProps) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
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
            value={formData.name}
            onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
            placeholder="Organization name"
            className="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        <Button
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!formData.name.trim()}
        >
          Create
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default CreateOrganizationModal;
