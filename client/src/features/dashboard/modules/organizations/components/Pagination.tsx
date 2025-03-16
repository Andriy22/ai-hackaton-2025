import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  meta: {
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const Pagination = ({
  meta,
  onPageChange,
  onLimitChange
}: PaginationProps) => {
  const pageNumbers = [];
  const maxVisiblePages = 5;
  const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);
  
  // Calculate which page numbers to show
  let startPage = Math.max(1, meta.page - halfMaxVisiblePages);
  let endPage = Math.min(meta.totalPages, startPage + maxVisiblePages - 1);
  
  // Adjust if we're near the end
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  
  return (
    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">Show</span>
        <motion.select
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="block w-20 rounded-md border border-gray-200 bg-white px-2 py-1 text-sm shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200"
          value={meta.limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </motion.select>
        <span className="text-sm text-gray-700">entries</span>
      </div>

      <div className="flex items-center gap-1">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(meta.page - 1)}
          disabled={meta.page === 1}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-600 shadow-sm transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-gray-500"
          aria-label="Previous page"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && meta.page > 1 && onPageChange(meta.page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </motion.button>
        
        {startPage > 1 && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange(1)}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm font-medium shadow-sm transition-all duration-200 ${
                meta.page === 1
                  ? 'border-blue-500 bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
              aria-label="Go to page 1"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onPageChange(1)}
            >
              1
            </motion.button>
            {startPage > 2 && (
              <span className="px-1 text-gray-500">...</span>
            )}
          </>
        )}
        
        {pageNumbers.map((pageNumber) => (
          <motion.button
            key={pageNumber}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(pageNumber)}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm font-medium shadow-sm transition-all duration-200 ${
              meta.page === pageNumber
                ? 'border-blue-500 bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
            }`}
            aria-label={`Go to page ${pageNumber}`}
            aria-current={meta.page === pageNumber ? 'page' : undefined}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onPageChange(pageNumber)}
          >
            {pageNumber}
          </motion.button>
        ))}
        
        {endPage < meta.totalPages && (
          <>
            {endPage < meta.totalPages - 1 && (
              <span className="px-1 text-gray-500">...</span>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange(meta.totalPages)}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm font-medium shadow-sm transition-all duration-200 ${
                meta.page === meta.totalPages
                  ? 'border-blue-500 bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
              aria-label={`Go to page ${meta.totalPages}`}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onPageChange(meta.totalPages)}
            >
              {meta.totalPages}
            </motion.button>
          </>
        )}
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(meta.page + 1)}
          disabled={meta.page === meta.totalPages}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-600 shadow-sm transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-gray-500"
          aria-label="Next page"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && meta.page < meta.totalPages && onPageChange(meta.page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      </div>
      
      <div className="text-sm text-gray-700">
        Page <span className="font-medium text-blue-600">{meta.page}</span> of <span className="font-medium">{meta.totalPages}</span>
      </div>
    </div>
  );
};

export default Pagination;
