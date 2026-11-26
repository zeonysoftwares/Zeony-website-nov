"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  CheckCircle2,
  User,
  Plus,
  Minus,
  FileText,
  Code2,
  Database,
  Shield,
  Lightbulb,
  Cloud,
  Users,
  TrendingUp,
  Award,
  Globe,
  Palette,
  PenTool,
} from "lucide-react";
import { useAdminStore } from "@/lib/adminStore";
import { TiltCard3D } from "@/components/ui/TiltCard3D";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";
import { SplitRevealText } from "@/components/motion/SplitRevealText";

const defaultWorkshopTracks = [
  { id: "wks-ai", name: "AI Engineering", icon: Lightbulb, desc: "Build & deploy enterprise AI agents and RAG pipelines" },
  { id: "wks-ds", name: "Data Science", icon: Database, desc: "Applied statistics, predictive modeling & machine learning" },
  { id: "wks-da", name: "Data Analytics", icon: Database, desc: "SQL, Excel, Tableau & executive KPI visualization" },
  { id: "wks-fs", name: "Full Stack Developer", icon: Code2, desc: "Modern frontend & scalable backend systems design" },
  { id: "wks-dsa", name: "Data Structures & Algorithms", icon: PenTool, desc: "Problem solving & technical interview mastery" },
  { id: "wks-cs", name: "Cybersecurity", icon: Shield, desc: "Network defense, cryptography & vulnerability auditing" },
  { id: "wks-devops", name: "DevOps", icon: Cloud, desc: "Docker, Kubernetes, CI/CD pipelines & cloud automation" },
  { id: "wks-ml", name: "Machine Learning", icon: Lightbulb, desc: "Supervised & unsupervised model engineering" },
  { id: "wks-sql", name: "SQL & Database Design", icon: Database, desc: "Relational modeling, indexing & query optimization" },
  { id: "wks-cloud", name: "Cloud Fundamentals", icon: Cloud, desc: "AWS, Azure & GCP core infrastructure" },
  { id: "wks-hr", name: "Human Resource Analytics", icon: Users, desc: "Talent acquisition, people analytics & HR ops" },
  { id: "wks-ba", name: "Business Analytics", icon: TrendingUp, desc: "Business intelligence, strategy & market insights" },
  { id: "wks-fin", name: "Finance & Risk", icon: Award, desc: "Financial modeling, valuation & risk management" },
  { id: "wks-stock", name: "Capital Markets", icon: TrendingUp, desc: "Technical analysis & structured portfolio strategy" },
  { id: "wks-dm", name: "Digital Marketing", icon: Globe, desc: "SEO, performance campaigns & brand growth" },
  { id: "wks-psych", name: "Workplace Psychology", icon: User, desc: "Behavioral science, leadership & team EQ" },
  { id: "wks-gfx", name: "Graphics Designing", icon: Palette, desc: "Visual branding, typography & layout systems" },
  { id: "wks-med", name: "Medical Coding", icon: FileText, desc: "ICD-10, CPT coding & healthcare documentation" },
];

const curriculum = [
  {
    module: "Module 1: Foundations of Enterprise AI",
    details: "Understanding LLMs, structured prompting, evaluation metrics, and high-ROI enterprise use cases.",
  },
  {
    module: "Module 2: Data Integration & RAG",
    details: "Connecting models securely to proprietary knowledge bases using vector indexing and retrieval.",
  },
  {
    module: "Module 3: Security & Compliance",
    details: "Data privacy boundaries, hallucination mitigation, PII redaction, and operational guardrails.",
  },
  {
    module: "Module 4: Production Deployment & Cost Control",
    details: "Latency optimization, observability, caching, and reliable rollout workflows.",
  },
];

const faqs = [
  {
    q: "Who should attend Zeony corporate workshops?",
    a: "Our technical tracks are tailored for software engineers, team leads, analysts, and university cohorts seeking hands-on practical fluency.",
  },
  {
    q: "Do participants need prior AI experience?",
    a: "Basic familiarity with programming (Python or JavaScript) is helpful for engineering tracks, while foundational concepts are covered step-by-step.",
  },
  {
    q: "Will attendees receive a completion certificate?",
    a: "Yes. Every participant who completes the workshop and capstone exercises receives a verified certificate from Zeony Technologies.",
  },
];

export default function Workshops() {
  const { items: adminWorkshops } = useAdminStore("workshops");
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const activeWorkshops =
    adminWorkshops.length > 0
      ? adminWorkshops.map((w, idx) => ({
          id: w.id || `wks-${idx}`,
          name: w.title,
          desc: w.desc || w.subtitle || "Expert-led corporate workshop and skill track.",
          icon: [
            Lightbulb,
            Database,
            Code2,
            PenTool,
            Shield,
            Cloud,
            Users,
            TrendingUp,
            Award,
            Globe,
            Palette,
          ][idx % 11],
        }))
      : defaultWorkshopTracks;

  return (
    <div className="bg-background min-h-screen pt-32 pb-24 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-block mb-5 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary font-semibold text-xs uppercase tracking-widest">
            Technical & Corporate Upskilling
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold mb-6 tracking-tight">
            <SplitRevealText text="Corporate" />{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
              Workshops
            </span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Accelerate your team’s or institution’s capabilities through intensive, practitioner-led training tracks.
          </p>
        </div>

        {/* Track Grid */}
        <div className="mb-24">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-2">
              Select a Workshop Track
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Click any track to register individually or request a custom institutional session.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeWorkshops.map((track) => {
              const Icon = track.icon;
              return (
                <TiltCard3D key={track.id} className="rounded-2xl group" intensity={6}>
                  <button
                    type="button"
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent("open-application-modal", {
                          detail: { type: "workshops", domainId: track.id },
                        })
                      )
                    }
                    className="w-full h-full p-5 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer flex items-start gap-4 text-left"
                  >
                    <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-foreground text-base group-hover:text-primary transition-colors leading-tight">
                        {track.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        {track.desc}
                      </p>
                    </div>
                  </button>
                </TiltCard3D>
              );
            })}
          </div>
        </div>

        {/* Featured Masterclass */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <TiltCard3D className="rounded-3xl mb-24 group" intensity={4}>
            <div className="rounded-3xl overflow-hidden bg-card border border-border flex flex-col lg:flex-row shadow-xl">
              <div className="w-full lg:w-1/2 relative aspect-[16/10] lg:aspect-auto min-h-[340px] bg-[#050B18]">
                <Image
                  src="/img/3d/workshops-stage.jpg"
                  alt="Enterprise AI Integration Masterclass 3D Stage"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050B18]/60 to-transparent" />
              </div>

              <div className="w-full lg:w-1/2 p-8 sm:p-10 lg:p-14 flex flex-col justify-center">
                <div className="inline-block px-3.5 py-1 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-semibold text-xs uppercase tracking-wider w-max mb-4 border border-cyan-500/25">
                  Featured Masterclass
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                  Enterprise AI Integration Masterclass
                </h2>
                <p className="text-base text-muted-foreground mb-7 leading-relaxed">
                  Practical blueprint for integrating Large Language Models, RAG search, and workflow automation safely into existing software systems.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-sm">
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/40 border border-border">
                    <Calendar className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-medium">Upcoming Cohort • Register</span>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/40 border border-border">
                    <Clock className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-medium">10:00 AM – 4:00 PM IST</span>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/40 border border-border sm:col-span-2">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-medium">Hosur HQ & Live Virtual (Hybrid)</span>
                  </div>
                </div>

                <MagneticWrapper>
                  <button
                    type="button"
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent("open-application-modal", { detail: { type: "workshops" } })
                      )
                    }
                    className="px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm sm:text-base hover:bg-primary/90 transition-all inline-flex items-center justify-center gap-2 w-max group shadow-md shadow-primary/20"
                  >
                    Register Now{" "}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </MagneticWrapper>
              </div>
            </div>
          </TiltCard3D>
        </motion.div>

        {/* Curriculum & Lead Instructor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-heading font-bold">Core Curriculum</h2>
            </div>

            <div className="space-y-3.5">
              {curriculum.map((item, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl border border-border bg-card hover:border-primary/40 transition-colors"
                >
                  <h3 className="font-semibold text-base mb-1.5 text-foreground">{item.module}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.details}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <User className="w-5 h-5 text-cyan-500" />
              </div>
              <h2 className="text-2xl font-heading font-bold">Lead Instructor</h2>
            </div>

            <div className="p-7 rounded-3xl bg-card border border-border flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="w-28 h-28 rounded-2xl overflow-hidden border border-border shadow-md shrink-0 relative">
                <Image
                  src="/img/vinod.jpg"
                  alt="Vinod Kumar MM"
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold mb-1">Vinod Kumar MM</h3>
                <p className="text-primary font-semibold text-sm mb-3">
                  Chief Technology Officer, Zeony Technologies
                </p>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  Architects scalable cloud infrastructure, enterprise web applications, and applied AI integrations across Zeony’s client portfolio.
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  <span className="px-3 py-1 rounded-full bg-muted border border-border text-xs font-semibold">
                    Cloud Architecture
                  </span>
                  <span className="px-3 py-1 rounded-full bg-muted border border-border text-xs font-semibold">
                    Applied AI Systems
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-24 max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-heading font-bold mb-2">Workshop FAQs</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-border rounded-2xl bg-card overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full px-6 py-4.5 flex items-center justify-between text-left focus:outline-none gap-4"
                >
                  <span className="font-semibold text-base">{faq.q}</span>
                  {activeFaq === i ? (
                    <Minus className="w-4 h-4 text-primary shrink-0" />
                  ) : (
                    <Plus className="w-4 h-4 text-primary shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Past Workshops */}
        <div className="max-w-4xl mx-auto pt-16 border-t border-border">
          <h2 className="text-3xl font-heading font-bold mb-10 text-center">
            Past Workshops
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                date: "14 September 2025",
                title: "Software Testing Using Automation",
                speaker: "Bhuvaneshwari — Senior SWE, HCL",
              },
              {
                date: "17 October 2025",
                title: "Virtualization in Cloud Computing",
                speaker: "Sandeep R — Cloud Engineer, Sify",
              },
            ].map((event, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-colors"
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-mono font-semibold mb-3 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {event.date}
                </div>
                <h3 className="text-xl font-heading font-bold mb-2">{event.title}</h3>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-primary shrink-0" /> {event.speaker}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
