"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface SectionWrapperProps {
  children: ReactNode;
  id?: string;
  className?: string;
}

export default function SectionWrapper({ children, id, className = "" }: SectionWrapperProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section id={id} className={`section-block ${className}`}>
      <div className="section-shell">
        <div className="section-rail" aria-hidden="true" />
        <motion.div
          className="section-content"
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}

interface SectionTitleProps {
  children: ReactNode;
  subtitle?: string;
  index: string;
  eyebrow: string;
}

export function SectionTitle({ children, subtitle, index, eyebrow }: SectionTitleProps) {
  return (
    <div className="section-heading">
      <div className="section-heading__meta">
        <span className="section-heading__index">{index}</span>
        <span className="section-heading__eyebrow">{eyebrow}</span>
      </div>
      <div>
        <h2 className="section-heading__title">{children}</h2>
        {subtitle && <p className="section-heading__description">{subtitle}</p>}
      </div>
      <div className="section-heading__mark" aria-hidden="true" />
    </div>
  );
}
