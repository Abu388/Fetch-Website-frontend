// src/app/api/ai/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Check if API key exists
    const OPENROUTER_KEY = process.env.OPENROUTER_KEY;
    if (!OPENROUTER_KEY) {
      return NextResponse.json({ error: "OPENROUTER_KEY is missing in environment variables." });
    }

    // Get the message from request body
    const body = await req.json();
    const { message } = body;
    if (!message || message.trim() === "") {
      return NextResponse.json({ error: "Message is empty." });
    }

    // Call OpenRouter
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free",
        messages: [{ role: "user", content: message }],
        stream: false,
      }),
    });

    const data = await res.json();

   

    // Check if OpenRouter returned an error
    if (res.status !== 200) {
      return NextResponse.json({ error: "OpenRouter returned an error", details: data });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Route error:", err);
    return NextResponse.json({ error: "Failed to fetch AI response", details: err });
  }
}
