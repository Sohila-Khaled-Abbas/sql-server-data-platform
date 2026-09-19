import React from 'react';
import { TECHNICAL_DEEP_DIVES, REPO_METADATA } from '../data/repositoryData.js';
import { HardDrive, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';

export default function TechnicalDeepDive() {
  return (
    <section id="deep-dive" className="section">
      <div className="container">
        <span className="section-tag">ENGINEERING RIGOR</span>
        <h2 className="section-title">Technical Deep Dive</h2>
        <p className="section-subtitle">
          Architectural decisions, storage engine trade-offs, and operational reliability standards implemented across the platform.
        </p>

        <div className="deep-dive-grid">
          {TECHNICAL_DEEP_DIVES.map((dive) => (
            <div key={dive.title} className="deep-dive-card">
              <h3 className="deep-dive-title">{dive.title}</h3>
              <div className="deep-dive-concept">{dive.concept}</div>

              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-red)', fontWeight: 700 }}>
                  WHY IT MATTERS:
                </span>
                <p className="deep-dive-body" style={{ marginTop: '0.25rem' }}>
                  {dive.why}
                </p>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                  IMPLEMENTATION:
                </span>
                <p className="deep-dive-body" style={{ marginTop: '0.25rem' }}>
                  {dive.implementation}
                </p>
              </div>

              <div style={{
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <a
                  href={`${REPO_METADATA.repoUrl}/blob/master/${dive.repoFile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <span>{dive.repoFile}</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
