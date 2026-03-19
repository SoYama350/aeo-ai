import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { lemonSqueezySetup, createCheckout } from "@lemonsqueezy/lemonsqueezy.js"

lemonSqueezySetup({
  apiKey: process.env.LEMONSQUEEZY_API_KEY!,
})

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id
  const userEmail = session.user.email!

  try {
    const storeId = process.env.LEMONSQUEEZY_STORE_ID!
    const variantId = parseInt(process.env.LEMONSQUEEZY_PRO_VARIANT_ID || "0", 10)

    if (!variantId) {
      return NextResponse.json(
        { error: "Pro plan not configured. Please set LEMONSQUEEZY_PRO_VARIANT_ID." },
        { status: 500 }
      )
    }

    const result = await createCheckout(storeId, variantId, {
      checkoutData: {
        email: userEmail,
        custom: {
          user_id: userId,
        },
      },
      productOptions: {
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgrade=success`,
        receiptButtonText: "Go to Dashboard",
        receiptThankYouNote: "Thanks for upgrading to Pro! Your account has been upgraded.",
      },
    })

    if (result.error) {
      console.error("LemonSqueezy error:", result.error)
      return NextResponse.json(
        { error: "Failed to create checkout" },
        { status: 500 }
      )
    }

    const checkoutUrl = result.data?.data.attributes.url

    return NextResponse.json({
      success: true,
      checkoutUrl,
    })
  } catch (error) {
    console.error("LemonSqueezy error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 }
    )
  }
}
