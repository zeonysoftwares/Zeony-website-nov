"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Image as ImageIcon,
  Code2,
  Box,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  ExternalLink,
  Handshake,
  GraduationCap,
  Briefcase,
  Calendar,
  ShieldCheck,
  Eye,
  EyeOff,
  KeyRound,
  ArrowLeft,
  Mail,
  CheckCircle2,
  UserCheck,
  Inbox,
  FolderOpen,
  History,
} from "lucide-react";
import Image from "next/image";
import { useAdminAuth } from "@/lib/adminStore";
import { supabase } from "@/lib/supabase";

type AuthView = "login" | "forgot-request" | "forgot-reset";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isLoggedIn, isChecking, login, logout } = useAdminAuth();

  // Badge notification counts
  const [pendingApps, setPendingApps] = useState(0);
  const [newInquiries, setNewInquiries] = useState(0);

  React.useEffect(() => {
    if (!isLoggedIn) return;
    const fetchCounts = async () => {
      try {
        const { count: appCount } = await supabase
          .from("academy_applications")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending");
        if (appCount !== null && appCount !== undefined) setPendingApps(appCount);
      } catch {}

      try {
        const { count: inqCount } = await supabase
          .from("contact_inquiries")
          .select("id", { count: "exact", head: true })
          .eq("status", "new");
        if (inqCount !== null && inqCount !== undefined) setNewInquiries(inqCount);
      } catch {}
    };

    fetchCounts();
    const handleUpdate = () => fetchCounts();
    window.addEventListener("zeony_activity_updated", handleUpdate);
    return () => window.removeEventListener("zeony_activity_updated", handleUpdate);
  }, [isLoggedIn]);

  // Login state
  const [authView, setAuthView] = useState<AuthView>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Forgot/Reset Password state
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const menuItems = [
    { label: "OVERVIEW", isHeader: true },
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Activity Logs", href: "/admin/activity", icon: History },
    { label: "INBOX & LEADS", isHeader: true },
    { name: "Inquiries & Leads", href: "/admin/inquiries", icon: Inbox, badge: newInquiries },
    { name: "Applications", href: "/admin/applications", icon: UserCheck, badge: pendingApps },
    { label: "CONTENT MANAGEMENT", isHeader: true },
    { name: "Hero Slides", href: "/admin/hero", icon: ImageIcon },
    { name: "Services", href: "/admin/services", icon: Code2 },
    { name: "Products", href: "/admin/products", icon: Box },
    { name: "Clients & Brands", href: "/admin/clients", icon: Users },
    { name: "Collaborations", href: "/admin/collaboration", icon: Handshake },
    { name: "Training & Certs", href: "/admin/training", icon: GraduationCap },
    { name: "Internships", href: "/admin/internships", icon: Briefcase },
    { name: "Workshops", href: "/admin/workshops", icon: Calendar },
    { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
    { name: "Team Members", href: "/admin/team-members", icon: UserCheck },
    { name: "Featured Work", href: "/admin/featured-work", icon: Code2 },
    { label: "ASSETS & SETTINGS", isHeader: true },
    { name: "Media Library", href: "/admin/media", icon: FolderOpen },
    { name: "Site Settings", href: "/admin/settings", icon: Settings },
  ];

  const handleRequestResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetting(true);
    setResetError("");
    setResetMessage("");

    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setResetError(data.message || "Could not send verification code.");
      } else {
        setResetMessage(data.message);
        setAuthView("forgot-reset");
      }
    } catch {
      setResetError("Network error occurred. Please try again.");
    } finally {
      setIsResetting(false);
    }
  };

  const handleConfirmResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");
    setResetMessage("");

    if (newPassword.length < 6) {
      setResetError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setResetError("Passwords do not match.");
      return;
    }

    setIsResetting(true);
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetEmail,
          code: resetCode,
          newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setResetError(data.message || "Failed to reset password.");
      } else {
        setLoginSuccess(data.message || "Password updated. You can now log in.");
        setUsername(resetEmail);
        setPassword("");
        setResetCode("");
        setNewPassword("");
        setConfirmNewPassword("");
        setAuthView("login");
      }
    } catch {
      setResetError("Network error occurred. Please try again.");
    } finally {
      setIsResetting(false);
    }
  };

  if (!isLoggedIn && !isChecking) {
    return (
      <div className="min-h-dvh bg-[#070d22] text-slate-200 flex items-center justify-center p-6 py-10 font-sans relative overflow-y-auto overflow-x-hidden">
        <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-md w-full bg-[#0c194b]/90 border border-blue-900/40 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center p-2 shadow-xl mb-4">
              <Image
                src="/img/z-logo.jpg"
                alt="Zeony Logo"
                width={48}
                height={48}
                className="object-contain rounded"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {authView === "login"
                ? "Zeony Admin Access"
                : authView === "forgot-request"
                  ? "Forgot Password"
                  : "Reset Admin Password"}
            </h2>
            <p className="text-xs text-blue-300/80 mt-1 uppercase tracking-wider font-semibold">
              {authView === "login"
                ? "Restricted Management Panel"
                : "Email Verification Recovery"}
            </p>
          </div>

          {authView === "login" && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsLoggingIn(true);
                setLoginError("");
                setLoginSuccess("");

                const success = await login(username, password);

                if (!success) {
                  setLoginError("Invalid username or password.");
                }
                setIsLoggingIn(false);
              }}
              className="space-y-5"
            >
              {loginError && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-xs font-semibold text-center">
                  {loginError}
                </div>
              )}
              {loginSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-semibold text-center flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{loginSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-blue-200 uppercase tracking-wider mb-2">
                  Username or Email
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#09133a]/80 border border-blue-900/50 focus:border-blue-500 focus:outline-none text-sm text-white"
                  placeholder="Enter admin email"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-blue-200 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(username.includes("@") ? username : "");
                      setResetError("");
                      setResetMessage("");
                      setAuthView("forgot-request");
                    }}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 rounded-xl bg-[#09133a]/80 border border-blue-900/50 focus:border-blue-500 focus:outline-none text-sm text-white"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "View password"}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-blue-300/75 hover:text-white hover:bg-blue-900/40 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className={`w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 ${
                  isLoggingIn
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:from-blue-500 hover:to-indigo-500 transform hover:scale-[1.02] active:scale-98"
                }`}
              >
                <ShieldCheck className="w-5 h-5" />
                <span>{isLoggingIn ? "Verifying..." : "Login to Admin Panel"}</span>
              </button>
            </form>
          )}

          {authView === "forgot-request" && (
            <form onSubmit={handleRequestResetCode} className="space-y-5">
              {resetError && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-xs font-semibold text-center">
                  {resetError}
                </div>
              )}

              <p className="text-xs text-blue-200/80 leading-relaxed text-center">
                Enter your registered admin email address. We will send a 6-digit verification code valid for 10 minutes.
              </p>

              <div>
                <label className="block text-xs font-semibold text-blue-200 uppercase tracking-wider mb-2">
                  Registered Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-blue-300/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#09133a]/80 border border-blue-900/50 focus:border-blue-500 focus:outline-none text-sm text-white"
                    placeholder="admin@zeonytechnologies.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isResetting}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                <KeyRound className="w-4 h-4" />
                <span>{isResetting ? "Sending Code..." : "Send Verification Code"}</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthView("login")}
                className="w-full py-2.5 text-xs font-semibold text-blue-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
              </button>
            </form>
          )}

          {authView === "forgot-reset" && (
            <form onSubmit={handleConfirmResetPassword} className="space-y-4">
              {resetMessage && (
                <div className="p-3 bg-blue-500/15 border border-blue-400/40 rounded-xl text-blue-200 text-xs text-center">
                  {resetMessage}
                </div>
              )}
              {resetError && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-xs font-semibold text-center">
                  {resetError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-blue-200 uppercase tracking-wider mb-1.5">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  maxLength={6}
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#09133a]/80 border border-blue-900/50 focus:border-blue-500 focus:outline-none text-sm text-white font-mono tracking-[0.3em] text-center"
                  placeholder="000000"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-blue-200 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 rounded-xl bg-[#09133a]/80 border border-blue-900/50 focus:border-blue-500 focus:outline-none text-sm text-white"
                    placeholder="At least 6 characters"
                  />
                  <button
                    type="button"
                    aria-label={showNewPassword ? "Hide new password" : "View new password"}
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-blue-300/75 hover:text-white hover:bg-blue-900/40 transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-blue-200 uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 rounded-xl bg-[#09133a]/80 border border-blue-900/50 focus:border-blue-500 focus:outline-none text-sm text-white"
                    placeholder="Re-enter new password"
                  />
                  <button
                    type="button"
                    aria-label={
                      showConfirmPassword ? "Hide confirm password" : "View confirm password"
                    }
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-blue-300/75 hover:text-white hover:bg-blue-900/40 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isResetting}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isResetting ? "Updating Password..." : "Update Password"}</span>
              </button>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setAuthView("forgot-request")}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Resend Code
                </button>
                <button
                  type="button"
                  onClick={() => setAuthView("login")}
                  className="text-xs text-blue-300 hover:text-white transition-colors"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-blue-900/30 text-center">
            <Link href="/" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
              ← Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-dvh overflow-hidden bg-[#070d22] text-slate-200 flex font-sans">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 h-full shrink-0 bg-[#0c194b] border-r border-blue-900/30 flex flex-col overflow-hidden transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 flex items-center gap-3.5 border-b border-blue-900/40 bg-[#09133a]/50 shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center p-1.5 shadow-lg shrink-0">
            <Image
              src="/img/z-logo.jpg"
              alt="Zeony Logo"
              width={32}
              height={32}
              className="object-contain rounded"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight leading-none">
              Zeony Admin
            </h2>
            <p className="text-[11px] font-medium text-blue-300/80 mt-1 tracking-wider uppercase">
              Management Panel
            </p>
          </div>
        </div>

        <nav
          data-lenis-prevent
          className="flex-1 min-h-0 p-4 space-y-1 overflow-y-auto overscroll-contain custom-scrollbar"
        >
          {menuItems.map((item, idx) => {
            if (item.isHeader) {
              return (
                <div
                  key={idx}
                  className="pt-5 pb-2 px-3 text-[11px] font-bold text-blue-300/60 uppercase tracking-widest font-mono"
                >
                  {item.label}
                </div>
              );
            }
            const Icon = item.icon || Home;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname?.startsWith(item.href || ""));

            return (
              <Link
                key={idx}
                href={item.href || "/admin"}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 font-semibold"
                    : "text-blue-100/70 hover:text-white hover:bg-blue-900/30"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? "text-white" : "text-blue-300/70"
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </div>
                {typeof item.badge === "number" && item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500 text-white shadow-sm shrink-0">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-blue-900/40 bg-[#09133a]/40 space-y-3 shrink-0">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0 border-2 border-emerald-400">
              S
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">Super Admin</p>
              <p className="text-xs text-blue-300/70 truncate">Administrator</p>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              window.location.href = "/";
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 hover:text-red-200 text-sm font-semibold transition-all border border-red-500/30 flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 h-full">
        <header className="h-16 shrink-0 border-b border-slate-800 bg-[#0a1026]/80 backdrop-blur-md px-6 flex items-center justify-between z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE ADMIN MODE</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 text-xs font-semibold transition-all border border-blue-500/30 flex items-center gap-2"
            >
              <span>View Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        <main
          data-lenis-prevent
          className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain custom-scrollbar p-6 sm:p-8 lg:p-10"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
