import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Check if Supabase environment variables are defined
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Only create Supabase client if both URL and key are available
  if (supabaseUrl && supabaseAnonKey) {
    try {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          get(name) {
            return req.cookies.get(name)?.value;
          },
          set(name, value, options) {
            // Set cookies on the request and response
            req.cookies.set({
              name,
              value,
              ...options,
            });
            res.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name, options) {
            // Remove cookies from the request and response
            req.cookies.delete({
              name,
              ...options,
            });
            res.cookies.delete({
              name,
              ...options,
            });
          },
        },
      });

      // Refresh session if expired - required for Server Components
      await supabase.auth.getSession();
    } catch (error) {
      console.error("Error in middleware:", error);
    }
  } else {
    console.warn(
      "Supabase URL or Anon Key not provided. Skipping auth session check.",
    );
  }

  return res;
}

// Ensure the middleware is only called for relevant paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
};
