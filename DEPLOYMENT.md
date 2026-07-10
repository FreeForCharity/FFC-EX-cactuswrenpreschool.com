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

- **GitHub Pages URL (live now)**: https://freeforcharity.github.io/FFC-EX-cactuswrenpreschool.com/
- **Custom Domain (target — DNS not yet cut over)**: https://www.cactuswrenpreschool.com

> **Note:** The custom domain `cactuswrenpreschool.com` still points at Wix. Until DNS is cut over (see [DNS Cutover from Apex](#dns-cutover-from-apex-wix--github-pages)), the production build serves from the GitHub Pages project URL above, under the `/FFC-EX-cactuswrenpreschool.com` subpath.

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
npm run smoke -- https://freeforcharity.github.io/FFC-EX-cactuswrenpreschool.com/
```

> **Known non-issue:** GitHub Pages can serve a freshly deployed asset (manifest icons, favicons) as `404` for a few seconds on some edge nodes _immediately_ after `deploy-pages` returns, while the already-cached home page serves `200`. The post-deploy smoke check now retries `404` on those asset checks within its deadline so this CDN propagation lag no longer marks the deploy as failed. This was the root cause of the recurring "Production deployment failed" incidents.

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
2. **Setup Node.js**: Installs Node.js 20.x
3. **Install dependencies**: Runs `npm ci` for a clean installation
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
2. **Setup Node.js**: Installs Node.js 20.x
3. **Setup Pages**: Configures GitHub Pages settings
4. **Restore Next.js cache**: Restores build cache for faster builds
5. **Install dependencies**: Runs `npm ci` for a clean installation
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
  # No CNAME → github.io subpath deploy
  NEXT_PUBLIC_BASE_PATH="/FFC-EX-cactuswrenpreschool.com"
fi
```

Because there is **no `public/CNAME` yet**, the current build uses `NEXT_PUBLIC_BASE_PATH=/FFC-EX-cactuswrenpreschool.com` so images and assets resolve correctly at the GitHub Pages subpath. Adding a `CNAME` during DNS cutover automatically flips the build to the empty root path — no workflow edit required.

### Viewing Deployment Status

1. Go to the **Actions** tab in the GitHub repository
2. Click on the latest workflow run
3. Review the status of each step
4. Check logs if any step fails

---

## Manual Deployment

While automated deployment is recommended, you can also deploy manually if needed.

### Prerequisites

- Node.js 20.x installed
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
   npm install
   ```

3. **Run tests** to ensure everything works:

   ```bash
   npm run lint
   npm test
   npm run test:e2e
   ```

4. **Build the site** with the correct base path (matches the current no-CNAME subpath deploy):

   ```bash
   NEXT_PUBLIC_BASE_PATH=/FFC-EX-cactuswrenpreschool.com npm run build
   ```

5. **Verify the build**:

   ```bash
   npm run preview
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
npm run build
npm run preview
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

The custom domain (`cactuswrenpreschool.com`) is **not yet connected** — DNS still points at Wix. When you are ready to connect it, follow the [DNS Cutover from Apex](#dns-cutover-from-apex-wix--github-pages) runbook below, which covers the `public/CNAME` file, the DNS records, and the basePath flip in one ordered checklist.

Quick reference for the CNAME file (added during cutover):

```
www.cactuswrenpreschool.com
```

Once `public/CNAME` exists, the **Determine base path** step builds with an empty `NEXT_PUBLIC_BASE_PATH` automatically — no other change needed.

---

## DNS Cutover from Apex (Wix → GitHub Pages)

The site is fully built and verified on GitHub Pages, but the domain `cactuswrenpreschool.com` still resolves to **Wix** (apex `A` records in the `185.230.63.x` range, `www` served by Wix). This section is the ordered runbook for moving the domain to the GitHub Pages deployment.

### Pre-cutover checklist (do these first)

- [x] Site content migrated off Wix and served locally (no Wix dependencies).
- [x] All routes verified live on Pages — see [Current Deployment Status](#current-deployment-status).
- [x] PWA manifest, `security.txt`, `robots.txt`, `sitemap.xml`, favicons, and security headers verified.
- [x] Post-deploy smoke check tolerant of CDN propagation lag (deploys go green).
- [ ] Confirm you have access to the DNS zone for `cactuswrenpreschool.com` (registrar or Cloudflare).
- [ ] Decide the canonical host — this template targets **`www.cactuswrenpreschool.com`** with an apex redirect.

### Cutover steps

1. **Add the `CNAME` file** to the repo so GitHub Pages claims the domain and the build switches to the root base path:

   ```bash
   echo "www.cactuswrenpreschool.com" > public/CNAME
   git add public/CNAME
   git commit -m "chore: add CNAME for cactuswrenpreschool.com cutover"
   ```

   Merging this to `main` triggers a deploy that builds with an empty `NEXT_PUBLIC_BASE_PATH` (root paths), and GitHub registers the custom domain.

2. **Update `src/lib/site.config.ts`** `url` from `https://freeforcharity.github.io` to `https://www.cactuswrenpreschool.com` so canonical URLs, `sitemap.xml`, `robots.txt`, and `security.txt` emit the production domain. (The drift check requires the bare origin with no path component.)

3. **Set DNS records** at the domain's DNS provider:

   | Type    | Name  | Value                                                     |
   | ------- | ----- | --------------------------------------------------------- |
   | `CNAME` | `www` | `freeforcharity.github.io`                                |
   | `A`     | `@`   | `185.199.108.153`                                         |
   | `A`     | `@`   | `185.199.109.153`                                         |
   | `A`     | `@`   | `185.199.110.153`                                         |
   | `A`     | `@`   | `185.199.111.153`                                         |
   | `AAAA`  | `@`   | `2606:50c0:8000::153` (+ `8001`, `8002`, `8003` variants) |

   These are GitHub Pages' apex IPs. **Remove the existing Wix `A`/`ALIAS` records** (`185.230.63.x`) for the apex and `www` in the same change.

4. **Set the custom domain in GitHub** → Settings → Pages → Custom domain: `www.cactuswrenpreschool.com`, then wait for the DNS check to pass and **enable "Enforce HTTPS"** (GitHub provisions the Let's Encrypt certificate automatically once DNS resolves).

5. **Verify** after propagation (can take up to 24–48h, usually much less):

   ```bash
   dig +short www.cactuswrenpreschool.com   # → freeforcharity.github.io CNAME chain
   dig +short cactuswrenpreschool.com        # → the four 185.199.x GitHub apex IPs
   npm run smoke -- https://www.cactuswrenpreschool.com/
   ```

   All smoke checks should pass, and asset/icon URLs should now be root-relative (no `/FFC-EX-cactuswrenpreschool.com` prefix).

### Rollback

If anything is wrong after cutover, restore the previous Wix `A`/`ALIAS` records at the DNS provider (DNS change only — no code change needed). The GitHub Pages deployment stays live at `https://freeforcharity.github.io/FFC-EX-cactuswrenpreschool.com/` regardless, so there is no downtime window on the Pages side.

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
  run: npm run build
  env:
    NEXT_PUBLIC_BASE_PATH: ${{ steps.basepath.outputs.value }}
```

The other `NEXT_PUBLIC_*` analytics variables would be set as repository or environment secrets if enabled; none are required for the site to build or deploy.

### Local Development

For local development, create a `.env.local` file:

```env
# Optional: Set basePath for testing GitHub Pages locally
NEXT_PUBLIC_BASE_PATH=

# Optional: Analytics IDs (only loaded with user consent)
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
   npm run lint
   npm test
   npm run build
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
NEXT_PUBLIC_BASE_PATH=/FFC-EX-cactuswrenpreschool.com npm run build

# Serve the built site
npm run preview

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

- [ ] All tests pass locally (`npm test` and `npm run test:e2e`)
- [ ] Linting passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
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
