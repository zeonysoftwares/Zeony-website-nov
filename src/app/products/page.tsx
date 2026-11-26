"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  Users,
  Map,
  MessageSquare,
  LayoutDashboard,
} from "lucide-react";
import { useAdminStore, type AdminItem } from "@/lib/adminStore";
import { TiltCard3D } from "@/components/ui/TiltCard3D";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";
import { SplitRevealText } from "@/components/motion/SplitRevealText";
import { ProductDeviceMockup3D } from "@/components/3d/ProductDeviceMockup3D";

interface ProductItem {
  title: string;
  desc?: string;
  img?: string;
  category?: string;
  features: string[];
  stats: Record<string, string>;
  audience: string;
  roadmap: string[];
  testimonial: { text: string; author: string };
  siteUrl?: string;
}

const defaultProductsList: ProductItem[] = [
  {
    title: "Drive Logs",
    category: "Fleet & Academy Suite",
    desc: "Comprehensive driving school management platform for scheduling, student tracking, and fleet maintenance.",
    img: "/img/drive-logs.png",
    features: ["Student Portal", "Instructor Scheduling", "Fleet Tracking", "Payment Gateway"],
    stats: { users: "5K+", schools: "50+" },
    audience: "Driving Schools, Independent Instructors, Fleet Managers",
    roadmap: ["AI-based Route Optimization", "Mobile App for Students", "Automated Reporting"],
    testimonial: {
      text: "Drive Logs saved us 20 hours a week in administrative work. Our instructors love the mobile schedule view.",
      author: "Operations Lead, Partner Driving Academy",
    },
  },
  {
    title: "Campus Test",
    category: "AI Assessment Engine",
    desc: "Advanced online examination and assessment platform tailored for universities and competitive exams.",
    img: "/img/campustest.png",
    features: ["AI Proctoring", "Detailed Analytics", "Question Banks", "Live Results"],
    stats: { users: "100K+", exams: "1M+" },
    audience: "Universities, Certification Boards, Corporate HR Training",
    roadmap: [
      "Biometric Authentication",
      "Adaptive Question Difficulty",
      "Plagiarism Detection Suite",
    ],
    testimonial: {
      text: "We scaled our mid-terms to 10,000 concurrent students smoothly with clear real-time analytics.",
      author: "Academic Controller, Partner Institution",
    },
  },
  {
    title: "Netfra",
    category: "Infrastructure Telemetry",
    desc: "Enterprise network infrastructure monitoring and IT asset management suite.",
    img: "/img/netfra.png",
    features: ["Real-time Monitoring", "Asset Discovery", "Alerting System", "Uptime Reports"],
    stats: { users: "200+", nodes: "50K+" },
    audience: "IT Departments, Managed Service Providers (MSPs), Data Centers",
    roadmap: [
      "Predictive Hardware Failure AI",
      "Automated Patch Management",
      "Custom Dashboard Builder",
    ],
    testimonial: {
      text: "Netfra flagged an upstream switch anomaly minutes before it could impact our core services.",
      author: "Infrastructure Lead, Enterprise IT Client",
    },
  },
  {
    title: "FWAPMS",
    category: "Academic ERP Module",
    desc: "Faculty Work Assessment and Progression Management System for academic appraisal, workload analytics, and institutional compliance.",
    img: "/img/fwapms.png",
    features: ["Workload Tracking", "360° Appraisal Flow", "Accreditation Reports", "Role-Based Access"],
    stats: { institutions: "15+", compliance: "100%" },
    audience: "Universities, Engineering Colleges, Academic IQAC Teams",
    roadmap: [
      "Automated NAAC/NBA Export",
      "Research Publication Indexing",
      "Department KPI Heatmaps",
    ],
    testimonial: {
      text: "FWAPMS standardized our faculty progression reviews and cut accreditation reporting time in half.",
      author: "Dean of Academics, Partner Engineering College",
    },
  },
];

const ProductCard = ({ product, index }: { product: ProductItem; index: number }) => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "audience", label: "Audience & Scale", icon: Users },
    { id: "roadmap", label: "Roadmap", icon: Map },
    { id: "testimonial", label: "Feedback", icon: MessageSquare },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col ${
        index % 2 !== 0 ? "lg:flex-row-reverse" : "lg:flex-row"
      } gap-10 lg:gap-16 items-start`}
    >
      <div className="w-full lg:w-1/2 lg:sticky lg:top-28">
        <TiltCard3D className="rounded-3xl group" intensity={7}>
          <div className="aspect-[16/10] rounded-3xl overflow-hidden border border-border shadow-xl bg-[#050B18]">
            <ProductDeviceMockup3D
              title={product.title}
              logoSrc={product.img}
              category={product.category}
            />
          </div>
        </TiltCard3D>
      </div>

      <div className="w-full lg:w-1/2 space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
            Zeony Product 0{index + 1}
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mt-1.5 mb-3">
            {product.title}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            {product.desc}
          </p>
        </div>

        {/* Interactive Tabs */}
        <div className="border-b border-border flex gap-5 overflow-x-auto pb-0.5 custom-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-3 border-b-2 text-sm transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-primary text-primary font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground font-medium"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="min-h-[210px] relative">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <h3 className="font-semibold text-base text-foreground">Core Capabilities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.features.map((feature: string) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2.5 p-3.5 rounded-xl bg-card border border-border text-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                      <span className="font-medium text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "audience" && (
              <motion.div
                key="audience"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="p-5 rounded-2xl bg-card border border-border">
                  <h3 className="font-semibold text-xs uppercase tracking-wider text-primary mb-1.5">
                    Built For
                  </h3>
                  <p className="text-base font-medium text-foreground">{product.audience}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.stats).map(([key, value]) => (
                    <div
                      key={key}
                      className="p-5 rounded-2xl bg-primary/5 border border-primary/15"
                    >
                      <div className="text-2xl font-heading font-bold text-primary mb-1">
                        {value as string}
                      </div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {key}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "roadmap" && (
              <motion.div
                key="roadmap"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                <h3 className="font-semibold text-base text-foreground">Upcoming Releases</h3>
                <div className="space-y-2.5">
                  {product.roadmap.map((item: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-3.5 p-3.5 rounded-xl bg-card border border-border border-l-4 border-l-primary/60"
                    >
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center font-mono font-bold text-xs text-primary shrink-0">
                        Q{(i % 4) + 1}
                      </div>
                      <span className="font-medium text-sm text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "testimonial" && (
              <motion.div
                key="testimonial"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-6 rounded-2xl bg-card border border-border shadow-xs">
                  <p className="text-base italic text-foreground/85 mb-4 leading-relaxed">
                    “{product.testimonial.text}”
                  </p>
                  <div className="text-sm font-semibold text-primary">
                    — {product.testimonial.author}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="pt-4 flex flex-wrap items-center gap-3.5">
          {product.siteUrl && (
            <a
              href={product.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card border border-border text-foreground text-sm font-semibold hover:border-primary/50 hover:text-primary transition-colors"
            >
              Visit Live Product <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
          <MagneticWrapper>
            <Link
              href={`/contact?product=${encodeURIComponent(product.title)}`}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 group"
            >
              Request Demo{" "}
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </MagneticWrapper>
        </div>
      </div>
    </motion.div>
  );
};

export default function Products() {
  const { items: adminProducts } = useAdminStore("products");

  const activeProducts: ProductItem[] =
    adminProducts.length > 0
      ? adminProducts.map((p: AdminItem) => {
          const defMatch = defaultProductsList.find(
            (d) =>
              d.title.toLowerCase() === p.title.toLowerCase() ||
              d.title.toLowerCase().includes(p.title.toLowerCase())
          );
          return {
            title: p.title,
            desc: p.desc || defMatch?.desc,
            img: p.img || defMatch?.img,
            category: p.subtitle || p.category || defMatch?.category,
            features:
              p.features && p.features.length > 0
                ? p.features
                : defMatch?.features || [
                    "Cloud Dashboard",
                    "API Access",
                    "Real-time Analytics",
                    "24/7 SLA Support",
                  ],
            stats:
              p.statsArr && p.statsArr.length > 0
                ? p.statsArr.reduce<Record<string, string>>(
                    (acc, curr) => ({ ...acc, [curr.name]: curr.value }),
                    {}
                  )
                : defMatch?.stats || { users: "1K+", deployments: "10+" },
            audience: p.audience || defMatch?.audience || "Enterprise Teams & Institutions",
            roadmap:
              p.roadmap && p.roadmap.length > 0
                ? p.roadmap
                : defMatch?.roadmap || [
                    "AI Workflow Automation",
                    "Mobile Companion App",
                    "Enhanced Telemetry",
                  ],
            testimonial:
              p.testimonialText || p.testimonialAuthor
                ? {
                    text:
                      p.testimonialText ||
                      "A reliable platform that streamlined our daily operations.",
                    author: p.testimonialAuthor || "Operations Lead",
                  }
                : defMatch?.testimonial || {
                    text: "A reliable platform that streamlined our daily operations.",
                    author: "Operations Lead",
                  },
            siteUrl: p.siteUrl || defMatch?.siteUrl || "",
          };
        })
      : defaultProductsList;

  return (
    <div className="bg-background min-h-screen pt-32 pb-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mb-20"
        >
          <div className="inline-block mb-5 px-4 py-1.5 rounded-full border border-border bg-card/80 text-xs font-semibold uppercase tracking-widest text-primary">
            Proprietary Software
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold mb-6 tracking-tight">
            <SplitRevealText text="Innovative" />{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
              Products
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Purpose-built software platforms engineered by Zeony Technologies to streamline workflows, elevate compliance, and scale organizations.
          </p>
        </motion.div>

        <div className="space-y-28">
          {activeProducts.map((product, i) => (
            <ProductCard key={product.title} product={product} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
