import { NextResponse } from "next/server";
import { getAllEnquiries, createEnquiry, getEmailLogs } from "@/lib/enquiries";
import { sendEnquiryNotification, getMailerConfig } from "@/lib/mailer";
import { EnquiryInput } from "@/lib/types";

export async function GET() {
  try {
    const enquiries = getAllEnquiries();
    const emailLogs = getEmailLogs();
    const mailerConfig = getMailerConfig();

    const stats = {
      total: enquiries.length,
      newCount: enquiries.filter((e) => e.status === "New").length,
      contactedCount: enquiries.filter((e) => e.status === "Contacted").length,
      inDiscussionCount: enquiries.filter((e) => e.status === "In Discussion").length,
      wonCount: enquiries.filter((e) => e.status === "Won").length,
      emailDeliveredCount: emailLogs.filter((l) => l.status === "sent").length,
      emailLoggedCount: emailLogs.filter((l) => l.status === "logged").length,
    };

    return NextResponse.json({
      success: true,
      enquiries,
      stats,
      emailLogs,
      mailerConfig: {
        hasSmtp: mailerConfig.hasSmtp,
        adminEmail: mailerConfig.adminEmail,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load enquiries";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, service, budget, message, company } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ success: false, error: "Valid email address is required" }, { status: 400 });
    }

    const input: EnquiryInput = {
      name: name.trim(),
      email: email.trim(),
      company: typeof company === "string" ? company.trim() : undefined,
      service: typeof service === "string" ? service : "Web Development",
      budget: typeof budget === "string" ? budget : "$10k - $25k",
      message: typeof message === "string" ? message.trim() : "",
    };

    // Save enquiry to persistent storage
    const enquiry = createEnquiry(input);

    // Send email notification to admin asynchronously / in background
    let emailResult: { success: boolean; status: "sent" | "logged" | "failed"; message: string } = {
      success: false,
      status: "logged",
      message: "",
    };
    try {
      emailResult = await sendEnquiryNotification(enquiry);
    } catch (mailErr) {
      console.error("Email notification dispatch error:", mailErr);
    }

    return NextResponse.json({
      success: true,
      enquiry,
      emailResult,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to submit enquiry";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
