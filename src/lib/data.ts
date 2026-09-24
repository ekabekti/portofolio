// Shared content types. All public content is loaded dynamically from
// Supabase via `src/lib/content.ts` — there is no hardcoded dummy content.
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

/** Blank profile used by the admin form when no profile row exists yet. */
export const blankProfile: Profile = {
  id: "",
  full_name: "",
  tagline: "",
  bio: "",
  photo_url: "",
  cv_url: "",
  email: "",
  phone: null,
  location: "",
  social_links: {},
};

export const skills = [
  { category: "Frontend", items: ["React", "Next.js", "Flutter", "Tailwind CSS", "TypeScript"] },
  { category: "Backend", items: ["Node.js", "Go", "Express.js", "REST API", "GraphQL"] },
  { category: "Database", items: ["PostgreSQL", "MongoDB", "Supabase", "Firebase", "Redis"] },
  { category: "DevOps", items: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux"] },
  { category: "Tools", items: ["Git", "Figma", "Jira", "VS Code", "Postman"] },
];
