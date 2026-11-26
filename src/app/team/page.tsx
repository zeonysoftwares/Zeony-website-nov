"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { TiltCard3D } from "@/components/ui/TiltCard3D";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";
import { SplitRevealText } from "@/components/motion/SplitRevealText";
import { useAdminStore, defaultAdminData, type AdminItem } from "@/lib/adminStore";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  description: string;
  focus: string[];
  image_url: string;
  initials?: string;
  linkedin_url?: string;
  whatsapp_url?: string;
};

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

export default function Team() {
  const { items: adminTeamMembers, isLoaded } = useAdminStore("team_members");

  const members: TeamMember[] = useMemo(() => {
    const source: AdminItem[] =
      isLoaded && adminTeamMembers.length > 0
        ? adminTeamMembers
        : (defaultAdminData.team_members as AdminItem[]);

    return source.map((item, idx) => {
      const isSanjay = item.title.toLowerCase().includes("sanjay");
      const isVinod = item.title.toLowerCase().includes("vinod");

      return {
        id: item.id || String(idx),
        name: item.title,
        role: item.subtitle || "Leadership & Executive",
        description: item.desc || "Executive member driving Zeony Technologies initiatives.",
        focus: Array.isArray(item.features) && item.features.length > 0
          ? item.features.filter(Boolean)
          : ["Strategic Leadership", "Innovation", "Architecture"],
        image_url: item.img || (isSanjay ? "/img/sanjay.jpg" : isVinod ? "/img/vinod.jpg" : ""),
        initials: deriveInitials(item.title, item.icon),
        linkedin_url: "https://in.linkedin.com/company/zeony-technologies29",
        whatsapp_url: "https://wa.me/916382654365",
      };
    });
  }, [adminTeamMembers, isLoaded]);

  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-block mb-5 px-4 py-1.5 rounded-full border border-border bg-card/80 text-xs font-semibold uppercase tracking-widest text-primary">
            Leadership
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-4">
            <SplitRevealText text="Our Executive Team" />
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            The founders guiding Zeony Technologies’ engineering excellence, design standards, and talent initiatives.
          </p>
        </div>

        <div className="flex flex-col gap-10 max-w-5xl mx-auto">
          {members.map((member, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <TiltCard3D className="rounded-3xl group" intensity={5}>
                  <div
                    className={`flex flex-col ${
                      isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                    } items-center gap-8 lg:gap-12 bg-card rounded-3xl p-6 sm:p-8 lg:p-10 border border-border shadow-xs hover:border-primary/40 transition-colors`}
                  >
                    {/* Content */}
                    <div className="flex-1 space-y-5">
                      <div>
                        <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm mb-2">
                          <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                          <span>{member.role}</span>
                        </div>
                        <h2 className="text-3xl font-heading font-bold text-foreground">
                          {member.name}
                        </h2>
                      </div>

                      <p className="text-muted-foreground text-base leading-relaxed">
                        {member.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {member.focus.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 rounded-full bg-muted text-xs font-semibold text-foreground border border-border"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        {member.linkedin_url && (
                          <a
                            href={member.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${member.name} LinkedIn`}
                            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                          </a>
                        )}
                        {member.whatsapp_url && (
                          <a
                            href={member.whatsapp_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Contact ${member.name} on WhatsApp`}
                            className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500 hover:text-white transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Portrait with WhatsApp circular framing or square image */}
                    <div className="w-full sm:w-80 lg:w-84 shrink-0 relative aspect-square rounded-3xl overflow-hidden border border-border shadow-md bg-card/50 flex items-center justify-center p-4">
                      {member.image_url ? (
                        <div className="relative w-full h-full rounded-2xl overflow-hidden">
                          <Image
                            src={member.image_url}
                            alt={member.name}
                            fill
                            sizes="(max-width: 640px) 100vw, 336px"
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary to-cyan-500 text-white font-heading font-black text-4xl flex items-center justify-center shadow-2xl">
                          {member.initials || "ZM"}
                        </div>
                      )}
                    </div>
                  </div>
                </TiltCard3D>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 max-w-5xl mx-auto p-8 sm:p-12 rounded-3xl bg-muted/40 border border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-heading font-bold mb-2">
              Want to collaborate with our leadership?
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base">
              Explore our academic partnerships or reach out directly for enterprise engagements.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/team-members"
              className="px-6 py-3 rounded-full bg-card border border-border text-sm font-semibold hover:border-primary/50 transition-colors"
            >
              Meet Team Members
            </Link>
            <Link
              href="/collaboration"
              className="px-6 py-3 rounded-full bg-card border border-border text-sm font-semibold hover:border-primary/50 transition-colors"
            >
              View Collaborations
            </Link>
            <MagneticWrapper>
              <Link
                href="/contact"
                className="px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
              >
                Contact Us <ArrowRight className="w-4 h-4" />
              </Link>
            </MagneticWrapper>
          </div>
        </div>
      </div>
    </div>
  );
}
