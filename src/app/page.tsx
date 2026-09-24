import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import CertificatesSection from "@/components/sections/CertificatesSection";
import CVSection from "@/components/sections/CVSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/sections/Footer";
import { getPublicContent } from "@/lib/content";

export const revalidate = 300;

const getContent = cache(getPublicContent);

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getContent();
  if (!profile) {
    return {
      title: "Ekabekti — Digital systems, made legible.",
      description:
        "Portofolio Ekabekti, full-stack developer dan infrastructure architect.",
    };
  }
  return {
    title: `${profile.full_name} — ${profile.tagline}`,
    description: profile.bio,
  };
}

function SetupNotice({ configured }: { configured: boolean }) {
  return (
    <div className="site-shell" id="top">
      <main className="admin-setup">
        <div className="admin-setup__card">
          <span className="mono-label">Content / not configured</span>
          <h1>Konten belum tersedia.</h1>
          <p>
            {configured
              ? "Database Supabase sudah terhubung, tetapi tabel profil masih kosong. Isi profil, proyek, dan sertifikat lewat dashboard admin."
              : "Supabase belum dikonfigurasi. Isi environment variables, jalankan migration, lalu isi konten lewat dashboard admin."}
          </p>
          <Link className="button button--primary" href="/admin/dashboard">
            Buka dashboard admin <span className="button__arrow" aria-hidden="true">↗</span>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default async function Home() {
  const { profile, projects, certificates, configured } = await getContent();

  if (!profile) return <SetupNotice configured={configured} />;

  return (
    <div className="site-shell" id="top">
      <a className="skip-link" href="#main-content">Lewati ke konten utama</a>
      <Navbar />
      <main id="main-content">
        <HeroSection profile={profile} />
        <AboutSection profile={profile} />
        <ProjectsSection projects={projects} />
        <CertificatesSection certificates={certificates} />
        <CVSection profile={profile} />
        <ContactSection profile={profile} />
      </main>
      <Footer profile={profile} />
    </div>
  );
}
