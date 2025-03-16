interface LoadingSpinnerProps {
  className?: string;
}

export const LoadingSpinner = ({ className = "" }: LoadingSpinnerProps) => (
  <div className={`flex min-h-screen items-center justify-center ${className}`}>
    <div
      className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);
