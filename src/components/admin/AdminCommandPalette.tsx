"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Home,
  Users,
  Code2,
  Box,
  Handshake,
  GraduationCap,
  Briefcase,
  Calendar,
  MessageSquare,
  Image as ImageIcon,
  UserCheck,
  Settings,
  FolderOpen,
  Inbox,
  History,
  ExternalLink,
  Command,
  ArrowRight,
  Sparkles,
  FileText
} from "lucide-react";

interface PaletteItem {
  id: string;
  name: string;
  category: "Navigation" | "Content Sections" | "Actions";
  href: string;
  icon: typeof Home;
  keywords?: string[];
  external?: boolean;
}

const PALETTE_ITEMS: PaletteItem[] = [
  // Navigation
  { id: "dash", name: "Admin Dashboard", category: "Navigation", href: "/admin", icon: Home, keywords: ["overview", "stats", "home"] },
  { id: "apps", name: "Academy Applications", category: "Navigation", href: "/admin/applications", icon: UserCheck, keywords: ["students", "interns", "admissions", "candidates"] },
  { id: "inq", name: "Inquiries & Leads", category: "Navigation", href: "/admin/inquiries", icon: Inbox, keywords: ["contact", "messages", "leads", "customers", "emails"] },
  { id: "media", name: "Media & Digital Assets", category: "Navigation", href: "/admin/media", icon: FolderOpen, keywords: ["images", "logos", "photos", "files", "uploads"] },
  { id: "audit", name: "Activity & Audit Logs", category: "Navigation", href: "/admin/activity", icon: History, keywords: ["history", "events", "logs", "security"] },
  { id: "settings", name: "Global Site Settings", category: "Navigation", href: "/admin/settings", icon: Settings, keywords: ["config", "site name", "email", "phone"] },

  // Content Sections
  { id: "clients", name: "Clients & Brands (Image 2)", category: "Content Sections", href: "/admin/clients", icon: Users, keywords: ["logos", "trusted brands", "pmc", "wise capital"] },
  { id: "services", name: "IT & Digital Services", category: "Content Sections", href: "/admin/services", icon: Code2, keywords: ["web dev", "app dev", "cloud", "offerings"] },
  { id: "products", name: "Enterprise Products & SaaS", category: "Content Sections", href: "/admin/products", icon: Box, keywords: ["drivelogs", "campustest", "erp", "cliniccare"] },
  { id: "training", name: "Training & Certifications", category: "Content Sections", href: "/admin/training", icon: GraduationCap, keywords: ["courses", "academy", "skill programs"] },
  { id: "internships", name: "Internships & Live Projects", category: "Content Sections", href: "/admin/internships", icon: Briefcase, keywords: ["web development", "aiml", "java", "data analyst"] },
  { id: "workshops", name: "Workshops & Webinars", category: "Content Sections", href: "/admin/workshops", icon: Calendar, keywords: ["events", "sessions", "topics"] },
  { id: "collab", name: "Institutional Collaborations", category: "Content Sections", href: "/admin/collaboration", icon: Handshake, keywords: ["partners", "universities", "iit madras"] },
  { id: "hero", name: "Hero Banner Carousel", category: "Content Sections", href: "/admin/hero", icon: ImageIcon, keywords: ["slides", "homepage", "banner"] },
  { id: "testimonials", name: "Testimonials & Reviews", category: "Content Sections", href: "/admin/testimonials", icon: MessageSquare, keywords: ["reviews", "feedback", "clients"] },
  { id: "team", name: "Team Members & Mentors", category: "Content Sections", href: "/admin/team-members", icon: UserCheck, keywords: ["staff", "founders", "leadership", "mentors"] },
  { id: "work", name: "Featured Work & Case Studies", category: "Content Sections", href: "/admin/featured-work", icon: Code2, keywords: ["case studies", "portfolio", "projects"] },

  // Actions
  { id: "live_site", name: "View Public Website", category: "Actions", href: "/", icon: ExternalLink, external: true, keywords: ["homepage", "public"] },
];

export function AdminCommandPalette({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else window.dispatchEvent(new CustomEvent("zeony_toggle_palette"));
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Filtered items
  const filtered = useMemo(() => {
    if (!query.trim()) return PALETTE_ITEMS;
    const q = query.toLowerCase();
    return PALETTE_ITEMS.filter((item) => {
      const matchName = item.name.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      const matchKeywords = item.keywords?.some((k) => k.toLowerCase().includes(q));
      return matchName || matchCat || matchKeywords;
    });
  }, [query]);

  // Handle keyboard selection
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === "Enter" && filtered.length > 0) {
      e.preventDefault();
      const target = filtered[selectedIndex];
      if (target) {
        onClose();
        if (target.external) {
          window.open(target.href, "_blank");
        } else {
          router.push(target.href);
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#0c194b]/95 border border-blue-500/40 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Input Bar */}
        <div className="relative border-b border-blue-900/50 p-4 sm:p-5 flex items-center gap-3">
          <Search className="w-5 h-5 text-blue-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search sections, candidate applications, leads, or media..."
            className="w-full bg-transparent border-none text-white text-sm sm:text-base placeholder:text-blue-300/40 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-900/40 border border-blue-700/50 text-[10px] font-mono text-blue-300">
            ESC
          </kbd>
        </div>

        {/* Items List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No matching pages or tools found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onClose();
                    if (item.external) {
                      window.open(item.href, "_blank");
                    } else {
                      router.push(item.href);
                    }
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 font-semibold"
                      : "text-slate-300 hover:bg-blue-900/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isSelected ? "bg-white/20 text-white" : "bg-blue-950/60 text-blue-400 border border-blue-900/40"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{item.name}</p>
                      <p className={`text-[11px] ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                        {item.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.external && <ExternalLink className="w-3.5 h-3.5 opacity-70" />}
                    {isSelected && <ArrowRight className="w-4 h-4 animate-pulse" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-[#070d22]/80 border-t border-blue-900/40 flex items-center justify-between text-[11px] text-blue-300/60 font-mono px-5">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span>Zeony Command Palette</span>
        </div>
      </div>
    </div>
  );
}
