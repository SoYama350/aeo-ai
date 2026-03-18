import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { signIn } from "@/lib/auth";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-950">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600" />
            <span className="text-xl font-bold">AEO.ai</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">Features</a>
            <a href="#pricing" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">Pricing</a>
            <form
              action={async () => {
                "use server"
                await signIn("github", { redirectTo: "/dashboard" })
              }}
            >
              <Button variant="outline" size="sm" type="submit">Sign In</Button>
            </form>
          </nav>
        </div>
      </header>

      <main>
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-4">v1.0 Early Access</Badge>
            <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Optimize Your Content for <span className="text-violet-600">AI Search</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Help ChatGPT, Perplexity, and Claude find and cite your content. 
              Get actionable insights to improve your chances of being featured in AI answers.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <form
                action={async () => {
                  "use server"
                  await signIn("github", { redirectTo: "/dashboard" })
                }}
              >
                <Button size="lg" className="bg-violet-600 hover:bg-violet-700" type="submit">
                  Start Free Trial
                </Button>
              </form>
              <Button size="lg" variant="outline">
                See Demo
              </Button>
            </div>
          </div>
        </section>

        <section id="analyzer" className="py-16 bg-zinc-100 dark:bg-zinc-900">
          <div className="container mx-auto px-4">
            <Card className="mx-auto max-w-2xl">
              <CardHeader>
                <CardTitle>AI Content Analyzer</CardTitle>
                <CardDescription>
                  Paste your content below to get an AEO score and optimization tips
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url">Page URL (optional)</Label>
                  <Input id="url" placeholder="https://yoursite.com/page" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Your Content</Label>
                  <Textarea 
                    id="content" 
                    placeholder="Sign in to analyze your content..." 
                    className="min-h-[200px]"
                    disabled
                  />
                </div>
                <Button className="w-full bg-violet-600 hover:bg-violet-700" disabled>
                  Sign In to Analyze
                </Button>
              </CardContent>
            </Card>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-3xl font-bold text-violet-600">73%</CardTitle>
                  <CardDescription>AEO Score</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Your content has good structure for AI indexing
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-3xl font-bold text-amber-600">2/5</CardTitle>
                  <CardDescription>Citation Readiness</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Add more authoritative claims with data sources
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-3xl font-bold text-green-600">High</CardTitle>
                  <CardDescription>Question Coverage</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Your content answers common user questions well
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">
              Everything You Need for AI Discovery
            </h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900">
                  <svg className="h-6 w-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Citation Optimizer</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Improve your chances of being cited by AI by adding authoritative claims and verifiable data
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900">
                  <svg className="h-6 w-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">AI Visibility Tracker</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Monitor how your content appears across different AI platforms over time
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900">
                  <svg className="h-6 w-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Question Intelligence</h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Discover what questions your audience is asking and create content that answers them
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20 bg-zinc-100 dark:bg-zinc-900">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Starter</CardTitle>
                  <CardDescription>For individuals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">$0<span className="text-lg font-normal text-zinc-500">/mo</span></div>
                  <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <li className="flex items-center gap-2">✓ 5 content analyses/mo</li>
                    <li className="flex items-center gap-2">✓ Basic AEO score</li>
                    <li className="flex items-center gap-2">✓ Email support</li>
                  </ul>
                  <form
                    action={async () => {
                      "use server"
                      await signIn("github", { redirectTo: "/dashboard" })
                    }}
                  >
                    <Button className="mt-6 w-full" variant="outline" type="submit">Get Started</Button>
                  </form>
                </CardContent>
              </Card>
              <Card className="border-violet-500 border-2">
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                  <CardDescription>For creators & businesses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">$19<span className="text-lg font-normal text-zinc-500">/mo</span></div>
                  <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <li className="flex items-center gap-2">✓ Unlimited analyses</li>
                    <li className="flex items-center gap-2">✓ Advanced insights</li>
                    <li className="flex items-center gap-2">✓ AI visibility tracking</li>
                    <li className="flex items-center gap-2">✓ Priority support</li>
                  </ul>
                  <Button className="mt-6 w-full bg-violet-600 hover:bg-violet-700">Coming Soon</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12">
          <div className="container mx-auto px-4 text-center text-sm text-zinc-500">
            <p>© 2026 AEO.ai — Built for the AI-first world</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
