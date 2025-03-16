import React from 'react';
import { LoaderCircle, AlertCircle } from 'lucide-react';

export enum ValidationStatusType {
  IDLE = 'idle',
  UPLOADING = 'uploading',
  SUCCESS = 'success',
  ERROR = 'error'
}

interface ValidationStatusProps {
  status: ValidationStatusType;
  error: string | null;
}

const ValidationStatus: React.FC<ValidationStatusProps> = ({ status, error }) => {
  if (status === ValidationStatusType.IDLE) return null;
  
  if (status === ValidationStatusType.UPLOADING) {
    return (
      <div className="flex items-center justify-center py-6">
        <LoaderCircle className="h-8 w-8 text-primary animate-spin mr-3" />
        <span className="text-lg font-medium">Processing image...</span>
      </div>
    );
  }
  
  if (status === ValidationStatusType.ERROR && error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-6">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Validation Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};

export default ValidationStatus;
