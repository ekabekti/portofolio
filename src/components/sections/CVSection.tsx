import SectionWrapper from "@/components/ui/SectionWrapper";
import Reveal from "@/components/ui/Reveal";
import { GhostButton, SignalButton } from "@/components/ui/Buttons";
import type { Profile } from "@/lib/data";

interface CVSectionProps {
  profile: Profile;
}

export default function CVSection({ profile }: CVSectionProps) {
  return (
    <SectionWrapper id="cv" className="cv-section">
      <Reveal className="dossier">
        <div className="dossier__inner">
          <div>
            <span className="dossier__eyebrow">04 / The short version</span>
            <h2 className="dossier__title">The work, <em>condensed.</em></h2>
            <p className="dossier__copy">
              Butuh konteks yang lebih lengkap? Saya bisa mengirim ringkasan pengalaman, pilihan proyek, dan detail teknis dalam format yang mudah dibaca.
            </p>
            <div className="dossier__actions">
              <SignalButton href={`mailto:${profile.email}?subject=Permintaan%20CV%20Ekabekti`}>Minta salinan CV</SignalButton>
              <GhostButton href="#kontak">Minta walkthrough</GhostButton>
            </div>
          </div>

          <div className="dossier__preview" aria-label="Pratinjau Curriculum Vitae">
            <span className="dossier__preview-mark">EB</span>
            <div className="dossier__preview-lines" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="dossier__preview-foot">
              <span>Curriculum vitae</span>
              <span>CV / ON REQUEST</span>
            </div>
          </div>
        </div>
      </Reveal>
    </SectionWrapper>
  );
}
