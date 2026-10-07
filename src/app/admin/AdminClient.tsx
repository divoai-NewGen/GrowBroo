"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Enquiry, EnquiryStatus, EmailLog } from "@/lib/types";

interface AdminClientProps {
  initialAuthenticated?: boolean;
}

export default function AdminClient({ initialAuthenticated = false }: AdminClientProps) {
  // Auth state initialized directly from server cookie (never null, no delay)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAuthenticated);
  const [authLoading, setAuthLoading] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Dashboard state
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    newCount: 0,
    contactedCount: 0,
    inDiscussionCount: 0,
    wonCount: 0,
  });
  const [mailerConfig, setMailerConfig] = useState({
    hasSmtp: false,
    adminEmail: "growbroo.info@gmail.com",
  });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [serviceFilter, setServiceFilter] = useState<string>("All");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [modalTab, setModalTab] = useState<"details" | "reply">("details");
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [replyAutoStatus, setReplyAutoStatus] = useState(true);
  const [replySending, setReplySending] = useState(false);
  const [replyFeedback, setReplyFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [replySentSuccess, setReplySentSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"leads" | "emails">("leads");

  // Load enquiries immediately if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchEnquiries();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setLoginError(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId, password }),
      });

      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        fetchEnquiries();
      } else {
        setLoginError(data.error || "Invalid Login ID or Password");
      }
    } catch {
      setLoginError("Network error. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      setIsAuthenticated(false);
      setPassword("");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/enquiries");
      const data = await res.json();
      if (data.success) {
        setEnquiries(data.enquiries || []);
        if (data.stats) setStats(data.stats);
        if (data.emailLogs) setEmailLogs(data.emailLogs);
        if (data.mailerConfig) setMailerConfig(data.mailerConfig);
      }
    } catch (err) {
      console.error("Failed to fetch enquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-poll every 20 seconds when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(fetchEnquiries, 20000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleStatusChange = async (id: string, newStatus: EnquiryStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
        if (selectedEnquiry && selectedEnquiry.id === id) {
          setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      const res = await fetch(`/api/enquiries/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
        if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      }
    } catch (err) {
      console.error("Failed to delete enquiry:", err);
    }
  };

  const openEnquiryModal = (enq: Enquiry, tab: "details" | "reply" = "details") => {
    setSelectedEnquiry(enq);
    setModalTab(tab);
    setReplySubject(`Re: GrowBroo Digital Proposal - ${enq.service}`);
    setReplyMessage(
      `Hi ${enq.name},\n\nThank you for reaching out to GrowBroo regarding ${enq.service}!\n\nWe would love to schedule a brief 15-minute discovery call to discuss your goals, requirements, and sprint timeline.\n\nPlease let us know what time works best for you, or feel free to share any additional specifications.\n\nLooking forward to speaking soon!`
    );
    setReplyFeedback(null);
    setReplySentSuccess(false);
  };

  const applyTemplate = (type: "discovery" | "scope" | "quote") => {
    if (!selectedEnquiry) return;
    if (type === "discovery") {
      setReplySubject(`Re: GrowBroo Digital Discovery - ${selectedEnquiry.service}`);
      setReplyMessage(
        `Hi ${selectedEnquiry.name},\n\nThank you for reaching out to GrowBroo regarding ${selectedEnquiry.service}.\n\nOur founding engineering team would love to jump on a quick 15-minute discovery call to discuss your goals and provide tailored recommendations.\n\nWould tomorrow at 2:00 PM or 4:30 PM work for a brief intro? Looking forward to connecting!`
      );
    } else if (type === "scope") {
      setReplySubject(`GrowBroo: Quick Questions Regarding Your ${selectedEnquiry.service} Project`);
      setReplyMessage(
        `Hi ${selectedEnquiry.name},\n\nWe carefully reviewed your project brief. To help us prepare an accurate roadmap and sprint timeline, could you share:\n\n1. Target launch date for the MVP?\n2. Any existing design files, brand assets, or references?\n3. Primary integrations or backend services needed?\n\nOnce we have these details, we can prepare a structured proposal for you.`
      );
    } else if (type === "quote") {
      setReplySubject(`GrowBroo Proposal & Sprint Scope: ${selectedEnquiry.service}`);
      setReplyMessage(
        `Hi ${selectedEnquiry.name},\n\nBased on your selected investment range (${selectedEnquiry.budget}) and project scope, we have put together our initial sprint architecture.\n\nWe ensure sub-second performance, modern Next.js architecture, and direct senior partner collaboration.\n\nLet's schedule a time to walk you through our proposal and kickoff timeline.`
      );
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry || !replySubject || !replyMessage) return;

    setReplySending(true);
    setReplyFeedback(null);
    setReplySentSuccess(false);

    try {
      const res = await fetch("/api/enquiries/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enquiryId: selectedEnquiry.id,
          toEmail: selectedEnquiry.email,
          clientName: selectedEnquiry.name,
          subject: replySubject,
          message: replyMessage,
          newStatus: replyAutoStatus ? "Contacted" : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReplySentSuccess(true);
        const targetEmail = selectedEnquiry.email;

        if (replyAutoStatus) {
          setSelectedEnquiry({ ...selectedEnquiry, status: "Contacted" });
          setEnquiries((prev) =>
            prev.map((e) => (e.id === selectedEnquiry.id ? { ...e, status: "Contacted" } : e))
          );
        }
        fetchEnquiries();

        // Auto-close modal and return back to leads list
        setTimeout(() => {
          setSelectedEnquiry(null);
          setReplySentSuccess(false);
          setToastMessage(`Reply sent to ${targetEmail} successfully! Lead marked as Contacted.`);
          setTimeout(() => setToastMessage(null), 4000);
        }, 1800);
      } else {
        setReplyFeedback({
          success: false,
          message: data.error || data.message || "Failed to send email reply",
        });
      }
    } catch {
      setReplyFeedback({
        success: false,
        message: "Network error sending email reply. Please try again.",
      });
    } finally {
      setReplySending(false);
    }
  };

  const handleSendTestEmail = async () => {
    setTestEmailLoading(true);
    setTestEmailResult(null);
    try {
      const res = await fetch("/api/enquiries/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetEmail: mailerConfig.adminEmail }),
      });
      const data = await res.json();
      setTestEmailResult(data.message || (data.success ? "Test email sent!" : "Failed to send"));
    } catch {
      setTestEmailResult("Network error testing email");
    } finally {
      setTestEmailLoading(false);
    }
  };

  const exportCSV = () => {
    if (enquiries.length === 0) return;
    const headers = ["ID", "Name", "Email", "Company", "Service", "Budget", "Status", "Date", "Message"];
    const rows = enquiries.map((e) => [
      e.id,
      `"${e.name.replace(/"/g, '""')}"`,
      e.email,
      `"${(e.company || "").replace(/"/g, '""')}"`,
      `"${e.service}"`,
      `"${e.budget}"`,
      e.status,
      new Date(e.createdAt).toLocaleString(),
      `"${e.message.replace(/"/g, '""')}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `growbroo_enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      const matchesSearch =
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.company && e.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
        e.message.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "All" || e.status === statusFilter;
      const matchesService = serviceFilter === "All" || e.service === serviceFilter;

      return matchesSearch && matchesStatus && matchesService;
    });
  }, [enquiries, searchQuery, statusFilter, serviceFilter]);

  const uniqueServices = useMemo(() => {
    const set = new Set(enquiries.map((e) => e.service));
    return ["All", ...Array.from(set)];
  }, [enquiries]);

  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case "New":
        return "bg-[#39E900]/20 text-[#006B21] border-[#39E900]/50 font-bold";
      case "In Discussion":
        return "bg-blue-50 text-blue-700 border-blue-200 font-bold";
      case "Contacted":
        return "bg-amber-50 text-amber-700 border-amber-200 font-bold";
      case "Won":
        return "bg-[#006B21] text-white border-[#006B21] font-bold";
      case "Archived":
        return "bg-gray-100 text-gray-500 border-gray-200 font-medium";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  // 1. LOGIN SCREEN (When not authenticated - Renders Instantly)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F7FBF7] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-[#D8E7D8] rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
          {/* Top Glow Accent */}
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#39E900]/20 rounded-full blur-2xl pointer-events-none" />

          {/* Logo & Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#006B21] text-[#39E900] flex items-center justify-center font-black text-xl shadow-md">
              GB
            </div>
            <h1 className="text-2xl font-black text-[#050505] tracking-tight">
              GrowBroo <span className="text-[#006B21]">Admin Portal</span>
            </h1>
            <p className="text-xs text-[#4D5C52] max-w-xs mx-auto">
              Please enter your credentials to access the leads dashboard and email logs.
            </p>
          </div>

          {/* Error Banner */}
          {loginError && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{loginError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#050505] mb-1.5">
                Login ID / Email
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4D5C52]"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Enter your Login ID / Email"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D8E7D8] bg-[#F7FBF7] text-sm text-[#050505] placeholder:text-[#4D5C52]/50 focus:outline-none focus:border-[#006B21] focus:ring-2 focus:ring-[#39E900]/25 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#050505] mb-1.5">
                Password
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4D5C52]"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-[#D8E7D8] bg-[#F7FBF7] text-sm text-[#050505] placeholder:text-[#4D5C52]/50 focus:outline-none focus:border-[#006B21] focus:ring-2 focus:ring-[#39E900]/25 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4D5C52] hover:text-[#050505] text-xs font-bold cursor-pointer"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 rounded-full bg-[#006B21] text-white font-bold text-sm hover:bg-[#10251A] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-75 cursor-pointer mt-2"
            >
              {authLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Info */}
          <div className="mt-8 pt-6 border-t border-[#D8E7D8] text-center text-xs text-[#4D5C52]">
            <Link href="/" className="hover:text-[#006B21] transition-colors font-bold">
              ← Return to Main Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED DASHBOARD
  return (
    <div className="min-h-screen bg-[#F7FBF7] text-[#050505]">
      {/* Top Admin Header (Dedicated console header without public website navbar) */}
      <header className="bg-white border-b border-[#D8E7D8] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-[#006B21] text-[#39E900] flex items-center justify-center font-black text-sm shadow-xs transition-transform group-hover:scale-105">
                GB
              </div>
              <div className="flex flex-col">
                <span className="font-black text-base text-[#050505] leading-none">
                  GrowBroo <span className="text-[#006B21]">Console</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4D5C52]">
                  Lead &amp; Enquiries Hub
                </span>
              </div>
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E9F8E9] border border-[#D8E7D8] text-[11px] font-bold text-[#006B21]">
              <span className="w-2 h-2 rounded-full bg-[#39E900] animate-pulse" />
              Live Feed
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#D8E7D8] bg-white text-xs font-bold text-[#050505] hover:bg-[#E9F8E9] transition-colors cursor-pointer"
              title="Download CSV of all leads"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={fetchEnquiries}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#006B21] text-white text-xs font-bold hover:bg-[#10251A] transition-colors cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
              <span>Refresh</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 text-xs font-bold transition-colors cursor-pointer"
              title="Sign Out"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* KPI Analytics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-[#D8E7D8] rounded-2xl p-5 shadow-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#4D5C52]">Total Enquiries</div>
            <div className="text-3xl font-black text-[#050505] mt-1">{stats.total}</div>
            <div className="text-xs text-[#4D5C52] mt-1">All time received</div>
          </div>

          <div className="bg-white border border-[#D8E7D8] rounded-2xl p-5 shadow-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#006B21]">New / Unopened</div>
            <div className="text-3xl font-black text-[#006B21] mt-1 flex items-center gap-2">
              {stats.newCount}
              {stats.newCount > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#39E900] animate-ping" />
              )}
            </div>
            <div className="text-xs text-[#006B21] font-semibold mt-1">Action required</div>
          </div>

          <div className="bg-white border border-[#D8E7D8] rounded-2xl p-5 shadow-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-700">In Discussion</div>
            <div className="text-3xl font-black text-[#050505] mt-1">{stats.inDiscussionCount}</div>
            <div className="text-xs text-[#4D5C52] mt-1">Active proposals</div>
          </div>

          <div className="bg-white border border-[#D8E7D8] rounded-2xl p-5 shadow-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#4D5C52]">Notification Email</div>
            <div className="text-sm font-bold text-[#050505] mt-2 flex items-center gap-1.5 truncate">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${mailerConfig.hasSmtp ? "bg-[#39E900]" : "bg-amber-400"}`} />
              <span className="truncate" title={mailerConfig.adminEmail}>{mailerConfig.adminEmail}</span>
            </div>
            <div className="text-[11px] text-[#4D5C52] mt-1">
              {mailerConfig.hasSmtp ? "Live SMTP Connected" : "Logging Mode (Configure SMTP)"}
            </div>
          </div>
        </div>

        {/* Tab Selector: Leads vs Email Logs */}
        <div className="flex items-center gap-2 border-b border-[#D8E7D8]">
          <button
            onClick={() => setActiveTab("leads")}
            className={`px-4 py-2.5 text-sm font-black border-b-2 transition-all cursor-pointer ${
              activeTab === "leads"
                ? "border-[#006B21] text-[#006B21]"
                : "border-transparent text-[#4D5C52] hover:text-[#050505]"
            }`}
          >
            Leads &amp; Inquiries ({enquiries.length})
          </button>
          <button
            onClick={() => setActiveTab("emails")}
            className={`px-4 py-2.5 text-sm font-black border-b-2 transition-all cursor-pointer ${
              activeTab === "emails"
                ? "border-[#006B21] text-[#006B21]"
                : "border-transparent text-[#4D5C52] hover:text-[#050505]"
            }`}
          >
            Email Dispatch Logs ({emailLogs.length})
          </button>
        </div>

        {activeTab === "leads" ? (
          <>
            {/* Search and Filters Bar */}
            <div className="bg-white border border-[#D8E7D8] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4D5C52]"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search leads by name, email, company, or requirements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F7FBF7] border border-[#D8E7D8] text-sm text-[#050505] placeholder:text-[#4D5C52]/60 focus:outline-none focus:border-[#006B21] focus:ring-1 focus:ring-[#006B21]"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-xs font-bold text-[#4D5C52] whitespace-nowrap">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#F7FBF7] border border-[#D8E7D8] text-xs font-bold text-[#050505] focus:outline-none focus:border-[#006B21]"
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="In Discussion">In Discussion</option>
                  <option value="Won">Won</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              {/* Service Filter */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-xs font-bold text-[#4D5C52] whitespace-nowrap">Service:</span>
                <select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#F7FBF7] border border-[#D8E7D8] text-xs font-bold text-[#050505] focus:outline-none focus:border-[#006B21]"
                >
                  {uniqueServices.map((svc) => (
                    <option key={svc} value={svc}>
                      {svc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Enquiries Feed Table */}
            <div className="bg-white border border-[#D8E7D8] rounded-2xl shadow-xs overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-[#4D5C52] text-sm">Loading enquiries...</div>
              ) : filteredEnquiries.length === 0 ? (
                <div className="p-12 text-center space-y-2">
                  <div className="text-2xl">📬</div>
                  <div className="text-base font-black text-[#050505]">No inquiries found</div>
                  <div className="text-xs text-[#4D5C52]">
                    {enquiries.length === 0
                      ? "Submit an inquiry on the homepage contact form to see it appear here!"
                      : "Try clearing your search filters."}
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#F7FBF7] border-b border-[#D8E7D8] text-[11px] font-black uppercase tracking-wider text-[#4D5C52]">
                        <th className="py-3.5 px-4 sm:px-6">Lead / Client</th>
                        <th className="py-3.5 px-4">Service &amp; Budget</th>
                        <th className="py-3.5 px-4">Message Excerpt</th>
                        <th className="py-3.5 px-4">Date</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D8E7D8]/60">
                      {filteredEnquiries.map((enq) => {
                        const dateFormatted = new Date(enq.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        });

                        return (
                          <tr
                            key={enq.id}
                            className="hover:bg-[#F7FBF7]/80 transition-colors group"
                          >
                            {/* Lead / Client */}
                            <td className="py-4 px-4 sm:px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#E9F8E9] border border-[#D8E7D8] flex items-center justify-center font-black text-xs text-[#006B21] shrink-0">
                                  {enq.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-[#050505] truncate flex items-center gap-1.5">
                                    <span>{enq.name}</span>
                                    {enq.status === "New" && (
                                      <span className="w-2 h-2 rounded-full bg-[#39E900]" title="New Lead" />
                                    )}
                                  </div>
                                  <a
                                    href={`mailto:${enq.email}`}
                                    className="text-xs text-[#006B21] hover:underline truncate block"
                                  >
                                    {enq.email}
                                  </a>
                                  {enq.company && (
                                    <div className="text-[11px] text-[#4D5C52] truncate">
                                      🏢 {enq.company}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Service & Budget */}
                            <td className="py-4 px-4">
                              <div className="font-bold text-xs text-[#050505]">{enq.service}</div>
                              <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-[#E9F8E9] text-[#006B21] text-[11px] font-black">
                                {enq.budget}
                              </span>
                            </td>

                            {/* Message Excerpt */}
                            <td className="py-4 px-4 max-w-xs">
                              <p
                                onClick={() => openEnquiryModal(enq, "details")}
                                className="text-xs text-[#4D5C52] line-clamp-2 cursor-pointer hover:text-[#006B21] transition-colors"
                                title="Click to view full message"
                              >
                                {enq.message || "No message provided."}
                              </p>
                            </td>

                            {/* Date */}
                            <td className="py-4 px-4 text-xs text-[#4D5C52] whitespace-nowrap">
                              {dateFormatted}
                            </td>

                            {/* Status Selector */}
                            <td className="py-4 px-4">
                              <select
                                value={enq.status}
                                disabled={updatingId === enq.id}
                                onChange={(e) => handleStatusChange(enq.id, e.target.value as EnquiryStatus)}
                                className={`text-xs px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${getStatusBadge(
                                  enq.status
                                )}`}
                              >
                                <option value="New">● New</option>
                                <option value="Contacted">● Contacted</option>
                                <option value="In Discussion">● In Discussion</option>
                                <option value="Won">● Won</option>
                                <option value="Archived">● Archived</option>
                              </select>
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => openEnquiryModal(enq, "reply")}
                                  className="p-1.5 rounded-lg border border-[#D8E7D8] text-[#006B21] hover:bg-[#E9F8E9] transition-colors cursor-pointer"
                                  title="Direct Email Reply"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                  </svg>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => openEnquiryModal(enq, "details")}
                                  className="p-1.5 rounded-lg border border-[#D8E7D8] text-[#050505] hover:bg-[#E9F8E9] transition-colors cursor-pointer"
                                  title="View Details"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                  </svg>
                                </button>

                                <button
                                  onClick={() => handleDelete(enq.id)}
                                  className="p-1.5 rounded-lg border border-[#D8E7D8] text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                  title="Delete Lead"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Email Logs & Config View */
          <div className="space-y-6">
            {/* Email Config Card */}
            <div className="bg-white border border-[#D8E7D8] rounded-2xl p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-[#050505]">Email Notification System</h3>
                  <p className="text-xs text-[#4D5C52] mt-1">
                    When someone submits an inquiry on the website, an email is dispatched instantly to{" "}
                    <strong className="text-[#006B21]">{mailerConfig.adminEmail}</strong>.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSendTestEmail}
                    disabled={testEmailLoading}
                    className="px-4 py-2 rounded-xl bg-[#006B21] text-white text-xs font-bold hover:bg-[#10251A] disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {testEmailLoading ? "Sending Test..." : "Send Test Email"}
                  </button>
                </div>
              </div>

              {testEmailResult && (
                <div className="mt-4 p-3 rounded-xl bg-[#E9F8E9] border border-[#D8E7D8] text-xs font-bold text-[#006B21]">
                  {testEmailResult}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-[#D8E7D8] text-xs text-[#4D5C52] space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#050505]">SMTP Status:</span>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                      mailerConfig.hasSmtp ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {mailerConfig.hasSmtp ? "Configured & Live" : "Fallback Logging Mode"}
                  </span>
                </div>
                {!mailerConfig.hasSmtp && (
                  <p className="text-[11px] bg-[#F7FBF7] p-3 rounded-lg border border-[#D8E7D8]">
                    💡 <strong>Tip for live inbox delivery:</strong> In <code className="font-mono bg-white px-1">.env</code>, set your Gmail App Password:
                    <br />
                    <code className="block mt-1 font-mono text-[10px] text-[#050505]">
                      ADMIN_NOTIFICATION_EMAIL=growbroo.info@gmail.com<br />
                      SMTP_HOST=smtp.gmail.com<br />
                      SMTP_PORT=587<br />
                      SMTP_USER=growbroo.info@gmail.com<br />
                      SMTP_PASS=your-gmail-app-password
                    </code>
                  </p>
                )}
              </div>
            </div>

            {/* Email Logs Table */}
            <div className="bg-white border border-[#D8E7D8] rounded-2xl shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-[#D8E7D8] bg-[#F7FBF7]">
                <h4 className="text-sm font-black text-[#050505]">Recent Notification Logs</h4>
              </div>
              {emailLogs.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#4D5C52]">No email dispatch logs yet.</div>
              ) : (
                <div className="divide-y divide-[#D8E7D8]/60 text-xs">
                  {emailLogs.map((log) => (
                    <div key={log.id} className="p-4 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="font-bold text-[#050505] truncate">{log.subject}</div>
                        <div className="text-[#4D5C52] text-[11px] mt-0.5">
                          Sent to: <strong>{log.recipient}</strong> •{" "}
                          {new Date(log.sentAt).toLocaleString()}
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                          log.status === "sent"
                            ? "bg-green-100 text-green-800"
                            : log.status === "logged"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[100] bg-[#10251A] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#39E900]/40 flex items-center gap-3 animate-in slide-in-from-top-3 duration-200">
          <span className="w-2.5 h-2.5 rounded-full bg-[#39E900] animate-pulse" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-white/60 hover:text-white text-xs ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Professional Lead Details & Direct Email Reply Modal */}
      {selectedEnquiry && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto"
          onClick={() => setSelectedEnquiry(null)}
        >
          <div
            className="bg-white border border-[#D8E7D8] rounded-3xl p-5 sm:p-6 max-w-xl w-full shadow-2xl relative space-y-3.5 my-auto max-h-[calc(100vh-2.5rem)] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#D8E7D8]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#006B21] text-[#39E900] flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                  {selectedEnquiry.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E9F8E9] text-[#006B21] border border-[#D8E7D8]">
                      #{selectedEnquiry.id}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getStatusBadge(
                        selectedEnquiry.status
                      )}`}
                    >
                      {selectedEnquiry.status}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#050505] mt-1 tracking-tight">
                    {selectedEnquiry.name}
                  </h3>
                  {selectedEnquiry.company && (
                    <div className="text-xs font-bold text-[#4D5C52]">
                      🏢 {selectedEnquiry.company}
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="p-2 rounded-xl text-[#4D5C52] hover:text-[#050505] hover:bg-[#F7FBF7] transition-colors cursor-pointer"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Segmented Tabs: Overview vs Compose Reply */}
            <div className="flex rounded-xl bg-[#F7FBF7] p-1 border border-[#D8E7D8]">
              <button
                type="button"
                onClick={() => setModalTab("details")}
                className={`flex-1 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  modalTab === "details"
                    ? "bg-white text-[#006B21] shadow-xs"
                    : "text-[#4D5C52] hover:text-[#050505]"
                }`}
              >
                📋 Lead Overview
              </button>
              <button
                type="button"
                onClick={() => setModalTab("reply")}
                className={`flex-1 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  modalTab === "reply"
                    ? "bg-[#006B21] text-white shadow-xs"
                    : "text-[#4D5C52] hover:text-[#006B21]"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#39E900] animate-pulse" />
                <span>✉️ Direct Email Reply</span>
              </button>
            </div>

            {/* TAB 1: DETAILS OVERVIEW */}
            {modalTab === "details" && (
              <div className="space-y-3.5 animate-in fade-in duration-150 text-xs">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-2.5 p-3 bg-[#F7FBF7] rounded-2xl border border-[#D8E7D8]">
                  <div>
                    <div className="font-bold text-[#4D5C52] uppercase text-[10px]">Client Email</div>
                    <a
                      href={`mailto:${selectedEnquiry.email}`}
                      className="font-bold text-[#006B21] hover:underline text-xs truncate block"
                    >
                      {selectedEnquiry.email}
                    </a>
                  </div>
                  <div>
                    <div className="font-bold text-[#4D5C52] uppercase text-[10px]">Received On</div>
                    <div className="font-bold text-[#050505] text-xs">
                      {new Date(selectedEnquiry.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-[#4D5C52] uppercase text-[10px]">Service Requested</div>
                    <div className="font-bold text-[#050505] text-xs">{selectedEnquiry.service}</div>
                  </div>
                  <div>
                    <div className="font-bold text-[#4D5C52] uppercase text-[10px]">Budget Scope</div>
                    <div className="font-bold text-[#006B21] text-xs">{selectedEnquiry.budget}</div>
                  </div>
                </div>

                {/* Project Brief */}
                <div>
                  <div className="font-bold text-[#4D5C52] uppercase text-[10px] mb-1">
                    Project Brief / Client Message
                  </div>
                  <div className="p-3.5 bg-[#F7FBF7] rounded-2xl border border-[#D8E7D8] text-xs text-[#050505] leading-relaxed whitespace-pre-wrap max-h-36 overflow-y-auto">
                    {selectedEnquiry.message || "No message provided."}
                  </div>
                </div>

                {/* Status Selector */}
                <div>
                  <div className="font-bold text-[#4D5C52] uppercase text-[10px] mb-1">
                    Lead Status Workflow
                  </div>
                  <select
                    value={selectedEnquiry.status}
                    onChange={(e) => handleStatusChange(selectedEnquiry.id, e.target.value as EnquiryStatus)}
                    className={`w-full p-2 rounded-xl border text-xs font-bold cursor-pointer focus:outline-none ${getStatusBadge(
                      selectedEnquiry.status
                    )}`}
                  >
                    <option value="New">● New Lead</option>
                    <option value="Contacted">● Contacted (Email Sent)</option>
                    <option value="In Discussion">● In Discussion / Meeting Booked</option>
                    <option value="Won">● Won / Project Closed</option>
                    <option value="Archived">● Archived</option>
                  </select>
                </div>

                {/* Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-[#D8E7D8]">
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedEnquiry.id)}
                    className="px-3 py-1.5 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Delete Lead
                  </button>

                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${selectedEnquiry.email}?subject=Re:%20GrowBroo%20Proposal%20for%20${encodeURIComponent(
                        selectedEnquiry.name
                      )}`}
                      className="px-3 py-1.5 rounded-xl border border-[#D8E7D8] text-[#4D5C52] hover:text-[#050505] text-xs font-bold transition-colors"
                      title="Open in your default email client"
                    >
                      Open in Mail App
                    </a>
                    <button
                      type="button"
                      onClick={() => setModalTab("reply")}
                      className="px-5 py-2 rounded-full bg-[#006B21] text-white font-black text-xs hover:bg-[#10251A] hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Direct Email Reply</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: DIRECT EMAIL REPLY COMPOSER OR SUCCESS POPUP */}
            {modalTab === "reply" && (
              replySentSuccess ? (
                /* Celebratory Success Popup Card */
                <div className="py-8 px-4 text-center space-y-3.5 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#E9F8E9] border-2 border-[#39E900] text-[#006B21] flex items-center justify-center shadow-md">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-[#E9F8E9] text-[#006B21] border border-[#D8E7D8]">
                      ✓ Email Dispatched
                    </span>
                    <h4 className="text-2xl font-black text-[#050505] tracking-tight mt-2">
                      Reply Sent Successfully!
                    </h4>
                    <p className="text-xs text-[#4D5C52] max-w-xs mx-auto mt-1">
                      Your response was delivered to <strong className="text-[#006B21]">{selectedEnquiry.email}</strong>.
                    </p>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200 mt-2">
                      <span>✓ Lead status updated to &quot;Contacted&quot;</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedEnquiry(null);
                        setReplySentSuccess(false);
                      }}
                      className="px-6 py-2.5 rounded-full bg-[#006B21] text-white text-xs font-black uppercase tracking-wider hover:bg-[#10251A] shadow-md transition-all cursor-pointer flex items-center gap-1.5 mx-auto"
                    >
                      <span>Back to Leads List</span>
                      <span>→</span>
                    </button>
                    <p className="text-[10px] text-[#4D5C52] mt-2">
                      Returning to leads list automatically...
                    </p>
                  </div>
                </div>
              ) : (
                /* Email Reply Form */
                <form onSubmit={handleSendReply} className="space-y-3 animate-in fade-in duration-150 text-xs">
                  {/* Target banner */}
                  <div className="p-2.5 bg-[#E9F8E9] rounded-xl border border-[#D8E7D8] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase text-[#006B21] tracking-wider block">
                        Replying Directly To
                      </span>
                      <span className="font-bold text-[#050505] text-xs">
                        {selectedEnquiry.name} &bull; <span className="text-[#006B21]">{selectedEnquiry.email}</span>
                      </span>
                    </div>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-full font-bold text-[#4D5C52] border border-[#D8E7D8]">
                      Live Delivery
                    </span>
                  </div>

                  {/* Quick Snippets Toolbar */}
                  <div>
                    <div className="text-[10px] font-bold text-[#4D5C52] uppercase mb-1 flex items-center justify-between">
                      <span>Quick Response Templates:</span>
                      <span className="text-[#006B21] font-semibold">Click to apply</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => applyTemplate("discovery")}
                        className="px-2.5 py-1 rounded-lg bg-[#F7FBF7] border border-[#D8E7D8] text-[11px] font-bold text-[#050505] hover:bg-[#E9F8E9] hover:border-[#006B21] transition-all cursor-pointer"
                      >
                        ⚡ Discovery Call
                      </button>
                      <button
                        type="button"
                        onClick={() => applyTemplate("scope")}
                        className="px-2.5 py-1 rounded-lg bg-[#F7FBF7] border border-[#D8E7D8] text-[11px] font-bold text-[#050505] hover:bg-[#E9F8E9] hover:border-[#006B21] transition-all cursor-pointer"
                      >
                        📋 Request Scope Details
                      </button>
                      <button
                        type="button"
                        onClick={() => applyTemplate("quote")}
                        className="px-2.5 py-1 rounded-lg bg-[#F7FBF7] border border-[#D8E7D8] text-[11px] font-bold text-[#050505] hover:bg-[#E9F8E9] hover:border-[#006B21] transition-all cursor-pointer"
                      >
                        💼 Proposal Pitch
                      </button>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#050505] mb-1">
                      Email Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={replySubject}
                      onChange={(e) => setReplySubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#D8E7D8] bg-[#F7FBF7] text-xs text-[#050505] focus:outline-none focus:border-[#006B21] focus:ring-1 focus:ring-[#39E900]/25 font-medium transition-all"
                    />
                  </div>

                  {/* Message Body */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#050505] mb-1">
                      Reply Message Content
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Write your email response here..."
                      className="w-full px-3 py-2 rounded-xl border border-[#D8E7D8] bg-[#F7FBF7] text-xs text-[#050505] focus:outline-none focus:border-[#006B21] focus:ring-1 focus:ring-[#39E900]/25 transition-all resize-none leading-relaxed"
                    />
                  </div>

                  {/* Auto status checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={replyAutoStatus}
                      onChange={(e) => setReplyAutoStatus(e.target.checked)}
                      className="rounded text-[#006B21] focus:ring-[#006B21] w-4 h-4 cursor-pointer"
                    />
                    <span className="text-[11px] font-semibold text-[#4D5C52]">
                      Automatically update lead status to <strong className="text-[#006B21]">&quot;Contacted&quot;</strong> upon sending
                    </span>
                  </label>

                  {/* Feedback Notification (Error only, since success shows popup) */}
                  {replyFeedback && !replyFeedback.success && (
                    <div className="p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 bg-red-50 border border-red-200 text-red-800">
                      <span>⚠️</span>
                      <span>{replyFeedback.message}</span>
                    </div>
                  )}

                  {/* Form Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#D8E7D8]">
                    <button
                      type="button"
                      onClick={() => setModalTab("details")}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#4D5C52] hover:bg-[#F7FBF7] transition-colors cursor-pointer"
                    >
                      ← Back to Overview
                    </button>

                    <button
                      type="submit"
                      disabled={replySending}
                      className="px-6 py-2.5 rounded-full bg-[#006B21] text-white text-xs font-black uppercase tracking-wider hover:bg-[#10251A] hover:shadow-md disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2"
                    >
                      {replySending ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Sending Reply...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Email Reply</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
