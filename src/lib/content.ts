import type { Certificate, Profile, Project } from "@/lib/data";
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
  profile: Profile | null;
  projects: Project[];
  certificates: Certificate[];
  configured: boolean;
}

/**
 * Loads all public content from Supabase. No hardcoded fallback content:
 * an empty database renders as empty sections, and a missing configuration
 * renders as a setup notice.
 */
export async function getPublicContent(): Promise<PublicContent> {
  const supabase = getPublicSupabase();

  if (!isSupabaseConfigured() || !supabase) {
    return { profile: null, projects: [], certificates: [], configured: false };
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

  if (profileResult.error) console.error("Failed to load profile", profileResult.error.message);
  if (projectsResult.error) console.error("Failed to load projects", projectsResult.error.message);
  if (certificatesResult.error) console.error("Failed to load certificates", certificatesResult.error.message);

  return {
    profile: profileResult.data ? normalizeProfile(profileResult.data) : null,
    projects: (projectsResult.data as Project[] | null) ?? [],
    certificates: (certificatesResult.data as Certificate[] | null) ?? [],
    configured: true,
  };
}

export async function getProjectBySlug(slug: string) {
  const supabase = getPublicSupabase();
  if (!isSupabaseConfigured() || !supabase) return null;

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("Failed to load project", slug, error.message);
    return null;
  }

  return (data as Project | null) ?? null;
}
