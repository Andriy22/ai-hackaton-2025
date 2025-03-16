import React from 'react';
import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dropzone } from '@/components/ui/dropzone';

interface ValidationDropzoneProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  isUploading: boolean;
  onValidate: () => void;
}

const ValidationDropzone: React.FC<ValidationDropzoneProps> = ({
  file,
  onFileChange,
  isUploading,
  onValidate
}) => {
  const handleUpload = async (uploadedFile: File) => {
    onFileChange(uploadedFile);
  };

  return (
    <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {file ? (
        <div className="p-6 flex flex-col items-center">
          <div className="w-24 h-24 mx-auto mb-4 relative">
            <img 
              src={URL.createObjectURL(file)} 
              alt="Preview" 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <p className="font-medium text-gray-700 mb-1">{file.name}</p>
          <p className="text-sm text-gray-500 mb-4">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
          <Button
            variant="outline"
            className="mb-2"
            onClick={() => onFileChange(null)}
          >
            Change file
          </Button>
        </div>
      ) : (
        <Dropzone 
          onUpload={handleUpload}
          className="border-0 shadow-none"
        />
      )}
      
      <div className="p-4 border-t border-gray-100 bg-white">
        <Button
          className="w-full"
          disabled={!file || isUploading}
          onClick={onValidate}
        >
          {isUploading ? (
            <>
              <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            'Validate Image'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ValidationDropzone;
