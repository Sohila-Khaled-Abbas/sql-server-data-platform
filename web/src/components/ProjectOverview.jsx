import React from 'react';
import { Database, ShieldCheck, Layers, GitBranch, Cpu, Server } from 'lucide-react';
import { REPO_METADATA } from '../data/repositoryData.js';

export default function ProjectOverview() {
  return (
    <section id="overview" className="section">
      <div className="container">
        <span className="section-tag">EXECUTIVE SUMMARY</span>
        <h2 className="section-title">What is this project?</h2>
        <p className="section-subtitle">
          An operational proof-of-competency engineered from the official ITI / MaharaTech curriculum for modern Data Engineering &amp; Database Reliability Engineering.
        </p>

        <div className="overview-grid">
          {/* Left: Project Narrative */}
          <div className="overview-content">
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.4rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '1rem'
            }}>
              Bridging Theory and Enterprise Database Operations
            </h3>

            <p className="overview-paragraph">
              Most relational database projects remain simple collections of disjointed SQL scripts. 
              <strong> {REPO_METADATA.name}</strong> was engineered to demonstrate a complete, production-grade enterprise data platform on <strong>Microsoft SQL Server 2022</strong>. It models the entire operational lifecycle from physical storage allocation and high-throughput batch ingestion to analytical warehousing.
            </p>

            <p className="overview-paragraph">
              The project is directly aligned with <strong>{REPO_METADATA.curriculum}</strong>, taught by {REPO_METADATA.instructor} at the <strong>{REPO_METADATA.institution}</strong>. Rather than isolated exercises, every module builds upon a unified architectural framework.
            </p>

            <h4 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--accent-red)',
              margin: '1.5rem 0 0.75rem'
            }}>
              Core Technical Capabilities Built:
            </h4>
            <ul style={{
              paddingLeft: '1.25rem',
              color: 'var(--text-secondary)',
              fontSize: '0.98rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem'
            }}>
              <li>
                <strong>Multi-Filegroup Storage Segregation:</strong> Isolating system catalogs (<code>PRIMARY</code>), active transactional tables (<code>DATA_FG</code>), non-clustered indexes (<code>INDEX_FG</code>), and cold historical data (<code>ARCHIVE_FG</code>).
              </li>
              <li>
                <strong>Zero-I/O Sliding Window Partitioning:</strong> Range Right date partitioning with <code>SWITCH PARTITION</code> for instantaneous historical data archival without table locks.
              </li>
              <li>
                <strong>High-Throughput Procedural ETL:</strong> Streaming batch payloads via Table-Valued Parameters (TVPs) and shredding semi-structured XML with XQuery.
              </li>
              <li>
                <strong>ACID Resiliency &amp; Non-Blocking CDC:</strong> Strict <code>SET XACT_ABORT ON</code> error containment and audit tracking via the virtual <code>inserted</code> and <code>deleted</code> tables.
              </li>
              <li>
                <strong>Kimball Analytical Warehousing:</strong> 3NF OLTP transformation into an analytical Star Schema with Slowly Changing Dimensions (SCD Type 1 &amp; 2).
              </li>
            </ul>
          </div>

          {/* Right: Interactive Project Summary Card */}
          <div className="overview-card-meta">
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.5rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid var(--border-subtle)'
              }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'rgba(225, 29, 72, 0.15)',
                  color: 'var(--accent-red)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Server size={20} />
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700 }}>
                    Project Metadata
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Verified Repository Telemetry</span>
                </div>
              </div>

              <div className="meta-row">
                <span className="meta-label">Target Engine</span>
                <span className="meta-val">MSSQL 2022 Dev</span>
              </div>

              <div className="meta-row">
                <span className="meta-label">Primary Language</span>
                <span className="meta-val">T-SQL (Transact-SQL)</span>
              </div>

              <div className="meta-row">
                <span className="meta-label">Architecture</span>
                <span className="meta-val">OLTP + Kimball OLAP</span>
              </div>

              <div className="meta-row">
                <span className="meta-label">Database Schemas</span>
                <span className="meta-val">OmniFlowDB &bull; OmniFlowDW</span>
              </div>

              <div className="meta-row">
                <span className="meta-label">Case Study DB</span>
                <span className="meta-val">ITItest (3NF Company ERD)</span>
              </div>

              <div className="meta-row">
                <span className="meta-label">Ingestion Pattern</span>
                <span className="meta-val">TVP &bull; XML .nodes()</span>
              </div>

              <div className="meta-row">
                <span className="meta-label">SCD Support</span>
                <span className="meta-val">SCD Type 1 &amp; Type 2</span>
              </div>

              <div className="meta-row">
                <span className="meta-label">CI/CD Harness</span>
                <span className="meta-val">Docker + pytest + tSQLt</span>
              </div>

              <div className="meta-row">
                <span className="meta-label">License</span>
                <span className="meta-val">{REPO_METADATA.license}</span>
              </div>
            </div>

            <div style={{
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              textAlign: 'center'
            }}>
              <a
                href={REPO_METADATA.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  color: 'var(--accent-red)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                <GitBranch size={15} />
                <span>View Full Source on GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
