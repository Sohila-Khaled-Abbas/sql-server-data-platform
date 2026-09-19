import React from 'react';
import { 
  ArrowRight, 
  Database, 
  Layers, 
  Zap, 
  FileCode2, 
  BarChart3, 
  Terminal, 
  Container, 
  Workflow, 
  CheckCircle2 
} from 'lucide-react';
import GithubIcon from './icons/GithubIcon.jsx';
import { REPO_METADATA, TECH_BADGES } from '../data/repositoryData.js';

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="container">
        {/* Meta Tag */}
        <div className="hero-meta-strip">
          <span className="section-tag">
            <Database size={14} />
            ENTERPRISE DATA PLATFORM &bull; DBRE ARCHITECTURE
          </span>
          <span style={{ 
            fontSize: '0.78rem', 
            fontFamily: 'var(--font-mono)', 
            color: 'var(--text-muted)',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '4px 10px',
            borderRadius: '12px'
          }}>
            MS SQL Server 2022
          </span>
        </div>

        {/* Headline */}
        <h1 className="hero-title">
          {REPO_METADATA.title.split('&')[0]} &amp; <br />
          <span>{REPO_METADATA.title.split('&')[1] || 'DBRE Sandbox'}</span>
        </h1>

        {/* Lead description strictly derived from README */}
        <p className="hero-lead">
          {REPO_METADATA.tagline}
        </p>

        {/* Verified Tech Badges */}
        <div className="hero-badges-wrapper">
          {TECH_BADGES.map((b) => (
            <div key={b.name} className="tech-badge-item">
              <span style={{ 
                width: 7, 
                height: 7, 
                borderRadius: '50%', 
                background: b.color,
                display: 'inline-block' 
              }} />
              <span>{b.name}</span>
            </div>
          ))}
        </div>

        {/* Primary CTA Buttons */}
        <div className="hero-actions">
          <a
            href={REPO_METADATA.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <GithubIcon size={18} />
            <span>View on GitHub</span>
            <ArrowRight size={16} />
          </a>

          <a href="#architecture" className="btn-secondary">
            <span>Explore Architecture</span>
          </a>

          <a href="#sql-engineering" className="btn-secondary">
            <span>SQL Engineering</span>
          </a>
        </div>

        {/* Abstract Data Platform Pipeline Visualization */}
        <div className="hero-visual-card">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--accent-red)',
              fontWeight: 700
            }}>
              LIVE DATA PIPELINE TOPOLOGY
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--accent-emerald)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              Deterministic Flow Verified
            </span>
          </div>

          <div className="hero-pipeline-track">
            {/* Step 1: Raw Data */}
            <div className="hero-node">
              <div className="hero-node-icon">
                <Zap size={22} />
              </div>
              <div className="hero-node-name">Raw Ingestion</div>
              <div className="hero-node-sub">TVP Batch &bull; XML .nodes()</div>
            </div>

            {/* Step 2: Processing */}
            <div className="hero-node">
              <div className="hero-node-icon">
                <FileCode2 size={22} />
              </div>
              <div className="hero-node-name">ACID Pipelines</div>
              <div className="hero-node-sub">XACT_ABORT &bull; TRY...CATCH</div>
            </div>

            {/* Step 3: SQL Server */}
            <div className="hero-node active-hub">
              <div className="hero-node-icon">
                <Database size={22} />
              </div>
              <div className="hero-node-name">OmniFlowDB</div>
              <div className="hero-node-sub">4 Filegroups &bull; Partitioning</div>
            </div>

            {/* Step 4: Data Model */}
            <div className="hero-node">
              <div className="hero-node-icon">
                <Layers size={22} />
              </div>
              <div className="hero-node-name">OmniFlowDW</div>
              <div className="hero-node-sub">Kimball Star &bull; SCD Type 2</div>
            </div>

            {/* Step 5: Analytics */}
            <div className="hero-node">
              <div className="hero-node-icon">
                <BarChart3 size={22} />
              </div>
              <div className="hero-node-name">Analytics &amp; SSRS</div>
              <div className="hero-node-sub">FactSales &bull; .rdl Reports</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
