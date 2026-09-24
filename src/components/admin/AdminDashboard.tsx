"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import StorageUploader from "@/components/admin/StorageUploader";
import {
  blankProfile,
  type Certificate,
  type ContactMessage,
  type Profile,
  type Project,
} from "@/lib/data";

interface AdminDashboardProps {
  email: string;
  initialProfile: Profile | null;
  initialProjects: Project[];
  initialCertificates: Certificate[];
  initialMessages: ContactMessage[];
}

type Tab = "overview" | "profile" | "projects" | "certificates" | "messages";

const emptyProject = {
  title: "",
  slug: "",
  summary: "",
  description: "",
  cover_image_url: "",
  role: "",
  tech_stack: "",
  project_url: "",
  repo_url: "",
  status: "draft" as "draft" | "published",
  is_featured: false,
  display_order: 0,
};

const emptyCertificate = {
  title: "",
  issuer: "",
  issue_date: "",
  expiry_date: "",
  credential_id: "",
  credential_url: "",
  badge_image_url: "",
  display_order: 0,
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminDashboard({
  email,
  initialProfile,
  initialProjects,
  initialCertificates,
  initialMessages,
}: AdminDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [profile, setProfile] = useState<Profile>(initialProfile ?? blankProfile);
  const [projects, setProjects] = useState(initialProjects);
  const [certificates, setCertificates] = useState(initialCertificates);
  const [messages, setMessages] = useState(initialMessages);
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [certificateForm, setCertificateForm] = useState(emptyCertificate);
  const [editingCertificateId, setEditingCertificateId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const unreadCount = useMemo(() => messages.filter((message) => !message.is_read).length, [messages]);
  const supabase = createBrowserSupabaseClient();

  function showNotice(text: string, tone: "success" | "error" = "success") {
    setNotice({ text, tone });
    window.setTimeout(() => setNotice(null), 4500);
  }

  function requireClient() {
    if (!supabase) {
      showNotice("Supabase belum dikonfigurasi di browser.", "error");
      return null;
    }
    return supabase;
  }

  async function handleSignOut() {
    await supabase?.auth.signOut();
    router.push("/");
    router.refresh();
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const client = requireClient();
    if (!client) return;
    setSaving(true);

    const profilePayload = {
      full_name: profile.full_name,
      tagline: profile.tagline,
      bio: profile.bio,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      photo_url: profile.photo_url,
      cv_url: profile.cv_url,
      social_links: profile.social_links,
    };
    const profileQuery = profile.id
      ? client.from("profile").update(profilePayload).eq("id", profile.id)
      : client.from("profile").insert(profilePayload);
    const { data, error } = await profileQuery.select().single();

    setSaving(false);
    if (error) return showNotice(error.message, "error");
    if (data) setProfile(data as Profile);
    showNotice("Profil berhasil disimpan.");
  }

  async function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const client = requireClient();
    if (!client) return;
    setSaving(true);

    const payload = {
      title: projectForm.title,
      slug: projectForm.slug || slugify(projectForm.title),
      summary: projectForm.summary,
      description: projectForm.description,
      cover_image_url: projectForm.cover_image_url,
      role: projectForm.role,
      tech_stack: projectForm.tech_stack.split(",").map((item) => item.trim()).filter(Boolean),
      project_url: projectForm.project_url || null,
      repo_url: projectForm.repo_url || null,
      status: projectForm.status,
      is_featured: projectForm.is_featured,
      display_order: Number(projectForm.display_order) || 0,
    };
    const query = editingProjectId
      ? client.from("projects").update(payload).eq("id", editingProjectId)
      : client.from("projects").insert(payload);
    const { data, error } = await query.select().single();

    setSaving(false);
    if (error) return showNotice(error.message, "error");
    if (data) {
      const nextProject = data as Project;
      setProjects((current) => editingProjectId
        ? current.map((project) => project.id === editingProjectId ? nextProject : project)
        : [...current, nextProject]);
    }
    setProjectForm(emptyProject);
    setEditingProjectId(null);
    showNotice(editingProjectId ? "Proyek berhasil diperbarui." : "Proyek berhasil ditambahkan.");
  }

  function editProject(project: Project) {
    setEditingProjectId(project.id);
    setProjectForm({
      title: project.title,
      slug: project.slug,
      summary: project.summary,
      description: project.description,
      cover_image_url: project.cover_image_url,
      role: project.role,
      tech_stack: project.tech_stack.join(", "),
      project_url: project.project_url ?? "",
      repo_url: project.repo_url ?? "",
      status: project.status,
      is_featured: project.is_featured,
      display_order: project.display_order,
    });
    setActiveTab("projects");
  }

  async function deleteProject(id: string) {
    const client = requireClient();
    if (!client || !window.confirm("Hapus proyek ini?")) return;
    const { error } = await client.from("projects").delete().eq("id", id);
    if (error) return showNotice(error.message, "error");
    setProjects((current) => current.filter((project) => project.id !== id));
    showNotice("Proyek dihapus.");
  }

  async function saveCertificate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const client = requireClient();
    if (!client) return;
    setSaving(true);

    const payload = {
      title: certificateForm.title,
      issuer: certificateForm.issuer,
      issue_date: certificateForm.issue_date,
      expiry_date: certificateForm.expiry_date || null,
      credential_id: certificateForm.credential_id || null,
      credential_url: certificateForm.credential_url || null,
      badge_image_url: certificateForm.badge_image_url,
      display_order: Number(certificateForm.display_order) || 0,
    };
    const query = editingCertificateId
      ? client.from("certificates").update(payload).eq("id", editingCertificateId)
      : client.from("certificates").insert(payload);
    const { data, error } = await query.select().single();

    setSaving(false);
    if (error) return showNotice(error.message, "error");
    if (data) {
      const nextCertificate = data as Certificate;
      setCertificates((current) => editingCertificateId
        ? current.map((certificate) => certificate.id === editingCertificateId ? nextCertificate : certificate)
        : [...current, nextCertificate]);
    }
    setCertificateForm(emptyCertificate);
    setEditingCertificateId(null);
    showNotice(editingCertificateId ? "Sertifikat diperbarui." : "Sertifikat ditambahkan.");
  }

  function editCertificate(certificate: Certificate) {
    setEditingCertificateId(certificate.id);
    setCertificateForm({
      title: certificate.title,
      issuer: certificate.issuer,
      issue_date: certificate.issue_date,
      expiry_date: certificate.expiry_date ?? "",
      credential_id: certificate.credential_id ?? "",
      credential_url: certificate.credential_url ?? "",
      badge_image_url: certificate.badge_image_url,
      display_order: certificate.display_order,
    });
    setActiveTab("certificates");
  }

  async function toggleMessage(message: ContactMessage) {
    const client = requireClient();
    if (!client) return;
    const { error } = await client.from("contact_messages").update({ is_read: !message.is_read }).eq("id", message.id);
    if (error) return showNotice(error.message, "error");
    setMessages((current) => current.map((item) => item.id === message.id ? { ...item, is_read: !item.is_read } : item));
  }

  const navItems: Array<{ key: Tab; label: string; count?: number }> = [
    { key: "overview", label: "Overview" },
    { key: "profile", label: "Profil" },
    { key: "projects", label: "Proyek", count: projects.length },
    { key: "certificates", label: "Sertifikat", count: certificates.length },
    { key: "messages", label: "Pesan", count: unreadCount },
  ];

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-sidebar__brand" href="/">
          <span>EB</span>
          <strong>EKABEKTI / SYSTEMS</strong>
        </Link>
        <nav className="admin-sidebar__nav" aria-label="Admin navigation">
          {navItems.map((item) => (
            <button key={item.key} className={activeTab === item.key ? "is-active" : ""} onClick={() => setActiveTab(item.key)} type="button">
              <span>{item.label}</span>
              {item.count !== undefined && <small>{item.count}</small>}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar__bottom">
          <span className="admin-sidebar__email">{email}</span>
          <button className="admin-sidebar__logout" type="button" onClick={handleSignOut}>Sign out ↗</button>
        </div>
      </aside>

      <section className="admin-content">
        <header className="admin-content__header">
          <div>
            <span className="mono-label">Ekabekti / content studio</span>
            <h1>{navItems.find((item) => item.key === activeTab)?.label}</h1>
          </div>
          <a className="admin-content__public" href="/" target="_blank" rel="noreferrer">View public site ↗</a>
        </header>

        {notice && <div className={`admin-notice admin-notice--${notice.tone}`} role="status">{notice.text}</div>}

        {activeTab === "overview" && (
          <div className="admin-overview">
            <div className="admin-overview__intro">
              <span className="mono-label">Good morning, Ekabekti.</span>
              <h2>Keep the system <em>alive.</em></h2>
              <p>Semua perubahan di dashboard ini akan muncul di landing page setelah refresh / ISR.</p>
            </div>
            <div className="admin-stats">
              <div><span>Published projects</span><strong>{projects.filter((project) => project.status === "published").length}</strong></div>
              <div><span>Credentials</span><strong>{certificates.length}</strong></div>
              <div><span>Unread messages</span><strong>{unreadCount}</strong></div>
            </div>
            <div className="admin-quick-links">
              <button type="button" onClick={() => setActiveTab("projects")}>+ Add project <span>↗</span></button>
              <button type="button" onClick={() => setActiveTab("certificates")}>+ Add certificate <span>↗</span></button>
              <button type="button" onClick={() => setActiveTab("messages")}>Read inbox <span>↗</span></button>
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <form className="admin-editor" onSubmit={saveProfile}>
            <div className="admin-editor__heading"><div><span className="mono-label">Single row / profile</span><h2>Public identity</h2></div><button className="button button--primary" type="submit" disabled={saving}><span>{saving ? "Saving…" : "Save profile"}</span><span className="button__arrow">↗</span></button></div>
            <div className="admin-editor__grid">
              <div className="form-field"><label htmlFor="profile-name">Full name</label><input id="profile-name" value={profile.full_name} onChange={(event) => setProfile({ ...profile, full_name: event.target.value })} required /></div>
              <div className="form-field"><label htmlFor="profile-email">Email</label><input id="profile-email" type="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} required /></div>
              <div className="form-field admin-editor__wide"><label htmlFor="profile-tagline">Tagline</label><input id="profile-tagline" value={profile.tagline} onChange={(event) => setProfile({ ...profile, tagline: event.target.value })} required /></div>
              <div className="form-field"><label htmlFor="profile-location">Location</label><input id="profile-location" value={profile.location} onChange={(event) => setProfile({ ...profile, location: event.target.value })} /></div>
              <div className="form-field"><label htmlFor="profile-photo">Photo URL</label><input id="profile-photo" value={profile.photo_url} onChange={(event) => setProfile({ ...profile, photo_url: event.target.value })} placeholder="Supabase public URL" /><StorageUploader bucket="profile-photos" value={profile.photo_url} onChange={(url) => setProfile({ ...profile, photo_url: url })} label="Upload portrait" accept="image/*" maxSizeMb={5} /></div>
              <div className="form-field admin-editor__wide"><label htmlFor="profile-bio">Bio</label><textarea id="profile-bio" rows={5} value={profile.bio} onChange={(event) => setProfile({ ...profile, bio: event.target.value })} /></div>
              <div className="form-field"><label htmlFor="profile-linkedin">LinkedIn</label><input id="profile-linkedin" value={profile.social_links.linkedin ?? ""} onChange={(event) => setProfile({ ...profile, social_links: { ...profile.social_links, linkedin: event.target.value } })} /></div>
              <div className="form-field"><label htmlFor="profile-github">GitHub</label><input id="profile-github" value={profile.social_links.github ?? ""} onChange={(event) => setProfile({ ...profile, social_links: { ...profile.social_links, github: event.target.value } })} /></div>
              <div className="form-field admin-editor__wide"><label htmlFor="profile-cv">CV URL</label><input id="profile-cv" value={profile.cv_url} onChange={(event) => setProfile({ ...profile, cv_url: event.target.value })} placeholder="Supabase cv-files public URL" /><StorageUploader bucket="cv-files" value={profile.cv_url} onChange={(url) => setProfile({ ...profile, cv_url: url })} label="Upload CV" accept="application/pdf" maxSizeMb={10} /></div>
            </div>
          </form>
        )}

        {activeTab === "projects" && (
          <div className="admin-collection">
            <div className="admin-editor__heading"><div><span className="mono-label">Projects / {projects.length}</span><h2>{editingProjectId ? "Edit project" : "Add project"}</h2></div>{editingProjectId && <button className="admin-text-button" type="button" onClick={() => { setEditingProjectId(null); setProjectForm(emptyProject); }}>Cancel edit</button>}</div>
            <form className="admin-editor__grid" onSubmit={saveProject}>
              <div className="form-field"><label htmlFor="project-title">Title</label><input id="project-title" value={projectForm.title} onChange={(event) => setProjectForm({ ...projectForm, title: event.target.value })} required /></div>
              <div className="form-field"><label htmlFor="project-slug">Slug</label><input id="project-slug" value={projectForm.slug} onChange={(event) => setProjectForm({ ...projectForm, slug: slugify(event.target.value) })} placeholder="auto-slug" /></div>
              <div className="form-field admin-editor__wide"><label htmlFor="project-summary">Summary</label><textarea id="project-summary" rows={3} value={projectForm.summary} onChange={(event) => setProjectForm({ ...projectForm, summary: event.target.value })} required /></div>
              <div className="form-field admin-editor__wide"><label htmlFor="project-cover">Cover image</label><input id="project-cover" value={projectForm.cover_image_url} onChange={(event) => setProjectForm({ ...projectForm, cover_image_url: event.target.value })} placeholder="Supabase project-images URL" /><StorageUploader bucket="project-images" value={projectForm.cover_image_url} onChange={(url) => setProjectForm({ ...projectForm, cover_image_url: url })} label="Upload cover" accept="image/*" maxSizeMb={5} /></div>
              <div className="form-field admin-editor__wide"><label htmlFor="project-description">Description</label><textarea id="project-description" rows={5} value={projectForm.description} onChange={(event) => setProjectForm({ ...projectForm, description: event.target.value })} /></div>
              <div className="form-field"><label htmlFor="project-role">Role</label><input id="project-role" value={projectForm.role} onChange={(event) => setProjectForm({ ...projectForm, role: event.target.value })} /></div>
              <div className="form-field"><label htmlFor="project-tech">Tech stack (comma separated)</label><input id="project-tech" value={projectForm.tech_stack} onChange={(event) => setProjectForm({ ...projectForm, tech_stack: event.target.value })} placeholder="Next.js, Supabase" /></div>
              <div className="form-field"><label htmlFor="project-url">Project URL</label><input id="project-url" value={projectForm.project_url} onChange={(event) => setProjectForm({ ...projectForm, project_url: event.target.value })} /></div>
              <div className="form-field"><label htmlFor="project-repo">Repository URL</label><input id="project-repo" value={projectForm.repo_url} onChange={(event) => setProjectForm({ ...projectForm, repo_url: event.target.value })} /></div>
              <div className="form-field"><label htmlFor="project-order">Display order</label><input id="project-order" type="number" value={projectForm.display_order} onChange={(event) => setProjectForm({ ...projectForm, display_order: Number(event.target.value) })} /></div>
              <div className="form-field"><label htmlFor="project-status">Status</label><select id="project-status" value={projectForm.status} onChange={(event) => setProjectForm({ ...projectForm, status: event.target.value as "draft" | "published" })}><option value="draft">Draft</option><option value="published">Published</option></select></div>
              <label className="admin-check"><input type="checkbox" checked={projectForm.is_featured} onChange={(event) => setProjectForm({ ...projectForm, is_featured: event.target.checked })} /> Featured project</label>
              <div className="admin-editor__actions"><button className="button button--primary" type="submit" disabled={saving}><span>{saving ? "Saving…" : editingProjectId ? "Update project" : "Add project"}</span><span className="button__arrow">↗</span></button></div>
            </form>
            <div className="admin-list">{projects.map((project) => <div className="admin-list__row" key={project.id}><div><span className="admin-list__status">{project.status}</span><strong>{project.title}</strong><small>{project.slug} · {project.role}</small></div><div className="admin-list__actions"><button type="button" onClick={() => editProject(project)}>Edit</button><button type="button" onClick={() => deleteProject(project.id)}>Delete</button></div></div>)}</div>
          </div>
        )}

        {activeTab === "certificates" && (
          <div className="admin-collection">
            <div className="admin-editor__heading"><div><span className="mono-label">Credentials / {certificates.length}</span><h2>{editingCertificateId ? "Edit certificate" : "Add certificate"}</h2></div>{editingCertificateId && <button className="admin-text-button" type="button" onClick={() => { setEditingCertificateId(null); setCertificateForm(emptyCertificate); }}>Cancel edit</button>}</div>
            <form className="admin-editor__grid" onSubmit={saveCertificate}>
              <div className="form-field"><label htmlFor="certificate-title">Title</label><input id="certificate-title" value={certificateForm.title} onChange={(event) => setCertificateForm({ ...certificateForm, title: event.target.value })} required /></div>
              <div className="form-field"><label htmlFor="certificate-issuer">Issuer</label><input id="certificate-issuer" value={certificateForm.issuer} onChange={(event) => setCertificateForm({ ...certificateForm, issuer: event.target.value })} required /></div>
              <div className="form-field"><label htmlFor="certificate-issue">Issue date</label><input id="certificate-issue" type="date" value={certificateForm.issue_date} onChange={(event) => setCertificateForm({ ...certificateForm, issue_date: event.target.value })} required /></div>
              <div className="form-field"><label htmlFor="certificate-expiry">Expiry date</label><input id="certificate-expiry" type="date" value={certificateForm.expiry_date} onChange={(event) => setCertificateForm({ ...certificateForm, expiry_date: event.target.value })} /></div>
              <div className="form-field"><label htmlFor="credential-id">Credential ID</label><input id="credential-id" value={certificateForm.credential_id} onChange={(event) => setCertificateForm({ ...certificateForm, credential_id: event.target.value })} /></div>
              <div className="form-field"><label htmlFor="certificate-order">Display order</label><input id="certificate-order" type="number" value={certificateForm.display_order} onChange={(event) => setCertificateForm({ ...certificateForm, display_order: Number(event.target.value) })} /></div>
              <div className="form-field admin-editor__wide"><label htmlFor="certificate-badge">Badge image</label><input id="certificate-badge" value={certificateForm.badge_image_url} onChange={(event) => setCertificateForm({ ...certificateForm, badge_image_url: event.target.value })} placeholder="Supabase certificate-badges URL" /><StorageUploader bucket="certificate-badges" value={certificateForm.badge_image_url} onChange={(url) => setCertificateForm({ ...certificateForm, badge_image_url: url })} label="Upload badge" accept="image/*" maxSizeMb={5} /></div>
              <div className="form-field admin-editor__wide"><label htmlFor="credential-url">Verification URL</label><input id="credential-url" value={certificateForm.credential_url} onChange={(event) => setCertificateForm({ ...certificateForm, credential_url: event.target.value })} /></div>
              <div className="admin-editor__actions"><button className="button button--primary" type="submit" disabled={saving}><span>{saving ? "Saving…" : editingCertificateId ? "Update certificate" : "Add certificate"}</span><span className="button__arrow">↗</span></button></div>
            </form>
            <div className="admin-list">{certificates.map((certificate) => <div className="admin-list__row" key={certificate.id}><div><span className="admin-list__status">{formatDate(certificate.issue_date)}</span><strong>{certificate.title}</strong><small>{certificate.issuer}</small></div><div className="admin-list__actions"><button type="button" onClick={() => editCertificate(certificate)}>Edit</button></div></div>)}</div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="admin-collection"><div className="admin-editor__heading"><div><span className="mono-label">Inbox / {messages.length}</span><h2>Contact messages</h2></div></div><div className="admin-messages">{messages.length === 0 ? <p className="admin-empty">Belum ada pesan.</p> : messages.map((message) => <article className={`admin-message ${message.is_read ? "is-read" : ""}`} key={message.id}><div className="admin-message__meta"><span>{message.name}</span><a href={`mailto:${message.email}`}>{message.email}</a><time>{formatDate(message.created_at)}</time></div><h3>{message.subject || "No subject"}</h3><p>{message.message}</p><button type="button" onClick={() => toggleMessage(message)}>{message.is_read ? "Mark unread" : "Mark read"}</button></article>)}</div></div>
        )}
      </section>
    </main>
  );
}
