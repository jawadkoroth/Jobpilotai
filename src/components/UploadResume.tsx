"use client";

import { useState } from "react";

export default function UploadResume() {
  const [resume, setResume] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setResume(file || null);
  };

  const handleUpload = async () => {
    if (!resume) {
      setStatus("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", resume);

    setStatus("Uploading...");

    const res = await fetch("/api/upload-resume", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      setStatus("✅ Upload successful! Resume URL: " + data.url);
    } else {
      setStatus("❌ Upload failed: " + data.error);
    }
  };

  return (
    <div className="bg-white shadow p-6 rounded-lg max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-4">Upload Your Resume</h2>

      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="border p-2 w-full mb-4"
      />

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Upload
      </button>

      <p className="mt-4 text-sm text-gray-700">{status}</p>
    </div>
  );
}
