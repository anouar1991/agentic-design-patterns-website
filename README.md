# Agentic Design Patterns Learning Platform

An interactive learning platform for exploring agentic AI design patterns through visualizations, clickable code examples, interactive diagrams, and quizzes. Built with React, TypeScript, and Vite.

**Live site:** https://noreddine.github.io/Agentic_Design_Patterns/

## Getting Started

### Prerequisites

- Node.js 22+
- npm 10+

### Local Development

```bash
npm install
npm run dev
```

Open http://localhost:5173/Agentic_Design_Patterns/ in your browser.

### Production Build

```bash
npm run build
npm run preview
```

The `preview` command serves the production build locally at http://localhost:4173/Agentic_Design_Patterns/.

## Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages via a GitHub Actions workflow.

### Step 1: Enable GitHub Pages in Repository Settings

GitHub Pages must be enabled manually in your repository before the first deployment:

1. Go to your repository on GitHub
2. Click **Settings** (gear icon in the top navigation bar)
3. In the left sidebar, click **Pages** (under "Code and automation")
4. Under **Source**, select **Deploy from a branch**
5. Under **Branch**, select `gh-pages` and leave the folder as `/ (root)`
6. Click **Save**

If the `gh-pages` branch does not exist yet, push to `main` first to trigger the workflow (Step 2), then return here to enable Pages.

### Step 2: Deploy via Push to Main

1. Push to the `main` branch triggers the workflow (`.github/workflows/deploy.yml`)
2. The workflow installs dependencies, builds the project, and deploys the `dist/` output to the `gh-pages` branch
3. GitHub Pages serves the content from the `gh-pages` branch

### Step 3: Verify the Deployment

Once deployed, the site is available at:

```
https://<username>.github.io/Agentic_Design_Patterns/
```

For this repository: https://noreddine.github.io/Agentic_Design_Patterns/

To verify:

1. Open the URL above in your browser
2. Confirm the homepage loads with the hero section
3. Navigate to a chapter page and verify interactive content works
4. Check the browser console for errors (there should be none)

You can also monitor deployment status in the repository's **Actions** tab.

### Optional: Supabase Integration

The platform supports optional Supabase authentication. To enable it, add these as GitHub repository secrets:

1. Go to repository **Settings** > **Secrets and variables** > **Actions**
2. Click **New repository secret** and add each:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
3. Re-run the workflow (or push a new commit) for the secrets to take effect

Without these secrets, the platform works fully in read-only mode with all learning content accessible.

### Optional: Custom Domain Setup

To use a custom domain instead of `github.io`:

1. **Create a CNAME file** in the `public/` directory with your domain:

   ```
   learn.yourdomain.com
   ```

   This file is copied to `dist/` during the build and persists across deployments.

2. **Configure DNS** with your domain provider:

   - For a subdomain (e.g., `learn.yourdomain.com`): Add a `CNAME` record pointing to `<username>.github.io`
   - For an apex domain (e.g., `yourdomain.com`): Add `A` records pointing to GitHub Pages IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```

3. **Enable in GitHub Settings:**
   - Go to repository **Settings** > **Pages**
   - Under "Custom domain", enter your domain and save
   - Check "Enforce HTTPS" once the certificate is provisioned

4. **Update the site URL** by setting the `VITE_SITE_URL` repository variable to your custom domain URL (e.g., `https://learn.yourdomain.com/Agentic_Design_Patterns`). This updates meta tags, sitemap, and canonical URLs.

### Troubleshooting

**Blank page after deployment**
- Confirm GitHub Pages is enabled in Settings > Pages with `gh-pages` branch selected
- Check the Actions tab to ensure the latest workflow run completed successfully
- Verify the `base` path in `vite.config.ts` matches your repository name (`/Agentic_Design_Patterns/`)

**404 on page refresh or direct URL access**
- This is expected for SPAs on GitHub Pages. The project includes a `404.html` that redirects to the SPA router. If it's missing from the `gh-pages` branch, check that `public/404.html` exists in your source

**Assets not loading (broken images, missing CSS/JS)**
- Ensure all asset imports use relative paths or the Vite `base` path
- Check the browser Network tab for 404s on specific assets
- Run `npm run build && npm run preview` locally to reproduce

**Workflow fails in Actions tab**
- Check the workflow logs in the Actions tab for the specific error
- Common causes: Node.js version mismatch, missing dependencies, TypeScript errors
- Run `npm run build` locally to verify the build passes before pushing

**Supabase features not working**
- Verify the secrets are set correctly in Settings > Secrets and variables > Actions
- Secret names must be exactly `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Re-run the workflow after adding secrets (secrets are injected at build time)

## Project Structure

```
src/
  components/     # Reusable UI components
  contexts/       # React context providers
  data/           # Chapter content, code terms, quiz data
  hooks/          # Custom React hooks
  pages/          # Route-level page components
  config/         # App configuration
  lib/            # Library integrations (Supabase)
  i18n/           # Internationalization
  utils/          # Utility functions
public/           # Static assets (robots.txt, sitemap.xml, icons)
```

## Tech Stack

- **React 19** + **TypeScript** - UI framework
- **Vite** - Build tooling with HMR
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **Framer Motion** - Animations
- **Supabase** - Optional auth and progress tracking
