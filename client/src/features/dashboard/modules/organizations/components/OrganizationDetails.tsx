import { Button } from "@/components/ui/button";
import { Confirm } from "@/components/ui/confirm";
import {
  ErrorState,
  LoadingState,
  NotFoundState,
} from "@/components/ui/feedback";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "@/lib/toast";
import { paths } from "@/routes/paths";
import { motion } from "framer-motion";
import {
  BarChart4,
  Building,
  Calendar,
  PencilLine,
  RefreshCw,
  Trash,
  UserRound,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useOrganizationsStore from "../store/useOrganizationsStore";
import { UpdateOrganizationDto } from "../types/types";
import { OrganizationEmployees } from "./OrganizationEmployees";
import { OrganizationTabContent, OrganizationTabs } from "./OrganizationTabs";
import { OrganizationUsers } from "./OrganizationUsers";
import { ValidationStatistics } from "./ValidationStatistics";

export const OrganizationDetails = () => {
  const { organizationId } = useParams<{ organizationId: string }>();
  const navigate = useNavigate();
  const {
    selectedOrganization,
    error,
    isLoading,
    fetchOrganization,
    updateOrganization,
    deleteOrganization,
    fetchOrganizationEmployees,
  } = useOrganizationsStore();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
  const [formData, setFormData] = useState<UpdateOrganizationDto>({
    name: "",
  });

  useEffect(() => {
    if (organizationId) {
      fetchOrganization(organizationId);
      fetchOrganizationEmployees(organizationId);
    }
  }, [organizationId, fetchOrganization, fetchOrganizationEmployees]);

  useEffect(() => {
    if (selectedOrganization) {
      setFormData({
        name: selectedOrganization.name,
      });
    }
  }, [selectedOrganization]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationId || !selectedOrganization) return;

    try {
      await updateOrganization(organizationId, formData);
      setIsSheetOpen(false);
      toast.success("Organization updated successfully");
    } catch (error) {
      toast.error("Failed to update organization");
    }
  };

  const handleDelete = async () => {
    if (!organizationId) return;

    try {
      await deleteOrganization(organizationId);
      toast.success("Organization deleted successfully");
      navigate(paths.organizations.root);
    } catch (error) {
      toast.error("Failed to delete organization");
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (isLoading) {
    return <LoadingState fullScreen message="Loading organization..." />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        className="mt-8"
      />
    );
  }

  if (!selectedOrganization) {
    return (
      <NotFoundState
        title="Organization Not Found"
        message="The organization you are looking for does not exist or you do not have permission to view it."
        className="mt-8"
        action={{
          label: "Back to Organizations",
          onClick: () => navigate(paths.dashboard),
          variant: "outline",
        }}
      />
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="mx-auto max-w-5xl space-y-8 p-4"
    >
      {/* Header section with organization title and actions */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
            Organization Details
          </h1>
          <p className="text-gray-600 mt-1">
            View and manage organization information
          </p>
        </div>
        <div className="flex gap-4">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="inline-flex items-center bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300 transition-all duration-200"
              >
                <PencilLine className="mr-2 h-4 w-4 text-blue-600" />
                Edit Organization
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md p-6 border-l border-blue-100">
              <SheetHeader>
                <SheetTitle className="text-2xl font-bold text-blue-700">
                  Edit Organization
                </SheetTitle>
                <SheetDescription className="text-gray-600">
                  Make changes to your organization here. Click save when you're
                  done.
                </SheetDescription>
              </SheetHeader>
              <form onSubmit={handleSubmit} className="mt-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="name"
                      className="text-right text-sm font-medium text-gray-700"
                    >
                      Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ name: e.target.value })
                      }
                      placeholder="Enter organization name"
                      className="col-span-3 border-blue-200 focus:border-blue-400 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-8">
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
          <Button
            variant="destructive"
            className="inline-flex items-center bg-white text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-300 hover:text-red-700 transition-all duration-200"
            onClick={() => setIsDeleteConfirmOpen(true)}
            aria-label="Delete organization"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </motion.div>

      {/* Organization Profile Card */}
      <motion.div
        variants={itemVariants}
        className="rounded-xl bg-white p-8 shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-center mb-8 gap-6">
          <div className="flex-shrink-0">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-200"></div>
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 border-2 border-white">
                <Building className="h-10 w-10" />
              </div>
            </div>
          </div>
          <div className="flex-grow space-y-1 md:border-r md:pr-6 md:mr-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {selectedOrganization.name}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium">
                ID: {selectedOrganization.id.substring(0, 8)}...
              </span>
              <span className="flex items-center text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />{" "}
                {new Date(selectedOrganization.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex-shrink-0 flex flex-col md:flex-row gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                fetchOrganization(organizationId || "");
                fetchOrganizationEmployees(organizationId || "");
              }}
              className="flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
              aria-label="Refresh organization data"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Timestamps
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-sm font-medium text-gray-500">Created At</p>
                <p className="text-base text-gray-900 font-medium">
                  {new Date(selectedOrganization.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="space-y-1 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-sm font-medium text-gray-500">Updated At</p>
                <p className="text-base text-gray-900 font-medium">
                  {new Date(selectedOrganization.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2 flex items-center">
              <BarChart4 className="h-5 w-5 mr-2 text-blue-600" />
              Statistics
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <motion.div
                className="flex items-center p-4 rounded-lg border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm hover:shadow-md transition-all duration-300"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-inner">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800">Total Users</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {selectedOrganization._count?.users || 0}
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center p-4 rounded-lg border border-green-100 bg-gradient-to-br from-green-50 to-teal-50 shadow-sm hover:shadow-md transition-all duration-300"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white shadow-inner">
                  <UserRound className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Total Employees
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    {selectedOrganization._count?.employees || 0}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs Section */}
      <motion.div
        variants={itemVariants}
        className="rounded-xl bg-white border border-gray-100 p-6 shadow-sm overflow-hidden"
      >
        <OrganizationTabs defaultValue={activeTab} onChange={handleTabChange}>
          <OrganizationTabContent value="users">
            <OrganizationUsers organizationId={organizationId || ""} />
          </OrganizationTabContent>
          <OrganizationTabContent value="employees">
            <OrganizationEmployees organizationId={organizationId} />
          </OrganizationTabContent>
          <OrganizationTabContent value="statistics">
            <ValidationStatistics organizationId={organizationId} />
          </OrganizationTabContent>
        </OrganizationTabs>
      </motion.div>

      <Confirm
        open={isDeleteConfirmOpen}
        setOpen={setIsDeleteConfirmOpen}
        title="Delete Organization"
        message="Are you sure you want to delete this organization? This action cannot be undone and will remove all associated data."
        confirmText="Delete Organization"
        confirmVariant="destructive"
        confirmIcon={<Trash className="h-4 w-4" />}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteConfirmOpen(false)}
      />
    </motion.div>
  );
};
