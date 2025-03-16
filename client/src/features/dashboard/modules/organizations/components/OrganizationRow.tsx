import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { Organization } from '../types/types';
import { Edit, Eye, Trash, Users, UserRound } from 'lucide-react';

interface OrganizationRowProps {
  organization: Organization;
  onViewDetails: (id: string) => void;
  onEdit: (org: Organization) => void;
  onDelete: (id: string) => void;
}

const OrganizationRow = ({ 
  organization, 
  onViewDetails, 
  onEdit, 
  onDelete 
}: OrganizationRowProps) => (
  <tr 
    className="cursor-pointer hover:bg-gray-50"
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
        <Users className="mr-1 h-4 w-4 text-blue-500" />
        <span className="text-sm font-medium">{organization._count?.users || 0}</span>
      </div>
    </td>
    <td className="whitespace-nowrap px-6 py-4 text-center">
      <div className="flex items-center justify-center">
        <UserRound className="mr-1 h-4 w-4 text-green-500" />
        <span className="text-sm font-medium">{organization._count?.employees || 0}</span>
      </div>
    </td>
    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
      <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(organization.id);
          }}
          className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
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
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(organization);
          }}
          className="rounded p-1 text-blue-500 hover:bg-blue-100 hover:text-blue-700"
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
        </button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(organization.id);
          }}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          aria-label={`Delete ${organization.name}`}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </td>
  </tr>
);

export default OrganizationRow;
