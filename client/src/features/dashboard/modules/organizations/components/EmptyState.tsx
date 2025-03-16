const EmptyState = () => (
  <div className="flex h-64 flex-col items-center justify-center">
    <p className="mb-4 text-lg font-medium text-gray-600">No organizations found</p>
    <p className="text-sm text-gray-500">
      Create a new organization to get started.
    </p>
  </div>
);

export default EmptyState;
