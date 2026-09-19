/**
 * Centralized Single Source of Truth Data Model
 * Extracted directly from the real SQL Server Data Platform repository:
 * https://github.com/Sohila-Khaled-Abbas/sql-server-data-platform
 * 
 * NO invented metrics, NO fabricated statistics. Strictly grounded in repo code.
 */

export const REPO_METADATA = {
  name: 'sql-server-data-platform',
  owner: 'Sohila-Khaled-Abbas',
  repoUrl: 'https://github.com/Sohila-Khaled-Abbas/sql-server-data-platform',
  title: 'Enterprise SQL Server Data Platform & DBRE Sandbox',
  tagline: 'Production-grade database reliability engineering, physical multi-filegroup storage, procedural ETL, and Kimball dimensional warehousing on Microsoft SQL Server 2022.',
  targetEngine: 'Microsoft SQL Server 2022 Developer Edition',
  curriculum: 'MaharaTech Course 2305: Implementing and Developing SQL Server Objects',
  institution: 'Information Technology Institute (ITI)',
  instructor: 'Eng. Rami Mohamed Abonagi',
  license: 'MIT',
  liveDemoUrl: 'https://sohila-khaled-abbas.github.io/sql-server-data-platform/',
  primaryLanguage: 'T-SQL (Transact-SQL)',
  frameworks: ['SQL Server 2022', 'Docker', 'Python', 'PowerShell SMO', 'C# SQL CLR', 'Kimball DW', 'pytest', 'tSQLt'],
  updatedDate: 'September 2026',
};

export const TECH_BADGES = [
  { name: 'SQL Server 2022', category: 'Database', color: '#CC292B', icon: 'Database' },
  { name: 'T-SQL', category: 'Language', color: '#38bdf8', icon: 'Code2' },
  { name: 'Kimball Star Schema', category: 'Data Modeling', color: '#10b981', icon: 'Layers' },
  { name: 'Table-Valued Parameters (TVP)', category: 'ETL / Ingestion', color: '#f59e0b', icon: 'Zap' },
  { name: 'Sliding Window Partitioning', category: 'Storage Engine', color: '#8b5cf6', icon: 'FolderTree' },
  { name: 'PowerShell & SMO', category: 'Automation', color: '#3b82f6', icon: 'Terminal' },
  { name: 'C# SQL CLR', category: 'Extensibility', color: '#ec4899', icon: 'Cpu' },
  { name: 'Docker SQL 2022', category: 'Infrastructure', color: '#0ea5e9', icon: 'Container' },
  { name: 'Python & pytest', category: 'Testing', color: '#eab308', icon: 'CheckCircle2' },
  { name: 'GitHub Actions CI/CD', category: 'DevOps', color: '#22c55e', icon: 'Workflow' }
];

export const ARCHITECTURE_LAYERS = [
  {
    id: 'storage',
    name: 'Physical Storage Engine & Filegroups',
    repoPath: 'src/01_storage_and_schema/',
    description: 'Dynamic multi-filegroup physical layout segregating catalogs from sequential user data, index B-trees, and historical archives.',
    components: [
      { name: 'PRIMARY Filegroup', role: 'System catalogs and metadata isolation (master data)', file: '01_filegroups_and_files.sql' },
      { name: 'DATA_FG Filegroup', role: 'High-churn OLTP tables on sequential storage', file: '01_filegroups_and_files.sql' },
      { name: 'INDEX_FG Filegroup', role: 'Non-clustered indexes on dedicated random-IO filegroup', file: '01_filegroups_and_files.sql' },
      { name: 'ARCHIVE_FG Filegroup', role: 'Cold historical date partitions (Tiered storage)', file: '04_partitioning_scheme.sql' },
      { name: 'pf_InvoiceDateRange', role: 'RANGE RIGHT date partition function on boundaries', file: '04_partitioning_scheme.sql' },
      { name: 'ps_InvoiceScheme', role: 'Partition scheme mapping ranges to ARCHIVE_FG & DATA_FG', file: '04_partitioning_scheme.sql' }
    ]
  },
  {
    id: 'ingestion',
    name: 'Procedural Ingestion & Batch ETL',
    repoPath: 'src/03_programmability_and_elt/',
    description: 'High-throughput transactional batch streaming eliminating per-row client round trips.',
    components: [
      { name: 'Sales.OrderBatchType', role: 'User-Defined Table Type (UDTT) for streaming batch payloads', file: '01_tvps_and_bulk_ingestion.sql' },
      { name: 'Sales.usp_BulkIngestOrders', role: 'Idempotent ingestion procedure with XACT_ABORT & TRY...CATCH', file: '01_tvps_and_bulk_ingestion.sql' },
      { name: 'XML Shredding Engine', role: 'Semi-structured data parsing via XQuery .nodes() and .value()', file: '02_xml_shredding_and_generation.sql' },
      { name: 'Recursive Hierarchy CTE', role: 'Multi-level management supervision tree resolution', file: '04_hierarchical_data_and_ctes.sql' }
    ]
  },
  {
    id: 'governance',
    name: 'Governance, Auditing & Extensibility',
    repoPath: 'src/04_governance_and_audit/',
    description: 'Non-blocking row-level change data capture, schema modification triggers, and SQL CLR.',
    components: [
      { name: 'Audit.OrderHistory', role: 'DML CDC audit trail capturing virtual inserted/deleted tables', file: '01_audit_change_capture_triggers.sql' },
      { name: 'trg_SchemaChangeLog', role: 'DDL database trigger capturing EVENTDATA() XML payloads', file: '02_ddl_and_server_triggers.sql' },
      { name: 'sp_executesql Guardrails', role: 'Parameterized dynamic SQL protecting against injection', file: '03_dynamic_sql_guardrails.sql' },
      { name: 'C# SQL CLR Assembly', role: 'In-engine cryptographic SHA-256 hashing and regex parser', file: 'src/05_automation_and_smo/clr/SqlClrExtensions.cs' }
    ]
  },
  {
    id: 'warehouse',
    name: 'Kimball Analytical Warehouse (OLAP)',
    repoPath: 'src/07_warehousing_and_reporting/',
    description: 'Transforming normalized 3NF transactional data into a Kimball Star Schema with Slowly Changing Dimensions.',
    components: [
      { name: 'dw.FactSales', role: 'Central fact table with additive measures (NetSales, Quantities)', file: '02_dimensional_star_schema.sql' },
      { name: 'dw.DimCustomer (SCD2)', role: 'Slowly Changing Dimension Type 2 (ValidFrom, ValidTo, IsCurrent)', file: '02_dimensional_star_schema.sql' },
      { name: 'dw.DimProduct (SCD1)', role: 'Conformed product dimension with overwrite tracking', file: '02_dimensional_star_schema.sql' },
      { name: 'dw.DimDate', role: 'Calendar & fiscal hierarchy dimension with integer surrogate keys', file: '02_dimensional_star_schema.sql' },
      { name: 'SalesExecutiveSummary.rdl', role: 'Operational SSRS parameterized report definition', file: 'ssrs_reports/SalesExecutiveSummary.rdl' }
    ]
  },
  {
    id: 'academic',
    name: 'ITI & DB2 Integrity Engine',
    repoPath: 'src/01_storage_and_schema/',
    description: 'Relational integrity constraints, UDDTs, global rules (sp_bindrule), and standalone defaults from MaharaTech CH01_VID05 & CH01_VID06.',
    components: [
      { name: 'dbo.Instructor (ITI)', role: 'Core entity with 16 rows, bound to global rule @x > 1000', file: 'ch01_vid06_constraints_rules_defaults.sql' },
      { name: 'dbo.Department (ITI)', role: 'Parent academic track entity (SD, Java, BI)', file: 'ch01_vid06_constraints_rules_defaults.sql' },
      { name: 'dbo.emps & depts (DB2)', role: 'Relational table with 8 explicit constraints c1-c8 & cascade rules', file: 'ch01_vid05_integrity_constraints.sql' },
      { name: 'Global Rule [myrule]', role: 'Reusable domain check rule bound to columns & UDDTs', file: 'ch01_vid06_constraints_rules_defaults.sql' }
    ]
  },
  {
    id: 'reliability',
    name: 'Disaster Recovery & Automation',
    repoPath: 'src/06_reliability_and_dr/',
    description: 'Disaster recovery runbooks, automated full/diff/log backup chains, and sparse snapshots.',
    components: [
      { name: 'SQL Agent DR Chains', role: 'Automated 15-minute log backup chain guaranteeing RPO ≤ 15m', file: '01_backup_and_maintenance_jobs.sql' },
      { name: 'NTFS Sparse Snapshots', role: 'Point-in-time read-only reporting and instant rollback snapshots', file: '02_snapshot_lifecycle.sql' },
      { name: 'SMO Scripting Engine', role: 'PowerShell / Python scripts for declarative schema sync', file: 'src/05_automation_and_smo/smo_scripts/' }
    ]
  }
];

export const REPO_FILES = [
  { path: 'src/01_storage_and_schema/01_filegroups_and_files.sql', category: 'SQL', desc: 'Multi-filegroup storage allocation with dynamic instance path resolution.', lines: 166 },
  { path: 'src/01_storage_and_schema/02_custom_types_and_rules.sql', category: 'SQL', desc: 'User-defined data types, rules, and default bindings.', lines: 95 },
  { path: 'src/01_storage_and_schema/03_integrity_constraints.sql', category: 'SQL', desc: 'Foreign keys, check constraints, default constraints, and cascade actions.', lines: 215 },
  { path: 'src/01_storage_and_schema/04_partitioning_scheme.sql', category: 'SQL', desc: 'RANGE RIGHT date partition function, scheme, and zero-IO partition switching.', lines: 146 },
  { path: 'src/01_storage_and_schema/05_company_case_study_schema.sql', category: 'SQL', desc: 'Canonical Peter Chen Company ERD implementation in 3NF with circular FKs.', lines: 340 },
  { path: 'src/01_storage_and_schema/ch01_vid05_integrity_constraints.sql', category: 'SQL', desc: 'Authentic DB2 database implementation with 8 constraints (c1-c8) and cascade rules.', lines: 185 },
  { path: 'src/01_storage_and_schema/ch01_vid06_constraints_rules_defaults.sql', category: 'SQL', desc: 'ITI Instructor schema, global check rules (myrule), cross-table binding & defaults.', lines: 210 },
  { path: 'src/02_indexing_and_performance/01_clustered_nonclustered.sql', category: 'SQL', desc: 'Clustered, covering non-clustered with INCLUDE, filtered & columnstore indexes.', lines: 112 },
  { path: 'src/02_indexing_and_performance/02_indexed_views.sql', category: 'SQL', desc: 'Materialized pre-aggregated views created with SCHEMABINDING.', lines: 75 },
  { path: 'src/02_indexing_and_performance/03_execution_plan_analysis.sql', category: 'SQL', desc: 'Comparative benchmark between RBAR cursors and set-based window queries.', lines: 154 },
  { path: 'src/03_programmability_and_elt/01_tvps_and_bulk_ingestion.sql', category: 'SQL', desc: 'High-performance bulk ingestion via User-Defined Table Types (TVPs).', lines: 143 },
  { path: 'src/03_programmability_and_elt/02_xml_shredding_and_generation.sql', category: 'SQL', desc: 'Semi-structured data parsing with XQuery .nodes() and FOR XML generation.', lines: 180 },
  { path: 'src/03_programmability_and_elt/03_stored_procedures_etl.sql', category: 'SQL', desc: 'Transactional DML pipelines using XACT_ABORT and OUTPUT audit clauses.', lines: 158 },
  { path: 'src/03_programmability_and_elt/04_hierarchical_data_and_ctes.sql', category: 'SQL', desc: 'Recursive CTEs for resolving management tree structures.', lines: 125 },
  { path: 'src/03_programmability_and_elt/05_scalar_vs_table_functions.sql', category: 'SQL', desc: 'Execution plan isolation between Inline TVFs, MSTVFs, and Scalar UDFs.', lines: 160 },
  { path: 'src/04_governance_and_audit/01_audit_change_capture_triggers.sql', category: 'SQL', desc: 'Non-blocking row-level change tracking via inserted/deleted virtual tables.', lines: 110 },
  { path: 'src/04_governance_and_audit/02_ddl_and_server_triggers.sql', category: 'SQL', desc: 'Schema modification defense capturing EVENTDATA() XML payloads.', lines: 105 },
  { path: 'src/04_governance_and_audit/03_dynamic_sql_guardrails.sql', category: 'SQL', desc: 'SQL injection defense with sys.sp_executesql, typed params & QUOTENAME.', lines: 130 },
  { path: 'src/05_automation_and_smo/clr/SqlClrExtensions.cs', category: 'Scripts', desc: 'High-speed C# CLR assembly for SHA-256 cryptographic hashing and regex.', lines: 65 },
  { path: 'src/05_automation_and_smo/smo_scripts/BackupDatabase.ps1', category: 'Scripts', desc: 'PowerShell script orchestrating automated backups and verify checks via SMO.', lines: 145 },
  { path: 'src/06_reliability_and_dr/01_backup_and_maintenance_jobs.sql', category: 'SQL', desc: 'SQL Agent maintenance jobs for Full, Differential, and 15-min Log backup chains.', lines: 165 },
  { path: 'src/06_reliability_and_dr/02_snapshot_lifecycle.sql', category: 'SQL', desc: 'NTFS sparse file database snapshots for read-only reporting and fast rollbacks.', lines: 115 },
  { path: 'src/07_warehousing_and_reporting/02_dimensional_star_schema.sql', category: 'SQL', desc: 'Kimball star schema for OmniFlowDW with FactSales and SCD dimensions.', lines: 185 },
  { path: 'src/07_warehousing_and_reporting/03_etl_staging_to_dw.sql', category: 'SQL', desc: 'Staging load procedures with MERGE statements and SCD2 validity tracking.', lines: 235 },
  { path: 'src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl', category: 'Database', desc: 'Enterprise SSRS report definition XML with regional matrix & charts.', lines: 190 },
  { path: 'docs/architecture-diagram.md', category: 'Docs', desc: 'Visual architecture specs, multi-filegroup layouts, and data pipelines.', lines: 120 },
  { path: 'docs/ch01-case-study-erd-and-implementation.md', category: 'Docs', desc: 'Peter Chen ERD mapping rules into 3NF normalized physical schemas.', lines: 450 },
  { path: 'docs/ch01-vid06-constraints-rules-defaults-live.md', category: 'Docs', desc: 'Live SQL Server 2022 telemetry verifying CREATE RULE, sp_bindrule & WITH NOCHECK.', lines: 165 },
  { path: 'docs/db2-integrity-constraints-live.md', category: 'Docs', desc: 'Live DB2 telemetry for constraints c1-c8 and referential cascade behaviors.', lines: 140 },
  { path: 'docs/dimensional-model.md', category: 'Docs', desc: 'Kimball star schema bus matrix, grain definitions, and surrogate key design.', lines: 110 },
  { path: 'docs/disaster-recovery-runbook.md', category: 'Docs', desc: 'Emergency tail-log recovery runbook, RPO/RTO calculations, and VLF tuning.', lines: 215 },
  { path: 'docs/performance-tuning-handbook.md', category: 'Docs', desc: 'Query optimizer stages, join mechanics (Hash vs Merge vs Loop), and wait stats.', lines: 280 },
  { path: 'tests/python/test_data_platform.py', category: 'Tests', desc: 'pytest + pyodbc DBRE integration suite verifying circular FKs, TVPs, and SCD2.', lines: 240 },
  { path: 'tests/tSQLt/test_stored_procedures.sql', category: 'Tests', desc: 'In-engine tSQLt unit test classes asserting stored procedure outputs.', lines: 210 },
  { path: 'docker/docker-compose.yml', category: 'Config', desc: 'Containerized SQL Server 2022 Developer edition orchestration file.', lines: 45 },
  { path: 'deploy.ps1', category: 'Scripts', desc: 'Universal PowerShell deployment orchestrator supporting Local & Docker.', lines: 175 }
];

export const SCHEMAS_ERD = {
  starSchema: {
    name: 'OmniFlowDW (Kimball Star Schema)',
    description: 'Dimensional data mart optimized for analytical reporting and SSRS aggregation.',
    tables: [
      {
        name: 'dw.FactSales',
        type: 'FACT',
        grain: 'One row per invoice order line item',
        keys: ['SalesSK (PK)'],
        fks: ['DateKey → dw.DimDate', 'CustomerSK → dw.DimCustomer', 'ProductSK → dw.DimProduct', 'TerritorySK → dw.DimTerritory'],
        measures: ['Quantity (INT)', 'UnitPrice (DECIMAL)', 'DiscountAmount (DECIMAL)', 'NetSalesAmount (DECIMAL)'],
        columns: ['SalesSK [PK]', 'DateKey [FK]', 'CustomerSK [FK]', 'ProductSK [FK]', 'TerritorySK [FK]', 'Quantity', 'UnitPrice', 'DiscountAmount', 'NetSalesAmount']
      },
      {
        name: 'dw.DimCustomer',
        type: 'DIMENSION (SCD Type 2)',
        grain: 'One row per customer revision period',
        keys: ['CustomerSK (PK)'],
        fks: [],
        measures: [],
        columns: ['CustomerSK [PK]', 'CustomerId', 'CustomerName', 'CustomerCode', 'PostalCode', 'ValidFrom [DATE]', 'ValidTo [DATE]', 'IsCurrent [BIT]']
      },
      {
        name: 'dw.DimProduct',
        type: 'DIMENSION (SCD Type 1)',
        grain: 'One row per product SKU',
        keys: ['ProductSK (PK)'],
        fks: [],
        measures: [],
        columns: ['ProductSK [PK]', 'ProductId', 'ProductSKU', 'ProductName', 'CategoryName', 'ListPrice']
      },
      {
        name: 'dw.DimDate',
        type: 'DIMENSION',
        grain: 'One row per calendar day (2020 - 2030)',
        keys: ['DateKey (PK)'],
        fks: [],
        measures: [],
        columns: ['DateKey [PK]', 'FullDate [DATE]', 'CalendarYear', 'CalendarQuarter', 'MonthName', 'DayOfWeek']
      },
      {
        name: 'dw.DimTerritory',
        type: 'DIMENSION',
        grain: 'One row per sales geographical region',
        keys: ['TerritorySK (PK)'],
        fks: [],
        measures: [],
        columns: ['TerritorySK [PK]', 'TerritoryID', 'TerritoryName', 'CountryRegion', 'SalesGroup']
      }
    ]
  },
  oltpSchema: {
    name: 'Company_SD / ITItest (3NF Normalized OLTP)',
    description: 'Relational enterprise schema demonstrating 3NF normalization, circular FKs, and cascade actions.',
    tables: [
      {
        name: 'Employee',
        type: 'ENTITY',
        keys: ['SSN [PK]'],
        fks: ['Dno → Department.DNum', 'SuperSSN → Employee.SSN (Recursive)'],
        columns: ['SSN [PK]', 'FName', 'LName', 'BDate', 'Address', 'Gender', 'Salary', 'Dno [FK]', 'SuperSSN [FK]']
      },
      {
        name: 'Department',
        type: 'ENTITY',
        keys: ['DNum [PK]'],
        fks: ['MgrSSN → Employee.SSN'],
        columns: ['DNum [PK]', 'DName [UK]', 'MgrSSN [FK]', 'MgrStartDate']
      },
      {
        name: 'Project',
        type: 'ENTITY',
        keys: ['PNum [PK]'],
        fks: ['DNum → Department.DNum'],
        columns: ['PNum [PK]', 'PName', 'City', 'DNum [FK]']
      },
      {
        name: 'WorksOn',
        type: 'ASSOCIATIVE',
        keys: ['(ESSN, PNo) [PK]'],
        fks: ['ESSN → Employee.SSN', 'PNo → Project.PNum'],
        columns: ['ESSN [PK, FK]', 'PNo [PK, FK]', 'Hours']
      },
      {
        name: 'Dependent',
        type: 'WEAK ENTITY',
        keys: ['(ESSN, DependentName) [PK]'],
        fks: ['ESSN → Employee.SSN (ON DELETE CASCADE)'],
        columns: ['ESSN [PK, FK]', 'DependentName [PK]', 'Sex', 'BDate', 'Relationship']
      },
      {
        name: 'DeptLocations',
        type: 'MULTI-VALUED ATTRIBUTE',
        keys: ['(DNum, DLocation) [PK]'],
        fks: ['DNum → Department.DNum'],
        columns: ['DNum [PK, FK]', 'DLocation [PK]']
      }
    ]
  },
  itiSchema: {
    name: 'ITI & DB2 (Academic & Relational Integrity Engine)',
    databaseName: 'ITI & DB2',
    description: 'Relational schemas illustrating domain check rules, UDDTs, sp_bindrule, and standalone defaults from MaharaTech CH01_VID05 and CH01_VID06.',
    scriptRef: 'src/01_storage_and_schema/ch01_vid06_constraints_rules_defaults.sql',
    docRef: 'docs/ch01-vid06-constraints-rules-defaults-live.md',
    precedingScriptRef: 'src/01_storage_and_schema/ch01_vid05_integrity_constraints.sql',
    precedingDocRef: 'docs/db2-integrity-constraints-live.md',
    tables: [
      {
        name: 'dbo.Instructor (ITI)',
        type: 'CORE ENTITY',
        grain: 'One row per academic instructor with degree, salary, and track affiliation (16 Live Records)',
        keys: ['Ins_Id [PK]'],
        fks: ['Dept_Id → dbo.Department.Dept_Id'],
        rules: ['CREATE RULE myrule AS @x > 1000 (Bound via sp_bindrule)'],
        defaults: ['CREATE DEFAULT mydef AS 5000 (Bound via sp_bindefault)'],
        columns: [
          'Ins_Id [PK, INT]',
          'Ins_Name [NVARCHAR(50)]',
          'Ins_Degree [NVARCHAR(50)]',
          'Salary [MONEY] (Bound to myrule: @x > 1000)',
          'gender [VARCHAR(1)]',
          'Dept_Id [FK, INT]'
        ]
      },
      {
        name: 'dbo.Department (ITI)',
        type: 'PARENT TRACK ENTITY',
        grain: 'One row per educational department track (SD, Java, BI)',
        keys: ['Dept_Id [PK]'],
        fks: [],
        columns: [
          'Dept_Id [PK, INT]',
          'Dept_Name [VARCHAR(50), NOT NULL]',
          'Dept_Desc [VARCHAR(100)]',
          'Dept_Location [VARCHAR(50)]',
          'Manager_hiredate [DATE]'
        ]
      },
      {
        name: 'dbo.emps (DB2)',
        type: 'CONSTRAINT LAB ENTITY',
        grain: 'Employee record with 8 explicit named constraints (c1 through c8)',
        keys: ['(eid, ename) [PK, c1]'],
        fks: ['dnum → dbo.depts.did [FK, c8] ON DELETE SET NULL ON UPDATE CASCADE'],
        columns: [
          'eid [PK, INT IDENTITY]',
          'ename [PK, VARCHAR(10)]',
          'eadd [VARCHAR(10)] (CHECK c6 IN cairo/alex/mansoura)',
          'hiredate [DATE DEFAULT GETDATE()]',
          'salary [INT UNIQUE c2, CHECK c4 > 1000]',
          'overtime [INT UNIQUE c3, CHECK c5 BETWEEN 100 AND 5600]',
          'netsal [COMPUTED PERSISTED: salary + overtime]',
          'age [COMPUTED: YEAR(GETDATE()) - YEAR(bd)]',
          'gender [VARCHAR(1) CHECK c7 IN F/M]',
          'dnum [FK, INT]'
        ]
      },
      {
        name: 'dbo.depts (DB2)',
        type: 'PARENT DIVISION ENTITY',
        grain: 'One row per organizational department division',
        keys: ['did [PK]'],
        fks: [],
        columns: ['did [PK, INT]', 'dname [VARCHAR(10)]']
      }
    ],
    liveRows: [
      { id: 1, name: 'Ahmed', degree: 'Master', salary: '5000.0000', gender: 'M', dept: 10, valid: true },
      { id: 2, name: 'Hany', degree: 'Master', salary: '4320.0000', gender: 'M', dept: 10, valid: true },
      { id: 3, name: 'Reham', degree: 'Master', salary: '2640.0000', gender: 'F', dept: 10, valid: true },
      { id: 4, name: 'Yasmin', degree: 'PHD', salary: '264.0000', gender: 'F', dept: 10, valid: false, anomaly: 'Salary < 1000 (Violates standard CHECK constraint; bypassed by sp_bindrule / WITH NOCHECK)' },
      { id: 5, name: 'Amany', degree: 'PHD', salary: '660.0000', gender: 'F', dept: 10, valid: false, anomaly: 'Salary < 1000 (Violates standard CHECK constraint; bypassed by sp_bindrule / WITH NOCHECK)' },
      { id: 6, name: 'Eman', degree: 'Master', salary: '792.0000', gender: 'F', dept: 10, valid: false, anomaly: 'Salary < 1000 (Violates standard CHECK constraint; bypassed by sp_bindrule / WITH NOCHECK)' },
      { id: 7, name: 'Saly', degree: 'NULL', salary: '12960.0000', gender: 'F', dept: 10, valid: true },
      { id: 8, name: 'Amr', degree: 'NULL', salary: 'NULL', gender: 'M', dept: 20, valid: true },
      { id: 9, name: 'Hussien', degree: 'NULL', salary: 'NULL', gender: 'M', dept: 20, valid: true },
      { id: 10, name: 'Khalid', degree: 'NULL', salary: '11520.0000', gender: 'M', dept: 20, valid: true },
      { id: 11, name: 'Salah', degree: 'NULL', salary: '12960.0000', gender: 'M', dept: 20, valid: true },
      { id: 12, name: 'Adel', degree: 'NULL', salary: '8640.0000', gender: 'M', dept: 30, valid: true },
      { id: 13, name: 'Fakry', degree: 'NULL', salary: '5760.0000', gender: 'M', dept: 30, valid: true },
      { id: 14, name: 'Amena', degree: 'NULL', salary: '7200.0000', gender: 'F', dept: 30, valid: true },
      { id: 15, name: 'Ghada', degree: 'NULL', salary: '4320.0000', gender: 'F', dept: 30, valid: true },
      { id: 666, name: 'ahmed', degree: 'NULL', salary: 'NULL', gender: 'NULL', dept: null, valid: true, anomaly: 'Sparse audit test row (All attributes NULL)' }
    ]
  }
};

export const DATA_FLOW_STAGES = [
  {
    step: '01',
    name: 'BATCH INGESTION',
    subtitle: 'Table-Valued Parameter Streaming',
    desc: 'Receives external order batches via strongly-typed User-Defined Table Types (Sales.OrderBatchType), eliminating per-row round trips.',
    tech: 'T-SQL TVPs',
    repoRef: 'src/03_programmability_and_elt/01_tvps_and_bulk_ingestion.sql'
  },
  {
    step: '02',
    name: 'ACID VALIDATION',
    subtitle: 'Transactional Boundaries',
    desc: 'Stored procedures execute under SET XACT_ABORT ON and explicit TRY...CATCH blocks, guaranteeing zero partial writes on constraint violations.',
    tech: 'XACT_ABORT / TRY...CATCH',
    repoRef: 'src/03_programmability_and_elt/03_stored_procedures_etl.sql'
  },
  {
    step: '03',
    name: 'CHANGE TRACKING',
    subtitle: 'Non-Blocking CDC Audit',
    desc: 'Captures modified records directly into Audit.OrderHistory using the DML OUTPUT clause and virtual inserted/deleted tables with zero lock escalation.',
    tech: 'OUTPUT Clause / Triggers',
    repoRef: 'src/04_governance_and_audit/01_audit_change_capture_triggers.sql'
  },
  {
    step: '04',
    name: 'STORAGE TIERING',
    subtitle: 'Sliding-Window Archival',
    desc: 'Periodically rotates historical sales partitions from DATA_FG to ARCHIVE_FG using ALTER TABLE ... SWITCH PARTITION with metadata-only zero-IO overhead.',
    tech: 'Partition Switching',
    repoRef: 'src/01_storage_and_schema/04_partitioning_scheme.sql'
  },
  {
    step: '05',
    name: 'DIMENSIONAL MERGE',
    subtitle: 'SCD Type 1 & 2 Processing',
    desc: 'Loads staging delta into OmniFlowDW, automatically closing expired SCD2 customer rows (IsCurrent = 0, ValidTo = GETDATE()) and generating new surrogate keys.',
    tech: 'MERGE / Kimball SCD2',
    repoRef: 'src/07_warehousing_and_reporting/03_etl_staging_to_dw.sql'
  },
  {
    step: '06',
    name: 'OPERATIONAL ANALYTICS',
    subtitle: 'SSRS & Analytical Querying',
    desc: 'Serves pre-aggregated facts to executive dashboards and SQL Server Reporting Services (.rdl) definitions with drilldown matrices.',
    tech: 'SSRS .rdl / OLAP Queries',
    repoRef: 'src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl'
  }
];

export const SQL_ENGINEERING_SHOWCASE = [
  {
    id: 'tvp',
    title: 'Table-Valued Parameters (TVP)',
    category: 'High-Throughput Ingestion',
    file: 'src/03_programmability_and_elt/01_tvps_and_bulk_ingestion.sql',
    summary: 'Streams large batches of order line items in a single network round-trip via strongly typed table parameters.',
    snippet: `-- Create strongly typed User-Defined Table Type (UDTT)
CREATE TYPE [Sales].[OrderBatchType] AS TABLE
(
    [BatchRowId]    INT NOT NULL PRIMARY KEY,
    [OrderNumber]   VARCHAR(30) NOT NULL,
    [CustomerCode]  VARCHAR(20) NOT NULL,
    [OrderDate]     DATETIME2(3) NOT NULL,
    [ProductSKU]    VARCHAR(30) NOT NULL,
    [Quantity]      INT NOT NULL,
    [UnitPrice]     DECIMAL(18, 4) NOT NULL,
    [DiscountPct]   DECIMAL(5, 2) NOT NULL DEFAULT (0.00)
);
GO

-- Bulk Ingest Stored Procedure using READONLY TVP
CREATE OR ALTER PROCEDURE [Sales].[usp_BulkIngestOrders]
    @OrderBatch [Sales].[OrderBatchType] READONLY,
    @RowsProcessed INT = 0 OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRY
        BEGIN TRANSACTION;
            INSERT INTO [Sales].[Orders] (OrderNumber, CustomerId, OrderDate)
            SELECT DISTINCT b.OrderNumber, c.CustomerId, b.OrderDate
            FROM @OrderBatch b
            INNER JOIN [Customer].[Customer] c ON b.CustomerCode = c.CustomerCode;

            SET @RowsProcessed = @@ROWCOUNT;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
END;`
  },
  {
    id: 'partitioning',
    title: 'Sliding Window Partition Switching',
    category: 'Storage Engine Optimization',
    file: 'src/01_storage_and_schema/04_partitioning_scheme.sql',
    summary: 'Performs instant zero-IO historical data archival by switching partition metadata between physical filegroups.',
    snippet: `-- Step 1: Create staging table with identical schema on ARCHIVE_FG
CREATE TABLE [Sales].[Invoices_Archive_Staging]
(
    [InvoiceId]     BIGINT NOT NULL,
    [InvoiceDate]   DATE NOT NULL,
    [CustomerId]    INT NOT NULL,
    [TotalAmount]   DECIMAL(18, 2) NOT NULL,
    CONSTRAINT [PK_Invoices_Archive_Staging]
        PRIMARY KEY CLUSTERED ([InvoiceDate], [InvoiceId])
) ON [ARCHIVE_FG];

-- Step 2: Instant zero-IO metadata switch from active partition 1 to staging
ALTER TABLE [Sales].[Invoices] 
SWITCH PARTITION 1 
TO [Sales].[Invoices_Archive_Staging];

-- Step 3: Advance sliding window by splitting next boundary
ALTER PARTITION SCHEME [ps_InvoiceScheme] NEXT USED [DATA_FG];
ALTER PARTITION FUNCTION [pf_InvoiceDateRange]() 
SPLIT RANGE ('2025-04-01');`
  },
  {
    id: 'scd2',
    title: 'Slowly Changing Dimension (SCD Type 2)',
    category: 'Kimball Data Warehousing',
    file: 'src/07_warehousing_and_reporting/03_etl_staging_to_dw.sql',
    summary: 'Tracks full historical attribute revisions on DimCustomer using ValidFrom, ValidTo, and IsCurrent flags.',
    snippet: `-- Expire prior customer dimension row when address or postal code changes
UPDATE target
SET 
    target.ValidTo = DATEADD(DAY, -1, CAST(GETDATE() AS DATE)),
    target.IsCurrent = 0
FROM [dw].[DimCustomer] target
INNER JOIN [dw].[stg_Customers] src 
    ON target.CustomerCode = src.CustomerCode
WHERE target.IsCurrent = 1
  AND (target.PostalCode <> src.PostalCode OR target.CustomerName <> src.CustomerName);

-- Insert newly versioned current row with active validity window
INSERT INTO [dw].[DimCustomer] 
    (CustomerId, CustomerName, CustomerCode, PostalCode, ValidFrom, ValidTo, IsCurrent)
SELECT 
    src.CustomerId, 
    src.CustomerName, 
    src.CustomerCode, 
    src.PostalCode, 
    CAST(GETDATE() AS DATE) AS ValidFrom, 
    NULL AS ValidTo, 
    1 AS IsCurrent
FROM [dw].[stg_Customers] src
LEFT JOIN [dw].[DimCustomer] existing 
    ON src.CustomerCode = existing.CustomerCode AND existing.IsCurrent = 1
WHERE existing.CustomerSK IS NULL;`
  },
  {
    id: 'indexed_views',
    title: 'Schemabound Materialized Indexed Views',
    category: 'Performance Tuning',
    file: 'src/02_indexing_and_performance/02_indexed_views.sql',
    summary: 'Persists pre-aggregated multi-table summary calculations directly to disk with a unique clustered index.',
    snippet: `-- Create deterministic view with SCHEMABINDING and COUNT_BIG(*)
CREATE VIEW [Sales].[vw_CustomerSalesSummary]
WITH SCHEMABINDING
AS
SELECT 
    o.CustomerId,
    COUNT_BIG(*) AS OrderCount,
    SUM(ISNULL(d.Quantity * d.UnitPrice, 0)) AS TotalRevenue
FROM [Sales].[Orders] o
INNER JOIN [Sales].[OrderDetails] d ON o.OrderId = d.OrderId
GROUP BY o.CustomerId;
GO

-- Materialize view by creating unique clustered index
CREATE UNIQUE CLUSTERED INDEX [CIX_vw_CustomerSalesSummary]
ON [Sales].[vw_CustomerSalesSummary] (CustomerId);`
  },
  {
    id: 'clr',
    title: 'In-Engine C# SQL CLR Assembly',
    category: 'Database Extensibility',
    file: 'src/05_automation_and_smo/clr/SqlClrExtensions.cs',
    summary: 'High-speed compiled .NET assembly executing SHA-256 cryptographic hashing directly inside the database process.',
    snippet: `using System;
using System.Data.SqlTypes;
using System.Security.Cryptography;
using System.Text;
using Microsoft.SqlServer.Server;

public class SqlClrExtensions
{
    [SqlFunction(IsDeterministic = true, IsPrecise = true)]
    public static SqlString ComputeSha256(SqlString input)
    {
        if (input.IsNull) return SqlString.Null;

        using (SHA256 sha256 = SHA256.Create())
        {
            byte[] bytes = Encoding.UTF8.GetBytes(input.Value);
            byte[] hash = sha256.ComputeHash(bytes);
            return new SqlString(BitConverter.ToString(hash).Replace("-", "").ToLowerInvariant());
        }
    }
}`
  },
  {
    id: 'cte_hierarchy',
    title: 'Recursive Hierarchical CTEs',
    category: 'Advanced Querying',
    file: 'src/03_programmability_and_elt/04_hierarchical_data_and_ctes.sql',
    summary: 'Navigates multi-level corporate supervision chains using recursive anchor and recursive member unions.',
    snippet: `-- Recursive CTE to traverse organizational management tree
WITH OrgChart_CTE AS 
(
    -- Anchor Member: Top-level executives (SuperSSN IS NULL)
    SELECT 
        SSN, FName, LName, SuperSSN,
        0 AS HierarchyLevel,
        CAST(FName + ' ' + LName AS VARCHAR(MAX)) AS ManagementPath
    FROM [dbo].[Employee]
    WHERE SuperSSN IS NULL

    UNION ALL

    -- Recursive Member: Subordinate employees
    SELECT 
        e.SSN, e.FName, e.LName, e.SuperSSN,
        mgr.HierarchyLevel + 1 AS HierarchyLevel,
        CAST(mgr.ManagementPath + ' -> ' + e.FName + ' ' + e.LName AS VARCHAR(MAX))
    FROM [dbo].[Employee] e
    INNER JOIN OrgChart_CTE mgr ON e.SuperSSN = mgr.SSN
)
SELECT * FROM OrgChart_CTE ORDER BY HierarchyLevel, SSN;`
  }
];

export const TECHNICAL_DEEP_DIVES = [
  {
    title: 'Physical Storage Engine & Allocation',
    concept: '8 KB Data Pages, 64 KB Extents & Multi-Filegroup I/O Isolation',
    why: 'Prevents I/O contention between high-frequency transactional inserts, random index B-tree page splits, and large table scans.',
    implementation: 'OmniFlowDB isolates PRIMARY (catalogs), DATA_FG (OLTP tables), INDEX_FG (non-clustered indexes), and ARCHIVE_FG (cold partitions). Uses dynamic path querying via SERVERPROPERTY for cross-platform portability.',
    repoFile: 'src/01_storage_and_schema/01_filegroups_and_files.sql'
  },
  {
    title: 'ACID Transactions & Concurrency',
    concept: 'Deterministic Rollbacks & Error Re-raising with XACT_ABORT',
    why: 'Default SQL Server error handling does not automatically abort transactions on certain severity errors, risking orphan transactions and partial data commits.',
    implementation: 'Every procedural pipeline enforces SET XACT_ABORT ON paired with structured TRY...CATCH and THROW. Audit output is streamed simultaneously via the non-locking OUTPUT clause.',
    repoFile: 'src/03_programmability_and_elt/03_stored_procedures_etl.sql'
  },
  {
    title: 'High Availability & Disaster Recovery',
    concept: 'Continuous Transaction Log Chains & Point-in-Time Recovery',
    why: 'Production business continuity mandates Recovery Point Objective (RPO) ≤ 15 minutes and Recovery Time Objective (RTO) ≤ 45 minutes.',
    implementation: 'Automated SQL Agent maintenance jobs enforce Full (weekly), Differential (daily), and Log (15-min) backup chains. Includes NTFS sparse database snapshot scripts for instant rollback before high-risk deployments.',
    repoFile: 'src/06_reliability_and_dr/01_backup_and_maintenance_jobs.sql'
  },
  {
    title: 'Kimball Dimensional Warehousing',
    concept: 'Star Schema Bus Matrix & Slowly Changing Dimensions',
    why: 'Translates volatile 3NF normalized structures into high-speed analytical marts supporting point-in-time historical reporting without impacting production OLTP.',
    implementation: 'OmniFlowDW features conformed dimensions (DimDate, DimCustomer, DimProduct, DimTerritory) surrounding an additive FactSales table. Employs surrogate keys to insulate warehouse schemas from source system changes.',
    repoFile: 'src/07_warehousing_and_reporting/02_dimensional_star_schema.sql'
  },
  {
    title: 'Database Governance & Schema Defense',
    concept: 'Event-Driven DDL Triggers with XML Payload Inspection',
    why: 'Eliminates unauthorized schema drops, accidental table truncations, and unrecorded structural modifications in production.',
    implementation: 'Database-level triggers intercept DROP_TABLE and ALTER_TABLE events, parsing EVENTDATA() XML to record login identity, machine name, and exact T-SQL statements into Audit.SchemaChangeLog.',
    repoFile: 'src/04_governance_and_audit/02_ddl_and_server_triggers.sql'
  },
  {
    title: 'Automated Operations via SMO',
    concept: 'Declarative Administration with PowerShell & Python SMO',
    why: 'Enables programmatic database deployments, automated schema extraction, and backup validation in automated DevOps pipelines.',
    implementation: 'PowerShell scripts instantiate Microsoft.SqlServer.Management.Smo.Server objects to verify backup headers and perform declarative schema scripting without manual SSMS intervention.',
    repoFile: 'src/05_automation_and_smo/smo_scripts/BackupDatabase.ps1'
  }
];

export const PROJECT_JOURNEY_STAGES = [
  {
    number: '01',
    phase: 'Problem Statement & Requirements',
    title: 'Enterprise OLTP Bottlenecks & Auditability Gaps',
    description: 'Relational databases without explicit physical storage isolation suffer from disk I/O bottlenecks, lock escalation during batch loads, and catastrophic data loss risks when unindexed schemas grow.',
    artifacts: ['docs/course-syllabus-mapping.md', 'README.md']
  },
  {
    number: '02',
    phase: 'Physical Architecture & Modeling',
    title: 'Multi-Filegroup Storage & 3NF Integrity Constraints',
    description: 'Designed OmniFlowDB with segregated filegroups (PRIMARY, DATA_FG, INDEX_FG, ARCHIVE_FG). Implemented canonical Peter Chen Company ERD with circular foreign keys resolved via post-creation ALTER TABLE scripts.',
    artifacts: ['src/01_storage_and_schema/01_filegroups_and_files.sql', 'docs/ch01-case-study-erd-and-implementation.md']
  },
  {
    number: '03',
    phase: 'Procedural Pipelines & Concurrency',
    title: 'High-Throughput TVP Ingestion & ACID Pipelines',
    description: 'Engineered batch ingestion procedures accepting strongly typed User-Defined Table Types (TVPs). Implemented XACT_ABORT and TRY...CATCH error handling with non-blocking OUTPUT clause audit capture.',
    artifacts: ['src/03_programmability_and_elt/01_tvps_and_bulk_ingestion.sql', 'src/03_programmability_and_elt/03_stored_procedures_etl.sql']
  },
  {
    number: '04',
    phase: 'Governance & Operational Reliability',
    title: 'DDL Event Triggers, C# CLR & DR Backup Chains',
    description: 'Created database security triggers auditing schema changes, compiled custom C# assemblies for in-engine SHA-256 hashing, and authored SQL Agent jobs guaranteeing RPO ≤ 15 minutes.',
    artifacts: ['src/04_governance_and_audit/02_ddl_and_server_triggers.sql', 'src/06_reliability_and_dr/01_backup_and_maintenance_jobs.sql']
  },
  {
    number: '05',
    phase: 'Analytical Warehousing & Reporting',
    title: 'Kimball Star Schema & Slowly Changing Dimensions',
    description: 'Constructed OmniFlowDW dimensional mart with surrogate key generation and automated SCD Type 2 tracking (ValidFrom/ValidTo/IsCurrent) on DimCustomer. Authored parameterized SSRS report definitions.',
    artifacts: ['src/07_warehousing_and_reporting/02_dimensional_star_schema.sql', 'docs/dimensional-model.md']
  },
  {
    number: '06',
    phase: 'Automated CI/CD & Testing Verification',
    title: 'Containerized SQL Server 2022 Integration Test Suite',
    description: 'Automated end-to-end testing with pytest and pyodbc running inside a live Docker SQL Server 2022 container on GitHub Actions, asserting partition schemes, circular constraints, and TVP throughput.',
    artifacts: ['tests/python/test_data_platform.py', '.github/workflows/db-integration-tests.yml']
  }
];

export const CREATOR_PROFILE = {
  name: 'Sohila Khaled Abbas',
  title: 'Data Engineer & Database Reliability Engineer',
  role: 'Creator & Platform Architect',
  bio: 'Specializing in Microsoft SQL Server 2022 internals, physical storage architecture, procedural ETL design, and analytical dimensional modeling. Engineered directly from the official Information Technology Institute (ITI) / MaharaTech curriculum.',
  github: 'https://github.com/Sohila-Khaled-Abbas',
  repo: 'https://github.com/Sohila-Khaled-Abbas/sql-server-data-platform',
  curriculumRef: 'https://maharatech.gov.eg/course/view.php?id=2305'
};
