import React, { useState } from 'react';
import { 
  Database, 
  Key, 
  Layers, 
  ExternalLink, 
  ArrowRight, 
  Table, 
  ShieldCheck, 
  Sparkles, 
  FileCode, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  SlidersHorizontal,
  Workflow
} from 'lucide-react';
import { SCHEMAS_ERD, REPO_METADATA } from '../data/repositoryData.js';

export default function DatabaseDesign() {
  const [activeSchema, setActiveSchema] = useState('starSchema');
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'flagged', 'valid', 'sparse'

  const schemaData = SCHEMAS_ERD[activeSchema];

  // Helper to filter live rows for ITI schema
  const getFilteredRows = (rows) => {
    if (!rows) return [];
    if (filterMode === 'flagged') return rows.filter(r => !r.valid);
    if (filterMode === 'valid') return rows.filter(r => r.valid && r.salary !== 'NULL');
    if (filterMode === 'sparse') return rows.filter(r => r.salary === 'NULL' || r.id === 666);
    return rows;
  };

  return (
    <section id="database-design" className="section">
      <div className="container">
        <span className="section-tag">PHYSICAL &amp; RELATIONAL SCHEMAS</span>
        <h2 className="section-title">Database Design &amp; Schemas</h2>
        <p className="section-subtitle">
          Interactive relational and dimensional architectures across all three platform databases: Kimball Star Schema (OmniFlowDW), 3NF Normalized OLTP (Company / ITItest), and the Academic Integrity Engine (ITI &amp; DB2).
        </p>

        {/* Multi-Database Topology Cards Summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}>
          {/* DB 1: OmniFlowDW */}
          <div 
            onClick={() => setActiveSchema('starSchema')}
            style={{
              background: activeSchema === 'starSchema' ? 'rgba(225, 29, 72, 0.08)' : 'var(--bg-surface)',
              border: `1px solid ${activeSchema === 'starSchema' ? 'var(--accent-red)' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} style={{ color: 'var(--accent-red)' }} />
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>OmniFlowDW</span>
              </div>
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', background: 'rgba(225, 29, 72, 0.15)', color: 'var(--accent-red)', padding: '2px 8px', borderRadius: '10px' }}>
                Kimball OLAP
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: 1.5 }}>
              Dimensional data mart with additive FactSales, conformed date hierarchy, and SCD Type 2 customer history tracking.
            </p>
          </div>

          {/* DB 2: Company_SD / ITItest */}
          <div 
            onClick={() => setActiveSchema('oltpSchema')}
            style={{
              background: activeSchema === 'oltpSchema' ? 'rgba(56, 189, 248, 0.08)' : 'var(--bg-surface)',
              border: `1px solid ${activeSchema === 'oltpSchema' ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Database size={18} style={{ color: 'var(--accent-cyan)' }} />
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>Company / ITItest</span>
              </div>
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-cyan)', padding: '2px 8px', borderRadius: '10px' }}>
                Normalized 3NF
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: 1.5 }}>
              Enterprise Peter Chen relational model with circular foreign keys, self-referencing management hierarchy, and cascade rules.
            </p>
          </div>

          {/* DB 3: ITI & DB2 */}
          <div 
            onClick={() => setActiveSchema('itiSchema')}
            style={{
              background: activeSchema === 'itiSchema' ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface)',
              border: `1px solid ${activeSchema === 'itiSchema' ? 'var(--accent-emerald)' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} style={{ color: 'var(--accent-emerald)' }} />
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>ITI &amp; DB2 Engine</span>
              </div>
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', padding: '2px 8px', borderRadius: '10px' }}>
                CH01_VID06 Spec
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: 1.5 }}>
              Domain rules (CREATE RULE), sp_bindrule, UDDTs, and standalone defaults verifying preexisting vs new data integrity.
            </p>
          </div>
        </div>

        {/* Active Schema Description Header */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem 2rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>
                {schemaData.name}
              </h3>
              {schemaData.databaseName && (
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-secondary)',
                  padding: '2px 8px',
                  borderRadius: '12px'
                }}>
                  Target DB: [{schemaData.databaseName}]
                </span>
              )}
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '750px' }}>
              {schemaData.description}
            </p>
          </div>

          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            background: 'rgba(225, 29, 72, 0.1)',
            color: 'var(--accent-red)',
            padding: '4px 14px',
            borderRadius: '20px',
            border: '1px solid rgba(225, 29, 72, 0.25)',
            whiteSpace: 'nowrap'
          }}>
            {schemaData.tables.length} Core Entities Mapped
          </span>
        </div>

        {/* SPECIAL SECTION: If ITI Schema is selected, display the CH01_VID06 Architectural Diagram, Telemetry, and SSMS 16-Row Grid */}
        {activeSchema === 'itiSchema' && (
          <div style={{ marginBottom: '3rem' }}>
            {/* Direct Verification Links & Telemetry Banner */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <a
                href="https://github.com/Sohila-Khaled-Abbas/sql-server-data-platform/blob/master/docs/ch01-vid06-constraints-rules-defaults-live.md"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  background: 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <FileText size={20} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
                <div>
                  <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>Live Telemetry Specification</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                    docs/ch01-vid06-constraints-rules-defaults-live.md &nearr;
                  </div>
                </div>
              </a>

              <a
                href="https://github.com/Sohila-Khaled-Abbas/sql-server-data-platform/blob/master/src/01_storage_and_schema/ch01_vid06_constraints_rules_defaults.sql"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  background: 'rgba(56, 189, 248, 0.05)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <FileCode size={20} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
                <div>
                  <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>T-SQL Implementation Script</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                    src/01_storage_and_schema/ch01_vid06_constraints_rules_defaults.sql &nearr;
                  </div>
                </div>
              </a>
            </div>

            {/* Visual Architectural Comparison: Constraint vs Rule vs Default */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <Workflow size={18} style={{ color: 'var(--accent-emerald)' }} />
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: '#fff', margin: 0 }}>
                  CH01_VID06: The Three Cardinal Constraints &amp; Rules Architecture
                </h4>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.25rem',
                marginBottom: '1.75rem'
              }}>
                {/* Rule Limitation 1 */}
                <div style={{
                  background: 'var(--bg-deep)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 1.25rem'
                }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#ef4444', fontWeight: 700, marginBottom: '0.35rem' }}>
                    1. NEW DATA ONLY (WITH NOCHECK)
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    ----constraint ---&gt; new data XXXX
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                    Adding a standard <code style={{ color: '#fff' }}>CHECK (Salary &gt; 1000)</code> rejects immediately because rows 4, 5, 6 violate it. Requires <code style={{ color: 'var(--accent-cyan)' }}>WITH NOCHECK</code> or a standalone <code style={{ color: 'var(--accent-emerald)' }}>RULE</code> to preserve historical data.
                  </p>
                </div>

                {/* Rule Limitation 2 */}
                <div style={{
                  background: 'var(--bg-deep)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 1.25rem'
                }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#f59e0b', fontWeight: 700, marginBottom: '0.35rem' }}>
                    2. SHARED BETWEEN TABLES
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    ----constraint ---&gt; shared between tables XXXX
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                    Table constraints cannot be shared across multiple entities. A standalone <code style={{ color: 'var(--accent-emerald)' }}>RULE</code> object is defined once at database level and bound to any column via <code style={{ color: 'var(--accent-cyan)' }}>sp_bindrule</code>.
                  </p>
                </div>

                {/* Rule Limitation 3 */}
                <div style={{
                  background: 'var(--bg-deep)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 1.25rem'
                }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700, marginBottom: '0.35rem' }}>
                    3. USER-DEFINED DATA TYPES (UDDT)
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    ----constraint ---&gt; new data type XXXX
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                    Constraints cannot bind directly to custom data types. Rules bind natively to custom UDDTs (<code style={{ color: 'var(--accent-cyan)' }}>dbo.udt_CompSalary</code>), enforcing enterprise domain logic globally.
                  </p>
                </div>
              </div>

              {/* Diagram of sp_bindrule bus */}
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                border: '1px solid var(--border-subtle)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                lineHeight: 1.6
              }}>
                <div style={{ color: 'var(--accent-emerald)', fontWeight: 700, marginBottom: '0.5rem' }}>
                  --&gt; Rule [Global Check Constraint Definition &amp; Multi-Target Binding]
                </div>
                <div style={{ color: '#fff' }}>CREATE RULE myrule AS @x &gt; 1000;</div>
                <div style={{ color: 'var(--text-dim)', margin: '0.25rem 0' }}>&boxv;</div>
                <div style={{ color: 'var(--accent-cyan)' }}>&boxvr;&boxh;&boxh; EXEC sp_bindrule myrule, &apos;dbo.Instructor.Salary&apos;; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-- Primary target table</div>
                <div style={{ color: 'var(--accent-cyan)' }}>&boxvr;&boxh;&boxh; EXEC sp_bindrule myrule, &apos;dbo.Consultant.HourlyRate&apos;; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-- Shared across second table</div>
                <div style={{ color: 'var(--accent-cyan)' }}>&boxur;&boxh;&boxh; EXEC sp_bindrule myrule, &apos;dbo.udt_CompSalary&apos;; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-- Bound to User-Defined Type</div>
              </div>
            </div>

            {/* SSMS Live Instructor Table (16 Rows) Viewer */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              marginBottom: '2.5rem'
            }}>
              <div style={{
                padding: '1.25rem 1.75rem',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                background: 'rgba(255, 255, 255, 0.02)'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Table size={18} style={{ color: 'var(--accent-red)' }} />
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>
                      dbo.Instructor &mdash; Live SSMS Verified Dataset (16 Records)
                    </span>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '2px' }}>
                    Queried directly from local SQL Server 2022 instance matching course video grid
                  </div>
                </div>

                {/* Filter Controls */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setFilterMode('all')}
                    style={{
                      background: filterMode === 'all' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      color: filterMode === 'all' ? '#fff' : 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      cursor: 'pointer'
                    }}
                  >
                    All 16 Rows
                  </button>
                  <button
                    onClick={() => setFilterMode('flagged')}
                    style={{
                      background: filterMode === 'flagged' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(239, 68, 68, 0.08)',
                      color: '#ef4444',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      cursor: 'pointer'
                    }}
                  >
                    &Delta; Flagged (&lt; 1000)
                  </button>
                  <button
                    onClick={() => setFilterMode('valid')}
                    style={{
                      background: filterMode === 'valid' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.08)',
                      color: '#10b981',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      cursor: 'pointer'
                    }}
                  >
                    &check; Compliant (&gt;= 1000)
                  </button>
                </div>
              </div>

              {/* Table Container */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  textAlign: 'left',
                  fontSize: '0.85rem'
                }}>
                  <thead>
                    <tr style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      borderBottom: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Ins_Id</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Ins_Name</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Ins_Degree</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Salary</th>
                      <th style={{ padding: '0.75rem 1rem' }}>gender</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Dept_Id</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Pedagogical Observation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredRows(schemaData.liveRows).map((row) => {
                      const isViolator = !row.valid;
                      return (
                        <tr 
                          key={row.id} 
                          style={{
                            borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                            background: isViolator ? 'rgba(239, 68, 68, 0.06)' : 'transparent',
                            fontFamily: 'var(--font-mono)'
                          }}
                        >
                          <td style={{ padding: '0.65rem 1rem', color: '#fff', fontWeight: 600 }}>{row.id}</td>
                          <td style={{ padding: '0.65rem 1rem', color: isViolator ? '#fca5a5' : '#e2e8f0', fontFamily: 'var(--font-heading)' }}>
                            {row.name}
                          </td>
                          <td style={{ padding: '0.65rem 1rem', color: row.degree === 'NULL' ? 'var(--text-dim)' : 'var(--text-secondary)' }}>
                            {row.degree}
                          </td>
                          <td style={{ 
                            padding: '0.65rem 1rem', 
                            color: isViolator ? '#ef4444' : row.salary === 'NULL' ? 'var(--text-dim)' : '#10b981',
                            fontWeight: isViolator ? 700 : 500
                          }}>
                            {row.salary}
                          </td>
                          <td style={{ padding: '0.65rem 1rem', color: row.gender === 'NULL' ? 'var(--text-dim)' : 'var(--text-secondary)' }}>
                            {row.gender}
                          </td>
                          <td style={{ padding: '0.65rem 1rem', color: row.dept ? 'var(--accent-cyan)' : 'var(--text-dim)' }}>
                            {row.dept || 'NULL'}
                          </td>
                          <td style={{ padding: '0.65rem 1rem', fontSize: '0.75rem', color: isViolator ? '#ef4444' : 'var(--text-muted)' }}>
                            {isViolator ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <AlertTriangle size={12} />
                                {row.anomaly}
                              </span>
                            ) : (
                              row.anomaly || 'Complies with @x > 1000'
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ERD Table Cards Grid for Active Schema */}
        <div className="erd-tables-grid">
          {schemaData.tables.map((tbl) => (
            <div key={tbl.name} className="erd-table-card">
              <div className="erd-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Table size={15} style={{ color: tbl.type.includes('FACT') ? 'var(--accent-red)' : 'var(--accent-cyan)' }} />
                  <span className="erd-table-name">{tbl.name}</span>
                </div>
                <span className="erd-table-type">{tbl.type}</span>
              </div>

              {tbl.grain && (
                <div style={{
                  padding: '0.5rem 1.25rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)'
                }}>
                  <strong>Grain:</strong> {tbl.grain}
                </div>
              )}

              <div className="erd-columns-list">
                {tbl.columns.map((col) => {
                  const isPk = col.includes('[PK');
                  const isFk = col.includes('[FK');
                  return (
                    <div
                      key={col}
                      className={`erd-col-item ${isPk ? 'is-pk' : isFk ? 'is-fk' : ''}`}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {isPk ? (
                          <Key size={11} style={{ color: '#f59e0b' }} />
                        ) : (
                          <span style={{ width: 11, textAlign: 'center', color: 'var(--text-dim)' }}>&bull;</span>
                        )}
                        <span>{col.split(' ')[0]}</span>
                      </span>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>
                        {col.split(' ').slice(1).join(' ')}
                      </span>
                    </div>
                  );
                })}
              </div>

              {tbl.fks && tbl.fks.length > 0 && (
                <div style={{
                  padding: '0.75rem 1.25rem',
                  background: 'rgba(56, 189, 248, 0.03)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.04)',
                  fontSize: '0.74rem'
                }}>
                  <div style={{ color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>
                    Foreign Key Mappings:
                  </div>
                  {tbl.fks.map((fk) => (
                    <div key={fk} style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                      &rarr; {fk}
                    </div>
                  ))}
                </div>
              )}

              {tbl.rules && tbl.rules.length > 0 && (
                <div style={{
                  padding: '0.75rem 1.25rem',
                  background: 'rgba(16, 185, 129, 0.05)',
                  borderTop: '1px solid rgba(16, 185, 129, 0.15)',
                  fontSize: '0.74rem'
                }}>
                  <div style={{ color: 'var(--accent-emerald)', marginBottom: '0.35rem', fontWeight: 600 }}>
                    Bound Rules &amp; Defaults:
                  </div>
                  {tbl.rules.map((r) => (
                    <div key={r} style={{ color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                      &check; {r}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
