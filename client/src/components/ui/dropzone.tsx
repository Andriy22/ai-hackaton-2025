import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DropzoneProps {
  onUpload: (file: File) => Promise<void>;
  className?: string;
}

export function Dropzone({ onUpload, className }: DropzoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Only take the first file
    const imageFile = acceptedFiles[0];
    
    if (!imageFile) return;
    
    if (!imageFile.type.startsWith('image/')) {
      alert('Please upload only image files');
      return;
    }
    
    setFile(imageFile);
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1, // Only allow one file
    multiple: false // Disable multiple file selection
  });
  
  const removeFile = () => {
    setFile(null);
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    try {
      setUploading(true);
      await onUpload(file);
      setFile(null);
    } catch (error) {
      console.error('Failed to upload file:', error);
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className={cn("w-full space-y-6", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-150 ease-in-out",
          isDragActive 
            ? "border-primary bg-primary/5" 
            : "border-muted-foreground/25",
          "hover:border-primary hover:bg-primary/5",
          uploading && "pointer-events-none opacity-50"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-primary/10 p-4">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <p className="text-xl font-medium text-foreground">
              {isDragActive ? "Drop image here..." : "Upload image"}
            </p>
            <p className="text-sm text-muted-foreground">
              Drag and drop an image here or click to select
            </p>
          </div>
        </div>
      </div>
  
      {file && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-4 rounded-lg border p-4 bg-card">
              <div className="rounded-md bg-primary/10 p-2">
                <ImageIcon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={removeFile}
                className="shrink-0"
                aria-label="Remove file"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && removeFile()}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={handleUpload}
              disabled={uploading}
              aria-label="Upload file"
              tabIndex={0}
            >
              {uploading ? "Uploading..." : "Upload image"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
