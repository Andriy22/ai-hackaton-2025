import { motion } from 'framer-motion';
import { formatDate } from '@/lib/utils';
import { Organization } from '../types/types';
import { Edit, Eye, Trash, Users, UserRound } from 'lucide-react';

interface OrganizationRowProps {
  organization: Organization;
  onViewDetails: (id: string) => void;
  onEdit: (org: Organization) => void;
  onDelete: (id: string) => void;
  index: number;
}

const OrganizationRow = ({ 
  organization, 
  onViewDetails, 
  onEdit, 
  onDelete,
  index
}: OrganizationRowProps) => {
  // Animation variants
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        delay: index * 0.05
      }
    },
    hover: { 
      backgroundColor: "rgba(243, 244, 246, 0.5)",
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.tr 
      variants={rowVariants}
      whileHover="hover"
      className="cursor-pointer bg-white transition-colors"
      onClick={() => onViewDetails(organization.id)}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onViewDetails(organization.id)}
    >
      <td className="whitespace-nowrap px-6 py-4">
        <div className="text-sm font-medium text-gray-900">
          {organization.name}
        </div>
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
        {formatDate(organization.createdAt)}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
        {formatDate(organization.updatedAt)}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-center">
        <div className="flex items-center justify-center">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50">
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <span className="ml-2 text-sm font-medium">{organization._count?.users || 0}</span>
        </div>
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-center">
        <div className="flex items-center justify-center">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-50">
            <UserRound className="h-4 w-4 text-green-500" />
          </div>
          <span className="ml-2 text-sm font-medium">{organization._count?.employees || 0}</span>
        </div>
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
        <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(organization.id);
            }}
            whileHover={{ scale: 1.1, backgroundColor: "#EEF2FF" }}
            whileTap={{ scale: 0.95 }}
            className="rounded-full p-2 text-blue-500 hover:bg-blue-50 transition-colors"
            aria-label={`View details of ${organization.name}`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.stopPropagation();
                onViewDetails(organization.id);
              }
            }}
          >
            <Eye className="h-5 w-5" />
          </motion.button>
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(organization);
            }}
            whileHover={{ scale: 1.1, backgroundColor: "#EEF2FF" }}
            whileTap={{ scale: 0.95 }}
            className="rounded-full p-2 text-indigo-500 hover:bg-indigo-50 transition-colors"
            aria-label={`Edit ${organization.name}`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.stopPropagation();
                onEdit(organization);
              }
            }}
          >
            <Edit className="h-5 w-5" />
          </motion.button>
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(organization.id);
            }}
            whileHover={{ scale: 1.1, backgroundColor: "#FEF2F2" }}
            whileTap={{ scale: 0.95 }}
            className="rounded-full p-2 text-red-500 hover:bg-red-50 transition-colors"
            aria-label={`Delete ${organization.name}`}
          >
            <Trash className="h-5 w-5" />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
};

export default OrganizationRow;
