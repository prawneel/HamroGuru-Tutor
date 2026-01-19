<#
Usage: run from repo root. Requires GitHub CLI `gh` authenticated.
It will read a set of env vars and set repo secrets using `gh secret set`.
Example: $env:VERCEL_TOKEN='xxx'; ./setup-github-secrets.ps1
#>

$required = @(
  'VERCEL_TOKEN', 'VERCEL_ORG_ID', 'VERCEL_PROJECT_ID',
  'RENDER_API_KEY', 'RENDER_SERVICE_ID',
  'FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'
)

function Set-Secret($name, $value) {
  if (-not $value) { Write-Host "Skipping $name (no value)" -ForegroundColor Yellow; return }
  Write-Host "Setting secret $name..." -ForegroundColor Cyan
  $temp = New-TemporaryFile
  Set-Content -Path $temp -Value $value -NoNewline
  gh secret set $name --body-file $temp
  Remove-Item $temp -Force
}

foreach ($s in $required) {
  $val = (Get-ChildItem env:$s -ErrorAction SilentlyContinue).Value
  if (-not $val) {
    Write-Host "$s not found in environment. You will be prompted to enter it (leave blank to skip)." -ForegroundColor Yellow
    $val = Read-Host -Prompt "Enter value for $s (or press Enter to skip)"
  }
  Set-Secret $s $val
}

Write-Host "All done. Verify secrets in GitHub repo Settings → Secrets → Actions." -ForegroundColor Green
