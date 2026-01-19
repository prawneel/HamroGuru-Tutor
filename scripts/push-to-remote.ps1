param(
    [string]$RemoteUrl = 'git@github.com:prawneel/fuzzy-computing-machine.git',
    [string]$RemoteName = 'target',
    [string]$Branch = 'main'
)

Write-Host "Running push helper (PowerShell)" -ForegroundColor Cyan

function Run-Git($args) {
    $cmd = "git $args"
    Write-Host "> $cmd"
    $proc = Start-Process -FilePath git -ArgumentList $args -NoNewWindow -PassThru -RedirectStandardOutput stdout.txt -RedirectStandardError stderr.txt -Wait
    $out = Get-Content stdout.txt -Raw -ErrorAction SilentlyContinue
    $err = Get-Content stderr.txt -Raw -ErrorAction SilentlyContinue
    Remove-Item -Force stdout.txt, stderr.txt -ErrorAction SilentlyContinue
    return @{ ExitCode = $proc.ExitCode; Stdout = $out; Stderr = $err }
}

# Abort any in-progress rebase
Write-Host "Attempting to abort any in-progress rebase..." -ForegroundColor Yellow
$res = Run-Git 'rebase --abort'
if ($res.ExitCode -ne 0) { Write-Host "rebase --abort returned: $($res.Stderr)" -ForegroundColor Gray }

Write-Host "Staging changes..." -ForegroundColor Yellow
Run-Git 'add -A' | Out-Null

Write-Host "Committing (if any changes)..." -ForegroundColor Yellow
$commit = Run-Git 'commit -m "chore(ci): add CI workflows and secret-check"' 
if ($commit.ExitCode -ne 0) { Write-Host "No commit created (probably no changes): $($commit.Stderr)" -ForegroundColor Gray }

Write-Host "Ensuring remote '$RemoteName' -> $RemoteUrl" -ForegroundColor Yellow
Run-Git "remote remove $RemoteName 2>$null" | Out-Null
$r = Run-Git "remote add $RemoteName $RemoteUrl"
if ($r.ExitCode -ne 0) { Write-Host "Failed to add remote: $($r.Stderr)" -ForegroundColor Red; exit 1 }

Write-Host "Fetching remote..." -ForegroundColor Yellow
$f = Run-Git "fetch $RemoteName"
if ($f.ExitCode -ne 0) { Write-Host "Fetch failed: $($f.Stderr)" -ForegroundColor Red }

Write-Host "Attempting to pull --rebase from $RemoteName/$Branch" -ForegroundColor Yellow
$p = Run-Git "pull --rebase $RemoteName $Branch"
if ($p.ExitCode -ne 0) {
    Write-Host "Pull --rebase failed or produced conflicts. Output:" -ForegroundColor Red
    Write-Host $p.Stdout
    Write-Host $p.Stderr
    Write-Host "You must resolve conflicts locally. Suggested steps:" -ForegroundColor Cyan
    Write-Host "1) Open the repo in your editor, resolve conflicts.\n2) git add <resolved-files>\n3) git rebase --continue\n4) git push $RemoteName $Branch" -ForegroundColor Green
    exit 1
}

Write-Host "Pushing to $RemoteName/$Branch" -ForegroundColor Yellow
$push = Run-Git "push -u $RemoteName $Branch"
if ($push.ExitCode -ne 0) {
    Write-Host "Push failed:" -ForegroundColor Red
    Write-Host $push.Stdout
    Write-Host $push.Stderr
    exit 1
}

Write-Host "Push completed successfully." -ForegroundColor Green
