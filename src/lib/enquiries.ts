import fs from "fs";
import path from "path";
import { Enquiry, EnquiryInput, EnquiryStatus, EmailLog } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const ENQUIRIES_FILE = path.join(DATA_DIR, "enquiries.json");
const EMAIL_LOGS_FILE = path.join(DATA_DIR, "email_logs.json");

function ensureDirectoryAndFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(ENQUIRIES_FILE)) {
    fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify([], null, 2), "utf8");
  }
  if (!fs.existsSync(EMAIL_LOGS_FILE)) {
    fs.writeFileSync(EMAIL_LOGS_FILE, JSON.stringify([], null, 2), "utf8");
  }
}

export function getAllEnquiries(): Enquiry[] {
  ensureDirectoryAndFiles();
  try {
    const raw = fs.readFileSync(ENQUIRIES_FILE, "utf8");
    const data: Enquiry[] = JSON.parse(raw);
    return data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.error("Failed to read enquiries:", err);
    return [];
  }
}

export function createEnquiry(input: EnquiryInput, emailSent = false): Enquiry {
  ensureDirectoryAndFiles();
  const list = getAllEnquiries();
  const newEnquiry: Enquiry = {
    id: `enq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: input.name.trim(),
    email: input.email.trim(),
    company: input.company?.trim() || undefined,
    service: input.service || "Web Development",
    budget: input.budget || "$10k - $25k",
    message: input.message.trim(),
    status: "New",
    createdAt: new Date().toISOString(),
    emailSent,
  };

  list.unshift(newEnquiry);
  fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(list, null, 2), "utf8");
  return newEnquiry;
}

export function updateEnquiryStatus(id: string, status: EnquiryStatus, notes?: string): Enquiry | null {
  ensureDirectoryAndFiles();
  const list = getAllEnquiries();
  const index = list.findIndex((e) => e.id === id);
  if (index === -1) return null;

  list[index].status = status;
  if (notes !== undefined) {
    list[index].notes = notes;
  }
  fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(list, null, 2), "utf8");
  return list[index];
}

export function deleteEnquiry(id: string): boolean {
  ensureDirectoryAndFiles();
  const list = getAllEnquiries();
  const filtered = list.filter((e) => e.id !== id);
  if (filtered.length === list.length) return false;

  fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(filtered, null, 2), "utf8");
  return true;
}

export function logEmail(log: Omit<EmailLog, "id" | "sentAt">): EmailLog {
  ensureDirectoryAndFiles();
  let logs: EmailLog[] = [];
  try {
    const raw = fs.readFileSync(EMAIL_LOGS_FILE, "utf8");
    logs = JSON.parse(raw);
  } catch {
    logs = [];
  }

  const newLog: EmailLog = {
    id: `log_${Date.now()}`,
    ...log,
    sentAt: new Date().toISOString(),
  };

  logs.unshift(newLog);
  // Keep last 100 logs
  if (logs.length > 100) logs = logs.slice(0, 100);

  fs.writeFileSync(EMAIL_LOGS_FILE, JSON.stringify(logs, null, 2), "utf8");
  return newLog;
}

export function getEmailLogs(): EmailLog[] {
  ensureDirectoryAndFiles();
  try {
    const raw = fs.readFileSync(EMAIL_LOGS_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
