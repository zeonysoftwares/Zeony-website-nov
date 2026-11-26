"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
  X,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Code2,
  Layout,
  Cloud,
  Database,
  Shield,
  ShieldCheck,
  Lightbulb,
  PenTool,
  Send,
  Loader2,
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  AlertCircle,
  Upload,
  MapPin,
  Clock,
  Award,
  Globe,
  Palette,
  FileText,
  CalendarDays,
  Users,
  TrendingUp,
  BookOpen,
  Handshake,
  ArrowRight,
  ArrowLeft,
  Search,
} from "lucide-react";

function createApplicationPhotoName(originalName: string): string {
  const fileExt = originalName.split(".").pop() || "jpg";
  return `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
}

const internshipDomains = [
  { id: "int-web", name: "Web Development", icon: Code2, desc: "React, Next.js & Full-Stack" },
  { id: "int-ai", name: "AIML And Generative AI", icon: Lightbulb, desc: "LLMs, RAG & TensorFlow" },
  { id: "int-java", name: "Java Full Stack", icon: PenTool, desc: "Spring Boot & React" },
  { id: "int-data", name: "Data Analyst", icon: Database, desc: "Python, SQL & PowerBI" },
  { id: "int-cyber", name: "Cyber Security", icon: Shield, desc: "Ethical Hacking & Audits" },
  { id: "int-digital", name: "Digital Marketing", icon: Globe, desc: "SEO & Growth Strategy" },
  { id: "int-uiux", name: "UI/UX Design", icon: Layout, desc: "Figma & Design Systems" },
  { id: "int-cloud", name: "Cloud Computing & DevOps", icon: Cloud, desc: "AWS, Docker & CI/CD" },
];

const projectDevelopmentDomains = [
  { id: "proj-genai", name: "Gen AI & ML", icon: Lightbulb, desc: "LLMs, Diffusion Models, Prompt Eng & Machine Learning" },
  { id: "proj-aimodel", name: "AI Model Development", icon: Database, desc: "Custom Neural Networks, Fine-Tuning & Model Deployment" },
  { id: "proj-fullstack", name: "Full Stack Development", icon: Code2, desc: "Enterprise Next.js, React, Node.js & Scalable Databases" },
  { id: "proj-appdev", name: "App Development", icon: Layout, desc: "Cross-Platform iOS & Android Native Mobile Apps" },
];

const trainingDomains = [
  { id: "trn-ind", name: "Industry-Oriented Training & Certification", icon: GraduationCap, desc: "Bootcamps & skill programs" },
  { id: "trn-int", name: "Internship & Live Projects", icon: Briefcase, desc: "Guided production experience" },
  { id: "trn-tech", name: "Technology & Innovation Support", icon: Lightbulb, desc: "Modern tooling & guidance" },
  { id: "trn-place", name: "Placement Assistance", icon: Users, desc: "Mock interviews & referrals" },
  { id: "trn-car", name: "Career Guidance & Employability", icon: TrendingUp, desc: "Resume & soft skills" },
  { id: "trn-res", name: "Research & Learning Initiatives", icon: BookOpen, desc: "Collaborative tech research" },
  { id: "trn-wks", name: "Workshops, Webinars & Events", icon: Calendar, desc: "Interactive tech sessions" },
  { id: "trn-cert", name: "Certifications & Skill Programs", icon: Award, desc: "Verified credentials" },
  { id: "trn-collab", name: "Industry-Academia Collaboration", icon: Handshake, desc: "Campus training & MoUs" },
];

const workshopTracks = [
  { id: "wks-ai", name: "AI Engineering", icon: Lightbulb, desc: "Enterprise AI Agents & LLMs" },
  { id: "wks-ds", name: "Data Science", icon: Database, desc: "Predictive Modeling & ML" },
  { id: "wks-da", name: "Data Analytics", icon: Database, desc: "SQL, Tableau & Dashboards" },
  { id: "wks-fs", name: "Full Stack Software Developer", icon: Code2, desc: "Frontend & Backend Systems" },
  { id: "wks-dsa", name: "Data Structures and Algorithms (DSA)", icon: PenTool, desc: "Problem Solving & Interviews" },
  { id: "wks-cs", name: "Cybersecurity", icon: Shield, desc: "Network Defense & Auditing" },
  { id: "wks-devops", name: "DevOps", icon: Cloud, desc: "Docker, Kubernetes & CI/CD" },
  { id: "wks-ml", name: "Machine Learning", icon: Lightbulb, desc: "Supervised & Unsupervised ML" },
  { id: "wks-sql", name: "SQL", icon: Database, desc: "Database Design & Tuning" },
  { id: "wks-cloud", name: "Cloud Fundamentals", icon: Cloud, desc: "AWS, Azure & GCP Basics" },
  { id: "wks-hr", name: "Human Resource", icon: Users, desc: "Talent & HR Analytics" },
  { id: "wks-ba", name: "Business Analytics", icon: TrendingUp, desc: "BI & Market Strategy" },
  { id: "wks-fin", name: "Finance", icon: Award, desc: "Modeling & Risk Management" },
  { id: "wks-stock", name: "Stock Market", icon: TrendingUp, desc: "Technical & Portfolio Strategy" },
  { id: "wks-dm", name: "Digital Marketing", icon: Globe, desc: "SEO, SEM & Brand Growth" },
  { id: "wks-psych", name: "Psychology", icon: User, desc: "Behavioral Science & EQ" },
  { id: "wks-gfx", name: "Graphics Designing", icon: Palette, desc: "Photoshop & Visual Branding" },
  { id: "wks-med", name: "Medical Coding", icon: FileText, desc: "ICD-10 & CPT Documentation" },
];

const durationOptions = ["15 days", "30 days", "45 days", "2 months", "3 months", "6 months"];

const stepLabels = [
  { step: 1, title: "Program" },
  { step: 2, title: "Personal" },
  { step: 3, title: "Education" },
] as const;

export function ApplicationPopupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [programType, setProgramType] = useState<"project_development" | "training" | "internship" | "workshops">("project_development");
  const [selectedDomain, setSelectedDomain] = useState<string>("proj-genai");
  const [trackSearch, setTrackSearch] = useState("");
  const [duration, setDuration] = useState<string>("30 days");
  const [dateOfJoining, setDateOfJoining] = useState<string>("");

  // Personal Info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoName, setPhotoName] = useState<string>("");

  // Academic Info
  const [institution, setInstitution] = useState("");
  const [degreeDept, setDegreeDept] = useState("");
  const [currentYear, setCurrentYear] = useState("3rd Year");
  const [cgpa, setCgpa] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const scrollBodyRef = useRef<HTMLDivElement>(null);

  const activeDomains =
    programType === "project_development"
      ? projectDevelopmentDomains
      : programType === "internship"
        ? internshipDomains
        : programType === "workshops"
          ? workshopTracks
          : trainingDomains;

  const filteredDomains = trackSearch.trim()
    ? activeDomains.filter(
        (d) =>
          d.name.toLowerCase().includes(trackSearch.toLowerCase()) ||
          d.desc.toLowerCase().includes(trackSearch.toLowerCase())
      )
    : activeDomains;

  const selectedDomainObj = activeDomains.find((d) => d.id === selectedDomain);

  useEffect(() => {
    const handleOpenModal = (e: Event) => {
      const customEvent = e as CustomEvent<{
        type?: "project_development" | "training" | "internship" | "workshops";
        domainId?: string;
      }>;
      if (customEvent.detail?.type) {
        const type = customEvent.detail.type;
        setProgramType(type);
        if (type === "project_development") {
          setSelectedDomain("proj-genai");
        } else if (type === "internship") {
          setSelectedDomain("int-web");
        } else if (type === "workshops") {
          setSelectedDomain("wks-ai");
        } else {
          setSelectedDomain("trn-ind");
        }
      }
      if (customEvent.detail?.domainId) {
        setSelectedDomain(customEvent.detail.domainId);
      }
      setTrackSearch("");
      setStep(1);
      setErrorMsg("");
      setIsSuccess(false);
      setIsOpen(true);
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("open-application-modal", handleOpenModal);
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("open-application-modal", handleOpenModal);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("zeony-scroll-lock", { detail: { locked: isOpen } })
    );
    return () => {
      window.dispatchEvent(
        new CustomEvent("zeony-scroll-lock", { detail: { locked: false } })
      );
    };
  }, [isOpen]);

  useEffect(() => {
    scrollBodyRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, isSuccess]);

  const handleProgramChange = (type: "project_development" | "training" | "internship" | "workshops") => {
    setProgramType(type);
    setTrackSearch("");
    if (type === "project_development") {
      setSelectedDomain("proj-genai");
    } else if (type === "internship") {
      setSelectedDomain("int-web");
    } else if (type === "workshops") {
      setSelectedDomain("wks-ai");
    } else {
      setSelectedDomain("trn-ind");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("zeony_app_popup_seen", "true");
  };

  const handleNextStep = () => {
    setErrorMsg("");
    if (step === 1) {
      if (!selectedDomain) {
        setErrorMsg("Please select a domain or track.");
        return;
      }
      if (!dateOfJoining) {
        setErrorMsg("Please pick your expected joining date.");
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!name.trim() || !email.trim() || !phone.trim() || !dob || !address.trim()) {
        setErrorMsg("Please fill in your name, email, phone, date of birth, and address.");
        return;
      }
      if (!email.includes("@")) {
        setErrorMsg("Please enter a valid email address.");
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution.trim() || !degreeDept.trim() || !cgpa.trim()) {
      setErrorMsg("Please complete your institution, degree/department, and CGPA or percentage.");
      return;
    }
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      let photoUrl = "";
      if (photo) {
        const fileName = createApplicationPhotoName(photo.name);
        const filePath = `applications/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("storage_images")
          .upload(filePath, photo);

        if (uploadError) {
          console.warn("Storage upload warning:", uploadError.message);
        } else if (uploadData) {
          const { data: publicUrlData } = supabase.storage
            .from("storage_images")
            .getPublicUrl(filePath);
          photoUrl = publicUrlData?.publicUrl || "";
        }
      }

      // Compatibility mapping for Supabase CHECK constraint
      const dbProgramType =
        programType === "project_development" ? "training" : programType;

      const { error: insertError } = await supabase.from("academy_applications").insert([
        {
          program_type: dbProgramType,
          domain_or_track:
            programType === "project_development"
              ? `Project Development - ${selectedDomainObj?.name || selectedDomain}`
              : selectedDomainObj?.name || selectedDomain,
          duration: duration,
          expected_joining_date: dateOfJoining,
          full_name: name,
          email: email,
          phone: phone,
          dob: dob,
          residential_address: address,
          institution_name: institution,
          degree_and_dept: degreeDept,
          current_year: currentYear,
          cgpa_or_percentage: cgpa,
          passport_photo_url: photoUrl,
          status: "pending",
        },
      ]);

      if (insertError) {
        console.error("Error inserting into academy_applications:", insertError);
        setErrorMsg(`Failed to submit: ${insertError.message}`);
        setIsSubmitting(false);
        return;
      }

      try {
        await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            phone,
            course: `${programType.toUpperCase()} - ${selectedDomainObj?.name || selectedDomain}`,
            message: `New application received for ${selectedDomainObj?.name || selectedDomain}. Details are in the table below.`,
            source: "Academy Application Modal",
            extraFields: {
              "Applied Role": selectedDomainObj?.name || selectedDomain,
              "Program Type": programType.charAt(0).toUpperCase() + programType.slice(1),
              Duration: duration,
              "Expected Joining Date": dateOfJoining,
              "Date of Birth": dob,
              "Residential Address": address,
              "Institution Name": institution,
              "Degree & Dept": degreeDept,
              "Current Year": currentYear,
              "CGPA/Percentage": cgpa,
            },
          }),
        });
      } catch (err) {
        console.error("Failed to send email notification", err);
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      sessionStorage.setItem("zeony_app_popup_seen", "true");
    } catch (err: unknown) {
      console.error("Submission error:", err);
      setErrorMsg(
        err instanceof Error ? err.message : "An unexpected error occurred during submission."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-hidden"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90dvh]"
          >
            {/* Header */}
            <div className="px-5 sm:px-7 pt-5 pb-4 border-b border-border bg-muted/30 shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-semibold">
                    Zeony Academy Admissions
                  </span>
                  <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground mt-0.5">
                    {isSuccess ? "Application Received" : "Quick Program Application"}
                  </h2>
                </div>
                <button
                  type="button"
                  aria-label="Close modal"
                  onClick={handleClose}
                  className="w-9 h-9 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Simple 3-Step Progress Bar */}
              {!isSuccess && (
                <div className="mt-4">
                  <div className="grid grid-cols-3 gap-2">
                    {stepLabels.map((item) => {
                      const isActive = step === item.step;
                      const isDone = step > item.step;
                      return (
                        <button
                          key={item.step}
                          type="button"
                          disabled={item.step > step}
                          onClick={() => {
                            if (item.step < step) {
                              setErrorMsg("");
                              setStep(item.step);
                            }
                          }}
                          className={`text-left px-3 py-2 rounded-xl border text-xs font-semibold transition-all flex items-center gap-2 ${
                            isActive
                              ? "border-primary bg-primary/10 text-primary"
                              : isDone
                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 cursor-pointer"
                                : "border-border bg-card/60 text-muted-foreground cursor-default"
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center shrink-0 ${
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : isDone
                                  ? "bg-emerald-500 text-white"
                                  : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {isDone ? "✓" : item.step}
                          </span>
                          <span className="truncate">{item.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Scrollable Body (No Nested Scroll Traps) */}
            <div
              ref={scrollBodyRef}
              data-lenis-prevent
              className="p-5 sm:p-7 overflow-y-auto overscroll-contain flex-1 min-h-0 custom-scrollbar touch-pan-y"
            >
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-6 text-center max-w-md mx-auto"
                >
                  <div className="w-16 h-16 bg-emerald-500/15 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
                    Thank you, {name}!
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    Your application for{" "}
                    <span className="font-semibold text-foreground">
                      {selectedDomainObj?.name}
                    </span>{" "}
                    ({duration}) from{" "}
                    <span className="font-semibold text-foreground">{institution}</span> has been
                    submitted. Our admissions team will contact you within 24 hours.
                  </p>
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border text-left mb-6 space-y-2 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex justify-between gap-4">
                      <span>Program:</span>
                      <span className="font-semibold text-foreground capitalize">{programType}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Track:</span>
                      <span className="font-semibold text-foreground text-right">
                        {selectedDomainObj?.name}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Duration:</span>
                      <span className="font-semibold text-foreground">{duration}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Joining Date:</span>
                      <span className="font-semibold text-foreground">{dateOfJoining}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full sm:w-auto px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
                  >
                    Done
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* STEP 1: PROGRAM & SCHEDULE */}
                  {step === 1 && (
                    <div className="space-y-6">
                      {/* Program Type Tabs */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                          1. Choose Program Type
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { id: "project_development", label: "Project Development Training", icon: Lightbulb },
                            { id: "internship", label: "Internship", icon: Briefcase },
                            { id: "training", label: "Training", icon: GraduationCap },
                            { id: "workshops", label: "Workshop", icon: CalendarDays },
                          ].map((tab) => {
                            const Icon = tab.icon;
                            const active = programType === tab.id;
                            return (
                              <button
                                key={tab.id}
                                type="button"
                                onClick={() =>
                                  handleProgramChange(
                                    tab.id as "project_development" | "training" | "internship" | "workshops"
                                  )
                                }
                                className={`p-2.5 sm:p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 text-xs font-semibold ${
                                  active
                                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                                    : "border-border bg-background hover:bg-muted text-foreground"
                                }`}
                              >
                                <Icon className="w-4 h-4 shrink-0" />
                                <span className="line-clamp-2 leading-tight">{tab.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Track / Domain Picker */}
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            2. Select{" "}
                            {programType === "project_development"
                              ? "Project Domain"
                              : programType === "internship"
                                ? "Internship Domain"
                                : programType === "workshops"
                                  ? "Workshop Track"
                                  : "Training Program"}
                          </label>
                          {activeDomains.length > 9 && (
                            <div className="relative w-full sm:w-52">
                              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                              <input
                                type="text"
                                value={trackSearch}
                                onChange={(e) => setTrackSearch(e.target.value)}
                                placeholder="Filter tracks..."
                                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-background border border-border text-xs focus:outline-none focus:border-primary"
                              />
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {filteredDomains.map((domain) => {
                            const Icon = domain.icon;
                            const isSelected = selectedDomain === domain.id;
                            return (
                              <button
                                key={domain.id}
                                type="button"
                                onClick={() => setSelectedDomain(domain.id)}
                                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                                  isSelected
                                    ? "border-primary bg-primary/10 ring-1 ring-primary"
                                    : "border-border bg-background hover:bg-muted/60"
                                }`}
                              >
                                <div
                                  className={`p-2 rounded-lg shrink-0 ${
                                    isSelected
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="font-semibold text-xs sm:text-sm text-foreground truncate">
                                    {domain.name}
                                  </div>
                                  <div className="text-[11px] text-muted-foreground truncate">
                                    {domain.desc}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Duration & Joining Date */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/60">
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-primary" /> Preferred Duration
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {durationOptions.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setDuration(opt)}
                                className={`py-2 px-2 rounded-lg border text-xs font-semibold transition-colors ${
                                  duration === opt
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background border-border text-foreground hover:bg-muted"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                            <CalendarDays className="w-3.5 h-3.5 text-primary" /> Expected Joining Date *
                          </label>
                          <input
                            type="date"
                            required
                            value={dateOfJoining}
                            onChange={(e) => setDateOfJoining(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:outline-none text-sm text-foreground"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: PERSONAL INFO */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">
                            Full Name *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                              type="text"
                              required
                              placeholder="Jane Doe"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:outline-none text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">
                            Email Address *
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                              type="email"
                              required
                              placeholder="jane@example.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:outline-none text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">
                            Phone / WhatsApp *
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                              type="tel"
                              required
                              placeholder="+91 98765 43210"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:outline-none text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">
                            Date of Birth *
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                              type="date"
                              required
                              value={dob}
                              onChange={(e) => setDob(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:outline-none text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1.5">
                          Residential Address *
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="text"
                            required
                            placeholder="Street, City, State, Pincode"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:outline-none text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1.5">
                          Passport Size Photo <span className="text-muted-foreground font-normal">(Optional)</span>
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          id="photo-upload"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setPhoto(e.target.files[0]);
                              setPhotoName(e.target.files[0].name);
                            }
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor="photo-upload"
                          className="w-full px-4 py-2.5 rounded-xl bg-background border border-dashed border-border hover:border-primary cursor-pointer flex items-center justify-between text-xs sm:text-sm text-muted-foreground transition-colors"
                        >
                          <span className="truncate flex items-center gap-2 text-foreground font-medium">
                            <Upload className="w-4 h-4 text-primary shrink-0" />
                            {photoName || "Upload photo (JPG/PNG)..."}
                          </span>
                          <span className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-semibold shrink-0 ml-2">
                            Choose File
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: ACADEMIC INFO */}
                  {step === 3 && (
                    <div className="space-y-5">
                      <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-xs sm:text-sm flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold text-primary capitalize">
                          {programType}: {selectedDomainObj?.name}
                        </span>
                        <span className="text-muted-foreground font-medium">
                          {duration} • Starts {dateOfJoining}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">
                            Institution / College Name *
                          </label>
                          <div className="relative">
                            <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. Anna University"
                              value={institution}
                              onChange={(e) => setInstitution(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:outline-none text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">
                            Degree &amp; Department *
                          </label>
                          <div className="relative">
                            <Award className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. B.E. Computer Science"
                              value={degreeDept}
                              onChange={(e) => setDegreeDept(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:outline-none text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">
                            Current Year *
                          </label>
                          <select
                            value={currentYear}
                            onChange={(e) => setCurrentYear(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:outline-none text-sm"
                          >
                            <option value="1st Year">1st Year Student</option>
                            <option value="2nd Year">2nd Year Student</option>
                            <option value="3rd Year">3rd Year Student</option>
                            <option value="Final Year / 4th Year">Final Year / 4th Year</option>
                            <option value="Graduated">Graduated / Job Seeker</option>
                            <option value="Post Graduate">Post Graduate Student</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">
                            CGPA / Percentage *
                          </label>
                          <div className="relative">
                            <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                              type="text"
                              required
                              placeholder="e.g. 8.5 CGPA or 85%"
                              value={cgpa}
                              onChange={(e) => setCgpa(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:outline-none text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1">
                        <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                        Your details are securely handled by Zeony Technologies Admissions.
                      </div>
                    </div>
                  )}

                  {errorMsg && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs sm:text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={() => {
                          setErrorMsg("");
                          setStep((prev) => (prev === 3 ? 2 : 1));
                        }}
                        className="px-5 py-2.5 rounded-full border border-border bg-background hover:bg-muted text-foreground text-sm font-semibold inline-flex items-center gap-1.5 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground">Step 1 of 3</span>
                    )}

                    {step < 3 ? (
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="px-7 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors inline-flex items-center gap-1.5 shadow-md shadow-primary/20 ml-auto"
                      >
                        Continue <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-7 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors inline-flex items-center gap-2 shadow-md shadow-primary/20 disabled:opacity-60 ml-auto"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                          </>
                        ) : (
                          <>
                            Submit Application <Send className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
