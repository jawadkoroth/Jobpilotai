"use client";

import { useEffect, useState } from "react";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  Calendar,
  FileText,
  ExternalLink,
  Loader2,
  Eye,
  Download,
} from "lucide-react";
import { createClient } from "../../../supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Application {
  id: string;
  job_id: string;
  user_id: string;
  resume_url: string;
  cover_letter: string | null;
  status: string;
  applied_at: string;
  job_title: string;
  company_name: string;
  job_location: string;
  job_platform: string;
  job_url: string;
}

export default function AppliedJobs() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [viewingCoverLetter, setViewingCoverLetter] = useState(false);
  const supabase = createClient();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          window.location.href = "/sign-in";
          return;
        }

        const { data, error } = await supabase
          .from("applications")
          .select("*")
          .eq("user_id", user.id)
          .order("applied_at", { ascending: false });

        if (error) {
          console.error("Error fetching applications:", error);
        } else {
          setApplications(data || []);
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "applied":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            Applied
          </Badge>
        );
      case "interview":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
            Interview
          </Badge>
        );
      case "offer":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Offer
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            {status}
          </Badge>
        );
    }
  };

  const handleViewCoverLetter = (application: Application) => {
    setSelectedApplication(application);
    setViewingCoverLetter(true);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <>
      <DashboardNavbar />
      <main className="w-full min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Applied Jobs
          </h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : applications.length > 0 ? (
            <div className="space-y-4">
              {applications.map((application) => (
                <Card key={application.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h3 className="text-xl font-semibold">
                          {application.job_title || "Job Title"}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600 mt-1">
                          <Building size={14} />
                          <span>{application.company_name || "Company"}</span>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar size={14} />
                          <span>
                            Applied: {formatDate(application.applied_at)}
                          </span>
                        </div>
                        <div>{getStatusBadge(application.status)}</div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 justify-end">
                      {application.cover_letter && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewCoverLetter(application)}
                          className="flex items-center gap-1"
                        >
                          <Eye size={14} />
                          View Cover Letter
                        </Button>
                      )}
                      {application.job_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          asChild
                        >
                          <a
                            href={application.job_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink size={14} />
                            View Job Posting
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                No applications yet
              </h3>
              <p className="text-gray-500 mt-2">
                When you apply for jobs, they will appear here.
              </p>
              <Button
                className="mt-4"
                onClick={() => (window.location.href = "/jobs")}
              >
                Browse Jobs
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Cover Letter Dialog */}
      <Dialog open={viewingCoverLetter} onOpenChange={setViewingCoverLetter}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Cover Letter</DialogTitle>
          </DialogHeader>
          <div className="p-4 bg-gray-50 rounded-md max-h-[60vh] overflow-auto">
            <div className="whitespace-pre-wrap">
              {selectedApplication?.cover_letter}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewingCoverLetter(false)}
            >
              Close
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
