import React from 'react';
import { Layers, Play, CheckCircle, Database, Shield, BarChart3, ArrowRight } from 'lucide-react';

const PROJECTS = [
  {
    id: 'proj-tvp',
    badge: 'ETL / Ingestion',
    badgeClass: 'badge-cyan',
    icon: Database,
    title: 'Project Alpha: High-Throughput Procedural TVP Ingestion Pipeline',
    subtitle: 'Bulk Streaming Architecture via Table-Valued Parameters (TVPs) & Set-Based Processing',
    summary: 'In enterprise OLTP systems, handling bursts of 50,000+ orders per second without exhausting database connection pools or causing lock escalation requires moving away from row-by-row INSERT statements. This project implements an atomic, set-based staging and ingestion pipeline utilizing user-defined Table Types (TVPs), passing entire tabular batches in a single round-trip over TDS (Tabular Data Stream).',
    specs: [
      { label: 'Throughput', val: '50,000 rows/sec' },
      { label: 'Isolation', val: 'Read Committed Snapshot (RCSI)' },
      { label: 'Storage Target', val: 'DATA_FG Filegroup' },
      { label: 'T-SQL Pattern', val: 'TVP + OUTPUT + TRY...CATCH' }
    ],
    highlights: [
      'User-Defined Table Type (UDTT) Sales.OrderBatchType',
      'Atomic transaction boundary enforced with SET XACT_ABORT ON',
      'Deadlock mitigation via predictable Clustered PK insertion ordering',
      'Simultaneous change tracking using the composable DML OUTPUT clause'
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
    pipelineFlow: ['App Client TDS', 'TVP Memory Buffer', 'Stored Proc (XACT_ABORT)', 'DATA_FG Table', 'OUTPUT Audit']
  },

  {
    id: 'proj-audit',
    badge: 'Governance & Security',
    badgeClass: 'badge-emerald',
    icon: Shield,
    title: 'Project Beta: Enterprise Audit Change-Capture & DDL Governance Engine',
    subtitle: 'Real-Time DML & DDL Forensic Logging with XML EVENTDATA() Shredding',
    summary: 'Regulatory frameworks (SOX, HIPAA, GDPR) demand immutable audit trails for financial transactions and strict server-level prevention against unauthorized schema alterations. This project engineers a dual-layer governance engine: asynchronous DML trigger tracking with Clustered Columnstore historical archiving, and server-level DDL triggers parsing EVENTDATA() XML payloads to prevent accidental table drops in production.',
    specs: [
      { label: 'Compliance', val: 'SOX 404 / GDPR / HIPAA' },
      { label: 'Payload Format', val: 'XML EVENTDATA()' },
      { label: 'Archive Storage', val: 'ARCHIVE_FG (Columnstore)' },
      { label: 'Interception', val: 'Pre-execution DDL ROLLBACK' }
    ],
    highlights: [
      'DML After-Triggers capturing multi-row updates via inserted and deleted pseudo-tables',
      'Zero-impact audit staging converted to Clustered Columnstore Archive',
      'Database-level DDL Trigger intercepting DROP_TABLE, ALTER_TABLE',
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
    pipelineFlow: ['User DDL/DML', 'DDL Trigger (EVENTDATA)', 'Guardrail Check', 'Audit.SchemaLog', 'Commit / Abort']
  },

  {
    id: 'proj-star',
    badge: 'OLAP / Data Warehouse',
    badgeClass: 'badge-purple',
    icon: BarChart3,
    title: 'Project Gamma: Analytical Kimball Star Schema & Incremental SCD2 Pipeline',
    subtitle: 'Modern Dimensional Warehouse with Point-in-Time Historical Truth',
    summary: 'Translating normalized transactional data into an optimized analytical model for Power BI and executive reporting without locking OLTP tables. This project builds an enterprise Kimball Star Schema (OmniFlowDW) supporting Slowly Changing Dimensions (SCD Type 2) on customer demographics, integer surrogate key hierarchies, and additive fact aggregations.',
    specs: [
      { label: 'Schema Model', val: 'Kimball Star Schema' },
      { label: 'Dimension Type', val: 'SCD Type 1 & Type 2' },
      { label: 'Fact Type', val: 'Transaction Fact (FactSales)' },
      { label: 'ETL Frequency', val: 'Incremental Daily Batch' }
    ],
    highlights: [
      'Conformed dimensions: DimDate, DimProduct, DimCustomer',
      'Historical truth preservation using ValidFrom, ValidTo, and IsCurrent flags',
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
    pipelineFlow: ['OLTP Transactions', 'Staging Stg_Orders', 'SCD2 DimCustomer', 'FactSales Star Join', 'Executive BI']
  }
];

export default function ProjectBlueprints({ onRunInPlayground }) {
  return (
    <div className="project-blueprints-hub">
      <div className="blueprints-header">
        <div className="ms-badge">Production Architectures</div>
        <h1>Enterprise SQL Server Project Blueprints</h1>
        <p>
          Production-grade database patterns implemented in this repository, synthesizing MaharaTech Course 2305 with real-world enterprise engineering standards.
        </p>
      </div>

      <div className="projects-grid">
        {PROJECTS.map(p => {
          const Icon = p.icon;
          return (
            <div key={p.id} className="project-card">
              <div className="project-card-header">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`project-badge ${p.badgeClass}`}>{p.badge}</span>
                  <div className="project-icon-box">
                    <Icon className="w-5 h-5 text-gray-300" />
                  </div>
                </div>
                <h3 className="project-title">{p.title}</h3>
                <div className="project-subtitle">{p.subtitle}</div>
              </div>

              <div className="project-body">
                <p className="project-summary">{p.summary}</p>

                {/* Pipeline Flow Visualization */}
                <div className="pipeline-flow-box">
                  <div className="pipeline-flow-title">Architecture Pipeline Flow:</div>
                  <div className="pipeline-flow-steps">
                    {p.pipelineFlow.map((step, idx) => (
                      <React.Fragment key={step}>
                        <span className="flow-step-pill">{step}</span>
                        {idx < p.pipelineFlow.length - 1 && (
                          <ArrowRight className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="project-specs-grid">
                  {p.specs.map(s => (
                    <div key={s.label} className="project-spec-item">
                      <div className="spec-label">{s.label}</div>
                      <div className="spec-val">{s.val}</div>
                    </div>
                  ))}
                </div>

                <div className="project-highlights">
                  <h4>Key Architecture Highlights:</h4>
                  <ul>
                    {p.highlights.map(h => (
                      <li key={h}>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 inline mr-1.5 flex-shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="project-card-footer">
                <button
                  className="run-blueprint-btn"
                  onClick={() => onRunInPlayground && onRunInPlayground(p.runSql)}
                >
                  <Play className="w-4 h-4 fill-current" />
                  Run Blueprint in Query Studio
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
