"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  GraduationCap,
  Briefcase,
  Lightbulb,
  TrendingUp,
  BookOpen,
  Calendar,
  Handshake,
  Users,
  Award,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { useAdminStore } from "@/lib/adminStore";
import { TiltCard3D } from "@/components/ui/TiltCard3D";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";
import { SplitRevealText } from "@/components/motion/SplitRevealText";
import { SceneVisual3D, type SceneVisualVariant } from "@/components/3d/SceneVisual3D";

interface TrainingItem {
  title: string;
  desc: string;
  icon: LucideIcon;
  img?: string;
  sceneVariant?: SceneVisualVariant;
}

const defaultTrainingInitiatives: TrainingItem[] = [
  {
    title: "Industry-Oriented Training & Certification",
    desc: "Structured bootcamps, technical seminars, and applied skill-building programs.",
    icon: GraduationCap,
    img: "/img/3d/workshops-stage.jpg",
  },
  {
    title: "Internship & Live Projects",
    desc: "Production exposure and guided engineering practice on real client deliverables.",
    icon: Briefcase,
    img: "/img/3d/internships-academy.jpg",
  },
  {
    title: "Technology & Innovation Support",
    desc: "Hands-on access to cloud tooling, modern repositories, and architectural guidance.",
    icon: Lightbulb,
    img: "/img/custom_software_bento.png",
  },
  {
    title: "Placement Assistance",
    desc: "End-to-end interview readiness including portfolio audits, mock interviews, and referrals.",
    icon: Users,
    sceneVariant: "empowerment-beacon",
  },
  {
    title: "Career Guidance & Employability",
    desc: "Technical communication, resume engineering, and structured career mentoring.",
    icon: TrendingUp,
    sceneVariant: "insight-design",
  },
  {
    title: "Research & Learning Initiatives",
    desc: "Collaborative applied AI research, prototyping sprints, and peer knowledge sharing.",
    icon: BookOpen,
    sceneVariant: "insight-rag",
  },
  {
    title: "Workshops, Webinars & Events",
    desc: "Interactive technical sessions and practitioner talks bridging academia and industry.",
    icon: Calendar,
    img: "/img/3d/service-web.jpg",
  },
  {
    title: "Certifications & Skill Programs",
    desc: "Verified project-assessed credentials across full-stack, cloud, and data tracks.",
    icon: Award,
    img: "/img/web_dev_bento.png",
  },
  {
    title: "Industry-Academia Collaboration",
    desc: "Institutional MoUs, faculty enablement, and campus-wide technical bootcamps.",
    icon: Handshake,
    img: "/img/3d/collaboration-network.jpg",
  },
];

const sceneVariantsCycle: SceneVisualVariant[] = [
  "training-hub",
  "ai-neural",
  "cloud-mesh",
  "empowerment-beacon",
  "insight-architecture",
  "insight-rag",
  "insight-design",
  "about-culture-a",
  "about-culture-b",
];

export default function Training() {
  const { items: adminTraining } = useAdminStore("training");

  const activeTraining: TrainingItem[] =
    adminTraining.length > 0
      ? adminTraining.map((t, idx) => {
          const fallback = defaultTrainingInitiatives[idx % defaultTrainingInitiatives.length];
          const isLegacyStock =
            !t.img ||
            t.img.includes("culture_") ||
            t.img.includes("placement_assist") ||
            t.img.includes("career_guide") ||
            t.img.includes("industry_academia") ||
            t.img.includes("workshp-webinars");

          return {
            title: t.title,
            desc: t.desc || t.subtitle || "Comprehensive professional development program.",
            icon: [
              GraduationCap,
              Briefcase,
              Lightbulb,
              Users,
              TrendingUp,
              BookOpen,
              Calendar,
              Award,
              Handshake,
            ][idx % 9],
            img: isLegacyStock ? fallback.img : t.img,
            sceneVariant: isLegacyStock
              ? fallback.sceneVariant || sceneVariantsCycle[idx % sceneVariantsCycle.length]
              : undefined,
          };
        })
      : defaultTrainingInitiatives;

  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mb-16 text-center mx-auto"
        >
          <div className="inline-block mb-5 px-4 py-1.5 rounded-full border border-border bg-card/80 text-xs font-semibold uppercase tracking-widest text-primary">
            Academic & Training
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold mb-6 tracking-tight">
            <SplitRevealText text="Empowering the" />{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
              Next Generation
            </span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our training initiatives bridge university curricula and real-world software engineering—equipping learners with verified practical skills.
          </p>
        </motion.div>

        {/* Initiatives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-24">
          {activeTraining.map((item, i) => (
            <motion.div
              key={item.title + i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <TiltCard3D className="rounded-2xl h-full group" intensity={6}>
                <div className="rounded-2xl bg-card border border-border flex flex-col hover:border-primary/40 transition-all hover:shadow-lg overflow-hidden h-full">
                  <div className="relative w-full aspect-video overflow-hidden bg-[#050B18]">
                    {item.img ? (
                      <Image
                        src={item.img}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        unoptimized
                      />
                    ) : (
                      <SceneVisual3D variant={item.sceneVariant || "training-hub"} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050B18]/65 to-transparent" />
                    <div className="absolute top-3.5 right-3.5 w-10 h-10 rounded-xl bg-background/90 backdrop-blur-md flex items-center justify-center shadow-sm border border-border z-10">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1 bg-card">
                    <h2 className="text-lg font-heading font-bold text-foreground mb-2 leading-snug">
                      {item.title}
                    </h2>
                    <p className="text-muted-foreground mb-6 flex-1 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        window.dispatchEvent(
                          new CustomEvent("open-application-modal", { detail: { type: "training" } })
                        )
                      }
                      className="w-full py-2.5 rounded-xl bg-primary/10 text-primary font-semibold text-sm text-center hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              </TiltCard3D>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="py-14 rounded-3xl bg-card border border-border px-8 lg:px-16 text-center max-w-5xl mx-auto shadow-xs">
          <h2 className="text-3xl font-heading font-bold mb-4">
            Ready to accelerate your technical skills?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join our structured training tracks and gain practical project experience guided by industry practitioners.
          </p>
          <MagneticWrapper>
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("open-application-modal", { detail: { type: "training" } })
                )
              }
              className="px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-colors inline-flex items-center gap-2 shadow-md shadow-primary/20"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </MagneticWrapper>
        </div>
      </div>
    </div>
  );
}
