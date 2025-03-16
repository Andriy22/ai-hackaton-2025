import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface NotFoundStateProps {
  /**
   * Title for the not found state
   */
  title?: string;
  /**
   * Message to display
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
   * Optional children to render below the message
   */
  children?: ReactNode;
}

export const NotFoundState = ({
  title = 'Not Found',
  message,
  className = '',
  action,
  children,
}: NotFoundStateProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && action?.onClick) {
      action.onClick();
    }
  };

  return (
    <div 
      className={`rounded-md bg-yellow-50 p-4 text-yellow-700 ${className}`}
      role="alert"
      aria-live="polite"
    >
      <h3 className="text-lg font-medium">{title}</h3>
      <p>{message}</p>
      
      {action && (
        <Button
          className="mt-4"
          variant={action.variant || 'outline'}
          onClick={action.onClick}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-label={action.label}
        >
          {action.icon && <span className="mr-2">{action.icon}</span>}
          {action.label}
        </Button>
      )}
      
      {children}
    </div>
  );
};
