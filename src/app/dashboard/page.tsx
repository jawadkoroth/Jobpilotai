'use client';

import DashboardNavbar from "@/components/dashboard-navbar";
import { InfoIcon, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Load Supabase user data
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

  // ✅ Generate GPT cover letter
  const handleGenerate = async () => {
    setLoading(true);

    const jobTitle = "DevOps Engineer";
    const companyName = "AnyCompany";

    const resume = `Paste your resume content here – make sure it includes your skills, tools, experience, achievements, etc.`;

    const prompt = `Write an undetectable AI cover letter for a ${jobTitle} role at ${companyName} using this resume:\n\n${resume}`;

    const res = await fetch('/api/chatgpt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    setCoverLetter(data.reply);
    setLoading(false);
  };

  return (
    <>
      <DashboardNavbar />
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="bg-secondary/50 text-sm p-3 px-4 rounded-lg text-muted-foreground flex gap-2 items-center">
              <InfoIcon size="14" />
              <span>This is a protected page only visible to authenticated users</span>
            </div>
          </header>

          {/* User Profile Section */}
          {user && (
            <section className="bg-card rounded-xl p-6 border shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <UserCircle size={48} className="text-primary" />
                <div>
                  <h2 className="font-semibold text-xl">User Profile</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 overflow-hidden">
                <pre className="text-xs font-mono max-h-48 overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            </section>
          )}

          {/* 🧠 GPT Cover Letter Generator */}
          <section className="bg-white border rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">AI Cover Letter Generator</h2>
            <button
              onClick={handleGenerate}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {loading ? 'Generating...' : 'Generate Cover Letter'}
            </button>

            {coverLetter && (
              <div className="mt-4 p-4 bg-gray-100 rounded border text-sm whitespace-pre-wrap">
                {coverLetter}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
