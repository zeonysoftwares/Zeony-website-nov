"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Code,
  Smartphone,
  Layout,
  PenTool,
  Cloud,
  Mail,
  ShieldCheck,
  Plus,
  Minus,
  Calendar,
  ChevronRight,
  Award,
  Cpu,
  Globe2,
  X,
  Clock,
  BookOpen,
  ChevronDown,
  Stethoscope,
  Landmark,
  GraduationCap,
  Car,
  ShoppingBag,
  Trees,
  CheckCircle2,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { useAdminStore, type AdminItem } from "@/lib/adminStore";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { TiltCard3D } from "@/components/ui/TiltCard3D";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";
import { SplitRevealText } from "@/components/motion/SplitRevealText";
import { GsapHorizontalReveal, GsapParallax } from "@/components/motion/GsapScrollPrimitives";
import { ProductDeviceMockup3D } from "@/components/3d/ProductDeviceMockup3D";
import { SceneVisual3D, type SceneVisualVariant } from "@/components/3d/SceneVisual3D";

const HeroScene3D = dynamic(
  () => import("@/components/3d/HeroScene3D").then((m) => m.HeroScene3D),
  { ssr: false }
);

const AmbientTechCanvas = dynamic(
  () => import("@/components/3d/AmbientTechCanvas").then((m) => m.AmbientTechCanvas),
  { ssr: false }
);

interface HomeServiceItem {
  icon: LucideIcon;
  title: string;
  desc?: string;
}

interface HomeProductItem {
  title: string;
  desc?: string;
  description?: string;
  img?: string;
  image_url?: string;
  visit_link?: string;
  category?: string;
}

interface HomeTestimonialItem {
  text: string;
  author: string;
  role: string;
  img: string;
}

const defaultClientsList = [
  { src: "/img/wise-capital-logo.png", alt: "Wise Capital" },
  { src: "/img/divya-driving-logo.jpeg", alt: "Divya Driving School" },
  { src: "/img/Joyson.jpeg", alt: "Joyson Enterprises" },
  { src: "/img/pmc.jpg", alt: "PMC Tech" },
  { src: "/img/AUMM logo.png", alt: "AUMM Cloths" },
  { src: "/img/happy sunday biriyani.png", alt: "Happy Sunday Biriyani" },
  { src: "/img/ramamoorthy-nusery-logo.png", alt: "Ramamoorthy Nursery" },
  { src: "/img/ddrr-logo.jpg", alt: "DDRR Clinic" },
];

const defaultHomeServices: HomeServiceItem[] = [
  {
    icon: Layout,
    title: "Web Development",
    desc: "High-performance web applications and enterprise portals engineered with Next.js, React, and scalable cloud backends.",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    desc: "Native and cross-platform iOS and Android applications built for reliability, speed, and intuitive user engagement.",
  },
  {
    icon: PenTool,
    title: "UI/UX & Brand Design",
    desc: "Research-backed product interfaces, design systems, and cohesive brand identities tailored for modern digital businesses.",
  },
  {
    icon: Code,
    title: "Custom Enterprise Software",
    desc: "Bespoke ERP, CRM, and workflow automation platforms architected around your organization's exact operational requirements.",
  },
  {
    icon: Cloud,
    title: "AI & Cloud Consulting",
    desc: "Practical LLM integration, cloud migration, security auditing, and architecture modernization for growing teams.",
  },
  {
    icon: BookOpen,
    title: "Internships & Corporate Training",
    desc: "Structured technical mentorship, live production projects, and executive workshops empowering next-generation engineers.",
  },
];

const defaultHomeProducts: HomeProductItem[] = [
  {
    title: "Drive Logs",
    category: "Fleet & Academy Suite",
    description:
      "Comprehensive driving school management platform for scheduling, student tracking, and fleet maintenance.",
    image_url: "/img/drive-logs.png",
    visit_link: "/products",
  },
  {
    title: "Campus Test",
    category: "AI Assessment Engine",
    description:
      "Secure online examination and assessment suite tailored for universities, certifications, and competitive testing.",
    image_url: "/img/campustest.png",
    visit_link: "/products",
  },
  {
    title: "Netfra",
    category: "Infrastructure Telemetry",
    description:
      "Enterprise network infrastructure monitoring and IT asset management platform with real-time alerting.",
    image_url: "/img/netfra.png",
    visit_link: "/products",
  },
  {
    title: "FWAPMS",
    category: "Academic ERP Module",
    description:
      "Faculty Work Assessment and Progression Management System for academic appraisal, workload analytics, and compliance.",
    image_url: "/img/fwapms.png",
    visit_link: "/products",
  },
];

const defaultHomeTestimonials: HomeTestimonialItem[] = [
  {
    text: "Zeony Technologies completely transformed our clinic's digital presence with a professional website and a smooth mobile experience. The team was supportive, responsive, and delivered beyond expectations.",
    author: "Dr. M.S. Devaraj",
    role: "B.P.T Physiotherapist, DDRR Clinic",
    img: "/img/devaraj.jpg",
  },
  {
    text: "Zeony Technologies helped us bring Ramamoorthy Nursery online with a clean, user-friendly website. Their design showcases our offerings clearly and makes it easy for customers to connect with us.",
    author: "Mr. R. Rama Moorthy",
    role: "Founder & Director, Ramamoorthy Nursery",
    img: "/img/ramamoorthy.jpg",
  },
];

const insightsPosts: {
  title: string;
  date: string;
  readTime: string;
  category: string;
  visual: SceneVisualVariant;
  summary: string;
  content: string[];
}[] = [
  {
    title: "Architecting Scalable Web Platforms with Next.js",
    date: "Jul 20, 2026",
    readTime: "4 min read",
    category: "Engineering",
    visual: "insight-architecture",
    summary:
      "How hybrid rendering, edge caching, and strict TypeScript contracts allow growing startups to ship faster without sacrificing reliability.",
    content: [
      "Modern enterprise web applications demand sub-second page transitions alongside dynamic, personalized dashboards. By combining React Server Components with incremental static regeneration, engineering teams eliminate unnecessary client-side JavaScript while maintaining rich interactivity.",
      "At Zeony Technologies, every production build starts with clearly typed API boundaries, automated schema validation, and modular design systems. This discipline reduces regression defects and allows new features to ship smoothly as client traffic scales.",
    ],
  },
  {
    title: "How Applied AI Is Reshaping Corporate Upskilling",
    date: "Jul 15, 2026",
    readTime: "5 min read",
    category: "Education",
    visual: "insight-rag",
    summary:
      "Moving beyond theoretical slides: why project-based RAG and workflow automation workshops deliver measurable ROI for engineering teams.",
    content: [
      "Traditional corporate workshops often focus on syntax rather than architectural judgment. With rapid advances in large language models and developer tooling, teams need hands-on experience integrating AI safely into existing CI/CD and data pipelines.",
      "Our intensive workshops guide engineers through building retrieval-augmented workflows, evaluating prompt reliability, and implementing strict data-privacy guardrails on real business scenarios.",
    ],
  },
  {
    title: "Enterprise UI/UX Principles for High-Trust Products",
    date: "Jul 05, 2026",
    readTime: "4 min read",
    category: "Design",
    visual: "insight-design",
    summary:
      "Why visual restraint, clear typographic hierarchy, and predictable workflows outperform decorative complexity in B2B software.",
    content: [
      "Enterprise users spend hours inside operational dashboards, booking tools, and financial systems. Visual clutter and gratuitous animations slow comprehension and erode confidence.",
      "Effective product design prioritizes scannable information architecture, accessible color contrast in both light and dark themes, and responsive feedback on every critical user action.",
    ],
  },
];

const industriesList = [
  {
    icon: Stethoscope,
    title: "Healthcare & Clinics",
    desc: "Patient portals, digital appointment scheduling, and clinic operations platforms.",
  },
  {
    icon: Landmark,
    title: "Fintech & Capital Markets",
    desc: "High-trust financial dashboards, trading analytics, and secure client portals.",
  },
  {
    icon: GraduationCap,
    title: "EdTech & Universities",
    desc: "AI-proctored assessment suites, faculty progression systems, and campus platforms.",
  },
  {
    icon: Car,
    title: "Mobility & Fleet Ops",
    desc: "Training academy scheduling, student tracking, and automated fleet management.",
  },
  {
    icon: ShoppingBag,
    title: "Retail & Commerce",
    desc: "High-conversion storefronts, digital product catalogs, and inventory workflows.",
  },
  {
    icon: Trees,
    title: "Infrastructure & Telemetry",
    desc: "Real-time network monitoring, asset discovery, and automated uptime alerts.",
  },
];

const techCategories = [
  { id: "all", label: "All Stack" },
  { id: "frontend", label: "Frontend & 3D" },
  { id: "backend", label: "Backend & Data" },
  { id: "cloud", label: "Cloud & AI" },
] as const;

const techStackItems = [
  { name: "Next.js 16", category: "frontend", role: "Full-Stack React Framework" },
  { name: "React & TypeScript", category: "frontend", role: "Type-Safe UI Engineering" },
  { name: "Three.js & WebGL", category: "frontend", role: "Interactive 3D Experiences" },
  { name: "React Native", category: "frontend", role: "iOS & Android Apps" },
  { name: "Node.js", category: "backend", role: "Scalable API Services" },
  { name: "Python & FastAPI", category: "backend", role: "AI & Backend Systems" },
  { name: "PostgreSQL & Supabase", category: "backend", role: "Relational Data & Auth" },
  { name: "MongoDB", category: "backend", role: "Document Storage" },
  { name: "AWS & Azure", category: "cloud", role: "Cloud Infrastructure" },
  { name: "Docker & CI/CD", category: "cloud", role: "Containerized Delivery" },
  { name: "OpenAI & RAG", category: "cloud", role: "Applied Enterprise AI" },
  { name: "GSAP & Framer Motion", category: "frontend", role: "Precision Motion Systems" },
];

const faqs = [
  {
    question: "Do you build custom software from scratch?",
    answer:
      "Yes. We architect and develop bespoke web applications, mobile apps, and enterprise platforms tailored to your exact business workflows and security requirements.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Timelines depend on scope and integrations. Corporate websites typically launch in 2–4 weeks, while custom SaaS platforms and mobile applications take 6–14 weeks with weekly milestone demos.",
  },
  {
    question: "Do you provide ongoing support after deployment?",
    answer:
      "Yes. We offer structured maintenance and SLA support packages covering security updates, cloud monitoring, performance optimization, and iterative feature releases.",
  },
  {
    question: "How can students or graduates enroll in an internship?",
    answer:
      "You can apply directly via our Internships page or the Apply Now button in the navigation bar. Our academic team reviews applications and schedules a brief onboarding orientation.",
  },
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { items: adminHero } = useAdminStore("hero");
  const { items: adminClients } = useAdminStore("clients");
  const { items: adminServices } = useAdminStore("services");
  const { items: adminProducts } = useAdminStore("products");
  const { items: adminTestimonials } = useAdminStore("testimonials");

  const [heroIndex, setHeroIndex] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [selectedArticle, setSelectedArticle] = useState<(typeof insightsPosts)[0] | null>(null);
  const [activeTechCategory, setActiveTechCategory] = useState<string>("all");

  const activeHero = adminHero.length > 0 ? adminHero[heroIndex % adminHero.length] : null;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const clientsToDisplay =
    adminClients.length > 0
      ? adminClients.map((c) => ({ src: c.img || "/img/z-logo.jpg", alt: c.title }))
      : defaultClientsList;

  const servicesToDisplay: HomeServiceItem[] =
    adminServices.length > 0
      ? adminServices.map((s: AdminItem, idx: number) => ({
          title: s.title,
          desc: s.desc,
          icon: [Layout, Smartphone, PenTool, Code, Cloud, BookOpen][idx % 6],
        }))
      : defaultHomeServices;

  const productsToDisplay: HomeProductItem[] =
    adminProducts.length > 0
      ? adminProducts.map((p: AdminItem) => ({
          title: p.title,
          desc: p.desc,
          img: p.img,
          category: p.subtitle || p.category,
          visit_link: "/products",
        }))
      : defaultHomeProducts;

  const testimonialsToDisplay: HomeTestimonialItem[] =
    adminTestimonials.length > 0
      ? adminTestimonials.map((t: AdminItem) => ({
          text: t.desc || t.testimonialText || "",
          author: t.title || t.testimonialAuthor || "",
          role: t.subtitle || "",
          img: t.img || "/img/devaraj.jpg",
        }))
      : defaultHomeTestimonials;

  return (
    <div ref={containerRef} className="relative bg-background">
      {/* Cinematic 3D Hero Section */}
      <section className="relative min-h-[95svh] flex items-center overflow-hidden pt-28 lg:pt-36 pb-20 border-b border-border/60">
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.4]" />
          <div className="absolute -top-28 right-0 w-[680px] h-[680px] bg-primary/18 blur-[140px] rounded-full" />
          <div className="absolute bottom-0 -left-16 w-[520px] h-[520px] bg-cyan-500/12 blur-[140px] rounded-full" />
        </motion.div>

        {/* Live Interactive WebGL 3D Core Ambient Stage */}
        <div className="hidden lg:block absolute right-0 top-12 bottom-0 w-[52%] z-[1] opacity-85">
          <HeroScene3D className="w-full h-full" />
        </div>

        <div className="container relative z-10 mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            {/* Left Column */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2.5 mb-6 px-4 py-1.5 rounded-full border border-border bg-card/85 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-foreground shadow-xs"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                {activeHero
                  ? activeHero.subtitle || "Enterprise Software & Tech Academy"
                  : "Enterprise Software & Tech Academy"}
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.1rem] font-heading font-bold tracking-tight mb-6 leading-[1.06] text-foreground">
                {activeHero ? (
                  <SplitRevealText text={activeHero.title} />
                ) : (
                  <>
                    <SplitRevealText text="See the Future." />
                    <span className="block mt-1">
                      <SplitRevealText text="Build it with" delay={0.18} />{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-cyan-400">
                        Zeony.
                      </span>
                    </span>
                  </>
                )}
              </h1>

              <motion.p
                key={activeHero?.desc || "default-desc"}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="text-base sm:text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed"
              >
                {activeHero
                  ? activeHero.desc
                  : "Zeony Technologies engineers scalable enterprise software, immersive 3D web platforms, and mobile applications—while mentoring future tech leaders through industry-aligned training."}
              </motion.p>

              {adminHero.length > 1 && (
                <div className="flex items-center gap-2 mb-6">
                  {adminHero.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setHeroIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === heroIndex % adminHero.length
                          ? "w-8 bg-primary"
                          : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.32 }}
                className="flex flex-wrap items-center gap-3.5 mb-10"
              >
                <MagneticWrapper>
                  <Link
                    href="/services"
                    className="px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm sm:text-base hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center gap-2 group"
                  >
                    Explore Services
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </MagneticWrapper>
                <MagneticWrapper>
                  <Link
                    href="/contact"
                    className="px-7 py-3.5 rounded-full bg-card/85 backdrop-blur-md border border-border text-foreground font-semibold text-sm sm:text-base hover:border-primary/40 hover:bg-card transition-all flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4 text-primary" />
                    Schedule Consultation
                  </Link>
                </MagneticWrapper>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-6 border-t border-border/70 w-full text-sm text-muted-foreground font-medium"
              >
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" />
                  <span>Production-Grade QA</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-500" />
                  <span>3D, Cloud & Applied AI</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-primary" />
                  <span>Global Client Delivery</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Interactive 3D Bento Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-6 relative flex items-center justify-center lg:pl-6"
            >
              <TiltCard3D className="w-full max-w-lg rounded-3xl" intensity={9}>
                <div className="relative w-full bg-card/80 dark:bg-[#0B1426]/80 backdrop-blur-2xl border border-border/80 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-black/10 dark:shadow-black/50 group">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-semibold">
                        Zeony 3D Studio
                      </span>
                      <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground mt-0.5">
                        Empowering Businesses, Building Futures
                      </h2>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-600 dark:text-cyan-400 text-xs font-semibold shrink-0">
                      100% Delivery
                    </div>
                  </div>

                  {/* Hero 3D Core Render */}
                  <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-border/70 mb-3.5 bg-[#050B18]">
                    <Image
                      src="/img/3d/hero-core.jpg"
                      alt="Zeony 3D Technology Core"
                      fill
                      sizes="(max-width: 1024px) 100vw, 460px"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050B18]/75 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white/90">
                      <span className="font-mono uppercase tracking-wider text-cyan-300">
                        WebGL • Next.js • Cloud
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
                        Interactive 3D
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5 mb-3.5">
                    <div className="relative h-28 rounded-2xl overflow-hidden border border-border bg-[#050B18]">
                      <Image
                        src="/img/web_dev_bento.png"
                        alt="Full-Stack Engineering"
                        fill
                        sizes="220px"
                        className="object-cover"
                      />
                    </div>
                    <div className="relative h-28 rounded-2xl overflow-hidden border border-border bg-[#050B18]">
                      <Image
                        src="/img/custom_software_bento.png"
                        alt="Enterprise Analytics"
                        fill
                        sizes="220px"
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 bg-muted/50 rounded-2xl p-3 border border-border flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white overflow-hidden relative shrink-0 border border-border">
                        <Image
                          src="/img/wise-capital-logo.png"
                          alt="Wise Capital"
                          fill
                          sizes="40px"
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-foreground truncate">
                          “Exceptional digital transformation.”
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">— Wise Capital</div>
                      </div>
                    </div>
                    <div className="col-span-1 rounded-2xl border border-border bg-primary/10 flex flex-col items-center justify-center p-2.5 text-center">
                      <div className="text-lg font-heading font-bold text-primary leading-none">
                        50+
                      </div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mt-1">
                        Shipped
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard3D>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.a
            href="#trusted-brands"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="hidden lg:inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mt-10"
          >
            <span>Scroll to explore</span>
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.span>
          </motion.a>
        </div>
      </section>

      {/* Client Marquee */}
      <section
        id="trusted-brands"
        className="py-14 border-b border-border bg-card/40 overflow-hidden relative"
      >
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        <p className="text-center text-xs font-semibold text-muted-foreground mb-8 uppercase tracking-[0.2em]">
          Trusted by Growing Organizations & Institutions
        </p>

        <div className="flex overflow-hidden">
          <motion.div
            className="flex gap-10 items-center w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 38, ease: "linear", repeat: Infinity }}
          >
            {[...clientsToDisplay, ...clientsToDisplay, ...clientsToDisplay].map((client, i) => (
              <div
                key={i}
                className="relative w-32 h-16 rounded-xl bg-white border border-border/60 px-3 py-2 shadow-xs shrink-0 flex items-center justify-center hover:scale-105 transition-transform duration-300"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={client.src}
                    alt={client.alt}
                    fill
                    sizes="128px"
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Company Intro, Why Choose Us & Animated Metrics */}
      <section className="py-24 lg:py-28 border-b border-border relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
                Why Choose Zeony
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold tracking-tight">
                Precision Software Engineering Built for Long-Term Scale
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Headquartered in Hosur and serving partners globally, Zeony Technologies pairs senior software architecture with practical technical education—ensuring every platform we ship is maintainable, fast, and aligned with measurable business outcomes.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {[
                  "Clean TypeScript & Cloud Architecture",
                  "Transparent Weekly Milestone Demos",
                  "Security-First & Accessible UI/UX",
                  "Dedicated Post-Launch SLA Support",
                ].map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-2.5 p-3.5 rounded-xl bg-card border border-border text-sm font-medium text-foreground"
                  >
                    <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-5">
              {[
                { value: 50, suffix: "+", label: "Projects Delivered", sub: "Across web, mobile & SaaS" },
                { value: 500, suffix: "+", label: "Engineers Mentored", sub: "Internships & live cohorts" },
                { value: 100, suffix: "%", label: "Client Satisfaction", sub: "On-time milestone delivery" },
                { value: 15, suffix: "+", label: "Industry Partners", sub: "Enterprises & universities" },
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <TiltCard3D className="rounded-2xl h-full group" intensity={7}>
                    <div className="p-6 sm:p-7 rounded-2xl bg-card border border-border shadow-xs hover:border-primary/40 transition-colors h-full">
                      <div className="text-3xl sm:text-4xl font-heading font-bold text-primary mb-1.5">
                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                      </div>
                      <div className="text-sm font-bold text-foreground">{stat.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">{stat.sub}</div>
                    </div>
                  </TiltCard3D>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Proven Process (GSAP ScrollTrigger Stagger) */}
      <section className="py-24 lg:py-28 relative">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
              Methodology
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mt-2 mb-4">
              Our Proven Delivery Process
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              From architecture discovery to production deployment, we follow an agile, transparent engineering lifecycle.
            </p>
          </div>

          <GsapHorizontalReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: "01",
                title: "Discovery",
                desc: "We map business goals, user workflows, and technical constraints into a clear product specification.",
              },
              {
                num: "02",
                title: "Design",
                desc: "Our UI/UX team crafts wireframes, 3D interactive prototypes, and accessible design systems.",
              },
              {
                num: "03",
                title: "Engineering",
                desc: "Iterative sprints with clean TypeScript/cloud architecture, automated checks, and weekly reviews.",
              },
              {
                num: "04",
                title: "Deployment & SLA",
                desc: "Comprehensive QA, zero-downtime cloud launch, telemetry monitoring, and ongoing support.",
              },
            ].map((step) => (
              <div key={step.num} data-gsap-item>
                <TiltCard3D className="rounded-2xl h-full group" intensity={8}>
                  <div className="relative p-7 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300 h-full">
                    <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold mb-5">
                      STEP {step.num}
                    </div>
                    <h3 className="text-xl font-heading font-bold mb-2.5 text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </TiltCard3D>
              </div>
            ))}
          </GsapHorizontalReveal>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 lg:py-28 relative bg-muted/40 border-y border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
                Capabilities
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mt-2 mb-4">
                Core Engineering Expertise
              </h2>
              <p className="text-base md:text-lg text-muted-foreground">
                End-to-end digital product engineering, cloud modernization, and technical enablement.
              </p>
            </div>
            <Link
              href="/services"
              className="px-5 py-2.5 rounded-full bg-card border border-border hover:border-primary text-sm font-semibold text-foreground hover:text-primary transition-colors inline-flex items-center gap-2 self-start md:self-auto"
            >
              All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesToDisplay.slice(0, 6).map((service, i: number) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <TiltCard3D className="rounded-2xl h-full group" intensity={7}>
                  <div className="p-7 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-300 shadow-xs hover:shadow-lg flex flex-col h-full">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <service.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-heading font-bold mb-2.5 text-foreground">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                      {service.desc}
                    </p>
                    <Link
                      href="/services"
                      className="text-primary text-sm font-semibold inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all"
                    >
                      Explore capabilities <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </TiltCard3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Flagship Products with 3D Device Mockups */}
      <section className="py-24 lg:py-28 relative">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between md:items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
                Software Suite
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mt-2 mb-4">
                Flagship Products
              </h2>
              <p className="text-base md:text-lg text-muted-foreground">
                Proprietary software platforms engineered to streamline operations across specialized industries.
              </p>
            </div>
            <Link
              href="/products"
              className="px-5 py-2.5 rounded-full bg-card border border-border hover:border-primary hover:text-primary transition-colors text-sm font-semibold whitespace-nowrap self-start md:self-auto"
            >
              View All Products
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productsToDisplay.slice(0, 4).map((product, i: number) => {
              const productImg = product.img || product.image_url;
              return (
                <motion.div
                  key={product.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                >
                  <TiltCard3D className="rounded-2xl h-full group" intensity={8}>
                    <div className="overflow-hidden rounded-2xl bg-card border border-border shadow-xs flex flex-col hover:border-primary/40 hover:shadow-lg transition-all h-full">
                      <div className="w-full aspect-[16/11] relative">
                        <ProductDeviceMockup3D
                          title={product.title}
                          logoSrc={productImg}
                          category={product.category}
                          compact
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-1 bg-card">
                        <h3 className="text-xl font-heading font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                          {product.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6 leading-relaxed flex-1">
                          {product.desc || product.description}
                        </p>
                        <div className="flex flex-col gap-2.5 mt-auto">
                          <Link
                            href={product.visit_link || "/products"}
                            className="w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                          >
                            Explore Product
                          </Link>
                          <Link
                            href={`/contact?product=${encodeURIComponent(product.title)}`}
                            className="w-full py-2.5 text-center text-sm font-semibold rounded-xl border border-border bg-background hover:bg-muted text-foreground transition-colors"
                          >
                            Request a Demo
                          </Link>
                        </div>
                      </div>
                    </div>
                  </TiltCard3D>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-24 lg:py-28 relative border-t border-border bg-card/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
              Domain Focus
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mt-2 mb-4">
              Industries We Serve
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Battle-tested domain software tailored to regulatory, operational, and scale realities across six key sectors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {industriesList.map((ind, idx) => (
              <motion.div
                key={ind.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <TiltCard3D className="rounded-2xl h-full group" intensity={6}>
                  <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-md transition-all h-full">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <ind.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-heading font-bold mb-2 text-foreground">
                      {ind.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{ind.desc}</p>
                  </div>
                </TiltCard3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Tech Stack */}
      <section className="py-24 relative border-y border-border overflow-hidden bg-muted/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
                Modern Engineering Stack
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mt-2">
                Technologies We Master
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {techCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveTechCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors border ${
                    activeTechCategory === cat.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {techStackItems
              .filter(
                (item) => activeTechCategory === "all" || item.category === activeTechCategory
              )
              .map((tech) => (
                <motion.div
                  layout
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className="p-4 rounded-2xl bg-card border border-border hover:border-primary/40 transition-colors flex items-center gap-3.5"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-foreground truncate">{tech.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{tech.role}</div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* Education & Empowerment */}
      <section className="py-24 lg:py-28 relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
                Zeony Academy
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mt-2 mb-5">
                Empowering the Next Generation of Engineers
              </h2>
              <p className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed">
                Through structured internships, certification tracks, and corporate workshops, learners gain hands-on production experience guided by practicing software architects.
              </p>
              <ul className="space-y-3.5 mb-9">
                {[
                  "Live Production Projects & Senior Code Reviews",
                  "Industry-Recognized Technical Certifications",
                  "Resume, Portfolio & Placement Readiness",
                  "Applied AI, Full-Stack & Cloud Curriculum",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-base font-medium text-foreground">
                    <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3.5">
                <MagneticWrapper>
                  <Link
                    href="/internships"
                    className="px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all inline-block"
                  >
                    Explore Internships
                  </Link>
                </MagneticWrapper>
                <Link
                  href="/workshops"
                  className="px-6 py-3 rounded-full bg-card border border-border hover:bg-muted hover:border-primary/40 transition-all text-sm font-semibold"
                >
                  Upcoming Workshops
                </Link>
              </div>
            </motion.div>

            <GsapParallax speed={-6}>
              <TiltCard3D className="max-w-md mx-auto rounded-3xl group" intensity={8}>
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-border shadow-2xl bg-[#050B18]">
                  <SceneVisual3D variant="empowerment-beacon" />
                  <div className="absolute bottom-6 left-6 right-6 z-20">
                    <div className="p-5 rounded-2xl backdrop-blur-md bg-card/95 border border-border shadow-lg">
                      <div className="text-3xl font-heading font-bold text-primary mb-1">
                        <AnimatedCounter value={500} suffix="+" />
                      </div>
                      <div className="text-sm text-foreground font-semibold">
                        Students & Professionals Mentored
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard3D>
            </GsapParallax>
          </div>
        </div>
      </section>

      {/* Insights & News */}
      <section className="py-24 lg:py-28 relative bg-muted/40 border-y border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
                Perspectives
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mt-2 mb-3">
                Latest Engineering Insights
              </h2>
              <p className="text-base md:text-lg text-muted-foreground">
                Technical notes and perspectives from our software engineering and training teams.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {insightsPosts.map((post, i) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setSelectedArticle(post)}
                className="cursor-pointer h-full"
              >
                <TiltCard3D className="rounded-2xl h-full group" intensity={7}>
                  <div className="flex flex-col h-full rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all">
                    <div className="aspect-video bg-[#050B18] border-b border-border relative overflow-hidden">
                      <SceneVisual3D variant={post.visual} />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 font-medium">
                        <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                          {post.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> {post.date}
                        </span>
                      </div>
                      <h3 className="text-lg font-heading font-bold mb-2.5 text-foreground group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                        {post.summary}
                      </p>
                      <div className="mt-auto pt-3 border-t border-border/60 flex items-center text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                        Read Article <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </TiltCard3D>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 lg:py-28 relative">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
              Client Outcomes
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mt-2 mb-4">
              Partner Testimonials
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Verified feedback from organizations and leaders partnering with Zeony Technologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonialsToDisplay.map((testi, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <TiltCard3D className="rounded-2xl h-full group" intensity={6}>
                  <div className="p-8 rounded-2xl bg-card border border-border shadow-xs hover:shadow-md hover:border-primary/30 transition-all flex flex-col justify-between h-full">
                    <div>
                      <div className="flex gap-1 mb-5 text-amber-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-base text-foreground/85 mb-8 leading-relaxed">
                        “{testi.text}”
                      </p>
                    </div>
                    <div className="flex items-center gap-4 pt-4 border-t border-border/60">
                      <div className="w-12 h-12 rounded-full overflow-hidden relative shrink-0 border border-border bg-muted">
                        <Image
                          src={testi.img}
                          alt={testi.author}
                          fill
                          sizes="48px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-foreground">{testi.author}</div>
                        <div className="text-xs text-muted-foreground">{testi.role}</div>
                      </div>
                    </div>
                  </div>
                </TiltCard3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 lg:py-28 relative bg-muted/40 border-y border-border">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <div className="text-center mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
              Common Questions
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mt-2 mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-base">
              Key details about our software engagement model, timelines, and training programs.
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-border rounded-2xl bg-card overflow-hidden transition-colors hover:border-primary/30"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full px-6 py-4.5 flex items-center justify-between text-left focus:outline-none gap-4"
                >
                  <span className="font-semibold text-base text-foreground">{faq.question}</span>
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
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Ambient 3D Particles */}
      <section className="py-24 lg:py-28 relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-4xl mx-auto rounded-3xl bg-[#050B18] text-white border border-white/15 p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
            <AmbientTechCanvas className="absolute inset-0 z-0 opacity-80" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[480px] h-[240px] bg-blue-600/25 blur-[100px] rounded-full pointer-events-none" />
            <div className="relative z-10">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
                Start a Conversation
              </span>
              <h2 className="text-3xl md:text-5xl font-heading font-bold mt-3 mb-5 text-white">
                Ready to build your next platform?
              </h2>
              <p className="text-base md:text-lg text-slate-300 mb-9 max-w-2xl mx-auto">
                Partner with Zeony Technologies for production-grade software engineering, 3D digital experiences, and technical consulting.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <MagneticWrapper>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 group"
                  >
                    Start a Project
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </MagneticWrapper>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white/10 border border-white/20 text-white font-semibold text-base hover:bg-white/15 transition-colors"
                >
                  View Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Reader Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="relative w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[88vh] flex flex-col"
            >
              <div className="relative h-56 w-full shrink-0 bg-[#050B18]">
                <SceneVisual3D variant={selectedArticle.visual} />
                <button
                  type="button"
                  aria-label="Close article"
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black/80 flex items-center justify-center transition-colors z-20"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-4 left-6 right-6 flex items-center gap-3 text-xs text-white/90 font-medium z-20">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground font-semibold">
                    {selectedArticle.category}
                  </span>
                  <span>{selectedArticle.date}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {selectedArticle.readTime}
                  </span>
                </div>
              </div>

              <div
                data-lenis-prevent
                className="p-6 sm:p-8 overflow-y-auto overscroll-contain custom-scrollbar space-y-4"
              >
                <h3 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
                  {selectedArticle.title}
                </h3>
                <p className="text-base font-medium text-foreground/90 leading-relaxed">
                  {selectedArticle.summary}
                </p>
                {selectedArticle.content.map((para, idx) => (
                  <p key={idx} className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {para}
                  </p>
                ))}
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Published by Zeony Engineering Desk
                  </span>
                  <Link
                    href="/contact"
                    onClick={() => setSelectedArticle(null)}
                    className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Discuss this topic <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
