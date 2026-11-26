"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";
import { useSiteSettings } from "@/lib/adminStore";

export function Footer() {
  const { settings } = useSiteSettings();

  return (
    <footer className="bg-[#050814] text-slate-100 border-t border-slate-800/80 pt-20 pb-10 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl h-64 bg-primary/15 blur-[130px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/img/z-logo.jpg"
                alt="Zeony Technologies"
                width={40}
                height={40}
                className="w-10 h-10 object-contain rounded-lg border border-white/10"
              />
              <div>
                <span className="font-heading font-bold text-xl tracking-tight text-white block leading-none">
                  ZEONY
                </span>
                <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                  Technologies
                </span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Engineering scalable enterprise software, digital products, and practical technical education to empower businesses and emerging tech talent.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://www.instagram.com/zeony_technologies/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:border-primary/60 hover:bg-primary/15 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
              </a>
              <a
                href="https://in.linkedin.com/company/zeony-technologies29"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:border-primary/60 hover:bg-primary/15 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
              </a>
              <a
                href="https://x.com/zeonytech"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:border-primary/60 hover:bg-primary/15 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>
              </a>
            </div>
          </div>

          {/* Solutions */}
          <div className="lg:col-span-2">
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-white mb-5">
              Solutions
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { name: "Web Development", path: "/services" },
                { name: "Mobile Apps", path: "/services" },
                { name: "Custom Software", path: "/services" },
                { name: "UI/UX & Branding", path: "/services" },
                { name: "Our Products", path: "/products" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <span>{item.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Academy */}
          <div className="lg:col-span-3">
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-white mb-5">
              Company & Academy
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { name: "About Zeony", path: "/about" },
                { name: "Leadership Team", path: "/team" },
                { name: "Team Members", path: "/team-members" },
                { name: "Collaborations", path: "/collaboration" },
                { name: "Training Initiatives", path: "/training" },
                { name: "Internship Programs", path: "/internships" },
                { name: "Corporate Workshops", path: "/workshops" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-white mb-5">
              Headquarters
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-slate-400">
                <MapPin className="w-4 h-4 shrink-0 mt-1 text-primary" />
                <span className="leading-relaxed whitespace-pre-line">{settings.headquarters}</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Mail className="w-4 h-4 shrink-0 text-primary" />
                <a href={`mailto:${settings.supportEmail}`} className="hover:text-white transition-colors">
                  {settings.supportEmail}
                </a>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Phone className="w-4 h-4 shrink-0 text-primary" />
                <a
                  href={`tel:${settings.contactPhone.replace(/\s+/g, "")}`}
                  className="hover:text-white transition-colors"
                >
                  {settings.contactPhone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {settings.siteName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
