import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useEmployeesStore from '../store/useEmployeesStore';
import { ArrowLeft, Edit, Trash, Briefcase, Calendar, Clock, User, RefreshCw, UserCheck, FileText, Clipboard, Building } from 'lucide-react';
import { motion } from 'framer-motion';
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
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg font-medium text-gray-600">Loading employee details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-lg rounded-xl bg-red-50 p-8 shadow-sm border border-red-100"
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <User className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-red-700">Error Loading Employee</h2>
          <p className="mb-6 text-red-600">{error}</p>
          <Button
            onClick={handleBack}
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
            aria-label="Go back to organization details"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Organization
          </Button>
        </div>
      </motion.div>
    );
  }

  if (!selectedEmployee) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-lg rounded-xl bg-yellow-50 p-8 shadow-sm border border-yellow-100"
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <User className="h-8 w-8 text-yellow-600" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-yellow-700">Employee Not Found</h2>
          <p className="mb-6 text-yellow-600">The employee you are looking for does not exist or you don't have permission to view it.</p>
          <Button
            onClick={handleBack}
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
            aria-label="Go back to organization details"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Organization
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto max-w-5xl space-y-8 px-4 py-8"
    >
      {/* Header with actions */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm"
      >
        <div className="flex items-center">
          <Button
            onClick={handleBack}
            variant="ghost"
            className="mr-4 inline-flex items-center rounded-full h-10 w-10 p-0 hover:bg-white hover:text-blue-600 transition-all duration-200"
            aria-label="Go back to organization details"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
              Employee Details
            </h1>
            <p className="text-gray-600 text-sm">
              View and manage employee information
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  className="bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm"
                  aria-label="Edit employee"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-md p-6 border-l border-blue-100">
                <SheetHeader>
                  <SheetTitle className="text-2xl font-bold text-blue-700">Edit Employee</SheetTitle>
                  <SheetDescription className="text-gray-600">
                    Make changes to employee information here. Click save when you're done.
                  </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                  <div className="grid gap-6 pt-4">
                    <div className="grid grid-cols-4 items-center gap-3">
                      <Label htmlFor="firstName" className="text-right text-sm font-medium text-gray-700">
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="Enter first name"
                        className="col-span-3 border-blue-200 focus:border-blue-400 transition-all duration-200"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-3">
                      <Label htmlFor="lastName" className="text-right text-sm font-medium text-gray-700">
                        Last Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Enter last name"
                        className="col-span-3 border-blue-200 focus:border-blue-400 transition-all duration-200"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-3">
                      <Label htmlFor="position" className="text-right text-sm font-medium text-gray-700">
                        Position <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="position"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        placeholder="Enter position"
                        className="col-span-3 border-blue-200 focus:border-blue-400 transition-all duration-200"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-3">
                      <Label htmlFor="birthDate" className="text-right text-sm font-medium text-gray-700">
                        Birth Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                        className="col-span-3 border-blue-200 focus:border-blue-400 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-8">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsSheetOpen(false)}
                      className="border-gray-200 hover:bg-gray-50 transition-all duration-200"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </SheetContent>
            </Sheet>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="destructive"
              className="bg-white text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-300 hover:text-red-700 transition-all duration-200 shadow-sm"
              onClick={() => setIsDeleteConfirmOpen(true)}
              aria-label="Delete employee"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Employee Profile Card */}
      <motion.div 
        variants={itemVariants}
        className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100"
      >
        <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-6 py-6 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-200"></div>
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 border-2 border-white">
                <Briefcase className="h-10 w-10" />
              </div>
            </div>
            <div className="flex-grow">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {selectedEmployee.firstName} {selectedEmployee.lastName}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                  <Clipboard className="mr-1 h-4 w-4" />
                  {selectedEmployee.position}
                </span>
                <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800">
                  <Building className="mr-1 h-4 w-4" />
                  ID: {selectedEmployee.id.substring(0, 8)}...
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Button
                variant="ghost"
                onClick={() => fetchEmployeeById(employeeId || '')}
                className="flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                aria-label="Refresh employee data"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} defaultValue="details" className="w-full" onValueChange={setActiveTab}>
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="px-6 sm:px-8">
              <TabsList className="h-12 w-full justify-start rounded-none bg-transparent p-0">
                <TabsTrigger
                  value="details"
                  className="group relative h-12 rounded-none border-b-2 border-transparent px-4 py-2 font-medium text-gray-500 hover:text-gray-700 data-[state=active]:border-blue-600 data-[state=active]:text-blue-700"
                >
                  <span className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Details
                  </span>
                  <motion.span
                    className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-600"
                    initial={{ width: 0 }}
                    animate={{ width: activeTab === 'details' ? '100%' : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </TabsTrigger>
                <TabsTrigger
                  value="retina"
                  className="group relative h-12 rounded-none border-b-2 border-transparent px-4 py-2 font-medium text-gray-500 hover:text-gray-700 data-[state=active]:border-blue-600 data-[state=active]:text-blue-700"
                >
                  <span className="flex items-center">
                    <UserCheck className="mr-2 h-4 w-4" />
                    Retina Photos
                  </span>
                  <motion.span
                    className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-600"
                    initial={{ width: 0 }}
                    animate={{ width: activeTab === 'retina' ? '100%' : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="details" className="border-none p-0">
            <div className="px-6 py-6 sm:px-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <motion.div
                  variants={itemVariants}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2 flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
                      <dt className="text-sm font-medium text-gray-500">Employee ID</dt>
                      <dd className="mt-1 text-sm font-medium text-gray-900">{selectedEmployee.id}</dd>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
                      <dt className="text-sm font-medium text-gray-500">Birth Date</dt>
                      <dd className="mt-1 flex items-center text-sm font-medium text-gray-900">
                        <Calendar className="mr-1 h-4 w-4 text-blue-600" />
                        {formatDate(selectedEmployee.birthDate)}
                      </dd>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2 flex items-center">
                    <Building className="h-5 w-5 mr-2 text-blue-600" />
                    Organization Details
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
                      <dt className="text-sm font-medium text-gray-500">Organization ID</dt>
                      <dd className="mt-1 text-sm font-medium text-gray-900">
                        <Button
                          variant="link"
                          className="h-auto p-0 text-blue-600 hover:text-blue-800"
                          onClick={() => navigate(paths.organizations.details(selectedEmployee.organizationId))}
                        >
                          {selectedEmployee.organizationId.substring(0, 8)}...
                        </Button>
                      </dd>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
                      <dt className="text-sm font-medium text-gray-500">Position</dt>
                      <dd className="mt-1 text-sm font-medium text-gray-900">{selectedEmployee.position}</dd>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="space-y-4 md:col-span-2"
                >
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                    Time Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
                      <dt className="text-sm font-medium text-gray-500">Created At</dt>
                      <dd className="mt-1 text-sm font-medium text-gray-900">
                        {formatDate(selectedEmployee.createdAt)}
                      </dd>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
                      <dt className="text-sm font-medium text-gray-500">Updated At</dt>
                      <dd className="mt-1 text-sm font-medium text-gray-900">
                        {formatDate(selectedEmployee.updatedAt)}
                      </dd>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="retina" className="border-none p-0">
            <div className="px-6 py-6 sm:px-8">
              {selectedEmployee && (
                <RetinaPhotos 
                  organizationId={selectedEmployee.organizationId} 
                  employeeId={selectedEmployee.id} 
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      <Confirm
        open={isDeleteConfirmOpen}
        setOpen={setIsDeleteConfirmOpen}
        title="Delete Employee"
        message="Are you sure you want to delete this employee? This action cannot be undone and will remove all associated data including retina photos."
        confirmText="Delete Employee"
        confirmVariant="destructive"
        confirmIcon={<Trash className="h-4 w-4" />}
        onConfirm={handleDelete}
      />
    </motion.div>
  );
};
