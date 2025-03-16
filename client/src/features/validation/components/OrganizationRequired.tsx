import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OrganizationRequired: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm p-8 text-center">
        <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-xl font-semibold mb-2">Organization Required</h1>
        <p className="text-gray-600 mb-6">
          You need to be assigned to an organization to validate retina images.
        </p>
        <Button
          onClick={() => window.location.href = '/account'}
          className="w-full"
        >
          Go to Account
        </Button>
      </div>
    </div>
  );
};

export default OrganizationRequired;
