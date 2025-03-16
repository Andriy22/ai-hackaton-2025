import React, { useState } from 'react';
import { LoaderCircle, Upload, FileImage, XCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dropzone } from '@/components/ui/dropzone';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [isHovering, setIsHovering] = useState(false);
  
  const handleUpload = async (uploadedFile: File) => {
    onFileChange(uploadedFile);
  };

  return (
    <motion.div 
      className="mb-6 bg-white rounded-xl border border-gray-100 overflow-hidden p-6 pt-8 pb-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ 
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
      }}
    >
      <AnimatePresence mode="wait">
        {file ? (
          <motion.div 
            key="file-preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-8 flex flex-col items-center"
          >
            <motion.div 
              className="w-48 h-48 mx-auto mb-6 relative rounded-2xl overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.img 
                src={URL.createObjectURL(file)} 
                alt="Preview" 
                className="w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              />
              
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => onFileChange(null)}
                  aria-label="Remove file"
                >
                  <XCircle className="h-5 w-5 mr-2" />
                  Remove
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div
              className="text-center space-y-1 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative">
                <p className="font-medium text-gray-800 mb-1 flex items-center justify-center">
                  <FileImage className="h-4 w-4 mr-2 text-teal-500" />
                  {file.name}
                </p>
                <motion.div 
                  className="h-1 w-full bg-gray-100 rounded-full overflow-hidden mt-1"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  <div className="h-full bg-gradient-to-r from-teal-400 to-teal-600 w-full rounded-full"></div>
                </motion.div>
              </div>
              <p className="text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                variant="outline"
                className="rounded-full px-4 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
                onClick={() => onFileChange(null)}
              >
                Change file
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="p-6 pt-10 pb-8">
              {/* <motion.div 
                className="relative mb-4 flex justify-center"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 blur-lg opacity-75"></div>
                <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center border border-teal-100">
                  <Upload className="h-10 w-10 text-teal-500" />
                </div>
              </motion.div> */}
              
              {/* <motion.div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Upload Retina Scan
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  Drag and drop or click to select a file
                </p>
                <p className="text-xs text-gray-400">
                  Supported formats: JPG, PNG, TIFF
                </p>
              </motion.div> */}
            </div>
            
            <Dropzone 
              onUpload={handleUpload}
              className="border-0 shadow-none"
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        className="p-5 border-t border-gray-100 bg-gradient-to-b from-white to-gray-50 mt-6"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onHoverStart={() => setIsHovering(true)}
          onHoverEnd={() => setIsHovering(false)}
        >
          <Button
            className={`w-full relative overflow-hidden group ${!file ? 'bg-gray-300 text-gray-500' : 'bg-gradient-to-r from-teal-500 to-blue-500'}`}
            disabled={!file || isUploading}
            onClick={onValidate}
          >
            {/* Background hover effect */}
            {file && !isUploading && (
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-teal-600 to-blue-600 opacity-0 group-hover:opacity-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovering ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
            
            {/* Button content with animations */}
            <motion.div className="relative flex items-center justify-center">
              {isUploading ? (
                <>
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    <LoaderCircle className="h-4 w-4" />
                  </motion.div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  {file ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>Validate Image</span>
                    </>
                  ) : (
                    <span>Select a file to validate</span>
                  )}
                </>
              )}
            </motion.div>
          </Button>
        </motion.div>
        
        {file && !isUploading && (
          <motion.p 
            className="text-xs text-center text-gray-400 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Click to validate the retina scan image
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ValidationDropzone;
