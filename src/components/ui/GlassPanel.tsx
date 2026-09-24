import type { ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassPanel({ children, className = "", hover = false }: GlassPanelProps) {
  return (
    <div className={`surface-card ${hover ? "surface-card--hover" : ""} ${className}`}>
      {children}
    </div>
  );
}
