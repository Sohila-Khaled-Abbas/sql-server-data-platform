import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Terminal, 
  FileCode, 
  Database, 
  AlertCircle,
  Hash
} from 'lucide-react';
import mssqlLogo from '../assets/mssql-logo.svg';

const MIGRATION_SCRIPTS = [
  { id: 'M001', phase: '01_storage', file: '01_filegroups_and_files.sql', title: 'Filegroups & Secondary Data Files Allocation', durationMs: 42, checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
  { id: 'M002', phase: '01_storage', file: '02_custom_types_and_rules.sql', title: 'User-Defined Data Types & SSN Rules', durationMs: 28, checksum: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb' },
  { id: 'M003', phase: '01_storage', file: '03_integrity_constraints.sql', title: 'Referential Integrity & Circular FKs', durationMs: 35, checksum: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce' },
  { id: 'M004', phase: '01_storage', file: '04_partitioning_scheme.sql', title: 'Horizontal Partition Function & Scheme', durationMs: 65, checksum: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a' },
  { id: 'M005', phase: '01_storage', file: '05_company_case_study_schema.sql', title: 'Company Case Study 3NF Relational Tables', durationMs: 51, checksum: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d' },
  { id: 'M006', phase: '02_indexing', file: '01_clustered_nonclustered.sql', title: 'B-Tree Clustered & Covering Indexes', durationMs: 78, checksum: '1c1e0a2908f4277ec8eebeea3c9a6a83ae2ae2c64db318c4e43b17c9fb336780' },
  { id: 'M007', phase: '02_indexing', file: '02_indexed_views.sql', title: 'Materialized Indexed Views with SCHEMABINDING', durationMs: 84, checksum: 'c8646b9a896ff6b149b56f8fbf03f6f96df060eead13fec13d80d22d26f25492' },
  { id: 'M008', phase: '03_elt', file: '01_tvps_and_bulk_ingestion.sql', title: 'Table-Valued Parameters & Streaming Types', durationMs: 39, checksum: 'c7c2b3f1a0d8a562ef2a988d4078e3c15da2a983b65287e076fb8f9f7dcbe0be' },
  { id: 'M009', phase: '03_elt', file: '02_xml_shredding_and_generation.sql', title: 'XQuery XML Shredding & Ingestion Functions', durationMs: 44, checksum: 'f1a92e4284d7285514f77c8e9b626f2a36ac0460c49219665bc7df41f6c40003' },
  { id: 'M010', phase: '03_elt', file: '03_stored_procedures_etl.sql', title: 'Defensive ELT Stored Procedures & Transactions', durationMs: 60, checksum: '2c6a461b17b2e9bc83f0ac3d7d7b38d3ab80e3b977be415f3ec528574c86497f' },
  { id: 'M011', phase: '04_governance', file: '01_audit_change_capture_triggers.sql', title: 'DML Inserted/Deleted Audit Capture Triggers', durationMs: 55, checksum: '9b2c8c4a9193796d137e5e34be94fa8ecaaef329f6deeb3618451f1f237ef893' },
  { id: 'M012', phase: '04_governance', file: '02_ddl_and_server_triggers.sql', title: 'Database-Level DDL Schema Guards & Audit', durationMs: 47, checksum: 'a571e2efd727b87fa13c1c8a4176cf30b1ff91b15c1e956cb6789e57ee8c1b2c' },
  { id: 'M013', phase: '06_reliability', file: '01_backup_and_maintenance_jobs.sql', title: 'Transaction Log Maintenance & STOPAT Recovery', durationMs: 36, checksum: '5fece16e2550b272f98652f29838914950b4f3a4e510816e147221ab5f3763af' },
  { id: 'M014', phase: '06_reliability', file: '02_snapshot_lifecycle.sql', title: 'NTFS Sparse Snapshot Lifecycle Scripts', durationMs: 49, checksum: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b' },
  { id: 'M015', phase: '07_warehouse', file: '02_dimensional_star_schema.sql', title: 'OmniFlowDW Kimball Star Schema & Columnstore', durationMs: 92, checksum: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35' },
  { id: 'M016', phase: '07_warehouse', file: '03_etl_staging_to_dw.sql', title: 'SCD Type 2 Dimension ETL Pipeline', durationMs: 110, checksum: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce' }
];

export default function MigrationSimulator() {
  const [appliedMigrations, setAppliedMigrations] = useState(MIGRATION_SCRIPTS);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([
    'INFO  [2026-09-18 17:00:01] Connected to Microsoft SQL Server 2022 (RTM) - 16.0.1000.6',
    'INFO  [2026-09-18 17:00:01] Verified __SchemaMigrations table presence in dbo schema.',
    'INFO  [2026-09-18 17:00:02] All 16 registered migration scripts verified against SHA256 checksum registry. Status: Clean.'
  ]);

  const runAllMigrations = () => {
    setIsRunning(true);
    setAppliedMigrations([]);
    setLogs(['INFO  Initializing migration engine runner...']);

    let current = 0;
    const interval = setInterval(() => {
      if (current < MIGRATION_SCRIPTS.length) {
        const item = MIGRATION_SCRIPTS[current];
        setAppliedMigrations(prev => [...prev, item]);
        setLogs(prev => [
          ...prev,
          `EXEC  Applying migration ${item.id}: ${item.file}... OK (${item.durationMs} ms, SHA256: ${item.checksum.slice(0, 12)}...)`
        ]);
        current++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
        setLogs(prev => [
          ...prev,
          'SUCCESS All 16 database migration scripts applied successfully with 0 errors.',
          'SUCCESS Committed active transaction. Schema state: IDEMPOTENT & CONSISTENT.'
        ]);
      }
    }, 120);
  };

  const resetMigrations = () => {
    setAppliedMigrations([]);
    setLogs([
      'WARN  Database schema migrations flushed.',
      'INFO  Ready for forward migration deployment.'
    ]);
  };

  const totalTimeMs = appliedMigrations.reduce((acc, m) => acc + m.durationMs, 0);

  return (
    <div className="migration-simulator-container" style={{ maxWidth: '1300px', margin: '0 auto', paddingBottom: '40px' }}>
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
                Enterprise Database Migration Engine & CI/CD Runner
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0' }}>
                Automated idempotent DDL deployment with SHA256 checksum verification, transaction rollback safety, and __SchemaMigrations audit logging.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="btn btn-primary" 
              onClick={runAllMigrations}
              disabled={isRunning}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Play size={16} />
              <span>{isRunning ? 'Running Migrations...' : 'Execute Migrations'}</span>
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={resetMigrations}
              disabled={isRunning}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <RotateCcw size={16} />
              <span>Reset State</span>
            </button>
          </div>
        </div>

        {/* Telemetry Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginTop: '20px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '14px' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
              Applied Scripts
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
              {appliedMigrations.length} / {MIGRATION_SCRIPTS.length}
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '14px' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
              Total Migration Time
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
              {totalTimeMs} ms
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '14px' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
              Checksum Integrity
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
              100% Verified
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '14px' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
              Transaction Boundary
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#a855f7', marginTop: '4px' }}>
              ACID XACT_ABORT
            </div>
          </div>
        </div>
      </div>

      {/* 2. Migration Execution Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* Left Column: Migration History Table */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={18} style={{ color: '#CC292B' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                dbo.__SchemaMigrations Audit Ledger
              </h3>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Ordered Dependency Sequence
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '480px', overflowY: 'auto' }}>
            {MIGRATION_SCRIPTS.map((script) => {
              const isApplied = appliedMigrations.some(m => m.id === script.id);

              return (
                <div 
                  key={script.id}
                  style={{
                    background: isApplied ? 'rgba(16, 185, 129, 0.04)' : 'rgba(0, 0, 0, 0.25)',
                    border: `1px solid ${isApplied ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.06)'}`,
                    borderRadius: '6px',
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div style={{ flexShrink: 0 }}>
                    {isApplied ? (
                      <CheckCircle2 size={18} style={{ color: '#10b981' }} />
                    ) : (
                      <Clock size={18} style={{ color: '#64748b' }} />
                    )}
                  </div>
                  <div style={{ flexGrow: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#38bdf8', fontWeight: 700 }}>
                        {script.id}
                      </span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: isApplied ? '#fff' : '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {script.title}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.7rem', color: '#64748b', fontFamily: 'monospace' }}>
                      <span>{script.file}</span>
                      <span>SHA256: {script.checksum.slice(0, 10)}...</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: isApplied ? '#10b981' : '#64748b', flexShrink: 0 }}>
                    {isApplied ? `${script.durationMs}ms` : 'PENDING'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Terminal Output */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={18} style={{ color: '#10b981' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                CI/CD Deployment Console Output
              </h3>
            </div>
            <span className="badge badge-green" style={{ fontSize: '0.68rem' }}>
              STDOUT / STDERR
            </span>
          </div>

          <div style={{
            background: '#090d16',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '6px',
            padding: '16px',
            fontFamily: 'monospace',
            fontSize: '0.76rem',
            color: '#e2e8f0',
            overflowY: 'auto',
            lineHeight: 1.6,
            flexGrow: 1,
            maxHeight: '480px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            {logs.map((log, index) => {
              const isSuccess = log.startsWith('SUCCESS');
              const isExec = log.startsWith('EXEC');
              const isWarn = log.startsWith('WARN');

              return (
                <div 
                  key={index} 
                  style={{ 
                    color: isSuccess ? '#10b981' : isExec ? '#38bdf8' : isWarn ? '#f59e0b' : '#94a3b8' 
                  }}
                >
                  {log}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
