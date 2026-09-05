# IRRIVO Official Marketing Website

The production marketing website for **IRRIVO**, the real-time workforce operating system from Watchmore Studios. This repository is independent from the IRRIVO Flutter application.

## Technology

- TypeScript, React 19 and Next-compatible App Router pages
- Vinext and Vite for Cloudflare-native builds
- Tailwind CSS 4 plus custom component-level CSS
- Lucide icons (ISC licence)
- Cloudflare Workers/Pages-compatible output

All product dashboard, map, roster and analytics visuals are original HTML/CSS components stored in this repository. There are no stock photographs or temporary external image URLs.

## Install and run locally

Requirements: Node.js 22.13 or newer and pnpm.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open the local URL printed in the terminal. Build and validate with:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

The Cloudflare production bundle is written to `dist/`.

## Editing Guide

- Company name, email, canonical URL and primary CTA targets: `config/site.ts`
- Main navigation and footer links: `data/navigation.ts`
- Homepage feature, industry and pricing content: `data/content.ts`
- Feature and industry landing-page copy: `data/pages.ts`
- Homepage sections: `app/page.tsx`
- Homepage design: `app/home.css`
- Global colors, type, spacing, buttons and breakpoints: `app/globals.css`
- Header, footer and final CTA: `components/site-shell.tsx` and `components/site-shell.css`
- Dashboard, roster, Ask Shady, map and charts: `components/product-visuals.tsx` and `components/product-visuals.css`
- Pricing: `data/content.ts` and `app/pricing/page.tsx`
- Contact details and form: `config/site.ts`, `components/contact-form.tsx`
- SEO defaults: `app/layout.tsx`; page-specific titles live in each route's `page.tsx`
- Sitemap and robots: `app/sitemap.ts`, `app/robots.ts`
- Logo treatment: `Wordmark` in `components/site-shell.tsx`. Replace this component with a local SVG in `public/` if a final vector logo becomes available.
- Brand color: change `--red` and `--red-dark` in `app/globals.css`.
- Font: change the body font stack in `app/globals.css`. No remote font service is required.
- Buttons and links: site-wide CTA destinations live in `config/site.ts`; page-specific links are kept beside their section.

## Contact form configuration

The form validates in the browser. It deliberately does not display fake success when no delivery service exists. Set `NEXT_PUBLIC_CONTACT_ENDPOINT` to an HTTPS form endpoint from a Cloudflare Worker, Supabase Edge Function, Formspree, or another service. The endpoint must accept `multipart/form-data` POST requests. Until configured, visitors receive the real contact email `irrivoapp@gmail.com`.

## Cloudflare deployment

1. Create a GitHub repository in the owner's account and push this complete project.
2. In Cloudflare, open **Workers & Pages → Create → Import a repository** and choose the repository.
3. Set the production branch to `main`.
4. Use build command `pnpm build`.
5. Use the generated Cloudflare configuration in `dist/server/wrangler.json`. If the dashboard asks for a deploy command, use `npx wrangler deploy --config dist/server/wrangler.json`.
6. Add `NEXT_PUBLIC_CONTACT_ENDPOINT` only after a real form endpoint exists. It may remain empty for the first release.
7. Deploy and confirm the temporary `*.workers.dev` or `*.pages.dev` URL before connecting the domain.

### Connect irrivo.com

1. Keep the domain in the existing Cloudflare account.
2. Open the deployed project → **Settings → Domains & Routes / Custom domains**.
3. Add `irrivo.com` as the primary custom domain.
4. Add `www.irrivo.com` as a second custom domain.
5. Cloudflare will create or request the required DNS records. Do not manually change unrelated records.
6. Keep `https://irrivo.com` as the canonical origin. `public/_redirects` records the intended `www` → apex redirect. If the Worker deployment does not consume Pages redirect files, create a Cloudflare Redirect Rule: hostname equals `www.irrivo.com`, target `https://irrivo.com/${1}`, status 301, preserving path and query.
7. Test both HTTPS hostnames, the sitemap at `/sitemap.xml`, and the privacy and terms routes.

The future authenticated web application should be deployed as a separate project at `app.irrivo.com`. Do not place authenticated product code in this marketing repository.

## Content and route map

All requested routes are implemented under `app/`: homepage, features, individual feature pages, industries, healthcare, banking, education, construction, pricing, about, contact, resources, privacy and terms.

The example people, departments and metrics are fictional. Pricing amounts remain configuration-ready until commercial and in-app purchase prices are finalized.

## Backup and Recovery

1. Treat the owner's GitHub repository as the primary code backup.
2. Retain this project folder on the Mac as a local copy.
3. Back up environment variables in a password manager. Never commit `.env.local` or API keys.
4. Domain ownership remains in the owner's Cloudflare account.
5. Preserve the deployment settings from the Cloudflare section above so the project can be recreated if it is deleted.
6. Document every external service added later, including account owner, purpose, environment variables and setup steps.

To restore on a fresh computer: install Node.js and pnpm, clone the GitHub repository, copy secure values into `.env.local`, run `pnpm install && pnpm build`, reconnect the repository in Cloudflare, apply the documented build settings and reconnect `irrivo.com` and `www.irrivo.com`.

## External services and future work

Current runtime integrations: none. The marketing site works without a database, analytics provider, payment provider or form service. Optional future work includes contact form delivery, privacy-respecting analytics, a CMS, a customer portal, product authentication and the separate `app.irrivo.com` application.

The privacy policy and terms are structured publication drafts and should receive professional legal review as the product, payment flow and operating markets are finalized.
