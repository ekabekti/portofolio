"use client";

import { useEffect, useState } from "react";
import { GhostButton, SignalButton } from "@/components/ui/Buttons";
import Reveal from "@/components/ui/Reveal";
import HeroArt from "@/components/hero/HeroArt";
import type { Profile } from "@/lib/data";

interface HeroSectionProps {
  profile: Profile;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  const [localTime, setLocalTime] = useState("--:--");

  useEffect(() => {
    const updateTime = () => {
      setLocalTime(
        new Intl.DateTimeFormat("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Jakarta",
        }).format(new Date()).replace(".", ":"),
      );
    };

    updateTime();
    const interval = window.setInterval(updateTime, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="hero-section" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />

      <div className="hero-inner">
        <div className="hero-copy">
          <Reveal>
            <p className="hero-kicker">
              <span className="status-dot" aria-hidden="true" />
              <span>Available for select collaborations</span>
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 id="hero-title" className="hero-title">
              <span className="hero-title__name">{profile.full_name}</span>
              <span className="hero-title__statement">
                Building digital systems that make complex work feel <span className="hero-title__serif">clear.</span>
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="hero-description">
              {profile.tagline}. I turn operational friction into calm interfaces, dependable services, and software that earns its place in the real world.
            </p>
          </Reveal>

          <Reveal delay={0.24} className="hero-actions">
            <SignalButton href="#proyek">Lihat karya</SignalButton>
            <GhostButton href="#tentang">Kenali saya</GhostButton>
          </Reveal>

          <Reveal delay={0.32} className="hero-meta">
            <div className="hero-meta__item">
              <span className="hero-meta__value">05+</span>
              <span className="hero-meta__label">Tahun pengalaman</span>
            </div>
            <div className="hero-meta__item">
              <span className="hero-meta__value">10+</span>
              <span className="hero-meta__label">Sistem terdeliver</span>
            </div>
            <div className="hero-meta__item">
              <span className="hero-meta__value">ID / 07</span>
              <span className="hero-meta__label">Based in Indonesia</span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2} y={12}>
          <HeroArt profile={profile} variant="auto" />
        </Reveal>
      </div>

      <div className="hero-bottomline" aria-hidden="true">
        <span className="hero-bottomline__item">Scroll to explore</span>
        <span>Independent / 2026</span>
        <span className="hero-scroll">
          <span>WIB {localTime}</span>
          <span className="hero-scroll__line" />
        </span>
      </div>
    </section>
  );
}
