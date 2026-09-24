"use client";

import { motion, useReducedMotion, type Transition } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
  transition?: Transition;
}

export default function Reveal({
  children,
  className = "",
  delay = 0,
  duration = 0.75,
  y = 22,
  once = true,
  transition,
}: RevealProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.18 }}
      transition={
        transition ?? {
          duration,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }
      }
    >
      {children}
    </motion.div>
  );
}
