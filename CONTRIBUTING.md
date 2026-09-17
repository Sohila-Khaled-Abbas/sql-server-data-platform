# Contributing to OmniFlow SQL Server Data Platform

Thank you for your interest in contributing to the **OmniFlow Enterprise Data Platform & Data Engineering Sandbox**! This project bridges the academic curriculum of **[MaharaTech: Implementing and Developing SQL Server Objects](https://maharatech.gov.eg/course/view.php?id=2305)** with real-world **Database Reliability Engineering (DBRE)** standards.

---

## 1. Development Environment Setup

### Option A: Local Windows Instance
* Install **SQL Server 2022 Developer Edition** and **SQL Server Management Studio (SSMS)**.
* Verify your default instance runs locally and accepts Windows Authentication (`.` or `localhost`).
* Run the universal deployment script:
  ```powershell
  .\deploy.ps1 -Environment Local
  ```

### Option B: Docker Container
* Install **Docker Desktop**.
* Start the containerized SQL Server 2022 instance:
  ```bash
  cd docker
  docker compose up -d
  ```
* Deploy to the Docker container:
  ```powershell
  .\deploy.ps1 -Environment Docker
  ```

---

## 2. T-SQL Coding & Architectural Standards

All T-SQL code submitted must adhere to the following DBRE engineering standards:

### A. Idempotency & Re-run Safety
* Scripts must execute repeatedly without throwing errors or duplicating records.
* Use `IF NOT EXISTS (...)` or `DROP ... IF EXISTS` for objects, and `CREATE OR ALTER` for stored procedures, views, and functions.
* Use `MERGE` or `IF NOT EXISTS` for data seed scripts.

### B. Session Settings
Every `.sql` script must begin with explicit session settings:
```sql
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET NOCOUNT ON;
GO
```

### C. Physical Storage Placement
* **Never** place user tables or non-clustered indexes on the `PRIMARY` filegroup.
* User tables must specify `ON [DATA_FG]`.
* Non-clustered indexes must specify `ON [INDEX_FG]`.
* Historical or date-range partitions must target `[ARCHIVE_FG]`.

### D. Transaction Management & Error Handling
Stored procedures executing DML must enforce strict ACID boundaries:
```sql
CREATE OR ALTER PROCEDURE Sales.usp_ExamplePipeline
AS
BEGIN
    SET NOCOUNT, XACT_ABORT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- DML operations with OUTPUT clauses for audit
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO
```

### E. Object Naming Conventions

| Object Type | Prefix / Pattern | Example |
| :--- | :--- | :--- |
| **Primary Key** | `PK_<TableName>` | `PK_Orders` |
| **Foreign Key** | `FK_<SourceTable>_<TargetTable>_<Column>` | `FK_Orders_Customer_CustomerId` |
| **Unique Constraint** | `UQ_<TableName>_<Column>` | `UQ_Customer_Email` |
| **Check Constraint** | `CK_<TableName>_<Condition>` | `CK_Orders_TotalAmount` |
| **Default Constraint** | `DF_<TableName>_<Column>` | `DF_Orders_CreatedDate` |
| **Non-Clustered Index** | `IX_<TableName>_<Column(s)>` | `IX_Orders_OrderDate` |
| **Clustered Columnstore**| `CCI_<TableName>` | `CCI_OrderHistory` |
| **Stored Procedure** | `usp_<Verb><Noun>` | `usp_BulkIngestOrders` |
| **Table-Valued Function**| `tvf_<Noun>` | `tvf_GetCustomerOrderSummary` |
| **Scalar Function** | `udf_<Noun>` | `udf_FormatCurrency` |
| **User-Defined Table Type**| `<Noun>Type` | `OrderBatchType` |

---

## 3. Pull Request Process

1. Fork the repository and create a descriptive feature branch (`feature/add-temporal-tables` or `fix/partition-switch-bug`).
2. Verify all 23 scripts deploy cleanly on your local machine using `deploy.ps1`.
3. Verify that integration tests pass (`tests/tSQLt/test_stored_procedures.sql`).
4. Submit a Pull Request targeting `master` using the provided [PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md).
5. Ensure GitHub Actions CI workflows pass.
