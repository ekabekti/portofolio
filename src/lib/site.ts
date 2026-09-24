/**
 * Returns the canonical site URL with protocol.
 * Tolerates values without protocol (e.g. `ekabekti.vercel.app`)
 * because `new URL()` throws on those.
 */
export function getSiteUrl() {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").trim();
  if (/^https?:\/\//i.test(raw)) return raw.replace(/\/+$/, "");
  return `https://${raw.replace(/^\/+|\/+$/g, "")}`;
}
