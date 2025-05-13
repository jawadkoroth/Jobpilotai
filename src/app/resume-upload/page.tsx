"use client";

import { useState, useEffect } from "react";
import { FileText, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import DashboardNavbar from "@/components/dashboard-navbar";
import UploadArea from "@/components/resume-upload/upload-area";
import { createClient } from "../../../supabase/client";

export default function ResumeUploadPage() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [parsedText, setParsedText] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [savedResumes, setSavedResumes] = useState<any[]>([]);
  const supabase = createClient();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Fetch user's previously uploaded resumes
    const fetchResumes = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from("resumes")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          if (error) {
            console.error("Error fetching resumes:", error);
          } else {
            setSavedResumes(data || []);
          }
        }
      } catch (error) {
        console.error("Error fetching resumes:", error);
      }
    };

    fetchResumes();
  }, []);

  const handleFileUploaded = (url: string, name: string) => {
    setFileUrl(url);
    setFileName(name);
    setParsedText(null);
    setParseError(null);
  };

  const handleParseResume = async () => {
    if (!fileUrl) return;

    try {
      setIsParsing(true);
      setParseError(null);

      const response = await fetch("/api/parse-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to parse resume");
      }

      setParsedText(data.text);
    } catch (error: any) {
      console.error("Error parsing resume:", error);
      setParseError(error.message || "Error parsing resume");
    } finally {
      setIsParsing(false);
    }
  };

  const handleSaveResume = async () => {
    if (!fileUrl || !fileName || !parsedText) return;

    try {
      setIsSaving(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Please sign in to save your resume");
        return;
      }

      // Save resume to Supabase
      const { data, error } = await supabase
        .from("resumes")
        .insert({
          user_id: user.id,
          filename: fileName,
          url: fileUrl,
          text_content: parsedText,
        })
        .select();

      if (error) {
        console.error("Error saving resume:", error);
        alert("Failed to save resume. Please try again.");
      } else {
        // Update the list of saved resumes
        setSavedResumes([data[0], ...savedResumes]);
        alert("Resume saved successfully!");
      }
    } catch (error) {
      console.error("Error saving resume:", error);
      alert("Failed to save resume. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const resetAll = () => {
    setFileUrl(null);
    setFileName(null);
    setParsedText(null);
    setParseError(null);
  };

  return (
    <>
      <DashboardNavbar />
      <main className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Resume Upload
            </h1>
            <div className="bg-blue-50 dark:bg-blue-900/30 text-sm p-3 px-4 rounded-lg text-blue-700 dark:text-blue-300 flex gap-2 items-center border border-blue-100 dark:border-blue-800">
              <FileText size="16" />
              <span>Upload your resume to parse and extract information</span>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Upload Card */}
            <div className="md:col-span-2">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText size={20} className="text-primary" />
                    <span>Resume Upload</span>
                  </CardTitle>
                  <CardDescription>
                    Upload your resume in PDF or DOCX format
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UploadArea
                    onFileUploaded={handleFileUploaded}
                    isUploading={isUploading}
                    setIsUploading={setIsUploading}
                  />

                  {fileUrl && (
                    <div className="mt-6">
                      <Button
                        onClick={handleParseResume}
                        className="w-full"
                        disabled={isParsing}
                      >
                        {isParsing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Parsing Resume...
                          </>
                        ) : (
                          "Parse Resume"
                        )}
                      </Button>
                    </div>
                  )}

                  {parseError && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-md text-red-700 dark:text-red-300 text-sm">
                      {parseError}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Parsed Resume Card */}
              {parsedText && (
                <Card className="shadow-md mt-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText size={20} className="text-primary" />
                      <span>Parsed Resume</span>
                    </CardTitle>
                    <CardDescription>
                      Extracted text from {fileName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                      <pre className="whitespace-pre-wrap text-sm font-mono overflow-auto max-h-[500px]">
                        {parsedText}
                      </pre>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={resetAll}>
                      Upload Another Resume
                    </Button>
                    <Button onClick={handleSaveResume} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>Save Resume</>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>

            {/* Right Column - Saved Resumes */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText size={20} className="text-primary" />
                    <span>Saved Resumes</span>
                  </CardTitle>
                  <CardDescription>
                    Your previously uploaded resumes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {savedResumes.length > 0 ? (
                    <div className="space-y-4">
                      {savedResumes.map((resume) => (
                        <div
                          key={resume.id}
                          className="p-3 border rounded-md flex justify-between items-center"
                        >
                          <div className="flex items-center gap-2">
                            <FileText size={16} className="text-blue-600" />
                            <div>
                              <p className="text-sm font-medium truncate max-w-[150px]">
                                {resume.filename}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(
                                  resume.created_at,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <CheckCircle size={16} className="text-green-500" />
                            <span className="text-xs ml-1 text-green-600">
                              Active
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                      <p>No resumes saved yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
