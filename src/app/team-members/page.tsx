"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Palette, Cloud, GraduationCap, ShieldCheck, Layers } from "lucide-react";
import { TiltCard3D } from "@/components/ui/TiltCard3D";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";
import { SplitRevealText } from "@/components/motion/SplitRevealText";
import { defaultAdminData, useAdminStore, type AdminItem } from "@/lib/adminStore";

type Department = "all" | "engineering" | "design" | "cloud" | "academy";

interface TeamMemberProfile {
  id: string;
  initials: string;
  name: string;
  role: string;
  department: Exclude<Department, "all">;
  departmentLabel: string;
  bio: string;
  skills: string[];
  img?: string;
}

function mapDepartmentKey(label: string): Exclude<Department, "all"> {
  const lower = label.toLowerCase();
  if (lower.includes("design") || lower.includes("product") || lower.includes("brand")) return "design";
  if (lower.includes("cloud") || lower.includes("ai") || lower.includes("qa") || lower.includes("devops")) return "cloud";
  if (lower.includes("academy") || lower.includes("mentor") || lower.includes("train")) return "academy";
  return "engineering";
}

function deriveInitials(name: string, explicitIcon?: string): string {
  if (explicitIcon && explicitIcon.trim().length > 0) {
    return explicitIcon.trim().slice(0, 3).toUpperCase();
  }
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return (parts[0] || "ZM").slice(0, 2).toUpperCase();
}

function mapAdminItemToMember(item: AdminItem): TeamMemberProfile {
  const departmentLabel = item.category || "Engineering";
  return {
    id: item.id,
    initials: deriveInitials(item.title, item.icon),
    name: item.title,
    role: item.subtitle || "Team Specialist",
    department: mapDepartmentKey(departmentLabel),
    departmentLabel,
    bio: item.desc || "",
    skills: Array.isArray(item.features) ? item.features.filter(Boolean) : [],
    img: item.img || "",
  };
}

const departmentFilters: { id: Department; label: string; icon: typeof Layers }[] = [
  { id: "all", label: "All Teams", icon: Layers },
  { id: "engineering", label: "Engineering", icon: Code2 },
  { id: "design", label: "Design & Product", icon: Palette },
  { id: "cloud", label: "Cloud, AI & QA", icon: Cloud },
  { id: "academy", label: "Academy & Mentors", icon: GraduationCap },
];

export default function TeamMembersPage() {
  const { items: adminTeamMembers, isLoaded } = useAdminStore("team_members");
  const [activeDept, setActiveDept] = useState<Department>("all");

  const teamMembers = useMemo(() => {
    const source =
      isLoaded && adminTeamMembers.length > 0
        ? adminTeamMembers
        : (defaultAdminData.team_members as AdminItem[]);
    return source.map(mapAdminItemToMember);
  }, [adminTeamMembers, isLoaded]);

  const filteredMembers =
    activeDept === "all"
      ? teamMembers
      : teamMembers.filter((member) => member.department === activeDept);

  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <div className="inline-block mb-5 px-4 py-1.5 rounded-full border border-border bg-card/80 text-xs font-semibold uppercase tracking-widest text-primary">
            Our People & Units
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold mb-5 tracking-tight">
            <SplitRevealText text="Zeony" />{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
              Team Members
            </span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Meet the multidisciplinary engineering, design, cloud, and mentorship teams powering Zeony Technologies’ software delivery and academy programs.
          </p>
        </div>

        {/* Department Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-14">
          {departmentFilters.map((dept) => {
            const Icon = dept.icon;
            const isActive = activeDept === dept.id;
            return (
              <button
                key={dept.id}
                type="button"
                onClick={() => setActiveDept(dept.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all border inline-flex items-center gap-2 ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                    : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/40"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {dept.label}
              </button>
            );
          })}
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-20">
          {filteredMembers.map((member, idx) => (
            <motion.div
              key={member.id || member.name}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
            >
              <TiltCard3D className="rounded-2xl h-full group" intensity={7}>
                <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/40 shadow-xs hover:shadow-lg transition-all flex flex-col h-full">
                  <div className="flex items-center justify-between mb-5">
                    {member.img ? (
                      <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-border shadow-md">
                        <Image
                          src={member.img}
                          alt={member.name}
                          fill
                          sizes="48px"
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-cyan-500 text-white font-heading font-bold text-base flex items-center justify-center shadow-md shadow-primary/20">
                        {member.initials}
                      </div>
                    )}
                    <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
                      {member.departmentLabel}
                    </span>
                  </div>

                  <h2 className="text-lg font-heading font-bold text-foreground mb-1">
                    {member.name}
                  </h2>
                  <p className="text-xs font-semibold text-primary mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                    {member.bio}
                  </p>

                  {member.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-4 border-t border-border/60">
                      {member.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-0.5 rounded-full bg-muted border border-border text-[11px] font-medium text-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </TiltCard3D>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="max-w-5xl mx-auto p-8 sm:p-12 rounded-3xl bg-card border border-border flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary font-semibold">
              <ShieldCheck className="w-4 h-4 text-cyan-500" />
              <span>Work With Us</span>
            </div>
            <h3 className="text-2xl font-heading font-bold text-foreground">
              Looking to collaborate with our specialists or join a cohort?
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Meet our leadership team, apply for live-project internships, or start a software project.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/team"
              className="px-6 py-3 rounded-full bg-muted border border-border text-sm font-semibold hover:border-primary/50 transition-colors"
            >
              Our Leadership
            </Link>
            <MagneticWrapper>
              <Link
                href="/contact"
                className="px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
              >
                Contact Team <ArrowRight className="w-4 h-4" />
              </Link>
            </MagneticWrapper>
          </div>
        </div>
      </div>
    </div>
  );
}
