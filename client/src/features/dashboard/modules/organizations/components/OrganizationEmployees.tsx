import { useState, useEffect } from 'react';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '../types/types';
import { Button } from '@/components/ui/button';
import { UserPlus, Users, RefreshCw } from 'lucide-react';
import { LoadingState, ErrorState } from '@/components/ui/feedback';
import useOrganizationsStore from '../store/useOrganizationsStore';
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';
import { motion, AnimatePresence } from 'framer-motion';

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

  if (isLoading) {
    return <LoadingState message="Loading employees..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      {/* Header section with title and actions */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl"
      >
        <div className="space-y-1">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
            Organization Employees
          </h2>
          <p className="text-gray-600 text-sm">
            Manage employee information and records
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost"
            size="sm" 
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            onClick={() => organizationId && fetchOrganizationEmployees(organizationId)}
            aria-label="Refresh employee data"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 shadow-sm hover:shadow transition-all duration-200"
            onClick={handleAddEmployee}
          >
            <UserPlus className="h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </motion.div>

      {/* Employee Content */}
      <AnimatePresence>
        {employees.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <EmptyState onAddClick={handleAddEmployee} />
          </motion.div>
        ) : (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-700">
                  Total Employees: {employees.length}
                </span>
              </div>
            </div>
            <EmployeeTable 
              employees={employees} 
              onEdit={handleEditEmployee} 
              onDelete={handleDeleteEmployee} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Employee Dialog */}
      <AlertDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <AlertDialogContent className="sm:max-w-md border-blue-100">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 -m-6 mb-0 p-6 rounded-t-lg">
            <h2 className="text-xl font-bold text-blue-700">Add New Employee</h2>
            <p className="text-gray-600 text-sm mt-1">
              Enter employee information below
            </p>
          </div>
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
        <AlertDialogContent className="sm:max-w-md border-blue-100">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 -m-6 mb-0 p-6 rounded-t-lg">
            <h2 className="text-xl font-bold text-blue-700">Edit Employee</h2>
            <p className="text-gray-600 text-sm mt-1">
              Update employee information
            </p>
          </div>
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
        <AlertDialogContent className="border-red-100">
          <DeleteConfirmationDialog 
            employee={selectedEmployee}
            onConfirm={handleDeleteSubmit}
          />
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};
