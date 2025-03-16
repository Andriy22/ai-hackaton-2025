import { useState, useEffect } from 'react';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '../types/types';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { LoadingState, ErrorState } from '@/components/ui/feedback';
import useOrganizationsStore from '../store/useOrganizationsStore';
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';

// Import refactored components
import { 
  EmployeeTable, 
  EmployeeForm, 
  DeleteConfirmationDialog, 
  EmptyState 
} from './employees';

interface OrganizationEmployeesProps {
  organizationId: string;
}

export const OrganizationEmployees = ({
  organizationId,
}: Partial<OrganizationEmployeesProps>) => {
  const {
    organizationEmployees: employees,
    isLoadingEmployees: isLoading,
    error,
    fetchOrganizationEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  } = useOrganizationsStore();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<CreateEmployeeDto | UpdateEmployeeDto>({
    firstName: '',
    lastName: '',
    position: '',
    birthDate: '',
  });

  useEffect(() => {
    if (organizationId) {
      fetchOrganizationEmployees(organizationId);
    }
  }, [organizationId, fetchOrganizationEmployees]);

  const handleAddEmployee = () => {
    setFormData({
      firstName: '',
      lastName: '',
      position: '',
      birthDate: '',
    });
    setIsAddDialogOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      position: employee.position,
      birthDate: employee.birthDate.split('T')[0], // Format date for input
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (organizationId) {
      await createEmployee(organizationId, formData);
      setIsAddDialogOpen(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEmployee) {
      await updateEmployee(selectedEmployee.id, formData);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (selectedEmployee) {
      await deleteEmployee(selectedEmployee.id);
      setIsDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading employees..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Organization Employees</h2>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={handleAddEmployee}
        >
          <UserPlus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {employees.length === 0 ? (
        <EmptyState onAddClick={handleAddEmployee} />
      ) : (
        <EmployeeTable 
          employees={employees} 
          onEdit={handleEditEmployee} 
          onDelete={handleDeleteEmployee} 
        />
      )}

      {/* Add Employee Dialog */}
      <AlertDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <EmployeeForm 
            formData={formData}
            onChange={handleFormChange}
            onSubmit={handleAddSubmit}
            onClose={() => setIsAddDialogOpen(false)}
            isEdit={false}
          />
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Employee Dialog */}
      <AlertDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <EmployeeForm 
            formData={formData}
            onChange={handleFormChange}
            onSubmit={handleEditSubmit}
            onClose={() => setIsEditDialogOpen(false)}
            isEdit={true}
          />
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <DeleteConfirmationDialog 
            employee={selectedEmployee}
            onConfirm={handleDeleteSubmit}
          />
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
