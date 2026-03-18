import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { content, url } = await req.json()

  if (!content || content.length < 100) {
    return NextResponse.json(
      { error: "Content must be at least 100 characters" },
      { status: 400 }
    )
  }

  const analysisPrompt = `You are an AI Answer Engine Optimization (AEO) expert. Analyze the following content and provide:
1. AEO Score (0-100)
2. Citation Readiness (1-5)
3. Question Coverage (1-5)
4. Structural Score (1-5)
5. Specific improvement recommendations

Content to analyze:
${content}

${url ? `Source URL: ${url}` : ""}

Respond in JSON format:
{
  "aeoScore": number,
  "citationReadiness": number,
  "questionCoverage": number,
  "structuralScore": number,
  "recommendations": string[]
}`

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "AEO.ai",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: analysisPrompt }],
        response_format: { type: "json_object" },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json({ error: "AI analysis failed", details: error }, { status: 500 })
    }

    const data = await response.json()
    const analysis = JSON.parse(data.choices[0].message.content)

    return NextResponse.json({
      success: true,
      analysis: {
        ...analysis,
        contentLength: content.length,
        url,
        analyzedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json(
      { error: "Failed to analyze content" },
      { status: 500 }
    )
  }
}
