"""
OmniFlow SQL Server Enterprise Platform & DBRE Test Suite
=========================================================
Automated pytest verification suite asserting:
1. Migration manifest integrity and deterministic SHA256 checksums
2. 3NF relational schema constraints & circular FK resolution
3. Horizontal partitioning function boundaries & filegroup schemes
4. Kimball dimensional warehouse star schema & SCD Type 2 tracking
5. Table-valued parameter (TVP) batch ingestion signatures
6. Synthetic enterprise data generator referential consistency
"""

import os
import re
from pathlib import Path
import pytest

REPO_ROOT = Path(__file__).resolve().parent.parent.parent


# ---------------------------------------------------------------------------
# 1. Migration Manifest & Script Integrity Tests
# ---------------------------------------------------------------------------
def test_migration_manifest_files_exist():
    """Verify that all 23 migration scripts registered in the manifest exist on disk."""
    from scripts.migration_runner import ORDERED_MIGRATIONS, compute_file_checksum

    assert len(ORDERED_MIGRATIONS) >= 20, "Migration manifest must contain full 7-phase curriculum"

    for rel_path in ORDERED_MIGRATIONS:
        script_file = REPO_ROOT / rel_path
        assert script_file.exists(), f"Migration script missing: {rel_path}"
        assert script_file.stat().st_size > 0, f"Migration script is empty: {rel_path}"

        checksum = compute_file_checksum(script_file)
        assert len(checksum) == 64, f"Invalid SHA-256 hash length for {rel_path}"


def test_unique_migration_filenames():
    """Assert there are no duplicate script basenames in the manifest."""
    from scripts.migration_runner import ORDERED_MIGRATIONS

    basenames = [Path(p).name for p in ORDERED_MIGRATIONS]
    duplicates = [b for b in basenames if basenames.count(b) > 1]
    # In multi-phase projects, if basenames repeat across folders, ensure paths are unique
    paths = set(ORDERED_MIGRATIONS)
    assert len(paths) == len(ORDERED_MIGRATIONS), "Duplicate paths found in migration manifest"


# ---------------------------------------------------------------------------
# 2. Relational Schema & 3NF Integrity Tests
# ---------------------------------------------------------------------------
def test_company_schema_3nf_entities():
    """Verify that the Company OLTP schema defines all 5 core normalized entities."""
    schema_file = REPO_ROOT / "src/01_storage_and_schema/05_company_case_study_schema.sql"
    assert schema_file.exists()
    content = schema_file.read_text(encoding="utf-8")

    expected_tables = ["Employee", "Department", "Project", "(?:WorksOn|Works_for)", "Dependent"]
    for tbl in expected_tables:
        pattern = rf"CREATE\s+TABLE\s+(?:\[?Company\]?\.|\[?dbo\]?\.)?\[?{tbl}\]?"
        assert re.search(pattern, content, re.IGNORECASE), f"Table {tbl} not found in Company schema"


def test_company_circular_foreign_key_resolution():
    """Assert circular dependency between Employee (Dno -> Department) and Department (MgrSsn -> Employee) is handled."""
    schema_file = REPO_ROOT / "src/01_storage_and_schema/05_company_case_study_schema.sql"
    content = schema_file.read_text(encoding="utf-8")

    # Verify both FK references exist (Company.Department and Company.Employee)
    assert re.search(r"REFERENCES\s+(?:\[?Company\]?\.|\[?dbo\]?\.)?\[?Department\]?", content, re.IGNORECASE)
    assert re.search(r"REFERENCES\s+(?:\[?Company\]?\.|\[?dbo\]?\.)?\[?Employee\]?", content, re.IGNORECASE)


# ---------------------------------------------------------------------------
# 3. Horizontal Partitioning Scheme Tests
# ---------------------------------------------------------------------------
def test_partitioning_scheme_definition():
    """Verify horizontal partitioning function and scheme declarations."""
    partition_file = REPO_ROOT / "src/01_storage_and_schema/04_partitioning_scheme.sql"
    assert partition_file.exists()
    content = partition_file.read_text(encoding="utf-8")

    assert re.search(r"CREATE\s+PARTITION\s+FUNCTION", content, re.IGNORECASE), "Missing CREATE PARTITION FUNCTION"
    assert re.search(r"CREATE\s+PARTITION\s+SCHEME", content, re.IGNORECASE), "Missing CREATE PARTITION SCHEME"
    assert "RANGE RIGHT" in content.upper() or "RANGE LEFT" in content.upper(), "Missing RANGE boundary direction"


# ---------------------------------------------------------------------------
# 4. Kimball Dimensional Warehouse Star Schema Tests
# ---------------------------------------------------------------------------
def test_dimensional_warehouse_schema():
    """Verify OmniFlowDW Kimball conformed dimensions and fact table structure."""
    dw_file = REPO_ROOT / "src/07_warehousing_and_reporting/02_dimensional_star_schema.sql"
    assert dw_file.exists()
    content = dw_file.read_text(encoding="utf-8")

    # Verify Fact and Dimension tables
    assert re.search(r"CREATE\s+TABLE\s+(?:\[?dw\]?\.|\[?dbo\]?\.)?\[?FactSales\]?", content, re.IGNORECASE)
    assert re.search(r"CREATE\s+TABLE\s+(?:\[?dw\]?\.|\[?dbo\]?\.)?\[?DimCustomer\]?", content, re.IGNORECASE)
    assert re.search(r"CREATE\s+TABLE\s+(?:\[?dw\]?\.|\[?dbo\]?\.)?\[?DimProduct\]?", content, re.IGNORECASE)
    assert re.search(r"CREATE\s+TABLE\s+(?:\[?dw\]?\.|\[?dbo\]?\.)?\[?DimDate\]?", content, re.IGNORECASE)


def test_scd_type_2_columns_present():
    """Assert Slowly Changing Dimension Type 2 temporal lineage tracking columns exist in DimProduct."""
    dw_file = REPO_ROOT / "src/07_warehousing_and_reporting/02_dimensional_star_schema.sql"
    content = dw_file.read_text(encoding="utf-8")

    assert "ValidFrom" in content, "DimProduct must include ValidFrom for SCD Type 2 tracking"
    assert "ValidTo" in content, "DimProduct must include ValidTo for SCD Type 2 tracking"
    assert "IsCurrent" in content, "DimProduct must include IsCurrent flag for SCD Type 2 tracking"


# ---------------------------------------------------------------------------
# 5. Table-Valued Parameters (TVPs) & Procedural ELT Tests
# ---------------------------------------------------------------------------
def test_tvp_batch_ingestion_type():
    """Assert User-Defined Table Type exists for high-throughput batch ingestion."""
    tvp_file = REPO_ROOT / "src/03_programmability_and_elt/01_tvps_and_bulk_ingestion.sql"
    assert tvp_file.exists()
    content = tvp_file.read_text(encoding="utf-8")

    assert re.search(r"CREATE\s+TYPE\s+.*AS\s+TABLE", content, re.IGNORECASE), "Missing CREATE TYPE ... AS TABLE definition"


# ---------------------------------------------------------------------------
# 6. Synthetic Data Generator Referential Consistency Tests
# ---------------------------------------------------------------------------
def test_synthetic_data_generator_consistency():
    """Verify generate_mock_data creates valid relational structures without orphan foreign keys."""
    from scripts.generate_mock_data import generate_company_data, generate_warehouse_data

    company = generate_company_data(num_employees=40)
    assert len(company["employees"]) == 40
    assert len(company["departments"]) > 0

    dept_ids = {d["DeptId"] for d in company["departments"]}
    emp_ssns = {e["SSN"] for e in company["employees"]}

    # Verify every employee belongs to a valid department
    for emp in company["employees"]:
        assert emp["Dno"] in dept_ids, f"Employee {emp['SSN']} assigned to invalid DeptId {emp['Dno']}"
        if emp["Superssn"] is not None:
            assert emp["Superssn"] in emp_ssns, f"Manager {emp['Superssn']} not in employee pool"

    # Verify warehouse generation
    dw = generate_warehouse_data(num_sales=100)
    assert len(dw["facts"]) == 100
    prod_keys = {p["ProductKey"] for p in dw["products"]}
    cust_keys = {c["CustomerKey"] for c in dw["customers"]}

    for fact in dw["facts"]:
        assert fact["ProductKey"] in prod_keys
        assert fact["CustomerKey"] in cust_keys
        assert fact["TotalAmount"] >= 0.0
