"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "../../../supabase/client";

interface UploadAreaProps {
  onFileUploaded: (url: string, fileName: string) => void;
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
}

export default function UploadArea({
  onFileUploaded,
  isUploading,
  setIsUploading,
}: UploadAreaProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const fileType = file.type;
    if (
      fileType !== "application/pdf" &&
      fileType !==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      setUploadError("Please upload a PDF or DOCX file");
      return;
    }

    setFile(file);
    setUploadError(null);
  };

  const uploadFile = async () => {
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadError(null);

      // Check if user is authenticated
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setUploadError("Please sign in to upload your resume");
        return;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from("resumes")
        .upload(filePath, file);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("resumes").getPublicUrl(filePath);

      onFileUploaded(publicUrl, file.name);
    } catch (error: any) {
      console.error("Error uploading file:", error);
      setUploadError(error.message || "Error uploading file");
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors ${dragActive ? "border-primary bg-primary/5" : "border-gray-300 dark:border-gray-700"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {!file ? (
          <>
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium mb-1">
              Drag and drop your resume here
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              PDF or DOCX files only
            </p>
            <Button
              variant="outline"
              onClick={() => inputRef.current?.click()}
              className="text-sm"
            >
              Browse Files
            </Button>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleChange}
            />
          </>
        ) : (
          <div className="w-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="rounded-full bg-primary/10 p-2 mr-3">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium truncate max-w-[200px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={removeFile}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={uploadFile}
              className="w-full"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Resume"
              )}
            </Button>
          </div>
        )}
      </div>

      {uploadError && (
        <div className="mt-2 text-sm text-red-500">{uploadError}</div>
      )}
    </div>
  );
}
