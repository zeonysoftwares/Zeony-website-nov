import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, Database, FileText, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Comprehensive Privacy Policy for Zeony Technologies websites, SaaS platforms, client inquiries, and academy applications.",
};

const sections = [
  {
    id: "collection",
    title: "1. Information We Collect",
    content: [
      "Contact & Business Inquiries: When you submit a project inquiry, request a product demo, or contact our team, we collect your name, work or personal email address, phone number, organization name, and project details.",
      "Academy & Internship Applications: When you apply for training programs, workshops, or internships, we collect personal, academic, and scheduling information including your full name, email, phone number, date of birth, residential address, educational institution, degree/department, academic scores, and any uploaded passport-size photograph.",
      "Technical & Usage Data: Basic browser metadata (such as theme preference and session storage state) used strictly to preserve your user interface preferences and navigation experience.",
    ],
  },
  {
    id: "usage",
    title: "2. How We Use Your Information",
    content: [
      "To respond to software consulting, web/mobile development, and product demo inquiries.",
      "To evaluate internship, training, and workshop applications and communicate admissions decisions, onboarding schedules, and certification records.",
      "To maintain, secure, and improve our digital platforms (including Drive Logs, Campus Test, Netfra, and FWAPMS) and prevent unauthorized access.",
      "Zeony Technologies never sells, rents, or trades your personal information to third-party advertisers or data brokers.",
    ],
  },
  {
    id: "storage",
    title: "3. Data Storage, Security & Retention",
    content: [
      "Submitted inquiries, application records, and uploaded documents are stored on access-controlled cloud infrastructure with encrypted HTTPS/TLS transport.",
      "Administrative access is restricted to authorized Zeony Technologies personnel responsible for client delivery, technical support, and academy admissions.",
      "We retain personal records only for as long as necessary to fulfill the purpose for which they were collected or to meet legal and institutional compliance obligations.",
    ],
  },
  {
    id: "sharing",
    title: "4. Third-Party Service Providers",
    content: [
      "We rely on trusted infrastructure providers (such as cloud database/storage hosting and transactional email delivery services) strictly to process submissions and send official status notifications.",
      "These service providers are bound by confidentiality and security obligations and may only process data as instructed by Zeony Technologies.",
    ],
  },
  {
    id: "cookies",
    title: "5. Cookies & Local Storage",
    content: [
      "We use minimal browser storage solely for functional purposes—such as remembering your light/dark theme preference, preventing repeated intro animations during a session, and maintaining secure admin authentication sessions.",
    ],
  },
  {
    id: "rights",
    title: "6. Your Privacy Rights",
    content: [
      "You have the right to request access to, correction of, or deletion of personal information you have submitted through our website.",
      "To submit a privacy request or withdraw consent for pending communications, please contact our team directly using the details below.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* Header Card */}
        <div className="rounded-3xl bg-card border border-border p-8 sm:p-10 mb-10 shadow-xs">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> Legal & Data Protection
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-bold mb-3 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Effective Date: November 2026 • Zeony Technologies, Hosur, Tamil Nadu, India
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            Zeony Technologies respects your privacy and is committed to protecting personal and organizational data shared across our website, consulting services, software products, and academy programs.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-7 pt-6 border-t border-border/70 text-xs font-medium text-foreground">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/60">
              <Lock className="w-4 h-4 text-primary shrink-0" />
              <span>Encrypted HTTPS Transport</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/60">
              <Database className="w-4 h-4 text-primary shrink-0" />
              <span>Zero Third-Party Data Sales</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/60">
              <FileText className="w-4 h-4 text-primary shrink-0" />
              <span>Transparent Data Rights</span>
            </div>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="rounded-2xl bg-card border border-border p-6 sm:p-8 space-y-3"
            >
              <h2 className="text-xl font-heading font-bold text-foreground">
                {section.title}
              </h2>
              <ul className="space-y-2.5 text-sm sm:text-base text-muted-foreground leading-relaxed">
                {section.content.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          {/* Contact Footer Card */}
          <div className="rounded-2xl bg-muted/40 border border-border p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-heading font-bold text-foreground mb-1 flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" /> Questions About Privacy?
              </h2>
              <p className="text-sm text-muted-foreground">
                Reach our team for data access, correction, or removal requests, or review our{" "}
                <Link href="/terms" className="text-primary font-semibold hover:underline">
                  Terms &amp; Conditions
                </Link>
                .
              </p>
            </div>
            <Link
              href="/contact"
              className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shrink-0 w-max"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
