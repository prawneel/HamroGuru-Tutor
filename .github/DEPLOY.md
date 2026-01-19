# Deployment and push helper

This repository includes helper scripts and GitHub Actions workflows to deploy the frontend (Vercel) and backend (Render).

Files added:

- `.github/workflows/frontend-deploy.yml` — builds `frontend/` and deploys with Vercel CLI (requires Vercel secrets).
- `.github/workflows/backend-deploy.yml` — builds `backend/` and triggers a Render deploy via API.
- `.github/workflows/secret-check.yml` — quick workflow to validate that required GitHub secrets exist.
- `scripts/push-to-remote.ps1` — Windows PowerShell helper to abort rebase, commit changes, add remote and push.
- `scripts/setup-github-secrets.ps1` — PowerShell helper to set GitHub repo secrets using `gh` CLI.
- `.github/SECRET_SETUP.md` — step-by-step guide for required secrets.

Quick local steps

1) Install prerequisites locally:

 - `git` (installed)
 - `gh` (GitHub CLI) if you want to automate secret uploads

2) Set secrets using `gh` (optional automation):

```powershell
# set environment variables, then run
$env:VERCEL_TOKEN = "<token>"
$env:RENDER_API_KEY = "<render-key>"
./scripts/setup-github-secrets.ps1
```

3) Push repository to your remote (example remote `git@github.com:prawneel/fuzzy-computing-machine.git`):

```powershell
./scripts/push-to-remote.ps1 -RemoteUrl 'git@github.com:prawneel/fuzzy-computing-machine.git' -RemoteName 'target' -Branch 'main'
```

If push fails because the remote has divergent history, follow instructions printed by the script to resolve conflicts.

Verifying workflows

- Go to Actions → Secrets Check, run the workflow manually or push to `main` to auto-run. It will fail if any required secrets are missing.
- After secrets are set, pushing to `main` will trigger `frontend-deploy.yml` and `backend-deploy.yml`.
