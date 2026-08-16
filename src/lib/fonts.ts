import localFont from 'next/font/local'

/**
 * Self-hosted webfonts.
 *
 * These were previously declared with `next/font/google`, which fetches every
 * family from Google's font CDN *at build time*. With eight families the build
 * made dozens of network requests, and a single failure aborted the whole
 * build with a `module-not-found` error on the generated font CSS. That was
 * not hypothetical: on 2026-08-16 two CI runs failed that way within ninety
 * minutes — once on Montserrat, once on Open Sans — both triggered by commits
 * that changed nothing but Markdown. The deploy workflow runs the same build,
 * so the same failure could have aborted a production deploy mid-cutover.
 *
 * The latin-subset woff2 files now live in `./font-files/` and are served from
 * our own origin, so the build has no third-party network dependency.
 *
 * Export names and CSS variable names are unchanged, so `layout.tsx` and
 * `globals.css` need no edits and rendering is unaffected.
 *
 * Five of these families ship as variable fonts, where Google serves one file
 * covering a weight range rather than a file per weight; those declare a range
 * (e.g. `'400 800'`). Lato is not variable and keeps one file per weight.
 *
 * To refresh a font, download the latin `@font-face` woff2 that
 * `https://fonts.googleapis.com/css2?family=<Family>:wght@<weights>` serves to
 * a current browser User-Agent, and replace the file in `./font-files/`.
 */

// NOTE: every option below must be an inline literal. Next's font loader
// evaluates these at compile time and rejects references to shared constants
// with "Font loader values must be explicitly written literals" — so the
// duplicated fallback arrays are required, not an oversight.

export const openSans = localFont({
  src: [{ path: './font-files/open-sans-variable.woff2', weight: '400 800', style: 'normal' }],
  display: 'swap',
  variable: '--font-open-sans',
  fallback: ['system-ui', 'sans-serif'],
})

export const lato = localFont({
  src: [
    { path: './font-files/lato-400.woff2', weight: '400', style: 'normal' },
    { path: './font-files/lato-700.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-lato',
  fallback: ['system-ui', 'sans-serif'],
})

export const raleway = localFont({
  src: [{ path: './font-files/raleway-variable.woff2', weight: '400 700', style: 'normal' }],
  display: 'swap',
  variable: '--font-raleway',
  fallback: ['system-ui', 'sans-serif'],
})

export const faustina = localFont({
  src: [{ path: './font-files/faustina-variable.woff2', weight: '400 700', style: 'normal' }],
  display: 'swap',
  variable: '--font-faustina',
  fallback: ['Georgia', 'serif'],
})

export const cantataOne = localFont({
  src: [{ path: './font-files/cantata-one-400.woff2', weight: '400', style: 'normal' }],
  display: 'swap',
  variable: '--font-cantata-one',
  fallback: ['Georgia', 'serif'],
})

export const faunaOne = localFont({
  src: [{ path: './font-files/fauna-one-400.woff2', weight: '400', style: 'normal' }],
  display: 'swap',
  variable: '--font-fauna-one',
  fallback: ['Georgia', 'serif'],
})

export const montserrat = localFont({
  src: [{ path: './font-files/montserrat-variable.woff2', weight: '400 700', style: 'normal' }],
  display: 'swap',
  variable: '--font-montserrat',
  fallback: ['system-ui', 'sans-serif'],
})

export const cinzel = localFont({
  src: [{ path: './font-files/cinzel-variable.woff2', weight: '400 700', style: 'normal' }],
  display: 'swap',
  variable: '--font-cinzel',
  fallback: ['Georgia', 'serif'],
})
