"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Enquiry, EnquiryStatus, EmailLog } from "@/lib/types";

export default function AdminDashboardPage() {
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
    adminEmail: "aman@growbroo.com",
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [serviceFilter, setServiceFilter] = useState<string>("All");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"leads" | "emails">("leads");

  const fetchEnquiries = async () => {
    try {
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

  useEffect(() => {
    fetchEnquiries();
    // Auto-poll every 15 seconds so new inquiries show up live
    const interval = setInterval(fetchEnquiries, 15000);
    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className="min-h-screen bg-[#F7FBF7] text-[#050505]">
      {/* Top Navbar */}
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
              <span>Export CSV</span>
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

            <Link
              href="/"
              className="text-xs font-bold text-[#4D5C52] hover:text-[#006B21] px-2 py-1 transition-colors"
            >
              View Site →
            </Link>
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
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#4D5C52]">Email Delivery</div>
            <div className="text-sm font-bold text-[#050505] mt-2 flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${mailerConfig.hasSmtp ? "bg-[#39E900]" : "bg-amber-400"}`} />
              <span className="truncate">{mailerConfig.adminEmail}</span>
            </div>
            <div className="text-[11px] text-[#4D5C52] mt-1">
              {mailerConfig.hasSmtp ? "Live SMTP Active" : "Logged in console (Ready for SMTP)"}
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
                                onClick={() => setSelectedEnquiry(enq)}
                                className="text-xs text-[#4D5C52] line-clamp-2 cursor-pointer hover:text-[#050505]"
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
                                <a
                                  href={`mailto:${enq.email}?subject=Re:%20GrowBroo%20Proposal%20for%20${encodeURIComponent(
                                    enq.name
                                  )}`}
                                  className="p-1.5 rounded-lg border border-[#D8E7D8] text-[#006B21] hover:bg-[#E9F8E9] transition-colors"
                                  title="Reply via Email"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                  </svg>
                                </a>

                                <button
                                  onClick={() => setSelectedEnquiry(enq)}
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
                    💡 <strong>Tip for live inbox delivery:</strong> Create a <code className="font-mono bg-white px-1">.env.local</code> file in project root with your SMTP settings (e.g. Gmail App Password or Resend/SendGrid):
                    <br />
                    <code className="block mt-1 font-mono text-[10px] text-[#050505]">
                      ADMIN_NOTIFICATION_EMAIL=your-email@gmail.com<br />
                      SMTP_HOST=smtp.gmail.com<br />
                      SMTP_PORT=587<br />
                      SMTP_USER=your-email@gmail.com<br />
                      SMTP_PASS=your-app-password
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

      {/* Lead Details Modal */}
      {selectedEnquiry && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          onClick={() => setSelectedEnquiry(null)}
        >
          <div
            className="bg-white border border-[#D8E7D8] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#E9F8E9] text-[#006B21] border border-[#D8E7D8]">
                  Enquiry ID: {selectedEnquiry.id}
                </span>
                <h3 className="text-2xl font-black text-[#050505] mt-2 tracking-tight">
                  {selectedEnquiry.name}
                </h3>
                {selectedEnquiry.company && (
                  <div className="text-xs font-bold text-[#4D5C52]">🏢 {selectedEnquiry.company}</div>
                )}
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-2 rounded-full text-[#4D5C52] hover:text-[#050505] hover:bg-gray-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-[#F7FBF7] rounded-xl border border-[#D8E7D8]">
                <div>
                  <div className="font-bold text-[#4D5C52] uppercase text-[10px]">Email Address</div>
                  <a
                    href={`mailto:${selectedEnquiry.email}`}
                    className="font-bold text-[#006B21] hover:underline"
                  >
                    {selectedEnquiry.email}
                  </a>
                </div>
                <div>
                  <div className="font-bold text-[#4D5C52] uppercase text-[10px]">Received On</div>
                  <div className="font-bold text-[#050505]">
                    {new Date(selectedEnquiry.createdAt).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="font-bold text-[#4D5C52] uppercase text-[10px]">Service Requested</div>
                  <div className="font-bold text-[#050505]">{selectedEnquiry.service}</div>
                </div>
                <div>
                  <div className="font-bold text-[#4D5C52] uppercase text-[10px]">Budget Scope</div>
                  <div className="font-bold text-[#006B21]">{selectedEnquiry.budget}</div>
                </div>
              </div>

              <div>
                <div className="font-bold text-[#4D5C52] uppercase text-[10px] mb-1">Project Brief / Message</div>
                <div className="p-4 bg-[#F7FBF7] rounded-xl border border-[#D8E7D8] text-sm text-[#050505] leading-relaxed whitespace-pre-wrap">
                  {selectedEnquiry.message || "No message provided."}
                </div>
              </div>

              <div>
                <div className="font-bold text-[#4D5C52] uppercase text-[10px] mb-1">Update Status</div>
                <select
                  value={selectedEnquiry.status}
                  onChange={(e) => handleStatusChange(selectedEnquiry.id, e.target.value as EnquiryStatus)}
                  className={`w-full p-2.5 rounded-xl border text-xs font-bold cursor-pointer focus:outline-none ${getStatusBadge(
                    selectedEnquiry.status
                  )}`}
                >
                  <option value="New">● New</option>
                  <option value="Contacted">● Contacted</option>
                  <option value="In Discussion">● In Discussion</option>
                  <option value="Won">● Won</option>
                  <option value="Archived">● Archived</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#D8E7D8]">
              <a
                href={`mailto:${selectedEnquiry.email}?subject=Re:%20GrowBroo%20Proposal%20for%20${encodeURIComponent(
                  selectedEnquiry.name
                )}`}
                className="px-5 py-2.5 rounded-full bg-[#006B21] text-white font-bold text-xs hover:bg-[#10251A] transition-colors"
              >
                Reply via Email →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
