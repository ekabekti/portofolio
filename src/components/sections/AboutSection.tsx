import SectionWrapper, { SectionTitle } from "@/components/ui/SectionWrapper";
import Reveal from "@/components/ui/Reveal";
import { skills, type Profile } from "@/lib/data";

interface AboutSectionProps {
  profile: Profile;
}

export default function AboutSection({ profile }: AboutSectionProps) {
  return (
    <SectionWrapper id="tentang">
      <SectionTitle
        index="01"
        eyebrow="Point of view"
        subtitle="Saya percaya sistem terbaik bukan yang paling ramai. Ia adalah sistem yang membuat orang bisa fokus pada keputusan yang penting."
      >
        Making complexity feel <em>quiet.</em>
      </SectionTitle>

      <div className="about-intro">
        <Reveal className="about-statement">
          Dari dashboard yang ramai, saya bangun lapisan yang membuat keputusan terasa jelas.
        </Reveal>

        <Reveal delay={0.12} className="about-profile">
          <div className="about-profile__top" aria-hidden="true">
            <span>ID / 001</span>
            <span className="about-profile__status"><span className="status-dot" />Active</span>
          </div>
          {profile.photo_url ? (
            <div className="profile-photo-card">
              <div
                className="profile-photo-card__image"
                style={{ backgroundImage: `url(${profile.photo_url})` }}
                role="img"
                aria-label={`Foto ${profile.full_name}`}
              />
              <div className="profile-photo-card__scan" aria-hidden="true" />
              <span className="profile-photo-card__tag">PORTRAIT</span>
            </div>
          ) : (
            <div className="profile-monogram" aria-hidden="true"><span>EB</span></div>
          )}
          <div className="profile-meta">
            <span className="profile-meta__name">{profile.full_name}</span>
            <span className="profile-meta__role">{profile.tagline}</span>
            <span className="profile-meta__location">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              {profile.location} / UTC+07
            </span>
          </div>
          <p className="about-profile__bio">{profile.bio}</p>
          <div className="about-profile__foot">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <span aria-hidden="true">Verified ✓</span>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.08} className="about-metrics">
        <div className="metric">
          <span className="metric__index">01 / 03</span>
          <strong className="metric__value">05<span>+</span></strong>
          <span className="metric__label">Tahun merancang dan membangun</span>
        </div>
        <div className="metric">
          <span className="metric__index">02 / 03</span>
          <strong className="metric__value">10<span>+</span></strong>
          <span className="metric__label">Sistem yang berhasil dibangun</span>
        </div>
        <div className="metric">
          <span className="metric__index">03 / 03</span>
          <strong className="metric__value">01<span>∞</span></strong>
          <span className="metric__label">Rasa ingin membuat lebih baik</span>
        </div>
      </Reveal>

      <div className="capability-block">
        <Reveal className="capability-heading">
          <span>Operating system</span>
          <span>What I bring to the table</span>
        </Reveal>
        <Reveal delay={0.1} className="capability-list">
          {skills.map((group, index) => (
            <div className="capability-row" key={group.category}>
              <span className="capability-row__index">0{index + 1}</span>
              <span className="capability-row__title">{group.category}</span>
              <span className="capability-row__items">{group.items.join("  ·  ")}</span>
              <span className="capability-row__arrow" aria-hidden="true">↗</span>
            </div>
          ))}
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
