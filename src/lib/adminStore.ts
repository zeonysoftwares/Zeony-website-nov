"use client";

import { useState, useEffect } from "react";
import { supabase } from "./supabase";

const sectionToTableMap: Record<string, string> = {
  clients: "clients_brands",
  collaboration: "collaborations",
  training: "training_initiatives",
  internships: "internship_domains",
  services: "services",
  products: "products",
  workshops: "workshops",
  hero: "hero_slides",
  testimonials: "testimonials",
  case_studies: "case_studies",
  team_members: "team_members",
};

interface DbRow {
  id: string;
  title?: string;
  client?: string;
  reviewer_name?: string;
  subtitle?: string;
  category?: string;
  designation?: string;
  description?: string;
  review_text?: string;
  image_url?: string;
  img?: string;
  avatar_url?: string;
  icon_name?: string;
  features?: string[];
  sub_services?: { name: string; detail: string }[];
  audience?: string;
  roadmap?: string[];
  testimonial_text?: string;
  testimonial_author?: string;
  stats_arr?: { name: string; value: string }[];
  result?: string;
  site_url?: string;
  display_order?: number;
}

const mapDbToItem = (section: string, row: DbRow): AdminItem => {
  return {
    id: row.id,
    title: row.title || row.client || row.reviewer_name || "",
    subtitle: row.subtitle || row.category || row.designation || "",
    desc: row.description || row.review_text || "",
    img: row.image_url || row.img || row.avatar_url || "",
    category: row.category || "",
    icon: row.icon_name || "",
    features: row.features || [],
    subServices: row.sub_services || [],
    audience: row.audience || "",
    roadmap: row.roadmap || [],
    testimonialText: row.testimonial_text || "",
    testimonialAuthor: row.testimonial_author || "",
    statsArr: row.stats_arr || [],
    client: row.client || "",
    result: row.result || "",
    siteUrl: row.site_url || "",
    displayOrder: row.display_order || 0,
  };
};

const mapItemToDb = (section: string, item: Partial<AdminItem>): Record<string, unknown> => {
  const row: Record<string, unknown> = {};

  if (item.displayOrder !== undefined) {
    row.display_order = parseInt(String(item.displayOrder), 10) || 0;
  }
  
  switch (section) {
    case "clients":
      if (item.title !== undefined) row.title = item.title;
      if (item.subtitle !== undefined) row.category = item.subtitle;
      if (item.category !== undefined) row.category = item.category;
      if (item.img !== undefined) row.img = item.img;
      break;
    case "training":
      if (item.title !== undefined) row.title = item.title;
      if (item.desc !== undefined) row.description = item.desc;
      if (item.icon !== undefined) row.icon_name = item.icon;
      if (item.img !== undefined) row.image_url = item.img;
      break;
    case "internships":
      if (item.title !== undefined) row.title = item.title;
      if (item.desc !== undefined) row.description = item.desc;
      if (item.subtitle !== undefined) row.category = item.subtitle;
      if (item.category !== undefined) row.category = item.category;
      if (item.img !== undefined) row.image_url = item.img;
      break;
    case "collaboration":
      if (item.title !== undefined) row.title = item.title;
      if (item.subtitle !== undefined) row.subtitle = item.subtitle;
      if (item.desc !== undefined) row.description = item.desc;
      if (item.img !== undefined) row.image_url = item.img;
      if (item.siteUrl !== undefined) row.site_url = item.siteUrl;
      break;
    case "workshops":
      if (item.title !== undefined) row.title = item.title;
      if (item.desc !== undefined) row.description = item.desc;
      if (item.img !== undefined) row.image_url = item.img;
      break;
    case "hero":
      if (item.title !== undefined) row.title = item.title;
      if (item.subtitle !== undefined) row.subtitle = item.subtitle;
      if (item.desc !== undefined) row.description = item.desc;
      if (item.img !== undefined) row.image_url = item.img;
      break;
    case "testimonials":
      if (item.title !== undefined) row.reviewer_name = item.title;
      if (item.subtitle !== undefined) row.designation = item.subtitle;
      if (item.desc !== undefined) row.review_text = item.desc;
      if (item.img !== undefined) row.avatar_url = item.img;
      if (item.testimonialText !== undefined) row.review_text = item.testimonialText;
      if (item.testimonialAuthor !== undefined) row.reviewer_name = item.testimonialAuthor;
      break;
    case "products":
      if (item.title !== undefined) row.title = item.title;
      if (item.subtitle !== undefined) row.subtitle = item.subtitle;
      if (item.desc !== undefined) row.description = item.desc;
      if (item.img !== undefined) row.image_url = item.img;
      if (item.features !== undefined) row.features = item.features;
      if (item.audience !== undefined) row.audience = item.audience;
      if (item.roadmap !== undefined) row.roadmap = item.roadmap;
      if (item.testimonialText !== undefined) row.testimonial_text = item.testimonialText;
      if (item.testimonialAuthor !== undefined) row.testimonial_author = item.testimonialAuthor;
      if (item.statsArr !== undefined) row.stats_arr = item.statsArr;
      if (item.siteUrl !== undefined) row.site_url = item.siteUrl;
      break;
    case "services":
      if (item.title !== undefined) row.title = item.title;
      if (item.desc !== undefined) row.description = item.desc;
      if (item.img !== undefined) row.image_url = item.img;
      if (item.subServices !== undefined) row.sub_services = item.subServices;
      break;
    case "case_studies":
      if (item.title !== undefined) row.client = item.title;
      if (item.client !== undefined) row.client = item.client;
      if (item.subtitle !== undefined) row.category = item.subtitle;
      if (item.category !== undefined) row.category = item.category;
      if (item.img !== undefined) row.image_url = item.img;
      if (item.result !== undefined) row.result = item.result;
      break;
    case "team_members":
      if (item.title !== undefined) row.title = item.title;
      if (item.subtitle !== undefined) row.subtitle = item.subtitle;
      if (item.category !== undefined) row.category = item.category;
      if (item.desc !== undefined) row.description = item.desc;
      if (item.icon !== undefined) row.icon_name = item.icon;
      if (item.img !== undefined) row.image_url = item.img;
      if (item.features !== undefined) row.features = item.features;
      break;
  }
  return row;
};
export interface AdminItem {
  id: string;
  title: string;
  subtitle?: string;
  desc?: string;
  img?: string;
  category?: string;
  date?: string;
  icon?: string;
  features?: string[];
  subServices?: { name: string; detail: string }[];
  audience?: string;
  roadmap?: string[];
  testimonialText?: string;
  testimonialAuthor?: string;
  statsArr?: { name: string; value: string }[];
  client?: string;
  result?: string;
  siteUrl?: string;
  displayOrder?: number;
}

export const defaultAdminData = {
  clients: [
    { id: "cl-1", title: "Wise Capital", category: "Finance & Trading", img: "/img/wise-capital-logo.png" },
    { id: "cl-2", title: "Divya Driving School", category: "Automotive & Education", img: "/img/divya-driving-logo.jpeg" },
    { id: "cl-3", title: "Joyson Enterprises", category: "Industrial & Manufacturing", img: "/img/Joyson.jpeg" },
    { id: "cl-4", title: "PMC Tech", category: "Higher Education & Engineering", img: "/img/pmc.jpg" },
    { id: "cl-5", title: "AUMM Cloths", category: "Fashion & Retail", img: "/img/AUMM logo.png" },
    { id: "cl-6", title: "Happy Sunday Biriyani", category: "Food & Beverage", img: "/img/happy sunday biriyani.png" },
    { id: "cl-7", title: "Ramamoorthy Nursery", category: "Agriculture & Botany", img: "/img/ramamoorthy-nusery-logo.png" },
    { id: "cl-8", title: "DDRR Clinic", category: "Healthcare & Medical", img: "/img/ddrr-logo.jpg" }
  ],
  collaboration: [
    { id: "col-1", title: "IIT Madras Research Park", subtitle: "Innovation Partner", desc: "Joint R&D in Generative AI and advanced cloud architectures.", img: "/img/3d/collaboration-network.jpg" },
    { id: "col-2", title: "Anna University Academia Alliance", subtitle: "Institutional Training", desc: "Empowering 500+ engineering students with live software internships.", img: "/img/3d/internships-academy.jpg" },
    { id: "col-3", title: "Techstars Startup Incubator", subtitle: "Ecosystem Partner", desc: "Providing end-to-end technology mentorship for early-stage founders.", img: "/img/3d/workshops-stage.jpg" },
    { id: "col-4", title: "AWS Cloud EdTech Initiative", subtitle: "Cloud Infrastructure", desc: "Collaborative training on scalable cloud deployments and DevOps certification.", img: "/img/web_dev_bento.png" }
  ],
  training: [
    { id: "trn-1", title: "Industry-Oriented Training & Certification", desc: "Workshops, seminars, and skill development programs.", img: "/img/3d/workshops-stage.jpg", icon: "GraduationCap" },
    { id: "trn-2", title: "Internship & Live Projects", desc: "Real-world exposure and hands-on experience for learners.", img: "/img/3d/internships-academy.jpg", icon: "Briefcase" },
    { id: "trn-3", title: "Technology & Innovation Support", desc: "Access to tools, resources, and industry-driven solutions.", img: "/img/custom_software_bento.png", icon: "Lightbulb" },
    { id: "trn-4", title: "Placement Assistance", desc: "End-to-end placement support including resume building, mock interviews & job referrals.", img: "/img/3d/about-innovation.jpg", icon: "Users" },
    { id: "trn-5", title: "Career Guidance & Employability", desc: "Resume building, soft skills, and career development programs.", img: "/img/3d/service-uiux.jpg", icon: "TrendingUp" },
    { id: "trn-6", title: "Research & Learning Initiatives", desc: "Collaborative research, projects, and knowledge sharing.", img: "/img/3d/collaboration-network.jpg", icon: "BookOpen" },
    { id: "trn-7", title: "Workshops, Webinars & Events", desc: "Technical sessions, webinars, and industry interaction.", img: "/img/3d/service-web.jpg", icon: "Calendar" },
    { id: "trn-8", title: "Certifications & Skill Programs", desc: "Industry-recognized certifications and professional skill programs.", img: "/img/web_dev_bento.png", icon: "Award" },
    { id: "trn-9", title: "Industry-Academia Collaboration", desc: "Academic partnerships, institutional training, and collaborative initiatives.", img: "/img/3d/hero-core.jpg", icon: "Handshake" }
  ],
  internships: [
    { id: "int-1", title: "Web Development", desc: "Build scalable, responsive frontend and backend systems with Next.js, React, and Node.js.", img: "/img/3d/service-web.jpg", category: "Core Engineering" },
    { id: "int-2", title: "AIML And Generative AI", desc: "Work on cutting-edge LLMs, neural networks, and computer vision models.", img: "/img/custom_software_bento.png", category: "Artificial Intelligence" },
    { id: "int-3", title: "Java Full Stack", desc: "Master enterprise Java, Spring Boot, Microservices, and modern UI integration.", img: "/img/web_dev_bento.png", category: "Enterprise Systems" },
    { id: "int-4", title: "Data Analyst", desc: "Extract actionable insights using Python, SQL, PowerBI, and data visualization tools.", img: "/img/3d/service-mobile.jpg", category: "Data Science" },
    { id: "int-5", title: "Cyber security", desc: "Learn ethical hacking, network defense, vulnerability assessment, and security auditing.", img: "/img/3d/workshops-stage.jpg", category: "Security" },
    { id: "int-6", title: "Digital Marketing", desc: "Master SEO, SEM, social media growth hacking, and conversion rate optimization.", img: "/img/3d/service-uiux.jpg", category: "Growth & Marketing" }
  ],
  services: [
    { id: "srv-1", title: "Web Development", desc: "At Zeony Technologies, we construct modern, highly responsive, and robust websites that serve as the anchor of your digital presence.", img: "/img/3d/service-web.jpg" },
    { id: "srv-2", title: "App Development", desc: "Mobile applications are essential for reaching customers directly. We specialize in building cutting-edge iOS and Android applications.", img: "/img/3d/service-mobile.jpg" },
    { id: "srv-3", title: "Design & Branding", desc: "In today's crowded market, a powerful visual identity is what makes you stand out. We transform ideas into compelling visual stories.", img: "/img/3d/service-uiux.jpg" },
    { id: "srv-4", title: "Tech Consulting", desc: "Navigate the complex technological landscape with our expert guidance, ensuring your IT infrastructure aligns with business goals.", img: "/img/3d/workshops-stage.jpg" },
    { id: "srv-5", title: "Customized Software", desc: "Tailored enterprise solutions built to solve your unique business challenges through automation and analytics.", img: "/img/custom_software_bento.png" },
    { id: "srv-6", title: "Digital Marketing", desc: "Data-driven marketing strategies designed to increase your online visibility, engage your target audience, and drive conversions.", img: "/img/3d/about-innovation.jpg" }
  ],
  products: [
    { id: "prd-1", title: "Zeony ERP Suite", desc: "Complete cloud-based enterprise resource planning for manufacturing and institutions.", img: "/img/custom_software_bento.png", category: "Enterprise Software" },
    { id: "prd-2", title: "DriveLogs Pro", desc: "Automated scheduling, fleet tracking, and student management system for driving academies.", img: "/img/drive-logs.png", category: "SaaS Application" },
    { id: "prd-3", title: "ClinicCare CRM", desc: "Patient appointment scheduling, billing, and electronic health records platform.", img: "/img/web_dev_bento.png", category: "Healthcare IT" },
    { id: "prd-4", title: "EduTech AI Mentor", desc: "AI-powered personalized tutoring and automated grading engine for universities.", img: "/img/3d/internships-academy.jpg", category: "EdTech Platform" }
  ],
  workshops: [
    { id: "wks-1", title: "AI Engineering", desc: "Build LLMs, RAG systems & Autonomous Agents.", img: "/img/3d/workshops-stage.jpg" },
    { id: "wks-2", title: "Data Science", desc: "Predictive modeling, machine learning & analytics.", img: "/img/web_dev_bento.png" },
    { id: "wks-3", title: "Full Stack Software Developer", desc: "React, Next.js, Node.js & Cloud databases.", img: "/img/3d/service-web.jpg" },
    { id: "wks-4", title: "Cybersecurity", desc: "Ethical hacking, penetration testing & network defense.", img: "/img/3d/about-innovation.jpg" },
    { id: "wks-5", title: "Cloud Fundamentals", desc: "AWS, Azure, Docker & Kubernetes architecture.", img: "/img/custom_software_bento.png" }
  ],
  hero: [
    { id: "hro-1", title: "Engineering the Future of Digital Innovation", subtitle: "Next-Gen Software Solutions", desc: "We transform visionary concepts into high-performance web apps, mobile solutions, and enterprise software.", img: "/img/3d/hero-core.jpg" },
    { id: "hro-2", title: "Empowering Next-Gen Tech Talent", subtitle: "Zeony Technologies & Internships", desc: "Real-world live projects, industry certifications, and 100% placement assistance in advanced technologies.", img: "/img/3d/internships-academy.jpg" },
    { id: "hro-3", title: "Custom AI & Cloud Transformation", subtitle: "Enterprise Architecture", desc: "Accelerating business growth with cutting-edge artificial intelligence and scalable cloud infrastructures.", img: "/img/custom_software_bento.png" }
  ],
  testimonials: [
    { id: "tst-1", title: "Dr. K. Ramanathan", subtitle: "Dean of Engineering, PMC Tech", desc: "Zeony's industry training and internship programs transformed our students' technical capabilities. Over 40 students placed in top MNCs this semester alone!", img: "/img/pmc.jpg" },
    { id: "tst-2", title: "Sarah Jenkins", subtitle: "Director, Wise Capital", desc: "Their custom financial analytics dashboard streamlined our trading data pipelines. Exceptional UI/UX design and rock-solid backend architecture.", img: "/img/wise-capital-logo.png" },
    { id: "tst-3", title: "M. Anbarasu", subtitle: "Founder, DDRR Clinic", desc: "We hired Zeony for digital branding and custom appointment scheduling software. Our patient booking efficiency increased by 60% within two months.", img: "/img/ddrr-logo.jpg" }
  ],
  case_studies: [
    { id: "cs-1", client: "Ramamoorthy Nursery", category: "Web Design & E-Commerce", img: "/img/ramamoorthy-nusery-logo.png", result: "200% increase in online inquiries in 3 months.", title: "Ramamoorthy Nursery" },
    { id: "cs-2", client: "DDRR Clinic", category: "Digital Transformation", img: "/img/ddrr-logo.jpg", result: "Streamlined appointment booking, reducing admin time by 40%.", title: "DDRR Clinic" },
    { id: "cs-3", client: "Wise Capital", category: "App Development", img: "/img/wise-capital-logo.png", result: "Launched a secure fintech app with 10k+ active users.", title: "Wise Capital" }
  ],
  team_members: [
    {
      id: "tm-1",
      title: "Sanjay Kumar K",
      subtitle: "Founder & Chief Design Officer (CDO)",
      category: "Design & Product",
      icon: "SK",
      img: "/img/sanjay.jpg",
      desc: "Directs product strategy, visual systems, and human-centered UI/UX architecture across Zeony's client engagements and SaaS products.",
      features: ["Product Strategy", "UI/UX Systems", "Brand Direction"],
      displayOrder: 1,
    },
    {
      id: "tm-2",
      title: "Vinod Kumar MM",
      subtitle: "Founder & Chief Technology Officer (CTO)",
      category: "Engineering",
      icon: "VK",
      img: "/img/vinod.jpg",
      desc: "Directs software architecture, full-stack engineering delivery, cloud infrastructure, and applied AI workflows.",
      features: ["Next.js & Node.js", "Cloud Architecture", "Applied AI"],
      displayOrder: 2,
    },
    {
      id: "tm-3",
      title: "Frontend & WebGL Engineering",
      subtitle: "React, Next.js & 3D Web Specialists",
      category: "Engineering",
      icon: "FE",
      img: "",
      desc: "Crafts high-speed, accessible web platforms, interactive Three.js experiences, and type-safe TypeScript interfaces.",
      features: ["Next.js 16", "TypeScript", "Three.js / GSAP"],
      displayOrder: 3,
    },
    {
      id: "tm-4",
      title: "Backend & API Systems Team",
      subtitle: "Distributed Services & Database Architects",
      category: "Engineering",
      icon: "BE",
      img: "",
      desc: "Designs resilient REST/GraphQL APIs, PostgreSQL schemas, authentication flows, and multi-tenant SaaS backends.",
      features: ["Node.js & Python", "PostgreSQL", "API Security"],
      displayOrder: 4,
    },
    {
      id: "tm-5",
      title: "Product Design & Prototyping Studio",
      subtitle: "Interaction & Design System Specialists",
      category: "Design & Product",
      icon: "UX",
      img: "",
      desc: "Translates complex business requirements into intuitive wireframes, interactive Figma prototypes, and WCAG-aligned UI libraries.",
      features: ["Figma", "Design Tokens", "Usability Testing"],
      displayOrder: 5,
    },
    {
      id: "tm-6",
      title: "Cloud, DevOps & Applied AI Unit",
      subtitle: "Infrastructure, RAG & Automation Engineers",
      category: "Cloud & AI",
      icon: "CA",
      img: "",
      desc: "Manages containerized cloud deployments, CI/CD pipelines, security audits, and enterprise LLM/RAG integrations.",
      features: ["AWS & Docker", "CI/CD Pipelines", "Enterprise RAG"],
      displayOrder: 6,
    },
    {
      id: "tm-7",
      title: "Academy & Internship Mentors",
      subtitle: "Senior Engineering Coaches & Reviewers",
      category: "Academy & Mentors",
      icon: "AM",
      img: "",
      desc: "Guides interns and workshop cohorts through live client repositories, pull request reviews, and career readiness.",
      features: ["Code Reviews", "Live Sprints", "Placement Prep"],
      displayOrder: 7,
    },
    {
      id: "tm-8",
      title: "Quality Assurance & SLA Support",
      subtitle: "Testing, Performance & Reliability Team",
      category: "Cloud & AI",
      icon: "QA",
      img: "",
      desc: "Ensures every release passes automated verification, responsive device testing, and ongoing production monitoring.",
      features: ["E2E Testing", "Web Vitals", "24/7 SLA Support"],
      displayOrder: 8,
    },
  ],
};

export const defaultSiteSettings = {
  siteName: "Zeony Technologies",
  supportEmail: "hello@zeony.com",
  admissionsEmail: "admissions@zeony.com",
  contactPhone: "063826 54365",
  headquarters: "First Floor, Shanthi Complex, No. 4, opp. Bus stand, Hosur, Tamil Nadu 635109",
  maintenanceMode: "false",
  enablePublicApplications: "true"
};

export type AdminSectionKey = keyof typeof defaultAdminData;

const FALLBACK_STORAGE_PREFIX = "zeony_admin_fallback_";

function isMissingTableError(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  const code = error.code || "";
  const msg = (error.message || "").toLowerCase();
  return (
    code === "PGRST205" ||
    code === "42P01" ||
    msg.includes("does not exist") ||
    msg.includes("could not find the table") ||
    msg.includes("schema cache")
  );
}

function readLocalFallback(section: AdminSectionKey): AdminItem[] {
  const defaults = (defaultAdminData[section] || []) as AdminItem[];
  if (typeof window === "undefined") return defaults;
  try {
    const raw = localStorage.getItem(`${FALLBACK_STORAGE_PREFIX}${section}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
    localStorage.setItem(`${FALLBACK_STORAGE_PREFIX}${section}`, JSON.stringify(defaults));
  } catch {
    // ignore storage errors
  }
  return defaults;
}

function writeLocalFallback(section: AdminSectionKey, items: AdminItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${FALLBACK_STORAGE_PREFIX}${section}`, JSON.stringify(items));
  } catch {
    // ignore storage errors
  }
}

function notifySectionUpdated(section: AdminSectionKey) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("zeony_admin_updated", { detail: { section } }));
  }
}

export function useAdminStore(section: AdminSectionKey) {
  const [items, setItems] = useState<AdminItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      const tableName = sectionToTableMap[section as string];
      if (!tableName) return;

      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) {
        if (isMissingTableError(error)) {
          if (isMounted) {
            setUsingFallback(true);
            setItems(readLocalFallback(section));
          }
        } else {
          console.error("Error loading data from Supabase:", error);
        }
      } else if (data && isMounted) {
        setUsingFallback(false);
        setItems(data.map((row) => mapDbToItem(section as string, row)));
      }
      if (isMounted) setIsLoaded(true);
    };

    loadData();

    const handleUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<{ section?: string }>;
      if (!customEvent.detail?.section || customEvent.detail.section === section) {
        loadData();
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === `${FALLBACK_STORAGE_PREFIX}${section}`) {
        loadData();
      }
    };

    window.addEventListener("zeony_admin_updated", handleUpdated);
    window.addEventListener("storage", handleStorage);

    return () => {
      isMounted = false;
      window.removeEventListener("zeony_admin_updated", handleUpdated);
      window.removeEventListener("storage", handleStorage);
    };
  }, [section]);

  const addItem = async (item: Omit<AdminItem, "id">) => {
    const tempId = usingFallback ? `local-${Date.now()}` : `temp-${Date.now()}`;
    const newItem = { ...item, id: tempId } as AdminItem;

    if (usingFallback) {
      const updated = [newItem, ...items];
      setItems(updated);
      writeLocalFallback(section, updated);
      notifySectionUpdated(section);
      return;
    }

    setItems((prev) => [newItem, ...prev]);

    const tableName = sectionToTableMap[section as string];
    if (!tableName) return;

    const rowData = mapItemToDb(section as string, item);
    const { data, error } = await supabase
      .from(tableName)
      .insert([rowData])
      .select()
      .single();

    if (error) {
      if (isMissingTableError(error)) {
        const fallbackList = [newItem, ...readLocalFallback(section).filter((i) => i.id !== tempId)];
        setUsingFallback(true);
        setItems(fallbackList);
        writeLocalFallback(section, fallbackList);
        notifySectionUpdated(section);
        return;
      }
      console.error("Failed to add item to Supabase:", error.message || error);
      setItems((prev) => prev.filter((i) => i.id !== tempId));
    } else if (data) {
      setItems((prev) => prev.map((i) => (i.id === tempId ? mapDbToItem(section as string, data) : i)));
      notifySectionUpdated(section);
    }
  };

  const deleteItem = async (id: string) => {
    const previousItems = [...items];
    const remaining = previousItems.filter((i) => i.id !== id);
    setItems(remaining);

    if (usingFallback || id.startsWith("local-")) {
      writeLocalFallback(section, remaining);
      notifySectionUpdated(section);
      return;
    }

    const tableName = sectionToTableMap[section as string];
    if (!tableName || id.startsWith("temp-")) return;

    const { error } = await supabase.from(tableName).delete().eq("id", id);
    if (error) {
      console.error("Failed to delete item from Supabase:", error.message || error);
      setItems(previousItems);
    } else {
      notifySectionUpdated(section);
    }
  };

  const resetToDefault = async () => {
    const defaults = (defaultAdminData[section] || []) as AdminItem[];
    if (usingFallback) {
      setItems(defaults);
      writeLocalFallback(section, defaults);
      notifySectionUpdated(section);
      return;
    }

    if (section === "team_members") {
      const tableName = sectionToTableMap[section as string];
      const rows = defaults.map((d) => mapItemToDb(section, d));
      const { data, error } = await supabase
        .from(tableName)
        .upsert(rows, { onConflict: "title" })
        .select();
      if (!error && data) {
        setItems(data.map((row) => mapDbToItem(section, row)));
        notifySectionUpdated(section);
      } else if (error) {
        console.error("Failed to reset team members:", error.message || error);
      }
      return;
    }

    console.warn("Reset to default is disabled in Supabase mode.");
  };

  const updateItem = async (id: string, updatedFields: Partial<AdminItem>) => {
    const previousItems = [...items];
    const nextItems = previousItems.map((i) => (i.id === id ? { ...i, ...updatedFields } : i));
    setItems(nextItems);

    if (usingFallback || id.startsWith("local-")) {
      writeLocalFallback(section, nextItems);
      notifySectionUpdated(section);
      return;
    }

    const tableName = sectionToTableMap[section as string];
    if (!tableName || id.startsWith("temp-")) return;

    const rowData = mapItemToDb(section as string, updatedFields);
    const { error, data } = await supabase
      .from(tableName)
      .update(rowData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Failed to update item in Supabase:", error.message || error);
      setItems(previousItems);
    } else if (data) {
      setItems((prev) => prev.map((i) => (i.id === id ? mapDbToItem(section as string, data) : i)));
      notifySectionUpdated(section);
    }
  };

  return {
    items,
    isLoaded,
    usingFallback,
    addItem,
    deleteItem,
    updateItem,
    resetToDefault,
  };
}

export function useSiteSettings() {
  const [settings, setSettings] = useState(defaultSiteSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("*")
          .eq("id", 1)
          .single();
          
        if (error) {
          console.error("Supabase load error for site settings:", error.message);
          // Fallback to defaults or local storage
          setSettings(defaultSiteSettings);
        } else if (data && isMounted) {
          setSettings({
            siteName: data.site_name || defaultSiteSettings.siteName,
            supportEmail: data.support_email || defaultSiteSettings.supportEmail,
            admissionsEmail: data.admissions_email || defaultSiteSettings.admissionsEmail,
            contactPhone: data.contact_phone || defaultSiteSettings.contactPhone,
            headquarters: data.headquarters || defaultSiteSettings.headquarters,
            maintenanceMode: data.maintenance_mode ? "true" : "false",
            enablePublicApplications: data.enable_public_applications ? "true" : "false"
          });
        }
      } catch (e) {
        console.error("Error loading site settings:", e);
      }
      if (isMounted) setIsLoaded(true);
    };

    loadSettings();

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ section?: string }>;
      if (!customEvent.detail || customEvent.detail.section === "site_settings") {
        loadSettings();
      }
    };

    window.addEventListener("zeony_admin_updated", handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("zeony_admin_updated", handleUpdate);
    };
  }, []);

  const saveSettings = async (newSettings: typeof defaultSiteSettings) => {
    setSettings(newSettings);
    try {
      const { error } = await supabase
        .from("site_settings")
        .upsert({
          id: 1,
          site_name: newSettings.siteName,
          support_email: newSettings.supportEmail,
          admissions_email: newSettings.admissionsEmail,
          contact_phone: newSettings.contactPhone,
          headquarters: newSettings.headquarters,
          maintenance_mode: newSettings.maintenanceMode === "true",
          enable_public_applications: newSettings.enablePublicApplications === "true"
        }, { onConflict: 'id' });
        
      if (error) {
        console.error("Error saving site settings to Supabase:", error.message);
        alert(`Failed to save to Supabase: ${error.message}`);
        return false;
      } else if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("zeony_admin_updated", { detail: { section: "site_settings" } }));
      }
      return true;
    } catch (e: unknown) {
      console.error("Failed to save site settings", e);
      alert(`Error: ${e instanceof Error ? e.message : String(e)}`);
      return false;
    }
  };

  return {
    settings,
    isLoaded,
    saveSettings
  };
}

export function useAdminAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const expiry = localStorage.getItem("zeony_admin_auth_expiry");
        if (expiry && Date.now() < parseInt(expiry, 10)) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          localStorage.removeItem("zeony_admin_auth_expiry");
        }
      } catch {
        setIsLoggedIn(false);
      }
      setIsChecking(false);
    };

    checkAuth();
    window.addEventListener("zeony_admin_auth_updated", checkAuth);
    
    // Automatically log out when session expires
    const interval = setInterval(() => {
      const expiry = localStorage.getItem("zeony_admin_auth_expiry");
      if (expiry && Date.now() >= parseInt(expiry, 10)) {
        setIsLoggedIn(false);
        localStorage.removeItem("zeony_admin_auth_expiry");
      }
    }, 10000); // Check every 10 seconds

    return () => {
      window.removeEventListener("zeony_admin_auth_updated", checkAuth);
      clearInterval(interval);
    };
  }, []);

  const login = async (username?: string, password?: string) => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', username)
        .eq('password', password)
        .single();
        
      if (error || !data) {
        return false; // Authentication failed
      }
    } catch (e) {
      console.error("Login error", e);
      return false;
    }

    // 5 minutes expiration
    const expiryTime = Date.now() + 5 * 60 * 1000;
    localStorage.setItem("zeony_admin_auth_expiry", expiryTime.toString());
    if (username) {
      localStorage.setItem("zeony_admin_email", username);
    }
    setIsLoggedIn(true);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("zeony_admin_auth_updated"));
    }
    return true;
  };

  const logout = () => {
    localStorage.removeItem("zeony_admin_auth_expiry");
    localStorage.removeItem("zeony_admin_email");
    setIsLoggedIn(false);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("zeony_admin_auth_updated"));
    }
  };

  return { isLoggedIn, isChecking, login, logout };
}
