"use client";

import { useEffect, useState } from "react";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase, Building, MapPin, Calendar, Filter, Loader2, ExternalLink } from "lucide-react";

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

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    minMatchScore: 0,
    platform: "all",
    location: "all"
  });

  // Mock data for demonstration
  const mockJobs: Job[] = [
    {
      id: "1",
      title: "Senior DevOps Engineer",
      company: "TechCorp",
      location: "Remote",
      posted_date: "2023-06-15",
      match_score: 92,
      platform: "LinkedIn",
      description: "We are looking for a Senior DevOps Engineer to help us build and maintain our cloud infrastructure.",
      url: "https://example.com/job1"
    },
    {
      id: "2",
      title: "Cloud Engineer",
      company: "InnovateSoft",
      location: "Bangalore",
      posted_date: "2023-06-14",
      match_score: 85,
      platform: "Indeed",
      description: "Join our team as a Cloud Engineer and help us build scalable cloud solutions.",
      url: "https://example.com/job2"
    },
    {
      id: "3",
      title: "Site Reliability Engineer",
      company: "TechGiant",
      location: "Hyderabad",
      posted_date: "2023-06-13",
      match_score: 78,
      platform: "LinkedIn",
      description: "Looking for an SRE to ensure our systems are reliable and scalable.",
      url: "https://example.com/job3"
    },
    {
      id: "4",
      title: "DevOps Specialist",
      company: "CloudTech",
      location: "Chennai",
      posted_date: "2023-06-12",
      match_score: 65,
      platform: "Monster",
      description: "Join our DevOps team to automate and optimize our deployment processes.",
      url: "https://example.com/job4"
    },
    {
      id: "5",
      title: "Infrastructure Engineer",
      company: "DataSystems",
      location: "Gurgaon",
      posted_date: "2023-06-11",
      match_score: 60,
      platform: "Indeed",
      description: "Help us build and maintain our infrastructure across multiple cloud providers.",
      url: "https://example.com/job5"
    }
  ];

  useEffect(() => {
    // Simulate API call to fetch jobs
    const fetchJobs = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await fetch('https://api.jobpilot.ai/jobs');
        // const data = await response.json();
        // setJobs(data);
        
        // Using mock data for now
        setTimeout(() => {
          setJobs(mockJobs);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleApply = async (jobId: string) => {
    // In a real app, this would call the API to apply for the job
    alert(`Applied to job ${jobId}! In a real app, this would trigger the backend API.`);
  };

  const filteredJobs = jobs.filter(job => {
    return (
      job.match_score >= filter.minMatchScore &&
      (filter.platform === "all" || job.platform === filter.platform) &&
      (filter.location === "all" || job.location === filter.location)
    );
  });

  const platforms = [...new Set(jobs.map(job => job.platform))];
  const locations = [...new Set(jobs.map(job => job.location))];

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
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Job Listings</h1>
          
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
                    <Label htmlFor="matchScore">Minimum Match Score: {filter.minMatchScore}%</Label>
                    <Input 
                      id="matchScore" 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={filter.minMatchScore} 
                      onChange={(e) => setFilter({...filter, minMatchScore: parseInt(e.target.value)})} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <select 
                      id="platform" 
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={filter.platform}
                      onChange={(e) => setFilter({...filter, platform: e.target.value})}
                    >
                      <option value="all">All Platforms</option>
                      {platforms.map(platform => (
                        <option key={platform} value={platform}>{platform}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <select 
                      id="location" 
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={filter.location}
                      onChange={(e) => setFilter({...filter, location: e.target.value})}
                    >
                      <option value="all">All Locations</option>
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
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
                      {filteredJobs.map(job => (
                        <Card key={job.id} className="overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            <div className="flex-1 p-6">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-xl font-semibold">{job.title}</h3>
                                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                                    <Building size={14} />
                                    <span>{job.company}</span>
                                  </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(job.match_score)}`}>
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
                              
                              <p className="mt-4 text-gray-700">{job.description}</p>
                            </div>
                            
                            <div className="bg-gray-50 p-6 flex flex-col justify-center items-center gap-3 border-t md:border-t-0 md:border-l">
                              <Button onClick={() => handleApply(job.id)} className="w-full">
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
                      <p className="text-gray-500">No jobs match your current filters.</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="applied">
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <p className="text-gray-500">You haven't applied to any jobs yet.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
