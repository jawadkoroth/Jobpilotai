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
  const coverLetterRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // ✅ Load Supabase user data
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

  // ✅ Generate GPT cover letter
  const handleGenerate = async () => {
    setLoading(true);
    setCoverLetter("");
    setCopied(false);

    try {
      const res = await fetch("/api/chatgpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, companyName, resume }),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setCoverLetter(data.reply);
    } catch (error) {
      console.error("Error generating cover letter:", error);
      alert("Failed to generate cover letter. Please try again.");
    } finally {
      setLoading(false);
    }
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
                    <div className="bg-muted/30 rounded-lg p-4 overflow-hidden text-xs font-mono">
                      <div className="max-h-48 overflow-auto">
                        {JSON.stringify(user, null, 2)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Cover Letter Generator */}
            <div className="lg:col-span-2">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText size={20} className="text-primary" />
                    <span>AI Cover Letter Generator</span>
                  </CardTitle>
                  <CardDescription>
                    Generate a professional cover letter tailored to your job
                    application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="generate">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="generate">Generate</TabsTrigger>
                      <TabsTrigger value="result" disabled={!coverLetter}>
                        Result
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="generate" className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="jobTitle"
                            className="flex items-center gap-1"
                          >
                            <Briefcase size={14} />
                            Job Title
                          </Label>
                          <Input
                            id="jobTitle"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            placeholder="e.g. Software Engineer"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="companyName"
                            className="flex items-center gap-1"
                          >
                            <Building size={14} />
                            Company Name
                          </Label>
                          <Input
                            id="companyName"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="e.g. Google"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="resume"
                          className="flex items-center gap-1"
                        >
                          <FileText size={14} />
                          Your Resume
                        </Label>
                        <Textarea
                          id="resume"
                          value={resume}
                          onChange={(e) => setResume(e.target.value)}
                          placeholder="Paste your resume here..."
                          className="min-h-[200px] font-mono text-sm"
                        />
                      </div>

                      <Button
                        onClick={handleGenerate}
                        className="w-full"
                        disabled={
                          loading || !jobTitle || !companyName || !resume
                        }
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          "Generate Cover Letter"
                        )}
                      </Button>
                    </TabsContent>

                    <TabsContent value="result">
                      {coverLetter && (
                        <div className="space-y-4">
                          <div
                            ref={coverLetterRef}
                            className="p-6 bg-white rounded-lg border border-gray-200 text-sm whitespace-pre-wrap shadow-inner min-h-[300px] max-h-[500px] overflow-auto"
                          >
                            {coverLetter}
                          </div>

                          <div className="flex flex-wrap gap-2 justify-end">
                            <Button variant="outline" onClick={copyToClipboard}>
                              {copied ? (
                                <>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="mr-2 h-4 w-4" />
                                  Copy to Clipboard
                                </>
                              )}
                            </Button>
                            <Button onClick={exportToPDF}>
                              <Download className="mr-2 h-4 w-4" />
                              Export as PDF
                            </Button>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
