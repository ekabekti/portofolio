import {
  certificates as fallbackCertificates,
  profile as fallbackProfile,
  projects as fallbackProjects,
  type Certificate,
  type Profile,
  type Project,
} from "@/lib/data";
import { getPublicSupabase, isSupabaseConfigured } from "@/lib/supabase/public";

function normalizeSocialLinks(value: unknown): Profile["social_links"] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const links = value as Record<string, unknown>;
  return {
    linkedin: typeof links.linkedin === "string" ? links.linkedin : undefined,
    github: typeof links.github === "string" ? links.github : undefined,
    whatsapp: typeof links.whatsapp === "string" ? links.whatsapp : undefined,
    instagram: typeof links.instagram === "string" ? links.instagram : undefined,
  };
}

function normalizeProfile(row: {
  id: string;
  full_name: string;
  tagline: string;
  bio: string;
  photo_url: string;
  cv_url: string;
  email: string;
  phone: string | null;
  location: string;
  social_links: unknown;
}): Profile {
  return {
    id: row.id,
    full_name: row.full_name,
    tagline: row.tagline,
    bio: row.bio,
    photo_url: row.photo_url,
    cv_url: row.cv_url,
    email: row.email,
    phone: row.phone,
    location: row.location,
    social_links: normalizeSocialLinks(row.social_links),
  };
}

export interface PublicContent {
  profile: Profile;
  projects: Project[];
  certificates: Certificate[];
}

export async function getPublicContent(): Promise<PublicContent> {
  const supabase = getPublicSupabase();

  if (!isSupabaseConfigured() || !supabase) {
    return {
      profile: fallbackProfile,
      projects: fallbackProjects,
      certificates: fallbackCertificates,
    };
  }

  const [profileResult, projectsResult, certificatesResult] = await Promise.all([
    supabase.from("profile").select("*").limit(1).maybeSingle(),
    supabase
      .from("projects")
      .select("*")
      .eq("status", "published")
      .order("display_order", { ascending: true }),
    supabase.from("certificates").select("*").order("display_order", { ascending: true }),
  ]);

  return {
    profile: profileResult.data ? normalizeProfile(profileResult.data) : fallbackProfile,
    projects: projectsResult.data?.length ? (projectsResult.data as Project[]) : fallbackProjects,
    certificates: certificatesResult.data?.length
      ? (certificatesResult.data as Certificate[])
      : fallbackCertificates,
  };
}

export async function getProjectBySlug(slug: string) {
  const supabase = getPublicSupabase();
  if (!supabase) return fallbackProjects.find((project) => project.slug === slug) ?? null;

  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  return (data as Project | null) ?? null;
}
