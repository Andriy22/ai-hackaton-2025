import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useEmployeesStore from '../store/useEmployeesStore';
import { ArrowLeft, Edit, Trash, Briefcase } from 'lucide-react';
import { paths } from '@/routes/paths';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UpdateEmployeeDto } from '../../organizations/types/types';
import { toast } from '@/lib/toast';
import { Confirm } from '@/components/ui/confirm';
import { formatDate } from '@/lib/utils';
import { RetinaPhotos } from './RetinaPhotos';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const EmployeeDetails = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState<UpdateEmployeeDto>({
    firstName: '',
    lastName: '',
    position: '',
    birthDate: '',
  });
  
  const {
    selectedEmployee,
    isLoading,
    error,
    fetchEmployeeById,
    deleteEmployee,
    updateEmployee
  } = useEmployeesStore();

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeById(employeeId);
    }
  }, [employeeId, fetchEmployeeById]);

  useEffect(() => {
    if (selectedEmployee) {
      setFormData({
        firstName: selectedEmployee.firstName,
        lastName: selectedEmployee.lastName,
        position: selectedEmployee.position,
        birthDate: selectedEmployee.birthDate.split('T')[0], // Format date for input
      });
    }
  }, [selectedEmployee]);

  const handleBack = () => {
    navigate(paths.organizations.details(selectedEmployee?.organizationId || ''));
  };

  const handleDelete = async () => {
    if (employeeId) {
      try {
        await deleteEmployee(employeeId);
        toast.success('Employee deleted successfully');
        navigate(paths.organizations.details(selectedEmployee?.organizationId || ''));
      } catch (error) {
        toast.error('Failed to delete employee');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId) return;

    try {
      await updateEmployee(employeeId, formData);
      setIsSheetOpen(false);
      toast.success('Employee updated successfully');
    } catch (error) {
      toast.error('Failed to update employee');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center">
        <p className="text-lg font-medium text-red-600">{error}</p>
        <button
          onClick={handleBack}
          className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          aria-label="Go back to organization details"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleBack()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Organization
        </button>
      </div>
    );
  }

  if (!selectedEmployee) {
    return (
      <div className="rounded-lg bg-yellow-50 p-6 text-center">
        <p className="text-lg font-medium text-yellow-600">Employee not found</p>
        <button
          onClick={handleBack}
          className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          aria-label="Go back to organization details"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleBack()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Organization
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          aria-label="Go back to organization details"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleBack()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>
        <div className="flex space-x-2">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                className="inline-flex items-center"
                aria-label="Edit employee"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md p-6">
              <SheetHeader>
                <SheetTitle>Edit Employee</SheetTitle>
                <SheetDescription className="text-muted-foreground">
                  Make changes to employee information here.
                </SheetDescription>
              </SheetHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 pt-4">
                  <div className="grid grid-cols-4 items-center gap-3">
                    <Label htmlFor="firstName" className="text-right text-sm font-medium">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Enter first name"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-3">
                    <Label htmlFor="lastName" className="text-right text-sm font-medium">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Enter last name"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-3">
                    <Label htmlFor="position" className="text-right text-sm font-medium">
                      Position
                    </Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      placeholder="Enter position"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-3">
                    <Label htmlFor="birthDate" className="text-right text-sm font-medium">
                      Birth Date
                    </Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsSheetOpen(false)}
                    className="px-3"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="px-3">
                    Save Changes
                  </Button>
                </div>
              </form>
            </SheetContent>
          </Sheet>
          <Button
            variant="destructive"
            className="inline-flex items-center"
            onClick={() => setIsDeleteConfirmOpen(true)}
            aria-label="Delete employee"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedEmployee.firstName} {selectedEmployee.lastName}
              </h1>
              <p className="text-sm text-gray-500">{selectedEmployee.position}</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} defaultValue="details" className="w-full" onValueChange={setActiveTab}>
          <div className="border-b border-gray-200">
            <div className="px-4 sm:px-6">
              <TabsList className="h-10 w-full justify-start rounded-none bg-transparent p-0">
                <TabsTrigger
                  value="details"
                  className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-2 font-medium text-gray-500 hover:text-gray-700 data-[state=active]:text-primary"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="retina"
                  className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-2 font-medium text-gray-500 hover:text-gray-700 data-[state=active]:text-primary"
                >
                  Retina Photos
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="details" className="border-none p-0">
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Employee ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedEmployee.id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Organization ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedEmployee.organizationId}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Birth Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(selectedEmployee.birthDate)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created At</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(selectedEmployee.createdAt)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(selectedEmployee.updatedAt)}
                  </dd>
                </div>
              </dl>
            </div>
          </TabsContent>

          <TabsContent value="retina" className="border-none p-0">
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              {selectedEmployee && (
                <RetinaPhotos 
                  organizationId={selectedEmployee.organizationId} 
                  employeeId={selectedEmployee.id} 
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Confirm
        open={isDeleteConfirmOpen}
        setOpen={setIsDeleteConfirmOpen}
        title="Delete Employee"
        message="Are you sure you want to delete this employee? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="destructive"
        confirmIcon={<Trash className="h-4 w-4" />}
        onConfirm={handleDelete}
      />
    </div>
  );
};
