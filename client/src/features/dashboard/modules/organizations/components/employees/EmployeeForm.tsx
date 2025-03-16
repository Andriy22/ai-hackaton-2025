import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import {
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../../types/types';

interface EmployeeFormProps {
  formData: CreateEmployeeDto | UpdateEmployeeDto;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isEdit: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  formData,
  onChange,
  onSubmit,
  onClose,
  isEdit
}) => {
  const title = isEdit ? 'Edit Employee' : 'Add New Employee';
  const description = isEdit
    ? 'Update the employee\'s information below.'
    : 'Enter the details of the new employee below.';
  const submitText = isEdit ? 'Update Employee' : 'Add Employee';
  const idPrefix = isEdit ? 'edit-' : '';

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>
          {description}
        </AlertDialogDescription>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertDialogHeader>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor={`${idPrefix}firstName`} className="text-right text-sm font-medium">
              First Name
            </label>
            <input
              id={`${idPrefix}firstName`}
              name="firstName"
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.firstName}
              onChange={onChange}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor={`${idPrefix}lastName`} className="text-right text-sm font-medium">
              Last Name
            </label>
            <input
              id={`${idPrefix}lastName`}
              name="lastName"
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.lastName}
              onChange={onChange}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor={`${idPrefix}position`} className="text-right text-sm font-medium">
              Position
            </label>
            <input
              id={`${idPrefix}position`}
              name="position"
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.position}
              onChange={onChange}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor={`${idPrefix}birthDate`} className="text-right text-sm font-medium">
              Birth Date
            </label>
            <input
              id={`${idPrefix}birthDate`}
              name="birthDate"
              type="date"
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.birthDate}
              onChange={onChange}
              required
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button type="submit">{submitText}</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </form>
    </>
  );
};

export default EmployeeForm;
