"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Code2,
  Box,
  Handshake,
  GraduationCap,
  Briefcase,
  Calendar,
  MessageSquare,
  Image as ImageIcon,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  UserCheck,
  Inbox,
  FolderOpen,
  History,
  Search,
  ExternalLink,
  Clock,
  ArrowUpRight,
  Activity,
  Layers,
  Database
} from "lucide-react";
import { useAdminStore } from "@/lib/adminStore";
import { supabase } from "@/lib/supabase";
import { AdminTechScene3D } from "@/components/3d/AdminTechScene3D";
import { TiltCard3D } from "@/components/ui/TiltCard3D";

interface QuickApp {
  id: string;
  full_name: string;
  program_type: string;
  domain_or_track: string;
  status: string;
  created_at: string;
}

interface QuickInquiry {
  id: string;
  name: string;
  course_or_service?: string;
  source?: string;
  status?: string;
  created_at: string;
}

export default function AdminDashboard() {
  const { items: clients } = useAdminStore("clients");
  const { items: services } = useAdminStore("services");
  const { items: products } = useAdminStore("products");
  const { items: collaboration } = useAdminStore("collaboration");
  const { items: training } = useAdminStore("training");
  const { items: internships } = useAdminStore("internships");
  const { items: workshops } = useAdminStore("workshops");
  const { items: hero } = useAdminStore("hero");
  const { items: testimonials } = useAdminStore("testimonials");
  const { items: teamMembers } = useAdminStore("team_members");

  const [recentApps, setRecentApps] = useState<QuickApp[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<QuickInquiry[]>([]);
  const [totalAppsCount, setTotalAppsCount] = useState(0);
  const [pendingAppsCount, setPendingAppsCount] = useState(0);
  const [newInquiriesCount, setNewInquiriesCount] = useState(0);
  const [searchSection, setSearchSection] = useState("");

  // Fetch real-time applications & inquiries
  useEffect(() => {
    const fetchDashboardFeeds = async () => {
      // 1. Applications
      try {
        const { data: apps } = await supabase
          .from("academy_applications")
          .select("id, full_name, program_type, domain_or_track, status, created_at")
          .order("created_at", { ascending: false })
          .limit(5);

        if (apps) {
          setRecentApps(apps);
          setTotalAppsCount(apps.length);
          const pending = apps.filter(
            (a) => !a.status || a.status.toLowerCase() === "pending"
          ).length;
          setPendingAppsCount(pending);
        }
      } catch (e) {
        console.warn("Could not fetch apps for dashboard:", e);
      }

      // 2. Inquiries
      try {
        const res = await fetch("/api/admin/inquiries");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setRecentInquiries(json.data.slice(0, 5));
          const newLeads = json.data.filter(
            (i: { status?: string }) => !i.status || i.status === "new"
          ).length;
          setNewInquiriesCount(newLeads);
        }
      } catch {}
    };

    fetchDashboardFeeds();
  }, []);

  const statCards = [
    { title: "Clients & Brands (Image 2)", count: clients.length, icon: Users, href: "/admin/clients", color: "from-blue-600 to-indigo-600", desc: "Trusted innovative brand logos" },
    { title: "Training & Certifications", count: training.length, icon: GraduationCap, href: "/admin/training", color: "from-emerald-600 to-teal-600", desc: "Academy courses & initiatives" },
    { title: "Internships & Live Projects", count: internships.length, icon: Briefcase, href: "/admin/internships", color: "from-violet-600 to-purple-600", desc: "Live project internship tracks" },
    { title: "Collaborations", count: collaboration.length, icon: Handshake, href: "/admin/collaboration", color: "from-amber-600 to-orange-600", desc: "Institutional & research partners" },
    { title: "IT Services", count: services.length, icon: Code2, href: "/admin/services", color: "from-cyan-600 to-blue-600", desc: "Digital & software services" },
    { title: "Enterprise Products", count: products.length, icon: Box, href: "/admin/products", color: "from-pink-600 to-rose-600", desc: "Custom software & SaaS products" },
    { title: "Workshops & Webinars", count: workshops.length, icon: Calendar, href: "/admin/workshops", color: "from-fuchsia-600 to-purple-600", desc: "Technical sessions & events" },
    { title: "Hero Slides", count: hero.length, icon: ImageIcon, href: "/admin/hero", color: "from-red-600 to-orange-600", desc: "Homepage banner carousels" },
    { title: "Testimonials", count: testimonials.length, icon: MessageSquare, href: "/admin/testimonials", color: "from-teal-600 to-emerald-600", desc: "Client & partner feedback" },
    { title: "Team Members", count: teamMembers.length, icon: UserCheck, href: "/admin/team-members", color: "from-sky-600 to-indigo-600", desc: "Engineers, designers & mentors" }
  ];

  const filteredCards = useMemo(() => {
    if (!searchSection) return statCards;
    return statCards.filter(
      (c) =>
        c.title.toLowerCase().includes(searchSection.toLowerCase()) ||
        c.desc.toLowerCase().includes(searchSection.toLowerCase())
    );
  }, [searchSection, statCards]);

  const totalContentItems = useMemo(() => {
    return (
      clients.length +
      services.length +
      products.length +
      collaboration.length +
      training.length +
      internships.length +
      workshops.length +
      hero.length +
      testimonials.length +
      teamMembers.length
    );
  }, [
    clients,
    services,
    products,
    collaboration,
    training,
    internships,
    workshops,
    hero,
    testimonials,
    teamMembers,
  ]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 font-sans">
      {/* Welcome & Super Admin Banner with 3D Tech Core */}
      <div className="bg-gradient-to-r from-[#0c194b] via-[#10246a] to-[#162e87] border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="absolute -right-10 -top-10 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-500/30 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Super Admin Management Suite</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-heading font-extrabold text-white mb-2 tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">Super Admin</span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
            Complete executive oversight over the Zeony ecosystem. Manage customer inquiries, review candidate applications, manage digital media, and edit all website content in real time.
          </p>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/admin/applications"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Review Applications {pendingAppsCount > 0 && `(${pendingAppsCount})`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/admin/inquiries"
              className="px-4 py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 text-xs font-bold transition-all border border-indigo-500/30 flex items-center gap-2 backdrop-blur-sm"
            >
              <Inbox className="w-4 h-4" />
              <span>Client Inquiries {newInquiriesCount > 0 && `(${newInquiriesCount})`}</span>
            </Link>
            <Link
              href="/admin/media"
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 flex items-center gap-2"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Media Library</span>
            </Link>
          </div>
        </div>

        {/* Interactive 3D Crystal Core Canvas */}
        <div className="relative w-full lg:w-72 h-52 lg:h-60 shrink-0 rounded-2xl overflow-hidden flex items-center justify-center">
          <AdminTechScene3D className="w-full h-full" />
        </div>
      </div>

      {/* Primary KPI Metrics with 3D Tilt */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <TiltCard3D intensity={7} className="rounded-2xl">
          <Link
            href="/admin/applications"
            className="block h-full bg-[#0f172a] border border-slate-800 hover:border-blue-500/50 p-5 rounded-2xl shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Applications
              </span>
              <span className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </span>
            </div>
            <p className="text-3xl font-black text-white font-mono">{totalAppsCount}</p>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
              <span>Pending Review</span>
              <span className="text-amber-400 font-bold">{pendingAppsCount} pending</span>
            </div>
          </Link>
        </TiltCard3D>

        <TiltCard3D intensity={7} className="rounded-2xl">
          <Link
            href="/admin/inquiries"
            className="block h-full bg-[#0f172a] border border-slate-800 hover:border-indigo-500/50 p-5 rounded-2xl shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Client Inquiries
              </span>
              <span className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Inbox className="w-4 h-4" />
              </span>
            </div>
            <p className="text-3xl font-black text-white font-mono">{recentInquiries.length}</p>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
              <span>New Leads</span>
              <span className="text-blue-400 font-bold">{newInquiriesCount} new</span>
            </div>
          </Link>
        </TiltCard3D>

        <TiltCard3D intensity={7} className="rounded-2xl">
          <div className="h-full bg-[#0f172a] border border-slate-800 p-5 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Live Content
              </span>
              <span className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </span>
            </div>
            <p className="text-3xl font-black text-white font-mono">{totalContentItems}</p>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
              <span>Active Sections</span>
              <span className="text-emerald-400 font-bold">10 Sections</span>
            </div>
          </div>
        </TiltCard3D>

        <TiltCard3D intensity={7} className="rounded-2xl">
          <Link
            href="/admin/activity"
            className="block h-full bg-[#0f172a] border border-slate-800 hover:border-emerald-500/50 p-5 rounded-2xl shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                System Audit
              </span>
              <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </span>
            </div>
            <p className="text-lg font-bold text-white mt-1 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Operational</span>
            </p>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800">
              <span>Database Sync</span>
              <span className="text-emerald-400 font-bold">Connected</span>
            </div>
          </Link>
        </TiltCard3D>
      </div>

      {/* Two Column Layout: Recent Applications & Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications Feed */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Recent Student Applications</h3>
                  <p className="text-[11px] text-slate-400">Latest submissions awaiting decision</p>
                </div>
              </div>
              <Link
                href="/admin/applications"
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentApps.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">No student applications yet.</p>
            ) : (
              <div className="space-y-2.5">
                {recentApps.map((app) => (
                  <div
                    key={app.id}
                    className="p-3 rounded-xl bg-[#09133a]/60 border border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div>
                      <p className="text-xs font-bold text-white">{app.full_name}</p>
                      <p className="text-[11px] text-slate-400">
                        {app.domain_or_track} • {app.program_type}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          app.status === "accepted"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : app.status === "rejected"
                            ? "bg-rose-500/20 text-rose-300"
                            : "bg-amber-500/20 text-amber-300"
                        }`}
                      >
                        {app.status || "pending"}
                      </span>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {new Date(app.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Inquiries Feed */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400">
                  <Inbox className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Recent Customer Inquiries</h3>
                  <p className="text-[11px] text-slate-400">Contact submissions from website</p>
                </div>
              </div>
              <Link
                href="/admin/inquiries"
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentInquiries.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">No customer inquiries yet.</p>
            ) : (
              <div className="space-y-2.5">
                {recentInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-3 rounded-xl bg-[#09133a]/60 border border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div>
                      <p className="text-xs font-bold text-white">{inq.name}</p>
                      <p className="text-[11px] text-slate-400">
                        {inq.course_or_service || inq.source || "Website Lead"}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          inq.status === "contacted"
                            ? "bg-teal-500/20 text-teal-300"
                            : inq.status === "in_progress"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-blue-500/20 text-blue-300"
                        }`}
                      >
                        {inq.status || "new"}
                      </span>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {new Date(inq.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Website Content Overview Header & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-heading font-bold text-white flex items-center gap-2">
              <span>Website Content Sections</span>
              <span className="text-xs font-normal text-slate-400 font-mono">
                ({filteredCards.length} Sections)
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Click any section to manage items, images, and live content
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchSection}
              onChange={(e) => setSearchSection(e.target.value)}
              placeholder="Filter sections..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#09133a] border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* 10 Content Section Cards with 3D Tilt */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <TiltCard3D key={idx} intensity={5} className="rounded-2xl">
                <Link
                  href={card.href}
                  className="block h-full bg-[#0f172a] border border-slate-800 hover:border-blue-500/40 p-5 rounded-2xl shadow-lg transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-2xl font-black text-white font-mono">{card.count}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{card.desc}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-400 group-hover:text-blue-300">
                    <span>Manage Section</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </TiltCard3D>
            );
          })}
        </div>
      </div>

      {/* System Security & Synchronization Status */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 sm:p-8">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>System Synchronization & Permissions</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed max-w-3xl mb-4">
          All modifications, additions, and status changes made within the Super Admin Panel persist immediately to Supabase and cache locally in real time.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-medium text-slate-300 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Immediate Real-time Synchronization</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Encrypted Admin Authentication</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Automatic CSV Audit & Exporting</span>
          </div>
        </div>
      </div>
    </div>
  );
}
