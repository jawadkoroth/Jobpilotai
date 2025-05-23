import Link from "next/link";
import { createClient } from "../../supabase/server";
import { Button } from "./ui/button";
import { User, UserCircle } from "lucide-react";
import UserProfile from "./user-profile";

export default async function Navbar() {
  let user = null;

  try {
    const supabase = await createClient();
    // No need to check if supabase exists since we now return a mock client
    const {
      data: { user: userData },
    } = await supabase.auth.getUser();
    user = userData;
  } catch (error) {
    console.error("Error fetching user:", error);
  }

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/" prefetch className="text-xl font-bold">
            JobPilot AI
          </Link>
          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/dashboard"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Dashboard
            </Link>
            <Link
              href="/resume-upload"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Resume
            </Link>
            <Link
              href="/jobs"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Jobs
            </Link>
            <Link
              href="/status"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Applications
            </Link>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <UserProfile />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
