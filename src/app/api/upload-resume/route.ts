import { createClient } from "@/../supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const supabase = createClient();

  // Get the user session to associate the upload
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file: File | null = formData.get("resume") as unknown as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const fileExt = file.name.split(".").pop();
  const fileName = `${session.user.id}/${uuidv4()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("resumes")
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("Upload failed", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Resume uploaded successfully", path: fileName });
}
