"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const navLinks = [
  { label: "Tentang", href: "#tentang", index: "01" },
  { label: "Karya", href: "#proyek", index: "02" },
  { label: "Kredensial", href: "#sertifikat", index: "03" },
  { label: "Kontak", href: "#kontak", index: "04" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const updateScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(window.scrollY > 24);
      setProgress(scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0);
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    const closeOnDesktop = () => {
      if (window.innerWidth > 820) setMobileOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", closeOnDesktop, { passive: true });
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", closeOnDesktop);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.querySelector(link.href))
      .filter((section): section is Element => Boolean(section));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(`#${visible.target.id}`);
      },
      { rootMargin: "-35% 0px -55%", threshold: [0.05, 0.25, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMobileOpen(false);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="site-header__inner container">
        <a href="#top" className="brand">
          <span className="brand__mark">EB</span>
          <span className="brand__wordmark">
            <span className="brand__name">Ekabekti / Systems</span>
            <span className="brand__meta">Digital architecture studio</span>
          </span>
        </a>

        <nav className="site-nav" aria-label="Navigasi utama">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link ${activeSection === link.href ? "is-active" : ""}`}
              aria-current={activeSection === link.href ? "location" : undefined}
            >
              <span className="nav-link__index">{link.index}</span>
              <span>{link.label}</span>
            </a>
          ))}
          <a className="header-cta" href="#kontak">
            <span>Start a conversation</span>
            <span aria-hidden="true">↗</span>
          </a>
        </nav>

        <button
          className="menu-toggle"
          type="button"
          aria-label={mobileOpen ? "Tutup navigasi" : "Buka navigasi"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span className="menu-toggle__lines" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      <div className="scroll-progress" aria-hidden="true">
        <span className="scroll-progress__bar" style={{ transform: `scaleX(${progress})` }} />
      </div>

      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            id="mobile-navigation"
            className="mobile-menu"
            initial={reducedMotion ? false : { height: 0, opacity: 0 }}
            animate={reducedMotion ? undefined : { height: "auto", opacity: 1 }}
            exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mobile-menu__inner container">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="mobile-menu__link" onClick={closeMenu}>
                  <span className="nav-link__index">{link.index}</span>
                  <span>{link.label}</span>
                </a>
              ))}
              <a className="button button--primary mt-4 w-fit" href="#kontak" onClick={closeMenu}>
                <span>Start a conversation</span>
                <span className="button__arrow" aria-hidden="true">↗</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
