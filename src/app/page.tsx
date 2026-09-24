import type { Metadata } from "next";
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
  return {
    title: `${profile.full_name} — ${profile.tagline}`,
    description: profile.bio,
  };
}

export default async function Home() {
  const { profile, projects, certificates } = await getContent();

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
