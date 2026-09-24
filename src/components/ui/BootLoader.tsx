"use client";

import { useEffect, useRef, useState } from "react";

const BOOT_LINES = [
  "INIT FIELD / 01",
  "LINKING NODES / 07",
  "CALIBRATING SIGNAL",
  "RENDERING SYSTEMS",
];

const MIN_DISPLAY_MS = 1600;
const EXIT_MS = 650;
const FORCE_HIDE_MS = 5000;

/**
 * Cinematic initial page loader. Mounted once in the root layout, plays a
 * short boot sequence, then wipes away. Always dismisses itself — even if
 * the load event never fires — and honours prefers-reduced-motion.
 */
export default function BootLoader() {
  const [phase, setPhase] = useState<"boot" | "leaving" | "done">("boot");
  const [progress, setProgress] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const startedAt = performance.now();
    document.body.style.overflow = "hidden";

    const finish = () => {
      setProgress(100);
      setPhase("leaving");
      timers.current.push(window.setTimeout(() => {
        setPhase("done");
        document.body.style.overflow = "";
      }, EXIT_MS));
    };

    const finishWhenReady = () => {
      const elapsed = performance.now() - startedAt;
      const wait = Math.max(0, (reducedMotion ? 200 : MIN_DISPLAY_MS) - elapsed);
      timers.current.push(window.setTimeout(finish, wait));
    };

    if (document.readyState === "complete") {
      finishWhenReady();
    } else {
      window.addEventListener("load", finishWhenReady, { once: true });
    }

    // Safety net: never trap the visitor behind the loader.
    timers.current.push(window.setTimeout(() => {
      if (document.body.style.overflow === "hidden") document.body.style.overflow = "";
      setPhase((current) => (current === "done" ? current : "done"));
    }, FORCE_HIDE_MS));

    // Fake-but-honest progress: eases toward 90% until finish() completes it.
    const tick = window.setInterval(() => {
      setProgress((current) => (current >= 90 ? current : current + Math.max(1, (90 - current) * 0.08)));
    }, 120);
    timers.current.push(tick as unknown as number);

    return () => {
      timers.current.forEach((timer) => {
        window.clearTimeout(timer);
        window.clearInterval(timer);
      });
      timers.current = [];
      window.removeEventListener("load", finishWhenReady);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div className={`boot-loader ${phase === "leaving" ? "is-leaving" : ""}`} role="status" aria-label="Memuat halaman">
      <div className="boot-loader__grid" aria-hidden="true" />
      <div className="boot-loader__core">
        <div className="boot-loader__mark" aria-hidden="true">
          <span>EB</span>
        </div>
        <p className="boot-loader__wordmark">EKABEKTI / SYSTEMS</p>
        <div className="boot-loader__bar" aria-hidden="true">
          <span style={{ transform: `scaleX(${Math.min(100, progress) / 100})` }} />
        </div>
        <div className="boot-loader__meta" aria-hidden="true">
          <span>BOOT SEQUENCE</span>
          <span>{String(Math.floor(Math.min(100, progress))).padStart(3, "0")}%</span>
        </div>
        <ul className="boot-loader__log" aria-hidden="true">
          {BOOT_LINES.map((line, index) => (
            <li key={line} style={{ animationDelay: `${0.25 + index * 0.3}s` }}>
              <span>▸</span> {line}
            </li>
          ))}
        </ul>
      </div>
      <span className="sr-only">Memuat halaman…</span>
    </div>
  );
}
