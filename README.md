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

### How It Works

1. Push to the `main` branch triggers the workflow (`.github/workflows/deploy.yml`)
2. The workflow installs dependencies, builds the project, and deploys the `dist/` output to the `gh-pages` branch
3. GitHub Pages serves the content from the `gh-pages` branch

### Default URL

Once deployed, the site is available at:

```
https://<username>.github.io/Agentic_Design_Patterns/
```

For this repository: https://noreddine.github.io/Agentic_Design_Patterns/

### Optional: Supabase Integration

The platform supports optional Supabase authentication. To enable it, add these as GitHub repository secrets:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

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
