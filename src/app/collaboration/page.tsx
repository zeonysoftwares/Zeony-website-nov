"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAdminStore, defaultAdminData, type AdminItem } from "@/lib/adminStore";
import { TiltCard3D } from "@/components/ui/TiltCard3D";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";
import { SplitRevealText } from "@/components/motion/SplitRevealText";
import { SceneVisual3D, type SceneVisualVariant } from "@/components/3d/SceneVisual3D";

const AmbientTechCanvas = dynamic(
  () => import("@/components/3d/AmbientTechCanvas").then((m) => m.AmbientTechCanvas),
  { ssr: false }
);

const fallbackVariants: SceneVisualVariant[] = [
  "about-culture-a",
  "training-hub",
  "ai-neural",
  "cloud-mesh",
];

export default function Collaboration() {
  const { items: adminCollab } = useAdminStore("collaboration");
  const activeCollab: AdminItem[] =
    adminCollab.length > 0 ? adminCollab : (defaultAdminData.collaboration as AdminItem[]);

  return (
    <div className="bg-background min-h-screen pt-32 pb-24 relative overflow-hidden">
      <AmbientTechCanvas className="absolute top-0 left-0 right-0 h-[420px] z-0 opacity-65" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mb-16 text-center mx-auto"
        >
          <div className="inline-block mb-5 px-4 py-1.5 rounded-full border border-border bg-card/80 text-xs font-semibold uppercase tracking-widest text-primary">
            Strategic Alliances
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold mb-6 tracking-tight">
            <SplitRevealText text="Industry-Academia" />{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
              Collaboration
            </span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
            Bridging higher education and modern software engineering through joint R&D, institutional workshops, and hands-on student mentorship.
          </p>

          <TiltCard3D className="rounded-3xl max-w-4xl mx-auto group" intensity={5}>
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-border shadow-2xl bg-[#050B18]">
              <Image
                src="/img/3d/collaboration-network.jpg"
                alt="3D Industry-Academia Connected Network"
                fill
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050B18]/75 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between text-xs text-white/90">
                <span className="font-mono uppercase tracking-widest text-cyan-300">
                  Ecosystem & Institutional Alliances
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
                  15+ Active Partners
                </span>
              </div>
            </div>
          </TiltCard3D>
        </motion.div>

        {/* Collaborations List */}
        <div className="space-y-6 mb-24 max-w-5xl mx-auto">
          {activeCollab.map((item, idx) => {
            const isLegacyImg =
              !item.img ||
              item.img.includes("culture_") ||
              item.img.includes("industry_academia") ||
              item.img.includes("web_dev_bento");

            return (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <TiltCard3D className="rounded-3xl group" intensity={4}>
                  <div className="flex flex-col md:flex-row items-center gap-8 bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-xs hover:border-primary/40 transition-colors">
                    <div className="flex-1 order-2 md:order-1 text-left space-y-3">
                      {item.subtitle && (
                        <span className="text-primary font-semibold text-xs block tracking-widest uppercase font-mono">
                          {item.subtitle}
                        </span>
                      )}
                      <h2 className="text-2xl font-heading font-bold text-foreground">
                        {item.title}
                      </h2>
                      <p className="text-muted-foreground text-base leading-relaxed">
                        {item.desc}
                      </p>
                      {item.siteUrl && (
                        <div className="pt-2">
                          <a
                            href={item.siteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            Visit Partner <ArrowRight className="w-4 h-4" />
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="w-full md:w-72 order-1 md:order-2 shrink-0 aspect-video relative rounded-2xl overflow-hidden bg-[#050B18] border border-border">
                      {!isLegacyImg && item.img ? (
                        <Image
                          src={item.img}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 288px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <SceneVisual3D variant={fallbackVariants[idx % fallbackVariants.length]} />
                      )}
                    </div>
                  </div>
                </TiltCard3D>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-14 rounded-3xl bg-card border border-border px-8 lg:px-16 text-center max-w-5xl mx-auto shadow-xs"
        >
          <h2 className="text-3xl font-heading font-bold mb-4">
            Partner with Zeony Technologies
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Representing a university, placement cell, or startup incubator? Connect with us to launch customized technical training and MoU partnerships.
          </p>
          <MagneticWrapper>
            <Link
              href="/contact?service=Academic+Collaboration"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm sm:text-base hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
            >
              Initiate Partnership <ArrowRight className="w-4 h-4" />
            </Link>
          </MagneticWrapper>
        </motion.div>
      </div>
    </div>
  );
}
