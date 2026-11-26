import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Scale, FileCheck, Briefcase, GraduationCap, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and Conditions governing the use of Zeony Technologies websites, software engineering engagements, SaaS products, and training programs.",
};

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: [
      "By accessing or using the Zeony Technologies website, submitting a project inquiry, requesting a product demo, or applying for an academy program, you agree to be bound by these Terms and Conditions and all applicable laws.",
      "If you are entering into these terms on behalf of an organization or educational institution, you represent that you have the authority to bind that entity.",
    ],
  },
  {
    id: "services",
    title: "2. Software Engineering & Consulting Services",
    content: [
      "All custom software development, web and mobile engineering, UI/UX design, cloud consulting, and ongoing SLA maintenance engagements are governed by a mutually executed Statement of Work (SOW) or Master Services Agreement (MSA).",
      "Project timelines, milestone deliverables, acceptance criteria, payment schedules, and post-launch support terms specified in your signed SOW supersede general informational descriptions on this website.",
    ],
  },
  {
    id: "products",
    title: "3. Proprietary Software Products",
    content: [
      "Access to Zeony Technologies’ proprietary platforms—including Drive Logs, Campus Test, Netfra, and FWAPMS—is licensed on a subscription or institutional deployment basis under separate product license terms.",
      "You may not reverse-engineer, redistribute, resell, or attempt unauthorized access to any Zeony software system, API, or administrative endpoint.",
    ],
  },
  {
    id: "academy",
    title: "4. Internships, Training & Workshops",
    content: [
      "Admission into Zeony Academy internships, technical bootcamps, and corporate workshops is subject to eligibility verification, seat availability, and adherence to program conduct standards.",
      "Certificates of completion are issued only upon fulfilling attendance, project submission, and evaluation requirements.",
      "Codebases, datasets, and architectural templates provided during training are strictly for educational and portfolio use unless explicitly authorized for commercial reuse.",
    ],
  },
  {
    id: "ip",
    title: "5. Intellectual Property Rights",
    content: [
      "All trademarks, logos, 3D visual assets, product names, UI designs, and written content displayed on this website are the intellectual property of Zeony Technologies or their respective client/partner owners.",
      "For custom client projects, intellectual property assignment and source code ownership transfer upon full settlement of agreed milestone fees as defined in the governing client contract.",
    ],
  },
  {
    id: "liability",
    title: "6. Limitation of Liability & Acceptable Use",
    content: [
      "While we strive to keep website information accurate and systems available, this website is provided on an 'as-is' informational basis.",
      "To the fullest extent permitted by law, Zeony Technologies shall not be liable for indirect, incidental, or consequential damages arising from temporary website downtime or unauthorized third-party interference.",
    ],
  },
  {
    id: "governing-law",
    title: "7. Governing Law & Updates",
    content: [
      "These Terms and Conditions are governed by the laws of India, with exclusive jurisdiction vested in the competent courts of Tamil Nadu.",
      "Zeony Technologies reserves the right to update these Terms periodically; continued use of the website constitutes acceptance of the revised Terms.",
    ],
  },
];

export default function TermsOfServicePage() {
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
            <Scale className="w-3.5 h-3.5" /> Legal Agreement
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-bold mb-3 tracking-tight">
            Terms &amp; Conditions
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Effective Date: November 2026 • Zeony Technologies, Hosur, Tamil Nadu, India
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            These Terms and Conditions outline the rules, responsibilities, and legal framework for using Zeony Technologies’ digital platforms, engineering services, and academy programs.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-7 pt-6 border-t border-border/70 text-xs font-medium text-foreground">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/60">
              <Briefcase className="w-4 h-4 text-primary shrink-0" />
              <span>Clear SOW Governance</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/60">
              <FileCheck className="w-4 h-4 text-primary shrink-0" />
              <span>Protected IP Standards</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/60">
              <GraduationCap className="w-4 h-4 text-primary shrink-0" />
              <span>Academy Program Rules</span>
            </div>
          </div>
        </div>

        {/* Terms Sections */}
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
                <Mail className="w-4 h-4 text-primary" /> Need Clarification?
              </h2>
              <p className="text-sm text-muted-foreground">
                Review our{" "}
                <Link href="/privacy" className="text-primary font-semibold hover:underline">
                  Privacy Policy
                </Link>{" "}
                or reach out to our team for contract and licensing questions.
              </p>
            </div>
            <Link
              href="/contact"
              className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shrink-0 w-max"
            >
              Contact Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
