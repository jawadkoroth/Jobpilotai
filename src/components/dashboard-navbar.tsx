"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { UserCircle, Home, Briefcase, Settings, FileText } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function DashboardNavbar() {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/" prefetch className="text-xl font-bold">
            JobPilot AI
          </Link>
          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive("/dashboard") ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50"}`}
            >
              Dashboard
            </Link>
            <Link
              href="/resume-upload"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive("/resume-upload") ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50"}`}
            >
              Resume
            </Link>
            <Link
              href="/cover-letter"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive("/cover-letter") ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50"}`}
            >
              Cover Letter
            </Link>
            <Link
              href="/jobs"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive("/jobs") ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50"}`}
            >
              Jobs
            </Link>
            <Link
              href="/status"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive("/status") ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50"}`}
            >
              Applications
            </Link>
            <Link
              href="/settings"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive("/settings") ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50"}`}
            >
              Settings
            </Link>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          {/* Mobile Navigation */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Menu
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center">
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/resume-upload" className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Resume
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/cover-letter" className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Cover Letter
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/jobs" className="flex items-center">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Jobs
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/status" className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Applications
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserCircle className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/settings">Profile Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.refresh();
                }}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
