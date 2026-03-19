import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(req: Request) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id
  const { searchParams } = new URL(req.url)
  const format = searchParams.get("format") || "csv"
  const analysisId = searchParams.get("id")

  let query = supabase
    .from("analyses")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (analysisId) {
    query = query.eq("id", analysisId).limit(1)
  }

  const { data: analyses, error } = await query

  if (error) {
    return NextResponse.json({ error: "Failed to fetch analyses" }, { status: 500 })
  }

  if (!analyses || analyses.length === 0) {
    return NextResponse.json({ error: "No analyses found" }, { status: 404 })
  }

  if (format === "csv") {
    return exportToCSV(analyses)
  } else if (format === "json") {
    return exportToJSON(analyses)
  } else {
    return NextResponse.json({ error: "Unsupported format" }, { status: 400 })
  }
}

function exportToCSV(analyses: any[]) {
  const headers = [
    "ID",
    "URL",
    "AEO Score",
    "Citation Readiness",
    "Question Coverage",
    "Structural Score",
    "Content Length",
    "Created At",
    "Recommendations",
  ]

  const rows = analyses.map((a) => [
    a.id,
    a.url || "",
    a.aeo_score,
    a.citation_readiness,
    a.question_coverage,
    a.structural_score,
    a.content_length,
    new Date(a.created_at).toISOString(),
    (a.recommendations || []).join("; "),
  ])

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n")

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="aeo-analysis-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  })
}

function exportToJSON(analyses: any[]) {
  const exportData = analyses.map((a) => ({
    id: a.id,
    url: a.url,
    scores: {
      aeoScore: a.aeo_score,
      citationReadiness: a.citation_readiness,
      questionCoverage: a.question_coverage,
      structuralScore: a.structural_score,
    },
    contentLength: a.content_length,
    recommendations: a.recommendations || [],
    createdAt: a.created_at,
  }))

  return NextResponse.json(
    {
      exportedAt: new Date().toISOString(),
      count: analyses.length,
      analyses: exportData,
    },
    {
      headers: {
        "Content-Disposition": `attachment; filename="aeo-analysis-${new Date().toISOString().split("T")[0]}.json"`,
      },
    }
  )
}
