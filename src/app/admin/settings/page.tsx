"use client";

import React, { useState, useSyncExternalStore } from "react";
import {
  Save,
  CheckCircle2,
  Globe,
  Mail,
  Phone,
  MapPin,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteSettings } from "@/lib/adminStore";

const emptySubscribe = () => () => {};

function getStoredAdminEmail(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("zeony_admin_email") || "";
}

export default function SiteSettingsAdminPage() {
  const { settings: globalSettings, saveSettings } = useSiteSettings();
  const [draftSettings, setDraftSettings] = useState<typeof globalSettings | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const storedEmail = useSyncExternalStore(emptySubscribe, getStoredAdminEmail, () => "");
  const [adminEmailInput, setAdminEmailInput] = useState<string | null>(null);
  const adminEmail = adminEmailInput ?? storedEmail;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [isUpdatingPw, setIsUpdatingPw] = useState(false);

  const settings = draftSettings ?? globalSettings;
  const setSettings = (next: typeof globalSettings) => setDraftSettings(next);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const success = await saveSettings(settings);
    setIsSaving(false);

    if (success) {
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (!adminEmail) {
      setPwError("Please enter your admin email.");
      return;
    }
    if (newPassword.length < 6) {
      setPwError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("New password and confirmation do not match.");
      return;
    }

    setIsUpdatingPw(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: adminEmail,
          currentPassword,
          newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setPwError(data.message || "Failed to update password.");
      } else {
        setPwSuccess(data.message || "Admin password updated successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setPwError("Network error occurred. Please try again.");
    } finally {
      setIsUpdatingPw(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <AnimatePresence>
        {showSaved && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm font-medium"
          >
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            Global Site Settings Updated Successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Site Settings */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-2">
          Global Site Settings
        </h1>
        <p className="text-sm text-slate-400 mb-8">
          Configure contact details, application admissions switches, and global system metadata.
        </p>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                Website Name / Title
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-blue-500 focus:outline-none text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                Primary Contact Phone
              </label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-blue-500 focus:outline-none text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                General Support Email
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-blue-500 focus:outline-none text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                Admissions Department Email
              </label>
              <input
                type="email"
                value={settings.admissionsEmail}
                onChange={(e) => setSettings({ ...settings, admissionsEmail: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-blue-500 focus:outline-none text-sm text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-400" />
              Headquarters / Office Location
            </label>
            <input
              type="text"
              value={settings.headquarters}
              onChange={(e) => setSettings({ ...settings, headquarters: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-blue-500 focus:outline-none text-sm text-white"
            />
          </div>

          <div className="pt-6 border-t border-slate-800/80 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 ${
                isSaving
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:from-blue-500 hover:to-indigo-500 transform hover:scale-105 active:scale-95"
              }`}
            >
              <Save className="w-5 h-5" />
              <span>{isSaving ? "Saving..." : "Save Settings"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Admin Security & Password Management */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-white">Admin Account Security</h2>
            <p className="text-xs text-slate-400">
              Update your admin panel password with real-time visibility controls.
            </p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-5 mt-6">
          {pwError && (
            <div className="p-3 bg-red-500/10 border border-red-500/40 rounded-xl text-red-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{pwError}</span>
            </div>
          )}
          {pwSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{pwSuccess}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmailInput(e.target.value)}
                placeholder="admin@zeonytechnologies.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-blue-500 focus:outline-none text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPw ? "text" : "password"}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full pl-4 pr-11 py-3 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-blue-500 focus:outline-none text-sm text-white"
                />
                <button
                  type="button"
                  aria-label={showCurrentPw ? "Hide current password" : "View current password"}
                  onClick={() => setShowCurrentPw((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPw ? "text" : "password"}
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-4 pr-11 py-3 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-blue-500 focus:outline-none text-sm text-white"
                />
                <button
                  type="button"
                  aria-label={showNewPw ? "Hide new password" : "View new password"}
                  onClick={() => setShowNewPw((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPw ? "text" : "password"}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full pl-4 pr-11 py-3 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-blue-500 focus:outline-none text-sm text-white"
                />
                <button
                  type="button"
                  aria-label={showConfirmPw ? "Hide confirm password" : "View confirm password"}
                  onClick={() => setShowConfirmPw((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-end">
            <button
              type="submit"
              disabled={isUpdatingPw}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-60"
            >
              <KeyRound className="w-4 h-4 text-blue-400" />
              <span>{isUpdatingPw ? "Updating..." : "Update Admin Password"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
