// Local fallback data — the public data layer prefers Supabase when configured.
// Structure follows 04-SKEMA-DATABASE.md.

export interface Profile {
  id: string;
  full_name: string;
  tagline: string;
  bio: string;
  photo_url: string;
  cv_url: string;
  email: string;
  phone: string | null;
  location: string;
  social_links: {
    linkedin?: string;
    github?: string;
    whatsapp?: string;
    instagram?: string;
  };
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  cover_image_url: string;
  tech_stack: string[];
  project_url: string | null;
  repo_url: string | null;
  role: string;
  is_featured: boolean;
  status: "draft" | "published";
  display_order: number;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  badge_image_url: string;
  display_order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const profile: Profile = {
  id: "1",
  full_name: "Ekabekti",
  tagline: "Full-Stack Developer & Infrastructure Architect",
  bio: "Membangun sistem monitoring dan infrastruktur digital untuk pemerintah kabupaten. Berpengalaman dalam pengembangan aplikasi web & mobile, sistem CCTV terpusat, dashboard monitoring distribusi pupuk, dan sistem kehadiran. Mengutamakan solusi yang skalabel, aman, dan mudah dikelola.",
  photo_url: "",
  cv_url: "/cv-ekabekti.pdf",
  email: "ekabekti@example.com",
  phone: "+62 812 3456 7890",
  location: "Indonesia",
  social_links: {
    linkedin: "https://linkedin.com/in/ekabekti",
    github: "https://github.com/ekabekti",
    whatsapp: "https://wa.me/6281234567890",
  },
};

export const projects: Project[] = [
  {
    id: "1",
    title: "Sistem Monitoring CCTV Terpusat",
    slug: "monitoring-cctv",
    summary:
      "Platform monitoring CCTV terpusat untuk pemerintah kabupaten dengan dashboard realtime, manajemen kamera, dan notifikasi otomatis.",
    description:
      "Sistem monitoring CCTV terpusat yang mengintegrasikan ratusan kamera dari berbagai titik di wilayah kabupaten ke satu dashboard terpadu.",
    cover_image_url: "",
    tech_stack: ["Next.js", "Node.js", "PostgreSQL", "WebSocket", "Docker"],
    project_url: null,
    repo_url: null,
    role: "Lead Developer & System Architect",
    is_featured: true,
    status: "published",
    display_order: 1,
  },
  {
    id: "2",
    title: "Dashboard Distribusi Pupuk",
    slug: "distribusi-pupuk",
    summary:
      "Dashboard monitoring distribusi pupuk bersubsidi untuk memastikan transparansi dan akuntabilitas di tingkat kabupaten.",
    description:
      "Aplikasi web untuk melacak distribusi pupuk bersubsidi dari gudang hingga ke petani.",
    cover_image_url: "",
    tech_stack: ["React", "Express.js", "MongoDB", "Chart.js", "Mapbox"],
    project_url: null,
    repo_url: null,
    role: "Full-Stack Developer",
    is_featured: true,
    status: "published",
    display_order: 2,
  },
  {
    id: "3",
    title: "Sistem Kehadiran Digital",
    slug: "sistem-kehadiran",
    summary:
      "Aplikasi mobile dan web untuk manajemen kehadiran pegawai pemerintah dengan geolokasi dan face recognition.",
    description:
      "Sistem absensi digital dengan verifikasi biometrik dan lokasi GPS.",
    cover_image_url: "",
    tech_stack: ["Flutter", "Firebase", "Go", "TensorFlow Lite"],
    project_url: null,
    repo_url: null,
    role: "Mobile & Backend Developer",
    is_featured: true,
    status: "published",
    display_order: 3,
  },
  {
    id: "4",
    title: "Portal Layanan Publik",
    slug: "portal-layanan",
    summary:
      "Portal layanan publik terintegrasi untuk pengajuan dokumen dan informasi masyarakat.",
    description:
      "Platform satu pintu untuk layanan publik dengan tracking status pengajuan.",
    cover_image_url: "",
    tech_stack: ["Next.js", "Supabase", "Tailwind CSS"],
    project_url: null,
    repo_url: null,
    role: "Full-Stack Developer",
    is_featured: false,
    status: "published",
    display_order: 4,
  },
];

export const certificates: Certificate[] = [
  {
    id: "1",
    title: "AWS Solutions Architect Associate",
    issuer: "Amazon Web Services",
    issue_date: "2025-03-15",
    expiry_date: "2028-03-15",
    credential_id: "AWS-SAA-123456",
    credential_url: "https://aws.amazon.com/verification",
    badge_image_url: "",
    display_order: 1,
  },
  {
    id: "2",
    title: "Google Cloud Professional Developer",
    issuer: "Google Cloud",
    issue_date: "2024-11-20",
    expiry_date: "2026-11-20",
    credential_id: "GCP-PD-789012",
    credential_url: "https://cloud.google.com/certification",
    badge_image_url: "",
    display_order: 2,
  },
  {
    id: "3",
    title: "Meta Front-End Developer",
    issuer: "Meta (Coursera)",
    issue_date: "2024-06-10",
    expiry_date: null,
    credential_id: "META-FED-345678",
    credential_url: "https://coursera.org/verify",
    badge_image_url: "",
    display_order: 3,
  },
  {
    id: "4",
    title: "Certified Kubernetes Administrator",
    issuer: "CNCF",
    issue_date: "2025-01-05",
    expiry_date: "2028-01-05",
    credential_id: "CKA-901234",
    credential_url: "https://training.linuxfoundation.org/certification/verify",
    badge_image_url: "",
    display_order: 4,
  },
];

export const skills = [
  { category: "Frontend", items: ["React", "Next.js", "Flutter", "Tailwind CSS", "TypeScript"] },
  { category: "Backend", items: ["Node.js", "Go", "Express.js", "REST API", "GraphQL"] },
  { category: "Database", items: ["PostgreSQL", "MongoDB", "Supabase", "Firebase", "Redis"] },
  { category: "DevOps", items: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux"] },
  { category: "Tools", items: ["Git", "Figma", "Jira", "VS Code", "Postman"] },
];
