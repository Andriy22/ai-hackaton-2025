interface ErrorStateProps {
  error: string;
}

const ErrorState = ({ error }: ErrorStateProps) => (
  <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">
    {error}
  </div>
);

export default ErrorState;
