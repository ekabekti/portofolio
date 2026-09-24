"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import SignalField from "@/components/hero/SignalField";
import type { Profile } from "@/lib/data";

export type HeroArtVariant = "auto" | "animation" | "photo";

interface HeroArtProps {
  profile: Profile;
  variant?: HeroArtVariant;
}

/**
 * Hero visual slot.
 *
 * - `auto` (default): shows `profile.photo_url` when set, otherwise the SignalField animation.
 * - `animation`: always shows the generative canvas.
 * - `photo`: always shows the portrait. Falls back to animation when no photo URL exists.
 *
 * To use your own photo, put the file in `public/` (for example
 * `public/profile-ekabekti.jpg`) and set `photo_url` to `/profile-ekabekti.jpg`,
 * or upload it via `/admin/dashboard` profile photo uploader.
 */
export default function HeroArt({ profile, variant = "auto" }: HeroArtProps) {
  const hasPhoto = Boolean(profile.photo_url);
  const showPhoto = variant === "photo" ? hasPhoto : variant === "animation" ? false : hasPhoto;
  const reducedMotion = useReducedMotion();

  return (
    <div className="hero-art">
      <div className="hero-art__frame" aria-hidden="true" />

      {showPhoto ? (
        <div className="hero-portrait">
          <motion.div
            className="hero-portrait__reveal"
            initial={reducedMotion ? false : { clipPath: "inset(0 0 100% 0)" }}
            animate={reducedMotion ? undefined : { clipPath: "inset(0 0 0% 0)" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
            aria-hidden="true"
          >
            <Image
              src={profile.photo_url}
              alt={`Portrait of ${profile.full_name}`}
              fill
              sizes="(max-width: 980px) 100vw, 520px"
              priority
              className="hero-portrait__image"
            />
          </motion.div>
          <div className="hero-portrait__scan" aria-hidden="true" />
          <div className="hero-portrait__reticle" aria-hidden="true"><span /></div>
          <div className="hero-portrait__scrim" aria-hidden="true" />
          <div className="hero-portrait__badge">
            <span className="status-dot" aria-hidden="true" />
            <span>PORTRAIT / 001</span>
          </div>
        </div>
      ) : (
        <SignalField />
      )}

      <span className="hero-art__number">PLATE / 001</span>
      <div className="hero-art__caption">
        <span>
          <strong>{showPhoto ? profile.full_name : "Signal field"}</strong>
          {showPhoto ? "Available for select work" : "A quiet system in motion"}
        </span>
        <span>01 / 05</span>
      </div>
      <span className="hero-art__side-note">Move through the layers / read the details</span>
    </div>
  );
}
