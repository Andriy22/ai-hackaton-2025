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
}: OrganizationsTableContentProps) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            Name
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            Created At
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            Updated At
          </th>
          <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
            Users
          </th>
          <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
            Employees
          </th>
          <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {organizations.map((organization) => (
          <OrganizationRow
            key={organization.id}
            organization={organization}
            onViewDetails={onViewDetails}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </tbody>
    </table>
  </div>
);

export default OrganizationsTableContent;
