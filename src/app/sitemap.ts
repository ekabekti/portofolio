import type { MetadataRoute } from "next";
import { getPublicContent } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const { projects } = await getPublicContent();
  const now = new Date();

  return [
    { url: siteUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...projects.map((project) => ({
      url: `${siteUrl}/proyek/${project.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: project.is_featured ? 0.9 : 0.7,
    })),
  ];
}
