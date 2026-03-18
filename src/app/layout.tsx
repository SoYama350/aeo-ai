import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AEO.ai - AI Answer Engine Optimization Tool",
  description: "Optimize your content for AI search. Get your content featured in ChatGPT, Perplexity, and Claude answers.",
  keywords: ["AEO", "AI SEO", "Answer Engine Optimization", "ChatGPT optimization", "Perplexity", "content optimization"],
  openGraph: {
    title: "AEO.ai - Optimize Your Content for AI Search",
    description: "Help ChatGPT, Perplexity, and Claude find and cite your content. Get actionable insights to improve your AI visibility.",
    type: "website",
    siteName: "AEO.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "AEO.ai - AI Answer Engine Optimization Tool",
    description: "Optimize your content for AI search. Get featured in ChatGPT, Perplexity, and Claude.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AEO.ai",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "description": "Free tier with 5 content analyses per month"
    },
    "description": "AI Answer Engine Optimization tool that helps content rank in ChatGPT, Perplexity, and Claude search results.",
    "featureList": [
      "Citation Optimizer",
      "AI Visibility Tracker", 
      "Question Intelligence"
    ]
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
