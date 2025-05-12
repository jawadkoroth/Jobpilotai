"use client";

import { useEffect, useState } from "react";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, Download, Loader2, Building, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";

interface Application {
  id: string;
  job_title: string;
  company: string;
  applied_date: string;
  status: "success" | "failed" | "pending";
  cover_letter: string;
}

export default function ApplicationStatus() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [viewingCoverLetter, setViewingCoverLetter] = useState(false);

  // Mock data for demonstration
  const mockApplications: Application[] = [
    {
      id: "1",
      job_title: "Senior DevOps Engineer",
      company: "TechCorp",
      applied_date: "2023-06-15",
      status: "success",
      cover_letter: "Dear Hiring Manager,\n\nI am writing to express my interest in the Senior DevOps Engineer position at TechCorp. With over 5 years of experience in DevOps and cloud infrastructure, I believe I would be a valuable addition to your team.\n\nThroughout my career, I have successfully implemented CI/CD pipelines, managed cloud infrastructure on AWS and GCP, and automated deployment processes. My experience with Docker, Kubernetes, and Terraform has allowed me to build scalable and reliable systems.\n\nI am excited about the opportunity to bring my technical expertise and leadership skills to TechCorp and help drive your infrastructure forward.\n\nThank you for considering my application.\n\nSincerely,\nJohn Doe"
    },
    {
      id: "2",
      job_title: "Cloud Engineer",
      company: "InnovateSoft",
      applied_date: "2023-06-14",
      status: "pending",
      cover_letter: "Dear Hiring Team,\n\nI am excited to apply for the Cloud Engineer position at InnovateSoft. With my strong background in cloud technologies and infrastructure automation, I am confident in my ability to contribute to your team.\n\nIn my current role, I have designed and implemented cloud-native applications using AWS services such as EC2, S3, and Lambda. I have also worked extensively with infrastructure as code using Terraform and CloudFormation.\n\nI am particularly drawn to InnovateSoft's innovative approach to cloud solutions and would welcome the opportunity to be part of your growing team.\n\nThank you for your consideration.\n\nBest regards,\nJohn Doe"
    },
    {
      id: "3",
      job_title: "Site Reliability Engineer",
      company: "TechGiant",
      applied_date: "2023-06-13",
      status: "failed",
      cover_letter: "Dear Hiring Manager,\n\nI am writing to apply for the Site Reliability Engineer position at TechGiant. With my experience in maintaining high-availability systems and implementing monitoring solutions, I believe I would be a great fit for this role.\n\nIn my current position, I have successfully reduced system downtime by 40% through implementing robust monitoring and alerting systems. I have also automated incident response procedures, resulting in faster resolution times.\n\nI am excited about the opportunity to bring my skills in Prometheus, Grafana, and ELK stack to TechGiant and help ensure the reliability of your systems.\n\nThank you for considering my application.\n\nSincerely,\nJohn Doe"
    }
  ];

  useEffect(() => {
    // Simulate API call to fetch applications
    const fetchApplications = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await fetch('https://api.jobpilot.ai/status');
        // const data = await response.json();
        // setApplications(data);
        
        // Using mock data for now
        setTimeout(() => {
          setApplications(mockApplications);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching applications:", error);
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Success</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Failed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const handleViewCoverLetter = (application: Application) => {
    setSelectedApplication(application);
    setViewingCoverLetter(true);
  };

  return (
    <>
      <DashboardNavbar />
      <main className="w-full min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Application Status</h1>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : applications.length > 0 ? (
            <div className="space-y-6">
              <Tabs defaultValue="all">
                <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="success">Success</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <div className="space-y-4">
                    {applications.map(application => (
                      <Card key={application.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(application.status)}
                              <div>
                                <h3 className="text-lg font-semibold">{application.job_title}</h3>
                                <div className="flex items-center gap-2 text-gray-600 mt-1">
                                  <Building size={14} />
                                  <span>{application.company}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Calendar size={14} />
                                <span>Applied: {application.applied_date}</span>
                              </div>
                              <div>{getStatusBadge(application.status)}</div>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex flex-wrap gap-2 justify-end">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleViewCoverLetter(application)}
                              className="flex items-center gap-1"
                            >
                              <Eye size={14} />
                              View Cover Letter
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <Download size={14} />
                              Download PDF
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="success">
                  <div className="space-y-4">
                    {applications
                      .filter(app => app.status === "success")
                      .map(application => (
                        <Card key={application.id}>
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                              <div className="flex items-center gap-3">
                                {getStatusIcon(application.status)}
                                <div>
                                  <h3 className="text-lg font-semibold">{application.job_title}</h3>
                                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                                    <Building size={14} />
                                    <span>{application.company}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Calendar size={14} />
                                  <span>Applied: {application.applied_date}</span>
                                </div>
                                <div>{getStatusBadge(application.status)}</div>
                              </div>
                            </div>
                            
                            <div className="mt-4 flex flex-wrap gap-2 justify-end">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleViewCoverLetter(application)}
                                className="flex items-center gap-1"
                              >
                                <Eye size={14} />
                                View Cover Letter
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex items-center gap-1"
                              >
                                <Download size={14} />
                                Download PDF
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="pending">
                  <div className="space-y-4">
                    {applications
                      .filter(app => app.status === "pending")
                      .map(application => (
                        <Card key={application.id}>
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                              <div className="flex items-center gap-3">
                                {getStatusIcon(application.status)}
                                <div>
                                  <h3 className="text-lg font-semibold">{application.job_title}</h3>
                                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                                    <Building size={14} />
                                    <span>{application.company}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Calendar size={14} />
                                  <span>Applied: {application.applied_date}</span>
                                </div>
                                <div>{getStatusBadge(application.status)}</div>
                              </div>
                            </div>
                            
                            <div className="mt-4 flex flex-wrap gap-2 justify-end">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleViewCoverLetter(application)}
                                className="flex items-center gap-1"
                              >
                                <Eye size={14} />
                                View Cover Letter
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex items-center gap-1"
                              >
                                <Download size={14} />
                                Download PDF
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
              
              {/* Cover Letter Modal */}
              {viewingCoverLetter && selectedApplication && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
                    <div className="p-6 border-b">
                      <h3 className="text-xl font-semibold">Cover Letter</h3>
                      <p className="text-gray-600">{selectedApplication.job_title} at {selectedApplication.company}</p>
                    </div>
                    <div className="p-6 overflow-auto max-h-[50vh]">
                      <div className="whitespace-pre-wrap">{selectedApplication.cover_letter}</div>
                    </div>
                    <div className="p-4 border-t flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setViewingCoverLetter(false)}>Close</Button>
                      <Button>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No applications yet</h3>
              <p className="text-gray-500 mt-2">When you apply for jobs, they will appear here.</p>
              <Button className="mt-4" onClick={() => window.location.href = '/jobs'}>
                Browse Jobs
              </Button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
