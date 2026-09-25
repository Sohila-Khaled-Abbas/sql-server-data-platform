import React, { useState } from 'react';
import { 
  Play, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Database, 
  Cpu, 
  Sparkles,
  RotateCcw,
  Copy,
  Check
} from 'lucide-react';

const SIMULATION_SCENARIOS = [
  {
    id: 'ch01_vid06',
    database: 'ITI',
    title: 'CH01_VID06: Test Rule myrule Enforcement vs WITH NOCHECK',
    desc: 'Simulate inserting an instructor with Salary = 450 vs Salary = 3500 into [ITI].[dbo].[Instructor] under bound rule @x > 1000.',
    sql: `-- 1. Attempt invalid INSERT with Salary = 450 (Violates myrule: @x > 1000)
INSERT INTO dbo.Instructor (Ins_Id, Ins_Name, Salary, Dept_Id)
VALUES (999, N'Dr. Kareem', 450.00, 10);

-- 2. Attempt valid INSERT with Salary = 3500 (Complies with myrule)
INSERT INTO dbo.Instructor (Ins_Id, Ins_Name, Salary, Dept_Id)
VALUES (999, N'Dr. Kareem', 3500.00, 10);`,
    stats: {
      elapsed: '14 ms',
      cpu: '2 ms',
      reads: '4 logical reads',
      cost: '0.00328 (Clustered Index Insert)'
    },
    outputType: 'error_and_success',
    errorMsg: `Msg 513, Level 16, State 0, Line 2
A column insert or update conflicts with a rule imposed by a previous CREATE RULE statement. The statement was terminated. The conflict occurred in database 'ITI', table 'dbo.Instructor', column 'Salary'.
The statement has been terminated.`,
    successResult: {
      headers: ['Ins_Id', 'Ins_Name', 'Ins_Degree', 'Salary', 'gender', 'Dept_Id', 'Rule_Evaluation'],
      rows: [
        ['999', 'Dr. Kareem', 'Master', '$3,500.00', 'M', '10', 'PASSED (@x > 1000)']
      ]
    }
  },
  {
    id: 'ch01_vid07',
    database: 'ITI',
    title: 'CH01_VID07: Custom UDDT (complexdt) with Rule & Default Binding',
    desc: 'Simulate inserting into [ITI].[dbo].[mydata] with omitted salary (triggering default 5000) vs salary = 500 (triggering rule violation Msg 513).',
    sql: `-- 1. Attempt invalid INSERT with Salary = 500 (Violates myrule: @x > 1000 bound to complexdt)
INSERT INTO dbo.mydata (id, name, salary)
VALUES (7, 'BadRecord', 500);

-- 2. Insert record omitting salary (Inherits bound default mydef = 5000)
INSERT INTO dbo.mydata (id, name)
VALUES (7, 'GoodRecord');

-- 3. Verify inserted record with auto-populated salary
SELECT id, name, salary FROM dbo.mydata WHERE id = 7;`,
    stats: {
      elapsed: '11 ms',
      cpu: '1 ms',
      reads: '3 logical reads',
      cost: '0.00312 (Heap Insert)'
    },
    outputType: 'error_and_success',
    errorMsg: `Msg 513, Level 16, State 0, Line 2
A column insert or update conflicts with a rule imposed by a previous CREATE RULE statement. The statement was terminated. The conflict occurred in database 'ITI', table 'dbo.mydata', column 'salary'.
The statement has been terminated.`,
    successResult: {
      headers: ['id', 'name', 'salary', 'Default_Provenance', 'Rule_Evaluation'],
      rows: [
        ['7', 'GoodRecord', '5000', 'Injected by [mydef] (5000)', 'PASSED (@x > 1000)']
      ]
    }
  },
  {
    id: 'ch01_vid08',
    database: 'ITI',
    title: 'CH01_VID08: Clustered Index Seek (id=804) vs Scan (name=\'Omar\')',
    desc: 'Simulate B+Tree traversal on dbo.student: comparing logarithmic seek on clustering key [id] against full clustered index scan on unindexed [name].',
    sql: `-- 1. Clustered Index Seek on primary clustering key (2-3 page reads)
SELECT id, name, age 
FROM dbo.student 
WHERE id = 804;

-- 2. Clustered Index Scan (Forced to visit every leaf data page)
SELECT id, name, age 
FROM dbo.student 
WHERE name = 'Omar';`,
    stats: {
      elapsed: '2 ms',
      cpu: '0.5 ms',
      reads: '2 logical reads (Seek) vs 14 logical reads (Scan)',
      cost: '0.00328 (Clustered Index Seek) vs 0.01250 (Clustered Index Scan)'
    },
    outputType: 'table',
    successResult: {
      headers: ['id', 'name', 'age', 'Access_Method', 'BTree_Path'],
      rows: [
        ['804', 'Omar', '22', 'Clustered Index Seek', 'Root -> Right Intermediate (>=700) -> Leaf Page 800 -> Slot Array Binary Search']
      ]
    }
  },
  {
    id: 'ch01_vid09',
    database: 'ITI',
    title: 'CH01_VID09: Non-Clustered Index i2 with Key Lookup & Covering INCLUDE',
    desc: 'Simulate Non-Clustered Index seek on i2(name) triggering Key Lookup for age vs Covering Index i2_covering eliminating Key Lookup completely.',
    sql: `-- 1. Non-Clustered Seek + Key Lookup (Follows yellow pointer down to Clustered Leaf)
SELECT id, name, age 
FROM dbo.student 
WHERE name = 'Omar';

-- 2. Index-Only Query (Zero Key Lookup - id is row locator in leaf)
SELECT id, name 
FROM dbo.student 
WHERE name = 'Omar';

-- 3. Modern Covering Index with INCLUDE (age)
SELECT id, name, age 
FROM dbo.student WITH (INDEX(i2_covering))
WHERE name = 'Omar';`,
    stats: {
      elapsed: '3 ms',
      cpu: '1 ms',
      reads: '2 logical reads (Covered) vs 5 logical reads (Seek + Key Lookup)',
      cost: '0.00328 (Index Seek Only) vs 0.00657 (Index Seek + Key Lookup)'
    },
    outputType: 'table',
    successResult: {
      headers: ['id', 'name', 'age', 'Index_Used', 'Lookup_Overhead'],
      rows: [
        ['804', 'Omar', '22', 'i2_covering ON (name) INCLUDE (age)', 'ZERO Key Lookups (Covered 100% in Leaf)']
      ]
    }
  },
  {
    id: 'ch01_vid10',
    database: 'ITI',
    title: 'CH01_VID10: Single Clustered Constraint (Msg 1902) & Non-Clustered i2',
    desc: 'Simulate attempting a second clustered index on Student(st_fname) triggering Msg 1902 vs creating non-clustered index i2 and testing Seek + Key Lookup.',
    sql: `-- 1. Attempt creating second clustered index on Student (Engine Rejection)
CREATE CLUSTERED INDEX i2 ON dbo.Student(st_fname);

-- 2. Create non-clustered index i2 on Student (Succeeds)
CREATE NONCLUSTERED INDEX i2 ON dbo.Student(st_fname);

-- 3. Execute Seek + Key Lookup on Student
SELECT St_Id, St_Fname, St_Lname, St_Address, St_Age 
FROM dbo.Student 
WHERE St_Fname = N'Ahmed';`,
    stats: {
      elapsed: '2 ms',
      cpu: '0.8 ms',
      reads: '2 logical reads (i2 Seek) + 2 logical reads (PK Key Lookup)',
      cost: '0.00328 (Index Seek) + 0.00328 (Key Lookup)'
    },
    outputType: 'error_and_success',
    errorMsg: `Msg 1902, Level 16, State 1, Line 2
Cannot create more than one clustered index on table 'dbo.Student'. Drop the existing clustered index 'PK_Student' before creating another.`,
    successResult: {
      headers: ['St_Id', 'St_Fname', 'St_Lname', 'St_Address', 'St_Age', 'Access_Method'],
      rows: [
        ['1', 'Ahmed', 'Hassan', 'Cairo', '22', 'Index Seek (i2) + Key Lookup (PK_Student)']
      ]
    }
  },
  {
    id: 'kimball_agg',
    database: 'OmniFlowDW',
    title: 'Kimball DW: Aggregated Sales Performance by Quarter',
    desc: 'Run analytical aggregation across conformed Date, Product, and Customer dimensions with additive fact metrics.',
    sql: `SELECT 
    d.CalendarYear,
    d.CalendarQuarter,
    p.CategoryName,
    COUNT(DISTINCT f.SalesSK) AS TotalInvoices,
    SUM(f.Quantity) AS TotalUnitsSold,
    SUM(f.NetSalesAmount) AS TotalNetRevenue
FROM dw.FactSales f
INNER JOIN dw.DimDate d ON f.DateKey = d.DateKey
INNER JOIN dw.DimProduct p ON f.ProductSK = p.ProductSK
GROUP BY d.CalendarYear, d.CalendarQuarter, p.CategoryName
ORDER BY d.CalendarYear DESC, d.CalendarQuarter ASC;`,
    stats: {
      elapsed: '42 ms',
      cpu: '18 ms',
      reads: '328 logical reads',
      cost: '0.04120 (Hash Match Aggregate)'
    },
    outputType: 'table',
    successResult: {
      headers: ['CalendarYear', 'CalendarQuarter', 'CategoryName', 'TotalInvoices', 'TotalUnitsSold', 'TotalNetRevenue'],
      rows: [
        ['2026', 'Q1', 'Database Engine Licenses', '1,420', '4,260', '$1,894,200.00'],
        ['2026', 'Q1', 'High-Speed Storage Systems', '890', '1,780', '$945,600.00'],
        ['2026', 'Q1', 'Enterprise Cloud Support', '2,150', '2,150', '$645,000.00'],
        ['2025', 'Q4', 'Database Engine Licenses', '1,890', '5,670', '$2,485,300.00'],
        ['2025', 'Q4', 'High-Speed Storage Systems', '1,120', '2,240', '$1,192,800.00']
      ]
    }
  },
  {
    id: 'tvp_stream',
    database: 'OmniFlowDB',
    title: 'High-Throughput Table-Valued Parameter (TVP) Ingestion',
    desc: 'Simulate streaming an array of 50 strongly-typed order line items in a single atomic transaction boundary.',
    sql: `DECLARE @Batch [Sales].[OrderBatchType];
INSERT INTO @Batch (OrderNumber, CustomerId, ProductId, Quantity, UnitPrice)
VALUES 
    ('ORD-2026-9001', 104, 12, 5, 249.99),
    ('ORD-2026-9002', 108, 34, 2, 89.50),
    ('ORD-2026-9003', 112, 56, 10, 15.00);

EXEC [Sales].[usp_BulkIngestOrders] 
    @OrderBatch = @Batch,
    @IngestedCount = @Count OUTPUT;`,
    stats: {
      elapsed: '18 ms',
      cpu: '8 ms',
      reads: '64 logical reads',
      cost: '0.01540 (Clustered Index Seek & Merge)'
    },
    outputType: 'table',
    successResult: {
      headers: ['BatchId', 'Status', 'RowsProcessed', 'CDC_Audit_Records', 'XACT_ABORT_State'],
      rows: [
        ['BATCH-9941', 'COMMITTED', '50 Items', '50 OUTPUT Records Written', 'ACTIVE_CLEAN']
      ]
    }
  },
  {
    id: 'dr_snapshot',
    database: 'OmniFlowDB_Snapshot',
    title: 'Disaster Recovery: Non-Blocking Snapshot Rollback',
    desc: 'Simulate instantaneous database reversion using NTFS sparse copy-on-write pointers.',
    sql: `-- Revert transactional database to point-in-time snapshot
USE master;
ALTER DATABASE OmniFlowDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
RESTORE DATABASE OmniFlowDB 
FROM DATABASE_SNAPSHOT = 'OmniFlowDB_Snapshot_20260919';
ALTER DATABASE OmniFlowDB SET MULTI_USER;`,
    stats: {
      elapsed: '1,420 ms',
      cpu: '95 ms',
      reads: '1,240 physical I/O writes',
      cost: '0.00000 (Piecemeal Pointer Metadata Reversion)'
    },
    outputType: 'table',
    successResult: {
      headers: ['Database', 'SourceSnapshot', 'RestoreMode', 'RPO_Achieved', 'RTO_Achieved'],
      rows: [
        ['OmniFlowDB', 'OmniFlowDB_Snapshot_20260919', 'NTFS Sparse Pointer Swap', '0 Seconds', '1.42 Seconds']
      ]
    }
  }
];

export default function InteractivePlayground() {
  const [selectedId, setSelectedId] = useState('ch01_vid06');
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(true);
  const [copied, setCopied] = useState(false);

  const scenario = SIMULATION_SCENARIOS.find(s => s.id === selectedId) || SIMULATION_SCENARIOS[0];

  const handleRun = () => {
    setIsRunning(true);
    setHasRun(false);
    setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
    }, 600);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(scenario.sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section id="playground" className="section" style={{ borderTop: '1px solid var(--border-subtle)' }}>
      <div className="container">
        <span className="section-tag">
          <Terminal size={14} />
          INTERACTIVE SQL PLAYGROUND &bull; LIVE ENGINE SIMULATOR
        </span>
        <h2 className="section-title">Query Execution &amp; Telemetry Simulator</h2>
        <p className="section-subtitle">
          Experience real-world SQL Server 2022 query execution against all three platform databases with live performance statistics and plan metrics.
        </p>

        {/* Scenario Selector Pills */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '2rem'
        }}>
          {SIMULATION_SCENARIOS.map((sc) => {
            const isActive = sc.id === selectedId;
            return (
              <button
                key={sc.id}
                onClick={() => {
                  setSelectedId(sc.id);
                  setHasRun(true);
                }}
                style={{
                  background: isActive ? 'rgba(225, 29, 72, 0.15)' : 'var(--bg-surface)',
                  border: `1px solid ${isActive ? 'var(--accent-red)' : 'var(--border-subtle)'}`,
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  padding: '0.65rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <Database size={15} style={{ color: isActive ? 'var(--accent-red)' : 'var(--accent-cyan)' }} />
                <span>[{sc.database}] {sc.title.split(':')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Playground Main Shell */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-glass)'
        }}>
          {/* Header Bar */}
          <div style={{
            padding: '1rem 1.75rem',
            background: 'rgba(0, 0, 0, 0.4)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: '0.75rem', 
                  color: 'var(--accent-cyan)', 
                  background: 'rgba(56, 189, 248, 0.1)', 
                  padding: '2px 8px', 
                  borderRadius: '4px' 
                }}>
                  Target Database: [{scenario.database}]
                </span>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>
                  {scenario.title}
                </span>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '3px' }}>
                {scenario.desc}
              </div>
            </div>

            {/* Run & Copy Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={handleCopy}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                {copied ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy SQL'}</span>
              </button>

              <button
                onClick={handleRun}
                disabled={isRunning}
                style={{
                  background: isRunning ? 'var(--accent-red-hover)' : 'var(--accent-red)',
                  border: 'none',
                  color: '#fff',
                  padding: '0.5rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  cursor: isRunning ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 15px -2px var(--accent-red-glow)'
                }}
              >
                <Play size={14} style={{ fill: '#fff' }} />
                <span>{isRunning ? 'Executing...' : 'Run Simulation'}</span>
              </button>
            </div>
          </div>

          {/* SQL Editor View */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.5)',
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            <pre style={{
              margin: 0,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.86rem',
              lineHeight: 1.6,
              color: '#f8fafc',
              overflowX: 'auto'
            }}>
              <code>{scenario.sql}</code>
            </pre>
          </div>

          {/* Results & Execution Telemetry */}
          {hasRun && (
            <div>
              {/* Telemetry Stats Bar */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                padding: '0.75rem 1.75rem',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.5rem',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Clock size={13} style={{ color: 'var(--accent-cyan)' }} />
                  Elapsed: <strong style={{ color: '#fff' }}>{scenario.stats.elapsed}</strong>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Cpu size={13} style={{ color: 'var(--accent-emerald)' }} />
                  CPU Time: <strong style={{ color: '#fff' }}>{scenario.stats.cpu}</strong>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Database size={13} style={{ color: '#f59e0b' }} />
                  I/O: <strong style={{ color: '#fff' }}>{scenario.stats.reads}</strong>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Sparkles size={13} style={{ color: 'var(--accent-red)' }} />
                  Plan Cost: <strong style={{ color: '#fff' }}>{scenario.stats.cost}</strong>
                </span>
              </div>

              {/* Error Output for CH01_VID06 */}
              {scenario.outputType === 'error_and_success' && (
                <div style={{ padding: '1.25rem 1.75rem', background: 'rgba(239, 68, 68, 0.05)', borderBottom: '1px solid rgba(239, 68, 68, 0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <AlertCircle size={15} />
                    <span>Statement 1 Engine Diagnostic Output (Expected Rule Violation):</span>
                  </div>
                  <pre style={{
                    margin: 0,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    color: '#fca5a5',
                    background: 'rgba(0,0,0,0.4)',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    lineHeight: 1.5,
                    overflowX: 'auto'
                  }}>
                    {scenario.errorMsg}
                  </pre>
                </div>
              )}

              {/* Success Result Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  textAlign: 'left',
                  fontSize: '0.84rem'
                }}>
                  <thead>
                    <tr style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderBottom: '1px solid var(--border-subtle)',
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.74rem',
                      textTransform: 'uppercase'
                    }}>
                      {scenario.successResult.headers.map((h) => (
                        <th key={h} style={{ padding: '0.75rem 1rem' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {scenario.successResult.rows.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', fontFamily: 'var(--font-mono)' }}>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} style={{ 
                            padding: '0.65rem 1rem', 
                            color: cell.includes('PASSED') ? '#10b981' : cell.includes('$') ? '#38bdf8' : '#fff' 
                          }}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
