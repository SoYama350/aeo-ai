import { NextResponse } from "next/server"
import { headers } from "next/headers"
import crypto from "crypto"
import { supabaseAdmin } from "@/lib/supabase"

function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac("sha256", secret)
  const digest = hmac.update(payload).digest("hex")
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
}

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  
  const signature = headersList.get("x-signature")
  const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 })
  }

  if (!verifyWebhookSignature(body, signature, webhookSecret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  const event = JSON.parse(body)

  console.log("LemonSqueezy webhook event:", event.meta.event_name)

  switch (event.meta.event_name) {
    case "subscription_created":
    case "subscription_updated": {
      const userId = event.meta.custom_data?.user_id
      const subscriptionStatus = event.data.attributes.status
      const planName = event.data.attributes.first_subscription_item?.price?.product?.name || "Pro"

      if (userId) {
        const tier = subscriptionStatus === "active" ? 
          (planName.toLowerCase().includes("enterprise") ? "enterprise" : "pro") : 
          "free"

        await supabaseAdmin
          .from("profiles")
          .update({ subscription_tier: tier })
          .eq("id", userId)

        console.log(`Updated user ${userId} to ${tier}`)
      }
      break
    }

    case "subscription_cancelled":
    case "subscription_expired": {
      const userId = event.meta.custom_data?.user_id

      if (userId) {
        await supabaseAdmin
          .from("profiles")
          .update({ subscription_tier: "free" })
          .eq("id", userId)

        console.log(`Downgraded user ${userId} to free`)
      }
      break
    }

    case "subscription_payment_success": {
      console.log("Payment received for subscription")
      break
    }

    case "subscription_payment_failed": {
      const userId = event.meta.custom_data?.user_id
      console.log(`Payment failed for user ${userId}`)
      break
    }
  }

  return NextResponse.json({ received: true })
}
