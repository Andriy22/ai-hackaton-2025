import { Plus } from 'lucide-react';

interface TableHeaderProps {
  onCreateClick: () => void;
}

const TableHeader = ({ onCreateClick }: TableHeaderProps) => (
  <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
    <h2 className="text-xl font-bold text-gray-800">Organizations</h2>
    
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        onClick={onCreateClick}
        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Create new organization"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onCreateClick()}
      >
        <Plus className="mr-2 h-4 w-4" />
        Create Organization
      </button>
    </div>
  </div>
);

export default TableHeader;
