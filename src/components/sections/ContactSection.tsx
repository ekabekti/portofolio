"use client";

import { useState, type FormEvent } from "react";
import SectionWrapper, { SectionTitle } from "@/components/ui/SectionWrapper";
import Reveal from "@/components/ui/Reveal";
import { SignalButton } from "@/components/ui/Buttons";
import type { Profile } from "@/lib/data";

function getSocialLinks(profile: Profile) {
  return [
    { key: "email", label: "Email", href: `mailto:${profile.email}` },
    { key: "linkedin", label: "LinkedIn", href: profile.social_links.linkedin },
    { key: "github", label: "GitHub", href: profile.social_links.github },
    { key: "whatsapp", label: "WhatsApp", href: profile.social_links.whatsapp },
  ].filter((link): link is { key: string; label: string; href: string } => Boolean(link.href));
}

interface ContactSectionProps {
  profile: Profile;
}

export default function ContactSection({ profile }: ContactSectionProps) {
  const socialLinks = getSocialLinks(profile);
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [statusMessage, setStatusMessage] = useState("No pitch deck required.");
  const [statusIsError, setStatusIsError] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setSubmitting(true);
    setStatusIsError(false);
    setStatusMessage("Mengirim pesan…");

    try {
      const response = await fetch("/api/kontak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          subject: "Project inquiry",
          message: formState.message,
          honeypot: String(formData.get("honeypot") || ""),
        }),
      });
      const result = (await response.json().catch(() => null)) as
        | { success?: boolean; error?: string; message?: string }
        | null;

      if (!response.ok || !result?.success) {
        throw new Error(result?.error || "Pesan belum tersimpan.");
      }

      setSent(true);
      setStatusMessage(result.message || "Pesan berhasil diterima.");
      setFormState({ name: "", email: "", message: "" });
    } catch (error) {
      setSent(false);
      setStatusIsError(true);
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Pesan belum tersimpan. Silakan kirim via email.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SectionWrapper id="kontak" className="contact-section">
      <SectionTitle
        index="05"
        eyebrow="Open channel"
        subtitle="Jika Anda sedang membangun sesuatu yang penting, saya ingin mendengar konteksnya—terutama bagian yang belum punya jawaban yang rapi."
      >
        Have a hard problem? <em>Good.</em>
      </SectionTitle>

      <div className="contact-layout">
        <Reveal className="contact-statement">
          <h2 className="contact-statement__title">Let&apos;s make the invisible <em>work.</em></h2>
          <p className="contact-statement__copy">
            Kirim brief singkat, link referensi, atau sekadar pertanyaan yang belum selesai. Kita bisa mulai dari sana.
          </p>
          <a className="contact-email" href={`mailto:${profile.email}`}>
            <span>{profile.email}</span>
            <span aria-hidden="true">↗</span>
          </a>
          <div className="contact-availability">
            <span className="status-dot" aria-hidden="true" />
            <span>Usually replies within 2 business days</span>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="contact-form-wrap">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form__intro">
              <h3>Start with a note.</h3>
              <span>Secure channel / 01</span>
            </div>

            <input type="text" name="honeypot" className="sr-only" tabIndex={-1} autoComplete="off" aria-hidden="true" />

            <div className="form-field">
              <label htmlFor="contact-name">Your name</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                value={formState.name}
                onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
                placeholder="Siapa Anda?"
                autoComplete="name"
              />
            </div>

            <div className="form-field">
              <label htmlFor="contact-email">Email address</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                value={formState.email}
                onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))}
                placeholder="email@domain.com"
                autoComplete="email"
              />
            </div>

            <div className="form-field">
              <label htmlFor="contact-message">What are we solving?</label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={4}
                value={formState.message}
                onChange={(event) => setFormState((current) => ({ ...current, message: event.target.value }))}
                placeholder="Ceritakan konteksnya…"
              />
            </div>

            <div className="contact-form__footer">
              <span
                className={`contact-form__status ${statusIsError ? "contact-form__status--error" : ""}`}
                aria-live="polite"
              >
                {statusMessage}
              </span>
              <SignalButton type="submit" disabled={submitting}>
                {submitting ? "Mengirim…" : sent ? "Terkirim" : "Kirim pesan"}
              </SignalButton>
            </div>
          </form>
        </Reveal>
      </div>

      <Reveal delay={0.16} className="contact-links">
        {socialLinks.map((link) => {
          const external = /^https?:\/\//i.test(link.href);
          return (
            <a
              key={link.key}
              className="contact-link"
              href={link.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
            >
              <span>{link.label}</span>
              <span aria-hidden="true">↗</span>
            </a>
          );
        })}
      </Reveal>
    </SectionWrapper>
  );
}
