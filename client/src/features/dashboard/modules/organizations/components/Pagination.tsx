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
}: PaginationProps) => (
  <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-700">Show</span>
      <select
        className="block w-20 rounded-md border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        value={meta.limit}
        onChange={(e) => onLimitChange(Number(e.target.value))}
      >
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
      <span className="text-sm text-gray-700">entries</span>
    </div>

    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(meta.page - 1)}
        disabled={meta.page === 1}
        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Previous page"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && meta.page > 1 && onPageChange(meta.page - 1)}
      >
        Previous
      </button>
      <span className="text-sm text-gray-700">
        Page {meta.page} of {meta.totalPages}
      </span>
      <button
        onClick={() => onPageChange(meta.page + 1)}
        disabled={meta.page === meta.totalPages}
        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Next page"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && meta.page < meta.totalPages && onPageChange(meta.page + 1)}
      >
        Next
      </button>
    </div>
  </div>
);

export default Pagination;
