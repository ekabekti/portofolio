"use client";

import { useState } from "react";
import SectionWrapper, { SectionTitle } from "@/components/ui/SectionWrapper";
import Reveal from "@/components/ui/Reveal";
import Badge from "@/components/ui/Badge";
import ProjectVisual from "@/components/projects/ProjectVisual";
import Link from "next/link";
import type { Project } from "@/lib/data";

const INITIAL_COUNT = 3;

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const visibleProjects = projects.filter((project) => project.status === "published");
  const [expanded, setExpanded] = useState(false);
  const displayedProjects = expanded ? visibleProjects : visibleProjects.slice(0, INITIAL_COUNT);

  return (
    <SectionWrapper id="proyek" className="projects-section">
      <SectionTitle
        index="02"
        eyebrow="Selected systems"
        subtitle="Beberapa problem nyata yang saya bantu ubah menjadi produk digital yang bisa dipakai, dipelihara, dan dipercaya."
      >
        Work with a <em>point of view.</em>
      </SectionTitle>

      <div className="projects-intro">
        <span className="mono-label">Case file / 2022—2025</span>
        <span className="projects-intro__note">Private-sector clarity for public-scale operations.</span>
      </div>

      {visibleProjects.length === 0 ? (
        <Reveal className="empty-state">
          <span className="mono-label">Case file / empty</span>
          <p>Belum ada project yang dipublikasikan. Kembali lagi nanti — atau mulai percakapan tentang sistem yang ingin kamu bangun.</p>
        </Reveal>
      ) : (
      <Reveal className="project-grid" y={30}>
        {displayedProjects.map((project, index) => (
          <article className="project-card" key={project.id} aria-labelledby={`project-title-${project.id}`}>
            <div className="project-card__visual">
              <ProjectVisual slug={project.slug} index={index + 1} coverImageUrl={project.cover_image_url || undefined} />
            </div>
            <div className="project-card__body">
              <div className="project-card__meta">
                <span className="project-card__number">0{index + 1} / {project.display_order.toString().padStart(2, "0")}</span>
                <span>{project.role}</span>
              </div>
              <h3 id={`project-title-${project.id}`} className="project-card__title">
                <Link href={`/proyek/${project.slug}`}>{project.title}</Link>
              </h3>
              <p className="project-card__summary">{project.summary}</p>
              <div className="project-card__footer">
                <div className="project-card__tech" aria-label="Teknologi yang digunakan">
                  {project.tech_stack.slice(0, 4).map((tech) => <Badge key={tech} label={tech} />)}
                </div>
                {project.project_url ? (
                  <a className="project-card__link" href={project.project_url} target="_blank" rel="noopener noreferrer">
                    Open project ↗
                  </a>
                ) : (
                  <Link className="project-card__link" href={`/proyek/${project.slug}`}>
                    View case ↗
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
      </Reveal>
      )}
      {visibleProjects.length > INITIAL_COUNT && (
        <Reveal className="projects-toggle" y={16}>
          <button
            type="button"
            className="toggle-button"
            onClick={() => setExpanded((current) => !current)}
            aria-expanded={expanded}
          >
            <span>{expanded ? "See less" : `See more (${visibleProjects.length - INITIAL_COUNT} more)`}</span>
            <span className={`toggle-button__chevron ${expanded ? "is-open" : ""}`} aria-hidden="true">⌄</span>
          </button>
        </Reveal>
      )}
    </SectionWrapper>
  );
}
