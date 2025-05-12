"use client";

import { useState, useEffect } from "react";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Upload, Save, User, Bell, Link as LinkIcon } from "lucide-react";
import { createClient } from "../../../supabase/client";

export default function Settings() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    roles: ["DevOps Engineer", "SRE", "Cloud Engineer"],
    locations: ["Remote", "Bangalore", "Chennai"],
    notifications: {
      email: true,
      browser: false,
      mobile: true
    }
  });
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/user');
      const data = await res.json();
      if (!data.user) {
        window.location.href = '/sign-in';
      } else {
        setUser(data.user);
      }
    };
    fetchUser();
  }, []);

  const handleSaveProfile = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Profile updated successfully!");
    }, 1000);
  };

  const handleSavePreferences = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Preferences updated successfully!");
    }, 1000);
  };

  const availableRoles = [
    "DevOps Engineer",
    "SRE",
    "Cloud Engineer",
    "Infrastructure Engineer",
    "Platform Engineer",
    "DevSecOps Engineer"
  ];

  const availableLocations = [
    "Remote",
    "Bangalore",
    "Chennai",
    "Hyderabad",
    "Kochi",
    "Gurgaon",
    "Delhi"
  ];

  const toggleRole = (role: string) => {
    if (preferences.roles.includes(role)) {
      setPreferences({
        ...preferences,
        roles: preferences.roles.filter(r => r !== role)
      });
    } else {
      setPreferences({
        ...preferences,
        roles: [...preferences.roles, role]
      });
    }
  };

  const toggleLocation = (location: string) => {
    if (preferences.locations.includes(location)) {
      setPreferences({
        ...preferences,
        locations: preferences.locations.filter(l => l !== location)
      });
    } else {
      setPreferences({
        ...preferences,
        locations: [...preferences.locations, location]
      });
    }
  };

  return (
    <>
      <DashboardNavbar />
      <main className="w-full min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Account Settings</h1>
          
          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
            </TabsList>
            
            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User size={18} />
                    <span>User Profile</span>
                  </CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" defaultValue={user?.user_metadata?.full_name || ""} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={user?.email || ""} disabled />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea 
                      id="bio" 
                      placeholder="Tell us about your professional background..."
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Resume</Label>
                    <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Drag & drop your resume here or click to browse</p>
                      <p className="text-xs text-gray-400 mt-1">Supported formats: PDF, DOCX (Max 5MB)</p>
                      <Button variant="outline" className="mt-4">
                        Upload Resume
                      </Button>
                    </div>
                  </div>
                  
                  <Button onClick={handleSaveProfile} disabled={loading} className="w-full md:w-auto">
                    {loading ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Profile
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Job Preferences</CardTitle>
                  <CardDescription>Customize your job search preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label>Preferred Roles</Label>
                    <div className="flex flex-wrap gap-2">
                      {availableRoles.map(role => (
                        <button
                          key={role}
                          onClick={() => toggleRole(role)}
                          className={`px-3 py-1 rounded-full text-sm ${preferences.roles.includes(role) 
                            ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                            : 'bg-gray-100 text-gray-800 border border-gray-200'}`}
                        >
                          {preferences.roles.includes(role) && (
                            <Check className="inline-block mr-1 h-3 w-3" />
                          )}
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Preferred Locations</Label>
                    <div className="flex flex-wrap gap-2">
                      {availableLocations.map(location => (
                        <button
                          key={location}
                          onClick={() => toggleLocation(location)}
                          className={`px-3 py-1 rounded-full text-sm ${preferences.locations.includes(location) 
                            ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                            : 'bg-gray-100 text-gray-800 border border-gray-200'}`}
                        >
                          {preferences.locations.includes(location) && (
                            <Check className="inline-block mr-1 h-3 w-3" />
                          )}
                          {location}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Notification Settings</Label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="emailNotif" 
                          checked={preferences.notifications.email}
                          onChange={() => setPreferences({
                            ...preferences,
                            notifications: {
                              ...preferences.notifications,
                              email: !preferences.notifications.email
                            }
                          })}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <Label htmlFor="emailNotif" className="ml-2">Email notifications</Label>
                      </div>
                      
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="browserNotif" 
                          checked={preferences.notifications.browser}
                          onChange={() => setPreferences({
                            ...preferences,
                            notifications: {
                              ...preferences.notifications,
                              browser: !preferences.notifications.browser
                            }
                          })}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <Label htmlFor="browserNotif" className="ml-2">Browser notifications</Label>
                      </div>
                      
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="mobileNotif" 
                          checked={preferences.notifications.mobile}
                          onChange={() => setPreferences({
                            ...preferences,
                            notifications: {
                              ...preferences.notifications,
                              mobile: !preferences.notifications.mobile
                            }
                          })}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <Label htmlFor="mobileNotif" className="ml-2">Mobile notifications</Label>
                      </div>
                    </div>
                  </div>
                  
                  <Button onClick={handleSavePreferences} disabled={loading} className="w-full md:w-auto">
                    {loading ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Preferences
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Integrations Tab */}
            <TabsContent value="integrations">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LinkIcon size={18} />
                    <span>Job Board Integrations</span>
                  </CardTitle>
                  <CardDescription>Connect your accounts from other job platforms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "LinkedIn", connected: true },
                      { name: "Indeed", connected: false },
                      { name: "Monster", connected: false },
                      { name: "Glassdoor", connected: false }
                    ].map((platform) => (
                      <div key={platform.name} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{platform.name}</h3>
                          <p className="text-sm text-gray-500">
                            {platform.connected ? "Connected" : "Not connected"}
                          </p>
                        </div>
                        <Button variant={platform.connected ? "outline" : "default"}>
                          {platform.connected ? "Disconnect" : "Connect"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}
