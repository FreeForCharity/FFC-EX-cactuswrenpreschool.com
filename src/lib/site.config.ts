/**
 * Central site configuration for the Cactus Wren Cooperative Preschool site.
 *
 * This site was migrated off Wix into the Free For Charity Next.js template.
 * All content, media, and documents are served locally so the site is fully
 * decoupled from Wix.
 *
 * NOTE ON URL: While DNS still points the custom domain (cactuswrenpreschool.com)
 * at Wix, this build is deployed to the default GitHub Pages project URL:
 *   https://freeforcharity.github.io/FFC-EX-cactuswrenpreschool.com
 * Once DNS is transferred, add a public/CNAME file with the custom domain and
 * update `url` below to https://www.cactuswrenpreschool.com.
 */

export type SiteSocialLink = {
  /** Display label, also used for aria-label. */
  label: string
  /** Absolute https URL. Empty string disables the link. */
  href: string
}

export type SiteConfig = {
  /** Display name of the charity (used in titles, OG/Twitter cards). */
  name: string
  /** Short tagline used in the default title template. */
  tagline: string
  /** Plain-language description used for the <meta description> tag. */
  description: string
  /**
   * Shorter description tuned for OG/Twitter social card previews.
   * Falls back to `description` if empty.
   */
  shortDescription: string
  /** Canonical production URL with no trailing slash. */
  url: string
  /**
   * Twitter / X handle including the leading @. Empty string omits the
   * twitter:site meta entirely.
   */
  twitterHandle: string
  /** Primary contact email. */
  contactEmail: string
  /** SEO keywords used in the root layout metadata. */
  keywords: readonly string[]
  /** Default theme color (used by manifest and meta tag). */
  themeColor: string
  /** Where the vulnerability disclosure policy lives on this site. */
  vulnerabilityDisclosurePath: string
  /** Social links displayed in the footer. */
  social: readonly SiteSocialLink[]
}

export const siteConfig: SiteConfig = {
  name: 'Cactus Wren Cooperative Preschool',
  tagline: 'A Play-Based Preschool in Sierra Vista, Arizona',
  description:
    'Cactus Wren Cooperative Preschool is a secular, play-based, non-profit preschool established in 1980 in Sierra Vista, Arizona, offering affordable preschool and Pre-K programs for children ages 3 to 5.',
  shortDescription:
    'A secular, play-based, non-profit cooperative preschool in Sierra Vista, AZ, serving children ages 3 to 5 since 1980.',
  // Bare origin only (the drift check enforces no path component). On this
  // GitHub Pages project deploy the `/FFC-EX-cactuswrenpreschool.com` subpath
  // is supplied at build time via NEXT_PUBLIC_BASE_PATH / assetPath(), so
  // asset URLs still resolve correctly. When DNS is transferred, add a
  // public/CNAME and change this to https://www.cactuswrenpreschool.com.
  url: 'https://freeforcharity.github.io',
  twitterHandle: '',
  contactEmail: 'cactuswrenpreschool@gmail.com',
  keywords: [
    'preschool',
    'Sierra Vista preschool',
    'play-based preschool',
    'Pre-K',
    'cooperative preschool',
    'early childhood education',
    'Cactus Wren',
    'Arizona preschool',
  ],
  themeColor: '#2f7da3',
  vulnerabilityDisclosurePath: '/privacy-policy',
  social: [{ label: 'Facebook', href: 'https://www.facebook.com/cactuswrenpreschool' }],
}

/**
 * Compose a fully-qualified URL on this site.
 *
 * The path is required to be a same-origin absolute path (starting with `/`).
 */
export function siteUrl(path = '/'): string {
  if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//')) {
    throw new TypeError(
      `siteUrl: path must be a same-origin absolute path starting with a single "/" (got: ${JSON.stringify(path)})`
    )
  }
  const base = siteConfig.url.replace(/\/$/, '')
  return `${base}${path}`
}

/**
 * Returns the Twitter handle with a guaranteed leading `@`.
 * Returns `undefined` (so the meta tag is omitted) if the handle is empty.
 */
export function twitterSite(): string | undefined {
  const raw = siteConfig.twitterHandle.trim().replace(/^@+/, '')
  if (!raw) return undefined
  return `@${raw}`
}

/** Returns the OG/Twitter card description, falling back to the longer page description. */
export function cardDescription(): string {
  return siteConfig.shortDescription.trim() || siteConfig.description
}
