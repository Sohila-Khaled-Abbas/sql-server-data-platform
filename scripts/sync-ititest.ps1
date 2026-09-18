<#
.SYNOPSIS
    Syncs live ITItest SQL Server database files, tables, and constraints into the repository.
.DESCRIPTION
    Connects to the local SQL Server instance (ITItest database) and reverse-engineers
    all wizard-created database files in D:\courses\...\CH01\Mydb and all tables/columns/constraints
    directly into:
    - src/01_storage_and_schema/05_ititest_case_study_schema.sql
    - docs/ititest-live-schema.md
    - web/src/data/ititestLiveSchema.json
.PARAMETER Watch
    Continuously watch the database and automatically sync when changes are made in SSMS.
.EXAMPLE
    .\scripts\sync-ititest.ps1
    .\scripts\sync-ititest.ps1 -Watch
#>

param (
    [switch]$Watch,
    [int]$Interval = 5
)

$scriptPath = Join-Path $PSScriptRoot "sync_ititest_db.py"

if ($Watch) {
    Write-Host ">>> Starting ITItest Dynamic Watcher (Polling every $Interval seconds)..." -ForegroundColor Cyan
    python $scriptPath --watch --interval $Interval
} else {
    Write-Host ">>> Synchronizing live ITItest database schema..." -ForegroundColor Cyan
    python $scriptPath
}
