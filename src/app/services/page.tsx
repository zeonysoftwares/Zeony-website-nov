"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code,
  Smartphone,
  Layout,
  Cpu,
  Cloud,
  Settings,
  Layers,
  Database,
  BarChart,
  PenTool,
  Plus,
  Minus,
  ArrowRight,
  CheckCircle2,
  Award,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useAdminStore, type AdminItem } from "@/lib/adminStore";
import { TiltCard3D } from "@/components/ui/TiltCard3D";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";
import { SplitRevealText } from "@/components/motion/SplitRevealText";
import { SceneVisual3D, type SceneVisualVariant } from "@/components/3d/SceneVisual3D";

interface SubServiceItem {
  name: string;
  detail: string;
}

interface ServiceItem {
  title: string;
  icon: LucideIcon;
  desc?: string;
  img?: string;
  sceneVariant?: SceneVisualVariant;
  subServices?: SubServiceItem[];
}

const defaultServicesList: ServiceItem[] = [
  {
    title: "Web Development",
    icon: Layout,
    desc: "Modern, high-performance web applications and enterprise portals engineered with Next.js, React, and scalable cloud backends.",
    img: "/img/3d/service-web.jpg",
    subServices: [
      { name: "Frontend Engineering", detail: "Accessible, responsive interfaces built with React, Next.js, and TypeScript." },
      { name: "Backend Architecture", detail: "Resilient REST/GraphQL APIs and databases with Node.js, Python, and PostgreSQL." },
      { name: "E-Commerce Platforms", detail: "Conversion-focused storefronts with secure payment gateways and inventory sync." },
      { name: "CMS & Admin Portals", detail: "Tailored editorial and operational dashboards for streamlined content control." },
    ],
  },
  {
    title: "App Development",
    icon: Smartphone,
    desc: "Native and cross-platform iOS and Android applications designed for intuitive mobile usability and dependable performance.",
    img: "/img/3d/service-mobile.jpg",
    subServices: [
      { name: "Cross-Platform Apps", detail: "Single-codebase React Native & Flutter applications for iOS and Android." },
      { name: "Native iOS & Android", detail: "Platform-specific Swift and Kotlin experiences when hardware integration demands it." },
      { name: "Mobile UI/UX Design", detail: "Interfaces aligned with Apple HIG and Material Design accessibility standards." },
      { name: "Store Deployment & ASO", detail: "App Store and Google Play release management, telemetry, and updates." },
    ],
  },
  {
    title: "UI/UX & Brand Design",
    icon: PenTool,
    desc: "Research-backed product interfaces, component systems, and visual identities that elevate brand trust and conversion.",
    img: "/img/3d/service-uiux.jpg",
    subServices: [
      { name: "User Research & Flows", detail: "Information architecture and journey mapping centered around real user needs." },
      { name: "Wireframing & Prototyping", detail: "Interactive Figma prototypes validated with stakeholders before engineering begins." },
      { name: "Brand Identity Systems", detail: "Logos, typography, color tokens, and comprehensive brand guidelines." },
      { name: "Marketing Collateral", detail: "Digital campaign graphics, pitch decks, and product launch assets." },
    ],
  },
  {
    title: "Customized Software & AI",
    icon: Code,
    desc: "Bespoke ERP, CRM, and AI-assisted workflow platforms tailored to automate complex operational bottlenecks.",
    sceneVariant: "ai-neural",
    subServices: [
      { name: "Enterprise Systems", detail: "Custom ERP, CRM, and scheduling suites tailored to organizational workflows." },
      { name: "SaaS Product Engineering", detail: "Multi-tenant SaaS architecture from MVP validation through enterprise scale." },
      { name: "Applied AI & LLMs", detail: "Practical RAG search, document automation, and intelligent assistant integrations." },
      { name: "API & Legacy Modernization", detail: "Bridging third-party services and upgrading aging systems without downtime." },
    ],
  },
  {
    title: "Tech & Cloud Consulting",
    icon: Cpu,
    desc: "Architectural reviews, cloud migrations, and security audits ensuring your infrastructure scales reliably and securely.",
    sceneVariant: "cloud-mesh",
    subServices: [
      { name: "Cloud Migration", detail: "Structured migrations to AWS, Azure, or GCP with automated CI/CD pipelines." },
      { name: "Security & Code Audits", detail: "Vulnerability assessments, dependency audits, and access-control hardening." },
      { name: "Architecture Strategy", detail: "Pragmatic technical roadmaps aligned with product budgets and growth targets." },
      { name: "Digital Marketing & SEO", detail: "Technical SEO, analytics instrumentation, and performance growth strategies." },
    ],
  },
  {
    title: "Training, Internships & Workshops",
    icon: Award,
    desc: "Hands-on corporate upskilling, university collaborations, and live-project internships led by practicing engineers.",
    sceneVariant: "training-hub",
    subServices: [
      { name: "Full-Stack Bootcamps", detail: "Project-driven training in React, Next.js, Java, Python, and cloud tooling." },
      { name: "Corporate Workshops", detail: "Focused intensives on AI engineering, DevOps, and modern web architecture." },
      { name: "Live Project Mentorship", detail: "Guided code reviews, Git workflows, and production deployment practice." },
      { name: "Placement Readiness", detail: "Technical interview coaching, portfolio reviews, and career guidance." },
    ],
  },
];

const iconMap: Record<string, LucideIcon> = {
  Code,
  Smartphone,
  Layout,
  Cpu,
  Cloud,
  Settings,
  Layers,
  Database,
  BarChart,
  PenTool,
  Users,
};

const defaultCaseStudies = [
  {
    client: "Ramamoorthy Nursery",
    category: "Web Design & Digital Catalog",
    img: "/img/ramamoorthy-nusery-logo.png",
    result: "200% increase in online customer inquiries within 3 months.",
    summary:
      "Designed and launched a responsive digital catalog and inquiry platform that streamlined plant discovery and wholesale quote requests.",
    highlights: ["Mobile-first catalog UX", "Direct WhatsApp & email lead routing", "Sub-second page load performance"],
  },
  {
    client: "DDRR Clinic",
    category: "Healthcare Digital Transformation",
    img: "/img/ddrr-logo.jpg",
    result: "Streamlined patient appointment booking, reducing admin time by 40%.",
    summary:
      "Built a modern clinic web presence paired with structured patient scheduling and mobile-accessible service information.",
    highlights: ["Automated appointment workflows", "Accessible clinic portal", "40% reduction in manual reception coordination"],
  },
  {
    client: "Wise Capital",
    category: "Fintech Platform & UI/UX",
    img: "/img/wise-capital-logo.png",
    result: "Launched a secure financial portal supporting 10k+ active users.",
    summary:
      "Engineered a high-trust client portal and analytical interface prioritizing data clarity, responsive layouts, and robust security.",
    highlights: ["Role-based portal architecture", "Real-time portfolio insights", "Hardened authentication & audit logging"],
  },
];

const faqs = [
  {
    q: "What is your typical project timeline for web and app development?",
    a: "A focused corporate website typically delivers in 2–4 weeks, while custom SaaS platforms or mobile applications take 6–14 weeks with transparent weekly milestone reviews.",
  },
  {
    q: "Do you build custom software from scratch or rely on rigid templates?",
    a: "We engineer custom software tailored to your operational workflows using modern stacks like Next.js, React, Node.js, Python, and cloud-native databases.",
  },
  {
    q: "How do your internships and corporate workshops work?",
    a: "Participants work directly with senior engineers on real-world repositories, architecture reviews, and structured modules bridging academic theory and production delivery.",
  },
  {
    q: "Do you provide post-launch maintenance and SLA support?",
    a: "Yes. We offer ongoing maintenance covering dependency updates, security patching, cloud monitoring, and iterative feature enhancements.",
  },
  {
    q: "Can you help modernize or migrate legacy systems to the cloud?",
    a: "Yes. Our consulting team performs architecture audits and executes phased migrations to AWS, Azure, or GCP without disrupting active operations.",
  },
];

export default function Services() {
  const { items: adminServices } = useAdminStore("services");
  const { items: adminCaseStudies } = useAdminStore("case_studies");
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [selectedStudy, setSelectedStudy] = useState<(typeof defaultCaseStudies)[0] | null>(null);

  const activeServices: ServiceItem[] =
    adminServices.length > 0
      ? adminServices.map((s: AdminItem, idx: number) => {
          const defMatch = defaultServicesList.find(
            (d) =>
              d.title.toLowerCase() === s.title.toLowerCase() ||
              d.title.toLowerCase().includes(s.title.toLowerCase())
          );
          const isLegacyLocalImg = s.img?.startsWith("/img/") && !s.img.startsWith("/img/3d/");
          return {
            title: s.title,
            desc: s.desc || defMatch?.desc,
            img: isLegacyLocalImg ? defMatch?.img : s.img || defMatch?.img,
            sceneVariant: defMatch?.sceneVariant || (["ai-neural", "cloud-mesh", "training-hub"][idx % 3] as SceneVisualVariant),
            icon:
              defMatch?.icon ||
              (s.icon ? iconMap[s.icon] : undefined) ||
              [Layout, Smartphone, PenTool, Code, Cloud, Cpu, Database, Layers][idx % 8],
            subServices:
              s.subServices && s.subServices.length > 0
                ? s.subServices
                : defMatch?.subServices || [
                    {
                      name: "Strategy & Discovery",
                      detail: "Requirements scoping, technical architecture, and delivery roadmap.",
                    },
                    {
                      name: "Custom Implementation",
                      detail: "Production engineering adhering to modern security and QA standards.",
                    },
                  ],
          };
        })
      : defaultServicesList;

  const activeCaseStudies =
    adminCaseStudies.length > 0
      ? adminCaseStudies.map((cs, idx) => {
          const defMatch = defaultCaseStudies[idx % defaultCaseStudies.length];
          return {
            client: cs.client || cs.title || "Client Partner",
            category: cs.category || cs.subtitle || "Technology",
            img: cs.img || "/img/ramamoorthy-nusery-logo.png",
            result: cs.result || cs.desc || "Measurable digital transformation delivered.",
            summary: defMatch.summary,
            highlights: defMatch.highlights,
          };
        })
      : defaultCaseStudies;

  return (
    <div className="bg-background min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mb-20"
        >
          <div className="inline-block mb-5 px-4 py-1.5 rounded-full border border-border bg-card/80 text-xs font-semibold uppercase tracking-widest text-primary">
            What We Do
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold mb-6 tracking-tight">
            <SplitRevealText text="Transformative" />{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
              Digital Services
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            We partner with ambitious businesses and institutions to architect, design, build, and scale dependable software products.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-28">
          {activeServices.map((service, idx) => {
            const Icon = service.icon || Code;
            return (
              <motion.div
                key={service.title + idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <TiltCard3D className="rounded-3xl h-full group" intensity={6}>
                  <div className="rounded-3xl bg-card border border-border overflow-hidden flex flex-col shadow-xs hover:shadow-lg hover:border-primary/40 transition-all h-full">
                    <div className="relative w-full aspect-[21/10] bg-[#050B18] overflow-hidden">
                      {service.img ? (
                        <Image
                          src={service.img}
                          alt={service.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          unoptimized
                        />
                      ) : (
                        <SceneVisual3D variant={service.sceneVariant || "ai-neural"} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050B18]/85 via-[#050B18]/25 to-transparent" />

                      <div className="absolute bottom-5 left-6 right-6 flex items-center gap-3.5 z-10">
                        <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-heading font-bold text-white">{service.title}</h2>
                      </div>
                    </div>

                    <div className="p-7 flex-1 flex flex-col bg-card">
                      <p className="text-muted-foreground mb-6 text-base leading-relaxed">
                        {service.desc}
                      </p>
                      {service.subServices && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-auto pt-5 border-t border-border/60">
                          {service.subServices.map((sub, sIdx: number) => (
                            <div
                              key={sIdx}
                              className="p-3.5 rounded-xl bg-muted/40 border border-border/60 hover:border-primary/40 transition-colors"
                            >
                              <h3 className="font-semibold text-foreground text-sm mb-1">
                                {sub.name}
                              </h3>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {sub.detail}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </TiltCard3D>
              </motion.div>
            );
          })}
        </div>

        {/* Featured Case Studies */}
        <div className="mb-28">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
              Case Studies
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mt-2 mb-3">
              Featured Client Outcomes
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Measurable results delivered across healthcare, fintech, and commerce.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeCaseStudies.map((study, i) => (
              <motion.div
                key={study.client}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setSelectedStudy(study)}
                className="cursor-pointer"
              >
                <TiltCard3D className="rounded-2xl h-full group" intensity={7}>
                  <div className="rounded-2xl bg-card border border-border p-7 flex flex-col justify-between shadow-xs hover:shadow-lg hover:border-primary/40 transition-all h-full">
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 relative rounded-xl overflow-hidden border border-border bg-white p-1.5 shrink-0">
                          <Image
                            src={study.img}
                            alt={study.client}
                            fill
                            sizes="56px"
                            className="object-contain p-1"
                            unoptimized
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-heading font-bold text-foreground">
                            {study.client}
                          </h3>
                          <p className="text-xs text-primary font-semibold uppercase tracking-wider">
                            {study.category}
                          </p>
                        </div>
                      </div>
                      <p className="text-base font-semibold text-foreground leading-relaxed mb-6">
                        “{study.result}”
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border/60 flex items-center justify-between text-sm font-semibold text-primary">
                      <span>View Case Study</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </TiltCard3D>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Engagement Models */}
        <div className="py-16 md:py-20 rounded-3xl bg-card border border-border px-8 lg:px-14 text-center relative overflow-hidden mb-24 shadow-xs">
          <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
            Partnership Models
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mt-2 mb-4">
            How We Engage
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            Flexible engagement structures aligned with your project scope, timeline, and budget.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-10">
            {[
              {
                title: "Fixed Scope & Price",
                desc: "Ideal for well-defined deliverables, corporate sites, and scoped MVPs with predictable budgets.",
              },
              {
                title: "Time & Material",
                desc: "Suited for evolving digital products requiring agile sprint iteration and ongoing discovery.",
              },
              {
                title: "Dedicated Engineering Team",
                desc: "Embed our full-stack engineers and designers directly as an extension of your product org.",
              },
            ].map((model, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-muted/40 border border-border hover:border-primary/40 transition-colors"
              >
                <CheckCircle2 className="w-6 h-6 text-primary mb-4" />
                <h3 className="text-lg font-heading font-bold mb-2">{model.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{model.desc}</p>
              </div>
            ))}
          </div>

          <MagneticWrapper>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
            >
              Request a Project Proposal <ArrowRight className="w-4 h-4" />
            </Link>
          </MagneticWrapper>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold mb-3">Frequently Asked Questions</h2>
            <p className="text-base text-muted-foreground">
              Answers to common questions about our delivery process and technical capabilities.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full px-6 py-4.5 flex items-center justify-between text-left focus:outline-none gap-4"
                >
                  <span className="font-semibold text-base text-foreground">{faq.q}</span>
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
      </div>

      {/* Case Study Detail Modal */}
      <AnimatePresence>
        {selectedStudy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudy(null)}
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
                aria-label="Close case study"
                onClick={() => setSelectedStudy(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 relative rounded-xl overflow-hidden border border-border bg-white p-1.5 shrink-0">
                  <Image
                    src={selectedStudy.img}
                    alt={selectedStudy.client}
                    fill
                    sizes="56px"
                    className="object-contain p-1"
                    unoptimized
                  />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {selectedStudy.category}
                  </span>
                  <h3 className="text-2xl font-heading font-bold text-foreground">
                    {selectedStudy.client}
                  </h3>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-sm font-semibold text-primary mb-5">
                Outcome: {selectedStudy.result}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {selectedStudy.summary}
              </p>
              <div className="space-y-2.5 mb-7">
                {selectedStudy.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
              <Link
                href={`/contact?service=${encodeURIComponent(selectedStudy.category)}`}
                onClick={() => setSelectedStudy(null)}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
              >
                Build a Similar Solution <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
