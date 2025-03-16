import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import type { ValidationResult as ValidationResultType } from '../api/types';

interface ValidationResultProps {
  result: ValidationResultType | null;
}

const ValidationResultComponent: React.FC<ValidationResultProps> = ({ result }) => {
  if (!result) return null;
  
  const isMatch = Boolean(result.matchingEmployeeId);
  
  return (
    <div className="mt-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-4">Validation Results</h2>
      
      <div className="flex items-center mb-6">
        {isMatch ? (
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
            <span className="text-lg font-medium text-green-700">Match Found</span>
          </div>
        ) : (
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-yellow-500 mr-2" />
            <span className="text-lg font-medium text-yellow-700">No Match Found</span>
          </div>
        )}
      </div>
      
      {result.similarity !== null && (
        <div className="mb-4">
          <div className="text-gray-600 mb-1">Similarity Score</div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${isMatch ? 'bg-green-500' : 'bg-yellow-500'}`}
              style={{ width: `${result.similarity * 100}%` }}
              aria-label={`Similarity score: ${(result.similarity * 100).toFixed(2)}%`}
            ></div>
          </div>
          <div className="text-right text-sm text-gray-500 mt-1">
            {(result.similarity * 100).toFixed(2)}%
          </div>
        </div>
      )}
      
      {result.message && (
        <div className="p-3 bg-gray-50 rounded-lg text-gray-700 mb-4">
          {result.message}
        </div>
      )}
    </div>
  );
};

export default ValidationResultComponent;
