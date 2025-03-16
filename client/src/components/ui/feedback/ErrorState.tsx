import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  /**
   * Error title
   */
  title?: string;
  /**
   * Error message to display
   */
  message: string;
  /**
   * Additional CSS classes to apply to the container
   */
  className?: string;
  /**
   * Optional action button configuration
   */
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    icon?: ReactNode;
  };
  /**
   * Optional children to render below the error message
   */
  children?: ReactNode;
}

export const ErrorState = ({
  title = 'Error',
  message,
  className = '',
  action,
  children,
}: ErrorStateProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && action?.onClick) {
      action.onClick();
    }
  };

  return (
    <div 
      className={`rounded-md bg-red-50 p-4 text-red-500 ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <h3 className="text-lg font-medium">{title}</h3>
      <p>{message}</p>
      
      {action && (
        <Button
          className="mt-4"
          variant={action.variant || 'default'}
          onClick={action.onClick}
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {action.icon && <span className="mr-2">{action.icon}</span>}
          {action.label}
        </Button>
      )}
      
      {children}
    </div>
  );
};
