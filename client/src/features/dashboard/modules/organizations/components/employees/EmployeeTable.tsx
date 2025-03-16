import React from 'react';
import { Employee } from '../../types/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { paths } from '@/routes/paths';

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  onEdit,
  onDelete,
}) => {
  if (employees.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Position
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Birth Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Joined
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {employees.map((employee) => (
            <tr key={employee.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {employee.firstName?.charAt(0) || ''}{employee.lastName?.charAt(0) || ''}
                    </span>
                  </div>
                  <div className="ml-4">
                    <Link 
                      to={paths.employees.details(employee.id)}
                      className="font-medium text-gray-900 hover:text-primary hover:underline flex items-center"
                    >
                      {employee.firstName} {employee.lastName}
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                <Badge variant="outline" className="font-normal">
                  {employee.position}
                </Badge>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {formatDate(employee.birthDate)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {formatDate(employee.createdAt)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(employee)}
                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                    aria-label={`Edit ${employee.firstName} ${employee.lastName}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(employee)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    aria-label={`Delete ${employee.firstName} ${employee.lastName}`}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
