import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import {
  ArrowUpRight,
  CheckCircle2,
  Shield,
  Users,
  Zap,
  Briefcase,
  Target,
  Filter,
  Clock,
  Laptop,
} from "lucide-react";
import { createClient } from "../../supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How JobPilot AI Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform streamlines your job search and
              application process from start to finish.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Target className="w-6 h-6" />,
                title: "Smart Matching",
                description:
                  "AI analyzes jobs and ranks them by match percentage to your profile",
              },
              {
                icon: <Filter className="w-6 h-6" />,
                title: "Advanced Filtering",
                description:
                  "Filter by match score, location, and job platform",
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "One-Click Apply",
                description:
                  "Automate applications with personalized resume and cover letter",
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: "Status Tracking",
                description: "Monitor all your applications in one dashboard",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Powerful Job Dashboard
              </h2>
              <p className="text-gray-600 mb-6">
                Our intuitive dashboard gives you complete control over your job
                search with visual match scoring and comprehensive filtering.
              </p>
              <ul className="space-y-4">
                {[
                  "Color-coded match scores for quick assessment",
                  "Tabbed interface for available and applied jobs",
                  "Detailed job information at a glance",
                  "Responsive design works on all devices",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <Laptop className="w-24 h-24 text-gray-400" />
                <span className="ml-4 text-gray-500 font-medium">
                  Dashboard Preview
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">85%</div>
              <div className="text-blue-100">Application Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Jobs Applied To</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">75%</div>
              <div className="text-blue-100">Time Saved</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Supercharge Your Job Search?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who've streamlined their application
            process with JobPilot AI.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started Now
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
