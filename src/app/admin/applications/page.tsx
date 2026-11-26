"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import {
  Loader2,
  Mail,
  Phone,
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  Search,
  Download,
  Filter,
  Eye,
  Trash2,
  RefreshCw,
  Building,
  GraduationCap,
  MapPin,
  Sparkles,
  UserCheck,
  Send
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { logAdminActivity } from "@/lib/activityStore";

interface Application {
  id: string;
  program_type: string;
  domain_or_track: string;
  duration: string;
  expected_joining_date: string;
  full_name: string;
  email: string;
  phone: string;
  dob: string;
  residential_address: string;
  institution_name: string;
  degree_and_dept: string;
  current_year: string;
  cgpa_or_percentage: string;
  passport_photo_url: string;
  status: string;
  created_at: string;
}

export default function ApplicationsAdminPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");

  // Inspection modal
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Status Change Modal
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusTargetApp, setStatusTargetApp] = useState<Application | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [customMessage, setCustomMessage] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchApplications = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("academy_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications from database.");
    } else {
      setApplications(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Filtered applications
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        !searchTerm ||
        app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.institution_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.degree_and_dept?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.domain_or_track?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || (app.status || "pending").toLowerCase() === statusFilter.toLowerCase();

      const matchesProgram =
        programFilter === "all" ||
        (app.program_type || "").toLowerCase().includes(programFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesProgram;
    });
  }, [applications, searchTerm, statusFilter, programFilter]);

  // Metrics
  const stats = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter((a) => !a.status || a.status.toLowerCase() === "pending").length;
    const accepted = applications.filter((a) => a.status?.toLowerCase() === "accepted").length;
    const rejected = applications.filter((a) => a.status?.toLowerCase() === "rejected").length;
    return { total, pending, accepted, rejected };
  }, [applications]);

  // Open Status modal
  const openStatusModal = (app: Application, status: string) => {
    setStatusTargetApp(app);
    setNewStatus(status);
    setCustomMessage(
      status === "accepted"
        ? `Dear ${app.full_name},\n\nCongratulations! We are delighted to inform you that your application for ${app.program_type} (${app.domain_or_track}) at Zeony Academy has been APPROVED.\n\nOur team will contact you regarding onboarding details.`
        : `Dear ${app.full_name},\n\nThank you for applying for ${app.program_type} at Zeony Academy. After reviewing your profile, we regret to inform you that we cannot proceed with your application at this time.`
    );
    setIsStatusModalOpen(true);
  };

  // Submit status update & email
  const handleUpdateStatus = async () => {
    if (!statusTargetApp) return;

    setIsUpdatingStatus(true);
    try {
      const response = await fetch("/api/applications/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: statusTargetApp.id,
          status: newStatus,
          message: customMessage,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Application marked as ${newStatus} and email notification sent!`);
        setApplications((apps) =>
          apps.map((app) => (app.id === statusTargetApp.id ? { ...app, status: newStatus } : app))
        );
        if (selectedApp?.id === statusTargetApp.id) {
          setSelectedApp((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        logAdminActivity(
          "Updated Candidate Status",
          "application",
          `Marked application from ${statusTargetApp.full_name} (${statusTargetApp.program_type}) as ${newStatus}`
        );
      } else {
        toast.error(data.message || "Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("An error occurred while updating status.");
    } finally {
      setIsUpdatingStatus(false);
      setIsStatusModalOpen(false);
      setStatusTargetApp(null);
    }
  };

  // Delete Application
  const handleDeleteApp = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete application from ${name}?`)) return;

    try {
      const { error } = await supabase.from("academy_applications").delete().eq("id", id);
      if (error) {
        toast.error("Failed to delete application.");
      } else {
        toast.success("Application deleted.");
        setApplications((prev) => prev.filter((a) => a.id !== id));
        if (selectedApp?.id === id) setIsDetailModalOpen(false);
        logAdminActivity("Deleted Application", "application", `Deleted application from ${name}`);
      }
    } catch {
      toast.error("Error connecting to database.");
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (applications.length === 0) return;
    const headers = [
      "Full Name",
      "Email",
      "Phone",
      "Program Type",
      "Domain/Track",
      "Institution",
      "Degree & Department",
      "Year",
      "CGPA/%",
      "Duration",
      "Joining Date",
      "Address",
      "Status",
      "Applied On",
    ];

    const rows = filteredApps.map((a) => [
      `"${(a.full_name || "").replace(/"/g, '""')}"`,
      `"${(a.email || "").replace(/"/g, '""')}"`,
      `"${(a.phone || "").replace(/"/g, '""')}"`,
      `"${(a.program_type || "").replace(/"/g, '""')}"`,
      `"${(a.domain_or_track || "").replace(/"/g, '""')}"`,
      `"${(a.institution_name || "").replace(/"/g, '""')}"`,
      `"${(a.degree_and_dept || "").replace(/"/g, '""')}"`,
      `"${(a.current_year || "").replace(/"/g, '""')}"`,
      `"${(a.cgpa_or_percentage || "").replace(/"/g, '""')}"`,
      `"${(a.duration || "").replace(/"/g, '""')}"`,
      `"${(a.expected_joining_date || "").replace(/"/g, '""')}"`,
      `"${(a.residential_address || "").replace(/"/g, '""')}"`,
      `"${(a.status || "pending").toUpperCase()}"`,
      `"${new Date(a.created_at).toLocaleDateString()}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `zeony_applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 font-sans">
      <Toaster position="top-right" />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#0c194b] via-[#112368] to-[#172e85] p-6 sm:p-8 rounded-3xl border border-blue-900/40 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-500/30">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Academy Admissions Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
            Academy Student & Intern Applications
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Review admissions, inspect student records, verify academic credentials, and dispatch official acceptance decisions.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={fetchApplications}
            className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex items-center gap-2 text-xs font-semibold"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={handleExportCSV}
            disabled={filteredApps.length === 0}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-900/30 flex items-center gap-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl shadow-lg">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Applicants</p>
          <p className="text-3xl font-black text-white font-mono mt-1">{stats.total}</p>
          <p className="text-[11px] text-slate-400 mt-1">Across all tracks</p>
        </div>
        <div className="bg-[#0f172a] border border-amber-900/50 p-5 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Pending Review</p>
          <p className="text-3xl font-black text-amber-400 font-mono mt-1">{stats.pending}</p>
          <p className="text-[11px] text-amber-300/70 mt-1">Awaiting decision</p>
        </div>
        <div className="bg-[#0f172a] border border-emerald-900/50 p-5 rounded-2xl shadow-lg">
          <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Accepted</p>
          <p className="text-3xl font-black text-emerald-400 font-mono mt-1">{stats.accepted}</p>
          <p className="text-[11px] text-emerald-300/70 mt-1">Approved & notified</p>
        </div>
        <div className="bg-[#0f172a] border border-rose-900/50 p-5 rounded-2xl shadow-lg">
          <p className="text-xs font-semibold text-rose-300 uppercase tracking-wider">Rejected</p>
          <p className="text-3xl font-black text-rose-400 font-mono mt-1">{stats.rejected}</p>
          <p className="text-[11px] text-rose-300/70 mt-1">Declined applications</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidate, college, email, domain..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#09133a] border border-slate-700 focus:border-blue-500 focus:outline-none text-xs text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-[#09133a] p-1 rounded-xl border border-slate-700 text-xs">
            {["all", "pending", "accepted", "rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                  statusFilter === tab
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Program filter */}
          <select
            value={programFilter}
            onChange={(e) => setProgramFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#09133a] border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Programs</option>
            <option value="internship">Internships</option>
            <option value="training">Training</option>
            <option value="workshop">Workshops</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
            <p className="text-sm text-slate-400">Loading student applications...</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="py-20 text-center px-4">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No applications found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchTerm || statusFilter !== "all" || programFilter !== "all"
                ? "No applications matched your search filters."
                : "When students apply on the website, they will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-[#09133a]/80 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-4 px-5">Candidate</th>
                  <th className="py-4 px-5">Program & Domain</th>
                  <th className="py-4 px-5">College & Degree</th>
                  <th className="py-4 px-5">Applied Date</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredApps.map((app) => {
                  const status = (app.status || "pending").toLowerCase();
                  return (
                    <tr
                      key={app.id}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => {
                        setSelectedApp(app);
                        setIsDetailModalOpen(true);
                      }}
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          {app.passport_photo_url ? (
                            <Image
                              src={app.passport_photo_url}
                              alt={app.full_name}
                              width={40}
                              height={40}
                              unoptimized
                              className="w-10 h-10 rounded-full object-cover border border-blue-900/50 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm shrink-0">
                              {app.full_name ? app.full_name.charAt(0).toUpperCase() : "A"}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">
                              {app.full_name}
                            </p>
                            <p className="text-slate-400 text-[11px]">{app.email}</p>
                            {app.phone && <p className="text-slate-500 text-[10px]">{app.phone}</p>}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold">
                          {app.domain_or_track}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {app.program_type} • {app.duration}
                        </p>
                      </td>

                      <td className="py-4 px-5 max-w-xs">
                        <p className="text-white font-medium truncate">{app.institution_name}</p>
                        <p className="text-slate-400 text-[11px] truncate">
                          {app.degree_and_dept} ({app.current_year})
                        </p>
                        {app.cgpa_or_percentage && (
                          <span className="text-emerald-400 text-[10px] font-bold">
                            Score: {app.cgpa_or_percentage}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-5 text-slate-400 text-[11px] whitespace-nowrap">
                        {new Date(app.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      <td className="py-4 px-5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            status === "accepted"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              : status === "rejected"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              status === "accepted"
                                ? "bg-emerald-400"
                                : status === "rejected"
                                ? "bg-rose-400"
                                : "bg-amber-400 animate-ping"
                            }`}
                          />
                          {status}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div
                          className="flex items-center justify-end gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => {
                              setSelectedApp(app);
                              setIsDetailModalOpen(true);
                            }}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Inspect Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {status !== "accepted" && (
                            <button
                              onClick={() => openStatusModal(app, "accepted")}
                              className="p-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-400 transition-colors"
                              title="Accept & Notify"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {status !== "rejected" && (
                            <button
                              onClick={() => openStatusModal(app, "rejected")}
                              className="p-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-rose-400 transition-colors"
                              title="Reject Application"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteApp(app.id, app.full_name)}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                            title="Delete Application"
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

      {/* Candidate Profile Inspector Modal */}
      {isDetailModalOpen && selectedApp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
          onClick={() => setIsDetailModalOpen(false)}
        >
          <div
            className="bg-[#0c194b] border border-blue-900/60 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative text-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-blue-900/40 pb-5">
              <div className="flex items-center gap-4">
                {selectedApp.passport_photo_url ? (
                  <Image
                    src={selectedApp.passport_photo_url}
                    alt={selectedApp.full_name}
                    width={56}
                    height={56}
                    unoptimized
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500/50 shadow-lg"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold text-xl">
                    {selectedApp.full_name ? selectedApp.full_name.charAt(0).toUpperCase() : "A"}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedApp.full_name}</h3>
                  <p className="text-xs text-blue-300">
                    {selectedApp.domain_or_track} ({selectedApp.program_type})
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Applied on {new Date(selectedApp.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#070d22] p-4 rounded-xl border border-blue-900/30">
                <span className="text-slate-400 block mb-1 font-semibold">Email & Phone</span>
                <p className="text-white font-medium">{selectedApp.email}</p>
                <p className="text-slate-300">{selectedApp.phone || "No phone"}</p>
              </div>

              <div className="bg-[#070d22] p-4 rounded-xl border border-blue-900/30">
                <span className="text-slate-400 block mb-1 font-semibold">Date of Birth & Address</span>
                <p className="text-white font-medium">DOB: {selectedApp.dob || "N/A"}</p>
                <p className="text-slate-300 truncate">{selectedApp.residential_address || "N/A"}</p>
              </div>

              <div className="bg-[#070d22] p-4 rounded-xl border border-blue-900/30">
                <span className="text-slate-400 block mb-1 font-semibold">College / University</span>
                <p className="text-white font-medium">{selectedApp.institution_name}</p>
                <p className="text-slate-300">{selectedApp.degree_and_dept}</p>
              </div>

              <div className="bg-[#070d22] p-4 rounded-xl border border-blue-900/30">
                <span className="text-slate-400 block mb-1 font-semibold">Year & Score</span>
                <p className="text-white font-medium">Year: {selectedApp.current_year}</p>
                <p className="text-emerald-400 font-bold">
                  CGPA / %: {selectedApp.cgpa_or_percentage || "N/A"}
                </p>
              </div>

              <div className="bg-[#070d22] p-4 rounded-xl border border-blue-900/30">
                <span className="text-slate-400 block mb-1 font-semibold">Duration & Joining Date</span>
                <p className="text-white font-medium">Duration: {selectedApp.duration}</p>
                <p className="text-blue-300">Expected: {selectedApp.expected_joining_date || "Immediate"}</p>
              </div>

              <div className="bg-[#070d22] p-4 rounded-xl border border-blue-900/30">
                <span className="text-slate-400 block mb-1 font-semibold">Current Status</span>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    selectedApp.status === "accepted"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : selectedApp.status === "rejected"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  }`}
                >
                  {selectedApp.status || "pending"}
                </span>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-blue-900/40">
              <button
                onClick={() => handleDeleteApp(selectedApp.id, selectedApp.full_name)}
                className="px-4 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 text-xs font-semibold border border-red-500/30 transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    openStatusModal(selectedApp, "rejected");
                  }}
                  className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold border border-rose-500/40 transition-all"
                >
                  Reject Candidate
                </button>
                <button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    openStatusModal(selectedApp, "accepted");
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Accept & Send Offer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decision Email Notification Modal */}
      {isStatusModalOpen && statusTargetApp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsStatusModalOpen(false)}
        >
          <div
            className="bg-[#0c194b] border border-blue-900/60 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 text-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-blue-900/40 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {newStatus === "accepted" ? "Approve Application" : "Decline Application"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Applicant: <strong className="text-white">{statusTargetApp.full_name}</strong> (
                  {statusTargetApp.email})
                </p>
              </div>
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider block mb-2">
                Custom Email Notification Message
              </label>
              <textarea
                rows={6}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#070d22] border border-blue-900/50 focus:border-blue-500 focus:outline-none text-xs text-white leading-relaxed"
              />
              <p className="text-[11px] text-slate-400 mt-1.5">
                This message will be dispatched directly to the candidate&apos;s email address.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-blue-900/40">
              <button
                type="button"
                onClick={() => setIsStatusModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateStatus}
                disabled={isUpdatingStatus}
                className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-all flex items-center gap-2 ${
                  newStatus === "accepted"
                    ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30"
                    : "bg-rose-600 hover:bg-rose-500 shadow-rose-600/30"
                } shadow-lg`}
              >
                {isUpdatingStatus ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>{isUpdatingStatus ? "Sending Notification..." : `Confirm & Send ${newStatus}`}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
