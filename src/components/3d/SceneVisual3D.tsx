"use client";

import { Cpu, Cloud, GraduationCap, Layers, Sparkles, Compass, ShieldCheck, Network } from "lucide-react";

export type SceneVisualVariant =
  | "ai-neural"
  | "cloud-mesh"
  | "training-hub"
  | "insight-architecture"
  | "insight-rag"
  | "insight-design"
  | "empowerment-beacon"
  | "about-culture-a"
  | "about-culture-b";

const configMap: Record<
  SceneVisualVariant,
  {
    label: string;
    sublabel: string;
    icon: typeof Cpu;
    accent: string;
    nodes: string[];
  }
> = {
  "ai-neural": {
    label: "Applied AI & Custom ERP",
    sublabel: "Autonomous Pipelines • RAG • Multi-Tenant SaaS",
    icon: Cpu,
    accent: "from-blue-600/30 to-cyan-500/20",
    nodes: ["LLM Core", "Workflow API", "Vector Index"],
  },
  "cloud-mesh": {
    label: "Cloud & Security Architecture",
    sublabel: "AWS • Azure • Zero-Downtime CI/CD",
    icon: Cloud,
    accent: "from-cyan-500/30 to-blue-600/20",
    nodes: ["IAM Shield", "Edge Nodes", "Auto-Scale"],
  },
  "training-hub": {
    label: "Zeony Engineering Academy",
    sublabel: "Senior Code Reviews • Live Production Labs",
    icon: GraduationCap,
    accent: "from-indigo-600/30 to-cyan-500/20",
    nodes: ["Live Sprints", "PR Reviews", "Placement"],
  },
  "insight-architecture": {
    label: "Edge & SSR Architecture",
    sublabel: "Next.js 16 • Sub-Second Hydration",
    icon: Layers,
    accent: "from-blue-600/30 to-indigo-500/20",
    nodes: ["RSC Edge", "Type-Safe API", "CDN Cache"],
  },
  "insight-rag": {
    label: "Enterprise RAG Systems",
    sublabel: "Private Knowledge Grounding • Guardrails",
    icon: Sparkles,
    accent: "from-cyan-500/30 to-blue-500/20",
    nodes: ["Embeddings", "Citations", "PII Filter"],
  },
  "insight-design": {
    label: "Precision Design Systems",
    sublabel: "Accessible Tokens • 3D Spatial Depth",
    icon: Compass,
    accent: "from-sky-500/30 to-blue-600/20",
    nodes: ["Contrast AA", "Motion Specs", "Figma Tokens"],
  },
  "empowerment-beacon": {
    label: "Next-Gen Talent Lab",
    sublabel: "Real Client Repos • Production Mentorship",
    icon: Network,
    accent: "from-blue-600/30 to-cyan-400/25",
    nodes: ["Git Workflow", "Cloud Deploy", "Career Launch"],
  },
  "about-culture-a": {
    label: "Architectural Discovery",
    sublabel: "Sprint Blueprints & System Modeling",
    icon: ShieldCheck,
    accent: "from-blue-600/30 to-sky-500/20",
    nodes: ["Specs", "Security", "QA"],
  },
  "about-culture-b": {
    label: "Continuous Delivery",
    sublabel: "Automated Pipelines & Telemetry",
    icon: Layers,
    accent: "from-cyan-500/30 to-indigo-600/20",
    nodes: ["CI/CD", "Metrics", "SLA"],
  },
};

export function SceneVisual3D({
  variant,
  className = "",
}: {
  variant: SceneVisualVariant;
  className?: string;
}) {
  const cfg = configMap[variant];
  const Icon = cfg.icon;

  return (
    <div
      className={`relative w-full h-full bg-[#050B18] overflow-hidden flex items-center justify-center p-6 select-none ${className}`}
    >
      {/* Volumetric Backdrop */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${cfg.accent} opacity-70 pointer-events-none`}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(56,189,248,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.08)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
      <div className="absolute -top-12 right-6 w-40 h-40 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />

      {/* Isometric 3D Orbital Ring + Glass Card Stack */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full border border-cyan-400/30 flex items-center justify-center relative">
            <div className="absolute inset-1.5 rounded-full border border-dashed border-blue-400/40 animate-[spin_22s_linear_infinite]" />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-[0_0_30px_rgba(37,99,235,0.55)] flex items-center justify-center border border-white/25 rotate-6 group-hover:rotate-0 transition-transform duration-500">
              <Icon className="w-7 h-7 text-white -rotate-6 group-hover:rotate-0 transition-transform duration-500" />
            </div>
          </div>
        </div>

        <div className="text-sm font-heading font-bold text-white tracking-tight">
          {cfg.label}
        </div>
        <div className="text-[11px] text-slate-300/85 mt-1 mb-4">{cfg.sublabel}</div>

        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {cfg.nodes.map((node) => (
            <span
              key={node}
              className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/15 text-[10px] font-mono text-cyan-300 backdrop-blur-md"
            >
              {node}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
