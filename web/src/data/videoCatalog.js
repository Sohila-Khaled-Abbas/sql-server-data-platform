/**
 * Official Video Catalog: MaharaTech Course 2305
 * Implementing and Developing SQL Server Objects
 * Instructor: Eng. Rami Mohamed Abonagi (ITI / MCIT Egypt)
 * Integrated with Microsoft Learn Documentation references.
 */

export const COURSE_METADATA = {
  courseId: 2305,
  courseTitle: "Implementing and Developing SQL Server Objects",
  instructor: "Eng. Rami Mohamed Abonagi",
  institution: "Information Technology Institute (ITI) / MaharaTech",
  portalUrl: "https://maharatech.gov.eg/course/view.php?id=2305",
  totalVideos: 25,
  totalChapters: 5,
  description: "Comprehensive engineering curriculum mastering Microsoft SQL Server internals, relational modeling, advanced T-SQL programming, concurrency control, partitioning, triggers, and Kimball dimensional warehousing."
};

export const COURSE_VIDEOS = [
  // ==========================================
  // CHAPTER 1: STORAGE ARCHITECTURE & SCHEMAS
  // ==========================================
  {
    id: "ch01-vid01",
    chapter: 1,
    chapterTitle: "Chapter 1: Storage Architecture & Schemas",
    videoCode: "CH01_VID01",
    title: "Database Files, Filegroups & Physical Storage Architecture",
    duration: "19 mins",
    level: "Foundational",
    skillsConnected: ["Storage Internals", "Page Geometry", "DBRE Storage Tiering", "Filegroup Allocation"],
    objectives: [
      "Understand the physical roles of Primary Data Files (.mdf), Secondary Data Files (.ndf), and Transaction Log (.ldf).",
      "Master the 8 KB Page structure: 96-byte header, 8,060 bytes usable data, and slot array.",
      "Analyze 64 KB Extents (Uniform vs Mixed) and Gam/Sgam allocation bitmaps.",
      "Design multi-drive I/O separation to eliminate disk queue contention."
    ],
    description: "Deep dive into SQL Server's storage engine. Eng. Rami explains how relational records are serialized to 8,192-byte pages on disk, how filegroups isolate high-throughput tables, and why write-ahead logging (WAL) requires dedicated disk spindles.",
    sampleSql: `-- Inspect physical file allocations & storage structures
SELECT 
    'Primary MDF' AS FileType,
    'PRIMARY' AS Filegroup,
    'Company_Data.mdf' AS PhysicalName,
    '8 KB' AS PageSize,
    '64 KB (8 Pages)' AS ExtentSize;`,
    repoPath: "sql/schemas/01_create_database.sql",
    challengeId: null,
    erdEntity: "Database",
    attachments: [
      { id: "att-ch1-1", name: "Physical Storage Architecture Notes", type: "DOC", path: "docs/CH01_CASE_STUDY_IMPLEMENTATION.md" },
      { id: "att-ch1-2", name: "Database & Filegroups DDL Script", type: "SQL", path: "sql/schemas/01_create_database.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/course/view.php?id=2305",
    microsoftDocTitle: "Database Files and Filegroups Architecture",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/databases/database-files-and-filegroups"
  },
  {
    id: "ch01-vid02",
    chapter: 1,
    chapterTitle: "Chapter 1: Storage Architecture & Schemas",
    videoCode: "CH01_VID02",
    title: "Create Database Using Wizard & Peter Chen Case Study ERD",
    duration: "24 mins",
    level: "Foundational",
    skillsConnected: ["Relational Modeling", "Peter Chen ERD", "3NF Normalization", "Schema Architecture"],
    objectives: [
      "Deconstruct the canonical Company Peter Chen ERD into 3NF normalized relations.",
      "Model entities (Employee, Department, Project, Dependent) and resolve multi-valued attributes (Dept_Locations).",
      "Map 1:1, 1:N, and M:N relationships into foreign keys and associative composite junction tables (Works_On).",
      "Compare SSMS Database Designer Wizard generation against idempotent T-SQL scripts."
    ],
    description: "Walkthrough of the Company Case Study Peter Chen ERD. Students learn to map conceptual entities, weak entities, and multi-valued attributes into robust third-normal-form relational tables with precise datatype choices.",
    sampleSql: `-- Query the normalized 3NF Company schema
SELECT 
    e.Fname || ' ' || e.Lname AS EmployeeName,
    e.Salary,
    d.DName AS Department,
    p.Pname AS ProjectName,
    w.Hours AS ProjectHours
FROM Employee e
JOIN Department d ON e.Dno = d.DNum
JOIN Works_On w ON e.SSN = w.Essn
JOIN Project p ON w.Pno = p.Pnumber
ORDER BY d.DName, e.Salary DESC;`,
    repoPath: "sql/schemas/02_create_tables.sql",
    challengeId: "ch-1",
    erdEntity: "Employee",
    attachments: [
      { id: "att-ch1-3", name: "Company Case Study Peter Chen ERD Guide", type: "DOC", path: "docs/CH01_CASE_STUDY_IMPLEMENTATION.md" },
      { id: "att-ch1-4", name: "3NF Relational Tables DDL", type: "SQL", path: "sql/schemas/02_create_tables.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/course/view.php?id=2305",
    microsoftDocTitle: "CREATE TABLE (Transact-SQL) Guide",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/t-sql/statements/create-table-transact-sql"
  },
  {
    id: "ch01-vid03",
    chapter: 1,
    chapterTitle: "Chapter 1: Storage Architecture & Schemas",
    videoCode: "CH01_VID03",
    title: "Primary Keys, Foreign Keys & Circular Reference Resolution",
    duration: "22 mins",
    level: "Intermediate",
    skillsConnected: ["Referential Integrity", "Circular Foreign Keys", "Cascading Actions", "Constraint Governance"],
    objectives: [
      "Implement clustered primary keys and enforce entity identity.",
      "Resolve the circular dependency between Employee.Dno -> Department.DNum and Department.MgrSSN -> Employee.SSN.",
      "Configure ON DELETE CASCADE vs ON DELETE NO ACTION without causing multiple cascade path errors.",
      "Utilize ALTER TABLE deferred constraint addition during automated deployment pipelines."
    ],
    description: "Explains how to maintain rock-solid referential integrity while avoiding circular creation deadlocks. Eng. Rami demonstrates creating the Department table with a nullable MgrSSN, adding Employee, and then binding the manager foreign key constraint via ALTER TABLE.",
    sampleSql: `-- Circular reference resolution demonstration:
-- Department manager must exist in Employee, and Employee belongs to Department
SELECT 
    d.DName AS Department,
    e.Fname || ' ' || e.Lname AS ManagerName,
    d.MgrStartDate AS ManagedSince,
    (SELECT COUNT(*) FROM Employee sub WHERE sub.Dno = d.DNum) AS TotalEmployees
FROM Department d
LEFT JOIN Employee e ON d.MgrSSN = e.SSN;`,
    repoPath: "sql/schemas/02_create_tables.sql",
    challengeId: "ch-3",
    erdEntity: "Department",
    attachments: [
      { id: "att-ch1-5", name: "Circular FK Architecture Guide", type: "DOC", path: "docs/CH01_CASE_STUDY_IMPLEMENTATION.md" },
      { id: "att-ch1-6", name: "Foreign Key Constraints Script", type: "SQL", path: "sql/schemas/02_create_tables.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/course/view.php?id=2305",
    microsoftDocTitle: "Primary and Foreign Key Constraints",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/tables/primary-and-foreign-key-constraints"
  },
  {
    id: "ch01-vid04",
    chapter: 1,
    chapterTitle: "Chapter 1: Storage Architecture & Schemas",
    videoCode: "CH01_VID04",
    title: "Unique & Check Constraints, Rules & Defaults Architecture",
    duration: "20 mins",
    level: "Foundational",
    skillsConnected: ["Data Quality", "Constraint Architecture", "Domain Integrity", "Legacy Rules"],
    objectives: [
      "Compare declarative CHECK constraints with legacy sp_bindrule and sp_bindefault.",
      "Implement domain validation for salary ranges, gender codes ('M','F'), and email patterns.",
      "Prevent data pollution at the storage engine level before writes reach transaction logs.",
      "Analyze the performance impact of CHECK constraints on Query Optimizer partition elimination."
    ],
    description: "Deep dive into domain integrity. Covers CHECK constraints, UNIQUE constraints, and legacy SQL Server Rule/Default objects. Learn how the Query Optimizer uses trusted constraints to perform contradiction detection and bypass table scans entirely.",
    sampleSql: `-- Test domain integrity and salary validation logic
SELECT 
    Fname || ' ' || Lname AS EmployeeName,
    Salary,
    CASE 
        WHEN Salary >= 50000 THEN 'Executive Band (CHECK Valid)'
        WHEN Salary >= 30000 THEN 'Senior Band (CHECK Valid)'
        ELSE 'Junior Band (CHECK Valid)'
    END AS CompensationBand,
    Sex AS GenderCode
FROM Employee
WHERE Salary >= 25000;`,
    repoPath: "sql/schemas/02_create_tables.sql",
    challengeId: "ch-1",
    erdEntity: "Employee",
    attachments: [
      { id: "att-ch1-7", name: "Constraint Validation Reference", type: "DOC", path: "docs/CH01_CASE_STUDY_IMPLEMENTATION.md" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/course/view.php?id=2305",
    microsoftDocTitle: "Unique Constraints and Check Constraints",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/tables/unique-constraints-and-check-constraints"
  },
  {
    id: "ch01-vid05",
    chapter: 1,
    chapterTitle: "Chapter 1: Storage Architecture & Schemas",
    videoCode: "CH01_VID05",
    title: "Database Snapshots & Copy-on-Write NTFS Sparse Files",
    duration: "26 mins",
    level: "Intermediate",
    skillsConnected: ["Disaster Recovery", "Database Snapshots", "Copy-on-Write", "NTFS Sparse Files", "DBRE"],
    objectives: [
      "Understand Copy-on-Write (CoW) mechanics: unmodified pages are read from source; modified pages write to sparse file.",
      "Deploy instant point-in-time recovery for staging database testing and pre-deployment safety nets.",
      "Measure snapshot storage consumption and performance overhead during bulk write transactions.",
      "Execute RESTORE DATABASE FROM DATABASE_SNAPSHOT to roll back bad batch runs in seconds."
    ],
    description: "Master SQL Server Database Snapshots. Eng. Rami explains how read-only point-in-time static views utilize Windows NTFS sparse files to record original 8 KB pages before updates or deletes modify the source database.",
    sampleSql: `-- Emulate snapshot audit: compare original state with active modifications
SELECT 
    'Source Database' AS StateType,
    COUNT(*) AS ActiveRecords,
    SUM(Salary) AS TotalPayroll
FROM Employee
UNION ALL
SELECT 
    'Snapshot (Copy-on-Write)' AS StateType,
    COUNT(*) AS ActiveRecords,
    SUM(Salary) AS TotalPayroll
FROM Employee;`,
    repoPath: "docs/DISASTER_RECOVERY_RUNBOOK.md",
    challengeId: null,
    erdEntity: "Database",
    attachments: [
      { id: "att-ch1-8", name: "Disaster Recovery Runbook (Snapshots & Backups)", type: "DOC", path: "docs/DISASTER_RECOVERY_RUNBOOK.md" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/course/view.php?id=2305",
    microsoftDocTitle: "Database Snapshots (SQL Server)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/databases/database-snapshots-sql-server"
  },

  // ========================================================
  // CHAPTER 2: SQL PROGRAMMING & CONCURRENCY ESSENTIALS
  // ========================================================
  {
    id: "ch02-vid01",
    chapter: 2,
    chapterTitle: "Chapter 2: SQL Programming & Concurrency",
    videoCode: "CH02_VID01",
    title: "Variables, Batches & Flow of Control Structures in T-SQL",
    duration: "21 mins",
    level: "Foundational",
    skillsConnected: ["Procedural T-SQL", "Batch Scope", "Control Flow", "Dynamic SQL"],
    objectives: [
      "Understand variable declaration, lifetime, and batch boundaries separated by 'GO'.",
      "Implement conditional branching with IF...ELSE and iterative loops with WHILE.",
      "Handle NULL value propagation and use COALESCE/ISNULL for defensive code.",
      "Avoid procedural RBAR (Row-By-Agonizing-Row) traps by keeping logic set-based."
    ],
    description: "Learn procedural programming constructs in Transact-SQL. Understand how local variables are scoped strictly to individual batches, how to structure conditional business branches, and when procedural loops should be replaced with window functions.",
    sampleSql: `-- Conditional logic & payroll adjustment simulation
SELECT 
    SSN,
    Fname || ' ' || Lname AS FullName,
    Salary AS CurrentSalary,
    CASE 
        WHEN Dno = 1 THEN ROUND(Salary * 1.15, 2)
        WHEN Dno = 2 THEN ROUND(Salary * 1.10, 2)
        ELSE ROUND(Salary * 1.05, 2)
    END AS ProjectedSalary
FROM Employee;`,
    repoPath: "sql/schemas/02_create_tables.sql",
    challengeId: "ch-1",
    erdEntity: "Employee",
    attachments: [
      { id: "att-ch2-1", name: "T-SQL Procedural Handbook", type: "DOC", path: "docs/PERFORMANCE_TUNING_HANDBOOK.md" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/course/view.php?id=2305",
    microsoftDocTitle: "Control-of-Flow Language (Transact-SQL)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/t-sql/language-elements/control-of-flow"
  },
  {
    id: "ch02-vid02",
    chapter: 2,
    chapterTitle: "Chapter 2: SQL Programming & Concurrency",
    videoCode: "CH02_VID02",
    title: "Transactions, ACID Boundaries & Transaction Log Internals",
    duration: "28 mins",
    level: "Intermediate",
    skillsConnected: ["ACID Properties", "Transaction Management", "Write-Ahead Logging", "XACT_ABORT"],
    objectives: [
      "Analyze the 4 pillars of ACID: Atomicity, Consistency, Isolation, and Durability.",
      "Manage explicit transactions: BEGIN TRANSACTION, COMMIT TRANSACTION, and ROLLBACK TRANSACTION.",
      "Inspect @@TRANCOUNT nesting and prevent orphaned transactions with SET XACT_ABORT ON.",
      "Trace Write-Ahead Logging (WAL) and the role of the Log Flush on commit."
    ],
    description: "Deep dive into SQL Server transaction processing. Learn how the relational engine coordinates memory buffers and transaction log records to guarantee recovery even in the event of an abrupt power failure or crash.",
    sampleSql: `-- Emulate atomic financial payroll transaction
SELECT 
    'TRANSACTION AUDIT' AS Phase,
    COUNT(SSN) AS TotalEmployees,
    SUM(Salary) AS TotalSalaryPool,
    AVG(Salary) AS MeanCompensation
FROM Employee;`,
    repoPath: "docs/LEARNING_GUIDE_ACID_CONCURRENCY.md",
    challengeId: "ch-5",
    erdEntity: "Employee",
    attachments: [
      { id: "att-ch2-2", name: "ACID Concurrency Deep Dive", type: "DOC", path: "docs/LEARNING_GUIDE_ACID_CONCURRENCY.md" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/course/view.php?id=2305",
    microsoftDocTitle: "Transaction Management & Locking",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/t-sql/statements/begin-transaction-transact-sql"
  },
  {
    id: "ch02-vid03",
    chapter: 2,
    chapterTitle: "Chapter 2: SQL Programming & Concurrency",
    videoCode: "CH02_VID03",
    title: "Concurrency, Locking Modes & Isolation Levels Matrix",
    duration: "32 mins",
    level: "Advanced",
    skillsConnected: ["Concurrency Control", "Locking Modes", "Deadlock Mitigation", "Snapshot Isolation (RCSI)"],
    objectives: [
      "Compare the 4 concurrency anomalies: Dirty Reads, Non-Repeatable Reads, Phantom Reads, and Lost Updates.",
      "Evaluate isolation levels: READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE, and SNAPSHOT.",
      "Configure Read Committed Snapshot Isolation (RCSI) via TempDB version store.",
      "Diagnose deadlocks with sys.dm_tran_locks and lock escalation thresholds (5,000 locks)."
    ],
    description: "The core masterclass on database concurrency. Eng. Rami breaks down Shared (S), Exclusive (X), and Intent (IS/IX) lock hierarchies. Learn how to eliminate blocking and reader/writer deadlocks using optimistic RCSI snapshot isolation.",
    sampleSql: `-- Inspect concurrency and department distribution
SELECT 
    d.DName AS Department,
    COUNT(e.SSN) AS ActiveEmployees,
    MIN(e.Salary) AS MinSalary,
    MAX(e.Salary) AS MaxSalary
FROM Department d
LEFT JOIN Employee e ON d.DNum = e.Dno
GROUP BY d.DName;`,
    repoPath: "docs/LEARNING_GUIDE_ACID_CONCURRENCY.md",
    challengeId: "ch-1",
    erdEntity: "Department",
    attachments: [
      { id: "att-ch2-3", name: "Locking & Concurrency Matrix", type: "DOC", path: "docs/LEARNING_GUIDE_ACID_CONCURRENCY.md" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/course/view.php?id=2305",
    microsoftDocTitle: "Transaction Locking & Row Versioning Guide",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide"
  },
  {
    id: "ch02-vid04",
    chapter: 2,
    chapterTitle: "Chapter 2: SQL Programming & Concurrency",
    videoCode: "CH02_VID04",
    title: "Scalar User-Defined Functions (UDFs) & RBAR Inlining Penalties",
    duration: "23 mins",
    level: "Intermediate",
    skillsConnected: ["Query Optimization", "Scalar UDFs", "Execution Plan Analysis", "Scalar Inlining"],
    objectives: [
      "Analyze the execution cost of Scalar UDFs: Context-switching between SQL Engine and Expression Evaluator.",
      "Inspect the invisible RBAR penalty: 1 function invocation per row in the result set.",
      "Explore SQL Server 2019+ Scalar UDF Inlining requirements and disqualification blockers.",
      "Refactor scalar calculations into inline cross-apply queries for orders-of-magnitude speedups."
    ],
    description: "Exposes the notorious performance hazard of Scalar User-Defined Functions. Eng. Rami demonstrates why a scalar function running on 1,000,000 rows generates 1,000,000 separate invocations, preventing parallel execution plans.",
    sampleSql: `-- Set-based calculation replacing a slow scalar function
SELECT 
    e.Fname || ' ' || e.Lname AS EmployeeName,
    e.Salary,
    d.DName AS Department,
    ROUND(e.Salary * 0.14, 2) AS SocialInsuranceTax,
    ROUND(e.Salary * 0.05, 2) AS HealthFundContribution,
    ROUND(e.Salary * 0.81, 2) AS NetTakeHomePay
FROM Employee e
JOIN Department d ON e.Dno = d.DNum;`,
    repoPath: "docs/PERFORMANCE_TUNING_HANDBOOK.md",
    challengeId: "ch-2",
    erdEntity: "Employee",
    attachments: [
      { id: "att-ch2-4", name: "UDF Refactoring & Performance Handbook", type: "DOC", path: "docs/PERFORMANCE_TUNING_HANDBOOK.md" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/course/view.php?id=2305",
    microsoftDocTitle: "Scalar UDF Inlining in SQL Server",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/user-defined-functions/scalar-udf-inlining"
  },
  {
    id: "ch02-vid05",
    chapter: 2,
    chapterTitle: "Chapter 2: SQL Programming & Concurrency",
    videoCode: "CH02_VID05",
    title: "Multi-Statement Table-Valued Functions (MSTVFs) & TempDB Spills",
    duration: "25 mins",
    level: "Advanced",
    skillsConnected: ["Cardinality Estimation", "MSTVFs", "TempDB Optimization", "Spill to Disk"],
    objectives: [
      "Understand table variable backing inside TempDB with no statistics available.",
      "Analyze the legacy fixed 1-row (SQL 2012) and 100-row (SQL 2014+) cardinality estimation assumption.",
      "Identify memory grant exhaustion and TempDB spills in execution plans.",
      "Determine when MSTVFs are acceptable (complex multi-step ETL) vs when they cripple production queries."
    ],
    description: "Detailed dissection of Multi-Statement Table-Valued Functions. Discover how blind cardinality estimates force the Query Optimizer to choose inappropriate nested loop joins, and how interleaving execution alleviates this penalty in modern engines.",
    sampleSql: `-- Analytical multi-department salary metrics simulation
SELECT 
    d.DName AS DepartmentName,
    COUNT(e.SSN) AS EmployeeCount,
    SUM(e.Salary) AS TotalSalaryExpenditure,
    AVG(e.Salary) AS AvgSalaryExpenditure
FROM Department d
LEFT JOIN Employee e ON d.DNum = e.Dno
GROUP BY d.DName
HAVING COUNT(e.SSN) > 0;`,
    repoPath: "docs/PERFORMANCE_TUNING_HANDBOOK.md",
    challengeId: "ch-1",
    erdEntity: "Department",
    attachments: [
      { id: "att-ch2-5", name: "MSTVF Cardinality Deep-Dive", type: "DOC", path: "docs/PERFORMANCE_TUNING_HANDBOOK.md" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/course/view.php?id=2305",
    microsoftDocTitle: "Table-Valued Functions Architecture",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/user-defined-functions/create-user-defined-functions-database-engine"
  },
  {
    id: "ch02-vid06",
    chapter: 2,
    chapterTitle: "Chapter 2: SQL Programming & Concurrency",
    videoCode: "CH02_VID06",
    title: "Inline Table-Valued Functions (ITVFs) & Query Tree Unfolding",
    duration: "24 mins",
    level: "Intermediate",
    skillsConnected: ["Query Optimizer", "Inline TVF", "Query Tree Unfolding", "Parameterized Views"],
    objectives: [
      "Understand why Inline TVFs behave as Parameterized Views with zero TempDB overhead.",
      "Inspect query tree unfolding: optimizer unfolds function definition directly into calling query.",
      "Benefit from cost-based optimization, index seeks, and accurate histogram statistics.",
      "Adopt ITVFs as the gold standard for modular, reusable database calculation layers."
    ],
    description: "Why Inline TVFs reign supreme in SQL Server. Learn how the optimizer unpacks the query definition directly into the parent execution plan, allowing clustered index seeks and parallel operator distribution.",
    sampleSql: `-- Inline TVF equivalent: Filter projects by minimum workload hours
SELECT 
    p.Pname AS ProjectName,
    p.Plocation AS Location,
    d.DName AS ControllingDepartment,
    SUM(w.Hours) AS TotalProjectHours
FROM Project p
JOIN Department d ON p.Dnum = d.DNum
JOIN Works_On w ON p.Pnumber = w.Pno
GROUP BY p.Pname, p.Plocation, d.DName
HAVING SUM(w.Hours) >= 20;`,
    repoPath: "docs/PERFORMANCE_TUNING_HANDBOOK.md",
    challengeId: "ch-4",
    erdEntity: "Project",
    attachments: [
      { id: "att-ch2-6", name: "ITVF Optimization Patterns", type: "DOC", path: "docs/PERFORMANCE_TUNING_HANDBOOK.md" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/course/view.php?id=2305",
    microsoftDocTitle: "User-Defined Functions (Database Engine)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/user-defined-functions/user-defined-functions"
  },

  // ==========================================================
  // CHAPTER 3: ADVANCED SCALABILITY & HIGH AVAILABILITY
  // ==========================================================
  {
    id: "ch03-vid01",
    chapter: 3,
    chapterTitle: "Chapter 3: Scalability & High Availability",
    videoCode: "CH03_VID01",
    title: "Horizontal Range Partitioning Architecture (Functions & Schemes)",
    duration: "27 mins",
    level: "Advanced",
    skillsConnected: ["Partition Functions", "Partition Schemes", "Data Lifecycle", "Storage Tiering"],
    objectives: [
      "Design Partition Functions: Understanding RANGE LEFT vs RANGE RIGHT boundary semantics.",
      "Map logical partitions to physical storage using Partition Schemes across multiple filegroups.",
      "Leverage Partition Elimination to bypass unneeded storage extents during WHERE queries.",
      "Align clustered and non-clustered indexes on the partition scheme for partition independence."
    ],
    description: "Scale multi-million row enterprise tables with Horizontal Range Partitioning. Eng. Rami clarifies the difference between RANGE LEFT and RANGE RIGHT boundary dates, ensuring historical data rests on low-cost archive tiers while current transactions hit NVMe storage.",
    sampleSql: `-- Partition scheme simulation: categorize sales by fiscal quarter
SELECT 
    CASE 
        WHEN strftime('%m', DateKey) BETWEEN '01' AND '03' THEN 'P1: Q1 Partition'
        WHEN strftime('%m', DateKey) BETWEEN '04' AND '06' THEN 'P2: Q2 Partition'
        WHEN strftime('%m', DateKey) BETWEEN '07' AND '09' THEN 'P3: Q3 Partition'
        ELSE 'P4: Q4 Partition'
    END AS TargetPartition,
    COUNT(*) AS TransactionVolume,
    ROUND(SUM(TotalAmount), 2) AS TotalRevenue
FROM FactSales
GROUP BY TargetPartition
ORDER BY TargetPartition;`,
    repoPath: "sql/partitioning/01_partition_scheme.sql",
    challengeId: "ch-5",
    erdEntity: "FactSales",
    attachments: [
      { id: "att-ch3-1", name: "Horizontal Partitioning DDL Script", type: "SQL", path: "sql/partitioning/01_partition_scheme.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/course/view.php?id=2305",
    microsoftDocTitle: "Partitioned Tables and Indexes",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/partitions/partitioned-tables-and-indexes"
  },
  {
    id: "ch03-vid02",
    chapter: 3,
    chapterTitle: "Chapter 3: Scalability & High Availability",
    videoCode: "CH03_VID02",
    title: "Sliding Window Partition Maintenance & Metadata Switching",
    duration: "31 mins",
    level: "Expert",
    skillsConnected: ["Sliding Window", "SWITCH PARTITION", "Fast Ingestion", "Purging & Archival"],
    objectives: [
      "Perform sub-second data purging using ALTER TABLE ... SWITCH PARTITION TO staging.",
      "Understand metadata-only switching: zero row data movement across disk blocks.",
      "Satisfy strict SWITCH requirements: identical schema, matching constraints, and aligned indexing.",
      "Automate SPLIT RANGE (adding new quarters) and MERGE RANGE (compressing old quarters)."
    ],
    description: "The crown jewel of large-scale data engineering: The Sliding Window Pattern. Learn how to ingest and archive hundreds of gigabytes in milliseconds with zero logging overhead by re-pointing B-Tree metadata pointers.",
    sampleSql: `-- Metadata partition alignment verification
SELECT 
    'Aligned Fact Table' AS TableName,
    'Quarterly Range Scheme' AS SchemeName,
    COUNT(*) AS ActiveRowCount,
    MIN(DateKey) AS OldestActiveDate,
    MAX(DateKey) AS NewestActiveDate
FROM FactSales;`,
    repoPath: "sql/partitioning/02_sliding_window.sql",
    challengeId: "ch-5",
    erdEntity: "FactSales",
    attachments: [
      { id: "att-ch3-2", name: "Sliding Window Automation Script", type: "SQL", path: "sql/partitioning/02_sliding_window.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/course/view.php?id=2305",
    microsoftDocTitle: "Transferring Data with Partition Switching",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/partitions/switch-partitions"
  },
  {
    id: "ch03-vid03",
    chapter: 3,
    chapterTitle: "Chapter 3: Scalability & High Availability",
    videoCode: "CH03_VID03",
    title: "High-Throughput Bulk Ingestion via Table-Valued Parameters (TVPs)",
    duration: "23 mins",
    level: "Advanced",
    skillsConnected: ["Bulk Ingestion", "TVPs", "Network Roundtrips", "MERGE / Upsert"],
    objectives: [
      "Define User-Defined Table Types (UDTT) with declarative primary and check constraints.",
      "Stream multi-thousand row batches from C# / Python with single network roundtrips.",
      "Enforce READONLY semantics on TVP parameters in stored procedures.",
      "Eliminate connection pool exhaustion and cursor-based ingestion bottlenecks."
    ],
    description: "Ingest thousands of telemetry readings or financial orders per second. Eng. Rami contrasts single-row INSERT statements with strongly-typed Table-Valued Parameters (TVPs) passed into transactional procedures.",
    sampleSql: `-- Simulated batch TVP ingestion into an operational staging buffer
SELECT 
    'BatchTVP-001' AS IngestionBatchId,
    p.Pname AS ProjectName,
    COUNT(w.Essn) AS AssignedStaff,
    SUM(w.Hours) AS TotalCommittedHours
FROM Project p
JOIN Works_On w ON p.Pnumber = w.Pno
GROUP BY p.Pname;`,
    repoPath: "sql/procedures/02_tvp_batch_ingest.sql",
    challengeId: "ch-4",
    erdEntity: "Project",
    attachments: [
      { id: "att-ch3-3", name: "TVP Batch Ingestion Procedure Script", type: "SQL", path: "sql/procedures/02_tvp_batch_ingest.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/course/view.php?id=2305",
    microsoftDocTitle: "Use Table-Valued Parameters (Database Engine)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/tables/use-table-valued-parameters-database-engine"
  },
  {
    id: "ch03-vid04",
    chapter: 3,
    chapterTitle: "Chapter 3: Scalability & High Availability",
    videoCode: "CH03_VID04",
    title: "Semi-Structured XML Shredding (.nodes & .value) & Generation",
    duration: "26 mins",
    level: "Intermediate",
    skillsConnected: ["Semi-Structured Data", "XML Shredding", "XQuery / XPath", "FOR XML PATH"],
    objectives: [
      "Query semi-structured XML payloads using XQuery methods (.nodes, .value, .query, .exist).",
      "Shred hierarchical XML documents into flat relational result sets.",
      "Generate nested XML structures using SELECT ... FOR XML PATH and ROOT directives.",
      "Understand XML index structures: Primary XML index vs Secondary (PATH, VALUE, PROPERTY)."
    ],
    description: "Bridging relational schemas with semi-structured interchange formats. Master native XML datatypes, XPath shredding into tabular rows, and generating custom XML payloads for legacy integration feeds.",
    sampleSql: `-- Relational extraction of department and staff hierarchy
SELECT 
    d.DName AS Department,
    GROUP_CONCAT(e.Fname || ' ' || e.Lname, ', ') AS StaffMembers,
    COUNT(e.SSN) AS MemberCount
FROM Department d
JOIN Employee e ON d.DNum = e.Dno
GROUP BY d.DName;`,
    repoPath: "sql/schemas/02_create_tables.sql",
    challengeId: "ch-1",
    erdEntity: "Department",
    attachments: [
      { id: "att-ch3-4", name: "XML Processing Reference", type: "DOC", path: "docs/PERFORMANCE_TUNING_HANDBOOK.md" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/course/view.php?id=2305",
    microsoftDocTitle: "XML Data (SQL Server)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/xml/xml-data-sql-server"
  },
  {
    id: "ch03-vid05",
    chapter: 3,
    chapterTitle: "Chapter 3: Scalability & High Availability",
    videoCode: "CH03_VID05",
    title: "High Availability Runbooks: Log Shipping & Always On AGs",
    duration: "34 mins",
    level: "Advanced",
    skillsConnected: ["High Availability", "Log Shipping", "Always On AGs", "RPO / RTO", "Disaster Recovery"],
    objectives: [
      "Differentiate Recovery Point Objective (RPO) and Recovery Time Objective (RTO).",
      "Architect Log Shipping topologies: Primary Server, Secondary Server, and Monitor Server.",
      "Understand Always On Availability Groups: synchronous-commit (zero data loss) vs asynchronous-commit.",
      "Handle split-brain scenarios and configure automatic failover with Windows Server Failover Clustering (WSFC)."
    ],
    description: "Enterprise disaster recovery and zero-downtime architecture. Learn how transaction log backups are shipped, copied, and restored in STANDBY mode to offload read-heavy analytics reports while guarding against catastrophic hardware failures.",
    sampleSql: `-- High Availability health check simulation
SELECT 
    'Node-01 (Primary)' AS ClusterNode,
    'Synchronous Commit' AS AvailabilityMode,
    'HEALTHY' AS SynchronizationHealth,
    0.0 AS EstimatedDataLossSeconds
UNION ALL
SELECT 
    'Node-02 (Secondary Standby)' AS ClusterNode,
    'Synchronous Commit' AS AvailabilityMode,
    'SYNCHRONIZED' AS SynchronizationHealth,
    0.0 AS EstimatedDataLossSeconds;`,
    repoPath: "docs/DISASTER_RECOVERY_RUNBOOK.md",
    challengeId: null,
    erdEntity: "Database",
    attachments: [
      { id: "att-ch3-5", name: "Disaster Recovery & HA Runbook", type: "DOC", path: "docs/DISASTER_RECOVERY_RUNBOOK.md" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/course/view.php?id=2305",
    microsoftDocTitle: "Always On Availability Groups Overview",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/database-engine/availability-groups/windows/overview-of-always-on-availability-groups-sql-server"
  },

  // ==========================================================
  // CHAPTER 4: PROCEDURES, TRIGGERS & AUTOMATION
  // ==========================================================
  {
    id: "ch04-vid01",
    chapter: 4,
    chapterTitle: "Chapter 4: Procedures, Triggers & Automation",
    videoCode: "CH04_VID01",
    title: "Production Stored Procedures, Error Handling & XACT_ABORT",
    duration: "29 mins",
    level: "Intermediate",
    skillsConnected: ["Stored Procedures", "Defensive T-SQL", "TRY...CATCH", "Audit Logging"],
    objectives: [
      "Structure robust stored procedures with strict parameters, OUTPUT keywords, and return codes.",
      "Implement industry-standard error handling using BEGIN TRY ... BEGIN CATCH blocks.",
      "Utilize ERROR_NUMBER(), ERROR_MESSAGE(), and ERROR_LINE() in centralized error audit tables.",
      "Enforce SET NOCOUNT ON and SET XACT_ABORT ON to prevent network latency and transaction leaks."
    ],
    description: "Transform raw SQL scripts into enterprise-grade production procedures. Eng. Rami emphasizes defensive programming, transaction doom mitigation, parameter sniffing prevention, and structured logging.",
    sampleSql: `-- Test transactional procedure validation query
SELECT 
    e.SSN,
    e.Fname || ' ' || e.Lname AS EmployeeName,
    e.Salary,
    d.DName AS Department,
    'Verified Eligible for Review' AS AuditStatus
FROM Employee e
JOIN Department d ON e.Dno = d.DNum
WHERE e.Salary >= 30000;`,
    repoPath: "sql/procedures/01_production_procedures.sql",
    challengeId: "ch-1",
    erdEntity: "Employee",
    attachments: [
      { id: "att-ch4-1", name: "Production Stored Procedures Script", type: "SQL", path: "sql/procedures/01_production_procedures.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/course/view.php?id=2305",
    microsoftDocTitle: "Stored Procedures (Database Engine)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/stored-procedures/stored-procedures-database-engine"
  },
  {
    id: "ch04-vid02",
    chapter: 4,
    chapterTitle: "Chapter 4: Procedures, Triggers & Automation",
    videoCode: "CH04_VID02",
    title: "DML Audit Triggers, Pseudo-Tables (inserted / deleted) & CDC",
    duration: "30 mins",
    level: "Advanced",
    skillsConnected: ["DML Triggers", "Audit Logging", "CDC", "Multi-Row Operations"],
    objectives: [
      "Understand DML Trigger lifecycle: AFTER vs INSTEAD OF triggers.",
      "Inspect the in-memory inserted and deleted pseudo-tables.",
      "CRITICAL: Always write multi-row aware triggers; never assume a single row is modified.",
      "Build automated audit trails recording user, timestamp, old salary, and new salary."
    ],
    description: "Building automated audit trails and CDC systems. Discover how SQL Server creates transient inserted and deleted memory tables during DML execution, and why single-row variable assignments in triggers crash production during bulk updates.",
    sampleSql: `-- Emulate DML audit trail capturing salary adjustments
SELECT 
    'AUDIT-LOG-101' AS AuditId,
    e.SSN AS EmployeeSSN,
    e.Salary AS PreUpdateSalary,
    ROUND(e.Salary * 1.08, 2) AS PostUpdateSalary,
    ROUND(e.Salary * 0.08, 2) AS Discrepancy,
    'Sohila_DBA' AS ModifiedBy,
    '2026-09-17 22:00:00' AS ModifiedTimestamp
FROM Employee e
WHERE e.SSN = '112233445';`,
    repoPath: "sql/triggers/01_audit_triggers.sql",
    challengeId: "ch-3",
    erdEntity: "Employee",
    attachments: [
      { id: "att-ch4-2", name: "DML Audit Triggers DDL Script", type: "SQL", path: "sql/triggers/01_audit_triggers.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/course/view.php?id=2305",
    microsoftDocTitle: "DML Triggers & Inserted/Deleted Pseudo-Tables",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/triggers/use-the-inserted-and-deleted-tables"
  },
  {
    id: "ch04-vid03",
    chapter: 4,
    chapterTitle: "Chapter 4: Procedures, Triggers & Automation",
    videoCode: "CH04_VID03",
    title: "DDL Server & Database Security Triggers with EVENTDATA()",
    duration: "25 mins",
    level: "Advanced",
    skillsConnected: ["DDL Triggers", "Security Governance", "EVENTDATA()", "Schema Guard"],
    objectives: [
      "Capture schema modification events (CREATE_TABLE, ALTER_TABLE, DROP_TABLE).",
      "Parse the EVENTDATA() XML payload: PostTime, LoginName, ObjectName, and CommandText.",
      "Roll back unauthorized schema modifications with ROLLBACK TRANSACTION in trigger scope.",
      "Maintain a comprehensive DDL change catalog for compliance and SOC2 auditing."
    ],
    description: "Guard production schemas against accidental drops or unapproved changes. Eng. Rami shows how DDL triggers intercept schema manipulation events and extract full XML context via EVENTDATA().",
    sampleSql: `-- Inspect DDL change governance log simulation
SELECT 
    'EVT-8829' AS EventId,
    'DROP_TABLE' AS EventType,
    'LegacyPayrollStaging' AS TargetObject,
    'DEV_TEST\\AnalystUser' AS LoginAccount,
    'BLOCKED & ROLLED BACK' AS ExecutionOutcome,
    'DDL Trigger trg_ProtectSchemaActive' AS EnforcementPolicy;`,
    repoPath: "sql/triggers/02_ddl_security_triggers.sql",
    challengeId: null,
    erdEntity: "Database",
    attachments: [
      { id: "att-ch4-3", name: "DDL Security Triggers Script", type: "SQL", path: "sql/triggers/02_ddl_security_triggers.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/course/view.php?id=2305",
    microsoftDocTitle: "DDL Triggers & EVENTDATA() Architecture",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/triggers/ddl-triggers"
  },
  {
    id: "ch04-vid04",
    chapter: 4,
    chapterTitle: "Chapter 4: Procedures, Triggers & Automation",
    videoCode: "CH04_VID04",
    title: "C# SQL CLR Managed Assemblies Integration (SAFE vs UNSAFE)",
    duration: "28 mins",
    level: "Expert",
    skillsConnected: ["SQL CLR", ".NET Integration", "C# Stored Procedures", "Database Security"],
    objectives: [
      "Understand the CLR hosting layer inside sqlservr.exe.",
      "Analyze security levels: SAFE (pure computation), EXTERNAL_ACCESS (file/net I/O), and UNSAFE.",
      "Implement high-performance regular expression parsing and hashing impossible in native T-SQL.",
      "Evaluate security trade-offs and 'clr strict security' configuration requirements in SQL Server 2017+."
    ],
    description: "Integrate compiled .NET C# code directly into the SQL Server process space. Learn when CLR integration makes engineering sense (string parsing, complex regex, encryption) and how to configure assembly permissions securely.",
    sampleSql: `-- Emulate CLR RegEx validation on employee emails and IDs
SELECT 
    e.SSN,
    e.Fname || ' ' || e.Lname AS EmployeeName,
    CASE 
        WHEN length(e.SSN) = 9 THEN 'Valid SSN Format (CLR Regex Pass)'
        ELSE 'Invalid SSN Format'
    END AS SSNValidationResult
FROM Employee e;`,
    repoPath: "docs/PERFORMANCE_TUNING_HANDBOOK.md",
    challengeId: "ch-3",
    erdEntity: "Employee",
    attachments: [
      { id: "att-ch4-4", name: "SQL CLR Integration Architecture", type: "DOC", path: "docs/PERFORMANCE_TUNING_HANDBOOK.md" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/course/view.php?id=2305",
    microsoftDocTitle: "Common Language Runtime (CLR) Integration",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/clr-integration/common-language-runtime-integration"
  },
  {
    id: "ch04-vid05",
    chapter: 4,
    chapterTitle: "Chapter 4: Procedures, Triggers & Automation",
    videoCode: "CH04_VID05",
    title: "Administrative Automation via PowerShell SMO & Python Scripting",
    duration: "27 mins",
    level: "Intermediate",
    skillsConnected: ["SMO Automation", "PowerShell Scripting", "Python Data Engineering", "CI/CD Deployment"],
    objectives: [
      "Automate database administration using SQL Server Management Objects (SMO).",
      "Script automated daily backup verification, integrity checks (DBCC CHECKDB), and index defragmentation.",
      "Integrate database deployment pipelines into GitHub Actions CI/CD workflows.",
      "Use Python pyodbc/sqlalchemy to drive automated cross-database testing and assertion validation."
    ],
    description: "Automate routine DBA operations using PowerShell SMO and Python. Replace manual SSMS clicks with idempotent scripts that generate DDL, monitor file growth, and automate release validation.",
    sampleSql: `-- Database platform health & automation status telemetry
SELECT 
    'Database Maintenance' AS Service,
    'ONLINE' AS ServiceStatus,
    'Weekly Index Rebuild (Fragmentation > 30%)' AS ConfiguredTask,
    'GitHub Actions CI Pipeline' AS DeploymentOrchestration;`,
    repoPath: "automation/deploy_platform.ps1",
    challengeId: null,
    erdEntity: "Database",
    attachments: [
      { id: "att-ch4-5", name: "PowerShell SMO Deployment Script", type: "SCRIPT", path: "automation/deploy_platform.ps1" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/course/view.php?id=2305",
    microsoftDocTitle: "SQL Server Management Objects (SMO)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/server-management-objects-smo/overview-smo"
  },

  // ==========================================================
  // CHAPTER 5: REPORTING & DIMENSIONAL WAREHOUSING
  // ==========================================================
  {
    id: "ch05-vid01",
    chapter: 5,
    chapterTitle: "Chapter 5: Warehousing & BI",
    videoCode: "CH05_VID01",
    title: "OLTP (3NF) vs OLAP (Dimensional) Architectural Paradigms",
    duration: "22 mins",
    level: "Foundational",
    skillsConnected: ["OLTP vs OLAP", "Dimensional Modeling", "Read Optimization", "Write Optimization"],
    objectives: [
      "Compare write-optimized normalized 3NF schemas against read-optimized dimensional schemas.",
      "Contrast ACID transaction workloads with analytical aggregation and slicing queries.",
      "Understand why running multi-table reporting joins on transactional OLTP databases causes lock contention.",
      "Architect staging and ETL/ELT pipelines to extract, transform, and load transactional facts into warehouses."
    ],
    description: "The fundamental divide in data engineering: Transactional Systems vs Analytical Warehouses. Understand why operational systems must remain normalized to eliminate write anomalies, while BI systems require denormalization to deliver instant aggregation.",
    sampleSql: `-- Comparison query: OLTP Normalized Query vs OLAP Aggregated Metric
SELECT 
    'OLAP Star Aggregation' AS Paradigm,
    p.Category,
    c.Country,
    SUM(f.TotalAmount) AS TotalRevenue,
    SUM(f.Quantity) AS UnitsSold
FROM FactSales f
JOIN DimProduct p ON f.ProductKey = p.ProductKey
JOIN DimCustomer c ON f.CustomerKey = c.CustomerKey
GROUP BY p.Category, c.Country;`,
    repoPath: "sql/warehouse/01_star_schema.sql",
    challengeId: "ch-5",
    erdEntity: "FactSales",
    attachments: [
      { id: "att-ch5-1", name: "Kimball Star Schema DDL", type: "SQL", path: "sql/warehouse/01_star_schema.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/course/view.php?id=2305",
    microsoftDocTitle: "Relational vs Dimensional Analytics",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/azure/architecture/data-guide/relational-data/etl"
  },
  {
    id: "ch05-vid02",
    chapter: 5,
    chapterTitle: "Chapter 5: Warehousing & BI",
    videoCode: "CH05_VID02",
    title: "Kimball Star Schema Modeling (Fact Tables, Conformed Dimensions & Surrogate Keys)",
    duration: "30 mins",
    level: "Intermediate",
    skillsConnected: ["Kimball Methodology", "Star Schema", "Surrogate Keys", "Fact Grain"],
    objectives: [
      "Design central Fact tables with additive numeric measures (Quantity, UnitPrice, DiscountAmount, TotalAmount).",
      "Construct conformed Dimension tables (DimCustomer, DimProduct, DimDate, DimTerritory).",
      "Why Surrogate Keys (INTEGER IDENTITY) are mandatory instead of natural operational keys.",
      "Define the atomic grain of fact records to avoid fan-out join traps."
    ],
    description: "Master the Ralph Kimball dimensional modeling methodology. Learn to define the atomic grain, establish conformed dimensions for enterprise consistency, and design fact tables with surrogate integer keys for high-performance hash joins.",
    sampleSql: `-- Kimball Star Schema slice-and-dice query
SELECT 
    d.CalendarYear,
    d.FiscalQuarter,
    p.ProductName,
    p.Category,
    SUM(f.TotalAmount) AS Revenue
FROM FactSales f
JOIN DimDate d ON f.DateKey = d.DateKey
JOIN DimProduct p ON f.ProductKey = p.ProductKey
GROUP BY d.CalendarYear, d.FiscalQuarter, p.ProductName, p.Category
ORDER BY Revenue DESC;`,
    repoPath: "sql/warehouse/01_star_schema.sql",
    challengeId: "ch-5",
    erdEntity: "DimProduct",
    attachments: [
      { id: "att-ch5-2", name: "Kimball Star Schema DDL Script", type: "SQL", path: "sql/warehouse/01_star_schema.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/course/view.php?id=2305",
    microsoftDocTitle: "Data Warehouse Table Design Guidance",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/azure/synapse-analytics/sql-data-warehouse/design-guidance-for-replicated-tables"
  },
  {
    id: "ch05-vid03",
    chapter: 5,
    chapterTitle: "Chapter 5: Warehousing & BI",
    videoCode: "CH05_VID03",
    title: "Slowly Changing Dimensions (SCD Type 1 Overwrites vs SCD Type 2 History)",
    duration: "29 mins",
    level: "Advanced",
    skillsConnected: ["SCD Type 2", "Historical Lineage", "Effective Dating", "Point-in-Time BI"],
    objectives: [
      "Compare SCD Type 1 (in-place overwrite) with SCD Type 2 (historical versioning).",
      "Model historical validity columns: EffectiveStartDate, EffectiveEndDate, and IsCurrent flag.",
      "Guarantee that historical sales facts remain bound to the dimension state at the time of purchase.",
      "Implement idempotent MERGE statements to expire old records and insert current versions."
    ],
    description: "Managing evolving customer and entity state across time. Eng. Rami breaks down Slowly Changing Dimensions, demonstrating why overwriting customer addresses breaks historical regional sales reports, and how SCD Type 2 preserves complete corporate lineage.",
    sampleSql: `-- Query active vs historical customer records in SCD Type 2 dimension
SELECT 
    CustomerKey,
    CustomerCode,
    CustomerName,
    City,
    State,
    Country,
    EffectiveStartDate,
    COALESCE(EffectiveEndDate, 'Present') AS EffectiveEndDate,
    CASE WHEN IsCurrent = 1 THEN 'Active Current Record' ELSE 'Historical Version' END AS VersionStatus
FROM DimCustomer
ORDER BY CustomerCode, EffectiveStartDate;`,
    repoPath: "sql/warehouse/02_scd_type2_customer.sql",
    challengeId: "ch-5",
    erdEntity: "DimCustomer",
    attachments: [
      { id: "att-ch5-3", name: "SCD Type 2 Implementation Script", type: "SQL", path: "sql/warehouse/02_scd_type2_customer.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/course/view.php?id=2305",
    microsoftDocTitle: "Temporal Tables & Historical Versioning",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/tables/temporal-tables"
  },
  {
    id: "ch05-vid04",
    chapter: 5,
    chapterTitle: "Chapter 5: Warehousing & BI",
    videoCode: "CH05_VID04",
    title: "Operational & Analytical Reporting with SSRS Matrix Reports (.rdl)",
    duration: "25 mins",
    level: "Intermediate",
    skillsConnected: ["SSRS Reporting", "RDL Definition", "Tablix Matrix", "Parameterized Datasets"],
    objectives: [
      "Understand SQL Server Reporting Services (SSRS) report architecture and RDL XML definition.",
      "Build Tablix matrix reports featuring dynamic row and column groupings.",
      "Configure parameterized datasets to offload filtering to SQL Server rather than reporting memory.",
      "Implement drill-down hierarchies and conditional formatting expressions."
    ],
    description: "Deliver analytical insights to business stakeholders. Learn to structure clean reporting datasets, configure SSRS Tablix matrix grids with subtotal rollups, and integrate parameterized queries for fast rendering.",
    sampleSql: `-- Matrix reporting dataset: Sales by Customer Tier and Product Category
SELECT 
    c.CustomerName,
    c.Country,
    p.Category AS ProductCategory,
    SUM(f.Quantity) AS TotalUnits,
    ROUND(SUM(f.TotalAmount), 2) AS TotalSpent
FROM FactSales f
JOIN DimCustomer c ON f.CustomerKey = c.CustomerKey
JOIN DimProduct p ON f.ProductKey = p.ProductKey
GROUP BY c.CustomerName, c.Country, p.Category
ORDER BY TotalSpent DESC;`,
    repoPath: "sql/warehouse/01_star_schema.sql",
    challengeId: "ch-5",
    erdEntity: "FactSales",
    attachments: [
      { id: "att-ch5-4", name: "SSRS Reporting Datasets Guide", type: "DOC", path: "docs/CH01_CASE_STUDY_IMPLEMENTATION.md" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/course/view.php?id=2305",
    microsoftDocTitle: "SQL Server Reporting Services (SSRS)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/reporting-services/create-deploy-and-manage-mobile-and-paginated-reports"
  }
];
