import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Upload, X, Image as ImageIcon, FileImage, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface DropzoneProps {
  onUpload: (file: File) => Promise<void>;
  className?: string;
  maxSizeMB?: number;
}

export function Dropzone({ onUpload, className, maxSizeMB = 10 }: DropzoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    // Only take the first file
    const imageFile = acceptedFiles[0];
    
    if (!imageFile) return;
    
    if (!imageFile.type.startsWith('image/')) {
      setError('Please upload only image files');
      return;
    }

    // Check file size
    if (imageFile.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds the ${maxSizeMB}MB limit`);
      return;
    }
    
    setFile(imageFile);
  }, [maxSizeMB]);

  // Create and cleanup preview URL
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Free memory when component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1, // Only allow one file
    multiple: false // Disable multiple file selection
  });
  
  const removeFile = () => {
    setFile(null);
    setError(null);
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    try {
      setUploading(true);
      setError(null);
      await onUpload(file);
      setFile(null);
    } catch (error) {
      console.error('Failed to upload file:', error);
      setError('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div 
      className={cn("w-full space-y-6", className)}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        {...getRootProps()}
        variants={itemVariants}
        className={cn(
          "relative overflow-hidden border-2 border-dashed rounded-xl transition-all duration-300 ease-in-out",
          isDragActive && !isDragReject 
            ? "border-blue-500 bg-blue-50/50 shadow-md" 
            : isDragReject
              ? "border-red-400 bg-red-50/50"
              : "border-gray-200 dark:border-gray-700",
          "hover:border-blue-400 hover:bg-blue-50/30 dark:hover:border-blue-500 dark:hover:bg-blue-900/10",
          file ? "p-6" : "p-8",
          uploading && "pointer-events-none opacity-80",
          "group"
        )}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

        <input {...getInputProps()} aria-label="Upload image files" />
        
        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div 
              key="dropzone-empty"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={itemVariants}
              className="flex flex-col items-center gap-4 relative z-10"
            >
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-200 group-hover:duration-1000"></div>
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white dark:bg-gray-900 group-hover:scale-105 transition-transform duration-300">
                  <Upload className="w-10 h-10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-200" />
                </div>
              </div>
              
              <div className="space-y-2 text-center">
                <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent transition-all duration-300 group-hover:from-blue-600 group-hover:to-violet-600">
                  {isDragActive ? "Drop your image here" : "Upload an image"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                  Drag and drop an image file here, or click to browse
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Supported formats: JPEG, PNG, GIF, WebP • Max size: {maxSizeMB}MB
                </p>
              </div>

              <div className="mt-4">
                <div className="p-2 px-4 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                  or click to browse files
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="dropzone-preview"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={itemVariants}
              className="flex flex-col items-center gap-4 relative z-10"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-2 w-full max-w-md mx-auto">
                <div className="aspect-video rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 relative">
                  {preview ? (
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <FileImage className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                Drop a new image to replace this one
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
  
      <AnimatePresence>
        {file && (
          <motion.div 
            className="space-y-4"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
          >
            <motion.div 
              className="space-y-3"
              variants={itemVariants}
            >
              <div className="flex items-center gap-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 shadow-sm transition-all duration-200 hover:shadow-md">
                <div className="rounded-md bg-blue-100 dark:bg-blue-900/30 p-2">
                  <ImageIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                    <span>{file.type.split('/')[1].toUpperCase()}</span>
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={removeFile}
                  className="shrink-0 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                  aria-label="Remove file"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              className="space-y-2"
              variants={itemVariants}
            >
              <Button
                className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                onClick={handleUpload}
                disabled={uploading}
                aria-label="Upload file"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 group-hover:via-blue-500/40 animate-[shine_2s_ease-in-out_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                <span className="relative flex items-center justify-center gap-2">
                  {uploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Upload image
                    </>
                  )}
                </span>
              </Button>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Your file will be processed after uploading
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
