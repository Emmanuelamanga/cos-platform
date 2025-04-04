// components/forms/file-uploader.tsx
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { UploadCloud, X, FileText, Image, Film } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  files: File[];
  setFiles: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  className?: string;
}

export function FileUploader({
  files,
  setFiles,
  maxFiles = 5,
  maxSize = 10,
  className,
}: FileUploaderProps) {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFiles = (fileList: FileList): File[] => {
    setError(null);
    const validFiles: File[] = [];
    
    // Check if adding files exceeds the maximum
    if (files.length + fileList.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files`);
      return validFiles;
    }
    
    // Validate each file
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        setError(`File "${file.name}" exceeds the ${maxSize}MB size limit`);
        continue;
      }
      
      // Check file type (optional: add more validations if needed)
      
      validFiles.push(file);
    }
    
    return validFiles;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const validFiles = validateFiles(e.dataTransfer.files);
      if (validFiles.length > 0) {
        setFiles([...files, ...validFiles]);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      const validFiles = validateFiles(e.target.files);
      if (validFiles.length > 0) {
        setFiles([...files, ...validFiles]);
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const openFileSelector = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const getFileIcon = (file: File) => {
    const fileType = file.type;
    if (fileType.startsWith('image/')) {
      return <Image className="h-4 w-4" alt="image" width={10}
      height={10}/>;
    } else if (fileType.startsWith('video/')) {
      return <Film className="h-4 w-4" />;
    } else {
      return <FileText className="h-4 w-4" />;
    }
  };

  const formatFileSize = (size: number): string => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20",
          "relative flex flex-col items-center justify-center gap-2 text-center"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <UploadCloud className="h-8 w-8 text-muted-foreground" />
        <div className="space-y-1">
          <p className="text-sm font-medium">Drag & drop files here</p>
          <p className="text-xs text-muted-foreground">
            or click to browse files from your device
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleChange}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mt-2"
          onClick={openFileSelector}
          disabled={files.length >= maxFiles}
        >
          Select Files
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          Supports images, documents, and videos up to {maxSize}MB
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            {files.length} {files.length === 1 ? "file" : "files"} selected
            {maxFiles && (
              <span className="text-muted-foreground"> (max {maxFiles})</span>
            )}
          </p>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between border rounded-md p-2"
              >
                <div className="flex items-center gap-2">
                  {getFileIcon(file)}
                  <div className="text-sm max-w-[180px] sm:max-w-[300px] truncate">
                    {file.name}
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {formatFileSize(file.size)}
                  </Badge>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}