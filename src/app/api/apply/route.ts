import { NextResponse } from "next/server";
import { createClient } from "../../../../supabase/server";

export async function POST(request: Request) {
  try {
    const { jobId, resumeUrl, coverLetter } = await request.json();

    if (!jobId || !resumeUrl) {
      return NextResponse.json(
        { error: "Job ID and resume URL are required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In a real implementation, you would:
    // 1. Submit the application to the job platform's API
    // 2. Store the application details in Supabase

    // For now, we'll just store the application in Supabase
    const { data, error } = await supabase
      .from("applications")
      .insert({
        user_id: user.id,
        job_id: jobId,
        resume_url: resumeUrl,
        cover_letter: coverLetter || null,
        status: "applied",
        applied_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error("Error storing application:", error);
      return NextResponse.json(
        { error: "Failed to store application" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, application: data[0] });
  } catch (error: any) {
    console.error("Error applying to job:", error);
    return NextResponse.json(
      { error: "Failed to apply to job" },
      { status: 500 },
    );
  }
}
