import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, Loader2, Search } from 'lucide-react';
import { Button } from './button';

interface FeedbackStateProps {
  message?: string;
  title?: string;
  className?: string;
  fullScreen?: boolean;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  };
}

export const LoadingState: React.FC<FeedbackStateProps> = ({
  message = 'Loading...',
  className,
  fullScreen = false,
}) => {
  const containerClasses = cn(
    'flex flex-col items-center justify-center p-8 text-center',
    fullScreen ? 'min-h-[70vh]' : 'min-h-[200px]',
    className
  );

  return (
    <div className={containerClasses}>
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="mt-4 text-lg font-medium text-gray-600">{message}</p>
    </div>
  );
};

export const ErrorState: React.FC<FeedbackStateProps> = ({
  message = 'An error occurred. Please try again.',
  className,
  fullScreen = false,
  action,
}) => {
  const containerClasses = cn(
    'flex flex-col items-center justify-center p-8 text-center',
    fullScreen ? 'min-h-[70vh]' : 'min-h-[200px]',
    className
  );

  return (
    <div className={containerClasses}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <AlertCircle className="h-10 w-10 text-red-600" />
      </div>
      <p className="mt-4 text-lg font-medium text-gray-800">{message}</p>
      {action && (
        <Button 
          onClick={action.onClick} 
          variant={action.variant || "default"} 
          className="mt-4"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

export const NotFoundState: React.FC<FeedbackStateProps> = ({
  title = 'Not Found',
  message = 'The resource you are looking for does not exist or has been removed.',
  className,
  fullScreen = false,
  action,
}) => {
  const containerClasses = cn(
    'flex flex-col items-center justify-center p-8 text-center',
    fullScreen ? 'min-h-[70vh]' : 'min-h-[200px]',
    className
  );

  return (
    <div className={containerClasses}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <Search className="h-10 w-10 text-gray-600" />
      </div>
      <h2 className="mt-4 text-xl font-bold text-gray-800">{title}</h2>
      <p className="mt-2 text-gray-600">{message}</p>
      {action && (
        <Button 
          onClick={action.onClick} 
          variant={action.variant || "default"} 
          className="mt-4"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};
