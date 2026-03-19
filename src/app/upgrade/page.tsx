import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "5 AI content analyses per day",
      "Basic AEO scoring",
      "Analysis history",
      "Community support",
    ],
    limitations: [
      "Daily limit resets at midnight",
      "Basic recommendations",
    ],
    cta: "Current Plan",
    href: "/dashboard",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "For serious content creators",
    features: [
      "100 AI content analyses per day",
      "Advanced AEO scoring",
      "Unlimited analysis history",
      "Priority support",
      "Export to PDF & CSV",
      "Early access to new features",
    ],
    limitations: [],
    cta: "Upgrade to Pro",
    href: "/api/create-checkout",
    highlighted: true,
  },
]

export default async function UpgradePage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/")
  }

  const isPro = false // Will be fetched from profile

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <header className="border-b border-zinc-200 bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600" />
            <span className="text-xl font-bold">AEO.ai</span>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost">Back to Dashboard</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">Upgrade Your Plan</h1>
          <p className="mt-4 text-xl text-zinc-600">
            Unlock more analyses and premium features
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name}
              className={plan.highlighted ? "border-violet-500 shadow-lg shadow-violet-100" : ""}
            >
              {plan.highlighted && (
                <div className="bg-violet-600 text-white text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-zinc-500">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation) => (
                    <li key={limitation} className="flex items-center gap-2 text-zinc-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>{limitation}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  {plan.cta === "Current Plan" ? (
                    <Link href="/dashboard">
                      <Button variant="outline" className="w-full">
                        {plan.cta}
                      </Button>
                    </Link>
                  ) : (
                    <a href={plan.href}>
                      <Button className="w-full bg-violet-600 hover:bg-violet-700">
                        {plan.cta}
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-zinc-500">
            Questions? Contact us at{" "}
            <a href="mailto:support@aeo.ai" className="text-violet-600 hover:underline">
              support@aeo.ai
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}
