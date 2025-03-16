import { useNavigate } from 'react-router-dom';
import { paths } from '@/routes/paths';
import { ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(paths.dashboard);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-max">
        <div className="sm:flex">
          <p className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">404</p>
          <div className="sm:ml-6">
            <div className="sm:border-l sm:border-gray-200 sm:pl-6">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
              <p className="mt-1 text-base text-gray-500">Please check the URL in the address bar and try again.</p>
            </div>
            <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
              <button
                onClick={handleGoBack}
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Go back to dashboard"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleGoBack()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
