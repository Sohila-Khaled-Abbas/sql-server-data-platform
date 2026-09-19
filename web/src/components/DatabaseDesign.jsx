import React, { useState } from 'react';
import { Database, Key, Layers, ExternalLink, ArrowRight, Table } from 'lucide-react';
import { SCHEMAS_ERD, REPO_METADATA } from '../data/repositoryData.js';

export default function DatabaseDesign() {
  const [activeSchema, setActiveSchema] = useState('starSchema');

  const schemaData = SCHEMAS_ERD[activeSchema];

  return (
    <section id="database-design" className="section">
      <div className="container">
        <span className="section-tag">PHYSICAL &amp; RELATIONAL SCHEMAS</span>
        <h2 className="section-title">Database Design &amp; Schemas</h2>
        <p className="section-subtitle">
          Interactive relational mapping covering the Kimball dimensional warehouse (OmniFlowDW) and the canonical 3NF Company case study with circular foreign keys.
        </p>

        {/* Schema Switcher Bar */}
        <div className="erd-toggle-bar">
          <button
            onClick={() => setActiveSchema('starSchema')}
            className={`erd-toggle-btn ${activeSchema === 'starSchema' ? 'active' : ''}`}
          >
            <Layers size={16} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
            Kimball Star Schema (OmniFlowDW)
          </button>

          <button
            onClick={() => setActiveSchema('oltpSchema')}
            className={`erd-toggle-btn ${activeSchema === 'oltpSchema' ? 'active' : ''}`}
          >
            <Database size={16} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
            3NF Normalized OLTP (Company / ITItest)
          </button>
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
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
              {schemaData.name}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              {schemaData.description}
            </p>
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            background: 'rgba(225, 29, 72, 0.1)',
            color: 'var(--accent-red)',
            padding: '4px 12px',
            borderRadius: '20px',
            border: '1px solid rgba(225, 29, 72, 0.25)'
          }}>
            {schemaData.tables.length} Core Entities Mapped
          </span>
        </div>

        {/* ERD Table Cards Grid */}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
