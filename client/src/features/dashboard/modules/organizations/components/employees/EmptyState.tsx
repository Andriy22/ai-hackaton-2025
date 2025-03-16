import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onAddClick: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddClick }) => {
  return (
    <div className="rounded-md border border-dashed border-gray-300 p-8 text-center">
      <p className="text-gray-500">No employees found in this organization</p>
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-4"
        onClick={onAddClick}
      >
        Add Employee
      </Button>
    </div>
  );
};

export default EmptyState;
