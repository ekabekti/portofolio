import type { ReactNode } from "react";

interface ProjectVisualProps {
  slug: string;
  index: number;
  coverImageUrl?: string;
}

function VisualFrame({ children, className = "", index, coverImageUrl }: { children: ReactNode; className?: string; index: number; coverImageUrl?: string }) {
  return (
    <div className={`project-visual__canvas ${className}`} aria-hidden="true">
      <div className="project-visual__chrome">
        <span>EB—{String(index).padStart(2, "0")}</span>
        <span>CONCEPT / SYSTEM</span>
      </div>
      {coverImageUrl && <div className="project-visual__image" style={{ backgroundImage: `url(${coverImageUrl})` }} />}
      {children}
      <div className="project-visual__caption">
        <span>ARCHITECTURE / 2025</span>
        <span>↗</span>
      </div>
    </div>
  );
}

export default function ProjectVisual({ slug, index, coverImageUrl }: ProjectVisualProps) {
  if (slug === "monitoring-cctv") {
    return (
      <VisualFrame index={index} coverImageUrl={coverImageUrl}>
        <div className="visual-cctv">
          <div className="visual-cctv__scan" />
          <div className="visual-cctv__camera visual-cctv__camera--one"><span>CAM 04</span></div>
          <div className="visual-cctv__camera visual-cctv__camera--two"><span>CAM 12</span></div>
          <div className="visual-cctv__camera visual-cctv__camera--three"><span>CAM 19</span></div>
          <div className="visual-cctv__reticle" />
          <div className="visual-cctv__readout">NODES<br /><small>SCHEMATIC VIEW</small></div>
        </div>
      </VisualFrame>
    );
  }

  if (slug === "distribusi-pupuk") {
    return (
      <VisualFrame index={index} coverImageUrl={coverImageUrl}>
        <div className="visual-map">
          <div className="visual-map__label visual-map__label--one">KAB. 01</div>
          <div className="visual-map__label visual-map__label--two">KAB. 07</div>
          <svg viewBox="0 0 800 440" preserveAspectRatio="none" aria-hidden="true">
            <path d="M-20 336C120 302 135 206 270 244S426 366 532 278 630 120 820 152" />
            <path d="M-20 370C126 334 156 252 280 278S438 395 555 312 665 166 820 190" />
            <path d="M-20 272C108 236 154 160 254 190S400 300 508 220 650 70 820 100" />
            <path className="visual-map__route" d="M92 330L214 258 330 282 438 202 564 230 680 136" />
          </svg>
          <div className="visual-map__route-label">DISTRIBUTION FLOW / 07</div>
          <div className="visual-map__stamp">07<small>DISTRICT NODES</small></div>
        </div>
      </VisualFrame>
    );
  }

  if (slug === "sistem-kehadiran") {
    return (
      <VisualFrame index={index} coverImageUrl={coverImageUrl}>
        <div className="visual-attendance">
          <div className="visual-attendance__halo" />
          <div className="visual-attendance__core">
            <span>09:41</span>
            <small>CHECK-IN VERIFIED</small>
          </div>
          <div className="visual-attendance__signal visual-attendance__signal--one" />
          <div className="visual-attendance__signal visual-attendance__signal--two" />
          <div className="visual-attendance__signal visual-attendance__signal--three" />
          <div className="visual-attendance__footer"><span>GPS / FACE / ID</span><span>03—03</span></div>
        </div>
      </VisualFrame>
    );
  }

  return (
    <VisualFrame index={index} coverImageUrl={coverImageUrl}>
      <div className="visual-portal">
        <div className="visual-portal__sheet visual-portal__sheet--back" />
        <div className="visual-portal__sheet visual-portal__sheet--mid" />
        <div className="visual-portal__sheet visual-portal__sheet--front">
          <span>LAYER 01</span>
          <strong>PUBLIC<br />SERVICE</strong>
          <i>REQUEST / TRACK / RESOLVE</i>
        </div>
        <div className="visual-portal__bar visual-portal__bar--one" />
        <div className="visual-portal__bar visual-portal__bar--two" />
        <div className="visual-portal__bar visual-portal__bar--three" />
      </div>
    </VisualFrame>
  );
}
