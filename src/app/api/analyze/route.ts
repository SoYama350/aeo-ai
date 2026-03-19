import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

const FREE_DAILY_LIMIT = 5
const PRO_DAILY_LIMIT = 100

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id
  const { content, url } = await req.json()

  if (!content || content.length < 100) {
    return NextResponse.json(
      { error: "Content must be at least 100 characters" },
      { status: 400 }
    )
  }

  // Check profile with subscription tier
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("analyses_used_today, last_analysis_date, subscription_tier")
    .eq("id", userId)
    .single()

  if (profileError && profileError.code !== "PGRST116") {
    console.error("Profile fetch error:", profileError)
    return NextResponse.json(
      { error: "Failed to check usage limits" },
      { status: 500 }
    )
  }

  // Determine limits based on subscription tier
  const isPro = profile?.subscription_tier === "pro" || profile?.subscription_tier === "enterprise"
  const dailyLimit = isPro ? PRO_DAILY_LIMIT : FREE_DAILY_LIMIT

  // Reset count if it's a new day
  const today = new Date().toISOString().split("T")[0]
  let currentUsage = profile?.analyses_used_today || 0
  const lastDate = profile?.last_analysis_date

  if (lastDate && lastDate !== today) {
    currentUsage = 0
  }

  // Check if user exceeded daily limit
  if (currentUsage >= dailyLimit) {
    return NextResponse.json(
      { 
        error: "Daily limit reached",
        message: isPro 
          ? `You've used all ${PRO_DAILY_LIMIT} analyses for today. Limit resets at midnight.`
          : `You've used all ${FREE_DAILY_LIMIT} free analyses for today. Upgrade to Pro for unlimited access.`,
        usage: {
          used: currentUsage,
          limit: dailyLimit,
          remaining: 0,
          tier: profile?.subscription_tier || "free",
          isPro,
          upgradeUrl: "/upgrade"
        }
      },
      { status: 429 }
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

    // Save analysis to Supabase
    const { error: insertError } = await supabase
      .from("analyses")
      .insert({
        user_id: userId,
        content: content.substring(0, 10000),
        content_length: content.length,
        url: url || null,
        aeo_score: analysis.aeoScore,
        citation_readiness: analysis.citationReadiness,
        question_coverage: analysis.questionCoverage,
        structural_score: analysis.structuralScore,
        recommendations: analysis.recommendations,
      })

    if (insertError) {
      console.error("Failed to save analysis:", insertError)
    }

    // Update usage count
    await supabase
      .from("profiles")
      .update({
        analyses_used_today: currentUsage + 1,
        last_analysis_date: today,
      })
      .eq("id", userId)

    const remaining = dailyLimit - currentUsage - 1

    return NextResponse.json({
      success: true,
      analysis: {
        aeoScore: analysis.aeoScore,
        citationReadiness: analysis.citationReadiness,
        questionCoverage: analysis.questionCoverage,
        structuralScore: analysis.structuralScore,
        recommendations: analysis.recommendations,
        contentLength: content.length,
        url,
        analyzedAt: new Date().toISOString(),
      },
      usage: {
        used: currentUsage + 1,
        limit: dailyLimit,
        remaining,
        tier: profile?.subscription_tier || "free",
        isPro,
      }
    })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json(
      { error: "Failed to analyze content" },
      { status: 500 }
    )
  }
}
