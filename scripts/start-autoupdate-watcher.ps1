<#
.SYNOPSIS
    Starts the ITItest background auto-update watcher.
.DESCRIPTION
    Runs python scripts/sync_ititest_db.py in the background with continuous polling (every 3 seconds).
    Any table, column, constraint, or filegroup update in SSMS for ITItest (D:\...\CH01\Mydb)
    will automatically update:
    - docs/ititest-live-schema.md
    - docs/ch01-case-study-erd-and-implementation.md
    - src/01_storage_and_schema/ch01_vid02_ititest_case_study_schema.sql
    - web/src/data/ititestLiveSchema.json
.EXAMPLE
    .\scripts\start-autoupdate-watcher.ps1
#>

$repoRoot = (Get-Item $PSScriptRoot).Parent.FullName
$scriptPath = Join-Path $PSScriptRoot "sync_ititest_db.py"
$pidFile = Join-Path $PSScriptRoot "watcher.pid"

if (Test-Path $pidFile) {
    $existingPid = (Get-Content $pidFile -ErrorAction SilentlyContinue)
    if ($existingPid) {
        $existingPid = $existingPid.Trim()
        if ($existingPid -and (Get-Process -Id $existingPid -ErrorAction SilentlyContinue)) {
            Write-Host ">>> Watcher is already running in background with PID: $existingPid" -ForegroundColor Yellow
            Write-Host ">>> Run .\scripts\stop-autoupdate-watcher.ps1 to stop it." -ForegroundColor Cyan
            exit 0
        }
    }
}

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "  Starting ITItest Documentation Auto-Update Watcher" -ForegroundColor Cyan
Write-Host "  Target Database: ITItest (D:\...\CH01\Mydb)" -ForegroundColor Cyan
Write-Host "  Polling Rate:    Every 3 seconds" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

$process = Start-Process python -ArgumentList "-u `"$scriptPath`" --watch --interval 3" `
    -WorkingDirectory $repoRoot `
    -WindowStyle Hidden `
    -PassThru

$process.Id | Out-File $pidFile -Encoding ascii -Force

Write-Host "[SUCCESS] Auto-update watcher started in background! (Process ID: $($process.Id))" -ForegroundColor Green
Write-Host "As you create tables, columns, or keys in SSMS, documentation will auto-update in real-time." -ForegroundColor White
Write-Host "To stop the watcher, run: .\scripts\stop-autoupdate-watcher.ps1" -ForegroundColor Gray
