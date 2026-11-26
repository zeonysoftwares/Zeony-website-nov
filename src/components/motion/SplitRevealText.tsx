"use client";

import { motion } from "framer-motion";

interface SplitRevealTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

export function SplitRevealText({
  text,
  className = "",
  delay = 0,
  stagger = 0.045,
}: SplitRevealTextProps) {
  const words = text.split(" ");

  return (
    <span className={`inline-flex flex-wrap gap-x-[0.26em] ${className}`}>
      {words.map((word, idx) => (
        <span key={`${word}-${idx}`} className="inline-block overflow-hidden align-bottom py-0.5">
          <motion.span
            initial={{ y: "105%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              duration: 0.55,
              delay: delay + idx * stagger,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
