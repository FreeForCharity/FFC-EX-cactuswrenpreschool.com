#!/usr/bin/env node
/**
 * FFC drift guard — runs in CI and as a pre-commit hook.
 *
 * Catches common ways a child site can drift away from FFC best practices:
 *  1. Top-level route folders under src/app/ that are not kebab-case
 *     (SEO requirement per Google Search Central).
 *  2. Hardcoded `/Images/...`, `/Svgs/...`, or `/videos/...` paths and
 *     `${basePath}/...` template literals missing `assetPath()`.
 *  3. Common secret patterns committed under src/ or public/.
 *  4. The template's placeholder URL `ffcworkingsite1.org` left in source
 *     or public files after a child site rebrands.
 *  5. Two CSPs (public/_headers and src/app/layout.tsx meta tag) drifting
 *     out of sync on third-party origins.
 *  6. Routes with a page.tsx that nothing links to — they build, deploy and
 *     appear in the sitemap while no visitor can navigate to them.
 *  7. Contact facts from src/lib/cw.ts retyped as literals in a page, which
 *     match on the day they are written and go stale silently afterwards.
 *
 * Run: `node scripts/check-drift.mjs` or `npm run check:drift`.
 * Always resolves paths relative to the repo root, so it works regardless
 * of the CWD a developer invokes it from.
 * Exits non-zero on errors; warnings do not fail the check.
 */
import { readdir, readFile, stat } from 'node:fs/promises'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

// Anchor everything to the repo root (scripts/check-drift.mjs lives one
// level down) so the check produces the same result no matter where it's
// invoked from. Previously this used process.cwd() which silently scanned
// nothing if you ran the script from a subdirectory.
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT = join(SCRIPT_DIR, '..')
const APP_DIR = join(ROOT, 'src', 'app')
const SRC_DIR = join(ROOT, 'src')
const errors = []
const warnings = []

const KEBAB_CASE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
// App router conventions we don't want to flag.
const APP_RESERVED = new Set(['api', '_components', '_lib'])
// Single-file conventions (have a leading dot or @-symbol) handled separately.

async function walk(dir, predicate, results = []) {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return results
  }
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
      await walk(full, predicate, results)
    } else if (predicate(entry.name)) {
      results.push(full)
    }
  }
  return results
}

async function checkKebabCaseRoutes() {
  let entries
  try {
    entries = await readdir(APP_DIR, { withFileTypes: true })
  } catch {
    return
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    if (entry.name.startsWith('(') || entry.name.startsWith('_')) continue
    if (entry.name.startsWith('@')) continue
    if (APP_RESERVED.has(entry.name)) continue
    if (!KEBAB_CASE.test(entry.name)) {
      errors.push(
        `Route folder "src/app/${entry.name}" is not kebab-case (SEO requirement). ` +
          `Rename it to lowercase letters and digits separated by hyphens.`
      )
    }
  }
}

function lineAt(body, index) {
  return body.slice(0, index).split('\n').length
}

// True if the match is inside a `//` or `/* */` comment. Coarse but cheap:
// looks at the line preceding the match for `//` and at the body before
// the match for an unclosed `/*`.
function insideComment(body, index) {
  const lineStart = body.lastIndexOf('\n', index - 1) + 1
  const line = body.slice(lineStart, index)
  if (/(^|[^:])\/\//.test(line)) return true
  const beforeOpen = body.lastIndexOf('/*', index)
  if (beforeOpen === -1) return false
  const beforeClose = body.lastIndexOf('*/', index)
  return beforeOpen > beforeClose
}

async function checkAssetPathUsage() {
  const files = await walk(SRC_DIR, (n) => /\.(tsx?|jsx?)$/.test(n))
  // Match raw string literals like "/Images/foo.png", "/Svgs/bar.svg",
  // or "/videos/x.mp4" that aren't wrapped by assetPath(). We also flag
  // template-literal patterns like `${basePath}/Images/...` since that
  // is the anti-pattern assetPath() exists to replace.
  //
  // As of the round-2 cleanup these are ERRORS rather than warnings —
  // the codebase is clean and any new occurrence is a real bug
  // (the resource will 404 on GitHub Pages subpath deploys).
  const literalPattern = /(["'`])(\/(?:Images|Svgs|videos)\/[^"'`\n]+?)\1/g
  const templateBasePattern = /\$\{[^}]*basePath[^}]*\}\/(?:Images|Svgs|videos)\//g
  // 400-char lookback covers prettier-wrapped multi-line calls with
  // inline comments between `assetPath(` and the literal.
  const wrappedInAssetPath = /assetPath\s*\([^)]*$/
  for (const file of files) {
    const rel = relative(ROOT, file)
    if (rel.includes('__tests__') || rel.startsWith('tests' + sep)) continue
    // The drift script itself contains the example patterns it scans for —
    // skip the assetPath helper so we don't flag ourselves.
    if (rel === join('src', 'lib', 'assetPath.ts')) continue
    const body = await readFile(file, 'utf8')

    literalPattern.lastIndex = 0
    let match
    while ((match = literalPattern.exec(body))) {
      if (insideComment(body, match.index)) continue
      const lookback = body.slice(Math.max(0, match.index - 400), match.index)
      if (wrappedInAssetPath.test(lookback)) continue
      errors.push(
        `${rel}:${lineAt(body, match.index)} references "${match[2]}" without assetPath(). ` +
          `Wrap in assetPath('${match[2]}') so it works on GitHub Pages subpaths.`
      )
    }

    templateBasePattern.lastIndex = 0
    while ((match = templateBasePattern.exec(body))) {
      if (insideComment(body, match.index)) continue
      errors.push(
        `${rel}:${lineAt(body, match.index)} hand-rolls basePath concatenation ("${match[0]}…"). ` +
          `Use assetPath('/Images/...') instead so the helper stays the single source of truth.`
      )
    }
  }
}

async function checkSecrets() {
  // Scan src/ AND public/ — anything under public/ is deployed verbatim,
  // so a token accidentally committed there leaks straight to the live site.
  const srcFiles = await walk(SRC_DIR, (n) =>
    /\.(tsx?|jsx?|json|md|yml|yaml|txt|webmanifest)$/.test(n)
  )
  const publicFiles = await walk(join(ROOT, 'public'), (n) =>
    /\.(tsx?|jsx?|json|md|yml|yaml|txt|webmanifest)$|^_headers$|^CNAME$/.test(n)
  )
  const files = [...srcFiles, ...publicFiles]
  // Add patterns sparingly — false positives are noisy.
  const secretPatterns = [
    {
      name: 'AWS access key',
      re: /\bAKIA[0-9A-Z]{16}\b/,
    },
    {
      name: 'Google API key',
      re: /\bAIza[0-9A-Za-z_\-]{35}\b/,
    },
    {
      name: 'GitHub personal access token',
      re: /\bghp_[A-Za-z0-9]{36,}\b/,
    },
    {
      name: 'GitHub fine-grained token',
      re: /\bgithub_pat_[A-Za-z0-9_]{82,}\b/,
    },
    {
      // Covers bot (xoxb), user (xoxp), app-level (xoxa), refresh (xoxr),
      // legacy (xoxs), and OAuth client-secret (xoxe) tokens.
      name: 'Slack token',
      re: /\bxox[abeprs]-[A-Za-z0-9-]{10,}\b/,
    },
    {
      name: 'Private key block',
      re: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/,
    },
  ]
  for (const file of files) {
    const body = await readFile(file, 'utf8')
    for (const p of secretPatterns) {
      const m = body.match(p.re)
      if (m) {
        errors.push(
          `Possible ${p.name} committed in ${relative(ROOT, file)}. ` +
            `Move it to a .env file (gitignored) or GitHub Secrets and rotate the credential immediately.`
        )
      }
    }
  }
}

const PLACEHOLDER_HOST = 'ffcworkingsite1.org'

function hostnameOf(rawUrl) {
  if (!rawUrl) return null
  try {
    return new URL(rawUrl).hostname
  } catch {
    return null
  }
}

async function checkPlaceholderUrl() {
  // Trigger the scan if EITHER the CNAME or the siteConfig.url has been
  // updated away from the template default. The previous behavior — only
  // running when CNAME pointed to a custom domain — missed two real cases:
  // 1) Sites deploying only to github.io subpath (no CNAME) that still
  //    forgot to update security.txt or other public assets.
  // 2) Sites that updated siteConfig.url before touching CNAME.
  // The web manifest is now generated from siteConfig, so it doesn't need
  // a separate placeholder check — it inherits the URL automatically.
  const cnamePath = join(ROOT, 'public', 'CNAME')
  const cfgPath = join(ROOT, 'src', 'lib', 'site.config.ts')
  let customDomain = null
  let cfgUrl = null
  try {
    customDomain = (await readFile(cnamePath, 'utf8')).trim()
  } catch {
    /* no CNAME — OK, may be github.io-only */
  }
  try {
    const cfg = await readFile(cfgPath, 'utf8')
    const m = cfg.match(/url:\s*['"]([^'"]+)['"]/)
    cfgUrl = m ? m[1] : null
  } catch {
    /* config missing — handled elsewhere */
  }

  // Compare exact hostnames rather than substring-search — avoids the
  // CodeQL "incomplete URL substring sanitization" false positive and
  // also avoids matching `myffcworkingsite1.org.evil.com`-style strings.
  const cnameRebranded = customDomain && customDomain !== PLACEHOLDER_HOST
  const cfgHost = hostnameOf(cfgUrl)
  const cfgRebranded = cfgHost && cfgHost !== PLACEHOLDER_HOST
  if (!cnameRebranded && !cfgRebranded) return

  // Walk every text source under src/ and public/ (plus a small set of
  // well-known config files at the repo root) for the placeholder host.
  const interestingExt = /\.(tsx?|jsx?|md|mdx|txt|json|yml|yaml|webmanifest)$|^_headers$|^CNAME$/
  const roots = [join(ROOT, 'src'), join(ROOT, 'public')]
  const rootFiles = ['next.config.ts', 'package.json', 'README.md']
  const candidates = []
  for (const root of roots) {
    candidates.push(...(await walk(root, (n) => interestingExt.test(n))))
  }
  for (const name of rootFiles) {
    candidates.push(join(ROOT, name))
  }
  const customRef = cnameRebranded ? customDomain : cfgUrl
  for (const full of candidates) {
    const rel = relative(ROOT, full)
    try {
      const body = await readFile(full, 'utf8')
      // lgtm [js/incomplete-url-substring-sanitization] -- intentional:
      // we are LOOKING FOR the placeholder host anywhere in the file body
      // (string content, comments, URLs alike). This is a drift warning, not
      // a security filter against malicious URLs.
      if (body.includes(PLACEHOLDER_HOST)) {
        const line = lineAt(body, body.indexOf(PLACEHOLDER_HOST))
        warnings.push(
          `${rel}:${line} still references the template placeholder ${PLACEHOLDER_HOST} ` +
            `(this site has rebranded to "${customRef}"). Update it.`
        )
      }
    } catch {
      /* file missing or unreadable — skip */
    }
  }
}

async function checkSiteConfigExists() {
  const cfgPath = join(ROOT, 'src', 'lib', 'site.config.ts')
  try {
    await stat(cfgPath)
  } catch {
    errors.push('src/lib/site.config.ts is missing. Restore it from the template.')
  }
}

// CSP directives that are honored in <meta http-equiv> AND in HTTP headers.
// We diff each of these between public/_headers and src/app/layout.tsx so
// the two stay in lockstep on third-party origins.
// Includes the security-floor directives (default-src, object-src, base-uri)
// alongside the third-party allowlists — a one-sided tightening of object-src
// or base-uri would silently degrade one host while leaving the other safe.
const SYNCED_CSP_DIRECTIVES = [
  'default-src',
  'script-src',
  'style-src',
  'img-src',
  'font-src',
  'connect-src',
  'frame-src',
  'media-src',
  'form-action',
  'object-src',
  'base-uri',
]

function extractCspDirectives(policy) {
  const out = new Map()
  if (!policy) return out
  for (const part of policy.split(';')) {
    const trimmed = part.trim()
    if (!trimmed) continue
    const [name, ...sources] = trimmed.split(/\s+/)
    out.set(name, new Set(sources))
  }
  return out
}

async function checkCspSync() {
  let headersBody, layoutBody
  try {
    headersBody = await readFile(join(ROOT, 'public', '_headers'), 'utf8')
  } catch {
    errors.push(
      'public/_headers is missing. CSP and other security headers will not be served on ' +
        'Cloudflare/Netlify deploys. Restore the file from the template.'
    )
    return
  }
  try {
    layoutBody = await readFile(join(ROOT, 'src', 'app', 'layout.tsx'), 'utf8')
  } catch {
    errors.push('src/app/layout.tsx is missing. Restore the file from the template.')
    return
  }
  const headersMatch = headersBody.match(/Content-Security-Policy:\s*([^\n]+)/)
  // Tolerate single or double quotes around the content attribute and
  // multi-line JSX formatting. The CSP itself contains nested quotes
  // (e.g. 'self', 'unsafe-inline') so we match the OUTER delimiter
  // exactly and accept either flavor.
  const layoutMatch =
    layoutBody.match(/httpEquiv=["']Content-Security-Policy["'][\s\S]*?content="([^"]+)"/) ||
    layoutBody.match(/httpEquiv=["']Content-Security-Policy["'][\s\S]*?content='([^']+)'/) ||
    layoutBody.match(/httpEquiv=["']Content-Security-Policy["'][\s\S]*?content=\{`([^`]+)`\}/)
  if (!headersMatch) {
    errors.push(
      'public/_headers has no Content-Security-Policy directive. Add one to keep the site ' +
        'protected on Cloudflare/Netlify deploys.'
    )
    return
  }
  if (!layoutMatch) {
    errors.push(
      'src/app/layout.tsx has no <meta http-equiv="Content-Security-Policy"> tag. Add one so ' +
        'GitHub Pages deploys still get baseline CSP protection.'
    )
    return
  }

  const headersCsp = extractCspDirectives(headersMatch[1])
  const layoutCsp = extractCspDirectives(layoutMatch[1])

  for (const directive of SYNCED_CSP_DIRECTIVES) {
    const hSet = headersCsp.get(directive) || new Set()
    const lSet = layoutCsp.get(directive) || new Set()
    const onlyInHeaders = [...hSet].filter((s) => !lSet.has(s))
    const onlyInLayout = [...lSet].filter((s) => !hSet.has(s))
    if (onlyInHeaders.length || onlyInLayout.length) {
      const detail = []
      if (onlyInHeaders.length) detail.push(`only in _headers: ${onlyInHeaders.join(' ')}`)
      if (onlyInLayout.length) detail.push(`only in layout.tsx: ${onlyInLayout.join(' ')}`)
      errors.push(
        `CSP "${directive}" drifted between public/_headers and src/app/layout.tsx — ${detail.join(' / ')}. ` +
          `Resource will load on one host and fail on the other. Update both files together.`
      )
    }
  }
}

async function checkSiteConfigUrl() {
  const cfgPath = join(ROOT, 'src', 'lib', 'site.config.ts')
  let cfg
  try {
    cfg = await readFile(cfgPath, 'utf8')
  } catch {
    return // missing config handled in checkSiteConfigExists
  }
  const m = cfg.match(/url:\s*['"]([^'"]+)['"]/)
  if (!m) return
  const raw = m[1]
  if (!raw.startsWith('https://')) {
    errors.push(
      `src/lib/site.config.ts: siteConfig.url "${raw}" must start with "https://". ` +
        `metadataBase = new URL(siteConfig.url) will throw at build time otherwise.`
    )
  }
  if (raw.endsWith('/')) {
    errors.push(
      `src/lib/site.config.ts: siteConfig.url "${raw}" must not end with "/". ` +
        `The siteUrl helper assumes no trailing slash; OG/Twitter card URLs will be malformed.`
    )
  }
  try {
    const u = new URL(raw)
    if (u.pathname !== '/' && u.pathname !== '') {
      errors.push(
        `src/lib/site.config.ts: siteConfig.url "${raw}" should be the bare origin (no path). ` +
          `Move any path component into the helpers that consume it.`
      )
    }
  } catch {
    errors.push(`src/lib/site.config.ts: siteConfig.url "${raw}" is not a parseable URL.`)
  }
}

async function checkSecurityTxtSync() {
  const wellKnownPath = join(ROOT, 'public', '.well-known', 'security.txt')
  const rootPath = join(ROOT, 'public', 'security.txt')
  let wellKnownBody, rootBody
  try {
    wellKnownBody = await readFile(wellKnownPath, 'utf8')
  } catch {
    errors.push('public/.well-known/security.txt is missing. Restore it from the template.')
    return
  }
  try {
    rootBody = await readFile(rootPath, 'utf8')
  } catch {
    errors.push(
      'public/security.txt is missing. It is required as a root-path fallback ' +
        'because GitHub Pages does not serve files in dot-prefixed directories.'
    )
    return
  }
  // Compare everything from the first non-comment, non-blank line onward.
  // The two files share the same body but have different header comments.
  function payload(body) {
    return body
      .split('\n')
      .filter((line) => !line.startsWith('#') && line.trim() !== '')
      .join('\n')
      .trim()
  }
  if (payload(wellKnownBody) !== payload(rootBody)) {
    errors.push(
      'public/security.txt and public/.well-known/security.txt have drifted. ' +
        'They must serve identical Contact/Expires/Canonical/Policy/Acknowledgments lines ' +
        'so RFC 9116 clients see the same data regardless of which path they hit.'
    )
  }
}

/**
 * Every route must be reachable by a visitor who only clicks.
 *
 * `/school-supply-lists` built, deployed, returned 200 and appeared in
 * sitemap.xml while having no link from the nav, the footer, or any page —
 * so it was reachable only by typing the URL. Nothing caught it: the sitemap
 * test asserts that routes on disk are *listed*, which this page passed, and
 * a listed-but-unlinked page is exactly what a search engine ranks worst.
 *
 * Policy pages are linked from the footer's own markup rather than `nav`, so
 * they are found by the footer scan rather than allowlisted. The allowlist is
 * only for routes deliberately reachable another way.
 */
async function checkRouteReachability() {
  const REACHABLE_WITHOUT_LINK = new Set([
    // Rendered by Next on error/404 rather than navigated to.
  ])

  let appEntries
  try {
    appEntries = await readdir(APP_DIR, { withFileTypes: true })
  } catch {
    return
  }

  const routes = []
  for (const entry of appEntries) {
    if (!entry.isDirectory()) continue
    if (entry.name.startsWith('_') || entry.name.startsWith('(')) continue
    if (APP_RESERVED.has(entry.name)) continue
    try {
      await stat(join(APP_DIR, entry.name, 'page.tsx'))
      routes.push('/' + entry.name)
    } catch {
      // No page.tsx — not a navigable route.
    }
  }
  if (routes.length === 0) return

  // Gather every internal link target across src/, from any of the forms the
  // codebase uses: `href="/x"`, `href: '/x'`, and `href={'/x'}`.
  const sourceFiles = await walk(SRC_DIR, (name) => name.endsWith('.tsx') || name.endsWith('.ts'))
  const linkedFrom = new Map()
  for (const file of sourceFiles) {
    const body = await readFile(file, 'utf8')
    const rel = relative(ROOT, file).split(sep).join('/')
    for (const m of body.matchAll(/href[=:]\s*\{?\s*['"](\/[a-z0-9-]*)['"]/gi)) {
      const target = m[1]
      if (!linkedFrom.has(target)) linkedFrom.set(target, new Set())
      linkedFrom.get(target).add(rel)
    }
  }

  for (const route of routes) {
    if (REACHABLE_WITHOUT_LINK.has(route)) continue
    const sources = linkedFrom.get(route)
    // A page linking only to itself is still orphaned.
    const external = [...(sources ?? [])].filter(
      (s) => s !== `src/app${route}/page.tsx` && s !== 'src/app/sitemap.ts'
    )
    if (external.length === 0) {
      errors.push(
        `Route ${route} is unreachable — nothing under src/ links to it (nav, footer, or another page). ` +
          `It will build, deploy and appear in the sitemap while no visitor can navigate to it. ` +
          `Add it to \`nav\` in src/lib/cw.ts, link it from a related page, or add it to ` +
          `REACHABLE_WITHOUT_LINK in scripts/check-drift.mjs if it is intentionally unlinked.`
      )
    }
  }
}

/**
 * Contact facts must come from `cw.ts`, not be retyped into a page.
 *
 * The director's name, the mailing address and the phone number were each
 * duplicated as literals in pages that also imported `contact` for other
 * fields. Nothing was wrong on the day — every copy matched — which is the
 * problem: the failure arrives months later as one stale page, silently, when
 * the director changes and four pages update and one does not.
 *
 * Only `src/app` and `src/components` are scanned. `src/lib/cw.ts` is the
 * definition and must contain these strings; `site.config.ts` legitimately
 * carries its own copy of the contact email for site-wide metadata.
 */
async function checkContactLiterals() {
  const cwPath = join(SRC_DIR, 'lib', 'cw.ts')
  let cwBody
  try {
    cwBody = await readFile(cwPath, 'utf8')
  } catch {
    return
  }

  // Pull the literal values straight out of cw.ts so this check cannot drift
  // from the source it is protecting.
  const field = (name) => cwBody.match(new RegExp(`\\b${name}:\\s*'([^']+)'`))?.[1]
  const guarded = [
    ['director', field('director')],
    ['phone', field('phone')],
    ['email', field('email')],
    ['directorEmail', field('directorEmail')],
    // Match the quoted strings themselves. Splitting the array literal on ','
    // cuts "Sierra Vista, AZ 85636" in half, and the resulting "Sierra Vista"
    // fragment then matches the city name in ordinary prose on six pages.
    ...[
      ...(cwBody.match(/const MAILING_LINES = \[([^\]]+)\]/)?.[1] ?? '').matchAll(/'([^']+)'/g),
    ].map((m) => ['mailingLines', m[1]]),
  ].filter(([, value]) => value)

  const files = [
    ...(await walk(join(SRC_DIR, 'app'), (n) => n.endsWith('.tsx'))),
    ...(await walk(join(SRC_DIR, 'components'), (n) => n.endsWith('.tsx'))),
  ]

  for (const file of files) {
    const body = await readFile(file, 'utf8')
    const rel = relative(ROOT, file).split(sep).join('/')
    for (const [fieldName, value] of guarded) {
      if (body.includes(value)) {
        errors.push(
          `${rel} hardcodes "${value}" — use \`contact.${fieldName}\` from src/lib/cw.ts instead. ` +
            `A retyped copy matches today and goes stale the moment the real value changes, with nothing to flag it.`
        )
      }
    }
  }
}

/**
 * The FFC footer attribution must be present on every page.
 *
 * The footer standard (FFC-IN-ffcadmin.org
 * docs/footer-standard-adoption-checklist.md) requires a "Supported by Free
 * For Charity" attribution linking to freeforcharity.org, and says explicitly
 * never to change or drop it. It is validated live by that repo's
 * scripts/gate3-validate.mjs, which looks for the brand text and the link as
 * two separate markers — so a restyle that keeps the words but drops the href,
 * or vice versa, fails the fleet audit.
 *
 * Checking both markers separately here means the failure is caught at commit
 * time in this repo rather than on a fleet-audit run somebody else has to
 * chase.
 */
async function checkFooterAttribution() {
  const footerPath = join(SRC_DIR, 'components', 'footer', 'index.tsx')
  let body
  try {
    body = await readFile(footerPath, 'utf8')
  } catch {
    errors.push(
      'src/components/footer/index.tsx is missing — the FFC footer attribution lives there.'
    )
    return
  }
  // Strip comments before matching. The explanatory block above the markup
  // names both markers, so a line-prefix filter is not enough — its inner
  // lines start with ordinary prose, not `*`, and the check then passes on
  // its own documentation while the real attribution is gone. Caught by
  // mutation test: renaming the visible link text to "Our Sponsor" was NOT
  // detected until block comments were removed wholesale.
  const code = body
    .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '') // {/* JSX comment */}
    .replace(/\/\*[\s\S]*?\*\//g, '') // /* block comment */
    .replace(/^\s*\/\/.*$/gm, '') // // line comment

  if (!/Free For Charity/.test(code)) {
    errors.push(
      'Footer is missing the "Free For Charity" attribution text required by the FFC footer ' +
        'standard. See docs/footer-standard-adoption-checklist.md in FFC-IN-ffcadmin.org — ' +
        'gate3-validate.mjs checks for this exact brand text on the live site.'
    )
  }
  if (!/href="https:\/\/freeforcharity\.org/.test(code)) {
    errors.push(
      'Footer is missing the https://freeforcharity.org link required by the FFC footer standard. ' +
        'The brand text and the link are audited as separate markers, so one without the other ' +
        'still fails the fleet audit.'
    )
  }
}

await checkSiteConfigExists()
await checkSiteConfigUrl()
await checkFooterAttribution()
await checkContactLiterals()
await checkRouteReachability()
await checkKebabCaseRoutes()
await checkAssetPathUsage()
await checkSecrets()
await checkPlaceholderUrl()
await checkCspSync()
await checkSecurityTxtSync()

if (warnings.length) {
  console.warn('\n⚠️  Drift warnings:')
  for (const w of warnings) console.warn('  - ' + w)
}
if (errors.length) {
  console.error('\n❌ Drift errors:')
  for (const e of errors) console.error('  - ' + e)
  console.error(
    '\nThese violate FFC best practices. Fix them or open an issue if you believe one is a false positive.'
  )
  process.exit(1)
}

console.log(
  warnings.length
    ? `\n✅ No drift errors (${warnings.length} warning${warnings.length === 1 ? '' : 's'}).`
    : '\n✅ No drift detected. Repo aligned with FFC best practices.'
)
