<#
.SYNOPSIS
    Universal Master Deployment Script for OmniFlow SQL Server Data Platform.
.DESCRIPTION
    Executes database migration, schema creation, programmability, and tests
    in strict dependency sequence against local SQL Server or Docker container.
.PARAMETER Environment
    Target environment: "Local" (default) or "Docker".
.PARAMETER Server
    SQL Server instance network name / port.
.PARAMETER Password
    SA password when Environment is Docker (default: Password123!Secure).
.EXAMPLE
    .\deploy.ps1 -Environment Local
    .\deploy.ps1 -Environment Docker
#>

[CmdletBinding()]
param (
    [ValidateSet("Local", "Docker")]
    [string]$Environment = "Local",

    [string]$Server = "",
    [string]$Password = "Password123!Secure"
)

$ErrorActionPreference = "Stop"

# 1. Resolve Target Server Configuration
if ([string]::IsNullOrWhiteSpace($Server)) {
    if ($Environment -eq "Local") {
        $Server = "."
    } else {
        $Server = "localhost,14333"
    }
}

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "  OmniFlow Enterprise Data Platform Deployment" -ForegroundColor Cyan
Write-Host "  Target Environment: $Environment" -ForegroundColor Cyan
Write-Host "  Target Server:      $Server" -ForegroundColor Cyan
Write-Host "  Execution Time:     $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Cyan
Write-Host "================================================================="

# Locate sqlcmd
$sqlcmdPath = (Get-Command sqlcmd -ErrorAction SilentlyContinue).Source
if (-not $sqlcmdPath) {
    Write-Error "sqlcmd utility is required but not found in PATH."
    exit 1
}

# 2. Ordered Script Manifest
$scripts = @(
    # Phase 1: Physical Storage, Filegroups & Schemas
    "src/01_storage_and_schema/01_filegroups_and_files.sql",
    "src/01_storage_and_schema/02_custom_types_and_rules.sql",
    "src/01_storage_and_schema/03_integrity_constraints.sql",
    "src/01_storage_and_schema/04_partitioning_scheme.sql",
    "src/01_storage_and_schema/05_company_case_study_schema.sql",

    # Phase 2: Indexing & Performance
    "src/02_indexing_and_performance/01_clustered_nonclustered.sql",
    "src/02_indexing_and_performance/02_indexed_views.sql",
    "src/02_indexing_and_performance/03_execution_plan_analysis.sql",

    # Phase 3: Programmability & Procedural ELT
    "src/03_programmability_and_elt/01_tvps_and_bulk_ingestion.sql",
    "src/03_programmability_and_elt/02_xml_shredding_and_generation.sql",
    "src/03_programmability_and_elt/03_stored_procedures_etl.sql",
    "src/03_programmability_and_elt/04_hierarchical_data_and_ctes.sql",
    "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql",

    # Phase 4: Governance & Auditing
    "src/04_governance_and_audit/01_audit_change_capture_triggers.sql",
    "src/04_governance_and_audit/02_ddl_and_server_triggers.sql",
    "src/04_governance_and_audit/03_dynamic_sql_guardrails.sql",

    # Phase 5: Automation & CLR
    "src/05_automation_and_smo/clr/Deploy-ClrAssembly.sql",

    # Phase 6: Reliability & Disaster Recovery
    "src/06_reliability_and_dr/01_backup_and_maintenance_jobs.sql",
    "src/06_reliability_and_dr/02_snapshot_lifecycle.sql",

    # Phase 7: Analytics & Dimensional Warehouse
    "src/07_warehousing_and_reporting/01_oltp_source_schema.sql",
    "src/07_warehousing_and_reporting/02_dimensional_star_schema.sql",
    "src/07_warehousing_and_reporting/03_etl_staging_to_dw.sql",

    # Phase 8: Automated Test Harness
    "tests/tSQLt/test_stored_procedures.sql"
)

# 3. Execution Engine
$total = $scripts.Count
$current = 0
$failed = 0

foreach ($relPath in $scripts) {
    $current++
    $fullPath = Join-Path $PSScriptRoot $relPath
    
    if (-not (Test-Path $fullPath)) {
        Write-Warning "[$current/$total] File not found: $relPath"
        $failed++
        continue
    }

    $fileName = Split-Path $relPath -Leaf
    Write-Host "[$current/$total] Deploying: $fileName ..." -ForegroundColor Yellow -NoNewline

    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()

    try {
        if ($Environment -eq "Local") {
            # Windows Authentication (-I enables QUOTED_IDENTIFIER)
            $output = & $sqlcmdPath -S $Server -E -I -b -i $fullPath 2>&1
        } else {
            # SQL Authentication (Docker)
            $output = & $sqlcmdPath -S $Server -U sa -P $Password -I -C -b -i $fullPath 2>&1
        }

        $stopwatch.Stop()

        if ($LASTEXITCODE -eq 0) {
            Write-Host " OK ($($stopwatch.ElapsedMilliseconds) ms)" -ForegroundColor Green
        } else {
            Write-Host " FAILED" -ForegroundColor Red
            Write-Host "--------------------------------------------------------" -ForegroundColor DarkRed
            Write-Host $output -ForegroundColor DarkRed
            Write-Host "--------------------------------------------------------" -ForegroundColor DarkRed
            $failed++
        }
    }
    catch {
        $stopwatch.Stop()
        Write-Host " EXCEPTION: $_" -ForegroundColor Red
        $failed++
    }
}

Write-Host "=================================================================" -ForegroundColor Cyan
if ($failed -eq 0) {
    Write-Host ">>> Deployment COMPLETED SUCCESSFULLY with 0 errors!" -ForegroundColor Green
} else {
    Write-Host ">>> Deployment completed with $failed failure(s)." -ForegroundColor Red
    exit 1
}
Write-Host "================================================================="
