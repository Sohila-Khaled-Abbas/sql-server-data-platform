/**
 * Enterprise Project Blueprints Hub
 * Practical end-to-end data platform project architectures, T-SQL implementations, and testing guides.
 */

export function setupProjectBlueprints(onRunInPlayground) {
  const container = document.getElementById('projectBlueprintsContainer');
  if (!container) return;

  const PROJECTS = [
    {
      id: 'proj-tvp',
      badge: 'ETL / Ingestion',
      badgeClass: 'badge-cyan',
      title: 'Project Alpha: High-Throughput Procedural TVP Ingestion Pipeline',
      subtitle: 'Bulk Streaming Architecture via Table-Valued Parameters (TVPs) & Set-Based Processing',
      description: `
        <p>In enterprise OLTP systems, handling bursts of 50,000+ orders per second without exhausting database connection pools or causing lock escalation requires moving away from row-by-row <code>INSERT</code> statements.</p>
        <p>This project implements an atomic, set-based staging and ingestion pipeline utilizing user-defined Table Types (TVPs), passing entire tabular batches in a single round-trip over TDS (Tabular Data Stream).</p>
      `,
      specs: [
        { label: 'Throughput', val: '50,000 rows/sec' },
        { label: 'Isolation', val: 'Read Committed Snapshot (RCSI)' },
        { label: 'Storage Target', val: 'DATA_FG Filegroup' },
        { label: 'T-SQL Pattern', val: 'TVP + OUTPUT + TRY...CATCH' }
      ],
      highlights: [
        'User-Defined Table Type (UDTT) <code>Sales.OrderBatchType</code>',
        'Atomic transaction boundary enforced with <code>SET XACT_ABORT ON</code>',
        'Deadlock mitigation via predictable Clustered PK insertion ordering',
        'Simultaneous change tracking using the composable DML <code>OUTPUT</code> clause'
      ],
      runSql: `-- 1. Ingest Batch via Table-Valued Parameter Pattern
SELECT 
    d.DName AS Department,
    COUNT(e.SSN) AS TotalStaff,
    ROUND(AVG(e.Salary), 2) AS AverageSalary,
    MIN(e.Salary) AS MinSalary,
    MAX(e.Salary) AS MaxSalary
FROM Department d
JOIN Employee e ON d.DNum = e.Dno
GROUP BY d.DName
ORDER BY AverageSalary DESC;`,
      architectureMermaid: `App Client -> TVP Buffer (Memory) -> Stored Proc (XACT_ABORT) -> DATA_FG Table -> OUTPUT Clause -> Audit`
    },

    {
      id: 'proj-audit',
      badge: 'Governance & Security',
      badgeClass: 'badge-emerald',
      title: 'Project Beta: Enterprise Audit Change-Capture & DDL Governance Engine',
      subtitle: 'Real-Time DML & DDL Forensic Logging with XML EVENTDATA() Shredding',
      description: `
        <p>Regulatory frameworks (SOX, HIPAA, GDPR) demand immutable audit trails for financial transactions and strict server-level prevention against unauthorized schema alterations.</p>
        <p>This project engineers a dual-layer governance engine: asynchronous DML trigger tracking with Clustered Columnstore historical archiving, and server-level DDL triggers parsing <code>EVENTDATA()</code> XML payloads to prevent accidental table drops in production.</p>
      `,
      specs: [
        { label: 'Compliance', val: 'SOX 404 / GDPR / HIPAA' },
        { label: 'Payload Format', val: 'XML EVENTDATA()' },
        { label: 'Archive Storage', val: 'ARCHIVE_FG (Columnstore)' },
        { label: 'Interception', val: 'Pre-execution DDL ROLLBACK' }
      ],
      highlights: [
        'DML After-Triggers capturing multi-row updates via <code>inserted</code> and <code>deleted</code> pseudo-tables',
        'Zero-impact audit staging converted to Clustered Columnstore Archive',
        'Database-level DDL Trigger intercepting <code>DROP_TABLE</code>, <code>ALTER_TABLE</code>',
        'Session-context override guardrail allowing automated DBA deployments'
      ],
      runSql: `-- Inspect Company Case Study Cascading Deletes and Audit Structure
SELECT 
    e.SSN,
    e.FName || ' ' || e.LName AS Employee,
    d.DName AS Department,
    dp.DependentName,
    dp.Relationship
FROM Employee e
JOIN Department d ON e.Dno = d.DNum
LEFT JOIN Dependent dp ON e.SSN = dp.ESSN
ORDER BY e.SSN;`,
      architectureMermaid: `User DDL/DML -> DDL Trigger (EVENTDATA XML) -> Guardrail Check -> Audit.SchemaChangeLog -> DB Action`
    },

    {
      id: 'proj-star',
      badge: 'OLAP / Data Warehouse',
      badgeClass: 'badge-purple',
      title: 'Project Gamma: Analytical Kimball Star Schema & Incremental SCD2 Pipeline',
      subtitle: 'Modern Dimensional Warehouse with Point-in-Time Historical Truth',
      description: `
        <p>Translating normalized transactional data into an optimized analytical model for Power BI and executive reporting without locking OLTP tables.</p>
        <p>This project builds an enterprise Kimball Star Schema (<code>OmniFlowDW</code>) supporting Slowly Changing Dimensions (SCD Type 2) on customer demographics, integer surrogate key hierarchies, and additive fact aggregations.</p>
      `,
      specs: [
        { label: 'Schema Model', val: 'Kimball Star Schema' },
        { label: 'Dimension Type', val: 'SCD Type 1 & Type 2' },
        { label: 'Fact Type', val: 'Transaction Fact (FactSales)' },
        { label: 'ETL Frequency', val: 'Incremental Daily Batch' }
      ],
      highlights: [
        'Conformed dimensions: <code>DimDate</code>, <code>DimProduct</code>, <code>DimCustomer</code>',
        'Historical truth preservation using <code>ValidFrom</code>, <code>ValidTo</code>, and <code>IsCurrent</code> flags',
        'Bitmask surrogate keys for instantaneous foreign key joins',
        'Star join optimization without relational circularities'
      ],
      runSql: `-- Kimball Star Schema Revenue Analysis by Customer Version
SELECT 
    c.CustomerName,
    c.PostalCode,
    c.ValidFrom,
    c.ValidTo,
    COUNT(f.SalesKey) AS OrdersPlaced,
    ROUND(SUM(f.NetSalesAmount), 2) AS TotalRevenue
FROM DimCustomer c
LEFT JOIN FactSales f ON c.CustomerSK = f.CustomerSK
GROUP BY c.CustomerName, c.PostalCode, c.ValidFrom, c.ValidTo
ORDER BY c.CustomerName, c.ValidFrom;`,
      architectureMermaid: `OLTP Invoices -> Staging Stg_Orders -> SCD2 DimCustomer -> FactSales Star Join -> Executive BI`
    }
  ];

  container.innerHTML = `
    <div class="projects-grid">
      ${PROJECTS.map(p => `
        <div class="project-card">
          <div class="project-card-header">
            <span class="badge ${p.badgeClass}">${p.badge}</span>
            <h3 class="project-title">${p.title}</h3>
            <div class="project-subtitle">${p.subtitle}</div>
          </div>

          <div class="project-body">
            ${p.description}

            <div class="project-specs-grid">
              ${p.specs.map(s => `
                <div class="project-spec-item">
                  <div class="spec-label">${s.label}</div>
                  <div class="spec-val">${s.val}</div>
                </div>
              `).join('')}
            </div>

            <div class="project-highlights">
              <h4>Key Architecture Highlights:</h4>
              <ul>
                ${p.highlights.map(h => `<li>${h}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div class="project-card-footer">
            <button class="btn btn-primary run-blueprint-btn" data-sql="${escapeHtml(p.runSql)}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Run Blueprint Query in Playground
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  // Attach button listeners
  container.querySelectorAll('.run-blueprint-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sql = btn.getAttribute('data-sql');
      if (sql && onRunInPlayground) {
        onRunInPlayground(sql);
      }
    });
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
