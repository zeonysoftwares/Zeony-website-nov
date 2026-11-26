"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X, Phone, Mail, ArrowRight, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSiteSettings } from "@/lib/adminStore";

interface NavDropdownItem {
  name: string;
  desc?: string;
  path: string;
}

interface NavItem {
  name: string;
  path: string;
  dropdown?: NavDropdownItem[];
}

const navLinks: NavItem[] = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Products", path: "/products" },
  {
    name: "Academy",
    path: "/training",
    dropdown: [
      { name: "Training Programs", desc: "Industry certifications & bootcamps", path: "/training" },
      { name: "Internships", desc: "Live projects & mentorship", path: "/internships" },
      { name: "Workshops", desc: "Corporate & technical tracks", path: "/workshops" },
    ],
  },
  {
    name: "Company",
    path: "/team",
    dropdown: [
      { name: "Our Leadership", desc: "Meet the founders & executives", path: "/team" },
      { name: "Team Members", desc: "Engineering, design & mentoring teams", path: "/team-members" },
      { name: "Collaborations", desc: "Academic & ecosystem partners", path: "/collaboration" },
    ],
  },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { settings } = useSiteSettings();
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isDropdownActive = (items?: NavDropdownItem[]) =>
    items?.some((item) => pathname === item.path) ?? false;

  return (
    <div ref={navRef}>
      {/* Top Info Bar */}
      <div
        className={`hidden lg:flex fixed top-0 w-full h-9 bg-background/90 backdrop-blur-md border-b border-border/70 z-50 items-center justify-between px-12 transition-transform duration-300 ${
          isScrolled ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="flex items-center gap-6 text-xs text-muted-foreground font-medium">
          <a
            href={`tel:${settings.contactPhone.replace(/\s+/g, "")}`}
            className="flex items-center gap-1.5 hover:text-primary transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-primary/80" /> {settings.contactPhone}
          </a>
          <div className="w-px h-3 bg-border" />
          <a
            href={`mailto:${settings.supportEmail}`}
            className="flex items-center gap-1.5 hover:text-primary transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-primary/80" /> {settings.supportEmail}
          </a>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground/80 font-medium">
            Hosur, India • Global Delivery
          </span>
          <div className="w-px h-3 bg-border" />
          <a
            href="https://www.instagram.com/zeony_technologies/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Zeony Instagram"
            className="hover:text-primary transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
          </a>
          <a
            href="https://in.linkedin.com/company/zeony-technologies29"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Zeony LinkedIn"
            className="hover:text-primary transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
          </a>
          <a
            href="https://x.com/zeonytech"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Zeony X"
            className="hover:text-primary transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>
          </a>
        </div>
      </div>

      {/* Main Floating Nav */}
      <header
        className={`fixed w-[calc(100%-1.5rem)] lg:w-[92%] max-w-7xl left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          isScrolled ? "top-3 lg:top-4" : "top-3 lg:top-12"
        }`}
      >
        <div
          className={`rounded-full h-16 px-4 sm:px-6 lg:px-7 flex items-center justify-between transition-all duration-300 ${
            isScrolled
              ? "bg-card/90 backdrop-blur-xl border border-border shadow-lg shadow-black/5 dark:shadow-black/30"
              : "bg-card/65 backdrop-blur-md border border-border/50 shadow-sm"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <Image
              src="/img/zeony-logo.jpg"
              alt="Zeony Technologies"
              width={140}
              height={40}
              className="h-9 md:h-10 w-auto object-contain rounded-lg"
              priority
            />
          </Link>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center justify-center gap-1 flex-1 mx-6">
            {navLinks.map((link) => {
              const isActive = link.dropdown ? isDropdownActive(link.dropdown) : pathname === link.path;

              if (link.dropdown) {
                const isOpen = openDropdown === link.name;
                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(link.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenDropdown(isOpen ? null : link.name)}
                      className={`relative px-3.5 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                        isActive
                          ? "text-primary font-semibold"
                          : "text-foreground/85 hover:text-primary hover:bg-muted/70"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="activeNavIndicator"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          className="absolute inset-0 rounded-full bg-primary/10 -z-10"
                        />
                      )}
                      {link.name}
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isOpen ? "rotate-180 opacity-100" : "opacity-60"
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.98 }}
                          transition={{ duration: 0.16 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-64"
                        >
                          <div className="bg-card border border-border rounded-2xl shadow-xl p-2 flex flex-col gap-0.5">
                            {link.dropdown.map((drop) => {
                              const dropActive = pathname === drop.path;
                              return (
                                <Link
                                  key={drop.name}
                                  href={drop.path}
                                  onClick={() => setOpenDropdown(null)}
                                  className={`px-3.5 py-2.5 rounded-xl transition-colors flex flex-col ${
                                    dropActive
                                      ? "bg-primary/10 text-primary"
                                      : "text-foreground hover:bg-muted/70"
                                  }`}
                                >
                                  <span className="text-sm font-semibold">{drop.name}</span>
                                  {drop.desc && (
                                    <span className="text-xs text-muted-foreground mt-0.5">
                                      {drop.desc}
                                    </span>
                                  )}
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`relative px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-foreground/85 hover:text-primary hover:bg-muted/70"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-primary/10 -z-10"
                    />
                  )}
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA & Theme */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            <ThemeToggle />
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("open-application-modal", { detail: { type: "internship" } })
                )
              }
              className="px-4 py-2 rounded-full border border-border bg-background/80 hover:bg-muted text-foreground text-sm font-semibold transition-colors"
            >
              Apply Now
            </button>
            <Link
              href="/contact"
              className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 flex items-center gap-1.5 group"
            >
              Contact Us
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              aria-label="Open menu"
              className="p-2 rounded-full hover:bg-muted text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-background/98 backdrop-blur-xl z-50 flex flex-col p-6 overflow-y-auto"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between pb-6 border-b border-border">
              <Link
                href="/"
                className="flex items-center gap-2.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Image
                  src="/img/zeony-logo.jpg"
                  alt="Zeony Technologies"
                  width={120}
                  height={36}
                  className="h-9 w-auto object-contain rounded-lg"
                />
              </Link>
              <button
                type="button"
                aria-label="Close menu"
                className="p-2 rounded-full bg-muted text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4 mt-8 flex-1">
              {navLinks.map((link) => (
                <div key={link.name} className="border-b border-border/50 pb-4 last:border-b-0">
                  {link.dropdown ? (
                    <div className="flex flex-col gap-2.5">
                      <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        {link.name}
                      </div>
                      <div className="flex flex-col gap-2 pl-3 border-l-2 border-primary/30">
                        {link.dropdown.map((drop) => (
                          <Link
                            key={drop.name}
                            href={drop.path}
                            className={`text-lg font-heading font-semibold py-1 ${
                              pathname === drop.path ? "text-primary" : "text-foreground"
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {drop.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={link.path}
                      className={`block text-2xl font-heading font-semibold ${
                        pathname === link.path ? "text-primary" : "text-foreground"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-border flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.dispatchEvent(
                    new CustomEvent("open-application-modal", { detail: { type: "internship" } })
                  );
                }}
                className="w-full text-center py-3.5 rounded-full border border-border bg-card text-foreground font-semibold text-base"
              >
                Apply for Training / Internship
              </button>
              <Link
                href="/contact"
                className="block w-full text-center py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-base shadow-lg shadow-primary/20"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
