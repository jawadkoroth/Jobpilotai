import { NextResponse } from "next/server";
import { createClient } from "../../../../supabase/server";

export async function POST(request: Request) {
  try {
    const { jobTitle, companyName, jobDescription, resumeText } =
      await request.json();

    if (!jobTitle || !companyName || !resumeText) {
      return NextResponse.json(
        { error: "Job title, company name, and resume text are required" },
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

    // Check if OpenAI API key is configured
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 },
      );
    }

    // Create prompt for OpenAI
    const prompt = `Write a professional cover letter for a ${jobTitle} position at ${companyName}. 
    ${jobDescription ? `The job description is: ${jobDescription}\n` : ""}
    Here is my resume for reference:\n\n${resumeText}`;

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
          }),
        },
      );

      const data = await response.json();

      if (!data.choices || data.choices.length === 0) {
        return NextResponse.json(
          { error: "No response from OpenAI API" },
          { status: 500 },
        );
      }

      return NextResponse.json({
        coverLetter: data.choices[0].message.content,
      });
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      return NextResponse.json(
        { error: "Failed to generate cover letter" },
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error("Error generating cover letter:", error);
    return NextResponse.json(
      { error: "Failed to generate cover letter" },
      { status: 500 },
    );
  }
}
