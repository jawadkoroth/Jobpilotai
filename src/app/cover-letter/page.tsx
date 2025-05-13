"use client";

import { useState, useRef, useEffect } from "react";
import { FileText, Loader2, Copy, CheckCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardNavbar from "@/components/dashboard-navbar";

export default function CoverLetterPage() {
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

  // Load user data and OpenAI API key
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

  // Generate GPT cover letter
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
              AI Cover Letter Generator
            </h1>
            <div className="bg-blue-50 text-sm p-3 px-4 rounded-lg text-blue-700 flex gap-2 items-center border border-blue-100">
              <FileText size="16" />
              <span>
                Generate professional cover letters tailored to your job
                applications
              </span>
            </div>
          </header>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={20} className="text-primary" />
                <span>Cover Letter Generator</span>
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
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Input
                        id="jobTitle"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g. Software Engineer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Google"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resume">Your Resume</Label>
                    <Textarea
                      id="resume"
                      value={resume}
                      onChange={(e) => setResume(e.target.value)}
                      placeholder="Paste your resume here..."
                      className="min-h-[200px] font-mono text-sm"
                    />
                  </div>

                  {showApiKeyInput ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-800">
                          Please enter your OpenAI API key to generate cover
                          letters.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="apiKey">OpenAI API Key</Label>
                        <Input
                          id="apiKey"
                          type="password"
                          value={openaiApiKey}
                          onChange={(e) => setOpenaiApiKey(e.target.value)}
                          placeholder="sk-..."
                          className="font-mono"
                        />
                      </div>
                      <Button
                        onClick={saveApiKey}
                        className="w-full"
                        disabled={!openaiApiKey}
                      >
                        Save API Key & Generate
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={handleGenerate}
                      className="w-full"
                      disabled={loading || !jobTitle || !companyName || !resume}
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
                  )}
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
      </main>
    </>
  );
}
