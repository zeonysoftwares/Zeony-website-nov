"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export function LoadingScreen() {
  const shouldReduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion) return;
    try {
      const seen = sessionStorage.getItem("zeony_intro_shown");
      if (seen) return;
      sessionStorage.setItem("zeony_intro_shown", "1");
    } catch {
      return;
    }

    const startTimer = setTimeout(() => setIsVisible(true), 0);
    const hideTimer = setTimeout(() => setIsVisible(false), 680);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(hideTimer);
    };
  }, [shouldReduceMotion]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="zeony-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed inset-0 z-[100] bg-[#050814] flex flex-col items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3"
          >
            <Image
              src="/img/z-logo.jpg"
              alt="Zeony Technologies"
              width={48}
              height={48}
              className="w-11 h-11 object-contain rounded-xl border border-white/15"
              priority
            />
            <span className="font-heading font-bold text-3xl tracking-tight text-white">
              ZEONY
            </span>
          </motion.div>
          <div className="mt-5 w-36 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
              className="h-full w-full bg-gradient-to-r from-blue-500 to-emerald-400"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
