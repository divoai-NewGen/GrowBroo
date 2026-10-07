import nodemailer from "nodemailer";
import { Enquiry } from "./types";
import { logEmail } from "./enquiries";

interface MailerConfig {
  hasSmtp: boolean;
  adminEmail: string;
}

export function getMailerConfig(): MailerConfig {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "aman@growbroo.com";

  const hasSmtp = Boolean(host && user && pass);
  return { hasSmtp, adminEmail };
}

export async function sendEnquiryNotification(enquiry: Enquiry): Promise<{ success: boolean; status: "sent" | "logged" | "failed"; message: string }> {
  const { hasSmtp, adminEmail } = getMailerConfig();
  const subject = `🚀 New Lead: ${enquiry.name} (${enquiry.service} - ${enquiry.budget})`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F7FBF7; color: #050505; margin: 0; padding: 24px; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #D8E7D8; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,107,33,0.06); }
    .header { background: linear-gradient(135deg, #006B21 0%, #10251A 100%); color: #ffffff; padding: 28px 32px; }
    .badge { display: inline-block; background: #39E900; color: #050505; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .title { font-size: 22px; font-weight: 900; margin: 0; color: #ffffff; }
    .content { padding: 32px; }
    .field { margin-bottom: 20px; }
    .label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #4D5C52; margin-bottom: 6px; }
    .value { font-size: 16px; font-weight: 600; color: #050505; }
    .message-box { background: #F7FBF7; border: 1px solid #D8E7D8; border-radius: 12px; padding: 18px; font-size: 15px; line-height: 1.6; color: #10251A; white-space: pre-wrap; }
    .cta-btn { display: inline-block; background: #006B21; color: #ffffff !important; font-weight: 800; font-size: 14px; text-decoration: none; padding: 14px 28px; border-radius: 9999px; margin-top: 16px; }
    .footer { padding: 20px 32px; background: #F7FBF7; border-top: 1px solid #D8E7D8; font-size: 12px; color: #4D5C52; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <span class="badge">New Website Enquiry</span>
      <h1 class="title">You have received a new lead!</h1>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Client Name</div>
        <div class="value">${enquiry.name}</div>
      </div>
      <div class="field">
        <div class="label">Email Address</div>
        <div class="value"><a href="mailto:${enquiry.email}" style="color: #006B21; font-weight: 700; text-decoration: underline;">${enquiry.email}</a></div>
      </div>
      <div class="field">
        <div class="label">Requested Service</div>
        <div class="value">${enquiry.service}</div>
      </div>
      <div class="field">
        <div class="label">Estimated Budget</div>
        <div class="value"><span style="background: #E9F8E9; color: #006B21; padding: 4px 10px; border-radius: 6px; font-weight: 800;">${enquiry.budget}</span></div>
      </div>
      <div class="field">
        <div class="label">Project Requirements / Message</div>
        <div class="message-box">${enquiry.message || "No specific message provided."}</div>
      </div>
      <div style="text-align: center; margin-top: 28px;">
        <a href="mailto:${enquiry.email}?subject=Re:%20GrowBroo%20Proposal%20for%20${encodeURIComponent(enquiry.name)}" class="cta-btn">
          Reply Directly to ${enquiry.name} →
        </a>
      </div>
    </div>
    <div class="footer">
      Received via GrowBroo / Verdant Digital Website at ${new Date(enquiry.createdAt).toLocaleString()}
    </div>
  </div>
</body>
</html>
`;

  if (hasSmtp) {
    try {
      const port = Number(process.env.SMTP_PORT) || 587;
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const fromAddress = process.env.SMTP_FROM || `"GrowBroo Leads" <${process.env.SMTP_USER}>`;

      await transporter.sendMail({
        from: fromAddress,
        to: adminEmail,
        replyTo: enquiry.email,
        subject,
        html: htmlContent,
      });

      logEmail({
        enquiryId: enquiry.id,
        recipient: adminEmail,
        subject,
        status: "sent",
      });

      return { success: true, status: "sent", message: `Email delivered to ${adminEmail}` };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error("SMTP error sending enquiry notification:", err);

      logEmail({
        enquiryId: enquiry.id,
        recipient: adminEmail,
        subject,
        status: "failed",
        error: errorMsg,
      });

      return { success: false, status: "failed", message: errorMsg };
    }
  }

  // Fallback: No SMTP configured yet -> Log cleanly into email logs so admin can see it in dashboard
  logEmail({
    enquiryId: enquiry.id,
    recipient: adminEmail,
    subject,
    status: "logged",
  });

  return {
    success: true,
    status: "logged",
    message: `Enquiry logged for ${adminEmail}. (Configure SMTP in .env.local to send live emails directly)`,
  };
}

export async function sendTestEmail(targetEmail: string): Promise<{ success: boolean; message: string }> {
  const { hasSmtp } = getMailerConfig();
  if (!hasSmtp) {
    return {
      success: false,
      message: "SMTP is not configured yet in .env.local. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS.",
    };
  }

  try {
    const port = Number(process.env.SMTP_PORT) || 587;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const fromAddress = process.env.SMTP_FROM || `"GrowBroo Leads" <${process.env.SMTP_USER}>`;
    await transporter.sendMail({
      from: fromAddress,
      to: targetEmail,
      subject: "✅ Test Email: GrowBroo Admin Notifications Working!",
      html: `
        <div style="font-family: sans-serif; padding: 24px; background: #F7FBF7; border-radius: 12px; color: #050505;">
          <h2 style="color: #006B21;">SMTP Connection Successful!</h2>
          <p>Your GrowBroo email notification system is properly configured and live.</p>
          <p>When leads submit enquiries on the website, notifications will be delivered instantly to <strong>${targetEmail}</strong>.</p>
        </div>
      `,
    });

    return { success: true, message: `Test email sent successfully to ${targetEmail}!` };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { success: false, message: `SMTP test failed: ${errorMsg}` };
  }
}
