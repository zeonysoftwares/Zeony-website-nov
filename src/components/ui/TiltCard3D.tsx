"use client";

import React, { useRef, useSyncExternalStore } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

interface TiltCard3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

const emptySubscribe = () => () => {};

export function TiltCard3D({
  children,
  className = "",
  intensity = 8,
}: TiltCard3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const shouldReduceMotion = useReducedMotion();
  const disableMotion = mounted && Boolean(shouldReduceMotion);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useMotionValue(0), { stiffness: 220, damping: 24 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 220, damping: 24 });

  const spotX = useSpring(mouseX, { stiffness: 260, damping: 30 });
  const spotY = useSpring(mouseY, { stiffness: 260, damping: 30 });

  const spotlight = useMotionTemplate`radial-gradient(380px circle at calc(${spotX} * 100%) calc(${spotY} * 100%), rgba(56, 189, 248, 0.12), transparent 65%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disableMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    mouseX.set(px);
    mouseY.set(py);
    rotateX.set((0.5 - py) * intensity);
    rotateY.set((px - 0.5) * intensity);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        disableMotion
          ? undefined
          : {
              rotateX,
              rotateY,
              transformPerspective: 1000,
              transformStyle: "preserve-3d",
            }
      }
      className={`relative ${className}`}
    >
      {!disableMotion && (
        <motion.div
          aria-hidden="true"
          style={{ background: spotlight }}
          className="pointer-events-none absolute inset-0 rounded-[inherit] z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      )}
      {children}
    </motion.div>
  );
}
