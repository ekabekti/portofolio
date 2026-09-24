import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProjectVisual from "@/components/projects/ProjectVisual";
import Gallery from "@/components/projects/Gallery";
import Badge from "@/components/ui/Badge";
import { getProjectBySlug, getPublicContent } from "@/lib/content";

export const revalidate = 300;

export async function generateStaticParams() {
  const { projects } = await getPublicContent();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found — Ekabekti / Systems" };
  return {
    title: `${project.title} — Ekabekti / Systems`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <main className="project-detail">
      <div className="container">
        <Link className="project-detail__back" href="/#proyek">← Back to selected work</Link>
        <div className="project-detail__header">
          <div>
            <span className="mono-label">Case file / {project.display_order.toString().padStart(2, "0")}</span>
            <h1>{project.title}</h1>
            <p>{project.summary}</p>
          </div>
          <div className="project-detail__meta">
            <span>Role</span>
            <strong>{project.role}</strong>
            <span>Status</span>
            <strong>{project.status}</strong>
          </div>
        </div>
        <div className="project-detail__visual"><ProjectVisual slug={project.slug} index={project.display_order} coverImageUrl={project.cover_image_url || undefined} /></div>
        <Gallery images={[project.cover_image_url, ...project.gallery].filter(Boolean)} title={project.title} />
        <div className="project-detail__body">
          <div>
            <span className="mono-label">The brief</span>
            <p className="project-detail__description">{project.description || project.summary}</p>
          </div>
          <aside>
            <span className="mono-label">Built with</span>
            <div className="project-detail__tags">{project.tech_stack.map((tech) => <Badge key={tech} label={tech} />)}</div>
            {project.project_url && <a className="button button--primary" href={project.project_url} target="_blank" rel="noreferrer">Open project <span className="button__arrow">↗</span></a>}
          </aside>
        </div>
      </div>
    </main>
  );
}
