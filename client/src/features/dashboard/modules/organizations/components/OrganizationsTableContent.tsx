import { motion } from 'framer-motion';
import { Organization } from '../types/types';
import OrganizationRow from './OrganizationRow';

interface OrganizationsTableContentProps {
  organizations: Organization[];
  onViewDetails: (id: string) => void;
  onEdit: (org: Organization) => void;
  onDelete: (id: string) => void;
}

const OrganizationsTableContent = ({
  organizations,
  onViewDetails,
  onEdit,
  onDelete
}: OrganizationsTableContentProps) => {
  // Animation variants
  const tableVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    }
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <tr>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-blue-800 border-b border-gray-100">
              Name
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-blue-800 border-b border-gray-100">
              Created At
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-blue-800 border-b border-gray-100">
              Updated At
            </th>
            <th scope="col" className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-blue-800 border-b border-gray-100">
              Users
            </th>
            <th scope="col" className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-blue-800 border-b border-gray-100">
              Employees
            </th>
            <th scope="col" className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-blue-800 border-b border-gray-100">
              Actions
            </th>
          </tr>
        </thead>
        <motion.tbody
          variants={tableVariants}
          initial="hidden"
          animate="visible"
          className="divide-y divide-gray-100 bg-white"
        >
          {organizations.map((organization, index) => (
            <OrganizationRow
              key={organization.id}
              organization={organization}
              onViewDetails={onViewDetails}
              onEdit={onEdit}
              onDelete={onDelete}
              index={index}
            />
          ))}
        </motion.tbody>
      </table>
    </div>
  );
};

export default OrganizationsTableContent;
