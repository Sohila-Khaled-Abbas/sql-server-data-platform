<#
.SYNOPSIS
    Stops the background ITItest auto-update watcher.
.DESCRIPTION
    Reads watcher.pid and terminates the background Python auto-update watcher process.
.EXAMPLE
    .\scripts\stop-autoupdate-watcher.ps1
#>

$pidFile = Join-Path $PSScriptRoot "watcher.pid"

if (Test-Path $pidFile) {
    $procId = (Get-Content $pidFile -ErrorAction SilentlyContinue).Trim()
    if ($procId) {
        $p = Get-Process -Id $procId -ErrorAction SilentlyContinue
        if ($p) {
            Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
            Write-Host "[SUCCESS] Terminated ITItest watcher process (PID: $procId)." -ForegroundColor Green
        } else {
            Write-Host "[INFO] Process $procId was not running." -ForegroundColor Gray
        }
    }
    Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
} else {
    Write-Host "[INFO] No watcher.pid file found. Checking for any active sync_ititest_db processes..." -ForegroundColor Gray
    Get-Process python -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*sync_ititest_db*" } | Stop-Process -Force -ErrorAction SilentlyContinue
}
Write-Host "ITItest auto-update watcher is stopped." -ForegroundColor Yellow
