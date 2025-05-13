"use client";

import { useEffect, useState } from "react";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Briefcase,
  Building,
  MapPin,
  Calendar,
  Filter,
  Loader2,
  ExternalLink,
  FileText,
} from "lucide-react";
import { createClient } from "../../../supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  posted_date: string;
  match_score: number;
  platform: string;
  description: string;
  url: string;
}

interface Application {
  id: string;
  job_id: string;
  status: string;
  applied_at: string;
  job_title: string;
  company_name: string;
}

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingToJob, setApplyingToJob] = useState<Job | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [generatingCoverLetter, setGeneratingCoverLetter] = useState(false);
  const [submittingApplication, setSubmittingApplication] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    minMatchScore: 0,
    platform: "all",
    location: "all",
  });
  const supabase = createClient();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        // Fetch jobs from our API
        const response = await fetch("/api/scrape-jobs");
        const data = await response.json();

        if (data.error) {
          console.error("Error fetching jobs:", data.error);
        } else {
          setJobs(data.jobs || []);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchApplications = async () => {
      try {
        const { data, error } = await supabase.from("applications").select("*");

        if (error) {
          console.error("Error fetching applications:", error);
        } else {
          setApplications(data || []);
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    const fetchResumeUrl = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from("resumes")
            .select("url")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1);

          if (error) {
            console.error("Error fetching resume:", error);
          } else if (data && data.length > 0) {
            setResumeUrl(data[0].url);
          }
        }
      } catch (error) {
        console.error("Error fetching resume URL:", error);
      }
    };

    fetchJobs();
    fetchApplications();
    fetchResumeUrl();
  }, []);

  const handleApply = (job: Job) => {
    if (!resumeUrl) {
      alert("Please upload your resume first!");
      return;
    }
    setApplyingToJob(job);
  };

  const handleGenerateCoverLetter = async () => {
    if (!applyingToJob) return;

    setGeneratingCoverLetter(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert("Please sign in to generate a cover letter");
        return;
      }

      // Get resume text
      const { data: resumeData, error: resumeError } = await supabase
        .from("resumes")
        .select("text_content")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (resumeError || !resumeData || resumeData.length === 0) {
        alert(
          "Could not find your resume text. Please upload your resume again.",
        );
        return;
      }

      const resumeText = resumeData[0].text_content;

      // Call our API to generate a cover letter
      const response = await fetch("/api/openai-coverletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobTitle: applyingToJob.title,
          companyName: applyingToJob.company,
          jobDescription: applyingToJob.description,
          resumeText: resumeText,
        }),
      });

      const data = await response.json();
      if (data.error) {
        alert(`Error generating cover letter: ${data.error}`);
      } else {
        setCoverLetter(data.coverLetter);
      }
    } catch (error) {
      console.error("Error generating cover letter:", error);
      alert("Failed to generate cover letter. Please try again.");
    } finally {
      setGeneratingCoverLetter(false);
    }
  };

  const handleSubmitApplication = async () => {
    if (!applyingToJob || !resumeUrl) return;

    setSubmittingApplication(true);
    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: applyingToJob.id,
          resumeUrl: resumeUrl,
          coverLetter: coverLetter,
        }),
      });

      const data = await response.json();
      if (data.error) {
        alert(`Error applying to job: ${data.error}`);
      } else {
        alert(
          `Successfully applied to ${applyingToJob.title} at ${applyingToJob.company}!`,
        );
        setApplyingToJob(null);
        setCoverLetter("");

        // Refresh applications list
        const { data: newApplications, error } = await supabase
          .from("applications")
          .select("*");

        if (!error && newApplications) {
          setApplications(newApplications);
        }
      }
    } catch (error) {
      console.error("Error applying to job:", error);
      alert("Failed to apply to job. Please try again.");
    } finally {
      setSubmittingApplication(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    return (
      job.match_score >= filter.minMatchScore &&
      (filter.platform === "all" || job.platform === filter.platform) &&
      (filter.location === "all" || job.location === filter.location)
    );
  });

  const platforms = [...new Set(jobs.map((job) => job.platform))];
  const locations = [...new Set(jobs.map((job) => job.location))];

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <>
      <DashboardNavbar />
      <main className="w-full min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Job Listings
          </h1>

          {!resumeUrl && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-center gap-2">
                <FileText className="text-yellow-500" size={18} />
                <p className="text-yellow-800">
                  You haven't uploaded your resume yet.
                  <a href="/resume-upload" className="underline ml-1">
                    Upload your resume
                  </a>{" "}
                  to apply for jobs.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter size={18} />
                    <span>Filters</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="matchScore">
                      Minimum Match Score: {filter.minMatchScore}%
                    </Label>
                    <Input
                      id="matchScore"
                      type="range"
                      min="0"
                      max="100"
                      value={filter.minMatchScore}
                      onChange={(e) =>
                        setFilter({
                          ...filter,
                          minMatchScore: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <select
                      id="platform"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={filter.platform}
                      onChange={(e) =>
                        setFilter({ ...filter, platform: e.target.value })
                      }
                    >
                      <option value="all">All Platforms</option>
                      {platforms.map((platform) => (
                        <option key={platform} value={platform}>
                          {platform}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <select
                      id="location"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={filter.location}
                      onChange={(e) =>
                        setFilter({ ...filter, location: e.target.value })
                      }
                    >
                      <option value="all">All Locations</option>
                      {locations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Job Listings */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="available">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="available">Available Jobs</TabsTrigger>
                  <TabsTrigger value="applied">Applied Jobs</TabsTrigger>
                </TabsList>

                <TabsContent value="available">
                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                  ) : filteredJobs.length > 0 ? (
                    <div className="space-y-4">
                      {filteredJobs.map((job) => (
                        <Card key={job.id} className="overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            <div className="flex-1 p-6">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-xl font-semibold">
                                    {job.title}
                                  </h3>
                                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                                    <Building size={14} />
                                    <span>{job.company}</span>
                                  </div>
                                </div>
                                <div
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(job.match_score)}`}
                                >
                                  {job.match_score}% Match
                                </div>
                              </div>

                              <div className="mt-4 space-y-2">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <MapPin size={14} />
                                  <span>{job.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Calendar size={14} />
                                  <span>Posted: {job.posted_date}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <ExternalLink size={14} />
                                  <span>{job.platform}</span>
                                </div>
                              </div>

                              <p className="mt-4 text-gray-700">
                                {job.description}
                              </p>
                            </div>

                            <div className="bg-gray-50 p-6 flex flex-col justify-center items-center gap-3 border-t md:border-t-0 md:border-l">
                              <Button
                                onClick={() => handleApply(job)}
                                className="w-full"
                                disabled={!resumeUrl}
                              >
                                Apply Now
                              </Button>
                              <a
                                href={job.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                              >
                                View Original
                                <ExternalLink size={12} />
                              </a>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-lg border">
                      <p className="text-gray-500">
                        No jobs match your current filters.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="applied">
                  {applications.length > 0 ? (
                    <div className="space-y-4">
                      {applications.map((application) => (
                        <Card key={application.id} className="overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-xl font-semibold">
                                  {application.job_title || "Job Title"}
                                </h3>
                                <div className="flex items-center gap-2 text-gray-600 mt-1">
                                  <Building size={14} />
                                  <span>
                                    {application.company_name || "Company"}
                                  </span>
                                </div>
                              </div>
                              <div className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {application.status || "Applied"}
                              </div>
                            </div>

                            <div className="mt-4 space-y-2">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Calendar size={14} />
                                <span>
                                  Applied:{" "}
                                  {new Date(
                                    application.applied_at,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-lg border">
                      <p className="text-gray-500">
                        You haven't applied to any jobs yet.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      {/* Apply Job Dialog */}
      <Dialog
        open={!!applyingToJob}
        onOpenChange={(open) => !open && setApplyingToJob(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Apply to {applyingToJob?.title} at {applyingToJob?.company}
            </DialogTitle>
            <DialogDescription>
              Complete your application by reviewing and customizing your cover
              letter.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Cover Letter</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateCoverLetter}
                disabled={generatingCoverLetter}
              >
                {generatingCoverLetter ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate with AI"
                )}
              </Button>
            </div>

            <Textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Write or generate a cover letter for this position..."
              className="min-h-[300px]"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setApplyingToJob(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitApplication}
              disabled={submittingApplication || !coverLetter}
            >
              {submittingApplication ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Applying...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
