import { NextResponse } from "next/server";
import { sendTestEmail, getMailerConfig } from "@/lib/mailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { targetEmail } = body;
    const { adminEmail } = getMailerConfig();

    const recipient = targetEmail || adminEmail;
    const result = await sendTestEmail(recipient);

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to send test email";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
