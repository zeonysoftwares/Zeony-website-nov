"use client";

import React from "react";
import Link from "next/link";
import { 
  Users, Code2, Box, Handshake, GraduationCap, Briefcase, Calendar, 
  MessageSquare, Image as ImageIcon, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, UserCheck 
} from "lucide-react";
import { useAdminStore } from "@/lib/adminStore";

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

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0e1738] via-[#121f4e] to-[#162764] border border-blue-800/40 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-4 border border-blue-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Super Admin Management Suite</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mb-3">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Super Admin</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            You have full administrative access to add, edit, and delete any content across the Zeony website. Changes made here persist immediately in real-time.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/clients"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <span>Manage Image 2 Brands</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/admin/training"
              className="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-all border border-slate-700 flex items-center gap-2"
            >
              <span>Manage Training & Internships</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Status Stats Grid */}
      <div>
        <h2 className="text-xl font-heading font-bold text-white mb-4 flex items-center gap-2">
          <span>Website Content Overview</span>
          <span className="text-xs font-normal text-slate-400 font-mono">(Click any card to manage & delete)</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Link
                key={idx}
                href={card.href}
                className="bg-[#0f172a] border border-slate-800 hover:border-slate-700 p-6 rounded-2xl shadow-lg transition-all hover:translate-y-[-2px] hover:shadow-xl group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-white font-mono">{card.count}</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">{card.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{card.desc}</p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-400 group-hover:text-blue-300">
                  <span>Manage Section</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Instructions & System Security */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 sm:p-8">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>System Synchronization & Permissions</span>
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed max-w-3xl mb-4">
          All add and delete operations executed within this Admin Panel are instantly saved and mirrored to the user interface. When adding a new item, you can provide an image URL from your local `/img/` directory or any external image URL.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium text-slate-300 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Real-time Add/Delete functionality</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Image 2 Brand Logo management</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Training & Internship full control</span>
          </div>
        </div>
      </div>
    </div>
  );
}
