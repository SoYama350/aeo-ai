import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"

interface Analysis {
  id: string
  content: string
  url: string | null
  aeo_score: number
  citation_readiness: number
  question_coverage: number
  structural_score: number
  recommendations: string[]
  content_length: number
  created_at: string
}

async function getAnalyses(userId: string): Promise<Analysis[]> {
  const { data, error } = await supabase
    .from("analyses")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) {
    console.error("Failed to fetch analyses:", error)
    return []
  }

  return data || []
}

async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("analyses_used_today, last_analysis_date, subscription_tier")
    .eq("id", userId)
    .single()

  if (error) {
    console.error("Failed to fetch profile:", error)
    return null
  }

  return data
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

function getScoreColor(score: number): string {
  if (score >= 80) return "bg-green-100 text-green-800"
  if (score >= 60) return "bg-amber-100 text-amber-800"
  return "bg-red-100 text-red-800"
}

export default async function HistoryPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/")
  }

  const [analyses, profile] = await Promise.all([
    getAnalyses(session.user.id),
    getProfile(session.user.id)
  ])

  const today = new Date().toISOString().split("T")[0]
  const todayUsage = profile?.last_analysis_date === today 
    ? profile?.analyses_used_today || 0 
    : 0
  const isPro = profile?.subscription_tier === "pro" || profile?.subscription_tier === "enterprise"

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <header className="border-b border-zinc-200 bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600" />
              <span className="text-xl font-bold">AEO.ai</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">Analyzer</Button>
            </Link>
            {!isPro && (
              <Link href="/upgrade">
                <Button variant="ghost" size="sm" className="text-violet-600">
                  Upgrade to Pro
                </Button>
              </Link>
            )}
            <Badge className={isPro ? "bg-violet-100 text-violet-700" : ""}>
              {profile?.subscription_tier || "free"}
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analysis History</h1>
            <p className="mt-2 text-zinc-600">
              View and manage your past content analyses
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-zinc-500">Today's usage</p>
              <p className="text-2xl font-bold">
                {isPro ? "∞" : todayUsage} / {isPro ? "∞" : "5"}
              </p>
            </div>
            {analyses.length > 0 && (
              <div className="flex gap-2">
                <a href="/api/export?format=csv" target="_blank">
                  <Button variant="outline" size="sm">Export CSV</Button>
                </a>
                <a href="/api/export?format=json" target="_blank">
                  <Button variant="outline" size="sm">Export JSON</Button>
                </a>
              </div>
            )}
          </div>
        </div>

        {analyses.length === 0 ? (
          <Card className="flex h-[400px] items-center justify-center">
            <CardContent className="text-center">
              <p className="text-lg text-zinc-600">No analyses yet</p>
              <p className="mt-2 text-sm text-zinc-500">
                Start analyzing content to see your history here
              </p>
              <Link href="/dashboard">
                <Button className="mt-4 bg-violet-600 hover:bg-violet-700">
                  Go to Analyzer
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {analyses.map((analysis) => (
              <Card key={analysis.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        AEO Score: {analysis.aeo_score}/100
                      </CardTitle>
                      <CardDescription>
                        {formatDate(analysis.created_at)}
                      </CardDescription>
                    </div>
                    <Badge className={getScoreColor(analysis.aeo_score)}>
                      {analysis.aeo_score >= 80 ? "Excellent" : 
                       analysis.aeo_score >= 60 ? "Good" : "Needs Work"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {analysis.url && (
                    <p className="mb-2 text-sm text-zinc-500">
                      Source: {analysis.url}
                    </p>
                  )}
                  <p className="mb-4 line-clamp-2 text-sm text-zinc-600">
                    {analysis.content.substring(0, 200)}...
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center rounded-lg bg-zinc-50 p-2">
                      <p className="text-xs text-zinc-500">Citation</p>
                      <p className="font-semibold">{analysis.citation_readiness}/5</p>
                    </div>
                    <div className="text-center rounded-lg bg-zinc-50 p-2">
                      <p className="text-xs text-zinc-500">Questions</p>
                      <p className="font-semibold">{analysis.question_coverage}/5</p>
                    </div>
                    <div className="text-center rounded-lg bg-zinc-50 p-2">
                      <p className="text-xs text-zinc-500">Structure</p>
                      <p className="font-semibold">{analysis.structural_score}/5</p>
                    </div>
                  </div>

                  {analysis.recommendations && analysis.recommendations.length > 0 && (
                    <div className="rounded-lg bg-violet-50 p-3">
                      <p className="text-sm font-medium text-violet-900">Top Recommendation:</p>
                      <p className="mt-1 text-sm text-violet-700">
                        {analysis.recommendations[0]}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
