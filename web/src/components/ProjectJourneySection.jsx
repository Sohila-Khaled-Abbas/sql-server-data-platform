import React from 'react';
import { PROJECT_JOURNEY_STAGES, REPO_METADATA } from '../data/repositoryData.js';
import { ExternalLink } from 'lucide-react';

export default function ProjectJourneySection() {
  return (
    <section id="journey" className="section">
      <div className="container">
        <span className="section-tag">ENGINEERING ROADMAP</span>
        <h2 className="section-title">From Problem to Platform</h2>
        <p className="section-subtitle">
          The step-by-step engineering progression that transformed lecture concepts into an automated enterprise database platform.
        </p>

        <div className="journey-timeline">
          {PROJECT_JOURNEY_STAGES.map((stage) => (
            <div key={stage.number} className="journey-node">
              <div className="journey-dot" />

              <div className="journey-phase-title">
                STAGE {stage.number} &bull; {stage.phase}
              </div>

              <h3 className="journey-heading">{stage.title}</h3>

              <p className="journey-desc">{stage.description}</p>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.6rem',
                marginTop: '0.75rem'
              }}>
                {stage.artifacts.map((art) => (
                  <a
                    key={art}
                    href={`${REPO_METADATA.repoUrl}/blob/master/${art}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.74rem',
                      color: 'var(--accent-red)',
                      background: 'rgba(225, 29, 72, 0.08)',
                      border: '1px solid rgba(225, 29, 72, 0.2)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <span>{art}</span>
                    <ExternalLink size={10} />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
