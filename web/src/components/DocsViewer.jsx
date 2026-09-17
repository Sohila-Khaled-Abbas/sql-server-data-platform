import React from 'react';
import { marked } from 'marked';
import { BookOpen, FileText, ArrowLeft } from 'lucide-react';

const DOCS_DATA = {
  'docs-case-study': {
    title: 'Chapter 1 Case Study: Company ERD & Implementation',
    category: 'Relational Design',
    markdown: `# Chapter 1 Case Study: Company ERD & Relational Implementation

A comprehensive architectural breakdown of the **Company Enterprise Case Study** introduced in **MaharaTech Course 2305: Implementing and Developing SQL Server Objects** (*CH01_VID02* through *CH01_VID05* by Eng. Rami Mohamed Abonagi).

---

## 1. Conceptual Chen-Notation ERD
* **Emp (Employee)**: Key \`SSN\`, composite name (\`F\`, \`M\`, \`L\`), birth date \`BD\`, \`gender\`, and recursive \`supervise\` (1:N).
* **Dept (Department)**: Key \`DNum\`, candidate key \`DName\`, multi-valued attribute \`loc\` (\`DeptLocations\`).
* **project (Project)**: Key \`PNum\`, \`PName\`, \`City\`, controlled by \`Dept\`.
* **work (Works_On)**: Binary M:N relationship with attribute \`hours\`.
* **Dependent**: Weak entity with partial key \`Dname\` and identifying relationship \`have\` with \`Emp\`.
* **Manage**: Binary 1:1 relationship with attribute \`hiredate\`.

---

## 2. Relational Mapping Rules (3NF/BCNF)
1. **Regular Entities**: \`Employee\`, \`Department\`, \`Project\` become base tables on \`DATA_FG\`.
2. **Weak Entities**: \`Dependent\` receives composite PK \`(ESSN, DependentName)\` with \`ON DELETE CASCADE\`.
3. **Multi-Valued Attributes**: \`Dept.loc\` becomes \`DeptLocations\` with composite PK \`(DNum, Location)\`.
4. **M:N Relationships**: \`Works_On\` becomes associative table with composite PK \`(ESSN, PNo)\` and \`Hours DECIMAL(5,2)\`.
5. **Circular Dependency Resolution**: Base tables are created first; foreign keys \`FK_Employee_Department_Dno\` and \`FK_Department_Employee_MgrSSN\` are attached via \`ALTER TABLE\` to prevent circular compilation errors.

---

## 3. Production T-SQL Implementation
All tables, constraints, and benchmark seed data are implemented in \`src/01_storage_and_schema/05_company_case_study_schema.sql\`.
`
  },

  'docs-perf': {
    title: 'SQL Server Performance Tuning & Query Optimization',
    category: 'Engine Internals',
    markdown: `# SQL Server Performance Tuning & Query Optimization Handbook

An advanced practical guide to query execution internals, indexing mechanics, and database engine diagnostics for the **OmniFlow Data Platform**.

---

## 1. Query Optimizer Pipeline
When a T-SQL query is submitted, it transitions through:
1. **Parsing & Lexing**: Syntax check and parse tree generation.
2. **Algebrization / Binding**: Resolves object names, column references, and data types.
3. **Simplification**: Constant folding, contradiction removal (\`WHERE 1=0\`).
4. **Stage 0 (Transaction Processing)**: Heuristic plan search.
5. **Stage 1 (Quick Search)**: Join reordering and subquery unfolding.
6. **Stage 2 (Full Optimization)**: Parallelism exploration (MAXDOP) and aggregation reordering.

---

## 2. Join Algorithms Comparison
* **Nested Loops Join**: Optimal when outer set is small (< 1,000 rows) and inner set has an index seek. Zero memory grant required.
* **Merge Join**: Ultra-fast single-pass join when both inputs are pre-sorted on join keys.
* **Hash Match Join**: Best for massive un-indexed sets (Data Warehouse ETL). Requires substantial RAM to build in-memory hash table; risks TempDB spill on memory miscalculation.

---

## 3. Key Lookups vs Covering Indexes
A **Key Lookup** occurs when a non-clustered index satisfies the \`WHERE\` filter but is missing requested columns, forcing random reads into the clustered index.
* **Solution**: Create a **Covering Index** using the \`INCLUDE\` clause:
\`\`\`sql
CREATE NONCLUSTERED INDEX IX_Orders_Customer_Covering
ON Sales.Orders (CustomerId)
INCLUDE (OrderDate, TotalAmount);
\`\`\`
`
  },

  'docs-dr': {
    title: 'High Availability & Disaster Recovery Runbook',
    category: 'DBRE Operations',
    markdown: `# SQL Server High Availability & Disaster Recovery Runbook

Operational incident response manual and disaster recovery (DR) procedures for the **OmniFlow Data Platform**.

---

## 1. Business Continuity Targets: RTO & RPO
* **Recovery Point Objective (RPO)**: **15 Minutes**. Guaranteed via automated Transaction Log backups scheduled every 15 minutes.
* **Recovery Time Objective (RTO)**: **45 Minutes**. Guaranteed via multi-filegroup piecemeal restore strategies and automated failovers.

---

## 2. Emergency Tail-Log Backup
Before restoring any database whose data files are corrupted, you **must** back up the active transaction log to capture transactions executed after the last scheduled backup:
\`\`\`sql
BACKUP LOG OmniFlowDB
TO DISK = 'D:\\...\\OmniFlowDB_TailLog.trn'
WITH NO_TRUNCATE, CONTINUE_AFTER_ERROR, INIT;
\`\`\`

---

## 3. Point-in-Time Recovery (\`STOPAT\`)
Restore to exact millisecond before human error:
\`\`\`sql
RESTORE LOG OmniFlowDB
FROM DISK = 'D:\\...\\OmniFlowDB_TailLog.trn'
WITH STOPAT = '2026-09-17 14:32:09.999', RECOVERY;
\`\`\`
`
  },

  'docs-learning': {
    title: 'Learning Guidance & DBRE Handbook',
    category: 'Curriculum Guide',
    markdown: `# Enterprise SQL Server Engineering: Learning Guidance & Deep-Dive Handbook

A comprehensive companion guide to the **MaharaTech: Implementing and Developing SQL Server Objects** course.

---

## 1. Physical Storage Architecture
* **8 KB Pages**: The fundamental unit of disk IO.
* **64 KB Extents**: 8 contiguous pages.
* **PFS / GAM / SGAM**: Allocation bitmaps managing page fullness and extent allocation.

---

## 2. ACID Concurrency & Error Handling
* \`SET XACT_ABORT ON\`: Guarantees instant abort on runtime error.
* \`OUTPUT inserted.*, deleted.*\`: Captures changed rows without additional table reads.
* Non-blocking triggers write directly to audit tables in a single set-based pass.
`
  },

  'docs-syllabus': {
    title: 'MaharaTech Course Syllabus to DBRE Architecture Mapping',
    category: 'Curriculum Guide',
    markdown: `# MaharaTech Course Syllabus to Enterprise DBRE Architecture Mapping

Direct alignment between **MaharaTech Course 2305: Implementing and Developing SQL Server Objects** (ITI) and the **OmniFlow Data Platform**.

---

## Curriculum Competency Progression
* **CH01**: Filegroups, secondary files, integrity constraints, and Peter Chen Company ERD.
* **CH02**: Flow of control, transactions, ACID properties, Scalar vs MSTVF vs Inline TVFs.
* **CH03**: Horizontal partitioning, sliding-window partition switching, TVPs, and Log Shipping.
* **CH04**: Transactional ETL procs, CDC triggers, DDL security triggers, CLR, and SMO.
* **CH05**: Kimball star schema modeling, Slowly Changing Dimensions (SCD 1 & 2), and SSRS.
`
  }
};

export default function DocsViewer({ docKey, onBack }) {
  const doc = DOCS_DATA[docKey] || DOCS_DATA['docs-case-study'];

  let htmlContent = '';
  try {
    htmlContent = marked.parse(doc.markdown);
  } catch {
    htmlContent = `<pre>${doc.markdown}</pre>`;
  }

  return (
    <div className="docs-viewer-hub">
      <div className="docs-viewer-header">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="back-btn" title="Back to Roadmap">
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <span className="ms-badge">{doc.category}</span>
            <h1>{doc.title}</h1>
          </div>
        </div>
      </div>

      <div className="docs-viewer-body markdown-body" dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}
