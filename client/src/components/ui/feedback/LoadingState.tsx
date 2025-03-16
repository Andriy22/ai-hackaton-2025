import { ReactNode } from 'react';

interface LoadingStateProps {
  /**
   * Custom message to display below the spinner
   */
  message?: string;
  /**
   * Additional CSS classes to apply to the container
   */
  className?: string;
  /**
   * Whether to use full screen height
   */
  fullScreen?: boolean;
  /**
   * Size of the spinner (small, medium, large)
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Optional children to render below the spinner
   */
  children?: ReactNode;
}

export const LoadingState = ({
  message = 'Loading...',
  className = '',
  fullScreen = false,
  size = 'md',
  children,
}: LoadingStateProps) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  return (
    <div 
      className={`flex ${fullScreen ? 'h-screen' : 'h-full'} w-full items-center justify-center ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center justify-center text-center">
        <div 
          className={`mx-auto mb-4 ${sizeClasses[size]} animate-spin rounded-full border-4 border-primary border-t-transparent`}
          aria-hidden="true"
        ></div>
        {message && <p className="text-lg font-medium text-gray-600">{message}</p>}
        {children}
      </div>
    </div>
  );
};
