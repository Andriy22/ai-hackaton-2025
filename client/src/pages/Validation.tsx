import React from 'react';
import useAuthStore from '@/features/auth/store/useAuthStore';
import useValidationStore from '@/features/validation/store/useValidationStore';

// Import components
import ValidationDropzone from '@/features/validation/components/ValidationDropzone';
import ValidationResultComponent from '@/features/validation/components/ValidationResult';
import EmployeeDetails from '@/features/validation/components/EmployeeDetails';
import OrganizationRequired from '@/features/validation/components/OrganizationRequired';
import ValidationStatus, { ValidationStatusType } from '@/features/validation/components/ValidationStatus';

const ValidationPage: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    file, 
    validationResult, 
    employee, 
    status, 
    error, 
    setFile, 
    validateImage 
  } = useValidationStore();

  // Early return if no organization ID
  if (!user?.organizationId) {
    return <OrganizationRequired />;
  }

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
  };

  const handleValidate = async () => {
    if (!user?.organizationId) return;
    await validateImage(user.organizationId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Retina Image Validation</h1>
          <p className="text-gray-600">
            Upload a retina image to validate against the organization's database
          </p>
        </div>
        
        <ValidationDropzone 
          file={file}
          onFileChange={handleFileChange}
          isUploading={status === ValidationStatusType.UPLOADING}
          onValidate={handleValidate}
        />
        
        {/* <ValidationStatus status={status} error={error} /> */}
        
        <ValidationResultComponent result={validationResult} />
        
        <EmployeeDetails employee={employee} />
      </div>
    </div>
  );
};

export default ValidationPage;
