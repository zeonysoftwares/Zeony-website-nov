"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Target,
  TrendingUp,
  Users,
  Heart,
  Zap,
  Award,
  BookOpen,
  Rocket,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { TiltCard3D } from "@/components/ui/TiltCard3D";
import { SplitRevealText } from "@/components/motion/SplitRevealText";
import { GsapParallax } from "@/components/motion/GsapScrollPrimitives";
import { SceneVisual3D } from "@/components/3d/SceneVisual3D";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";

const values = [
  { icon: Zap, title: "Innovation", desc: "Applying modern architectures to build resilient, forward-looking digital platforms." },
  { icon: TrendingUp, title: "Continuous Growth", desc: "Investing in ongoing research, code quality, and skill advancement." },
  { icon: Users, title: "Collaboration", desc: "Working transparently alongside client stakeholders and academic partners." },
  { icon: Award, title: "Engineering Excellence", desc: "Holding every release to strict performance, security, and maintainability standards." },
  { icon: Heart, title: "Integrity", desc: "Operating with clear communication, realistic timelines, and honest accountability." },
  { icon: Target, title: "User-Centered Design", desc: "Prioritizing clarity, accessibility, and measurable usability in every interface." },
  { icon: BookOpen, title: "Ownership", desc: "Taking end-to-end responsibility from architectural discovery to production SLA." },
  { icon: Users, title: "Empowerment", desc: "Equipping emerging engineers with practical, production-tested capabilities." },
];

const journey = [
  {
    year: "Sep 2025",
    title: "The Inception",
    desc: "Zeony Technologies was founded with a clear mission: bridge the gap between ambitious business ideas and dependable, modern software engineering.",
  },
  {
    year: "Dec 2025",
    title: "Flagship Client Launches",
    desc: "Delivered our initial suite of full-stack web platforms and healthcare/nursery digital transformations with 100% on-time delivery.",
  },
  {
    year: "Mar 2026",
    title: "Zeony Academy & Internships",
    desc: "Expanded into structured industry training, university collaborations, and live-project internships for emerging software engineers.",
  },
  {
    year: "Jul 2026",
    title: "Enterprise SaaS & AI Scale",
    desc: "Launched proprietary SaaS platforms including Drive Logs, Campus Test, Netfra, and FWAPMS alongside enterprise AI consulting.",
  },
];

const whyChooseUs = [
  "Agile & Transparent Sprint Workflow",
  "Modern Full-Stack & Cloud Architecture",
  "Dedicated Post-Launch SLA Support",
  "Tailored Digital & Brand Strategies",
  "Accessibility & Performance First",
  "Measurable Business Outcomes",
];

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroY = useTransform(scrollYProgress, [0, 0.2], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div ref={containerRef} className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-36 pb-24 lg:pt-44 lg:pb-32 flex items-center justify-center overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.35] pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[32rem] h-[32rem] bg-primary/15 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[24rem] h-[24rem] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-block mb-5 px-4 py-1.5 rounded-full border border-border bg-card/80 backdrop-blur-md text-xs font-semibold uppercase tracking-widest text-primary"
          >
            About Zeony Technologies
          </motion.div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 tracking-tight">
            <SplitRevealText text="Engineering Clarity." />{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
              Building Futures.
            </span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Zeony Technologies is built on long-term technical partnership and practical empowerment—delivering dependable software systems for organizations while mentoring the next generation of builders.
          </motion.p>
        </motion.div>
      </section>

      {/* Vision & Mission with 3D Visual */}
      <section className="py-24 lg:py-28 relative bg-background border-b border-border overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          <div className="lg:col-span-5">
            <GsapParallax speed={-6}>
              <TiltCard3D className="rounded-3xl group" intensity={8}>
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-border shadow-2xl bg-[#050B18]">
                  <Image
                    src="/img/3d/about-innovation.jpg"
                    alt="Zeony 3D Innovation Architecture"
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050B18]/60 to-transparent" />
                </div>
              </TiltCard3D>
            </GsapParallax>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 gap-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <TiltCard3D className="rounded-2xl group" intensity={6}>
                <div className="p-8 rounded-2xl bg-card border border-border shadow-xs hover:border-primary/40 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                    <Rocket className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-heading font-bold mb-3">Our Vision</h2>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    To be a trusted engineering partner in building accessible, high-impact digital platforms—empowering organizations and technologists to thrive in a software-driven economy.
                  </p>
                </div>
              </TiltCard3D>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <TiltCard3D className="rounded-2xl group" intensity={6}>
                <div className="p-8 rounded-2xl bg-card border border-border shadow-xs hover:border-cyan-500/40 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-5">
                    <Heart className="w-6 h-6 text-cyan-500" />
                  </div>
                  <h2 className="text-2xl font-heading font-bold mb-3">Our Mission</h2>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    We turn ambitious product concepts into resilient web platforms, mobile applications, and intuitive brand experiences that serve as a durable foundation for our clients’ growth.
                  </p>
                </div>
              </TiltCard3D>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Milestones Timeline */}
      <section className="py-24 lg:py-28 relative bg-muted/40 border-b border-border">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
              Trajectory
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mt-2 mb-4">
              Our Milestones
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Key chapters in our growth as an engineering studio and technical academy.
            </p>
          </div>

          <div className="max-w-4xl mx-auto relative before:absolute before:top-0 before:bottom-0 before:left-4 md:before:left-1/2 md:before:-translate-x-px before:w-0.5 before:bg-border">
            {journey.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45 }}
                className={`relative flex items-start md:items-center justify-between mb-12 last:mb-0 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className="hidden md:block w-5/12" />
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-background border-4 border-primary z-10 mt-1.5 md:mt-0 shadow-sm" />
                <div
                  className={`w-full pl-12 md:pl-0 md:w-5/12 ${
                    i % 2 === 0 ? "md:text-right md:pr-10" : "md:text-left md:pl-10"
                  }`}
                >
                  <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold mb-2">
                    {item.year}
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-2 text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 lg:py-28 relative">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
              Principles
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mt-2 mb-4">
              Core Values
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              The standards that guide every engineering decision and client relationship.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, i) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
              >
                <TiltCard3D className="rounded-2xl h-full group" intensity={7}>
                  <div className="p-6 rounded-2xl bg-card border border-border shadow-2xs hover:shadow-md hover:border-primary/40 transition-all h-full">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 text-primary">
                      <val.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-heading font-bold mb-2">{val.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{val.desc}</p>
                  </div>
                </TiltCard3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Partner With Us & 3D Studio Culture */}
      <section className="py-24 lg:py-28 relative bg-muted/40 border-y border-border overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="grid grid-cols-2 gap-4 h-[360px] sm:h-[460px] lg:h-[500px]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative rounded-2xl overflow-hidden row-span-2 h-full border border-border shadow-md bg-[#050B18]"
              >
                <Image
                  src="/img/web_dev_bento.png"
                  alt="Zeony Engineering Workstation"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="relative rounded-2xl overflow-hidden h-full border border-border shadow-md bg-[#050B18]"
              >
                <SceneVisual3D variant="about-culture-a" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="relative rounded-2xl overflow-hidden h-full border border-border shadow-md bg-[#050B18]"
              >
                <SceneVisual3D variant="about-culture-b" />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
                Why Zeony
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mt-2 mb-5">
                Why Partner With Us?
              </h2>
              <p className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed">
                We go beyond writing code and shipping interfaces. We align technology decisions with your commercial and operational goals.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {whyChooseUs.map((reason, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors"
                  >
                    <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-foreground">{reason}</span>
                  </div>
                ))}
              </div>

              <MagneticWrapper>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
                >
                  Discuss Your Project <ArrowRight className="w-4 h-4" />
                </Link>
              </MagneticWrapper>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-24 relative bg-background overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Projects Delivered", value: 50, suffix: "+" },
              { label: "Students Mentored", value: 500, suffix: "+" },
              { label: "Client Satisfaction", value: 100, suffix: "%" },
              { label: "Enterprise & Academic Partners", value: 15, suffix: "+" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
              >
                <TiltCard3D className="rounded-2xl group" intensity={7}>
                  <div className="p-8 rounded-2xl bg-card border border-border shadow-xs flex flex-col items-center justify-center text-center hover:border-primary/40 transition-colors">
                    <div className="text-4xl md:text-5xl font-heading font-bold text-primary mb-2">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">
                      {stat.label}
                    </div>
                  </div>
                </TiltCard3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
