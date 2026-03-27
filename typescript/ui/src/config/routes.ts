import { CONTENT_MAP } from "../components/Content/config";
import magnets from "./magnets.json";

export function hrefToSlug(href: string): string | null {
  if (href.startsWith("#") && href.length > 1) {
    return href.slice(1);
  }
  return null;
}

export function slugToHref(slug: string): string {
  return `#${slug}`;
}

export interface NavEntry {
  slug: string;
  title: string;
  href: string;
  isExternal: boolean;
}

export const NAV_ENTRIES: NavEntry[] = (() => {
  const seen = new Set<string>();
  const entries: NavEntry[] = [];

  for (const magnet of magnets) {
    const { href, title } = magnet;

    // Skip decorative words (bare "#")
    if (href === "#") continue;

    // External links
    if (href.startsWith("http") || href.startsWith("/")) {
      entries.push({ slug: title, title, href, isExternal: true });
      continue;
    }

    // Internal content links — deduplicate by content title
    const contentEntry = CONTENT_MAP[href];
    if (!contentEntry) continue;

    const dedupeKey = contentEntry.title;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    const slug = hrefToSlug(href);
    if (!slug) continue;

    entries.push({ slug, title: contentEntry.title, href, isExternal: false });
  }

  return entries;
})();
