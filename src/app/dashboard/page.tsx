"use client";

import DashboardNavbar from "@/components/dashboard-navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  InfoIcon,
  UserCircle,
  FileText,
  Briefcase,
  Building,
  Download,
  Loader2,
  Copy,
  CheckCircle,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { createClient } from "../../../supabase/client";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobTitle, setJobTitle] = useState("DevOps Engineer");
  const [companyName, setCompanyName] = useState("AnyCompany");
  const [resume, setResume] = useState(`John Doe
Senior Software Engineer
john.doe@example.com | (123) 456-7890 | linkedin.com/in/johndoe

SKILLS
Languages: JavaScript, TypeScript, Python, Java, SQL
Frameworks: React, Next.js, Node.js, Express, Django
Tools: Git, Docker, Kubernetes, AWS, GCP, CI/CD

EXPERIENCE
Senior Software Engineer | TechCorp | 2020 - Present
- Led development of microservices architecture that improved system reliability by 35%
- Implemented CI/CD pipeline reducing deployment time by 50%
- Mentored junior developers and conducted code reviews

Software Engineer | InnovateSoft | 2017 - 2020
- Developed RESTful APIs serving 1M+ daily requests
- Optimized database queries resulting in 40% performance improvement
- Collaborated with cross-functional teams to deliver features on schedule

EDUCATION
M.S. Computer Science | Tech University | 2017
B.S. Computer Science | State University | 2015`);
  const [copied, setCopied] = useState(false);
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const coverLetterRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // ✅ Load Supabase user data and OpenAI API key
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

    // Check for saved API key
    const savedApiKey = localStorage.getItem("openai_api_key");
    if (savedApiKey) {
      setOpenaiApiKey(savedApiKey);
    }
  }, []);

  // ✅ Generate GPT cover letter
  const handleGenerate = async () => {
    setLoading(true);
    setCoverLetter("");
    setCopied(false);

    try {
      const res = await fetch("/api/chatgpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle,
          companyName,
          resume,
          apiKey: openaiApiKey,
        }),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setCoverLetter(data.reply);
    } catch (error) {
      console.error("Error generating cover letter:", error);
      if (error.toString().includes("API key")) {
        setShowApiKeyInput(true);
      } else {
        alert("Failed to generate cover letter. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const saveApiKey = () => {
    localStorage.setItem("openai_api_key", openaiApiKey);
    setShowApiKeyInput(false);
    handleGenerate();
  };

  // Copy to clipboard function
  const copyToClipboard = () => {
    if (coverLetter) {
      navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Export as PDF function
  const exportToPDF = () => {
    // This is a placeholder for PDF export functionality
    // In a real implementation, you would use a library like jsPDF or html2pdf
    alert(
      "PDF export functionality will be implemented with a PDF generation library",
    );
  };

  return (
    <>
      <DashboardNavbar />
      <main className="w-full min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-gray-800">
              JobPilot AI Dashboard
            </h1>
            <div className="bg-blue-50 text-sm p-3 px-4 rounded-lg text-blue-700 flex gap-2 items-center border border-blue-100">
              <InfoIcon size="16" />
              <span>Welcome to your personal job application assistant</span>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - User Profile */}
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
                          <p className="text-xs text-muted-foreground">
                            Account active
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-xs text-muted-foreground">
                            Resume
                          </p>
                          <p className="font-medium">1 uploaded</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-xs text-muted-foreground">
                            Applications
                          </p>
                          <p className="font-medium">3 active</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Dashboard Overview */}
            <div className="lg:col-span-2">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase size={20} className="text-primary" />
                    <span>Dashboard Overview</span>
                  </CardTitle>
                  <CardDescription>
                    Your job search activity at a glance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <div className="text-blue-600 mb-1 text-sm font-medium">
                        Resume
                      </div>
                      <div className="text-2xl font-bold">1</div>
                      <div className="text-xs text-muted-foreground">
                        Uploaded
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <div className="text-green-600 mb-1 text-sm font-medium">
                        Jobs
                      </div>
                      <div className="text-2xl font-bold">5</div>
                      <div className="text-xs text-muted-foreground">
                        Matched
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                      <div className="text-purple-600 mb-1 text-sm font-medium">
                        Applications
                      </div>
                      <div className="text-2xl font-bold">3</div>
                      <div className="text-xs text-muted-foreground">
                        Submitted
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="justify-start"
                        onClick={() =>
                          (window.location.href = "/resume-upload")
                        }
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
