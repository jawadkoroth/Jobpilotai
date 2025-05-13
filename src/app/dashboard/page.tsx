"use client";

import DashboardNavbar from "@/components/dashboard-navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InfoIcon, UserCircle, FileText, Briefcase, Clock } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { createClient } from "../../../supabase/client";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/user");
      const data = await res.json();
      if (!data.user) {
        window.location.href = "/sign-in";
      } else {
        setUser(data.user);
      }
    };
    fetchUser();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setResumeFile(file);
  };

  const handleUpload = async () => {
    if (!resumeFile) return alert("Please select a resume file.");

    setUploading(true);

    const formData = new FormData();
    formData.append("resume", resumeFile);

    const res = await fetch("/api/upload-resume", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      alert("Upload failed.");
    } else {
      alert("Resume uploaded successfully!");
      setResumeFile(null);
    }

    setUploading(false);
  };

  return (
    <>
      <DashboardNavbar />
      <main className="w-full min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header */}
          <header className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-gray-800">JobPilot AI Dashboard</h1>
            <div className="bg-blue-50 text-sm p-3 px-4 rounded-lg text-blue-700 flex gap-2 items-center border border-blue-100">
              <InfoIcon size={16} />
              <span>Welcome to your personal job application assistant</span>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-1">
              {user && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCircle size={20} className="text-primary" />
                      <span>User Profile</span>
                    </CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-100 text-blue-700 p-2 rounded-full">
                          <UserCircle size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.email}</p>
                          <p className="text-xs text-muted-foreground">Account active</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-xs text-muted-foreground">Resume</p>
                          <p className="font-medium">1 uploaded</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-xs text-muted-foreground">Applications</p>
                          <p className="font-medium">3 active</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Dashboard Overview */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase size={20} className="text-primary" />
                    <span>Dashboard Overview</span>
                  </CardTitle>
                  <CardDescription>Your job search activity at a glance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <div className="text-blue-600 mb-1 text-sm font-medium">Resume</div>
                      <div className="text-2xl font-bold">1</div>
                      <div className="text-xs text-muted-foreground">Uploaded</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <div className="text-green-600 mb-1 text-sm font-medium">Jobs</div>
                      <div className="text-2xl font-bold">5</div>
                      <div className="text-xs text-muted-foreground">Matched</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                      <div className="text-purple-600 mb-1 text-sm font-medium">Applications</div>
                      <div className="text-2xl font-bold">3</div>
                      <div className="text-xs text-muted-foreground">Submitted</div>
                    </div>
                  </div>

                  {/* Upload Resume Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Upload New Resume</h3>
                    <div className="space-y-2">
                      <Label htmlFor="resume">Select Resume (PDF, DOCX, etc.)</Label>
                      <Input id="resume" type="file" onChange={handleFileChange} />
                      <Button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="mt-2"
                      >
                        {uploading ? "Uploading..." : "Upload Resume"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => (window.location.href = "/resume-upload")}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Upload Resume
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => (window.location.href = "/cover-letter")}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Cover Letter
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => (window.location.href = "/jobs")}
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    Browse Jobs
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => (window.location.href = "/status")}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    View Applications
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
