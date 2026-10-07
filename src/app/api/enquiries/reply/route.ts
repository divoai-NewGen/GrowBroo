import { NextResponse } from "next/server";
import { sendClientReply } from "@/lib/mailer";
import { updateEnquiryStatus } from "@/lib/enquiries";
import { EnquiryStatus } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { enquiryId, toEmail, clientName, subject, message, newStatus } = body;

    if (!enquiryId || !toEmail || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (enquiryId, toEmail, subject, message)" },
        { status: 400 }
      );
    }

    const emailResult = await sendClientReply({
      enquiryId,
      toEmail,
      clientName: clientName || "Client",
      subject,
      message,
    });

    if (newStatus) {
      updateEnquiryStatus(enquiryId, newStatus as EnquiryStatus);
    }

    return NextResponse.json({
      success: emailResult.success,
      status: emailResult.status,
      message: emailResult.message,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Error sending reply";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
