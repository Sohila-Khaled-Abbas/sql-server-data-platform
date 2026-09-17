/**
 * Official Microsoft Learn & SQL Server Technical Documentation Library
 * Curated reference for Microsoft SQL Server 2022 Data Engineering & DBRE
 */

export const MICROSOFT_DOCS = [
  {
    id: "ms-storage-arch",
    category: "Storage Engine & Architecture",
    chapter: 1,
    title: "Database Files and Filegroups Architecture",
    url: "https://learn.microsoft.com/en-us/sql/relational-databases/databases/database-files-and-filegroups",
    summary: "Every SQL Server database has at least two operating system files: a primary data file (.mdf) and a transaction log file (.ldf). Learn how to partition secondary data files (.ndf) across independent filegroups for parallel spindle I/O.",
    badge: "Official Architecture",
    topics: ["MDF / NDF", "LDF Log", "Filegroups", "Drive Spindles", "IOPS Throughput"]
  },
  {
    id: "ms-pages-extents",
    category: "Storage Engine & Architecture",
    chapter: 1,
    title: "Pages and Extents Architecture Guide",
    url: "https://learn.microsoft.com/en-us/sql/relational-databases/pages-and-extents-architecture-guide",
    summary: "The fundamental unit of data storage in SQL Server is the 8 KB page. Learn about the 96-byte header, GAM/SGAM allocation bitmaps, PFS free space tracking, and uniform vs mixed extents (64 KB).",
    badge: "Storage Geometry",
    topics: ["8 KB Pages", "64 KB Extents", "GAM / SGAM", "PFS Byte", "Slot Array"]
  },
  {
    id: "ms-constraints",
    category: "Storage Engine & Architecture",
    chapter: 1,
    title: "Primary and Foreign Key Constraints",
    url: "https://learn.microsoft.com/en-us/sql/relational-databases/tables/primary-and-foreign-key-constraints",
    summary: "Enforce referential integrity, entity identity, and domain constraints. Understand ON DELETE CASCADE rules, cascading depth limits, and resolving circular foreign keys.",
    badge: "Schema Integrity",
    topics: ["Primary Key", "Foreign Key", "Cascading Actions", "Circular Dependencies"]
  },
  {
    id: "ms-snapshots",
    category: "Storage Engine & Architecture",
    chapter: 1,
    title: "Database Snapshots (SQL Server)",
    url: "https://learn.microsoft.com/en-us/sql/relational-databases/databases/database-snapshots-sql-server",
    summary: "A database snapshot is a read-only, static view of a SQL Server database. Utilizes Windows NTFS Copy-on-Write (CoW) sparse files to store pre-modification pages for instant disaster rollbacks.",
    badge: "Disaster Recovery",
    topics: ["Copy-on-Write", "NTFS Sparse Files", "Point-in-Time Recovery", "RESTORE SNAPSHOT"]
  },
  {
    id: "ms-transactions-locking",
    category: "Concurrency & Locking",
    chapter: 2,
    title: "SQL Server Transaction Locking and Row Versioning Guide",
    url: "https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide",
    summary: "The authoritative guide to SQL Server concurrency. Explains Shared (S), Exclusive (X), and Intent (IS/IX) locks, lock escalation thresholds (5,000 locks), and deadlock resolution.",
    badge: "Deep-Dive Manual",
    topics: ["Shared Locks", "Exclusive Locks", "Deadlocks", "Lock Escalation", "sys.dm_tran_locks"]
  },
  {
    id: "ms-rcsi-snapshot",
    category: "Concurrency & Locking",
    chapter: 2,
    title: "Snapshot Isolation and RCSI in SQL Server",
    url: "https://learn.microsoft.com/en-us/sql/t-sql/statements/alter-database-transact-sql-set-options",
    summary: "Eliminate blocking between readers and writers using Read Committed Snapshot Isolation (RCSI). Uses TempDB version stores to provide statement-level read consistency without shared locks.",
    badge: "Performance Pattern",
    topics: ["RCSI", "Snapshot Isolation", "TempDB Version Store", "Non-blocking Reads"]
  },
  {
    id: "ms-udf-inlining",
    category: "Query Tuning & Optimization",
    chapter: 2,
    title: "Scalar UDF Inlining (Intelligent Query Processing)",
    url: "https://learn.microsoft.com/en-us/sql/relational-databases/user-defined-functions/scalar-udf-inlining",
    summary: "Exposes the performance cost of imperative scalar UDFs and how SQL Server 2019+ automatically transforms qualifying scalar functions into relational subqueries unfolded into the query plan.",
    badge: "Optimizer Internals",
    topics: ["Scalar UDF", "RBAR Penalty", "UDF Inlining", "Query Tree Unfolding", "IQP"]
  },
  {
    id: "ms-partitioning",
    category: "Scalability & Data Engineering",
    chapter: 3,
    title: "Partitioned Tables and Indexes",
    url: "https://learn.microsoft.com/en-us/sql/relational-databases/partitions/partitioned-tables-and-indexes",
    summary: "Scale enterprise tables horizontally. Master Partition Functions (RANGE LEFT vs RANGE RIGHT), Partition Schemes across storage filegroups, and aligned indexing for partition independence.",
    badge: "Big Data Scaling",
    topics: ["Partition Function", "Partition Scheme", "RANGE LEFT/RIGHT", "Partition Elimination"]
  },
  {
    id: "ms-switch-partition",
    category: "Scalability & Data Engineering",
    chapter: 3,
    title: "Transferring Data Efficiently with Partition Switching",
    url: "https://learn.microsoft.com/en-us/sql/relational-databases/partitions/switch-partitions",
    summary: "The sliding window pattern. Learn how ALTER TABLE ... SWITCH PARTITION executes sub-second data loading and archiving via metadata pointer re-assignment without moving physical bytes.",
    badge: "High-Throughput ETL",
    topics: ["SWITCH PARTITION", "Sliding Window", "Zero-IO Archival", "Metadata Only"]
  },
  {
    id: "ms-tvp",
    category: "Scalability & Data Engineering",
    chapter: 3,
    title: "Use Table-Valued Parameters (Database Engine)",
    url: "https://learn.microsoft.com/en-us/sql/relational-databases/tables/use-table-valued-parameters-database-engine",
    summary: "Stream client batches into stored procedures with strong typing and single roundtrips. Eliminate cursor-based procedural ingestion and protect against SQL injection.",
    badge: "High-Throughput Ingestion",
    topics: ["Table-Valued Parameters", "User-Defined Table Type", "READONLY", "Batch Ingest"]
  },
  {
    id: "ms-alwayson-ag",
    category: "High Availability & DBRE",
    chapter: 3,
    title: "Overview of Always On Availability Groups",
    url: "https://learn.microsoft.com/en-us/sql/database-engine/availability-groups/windows/overview-of-always-on-availability-groups-sql-server",
    summary: "Enterprise high-availability and disaster recovery solution. Provides synchronous commit for zero data loss (RPO = 0) and offloads reporting queries to active secondary replicas.",
    badge: "Mission-Critical HA",
    topics: ["Always On AG", "Synchronous Commit", "Automatic Failover", "Read-Only Replicas", "RPO / RTO"]
  },
  {
    id: "ms-stored-procedures",
    category: "Programmability & Automation",
    chapter: 4,
    title: "Stored Procedures (Database Engine) & TRY...CATCH",
    url: "https://learn.microsoft.com/en-us/sql/relational-databases/stored-procedures/stored-procedures-database-engine",
    summary: "Write defensive, compiled Transact-SQL procedures. Enforce SET XACT_ABORT ON to prevent orphaned transactions, capture errors with ERROR_NUMBER(), and avoid parameter sniffing.",
    badge: "Defensive Coding",
    topics: ["CREATE PROCEDURE", "XACT_ABORT", "TRY...CATCH", "Parameter Sniffing", "OUTPUT"]
  },
  {
    id: "ms-triggers-audit",
    category: "Programmability & Automation",
    chapter: 4,
    title: "DML Triggers and the Inserted/Deleted Tables",
    url: "https://learn.microsoft.com/en-us/sql/relational-databases/triggers/use-the-inserted-and-deleted-tables",
    summary: "Deep dive into transient inserted and deleted pseudo-tables. Explains why triggers must handle multi-row batch mutations and how to implement non-locking CDC audit trails.",
    badge: "Audit & Governance",
    topics: ["AFTER Trigger", "INSTEAD OF Trigger", "inserted / deleted", "Multi-row Logic"]
  },
  {
    id: "ms-ddl-triggers",
    category: "Programmability & Automation",
    chapter: 4,
    title: "DDL Triggers and the EVENTDATA() Function",
    url: "https://learn.microsoft.com/en-us/sql/relational-databases/triggers/ddl-triggers",
    summary: "Guard schemas against unauthorized alterations and drops. Extract the XML context (PostTime, LoginName, ObjectName, T-SQL command) from EVENTDATA() to enforce compliance.",
    badge: "Security & Drift Guard",
    topics: ["DDL Trigger", "EVENTDATA()", "Schema Guard", "Audit Logging"]
  },
  {
    id: "ms-sql-clr",
    category: "Programmability & Automation",
    chapter: 4,
    title: "Common Language Runtime (CLR) Integration",
    url: "https://learn.microsoft.com/en-us/sql/relational-databases/clr-integration/common-language-runtime-integration",
    summary: "Host compiled .NET C# code inside the SQL Server process. Compare SAFE, EXTERNAL_ACCESS, and UNSAFE permission sets, and leverage high-speed regular expressions and crypto hashing.",
    badge: "Extensibility",
    topics: [".NET CLR", "C# Stored Procedures", "SAFE / UNSAFE", "clr strict security"]
  },
  {
    id: "ms-star-schema",
    category: "Dimensional Warehousing & BI",
    chapter: 5,
    title: "Design Guidance for Replicated & Distributed Tables",
    url: "https://learn.microsoft.com/en-us/azure/synapse-analytics/sql-data-warehouse/design-guidance-for-replicated-tables",
    summary: "Best practices for designing Fact tables, Conformed Dimension tables, and Surrogate Keys in analytical database systems using Ralph Kimball's dimensional modeling methodology.",
    badge: "Kimball Methodology",
    topics: ["Star Schema", "Fact Table Grain", "Conformed Dimensions", "Surrogate Keys"]
  },
  {
    id: "ms-columnstore",
    category: "Dimensional Warehousing & BI",
    chapter: 5,
    title: "Columnstore Indexes: Overview & Architecture",
    url: "https://learn.microsoft.com/en-us/sql/relational-databases/indexes/columnstore-indexes-overview",
    summary: "Achieve 10x query performance and 7x data compression for data warehouses. Understand rowgroup segments, dictionary encoding, delta stores, and batch mode execution.",
    badge: "Analytical Speed",
    topics: ["Clustered Columnstore", "Rowgroups", "Batch Mode", "Compression Ratios"]
  },
  {
    id: "ms-ssrs-reporting",
    category: "Dimensional Warehousing & BI",
    chapter: 5,
    title: "Create Paginated Reports in SQL Server Reporting Services (SSRS)",
    url: "https://learn.microsoft.com/en-us/sql/reporting-services/create-deploy-and-manage-mobile-and-paginated-reports",
    summary: "Build enterprise Tablix matrix reports. Author report definition language (.rdl), configure parameterized datasets, and implement drill-down analytical rollups.",
    badge: "Enterprise Reporting",
    topics: ["SSRS", "Tablix Matrix", "RDL Definition", "Parameterized Queries"]
  }
];

export const MICROSOFT_DMV_DOCS = [
  {
    dmv: "sys.dm_exec_query_stats",
    url: "https://learn.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-exec-query-stats-transact-sql",
    purpose: "Returns aggregate performance statistics for cached query plans (CPU time, duration, physical reads, logical writes)."
  },
  {
    dmv: "sys.dm_os_wait_stats",
    url: "https://learn.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-os-wait-stats-transact-sql",
    purpose: "Server-wide telemetry of all wait types encountered by threads (PAGEIOLATCH_SH, CXPACKET, LCK_M_X)."
  },
  {
    dmv: "sys.dm_db_index_physical_stats",
    url: "https://learn.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-db-index-physical-stats-transact-sql",
    purpose: "Calculates size and fragmentation information for data and indexes in SQL Server."
  },
  {
    dmv: "sys.dm_db_index_usage_stats",
    url: "https://learn.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-db-index-usage-stats-transact-sql",
    purpose: "Counts of different types of index operations (seeks, scans, lookups, updates) to identify unused indexes."
  },
  {
    dmv: "sys.dm_tran_locks",
    url: "https://learn.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-views/sys-dm-tran-locks-transact-sql",
    purpose: "Information about currently active lock manager resources (granularity, lock mode, status, requestor)."
  }
];
