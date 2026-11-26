"use client";

import React, { useState, useMemo } from "react";
import {
  History,
  Search,
  Trash2,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  User,
  ShieldCheck,
  FileText,
  Inbox,
  Settings,
  Layers,
  Sparkles
} from "lucide-react";
import { useActivityLogs, ActivityLog } from "@/lib/activityStore";

export default function ActivityLogsPage() {
  const { logs, isLoaded, clearLogs } = useActivityLogs();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        !searchTerm ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.actor || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat =
        categoryFilter === "all" || log.category === categoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [logs, searchTerm, categoryFilter]);

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) return;
    const headers = ["Timestamp", "Action", "Category", "Description", "Actor"];
    const rows = filteredLogs.map((l) => [
      `"${new Date(l.created_at).toLocaleString()}"`,
      `"${l.action.replace(/"/g, '""')}"`,
      `"${l.category.toUpperCase()}"`,
      `"${l.description.replace(/"/g, '""')}"`,
      `"${(l.actor || "Super Admin").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `zeony_admin_activity_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "application":
        return <FileText className="w-4 h-4 text-emerald-400" />;
      case "inquiry":
        return <Inbox className="w-4 h-4 text-blue-400" />;
      case "content":
        return <Layers className="w-4 h-4 text-purple-400" />;
      case "settings":
        return <Settings className="w-4 h-4 text-amber-400" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#0c194b] via-[#10246a] to-[#152e85] p-6 sm:p-8 rounded-3xl border border-blue-900/40 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-500/30">
            <History className="w-3.5 h-3.5" />
            <span>Administrative Audit Trail</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
            System & Activity Logs
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Inspect all system operations, candidate admissions, content updates, and administrative modifications.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={handleExportCSV}
            disabled={filteredLogs.length === 0}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-900/30 flex items-center gap-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Export Logs</span>
          </button>
          <button
            onClick={() => {
              if (confirm("Are you sure you want to clear all stored activity logs?")) {
                clearLogs();
              }
            }}
            disabled={logs.length === 0}
            className="px-4 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 text-xs font-semibold border border-red-500/30 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
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
            placeholder="Search action, description, or administrator..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#09133a] border border-slate-700 focus:border-blue-500 focus:outline-none text-xs text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: "all", label: "All Logs" },
            { id: "application", label: "Applications" },
            { id: "inquiry", label: "Inquiries" },
            { id: "content", label: "Content" },
            { id: "settings", label: "Settings" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                categoryFilter === cat.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-[#09133a] text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Timeline List */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8">
        {!isLoaded ? (
          <div className="py-16 text-center text-sm text-slate-400">Loading audit log events...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-16 text-center">
            <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No activity logs found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Actions performed in this admin panel will automatically record here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-4 p-4 rounded-xl bg-[#09133a]/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="p-2.5 rounded-xl bg-[#0f172a] border border-slate-800 shrink-0 mt-0.5">
                  {getCategoryIcon(log.category)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="text-sm font-bold text-white">{log.action}</h4>
                    <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{log.description}</p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                      {log.category}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      By <strong className="text-slate-300">{log.actor || "Super Admin"}</strong>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
