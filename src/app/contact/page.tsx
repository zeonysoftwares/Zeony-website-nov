"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Loader2,
  CheckCircle2,
  Plus,
  Minus,
  ArrowRight,
} from "lucide-react";
import { useSiteSettings } from "@/lib/adminStore";
import { TiltCard3D } from "@/components/ui/TiltCard3D";
import { MagneticWrapper } from "@/components/ui/MagneticWrapper";
import { SplitRevealText } from "@/components/motion/SplitRevealText";

const AmbientTechCanvas = dynamic(
  () => import("@/components/3d/AmbientTechCanvas").then((m) => m.AmbientTechCanvas),
  { ssr: false }
);

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const faqs = [
  {
    q: "What is your typical response time?",
    a: "Our team responds to all project and partnership inquiries within 24 hours on business days.",
  },
  {
    q: "Can we schedule an in-person or video consultation?",
    a: "Yes. We welcome visitors at our Hosur headquarters and also host Google Meet or Zoom discovery calls globally.",
  },
  {
    q: "Do you offer an initial discovery session?",
    a: "Yes, we provide a complimentary 30-minute discovery call to understand your technical goals, timeline, and scope.",
  },
];

function ContactFormCard() {
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const productParam = searchParams.get("product");
  const serviceParam = searchParams.get("service");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (productParam) {
      setValue(
        "message",
        `Hello Zeony team, I would like to schedule a product demo for ${productParam}.`
      );
    } else if (serviceParam) {
      setValue(
        "message",
        `Hello Zeony team, we are looking to discuss a project involving ${serviceParam}.`
      );
    }
  }, [productParam, serviceParam, setValue]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          source: productParam
            ? `Demo Request (${productParam})`
            : serviceParam
              ? `Service Inquiry (${serviceParam})`
              : "Contact Page",
        }),
      });
      if (response.ok) {
        setIsSuccess(true);
        reset();
        toast.success("Inquiry submitted successfully.");
      } else {
        toast.error("Unable to send message right now. Please try again or email us directly.");
      }
    } catch {
      toast.error("Network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 md:p-10 rounded-3xl bg-card border border-border shadow-md relative overflow-hidden">
      {isSuccess ? (
        <div className="min-h-[420px] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-cyan-500/15 flex items-center justify-center mb-5">
            <CheckCircle2 className="w-8 h-8 text-cyan-500" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-heading font-bold mb-3">
            Inquiry Received
          </h3>
          <p className="text-muted-foreground text-base mb-8 max-w-sm mx-auto">
            Thank you for reaching out. Our solutions team will review your message and respond within one business day.
          </p>
          <button
            type="button"
            onClick={() => setIsSuccess(false)}
            className="px-7 py-3 rounded-full border border-border hover:border-primary/50 hover:bg-muted text-sm font-semibold transition-colors"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <h2 className="text-2xl font-heading font-bold text-foreground">
              Send Us a Message
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Share your project goals, timeline, or partnership inquiry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-foreground mb-1.5">
                Full Name *
              </label>
              <input
                {...register("name")}
                id="name"
                className={`w-full px-4 py-3 rounded-xl bg-background border text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.name
                    ? "border-destructive focus:ring-destructive/20"
                    : "border-border focus:border-primary focus:ring-primary/20"
                }`}
                placeholder="Jane Doe"
              />
              {errors.name && (
                <p className="text-destructive text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-foreground mb-1.5">
                Work Email *
              </label>
              <input
                {...register("email")}
                id="email"
                type="email"
                className={`w-full px-4 py-3 rounded-xl bg-background border text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? "border-destructive focus:ring-destructive/20"
                    : "border-border focus:border-primary focus:ring-primary/20"
                }`}
                placeholder="jane@company.com"
              />
              {errors.email && (
                <p className="text-destructive text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="company" className="block text-xs font-semibold text-foreground mb-1.5">
              Organization / Institution (Optional)
            </label>
            <input
              {...register("company")}
              id="company"
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="Acme Technologies Pvt. Ltd."
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-xs font-semibold text-foreground mb-1.5">
              Project or Inquiry Details *
            </label>
            <textarea
              {...register("message")}
              id="message"
              rows={5}
              className={`w-full px-4 py-3 rounded-xl bg-background border text-sm focus:outline-none focus:ring-2 transition-all resize-none ${
                errors.message
                  ? "border-destructive focus:ring-destructive/20"
                  : "border-border focus:border-primary focus:ring-primary/20"
              }`}
              placeholder="Briefly describe your goals, timeline, and required capabilities..."
            />
            {errors.message && (
              <p className="text-destructive text-xs mt-1">{errors.message.message}</p>
            )}
          </div>

          <MagneticWrapper className="w-full">
            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm sm:text-base hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none shadow-md shadow-primary/20"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Send Message <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </MagneticWrapper>
        </form>
      )}
    </div>
  );
}

export default function Contact() {
  const { settings } = useSiteSettings();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  return (
    <div className="bg-background min-h-screen pt-32 pb-24 relative overflow-hidden">
      <AmbientTechCanvas className="absolute top-0 left-0 right-0 h-[360px] z-0 opacity-60" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-block mb-5 px-4 py-1.5 rounded-full border border-border bg-card/80 text-xs font-semibold uppercase tracking-widest text-primary">
            Get in Touch
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold mb-5 tracking-tight">
            <SplitRevealText text="Let’s build" />{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
              together.
            </span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Whether you’re planning a new software platform, scaling an existing product, or exploring institutional training, our team is ready to help.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12 mb-24">
          {/* Contact Details */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-3xl p-8 h-full flex flex-col justify-between shadow-xs">
              <div>
                <h2 className="text-xl font-heading font-bold mb-7">
                  Direct Channels
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        Email
                      </div>
                      <a
                        href={`mailto:${settings.supportEmail}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors text-base"
                      >
                        {settings.supportEmail}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        Phone & WhatsApp
                      </div>
                      <a
                        href={`tel:${settings.contactPhone.replace(/\s+/g, "")}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors text-base"
                      >
                        {settings.contactPhone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        Headquarters
                      </div>
                      <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                        {settings.headquarters}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-border mt-8">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  Social Channels
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href="https://www.instagram.com/zeony_technologies/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                  </a>
                  <a
                    href="https://in.linkedin.com/company/zeony-technologies29"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                  </a>
                  <a
                    href="https://x.com/zeonytech"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X"
                    className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <Suspense
              fallback={
                <div className="p-10 rounded-3xl bg-card border border-border h-[460px] animate-pulse" />
              }
            >
              <ContactFormCard />
            </Suspense>
          </div>
        </div>

        {/* FAQ & 3D HQ Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          <div>
            <h2 className="text-2xl font-heading font-bold mb-6">Before You Reach Out</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="border border-border rounded-2xl bg-card overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none hover:bg-muted/40 transition-colors gap-4"
                  >
                    <span className="font-semibold text-sm sm:text-base">{faq.q}</span>
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
                        <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          <TiltCard3D className="rounded-3xl group" intensity={6}>
            <div className="rounded-3xl overflow-hidden border border-border shadow-xl relative min-h-[340px] flex items-end bg-[#050B18]">
              <Image
                src="/img/3d/contact-connect.jpg"
                alt="Zeony Global Connectivity"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050B18] via-[#050B18]/45 to-transparent" />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between w-full p-7 gap-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-semibold">
                    Location
                  </span>
                  <h3 className="text-2xl font-heading font-bold text-white mt-1">
                    Hosur Headquarters
                  </h3>
                  <p className="text-sm text-slate-300 mt-1 max-w-xs">
                    Visit our office opposite Hosur Bus Stand or schedule a virtual consultation.
                  </p>
                </div>
                <a
                  href="https://maps.google.com/?q=Zeony+Technologies+Hosur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-primary hover:border-primary text-white text-sm font-semibold transition-colors inline-flex items-center gap-2 shrink-0 w-max"
                >
                  Open in Maps <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </TiltCard3D>
        </div>
      </div>
    </div>
  );
}
