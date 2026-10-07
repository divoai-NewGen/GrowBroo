export type EnquiryStatus = "New" | "Contacted" | "In Discussion" | "Won" | "Archived";

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  company?: string;
  service: string;
  budget: string;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
  emailSent: boolean;
  notes?: string;
}

export interface EnquiryInput {
  name: string;
  email: string;
  company?: string;
  service: string;
  budget?: string;
  message: string;
}

export interface EmailLog {
  id: string;
  enquiryId: string;
  recipient: string;
  subject: string;
  sentAt: string;
  status: "sent" | "logged" | "failed";
  error?: string;
  previewUrl?: string;
}
