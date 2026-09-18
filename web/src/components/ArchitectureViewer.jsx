import React, { useState } from 'react';
import { 
  Building, 
  Layers, 
  ArrowRight, 
  Database, 
  Cpu, 
  Zap, 
  HardDrive, 
  BarChart3, 
  Code, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';
import mssqlLogo from '../assets/mssql-logo.svg';

const ARCHITECTURE_LAYERS = [
  {
    id: 'oltp',
    number: '01',
    name: 'OLTP Relational Layer',
    subtitle: 'High-Concurrency Normalized Transaction Engine',
    database: 'Company Database',
    icon: Building,
    color: '#38bdf8',
    borderColor: 'rgba(56, 189, 248, 0.3)',
    bgColor: 'rgba(56, 189, 248, 0.05)',
    techStack: ['3NF Normalization', 'RCSI Snapshot Isolation', '8 KB Data Pages', 'Circular FK Resolution'],
    description: 'High-throughput operational database designed for zero-redundancy transaction processing with row-level locking, ACID boundary enforcement, and instant checkpointing.',
    components: [
      {
        name: 'Normalized Schema',
        detail: '3NF schema with Peter Chen ERD mapping. Strict referential integrity between Employee, Department, and Project.',
        file: 'src/01_storage_and_schema/05_company_case_study_schema.sql'
      },
      {
        name: 'Concurrency Control',
        detail: 'Read Committed Snapshot Isolation (RCSI) eliminates shared-lock read blocking while preventing dirty reads.',
        file: 'src/01_storage_and_schema/03_integrity_constraints.sql'
      },
      {
        name: 'Audit Change Capture',
        detail: 'DML triggers intercepting inserted/deleted pseudo-tables for asynchronous compliance auditing.',
        file: 'src/04_governance_and_audit/01_audit_change_capture_triggers.sql'
      }
    ],
    sampleQuery: `-- Inspect Company OLTP Schema & Employee Hierarchy
SELECT 
    e.EmpId,
    e.FirstName + ' ' + e.LastName AS FullName,
    d.DeptName,
    m.FirstName + ' ' + m.LastName AS ManagerName
FROM Employee e
LEFT JOIN Department d ON e.DeptId = d.DeptId
LEFT JOIN Employee m ON e.ManagerId = m.EmpId;`
  },
  {
    id: 'ingestion',
    number: '02',
    name: 'ELT & Batch Ingestion Pipeline',
    subtitle: 'Zero-RBAR High-Speed Streaming Ingestion',
    database: 'Staging & Pipeline Buffers',
    icon: Zap,
    color: '#a855f7',
    borderColor: 'rgba(168, 85, 247, 0.3)',
    bgColor: 'rgba(168, 85, 247, 0.05)',
    techStack: ['Table-Valued Parameters (TVPs)', 'XML Shredding (.nodes)', 'Memory-Optimized Tables', 'Batch Processing'],
    description: 'Ultra-low-latency ingestion layer capable of streaming 20,000+ rows/second into SQL Server without network roundtrip penalties or cursor RBAR overhead.',
    components: [
      {
        name: 'TVP Bulk Loader',
        detail: 'Strongly-typed user-defined table types enabling client applications to pass multi-row arrays in a single RPC roundtrip.',
        file: 'src/03_programmability_and_elt/01_tvps_and_bulk_ingestion.sql'
      },
      {
        name: 'Hierarchical XML Shredder',
        detail: 'High-performance XQuery .nodes() and .value() parsing shredding nested B2B XML invoices into normalized relational tables.',
        file: 'src/03_programmability_and_elt/02_xml_shredding_and_generation.sql'
      },
      {
        name: 'Defensive Stored Procedures',
        detail: 'Idempotent ELT orchestrators with TRY...CATCH error handling and XACT_ABORT transaction state safety.',
        file: 'src/03_programmability_and_elt/03_stored_procedures_etl.sql'
      }
    ],
    sampleQuery: `-- Test Batch Ingestion with Table-Valued Parameters
DECLARE @Batch IngestionBatchType;
INSERT INTO @Batch (BatchId, Payload, IngestedAt)
VALUES (1, 'Telemetry Event A', CURRENT_TIMESTAMP),
       (2, 'Telemetry Event B', CURRENT_TIMESTAMP);
SELECT * FROM @Batch;`
  },
  {
    id: 'storage',
    number: '03',
    name: 'Storage & Partitioning Fabric',
    subtitle: 'Multi-Filegroup & Sliding Window Partitioning',
    database: 'Physical Storage Subsystem',
    icon: HardDrive,
    color: '#10b981',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    bgColor: 'rgba(16, 185, 129, 0.05)',
    techStack: ['Sliding Window SWITCH', 'Secondary Filegroups', 'Aligned Partition Indexes', 'Database Snapshots'],
    description: 'Physical enterprise storage geometry partitioning billions of historical records across isolated NTFS volumes with instantaneous sub-second partition switching.',
    components: [
      {
        name: 'Horizontal Partition Schemes',
        detail: 'Monthly date-range partition functions mapping data to distinct filegroups for isolated I/O throughput.',
        file: 'src/01_storage_and_schema/04_partitioning_scheme.sql'
      },
      {
        name: 'Sliding Window SWITCH',
        detail: 'Metadata-only partition switching: instant archive swap from staging table to target partitioned fact table without physical data movement.',
        file: 'src/01_storage_and_schema/04_partitioning_scheme.sql'
      },
      {
        name: 'Copy-on-Write Snapshots',
        detail: 'Point-in-time NTFS sparse file snapshots protecting OLTP engines against catastrophic accidental updates.',
        file: 'src/06_reliability_and_dr/02_snapshot_lifecycle.sql'
      }
    ],
    sampleQuery: `-- Verify Partition Boundaries & Row Distribution
SELECT 
    $PARTITION.TransactionDateRangePF(TransactionDate) AS PartitionId,
    COUNT(*) AS TotalRowCount
FROM StagingTransactions
GROUP BY $PARTITION.TransactionDateRangePF(TransactionDate);`
  },
  {
    id: 'olap',
    number: '04',
    name: 'Kimball Dimensional Warehouse',
    subtitle: 'Star Schema OLAP & Slowly Changing Dimensions',
    database: 'OmniFlowDW Database',
    icon: Database,
    color: '#CC292B',
    borderColor: 'rgba(204, 41, 43, 0.3)',
    bgColor: 'rgba(204, 41, 43, 0.05)',
    techStack: ['Conformed Dimensions', 'Fact Grain Modeling', 'SCD Type 2 History', 'Columnstore Vectorization'],
    description: 'Production Kimball dimensional warehouse storing atomic fact transactions surrounded by conformed dimensions with temporal historical tracking (SCD Type 2).',
    components: [
      {
        name: 'Star Schema Architecture',
        detail: 'FactSales surrounded by DimDate, DimCustomer, DimProduct, and DimStore. Pure integer surrogate keys.',
        file: 'src/07_warehousing_and_reporting/02_dimensional_star_schema.sql'
      },
      {
        name: 'SCD Type 2 Temporal Engine',
        detail: 'Historical versioning with ValidFrom, ValidTo, and IsCurrent flags for accurate point-in-time revenue attribution.',
        file: 'src/07_warehousing_and_reporting/03_etl_staging_to_dw.sql'
      },
      {
        name: 'Clustered Columnstore',
        detail: 'High-compression columnar storage optimized for aggregate analytics (SUM, AVG, COUNT) with SIMD vectorized batch mode.',
        file: 'src/07_warehousing_and_reporting/02_dimensional_star_schema.sql'
      }
    ],
    sampleQuery: `-- Analytics: Revenue by Product Category with Temporal Validity
SELECT 
    p.Category,
    d.CalendarYear,
    COUNT(f.FactId) AS TotalOrders,
    SUM(f.TotalAmount) AS TotalRevenue
FROM FactSales f
JOIN DimProduct p ON f.ProductKey = p.ProductKey
JOIN DimDate d ON f.DateKey = d.DateKey
WHERE p.IsCurrent = 1
GROUP BY p.Category, d.CalendarYear;`
  },
  {
    id: 'serving',
    number: '05',
    name: 'Serving & BI Intelligence Layer',
    subtitle: 'Paginated SSRS Matrix & Power BI Semantic Models',
    database: 'Enterprise Reporting Services',
    icon: BarChart3,
    color: '#f59e0b',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    bgColor: 'rgba(245, 158, 11, 0.05)',
    techStack: ['SSRS Matrix Reports (.rdl)', 'Power BI DirectQuery', 'Indexed Views', 'Diagnostic DMVs'],
    description: 'Corporate reporting and executive dashboards powered by pre-aggregated materialized indexed views and parameter-driven paginated SSRS matrix reports.',
    components: [
      {
        name: 'Paginated SSRS Reports',
        detail: 'Formatted matrix reports with drill-down hierarchies, multi-value parameters, and automated PDF/Excel distribution.',
        file: 'src/07_warehousing_and_reporting/02_dimensional_star_schema.sql'
      },
      {
        name: 'Materialized Indexed Views',
        detail: 'WITH SCHEMABINDING views with unique clustered index for instantaneous sub-millisecond aggregate retrieval.',
        file: 'src/02_indexing_and_performance/02_indexed_views.sql'
      },
      {
        name: 'DBRE Diagnostic DMVs',
        detail: 'Real-time telemetry queries monitoring sys.dm_exec_query_stats, index usage, and lock contention.',
        file: 'src/02_indexing_and_performance/03_execution_plan_analysis.sql'
      }
    ],
    sampleQuery: `-- DBRE Diagnostic: Top Wait Stats & Buffer Pool Distribution
SELECT 
    wait_type, 
    waiting_tasks_count, 
    wait_time_ms / 1000.0 AS wait_time_sec
FROM sys.dm_os_wait_stats
WHERE wait_time_ms > 1000
ORDER BY wait_time_ms DESC;`
  }
];

export default function ArchitectureViewer({ onSelectTab, onRunQueryInStudio }) {
  const [selectedLayer, setSelectedLayer] = useState(ARCHITECTURE_LAYERS[0]);

  const handleTestInStudio = (query) => {
    onSelectTab('playground');
    if (onRunQueryInStudio) {
      onRunQueryInStudio(query);
    }
  };

  return (
    <div className="architecture-viewer-container" style={{ maxWidth: '1300px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* 1. Header Banner */}
      <div className="card" style={{ marginBottom: '24px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src={mssqlLogo} 
              alt="MSSQL" 
              width="32" 
              height="32" 
              style={{ width: '32px', height: '32px', maxWidth: '32px', maxHeight: '32px', objectFit: 'contain', flexShrink: 0 }}
            />
            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                Enterprise SQL Server Data Platform Architecture
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0' }}>
                End-to-End System Design: OLTP Relational Store → TVP Streaming Ingestion → Sliding Window Partitioning → Kimball Star Schema → SSRS/BI
              </p>
            </div>
          </div>
          <span className="badge badge-mssql-red" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
            Production Topology
          </span>
        </div>

        {/* Pipeline Flow Stepper Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '20px' }}>
          {ARCHITECTURE_LAYERS.map((layer) => {
            const isSelected = selectedLayer.id === layer.id;
            const IconComponent = layer.icon;

            return (
              <div 
                key={layer.id}
                onClick={() => setSelectedLayer(layer)}
                style={{
                  background: isSelected ? layer.bgColor : 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${isSelected ? layer.color : 'rgba(255, 255, 255, 0.08)'}`,
                  borderRadius: '8px',
                  padding: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: layer.color, fontFamily: 'monospace' }}>
                    STAGE {layer.number}
                  </span>
                  <IconComponent size={16} style={{ color: layer.color }} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff' }}>
                  {layer.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  {layer.database}
                </div>
                {isSelected && (
                  <div style={{ 
                    position: 'absolute', 
                    bottom: '-1px', 
                    left: '20%', 
                    right: '20%', 
                    height: '2px', 
                    background: layer.color 
                  }}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Selected Layer Deep-Dive Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* Left Column: Specifications & Components */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ 
              background: selectedLayer.bgColor, 
              border: `1px solid ${selectedLayer.color}`, 
              color: selectedLayer.color, 
              padding: '2px 8px', 
              borderRadius: '4px', 
              fontSize: '0.75rem', 
              fontWeight: 800 
            }}>
              STAGE {selectedLayer.number}
            </span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: 0 }}>
              {selectedLayer.name}
            </h2>
          </div>

          <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '20px' }}>
            {selectedLayer.description}
          </p>

          {/* Tech Stack Chips */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', marginBottom: '8px' }}>
              Engine Competencies & Features:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {selectedLayer.techStack.map(tech => (
                <span 
                  key={tech} 
                  style={{ 
                    fontSize: '0.72rem', 
                    padding: '3px 8px', 
                    borderRadius: '9999px', 
                    background: 'rgba(255, 255, 255, 0.06)', 
                    color: '#e2e8f0', 
                    border: '1px solid rgba(255, 255, 255, 0.1)' 
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Key Architecture Components */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', marginBottom: '12px' }}>
              Core Infrastructure Modules:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedLayer.components.map(comp => (
                <div 
                  key={comp.name} 
                  style={{ 
                    background: 'rgba(0, 0, 0, 0.25)', 
                    border: '1px solid rgba(255, 255, 255, 0.06)', 
                    borderRadius: '6px', 
                    padding: '12px' 
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff' }}>
                      {comp.name}
                    </div>
                    <code style={{ fontSize: '0.68rem', color: selectedLayer.color, fontFamily: 'monospace' }}>
                      {comp.file.split('/').pop()}
                    </code>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5 }}>
                    {comp.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Query Sandbox & Diagnostics */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code size={18} style={{ color: selectedLayer.color }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                Verification & Telemetry Query
              </h3>
            </div>
            <button 
              className="btn btn-primary btn-sm" 
              onClick={() => handleTestInStudio(selectedLayer.sampleQuery)}
              style={{ fontSize: '0.75rem', padding: '4px 10px' }}
            >
              Run in Query Studio 🚀
            </button>
          </div>

          <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '12px' }}>
            Execute this production query in the browser WASM SQL playground to inspect schema metadata, test referential constraints, and verify engine execution:
          </p>

          <pre style={{ 
            background: '#090d16', 
            border: '1px solid rgba(255, 255, 255, 0.08)', 
            borderRadius: '6px', 
            padding: '16px', 
            fontFamily: 'monospace', 
            fontSize: '0.78rem', 
            color: '#e2e8f0', 
            overflowX: 'auto', 
            lineHeight: 1.5,
            flexGrow: 1,
            margin: 0
          }}>
            {selectedLayer.sampleQuery}
          </pre>

          {/* Architecture Synergy Card */}
          <div style={{ 
            marginTop: '20px', 
            padding: '14px', 
            background: selectedLayer.bgColor, 
            border: `1px solid ${selectedLayer.borderColor}`, 
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <ShieldCheck size={20} style={{ color: selectedLayer.color, flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#fff', marginBottom: '2px' }}>
                DBRE Reliability Standard
              </div>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                This architectural layer complies with Microsoft SQL Server 2022 high-availability standards, automated point-in-time recovery (STOPAT), and zero data-loss ACID persistence.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
