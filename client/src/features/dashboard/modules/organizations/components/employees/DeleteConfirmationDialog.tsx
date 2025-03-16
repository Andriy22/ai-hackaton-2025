import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog';
import { Employee } from '../../types/types';

interface DeleteConfirmationDialogProps {
  employee: Employee | null;
  onConfirm: () => void;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  employee,
  onConfirm
}) => {
  if (!employee) return null;

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete Employee</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete {employee.firstName} {employee.lastName}? 
          This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel asChild>
          <Button variant="outline">Cancel</Button>
        </AlertDialogCancel>
        <AlertDialogAction asChild>
          <Button variant="destructive" onClick={onConfirm}>Delete</Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
};

export default DeleteConfirmationDialog;
