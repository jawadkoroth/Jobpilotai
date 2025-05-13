import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { jobTitle, companyName, resume, apiKey } = await req.json();

  // Create prompt from job details and resume
  const prompt = `Write a professional cover letter for a ${jobTitle} position at ${companyName}. Here is my resume for reference:\n\n${resume}`;

  // Use provided API key or fall back to environment variable
  const openaiApiKey = apiKey || process.env.OPENAI_API_KEY;

  if (!openaiApiKey) {
    return NextResponse.json(
      { error: "OpenAI API key is not configured" },
      { status: 500 },
    );
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
      }),
    });

    const data = await response.json();

    // Check if data.choices exists and has at least one element
    if (!data.choices || data.choices.length === 0) {
      return NextResponse.json(
        { error: "No response from OpenAI API" },
        { status: 500 },
      );
    }

    return NextResponse.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return NextResponse.json(
      { error: "Failed to get response from OpenAI" },
      { status: 500 },
    );
  }
}
