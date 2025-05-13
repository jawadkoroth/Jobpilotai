"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, CheckCircle, XCircle } from "lucide-react";
import { createClient } from "../../../supabase/client";

export default function ResumeUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);
    setMessage(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setMessage(null);
    setError(null);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("resumes")
      .upload(`public/${fileName}`, file);

    setUploading(false);

    if (error) {
      console.error("Upload failed:", error.message);
      setError("Upload failed. Please try again.");
    } else {
      setMessage("Resume uploaded successfully!");
      setTimeout(() => router.push("/dashboard"), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">Upload Your Resume</h1>

        <div>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          />
        </div>

        {file && (
          <p className="text-sm text-gray-500">
            Selected: <strong>{file.name}</strong>
          </p>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" /> Uploading...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" /> Upload Resume
            </>
          )}
        </button>

        {message && (
          <div className="text-green-600 flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4" /> {message}
          </div>
        )}

        {error && (
          <div className="text-red-600 flex items-center gap-2 text-sm">
            <XCircle className="w-4 h-4" /> {error}
          </div>
        )}
      </div>
    </div>
  );
}
