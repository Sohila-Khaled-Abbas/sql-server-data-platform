import React from 'react';
import { DATA_FLOW_STAGES, REPO_METADATA } from '../data/repositoryData.js';
import { ExternalLink, ArrowRight, Activity } from 'lucide-react';

export default function DataFlowSection() {
  return (
    <section id="data-flow" className="section">
      <div className="container">
        <span className="section-tag">PIPELINE EXECUTION</span>
        <h2 className="section-title">How the Data Flows</h2>
        <p className="section-subtitle">
          The end-to-end data lifecycle from bulk client payload streaming to non-blocking audit logging, zero-IO archival, and dimensional star schema aggregation.
        </p>

        <div className="data-flow-container">
          {DATA_FLOW_STAGES.map((stage, idx) => (
            <div key={stage.step} className="flow-step-card">
              {/* Step Number with subtle pulsing indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="flow-step-num">{stage.step}</span>
              </div>

              {/* Stage Description & Details */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                  <h3 className="flow-step-name">{stage.name}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>&bull; {stage.subtitle}</span>
                </div>
                <p className="flow-step-desc">{stage.desc}</p>
                <div style={{ marginTop: '0.6rem' }}>
                  <a
                    href={`${REPO_METADATA.repoUrl}/blob/master/${stage.repoRef}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.76rem',
                      color: 'var(--accent-red)',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <span>{stage.repoRef}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* Technology & Pattern Badge */}
              <div style={{ justifySelf: 'end' }}>
                <div className="flow-step-tech-badge">
                  {stage.tech}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
