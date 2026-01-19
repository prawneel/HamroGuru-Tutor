# GitHub Actions Secrets — Setup Guide

Required secrets (add these in your repo Settings → Secrets → Actions):

- `VERCEL_TOKEN` — Vercel personal token (used by the Vercel CLI deploy step).
- `VERCEL_ORG_ID` — (optional) Vercel organization or account scope used for CLI operations.
- `VERCEL_PROJECT_ID` — Vercel project ID if you want to target a specific project.
- `RENDER_API_KEY` — Render API key (for triggering deploys via API).
- `RENDER_SERVICE_ID` — Render service id (without `srv-` prefix) to trigger the correct service.
- `FIREBASE_PROJECT_ID` — Firebase project id for backend runtime (used by backend runtime, recommended to store in Render secrets).
- `FIREBASE_CLIENT_EMAIL` — Firebase service account client email (for Admin SDK).
- `FIREBASE_PRIVATE_KEY` — Firebase private key (ensure newlines are preserved; wrap with quotes and escape newlines when setting in the web UI).

Notes and tips:

- To create a `VERCEL_TOKEN` go to Vercel dashboard → Settings → Tokens → Create.
- To find `VERCEL_PROJECT_ID` and `VERCEL_ORG_ID` use the Vercel dashboard or the Vercel CLI (`vercel projects ls`).
- For `RENDER_SERVICE_ID` find the service id in your Render Dashboard URL or API settings; some use `srv-<id>`; in workflows we expect the id value used by Render API.
- For `FIREBASE_PRIVATE_KEY`, when copying from the service account JSON, replace literal newlines with `\n` or paste the key wrapped in quotes — GitHub UI will preserve the content but be careful about invisible characters.

Security
- Never commit service account JSON files or `.env` files into the repository. `.gitignore` already excludes common secrets.
- Use GitHub Environments or organization-level secrets for stricter control and required reviewers.

How to verify
- Run the GitHub Action `Secrets Check` (Actions → Secrets Check → Run workflow) to validate all required secrets are present.
