"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  Search,
  Filter,
  Download,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  RefreshCw,
  Sparkles,
  Inbox,
  User,
  ArrowUpDown,
  Check
} from "lucide-react";
import { logAdminActivity } from "@/lib/activityStore";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  course_or_service?: string | null;
  message?: string | null;
  source?: string | null;
  extra_fields?: Record<string, string>;
  status?: "new" | "in_progress" | "contacted" | "closed" | string;
  admin_notes?: string | null;
  created_at: string;
}

const LOCAL_INQUIRIES_KEY = "zeony_local_inquiries_cache";

export default function InquiriesAdminPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  // Modal inspection
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [adminNoteInput, setAdminNoteInput] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch inquiries
  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/inquiries");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setInquiries(json.data);
        if (typeof window !== "undefined") {
          localStorage.setItem(LOCAL_INQUIRIES_KEY, JSON.stringify(json.data));
        }
      } else {
        // Fallback to local storage if API returned empty/error
        const cached = localStorage.getItem(LOCAL_INQUIRIES_KEY);
        if (cached) {
          setInquiries(JSON.parse(cached));
        }
      }
    } catch {
      const cached = localStorage.getItem(LOCAL_INQUIRIES_KEY);
      if (cached) {
        setInquiries(JSON.parse(cached));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // Filtered & Searched Inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.course_or_service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.message?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || (item.status || "new").toLowerCase() === statusFilter.toLowerCase();

      const matchesSource =
        sourceFilter === "all" || (item.source || "").toLowerCase().includes(sourceFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [inquiries, searchTerm, statusFilter, sourceFilter]);

  // Status Metrics
  const stats = useMemo(() => {
    const total = inquiries.length;
    const newCount = inquiries.filter((i) => !i.status || i.status === "new").length;
    const inProgress = inquiries.filter((i) => i.status === "in_progress").length;
    const contacted = inquiries.filter((i) => i.status === "contacted").length;
    const closed = inquiries.filter((i) => i.status === "closed").length;
    return { total, newCount, inProgress, contacted, closed };
  }, [inquiries]);

  // Update Status and Notes
  const handleUpdateInquiry = async (newStatus?: string) => {
    if (!selectedInquiry) return;
    setUpdatingStatus(true);
    const targetStatus = newStatus || selectedInquiry.status || "new";

    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedInquiry.id,
          status: targetStatus,
          admin_notes: adminNoteInput,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setInquiries((prev) =>
          prev.map((i) =>
            i.id === selectedInquiry.id
              ? { ...i, status: targetStatus, admin_notes: adminNoteInput }
              : i
          )
        );
        setSelectedInquiry((prev) =>
          prev ? { ...prev, status: targetStatus, admin_notes: adminNoteInput } : null
        );
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);

        logAdminActivity(
          "Updated Inquiry",
          "inquiry",
          `Updated inquiry from ${selectedInquiry.name} to status "${targetStatus}"`
        );
      }
    } catch {
      // Offline fallback
      setInquiries((prev) =>
        prev.map((i) =>
          i.id === selectedInquiry.id
            ? { ...i, status: targetStatus, admin_notes: adminNoteInput }
            : i
        )
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Delete Inquiry
  const handleDeleteInquiry = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete inquiry from ${name}?`)) return;

    try {
      await fetch(`/api/admin/inquiries?id=${id}`, { method: "DELETE" });
      setInquiries((prev) => prev.filter((i) => i.id !== id));
      if (selectedInquiry?.id === id) {
        setIsDetailModalOpen(false);
      }
      logAdminActivity("Deleted Inquiry", "inquiry", `Deleted inquiry from ${name}`);
    } catch {
      setInquiries((prev) => prev.filter((i) => i.id !== id));
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (inquiries.length === 0) return;
    const headers = ["Name", "Email", "Phone", "Program/Service", "Status", "Source", "Message", "Admin Notes", "Date"];
    const rows = filteredInquiries.map((i) => [
      `"${(i.name || "").replace(/"/g, '""')}"`,
      `"${(i.email || "").replace(/"/g, '""')}"`,
      `"${(i.phone || "").replace(/"/g, '""')}"`,
      `"${(i.course_or_service || "").replace(/"/g, '""')}"`,
      `"${(i.status || "new").toUpperCase()}"`,
      `"${(i.source || "").replace(/"/g, '""')}"`,
      `"${(i.message || "").replace(/"/g, '""')}"`,
      `"${(i.admin_notes || "").replace(/"/g, '""')}"`,
      `"${new Date(i.created_at).toLocaleString()}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `zeony_inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#0c194b] via-[#0f2162] to-[#142978] p-6 sm:p-8 rounded-3xl border border-blue-900/40 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-500/30">
            <Inbox className="w-3.5 h-3.5" />
            <span>Customer & Student Leads</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
            Client Inquiries & Contact Leads
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Track, review, and follow up with enterprise inquiries and candidate submissions across all web forms.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={fetchInquiries}
            className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex items-center gap-2 text-xs font-semibold"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={handleExportCSV}
            disabled={filteredInquiries.length === 0}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-900/30 flex items-center gap-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl shadow-lg">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Leads</p>
          <p className="text-3xl font-black text-white font-mono mt-1">{stats.total}</p>
          <p className="text-[11px] text-slate-400 mt-1">All recorded inquiries</p>
        </div>
        <div className="bg-[#0f172a] border border-blue-900/50 p-5 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider">New Inquiries</p>
          <p className="text-3xl font-black text-blue-400 font-mono mt-1">{stats.newCount}</p>
          <p className="text-[11px] text-blue-300/70 mt-1">Needs initial response</p>
        </div>
        <div className="bg-[#0f172a] border border-amber-900/40 p-5 rounded-2xl shadow-lg">
          <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider">In Progress</p>
          <p className="text-3xl font-black text-amber-400 font-mono mt-1">{stats.inProgress}</p>
          <p className="text-[11px] text-amber-300/70 mt-1">Follow up underway</p>
        </div>
        <div className="bg-[#0f172a] border border-emerald-900/40 p-5 rounded-2xl shadow-lg">
          <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Contacted / Closed</p>
          <p className="text-3xl font-black text-emerald-400 font-mono mt-1">
            {stats.contacted + stats.closed}
          </p>
          <p className="text-[11px] text-emerald-300/70 mt-1">Addressed or completed</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, phone, message..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#09133a] border border-slate-700 focus:border-blue-500 focus:outline-none text-xs text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-[#09133a] p-1 rounded-xl border border-slate-700 text-xs">
            {["all", "new", "in_progress", "contacted", "closed"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                  statusFilter === st
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {st === "in_progress" ? "In Progress" : st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-3" />
            <p className="text-sm text-slate-400">Loading incoming inquiries...</p>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="py-20 text-center px-4">
            <Inbox className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No inquiries found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchTerm || statusFilter !== "all"
                ? "No inquiries matched your current filter criteria."
                : "New inquiries from contact forms and service modals will appear here in real time."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-[#09133a]/80 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-4 px-5">Lead / Sender</th>
                  <th className="py-4 px-5">Program / Service</th>
                  <th className="py-4 px-5">Message Preview</th>
                  <th className="py-4 px-5">Date</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredInquiries.map((inq) => {
                  const status = (inq.status || "new").toLowerCase();
                  return (
                    <tr
                      key={inq.id}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => {
                        setSelectedInquiry(inq);
                        setAdminNoteInput(inq.admin_notes || "");
                        setIsDetailModalOpen(true);
                      }}
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm shrink-0">
                            {inq.name ? inq.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">
                              {inq.name}
                            </p>
                            <p className="text-slate-400 text-[11px]">{inq.email}</p>
                            {inq.phone && <p className="text-slate-500 text-[10px]">{inq.phone}</p>}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px] font-medium">
                          {inq.course_or_service || inq.source || "General Inquiry"}
                        </span>
                      </td>

                      <td className="py-4 px-5 max-w-xs">
                        <p className="text-slate-300 truncate text-xs">
                          {inq.message || "No message body provided."}
                        </p>
                        {inq.admin_notes && (
                          <p className="text-blue-400 text-[10px] truncate mt-0.5 font-medium">
                            Note: {inq.admin_notes}
                          </p>
                        )}
                      </td>

                      <td className="py-4 px-5 text-slate-400 text-[11px] whitespace-nowrap">
                        {new Date(inq.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      <td className="py-4 px-5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                            status === "new"
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                              : status === "in_progress"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                              : status === "contacted"
                              ? "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                              : "bg-slate-700/50 text-slate-400 border border-slate-600"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              status === "new"
                                ? "bg-blue-400 animate-ping"
                                : status === "in_progress"
                                ? "bg-amber-400"
                                : status === "contacted"
                                ? "bg-teal-400"
                                : "bg-slate-400"
                            }`}
                          />
                          {status === "in_progress" ? "In Progress" : status}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div
                          className="flex items-center justify-end gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => {
                              setSelectedInquiry(inq);
                              setAdminNoteInput(inq.admin_notes || "");
                              setIsDetailModalOpen(true);
                            }}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteInquiry(inq.id, inq.name)}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Inquiry Detail & Status Modal */}
      {isDetailModalOpen && selectedInquiry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
          onClick={() => setIsDetailModalOpen(false)}
        >
          <div
            className="bg-[#0c194b] border border-blue-900/60 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative text-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-blue-900/40 pb-5">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 bg-blue-500/15 px-2.5 py-1 rounded-full border border-blue-500/30">
                  Lead Details & Action
                </span>
                <h3 className="text-xl font-bold text-white mt-2">{selectedInquiry.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Submitted on {new Date(selectedInquiry.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Contact Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#070d22] p-4 rounded-xl border border-blue-900/30">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Email Address</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white truncate">{selectedInquiry.email}</span>
                  <a
                    href={`mailto:${selectedInquiry.email}?subject=Follow-up from Zeony Technologies`}
                    className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 transition-colors"
                    title="Send Email"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="bg-[#070d22] p-4 rounded-xl border border-blue-900/30">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Phone Number</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">
                    {selectedInquiry.phone || "Not provided"}
                  </span>
                  {selectedInquiry.phone && (
                    <a
                      href={`tel:${selectedInquiry.phone}`}
                      className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/40 transition-colors"
                      title="Call Phone"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              <div className="bg-[#070d22] p-4 rounded-xl border border-blue-900/30">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Inquiry Topic</span>
                <p className="text-sm font-medium text-blue-300">
                  {selectedInquiry.course_or_service || "General Inquiry"}
                </p>
              </div>

              <div className="bg-[#070d22] p-4 rounded-xl border border-blue-900/30">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Form Source</span>
                <p className="text-sm font-medium text-indigo-300">
                  {selectedInquiry.source || "Website Contact Form"}
                </p>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider block mb-2">
                Message Body
              </span>
              <div className="bg-[#070d22] p-4 rounded-2xl border border-blue-900/40 text-sm text-slate-200 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                {selectedInquiry.message || "No message body provided."}
              </div>
            </div>

            {/* Status Selector & Admin Notes */}
            <div className="space-y-4 pt-2 border-t border-blue-900/40">
              <div>
                <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider block mb-2">
                  Update Lead Status
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "new", label: "New", color: "blue" },
                    { id: "in_progress", label: "In Progress", color: "amber" },
                    { id: "contacted", label: "Contacted", color: "teal" },
                    { id: "closed", label: "Closed", color: "slate" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleUpdateInquiry(s.id)}
                      disabled={updatingStatus}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                        selectedInquiry.status === s.id
                          ? "bg-blue-600 border-blue-400 text-white shadow-lg"
                          : "bg-[#070d22] border-slate-700 text-slate-400 hover:text-white"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider block mb-2">
                  Internal Admin Follow-up Notes
                </label>
                <textarea
                  rows={3}
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  placeholder="Record call summary, pricing discussed, or next steps..."
                  className="w-full px-4 py-3 rounded-xl bg-[#070d22] border border-blue-900/50 focus:border-blue-500 focus:outline-none text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => handleDeleteInquiry(selectedInquiry.id, selectedInquiry.name)}
                  className="px-4 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 text-xs font-semibold border border-red-500/30 transition-all flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Inquiry</span>
                </button>

                <div className="flex items-center gap-3">
                  {saveSuccess && (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Saved!
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleUpdateInquiry()}
                    disabled={updatingStatus}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
                  >
                    {updatingStatus ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
