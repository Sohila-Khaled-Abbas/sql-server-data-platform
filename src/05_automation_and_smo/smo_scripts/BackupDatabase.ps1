<#
.SYNOPSIS
    Automated database backup engine using SQL Server Management Objects (SMO).
.DESCRIPTION
    DBRE administrative utility to perform Full, Differential, and Transaction Log
    backups with built-in checksum validation, compression, and verification.
.PARAMETER ServerInstance
    Target SQL Server instance (default: localhost).
.PARAMETER DatabaseName
    Name of the target database (default: OmniFlowDB).
.PARAMETER BackupType
    Type of backup: Full, Diff, or Log.
.PARAMETER BackupDirectory
    Destination directory for backup files (default: D:\SQL Server\Backups or instance default).
.EXAMPLE
    .\BackupDatabase.ps1 -DatabaseName "OmniFlowDB" -BackupType Full
#>

[CmdletBinding()]
param (
    [string]$ServerInstance = "localhost",
    [string]$DatabaseName   = "OmniFlowDB",
    [ValidateSet("Full", "Diff", "Log")]
    [string]$BackupType     = "Full",
    [string]$BackupDirectory = ""
)

$ErrorActionPreference = "Stop"

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "  SMO Database Backup Engine" -ForegroundColor Cyan
Write-Host "  Target Server:   $ServerInstance" -ForegroundColor Cyan
Write-Host "  Target Database: $DatabaseName" -ForegroundColor Cyan
Write-Host "  Backup Type:     $BackupType" -ForegroundColor Cyan
Write-Host "================================================================="

# 1. Load SMO Assembly
try {
    [void][System.Reflection.Assembly]::LoadWithPartialName("Microsoft.SqlServer.Smo")
    [void][System.Reflection.Assembly]::LoadWithPartialName("Microsoft.SqlServer.SmoExtended")
}
catch {
    Write-Error "Failed to load SQL Server SMO assemblies. Ensure SQL Server or SQLPS module is installed."
    exit 1
}

# 2. Connect to Server
$server = New-Object Microsoft.SqlServer.Management.Smo.Server($ServerInstance)

# Resolve default backup directory if not specified
if ([string]::IsNullOrWhiteSpace($BackupDirectory)) {
    $BackupDirectory = $server.BackupDirectory
    if ([string]::IsNullOrWhiteSpace($BackupDirectory)) {
        $BackupDirectory = "$PSScriptRoot\..\..\..\backups"
    }
}

if (-not (Test-Path $BackupDirectory)) {
    New-Item -ItemType Directory -Path $BackupDirectory -Force | Out-Null
    Write-Host "Created backup directory: $BackupDirectory" -ForegroundColor Yellow
}

# Check if database exists
$db = $server.Databases[$DatabaseName]
if ($null -eq $db) {
    Write-Error "Database '$DatabaseName' was not found on instance '$ServerInstance'."
    exit 1
}

# 3. Configure SMO Backup Object
$backup = New-Object Microsoft.SqlServer.Management.Smo.Backup

# Timestamp and file naming
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$ext = switch ($BackupType) {
    "Full" { "bak" }
    "Diff" { "dif" }
    "Log"  { "trn" }
}
$backupFileName = "$($DatabaseName)_$($BackupType)_$($timestamp).$ext"
$fullBackupPath = Join-Path $BackupDirectory $backupFileName

Write-Host "Backup Destination: $fullBackupPath" -ForegroundColor Green

# Configure Backup Options
$backup.Database = $DatabaseName
$backup.Action = switch ($BackupType) {
    "Full" { [Microsoft.SqlServer.Management.Smo.BackupActionType]::Database }
    "Diff" { [Microsoft.SqlServer.Management.Smo.BackupActionType]::Database }
    "Log"  { [Microsoft.SqlServer.Management.Smo.BackupActionType]::Log }
}

if ($BackupType -eq "Diff") {
    $backup.Incremental = $true
}

# DBRE Best Practices: Checksum, Verification, and Compression
$backup.Checksum = $true
$backup.ContinueAfterError = $false
$backup.CompressionOption = [Microsoft.SqlServer.Management.Smo.BackupCompressionOptions]::On
$backup.Initialize = $true
$backup.FormatMedia = $false

# Add destination device
$device = New-Object Microsoft.SqlServer.Management.Smo.BackupDeviceItem($fullBackupPath, [Microsoft.SqlServer.Management.Smo.DeviceType]::File)
$backup.Devices.Add($device)

# 4. Attach Progress Events
Register-ObjectEvent -InputObject $backup -EventName "PercentComplete" -Action {
    Write-Progress -Activity "SMO Backup in progress" -Status "$($EventArgs.Percent)%" -PercentComplete $EventArgs.Percent
} | Out-Null

Write-Host "Executing SMO backup..." -ForegroundColor Yellow
$stopwatch = [System.Diagnostics.Stopwatch]::StartNew()

try {
    $backup.SqlBackup($server)
    $stopwatch.Stop()
    Write-Host "Backup completed in $($stopwatch.Elapsed.TotalSeconds.ToString('F2')) seconds." -ForegroundColor Green

    # 5. Verify Backup Integrity
    Write-Host "Verifying backup media integrity (RESTORE VERIFYONLY)..." -ForegroundColor Yellow
    $restore = New-Object Microsoft.SqlServer.Management.Smo.Restore
    $restore.Database = $DatabaseName
    $restore.Devices.Add($device)
    $restore.Checksum = $true

    $isValid = $restore.SqlVerify($server)
    if ($isValid) {
        Write-Host ">>> Verification SUCCEEDED: Backup file is healthy and restorable." -ForegroundColor Green
    }
    else {
        Write-Error ">>> Verification FAILED: Backup header or checksum validation error."
    }

    # Output file stats
    $fileInfo = Get-Item $fullBackupPath
    $fileSizeMB = ($fileInfo.Length / 1MB).ToString("F2")
    Write-Host "Output File Size: $fileSizeMB MB" -ForegroundColor Cyan
}
catch {
    $stopwatch.Stop()
    Write-Error "SMO Backup operation failed: $_"
}
