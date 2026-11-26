"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Activity, ShieldCheck, Layers, BarChart3 } from "lucide-react";

interface ProductDeviceMockup3DProps {
  title: string;
  logoSrc?: string;
  category?: string;
  compact?: boolean;
}

const presetMetrics: Record<
  string,
  { badge: string; stat1: string; label1: string; stat2: string; label2: string; bars: number[] }
> = {
  "drive logs": {
    badge: "Fleet & Academy Suite",
    stat1: "50+",
    label1: "Academies",
    stat2: "99.9%",
    label2: "Sync Uptime",
    bars: [42, 68, 56, 84, 72, 95],
  },
  "campus test": {
    badge: "AI Assessment Engine",
    stat1: "100K+",
    label1: "Examinees",
    stat2: "1M+",
    label2: "Assessments",
    bars: [58, 74, 88, 79, 92, 98],
  },
  netfra: {
    badge: "Infrastructure Telemetry",
    stat1: "50K+",
    label1: "Nodes Tracked",
    stat2: "<12ms",
    label2: "Alert Latency",
    bars: [65, 72, 69, 88, 91, 86],
  },
  fwapms: {
    badge: "Faculty Progression Suite",
    stat1: "100%",
    label1: "Audit Ready",
    stat2: "360°",
    label2: "Appraisal Flow",
    bars: [48, 62, 74, 81, 89, 94],
  },
};

export function ProductDeviceMockup3D({
  title,
  logoSrc,
  category,
  compact = false,
}: ProductDeviceMockup3DProps) {
  const key = title.toLowerCase();
  const matched =
    Object.entries(presetMetrics).find(([k]) => key.includes(k))?.[1] || {
      badge: category || "Enterprise SaaS",
      stat1: "99.9%",
      label1: "Availability",
      stat2: "24/7",
      label2: "Monitoring",
      bars: [50, 68, 62, 82, 76, 92],
    };

  return (
    <div className="relative w-full h-full bg-[#050B18] overflow-hidden flex items-center justify-center p-4 sm:p-6 select-none">
      {/* Studio Ambient Glow */}
      <div className="absolute -top-10 -right-10 w-44 h-44 bg-blue-600/25 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-cyan-500/20 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.07)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* 3D Floating Browser / Device Frame */}
      <motion.div
        whileHover={{ rotateY: -4, rotateX: 3, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 240, damping: 20 }}
        style={{ transformPerspective: 900, transformStyle: "preserve-3d" }}
        className="relative w-full max-w-[440px] rounded-2xl border border-white/15 bg-[#0B1426]/95 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)] overflow-hidden"
      >
        {/* Top Window Chrome */}
        <div className="px-3.5 py-2.5 border-b border-white/10 bg-white/[0.03] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-500/60" />
            <span className="w-2 h-2 rounded-full bg-slate-500/60" />
            <span className="w-2 h-2 rounded-full bg-slate-500/60" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400/90">
            {matched.badge}
          </span>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        </div>

        {/* Device Inner UI */}
        <div className={`${compact ? "p-3.5 space-y-3" : "p-5 space-y-4"}`}>
          {/* Brand Header */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {logoSrc ? (
                <div className="relative h-9 w-24 sm:h-10 sm:w-28 rounded-lg bg-[#070F20] border border-white/10 px-2 py-1 shrink-0 flex items-center justify-center">
                  <Image
                    src={logoSrc}
                    alt={title}
                    fill
                    sizes="112px"
                    className="object-contain p-1"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-cyan-400" />
                </div>
              )}
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-white truncate">{title}</div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-400" /> Live Cloud Workspace
                </div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-[10px] font-semibold text-blue-300 shrink-0">
              v2.4
            </span>
          </div>

          {/* Metrics & Mini Telemetry */}
          <div className="grid grid-cols-12 gap-2.5">
            <div className="col-span-5 space-y-2">
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="text-sm sm:text-base font-heading font-bold text-white leading-none">
                  {matched.stat1}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">{matched.label1}</div>
              </div>
              {!compact && (
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                  <div className="text-sm sm:text-base font-heading font-bold text-cyan-400 leading-none">
                    {matched.stat2}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">{matched.label2}</div>
                </div>
              )}
            </div>

            <div className="col-span-7 p-3 rounded-xl bg-white/[0.04] border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                <span className="flex items-center gap-1">
                  <BarChart3 className="w-3 h-3 text-blue-400" /> Performance
                </span>
                <span className="text-emerald-400 font-mono">+24%</span>
              </div>
              <div className="flex items-end gap-1.5 h-12 sm:h-16">
                {matched.bars.map((height, idx) => (
                  <div
                    key={idx}
                    style={{ height: `${height}%` }}
                    className="flex-1 rounded-t bg-gradient-to-t from-blue-600/80 to-cyan-400/90"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
