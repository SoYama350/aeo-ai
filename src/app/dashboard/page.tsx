"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface Analysis {
  aeoScore: number
  citationReadiness: number
  questionCoverage: number
  structuralScore: number
  recommendations: string[]
  contentLength: number
  url?: string
  analyzedAt: string
}

interface Usage {
  used: number
  limit: number
  remaining: number
  tier: string
  isPro: boolean
}

export default function Dashboard() {
  const [content, setContent] = useState("")
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [error, setError] = useState("")
  const [usage, setUsage] = useState<Usage | null>(null)

  const handleAnalyze = async () => {
    if (!content || content.length < 100) {
      setError("Content must be at least 100 characters")
      return
    }

    setLoading(true)
    setError("")
    setAnalysis(null)

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, url: url || undefined }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 429) {
          setError(data.message || "Daily limit reached")
        } else {
          setError(data.error || "Analysis failed")
        }
        return
      }

      setAnalysis(data.analysis)
      setUsage(data.usage)
    } catch {
      setError("Failed to analyze content")
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (format: "csv" | "json") => {
    window.open(`/api/export?format=${format}`, "_blank")
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-amber-600"
    return "text-red-600"
  }

  const isPro = usage?.isPro || false

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <header className="border-b border-zinc-200 bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600" />
            <span className="text-xl font-bold">AEO.ai</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/history">
              <Button variant="ghost" size="sm">History</Button>
            </Link>
            {!isPro && (
              <Link href="/upgrade">
                <Button variant="ghost" size="sm" className="text-violet-600">
                  Upgrade to Pro
                </Button>
              </Link>
            )}
            <Badge className={isPro ? "bg-violet-100 text-violet-700" : ""}>
              {usage?.tier || "free"} Plan
            </Badge>
            <Button variant="outline" size="sm" onClick={() => signOut()}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">AI Content Analyzer</h1>
            <p className="mt-2 text-zinc-600">
              Optimize your content for AI search engines like ChatGPT, Perplexity, and Claude
            </p>
          </div>
          {usage && (
            <div className="text-right">
              <p className="text-sm text-zinc-500">Analyses remaining today</p>
              <p className="text-2xl font-bold">
                {isPro ? "∞" : usage.remaining} / {usage.limit}
              </p>
              {!isPro && (
                <Link href="/upgrade" className="text-xs text-violet-600 hover:underline">
                  Get unlimited →
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Analyze Your Content</CardTitle>
              <CardDescription>
                Paste your article, blog post, or webpage content below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Page URL (optional)</Label>
                <Input
                  id="url"
                  placeholder="https://yoursite.com/page"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Your Content</Label>
                <Textarea
                  id="content"
                  placeholder="Paste your article, blog post, or webpage content here..."
                  className="min-h-[300px]"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <p className="text-sm text-zinc-500">
                  {content.length} characters (minimum 100)
                </p>
              </div>
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              <Button
                className="w-full bg-violet-600 hover:bg-violet-700"
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading ? "Analyzing..." : "Analyze Content"}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {analysis ? (
              <>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-center text-4xl font-bold">
                        <span className={getScoreColor(analysis.aeoScore)}>
                          {analysis.aeoScore}
                        </span>
                        <span className="text-2xl text-zinc-400">/100</span>
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleExport("csv")}>
                          Export CSV
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleExport("json")}>
                          Export JSON
                        </Button>
                      </div>
                    </div>
                    <CardDescription className="text-center">
                      Overall AEO Score
                    </CardDescription>
                  </CardHeader>
                </Card>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Citation</CardDescription>
                      <CardTitle className={getScoreColor(analysis.citationReadiness * 20)}>
                        {analysis.citationReadiness}/5
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Questions</CardDescription>
                      <CardTitle className={getScoreColor(analysis.questionCoverage * 20)}>
                        {analysis.questionCoverage}/5
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Structure</CardDescription>
                      <CardTitle className={getScoreColor(analysis.structuralScore * 20)}>
                        {analysis.structuralScore}/5
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-violet-600">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="flex h-[400px] items-center justify-center">
                <CardContent className="text-center text-zinc-500">
                  <p>Enter content and click Analyze to see results</p>
                  <p className="mt-2 text-sm">
                    Free plan: 5 analyses remaining today
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
