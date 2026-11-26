"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionConfig } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { ApplicationPopupModal } from "@/components/modals/ApplicationPopupModal";

gsap.registerPlugin(ScrollTrigger);

interface ThemeContextValue {
  theme: string;
  setTheme: (theme: string | ((prev: string) => string)) => void;
  resolvedTheme: "light" | "dark";
  systemTheme: "light" | "dark";
  themes: string[];
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  setTheme: () => {},
  resolvedTheme: "light",
  systemTheme: "light",
  themes: ["light", "dark", "system"],
});

export function useTheme() {
  return useContext(ThemeContext);
}

const THEME_STORAGE_KEY = "theme";
const THEME_CHANGE_EVENT = "zeony-theme-change";

function subscribeThemeStore(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handleStorage = (e: StorageEvent) => {
    if (!e.key || e.key === THEME_STORAGE_KEY) callback();
  };
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
    window.removeEventListener("storage", handleStorage);
  };
}

function getStoredTheme(defaultTheme: string): string {
  if (typeof window === "undefined") return defaultTheme;
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) || defaultTheme;
  } catch {
    return defaultTheme;
  }
}

function subscribeSystemTheme(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function ThemeProvider({
  children,
  defaultTheme = "system",
  enableSystem = true,
}: {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
}) {
  const getThemeSnapshot = useCallback(() => getStoredTheme(defaultTheme), [defaultTheme]);
  const theme = useSyncExternalStore(subscribeThemeStore, getThemeSnapshot, () => defaultTheme);
  const systemTheme = useSyncExternalStore<"light" | "dark">(
    subscribeSystemTheme,
    getSystemTheme,
    () => "light"
  );

  const resolvedTheme: "light" | "dark" =
    theme === "system" && enableSystem ? systemTheme : theme === "dark" ? "dark" : "light";

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const setTheme = useCallback(
    (next: string | ((prev: string) => string)) => {
      const current = getStoredTheme(defaultTheme);
      const value = typeof next === "function" ? next(current) : next;
      try {
        localStorage.setItem(THEME_STORAGE_KEY, value);
      } catch {
        // ignore storage restrictions
      }
      window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
    },
    [defaultTheme]
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
      systemTheme,
      themes: enableSystem ? ["light", "dark", "system"] : ["light", "dark"],
    }),
    [theme, setTheme, resolvedTheme, systemTheme, enableSystem]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isAdminRoute) {
      document.documentElement.style.overflow = "";
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      prevent: (node) => Boolean(node.closest("[data-lenis-prevent]")),
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const handleScrollLock = (e: Event) => {
      const customEvent = e as CustomEvent<{ locked?: boolean }>;
      if (customEvent.detail?.locked) {
        lenis.stop();
        document.documentElement.style.overflow = "hidden";
      } else {
        lenis.start();
        document.documentElement.style.overflow = "";
      }
    };

    window.addEventListener("zeony-scroll-lock", handleScrollLock);

    return () => {
      window.removeEventListener("zeony-scroll-lock", handleScrollLock);
      document.documentElement.style.overflow = "";
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [isAdminRoute]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <MotionConfig reducedMotion="user">
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "var(--card)",
              color: "var(--card-foreground)",
              border: "1px solid var(--border)",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
            },
          }}
        />
        {!isAdminRoute && <ApplicationPopupModal />}
      </MotionConfig>
    </ThemeProvider>
  );
}
