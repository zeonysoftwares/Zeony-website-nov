"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Code2,
  Database,
  Layout,
  Cloud,
  Shield,
  Lightbulb,
  PenTool,
  Coffee,
  Clock,
  Presentation,
  Globe,
  Star,
  ArrowRight,
  BookOpen,
  X,
  CheckCircle2,
} from "lucide-react";
import { useAdminStore } from "@/lib/adminStore";
import { TiltCard3D } from "@/components/ui/TiltCard3D";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";
import { SplitRevealText } from "@/components/motion/SplitRevealText";

const defaultDomains = [
  { id: "int-web", name: "Web Development", icon: Code2, desc: "React, Next.js, TypeScript & Full-Stack APIs" },
  { id: "int-ai", name: "AIML And Generative AI", icon: Lightbulb, desc: "LLMs, Prompt Engineering, RAG & TensorFlow" },
  { id: "int-java", name: "Java Full Stack", icon: PenTool, desc: "Core Java, Spring Boot, Microservices & UI" },
  { id: "int-data", name: "Data Analyst", icon: Database, desc: "Python, SQL, PowerBI & Analytics Dashboards" },
  { id: "int-cyber", name: "Cyber Security", icon: Shield, desc: "Network Defense, Vulnerability Audits & SecOps" },
  { id: "int-digital", name: "Digital Marketing", icon: Globe, desc: "Technical SEO, Performance & Growth Strategy" },
  { id: "int-uiux", name: "UI/UX Design", icon: Layout, desc: "Figma, Wireframing, Prototyping & Design Systems" },
  { id: "int-cloud", name: "Cloud Computing", icon: Cloud, desc: "AWS, Azure, Docker, CI/CD & DevOps" },
];

const dayInLife = [
  { time: "09:30 AM", title: "Daily Standup", desc: "Sync with engineering mentors to align on sprint tasks and blockers.", icon: Users },
  { time: "10:00 AM", title: "Deep Build Session", desc: "Write production code, design interfaces, or run data pipelines.", icon: Code2 },
  { time: "01:00 PM", title: "Lunch & Tech Brown-Bag", desc: "Midday break with optional architectural lightning talks.", icon: Coffee },
  { time: "02:00 PM", title: "1-on-1 Code Reviews", desc: "Structured PR reviews and architecture feedback from senior engineers.", icon: Presentation },
  { time: "04:30 PM", title: "Wrap Up & Documentation", desc: "Push clean commits, update sprint boards, and log learnings.", icon: Clock },
];

const syllabusModules = [
  {
    phase: "Week 1–2: Foundations & Tooling",
    topics: ["Git branching, PR etiquette & TypeScript/language fundamentals", "Responsive architecture & API design conventions"],
  },
  {
    phase: "Week 3–4: Core Stack & Database Engineering",
    topics: ["Authentication, relational data modeling & REST/server actions", "State management, validation & error handling"],
  },
  {
    phase: "Week 5–8: Live Client / SaaS Capstone",
    topics: ["Sprint planning, feature implementation & automated checks", "Production cloud deployment, portfolio review & mock interviews"],
  },
];

export default function Internships() {
  const { items: adminInternships } = useAdminStore("internships");
  const [syllabusOpen, setSyllabusOpen] = useState(false);

  const activeDomains =
    adminInternships.length > 0
      ? adminInternships.map((d, idx) => ({
          id: defaultDomains[idx % defaultDomains.length].id,
          name: d.title,
          desc: d.desc || d.subtitle || "Practical hands-on engineering training and mentorship.",
          icon: [Code2, Lightbulb, PenTool, Database, Shield, Globe, Layout, Cloud][idx % 8],
        }))
      : defaultDomains;

  return (
    <div className="bg-background min-h-screen pt-32 pb-24 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row gap-14 items-center mb-28">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-1/2 relative z-10"
          >
            <div className="inline-block mb-5 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary font-semibold text-xs uppercase tracking-widest">
              Applications Open • 2026 Cohort
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold mb-6 tracking-tight">
              <SplitRevealText text="Launch Your" />{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
                Engineering Career
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Bridge the gap between academic fundamentals and production software delivery. Build live projects, receive senior code reviews, and graduate with a verified portfolio.
            </p>
            <div className="flex flex-wrap gap-3.5">
              <MagneticWrapper>
                <button
                  type="button"
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("open-application-modal", { detail: { type: "internship" } })
                    )
                  }
                  className="px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm sm:text-base hover:bg-primary/90 transition-all shadow-md shadow-primary/20 inline-flex items-center gap-2"
                >
                  Apply for Internship <ArrowRight className="w-4 h-4" />
                </button>
              </MagneticWrapper>
              <button
                type="button"
                onClick={() => setSyllabusOpen(true)}
                className="px-7 py-3.5 rounded-full bg-card border border-border font-semibold text-sm sm:text-base hover:bg-muted transition-colors inline-flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-primary" /> View Curriculum Syllabus
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-1/2 relative"
          >
            <TiltCard3D className="rounded-3xl group" intensity={8}>
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-border shadow-2xl bg-[#050B18]">
                <Image
                  src="/img/3d/internships-academy.jpg"
                  alt="Zeony 3D Learning & Coding Environment"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050B18]/65 to-transparent pointer-events-none" />
              </div>
            </TiltCard3D>

            <div className="mt-4 sm:mt-0 sm:absolute sm:-bottom-6 sm:-left-6 bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-lg z-20 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/15 flex items-center justify-center shrink-0">
                <Star className="w-5 h-5 text-cyan-500 fill-cyan-500" />
              </div>
              <div>
                <div className="font-bold text-base text-foreground">Top Rated</div>
                <div className="text-xs text-muted-foreground">Live Project Mentorship</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Domains Section */}
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
            Tracks
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mt-2 mb-3">
            Explore Internship Domains
          </h2>
          <p className="text-base text-muted-foreground">
            Select any domain below to start your application with that specialization pre-selected.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-28">
          {activeDomains.map((domain, i) => (
            <motion.div
              key={domain.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
            >
              <TiltCard3D className="rounded-2xl h-full group" intensity={7}>
                <button
                  type="button"
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("open-application-modal", {
                        detail: { type: "internship", domainId: domain.id },
                      })
                    )
                  }
                  className="w-full h-full p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all flex flex-col items-center text-center cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground text-primary flex items-center justify-center mb-4 transition-colors duration-300">
                    <domain.icon className="w-7 h-7" />
                  </div>
                  <span className="font-heading font-bold text-lg text-foreground mb-1.5">
                    {domain.name}
                  </span>
                  <span className="text-xs text-muted-foreground leading-relaxed mb-4">
                    {domain.desc}
                  </span>
                  <span className="mt-auto text-xs font-semibold text-primary inline-flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    Apply for track <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              </TiltCard3D>
            </motion.div>
          ))}
        </div>

        {/* Learning Path & Day in Life */}
        <div className="py-20 border-y border-border mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
                Progression
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mt-2 mb-4">
                The Zeony Learning Path
              </h2>
              <p className="text-base text-muted-foreground mb-8 leading-relaxed">
                Our structured progression moves learners from core engineering hygiene to deploying and defending production software.
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: "Phase 1: Core Engineering & Git",
                    desc: "Mastering modern syntax, clean code conventions, and collaborative version control.",
                  },
                  {
                    title: "Phase 2: Architecture & APIs",
                    desc: "Designing modular services, database schemas, and secure API contracts.",
                  },
                  {
                    title: "Phase 3: Live Production Project",
                    desc: "Shipping features alongside senior developers on real SaaS or client codebases.",
                  },
                  {
                    title: "Phase 4: Deployment & Career Readiness",
                    desc: "CI/CD cloud deployment, technical portfolio polish, and mock engineering interviews.",
                  },
                ].map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-mono font-bold text-sm text-primary shrink-0">
                      0{i + 1}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-lg mb-1 text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <TiltCard3D className="rounded-3xl group" intensity={5}>
              <div className="p-7 sm:p-8 rounded-3xl bg-card border border-border shadow-md">
                <h3 className="text-xl font-heading font-bold mb-7 text-center">
                  A Day in the Life of an Intern
                </h3>
                <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-border">
                  {dayInLife.map((item, i) => (
                    <div key={i} className="relative pl-14">
                      <div className="absolute left-5 top-0.5 -translate-x-1/2 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center z-10">
                        <item.icon className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div className="text-xs font-mono font-bold text-primary mb-0.5">
                        {item.time}
                      </div>
                      <h4 className="font-bold text-base text-foreground mb-0.5">{item.title}</h4>
                      <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TiltCard3D>
          </div>
        </div>

        {/* Registration CTA */}
        <div className="rounded-3xl bg-card border border-border p-10 lg:p-16 text-center relative overflow-hidden shadow-xs">
          <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
            Admissions Open
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mt-2 mb-4">
            Ready to accelerate your engineering journey?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Submit your application in under two minutes and choose your preferred domain and schedule.
          </p>
          <MagneticWrapper>
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("open-application-modal", { detail: { type: "internship" } })
                )
              }
              className="px-9 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Apply Now
            </button>
          </MagneticWrapper>
        </div>
      </div>

      {/* Syllabus Modal */}
      <AnimatePresence>
        {syllabusOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSyllabusOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="relative w-full max-w-lg bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl z-10"
            >
              <button
                type="button"
                aria-label="Close syllabus"
                onClick={() => setSyllabusOpen(false)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
                Curriculum Overview
              </span>
              <h3 className="text-2xl font-heading font-bold mt-1 mb-2">
                Zeony Internship Syllabus
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Flexible durations (30 days to 6 months) structured into progressive engineering sprints.
              </p>

              <div className="space-y-4 mb-7">
                {syllabusModules.map((mod) => (
                  <div
                    key={mod.phase}
                    className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2"
                  >
                    <h4 className="font-semibold text-sm text-foreground">{mod.phase}</h4>
                    {mod.topics.map((topic) => (
                      <div key={topic} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setSyllabusOpen(false);
                  window.dispatchEvent(
                    new CustomEvent("open-application-modal", { detail: { type: "internship" } })
                  );
                }}
                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Proceed to Application Form
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
