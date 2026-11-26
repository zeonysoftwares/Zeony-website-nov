"use client";

import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export interface ActivityLog {
  id: string;
  action: string;
  category: "application" | "inquiry" | "content" | "settings" | "auth" | "general";
  description: string;
  actor?: string;
  created_at: string;
}

const STORAGE_KEY = "zeony_admin_activity_logs";

export function logAdminActivity(
  action: string,
  category: ActivityLog["category"],
  description: string
) {
  try {
    const actor =
      typeof window !== "undefined"
        ? localStorage.getItem("zeony_admin_email") || "Super Admin"
        : "Super Admin";

    const newLog: ActivityLog = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      action,
      category,
      description,
      actor,
      created_at: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      const existing = localStorage.getItem(STORAGE_KEY);
      const parsed: ActivityLog[] = existing ? JSON.parse(existing) : [];
      const updated = [newLog, ...parsed].slice(0, 100); // keep last 100 logs
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("zeony_activity_updated", { detail: newLog }));
    }

    // Try logging to Supabase if table exists
    supabase
      .from("admin_activity_logs")
      .insert([
        {
          action,
          category,
          description,
          actor,
        },
      ])
      .then(({ error }) => {
        if (error) {
          // Table might not be created yet in user's Supabase instance, which is fine
        }
      });
  } catch (e) {
    console.warn("Failed to record activity log:", e);
  }
}

export function useActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadLogs = async () => {
      // 1. Try local storage first
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setLogs(JSON.parse(stored));
        }
      } catch (e) {
        console.warn("Could not read local activity logs", e);
      }

      // 2. Try fetching from Supabase
      try {
        const { data, error } = await supabase
          .from("admin_activity_logs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50);

        if (!error && data && data.length > 0) {
          setLogs(data);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
      } catch (e) {
        // Fallback to local logs
      }

      setIsLoaded(true);
    };

    loadLogs();

    const handleUpdate = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setLogs(JSON.parse(stored));
        }
      } catch {}
    };

    window.addEventListener("zeony_activity_updated", handleUpdate);
    return () => window.removeEventListener("zeony_activity_updated", handleUpdate);
  }, []);

  const clearLogs = async () => {
    localStorage.removeItem(STORAGE_KEY);
    setLogs([]);
    try {
      await supabase.from("admin_activity_logs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    } catch {}
  };

  return { logs, isLoaded, clearLogs };
}
