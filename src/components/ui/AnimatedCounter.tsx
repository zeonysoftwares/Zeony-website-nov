"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

const emptySubscribe = () => () => {};

export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 1.4,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const shouldReduceMotion = useReducedMotion();
  const disableMotion = mounted && Boolean(shouldReduceMotion);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView || disableMotion) return;

    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [isInView, value, duration, disableMotion]);

  const renderedValue = disableMotion ? value : displayValue;

  return (
    <span ref={ref}>
      {prefix}
      {renderedValue}
      {suffix}
    </span>
  );
}
