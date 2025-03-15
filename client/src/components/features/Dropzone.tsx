import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { Progress } from '@/components/ui/progress';

interface DropzoneProps {
  onUpload: (files: File[]) => Promise<void>;
  className?: string;
}

export function Dropzone({ onUpload, className }: DropzoneProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
  
    const onDrop = useCallback((acceptedFiles: File[]) => {
      const imageFiles = acceptedFiles.filter(file => 
        file.type.startsWith('image/')
      );
  
      if (imageFiles.length !== acceptedFiles.length) {
        alert({
          variant: "destructive",
          title: "Error",
          description: "Please upload only images"
        });
        return;
      }
  
      setFiles(prev => [...prev, ...imageFiles]);
    }, []);
  
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: {
        'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
      }
    });
  
    const removeFile = (index: number) => {
      setFiles(prev => prev.filter((_, i) => i !== index));
    };
  
    const handleUpload = async () => {
      try {
        setUploading(true);
        // Simulate upload progress
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 95) {
              clearInterval(interval);
              return prev;
            }
            return prev + 5;
          });
        }, 100);
  
        await onUpload(files);
        setUploadProgress(100);
        setTimeout(() => {
          setFiles([]);
          setUploading(false);
          setUploadProgress(0);
        }, 500);
        alert({
          title: "Success",
          description: "Files uploaded successfully"
        });
      } catch (error) {
        alert({
          variant: "destructive",
          title: "Error",
          description: "Failed to upload files"
        });
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    };
  
    return (
      <div className={cn("w-full space-y-6", className)}>
        <div
          {...getRootProps()}
          className={cn(
            "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-150 ease-in-out",
            isDragActive 
              ? "border-primary bg-primary/5 scale-102" 
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
                {isDragActive ? "Drop files here..." : "Upload images"}
              </p>
              <p className="text-sm text-muted-foreground">
                Drag and drop files here or click to select
              </p>
            </div>
          </div>
        </div>
  
        {files.length > 0 && (
          <div className="space-y-4">
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-lg border p-4 bg-card"
                >
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
                    onClick={() => removeFile(index)}
                    className="shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading 
                  ? "Uploading..." 
                  : `Upload ${files.length} file${files.length !== 1 ? 's' : ''}`
                }
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }