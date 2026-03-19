import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(req: Request) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (error || !profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 })
  }

  const today = new Date().toISOString().split("T")[0]
  const lastNotification = profile.last_email_notification
  const analysesUsed = profile.last_analysis_date === today 
    ? profile.analyses_used_today 
    : 0

  // Send notification if usage is at 80% or above and hasn't been notified today
  const shouldNotify = analysesUsed >= 4 && lastNotification !== today

  if (!shouldNotify) {
    return NextResponse.json({ 
      sent: false, 
      reason: analysesUsed < 4 ? "Usage below threshold" : "Already notified today"
    })
  }

  // In production, integrate with Resend, SendGrid, etc.
  // For now, we'll return the notification data
  const emailData = {
    to: profile.email,
    subject: "You've used 80% of your daily AEO analyses",
    body: `
Hi,

You've used ${analysesUsed} out of 5 free AEO analyses today.

${analysesUsed === 5 
  ? "You've reached your daily limit. Upgrade to Pro for 100 analyses per day!" 
  : `You have ${5 - analysesUsed} analyses remaining today.`}

Upgrade to Pro: ${process.env.NEXT_PUBLIC_APP_URL}/upgrade

Best,
The AEO.ai Team
    `.trim()
  }

  // In production, send the email here
  // await sendEmail(emailData)

  // Update last notification date
  await supabase
    .from("profiles")
    .update({ last_email_notification: today })
    .eq("id", userId)

  return NextResponse.json({ 
    sent: true, 
    message: "Notification would be sent in production",
    emailData 
  })
}
