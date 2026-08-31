# JDU Portfolio Workspace

JDU Portfolio Workspace is a portfolio catalog for student projects with public browsing and owner-only project management.

## Live demo

The teacher-facing demo is available without sign-in:

https://jdu.95-130-227-217.nip.io/

## Local development

Requirements: Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Validation commands:

```bash
npm run lint
npm run build
```

## Deployment

The app uses server-side routes and Cloudflare D1/R2 bindings configured in `vite.config.ts` and `.openai/hosting.json`. The GitHub repository is the source repository; GitHub Pages is not used because it cannot run the app's server-side API routes.
