const LoadingState = () => (
  <div className="flex h-64 items-center justify-center">
    <div className="text-center">
      <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      <p className="text-lg font-medium text-gray-600">Loading organizations...</p>
    </div>
  </div>
);

export default LoadingState;
