# Deployment Guide

This document explains how the **Cactus Wren Cooperative Preschool** website (built on the Free For Charity single-page template) is deployed to GitHub Pages, and provides troubleshooting guidance for deployment issues.

## Table of Contents

1. [Overview](#overview)
2. [Current Deployment Status](#current-deployment-status)
3. [Deployment Architecture](#deployment-architecture)
4. [Automated Deployment](#automated-deployment)
5. [Manual Deployment](#manual-deployment)
6. [Domain Configuration](#domain-configuration)
7. [DNS Cutover from Apex (Wix → GitHub Pages)](#dns-cutover-from-apex-wix--github-pages)
8. [Environment Variables](#environment-variables)
9. [Troubleshooting](#troubleshooting)
10. [Rollback Procedures](#rollback-procedures)

---

## Overview

The Cactus Wren Cooperative Preschool website is a static Next.js application deployed to GitHub Pages. It was migrated off Wix into the FFC template, and every asset (content, media, documents, fonts) is served locally so the site is fully decoupled from Wix.

The site is currently live at:

- **Custom domain (canonical, live)**: https://cactuswrenpreschool.com
- **`www` subdomain**: `301`-redirects to the apex
- **GitHub Pages project URL**: `https://freeforcharity.github.io/FFC-EX-cactuswrenpreschool.com/` — redirects to the apex now that Pages has claimed the custom domain

> **DNS cutover completed 2026-08-16.** The apex `A` records point at the GitHub Pages IPs, `www` is
> a `CNAME` to `freeforcharity.github.io`, and the Google Workspace `MX`/SPF records were preserved.
>
> **The canonical host is the APEX**, set both in Settings → Pages and in `public/CNAME`. Those two
> must agree: the `CNAME` file in each deployed artifact overwrites the Pages UI setting, so a
> mismatch silently reverses the canonical host on the next deploy.
>
> Until the first deploy that carries `public/CNAME`, the artifact served at the apex was still the
> old **subpath** build, so every asset requested `/FFC-EX-cactuswrenpreschool.com/_next/…` and
> returned `404` while the HTML itself returned `200`. That is the signature of this specific
> mismatch: pages load, styling and fonts do not. It clears with the first custom-domain deploy.

### Technology Stack

- **Framework**: Next.js 16 with static export (`output: 'export'`)
- **Hosting**: GitHub Pages (build type: GitHub Actions)
- **CI/CD**: GitHub Actions
- **Node.js**: Version 20.x

---

## Current Deployment Status

_Last verified: 2026-07-09 against the live GitHub Pages deployment._

The GitHub Pages deployment is **healthy and serving**. Feature verification against `https://freeforcharity.github.io/FFC-EX-cactuswrenpreschool.com/`:

| Area                   | Status | Notes                                                                          |
| ---------------------- | ------ | ------------------------------------------------------------------------------ |
| Home page              | ✅     | HTTP 200                                                                       |
| All 16 content routes  | ✅     | 17/17 pages return HTTP 200 (see route list below)                             |
| PWA manifest + icons   | ✅     | `/manifest.webmanifest` valid; `android-chrome-{192,512}` icons resolve        |
| SEO metadata           | ✅     | CSP `<meta>`, theme-color, Open Graph + Twitter cards, `<link rel="manifest">` |
| `robots.txt` + sitemap | ✅     | `/robots.txt` references sitemap; `/sitemap.xml` lists URLs                    |
| `security.txt`         | ✅     | Served at `/security.txt`; valid Contact + future Expires                      |
| Branded 404            | ✅     | `404.html` returns HTTP 404 with the branded heading                           |
| Favicons               | ✅     | `/favicon.ico`, `/icon.png` reachable                                          |
| Security headers       | ✅     | `public/_headers` (Cloudflare/Netlify) + CSP `<meta>` (GitHub Pages)           |

**Verified routes** (all HTTP 200, no trailing slash — Next.js static export emits `<route>.html`):

`/` · `/about-us` · `/calendar` · `/class-schedules` · `/contact` · `/curriculum` · `/documents-links` · `/employment` · `/enrollment` · `/enrollment-process` · `/health-policy` · `/photo-gallery` · `/privacy-policy` · `/scholarship-information` · `/school-supply-lists` · `/tuition` · `/volunteering`

Re-run this verification any time with the shipped smoke check:

```bash
pnpm run smoke -- https://freeforcharity.github.io/FFC-EX-cactuswrenpreschool.com/
```

> **Recurring deploy failures (fixed):** On the subpath deploy, the post-deploy smoke check built each manifest-icon URL by concatenating the deploy base URL (which ends in `/FFC-EX-cactuswrenpreschool.com`) onto the icon's manifest `src` (which _already_ includes `/FFC-EX-cactuswrenpreschool.com/…`), producing a doubled path that `404`s **deterministically**. That failed the smoke-check step on every deploy and auto-filed the "Production deployment failed" incidents even though the site itself was healthy. The check now resolves icon `src` values against the origin with `new URL()` so the base path is not doubled, and additionally retries transient `404`s to absorb genuine post-deploy CDN propagation lag.

---

## Deployment Architecture

### Static Site Generation

The application uses Next.js static export mode configured in `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}
```

This generates a static site in the `./out` directory that can be served by any static file server, including GitHub Pages.

### Asset Path Handling

The site uses the `assetPath()` helper function (located in `src/lib/assetPath.ts`) to handle assets correctly for both:

1. **GitHub Pages subpath deployment**: `/FFC-EX-cactuswrenpreschool.com/`
2. **Custom domain deployment**: Root path `/`

The helper uses the `NEXT_PUBLIC_BASE_PATH` environment variable to determine the correct asset path.

---

## Automated Deployment

### GitHub Actions Workflows

Deployment is fully automated through GitHub Actions with two sequential workflows:

1. **CI Workflow** (`.github/workflows/ci.yml`) - Runs on all PRs and pushes to main
2. **Deploy Workflow** (`.github/workflows/deploy.yml`) - Runs after CI workflow completes successfully

#### Trigger Conditions

The deployment workflow runs automatically when:

1. **CI workflow completes successfully**: After the CI workflow finishes all tests on a push to `main` branch
2. **Manual trigger**: Can be triggered manually from the Actions tab (bypasses CI wait)

**Important**: The deployment workflow will only run if the CI workflow completed successfully. This ensures all tests pass before deploying to production.

#### CI Workflow Steps (`.github/workflows/ci.yml`)

Runs on all pull requests and pushes to main:

1. **Checkout code**: Retrieves the latest code from the repository
2. **Setup Node.js**: Installs Node.js 22.x
3. **Install dependencies**: Runs `pnpm install --frozen-lockfile` for a clean installation
4. **Check formatting**: Runs Prettier format check
5. **Run linting**: Executes ESLint to catch code issues
6. **Run unit tests**: Executes Jest tests to verify code quality
7. **Install Playwright**: Sets up E2E testing environment
8. **Build site**: Runs `next build` with appropriate environment variables
9. **Run E2E tests**: Validates the built site with Playwright tests

#### Deploy Workflow Steps (`.github/workflows/deploy.yml`)

Triggered automatically after the CI workflow completes successfully on push to the main branch:

**Note**: The deploy workflow only runs if the CI workflow completed successfully. This is enforced by the `workflow_run` trigger and job-level conditional.

The actual steps performed by the deploy workflow are:

1. **Checkout code**: Retrieves the tested code from the repository
2. **Setup Node.js**: Installs Node.js 22.x
3. **Setup Pages**: Configures GitHub Pages settings
4. **Restore Next.js cache**: Restores build cache for faster builds
5. **Install dependencies**: Runs `pnpm install --frozen-lockfile` for a clean installation
6. **Determine base path**: Auto-derives `NEXT_PUBLIC_BASE_PATH` from whether `public/CNAME` exists (see below)
7. **Build site**: Runs `next build` with the derived basePath
8. **Upload artifact**: Packages the `./out` directory
9. **Deploy to GitHub Pages**: Publishes the site (separate job)
10. **Post-deploy smoke check**: Runs `scripts/smoke-check.mjs` against the live URL

#### Base Path is Auto-Derived (no manual env var)

The deploy workflow no longer hard-codes `NEXT_PUBLIC_BASE_PATH`. Its **Determine base path** step picks the correct value automatically:

```bash
if [ -s "public/CNAME" ]; then
  # Custom domain present → serve from origin root (empty basePath)
  NEXT_PUBLIC_BASE_PATH=""
else
  # No CNAME → github.io subpath deploy, derived from the repo name
  # (GITHUB_REPOSITORY is "owner/repo"; strip the owner). For this repo
  # that resolves to /FFC-EX-cactuswrenpreschool.com.
  REPO_NAME="${GITHUB_REPOSITORY#*/}"
  NEXT_PUBLIC_BASE_PATH="/$REPO_NAME"
fi
```

`public/CNAME` now exists (`cactuswrenpreschool.com`), so the build uses an **empty** `NEXT_PUBLIC_BASE_PATH` and every asset resolves from the origin root. Verified on the cutover branch: the built artifact went from 62 root-relative `/FFC-EX-cactuswrenpreschool.com/` references to **0**.

The trade-off this creates is the reason the cutover is ordered the way it is: once GitHub Pages claims a custom domain, the project URL `freeforcharity.github.io/FFC-EX-cactuswrenpreschool.com/` **301-redirects to that domain**. Merging the CNAME therefore sends the preview URL to whatever DNS currently answers for `www` — Wix, until the DNS flip lands.

### Viewing Deployment Status

1. Go to the **Actions** tab in the GitHub repository
2. Click on the latest workflow run
3. Review the status of each step
4. Check logs if any step fails

---

## Manual Deployment

While automated deployment is recommended, you can also deploy manually if needed.

### Prerequisites

- Node.js 22.x installed
- GitHub CLI (`gh`) or GitHub Personal Access Token
- Write access to the repository

### Manual Deployment Steps

1. **Clone the repository** (if not already done):

   ```bash
   git clone https://github.com/FreeForCharity/FFC-EX-cactuswrenpreschool.com.git
   cd FFC-EX-cactuswrenpreschool.com
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Run tests** to ensure everything works:

   ```bash
   pnpm run lint
   pnpm test
   pnpm run test:e2e
   ```

4. **Build the site**. `public/CNAME` is present, so the custom-domain build is the default and needs
   no base path — this matches what CI produces:

   ```bash
   pnpm run build
   ```

   To reproduce the old github.io subpath build instead (rarely needed):

   ```bash
   NEXT_PUBLIC_BASE_PATH=/FFC-EX-cactuswrenpreschool.com pnpm run build
   ```

5. **Verify the build**:

   ```bash
   pnpm run preview
   # Visit http://localhost:3000 to test
   ```

6. **Deploy to GitHub Pages** using the GitHub CLI:
   ```bash
   # This step requires appropriate permissions and setup
   # Typically done through the GitHub Actions workflow
   ```

### Building for Custom Domain

If deploying to a custom domain (no basePath needed):

```bash
pnpm run build
pnpm run preview
```

The site will be built without a base path, making all assets available at the root.

---

## Domain Configuration

### GitHub Pages Configuration

This repo deploys with the **GitHub Actions** build type (not "Deploy from a branch"). The `deploy.yml` workflow calls `actions/configure-pages` with `enablement: true`, so Pages is enabled automatically on first run — no manual Settings toggle is required. To confirm:

1. **Go to repository Settings** → **Pages**
2. **Source**: should read **"GitHub Actions"**

There is no `gh-pages` branch; the built `./out` directory is uploaded as a Pages artifact and published directly.

### Custom Domain Setup

The custom domain (`cactuswrenpreschool.com`) is **not yet connected** — DNS still points at Wix. The repo-side preparation (CNAME file, `siteConfig.url`, `security.txt` canonicals) is done; what remains is the DNS change itself. Follow the [DNS Cutover from Apex](#dns-cutover-from-apex-wix--github-pages) runbook below.

Quick reference — the contents of `public/CNAME`:

```
cactuswrenpreschool.com
```

Because that file exists, the **Determine base path** step builds with an empty `NEXT_PUBLIC_BASE_PATH` automatically — no other change needed.

---

## DNS Cutover from Apex (Wix → GitHub Pages)

The site is fully built and verified on GitHub Pages, but the domain `cactuswrenpreschool.com` still resolves to **Wix** (apex `A` records in the `185.230.63.x` range, `www` served by Wix). This section is the ordered runbook for moving the domain to the GitHub Pages deployment.

### Where the zone actually lives (read this first)

The registrar transfer started in WHMCS is **not** what unblocks this cutover, and waiting for it is
not required. Two separate facts:

- `cactuswrenpreschool.com` is delegated to **`ns14.wixdns.net` / `ns15.wixdns.net`**. Wix is the
  DNS host, and the records below are edited **in the Wix DNS panel**.
- Wix [does not permit changing nameservers](https://support.wix.com/en/article/request-changing-name-server-ns-records-for-a-wix-domain)
  on a Wix-registered domain. That is why Cloudflare cannot serve this zone yet — Cloudflare's free
  plan requires full NS delegation. Cloudflare becomes available only after the registrar transfer
  completes and NS can be repointed.

So the cutover is done **from Wix**, by editing records in place. Moving to Cloudflare later is a
follow-up that does not block going live on Pages.

### Captured zone (rollback record, captured 2026-08-16)

| Type    | Name  | Value                                                | Cutover action    |
| ------- | ----- | ---------------------------------------------------- | ----------------- |
| `NS`    | `@`   | `ns14.wixdns.net`, `ns15.wixdns.net`                 | leave alone       |
| `A`     | `@`   | `185.230.63.107`, `185.230.63.171`, `185.230.63.186` | **replace** (Wix) |
| `CNAME` | `www` | `cdn1.wixdns.net`                                    | **replace** (Wix) |
| `MX`    | `@`   | `10 smtp.google.com`                                 | **DO NOT TOUCH**  |
| `TXT`   | `@`   | `v=spf1 include:_spf.google.com ~all`                | **DO NOT TOUCH**  |
| `CAA`   | `@`   | none set                                             | leave unset       |

> ⚠️ **The charity's email runs on Google Workspace.** The `MX` and SPF `TXT` records above are the
> only thing keeping mail flowing. Deleting them — or using a Wix "remove all records / disconnect"
> action that clears the zone — takes the preschool's email down. Change **only** the apex `A` and
> the `www` `CNAME`.
>
> No `CAA` record is set, so Let's Encrypt is free to issue GitHub's certificate. If a `CAA` record
> is ever added, it must include `letsencrypt.org` or HTTPS provisioning will silently fail.

### Pre-cutover checklist

- [x] Site content migrated off Wix and served locally (no Wix dependencies).
- [x] All routes verified live on Pages — see [Current Deployment Status](#current-deployment-status).
- [x] PWA manifest, `security.txt`, `robots.txt`, `sitemap.xml`, favicons, and security headers verified.
- [x] Post-deploy smoke check tolerant of CDN propagation lag (deploys go green).
- [x] Canonical host decided — **`cactuswrenpreschool.com`**, with the apex redirecting to it.
      This matches what Wix serves today (apex already `301`s to `www`), so inbound links and search
      rankings carry over.
- [x] `public/CNAME`, `siteConfig.url`, and both `security.txt` copies updated; build verified to
      emit **0** subpath references.
- [x] Existing zone captured above for rollback.
- [ ] **A FreeForCharity organization owner has verified `cactuswrenpreschool.com` under
      Organization Settings → Pages.** This is an org-level step, separate from the repo's own Pages
      settings, and only an org owner can do it — so it is the item most likely to stall the cutover
      on someone else's availability. Verifying the domain also stops any other GitHub account from
      claiming it for their Pages site. Raised on #44.
- [ ] Confirm Wix DNS panel access for the account holding the domain.
- [ ] Lower the TTL on the apex `A` and `www` `CNAME` from `3600` to `300`, **at least an hour
      before** the cutover. This is what makes rollback fast — at a 3600s TTL a bad cutover is
      pinned in resolver caches for an hour.

### Cutover steps

Steps 1 and 2 are **already done on the cutover branch** — they land when its PR merges.

1. **`public/CNAME`** contains `cactuswrenpreschool.com`, so Pages claims the domain and the
   build switches to the root base path.
2. **`src/lib/site.config.ts`** `url` is `https://cactuswrenpreschool.com`, so canonical URLs,
   `sitemap.xml`, `robots.txt`, and `security.txt` emit the production domain.

3. **Merge the cutover PR**, then let the deploy finish.

   > Ordering note: merging makes Pages claim the domain, which causes
   > `freeforcharity.github.io/FFC-EX-cactuswrenpreschool.com/` to **301-redirect to
   > `cactuswrenpreschool.com`** — still Wix at this moment. That is expected and harmless:
   > visitors keep seeing the old site until DNS changes. It does mean the Pages preview URL stops
   > being a way to view the new site, so **do the final visual review before merging.**

4. **Change the two record sets in the Wix DNS panel** (Wix → Domains → `cactuswrenpreschool.com` →
   Advanced → Edit DNS Records). Delete the three Wix apex `A` records and the `www` `CNAME`, then
   add:

   | Type    | Name  | Value                      | TTL   |
   | ------- | ----- | -------------------------- | ----- |
   | `CNAME` | `www` | `freeforcharity.github.io` | `300` |
   | `A`     | `@`   | `185.199.108.153`          | `300` |
   | `A`     | `@`   | `185.199.109.153`          | `300` |
   | `A`     | `@`   | `185.199.110.153`          | `300` |
   | `A`     | `@`   | `185.199.111.153`          | `300` |

   Optionally also add the apex `AAAA` records `2606:50c0:8000::153`, `2606:50c0:8001::153`,
   `2606:50c0:8002::153`, `2606:50c0:8003::153`. These are the canonical GitHub Pages targets held in
   `scripts/cloudflare-api-common.ps1` in FFC-Cloudflare-Automation — take them from there rather
   than copying them around, since GitHub does rotate them.

   Wix may warn that editing these records **disconnects the site from Wix**. That is the intended
   outcome. Do not accept any option that also clears `MX`/`TXT`.

5. **Set the custom domain in GitHub** → Settings → Pages → Custom domain:
   `cactuswrenpreschool.com`. Wait for the DNS check to pass, then **enable "Enforce HTTPS"**.

   > Requires the org-level domain verification from the pre-cutover checklist to already be in
   > place. Without it this step can be rejected outright, and it needs an org owner — so confirm it
   > is done before starting the cutover, not at this point in the sequence.

   > "Enforce HTTPS" stays greyed out until GitHub has issued the Let's Encrypt certificate, which
   > only starts once DNS resolves to Pages. Expect a window of minutes to about an hour where
   > `https://cactuswrenpreschool.com` serves a certificate warning. This is normal and clears
   > itself; do not roll back over it. Come back and tick the box once it is selectable.

6. **Verify** after propagation:

   ```bash
   pnpm run smoke -- https://cactuswrenpreschool.com/

   # From the FFC-Cloudflare-Automation checkout — read-only go/no-go, no dig required:
   node scripts/preflight-cutover.mjs --domains=cactuswrenpreschool.com --marker="Cactus Wren"
   ```

   Also confirm mail still flows — send a test message to the preschool's Google Workspace address.

### Rollback

DNS-only; no code change is needed, and the Pages deployment is unaffected. In the Wix DNS panel,
restore the apex `A` records to `185.230.63.107`, `185.230.63.171`, `185.230.63.186` and the `www`
`CNAME` to `cdn1.wixdns.net`. With TTLs pre-lowered to `300` this takes effect in about five minutes.

Note that the Pages project URL no longer serves as a fallback once the custom domain is claimed — it
redirects to `www`. To fully revert, also remove the custom domain in Settings → Pages and revert the
`public/CNAME` file.

---

## Environment Variables

### Build-Time Variables

These variables are embedded during the build process:

| Variable                         | Purpose                    | Default           | Required |
| -------------------------------- | -------------------------- | ----------------- | -------- |
| `NEXT_PUBLIC_BASE_PATH`          | Base path for GitHub Pages | (empty)           | No       |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`  | Google Analytics ID        | `G-XXXXXXXXXX`    | No       |
| `NEXT_PUBLIC_META_PIXEL_ID`      | Meta Pixel ID              | `XXXXXXXXXXXXXXX` | No       |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Microsoft Clarity ID       | `XXXXXXXXXX`      | No       |

### Setting Environment Variables in GitHub Actions

`NEXT_PUBLIC_BASE_PATH` is **derived automatically** by the workflow's _Determine base path_ step (see [Base Path is Auto-Derived](#base-path-is-auto-derived-no-manual-env-var)) and passed to the build:

```yaml
- name: Build with Next.js
  run: pnpm run build
  env:
    NEXT_PUBLIC_BASE_PATH: ${{ steps.basepath.outputs.value }}
```

The other `NEXT_PUBLIC_*` analytics variables would be set as repository or environment secrets if enabled; none are required for the site to build or deploy.

### Local Development

For local development, create a `.env.local` file:

```env
# Optional: Set basePath for testing GitHub Pages locally
NEXT_PUBLIC_BASE_PATH=

# Optional: Analytics IDs.
#
# These may or may not be read here: analytics wiring differs between FFC
# sites, and on many of them the IDs are set in code instead. Check how this
# repo actually wires analytics before relying on these variables, or on any
# description of when a tag loads and what consent gates.
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_CLARITY_PROJECT_ID=
```

**Note**: Never commit `.env.local` or any file containing secrets to the repository.

---

## Troubleshooting

### Common Issues

#### Issue: Images Not Loading

**Symptoms**: Images return 404 errors or don't display

**Causes**:

- Incorrect `NEXT_PUBLIC_BASE_PATH` setting
- Not using the `assetPath()` helper function
- Missing images in the `public` directory

**Solutions**:

1. Verify `NEXT_PUBLIC_BASE_PATH` is set correctly in the build environment
2. Check that all image paths use `assetPath()`:
   ```tsx
   import { assetPath } from '@/lib/assetPath'
   ;<img src={assetPath('/images/logo.png')} alt="Logo" />
   ```
3. Ensure images exist in the `public` directory

#### Issue: Build Fails

**Symptoms**: GitHub Actions workflow fails during the build step

**Common Causes**:

- TypeScript errors
- Linting errors
- Missing dependencies
- Test failures

**Solutions**:

1. Run locally to reproduce:
   ```bash
   pnpm run lint
   pnpm test
   pnpm run build
   ```
2. Fix any errors reported
3. Commit and push fixes
4. Verify the new workflow run succeeds

#### Issue: 404 on Page Routes

**Symptoms**: Direct navigation to routes returns 404

**Cause**: GitHub Pages doesn't support client-side routing by default

**Solution**: Next.js static export handles this automatically. Ensure:

1. `output: 'export'` is set in `next.config.ts`
2. All pages are pre-rendered during build
3. No dynamic routes are used (or they're pre-generated with `generateStaticParams`)

#### Issue: Styles Not Applied

**Symptoms**: Site displays with no styling

**Causes**:

- CSS build errors
- Incorrect asset paths
- Tailwind CSS configuration issues

**Solutions**:

1. Check build logs for CSS compilation errors
2. Verify `postcss.config.mjs` and Tailwind config are correct
3. Clear browser cache and hard refresh
4. Check that CSS files are in the `./out` directory after build

### Deployment Logs

To view detailed deployment logs:

1. Go to **Actions** tab in GitHub
2. Click on the failed workflow run
3. Click on the job that failed (usually "build")
4. Expand the failed step to see detailed logs
5. Look for error messages and stack traces

### Testing Deployments Locally

To test the built site locally before deploying:

```bash
# Build with GitHub Pages configuration
NEXT_PUBLIC_BASE_PATH=/FFC-EX-cactuswrenpreschool.com pnpm run build

# Serve the built site
pnpm run preview

# Open http://localhost:3000/FFC-EX-cactuswrenpreschool.com in your browser
```

This simulates how the site will behave on GitHub Pages.

---

## Rollback Procedures

### Rolling Back to a Previous Deployment

If a deployment introduces issues, you can roll back:

#### Method 1: Revert the Commit

```bash
# Find the commit hash of the last good deployment
git log

# Revert to the previous commit
git revert <commit-hash>

# Push to trigger a new deployment
git push origin main
```

#### Method 2: Re-deploy a Previous Version

```bash
# Checkout the previous working commit
git checkout <previous-commit-hash>

# Create a new branch
git checkout -b rollback/fix-deployment

# Push and create a PR to main
git push origin rollback/fix-deployment
```

#### Method 3: Redeploy from Actions

1. Go to **Actions** tab
2. Find a previous successful workflow run
3. Click **"Re-run jobs"** → **"Re-run all jobs"**
4. This will re-deploy the previous version

### Emergency Rollback

For critical issues requiring immediate rollback:

1. **Disable GitHub Pages temporarily**:
   - Go to Settings → Pages
   - Set Source to "None"
   - This takes the site offline while you fix the issue

2. **Fix the issue** on a separate branch

3. **Test thoroughly** before re-deploying

4. **Re-enable GitHub Pages** once fixed

---

## Deployment Checklist

Before merging to main (which triggers deployment):

- [ ] All tests pass locally (`pnpm test` and `pnpm run test:e2e`)
- [ ] Linting passes (`pnpm run lint`)
- [ ] Build succeeds (`pnpm run build`)
- [ ] Manual testing completed on localhost
- [ ] Screenshots taken for UI changes
- [ ] Documentation updated
- [ ] Code reviewed and approved
- [ ] No sensitive data in code or commits

---

## Additional Resources

- [Next.js Static Export Documentation](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Repository README](./README.md)
- [Testing Documentation](./TESTING.md)

---

**Questions?** Open an issue or contact the maintainers at hello@freeforcharity.org
