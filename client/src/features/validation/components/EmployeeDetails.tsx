import React from 'react';
import { User, Calendar, Briefcase } from 'lucide-react';
import type { Employee } from '../api/types';

interface EmployeeDetailsProps {
  employee: Employee | null;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ employee }) => {
  if (!employee) return null;
  
  // Format birth date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="mt-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-6">Employee Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-primary-50 flex items-center justify-center mr-4">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Name</div>
            <div className="font-medium">{employee.firstName} {employee.lastName}</div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-primary-50 flex items-center justify-center mr-4">
            <Briefcase className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Position</div>
            <div className="font-medium">{employee.position}</div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-primary-50 flex items-center justify-center mr-4">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Birth Date</div>
            <div className="font-medium">{formatDate(employee.birthDate)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
