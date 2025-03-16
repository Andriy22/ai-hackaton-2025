import { motion } from 'framer-motion';
import { Building, Plus } from 'lucide-react';

interface EmptyStateProps {
  onCreateClick: () => void;
}

const EmptyState = ({ onCreateClick }: EmptyStateProps) => (
  <div className="flex h-64 flex-col items-center justify-center">
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="text-center"
    >
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-500">
        <Building className="h-8 w-8" />
      </div>
      <p className="mb-4 text-lg font-medium text-gray-700">No organizations found</p>
      <p className="mb-6 text-sm text-gray-500">
        Create your first organization to get started
      </p>
      <motion.button
        onClick={onCreateClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
        aria-label="Create new organization"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onCreateClick()}
      >
        <Plus className="mr-2 h-4 w-4" />
        Create Organization
      </motion.button>
    </motion.div>
  </div>
);

export default EmptyState;
