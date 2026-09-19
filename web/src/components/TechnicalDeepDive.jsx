import React from 'react';
import { TECHNICAL_DEEP_DIVES, REPO_METADATA } from '../data/repositoryData.js';
import { HardDrive, ExternalLink, ShieldCheck, ArrowRight, FileCode } from 'lucide-react';

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
          {TECHNICAL_DEEP_DIVES.map((dive, idx) => (
            <div key={dive.title} className="deep-dive-card">
              <div className="deep-dive-content-wrapper">
                <div className="deep-dive-pillar-badge">
                  <HardDrive size={13} />
                  <span>PILLAR 0{idx + 1}</span>
                </div>

                <h3 className="deep-dive-title">{dive.title}</h3>
                <div className="deep-dive-concept">{dive.concept}</div>

                <div className="deep-dive-block">
                  <div className="deep-dive-tag deep-dive-tag-why">
                    <ShieldCheck size={12} />
                    <span>WHY IT MATTERS</span>
                  </div>
                  <p className="deep-dive-body">
                    {dive.why}
                  </p>
                </div>

                <div className="deep-dive-block">
                  <div className="deep-dive-tag deep-dive-tag-impl">
                    <FileCode size={12} />
                    <span>IMPLEMENTATION</span>
                  </div>
                  <p className="deep-dive-body">
                    {dive.implementation}
                  </p>
                </div>
              </div>

              {/* Elevated Boxed Action Button Pinned Symmetrically to Bottom */}
              <div className="deep-dive-action-box">
                <a
                  href={`${REPO_METADATA.repoUrl}/blob/master/${dive.repoFile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="deep-dive-action-btn"
                  title={`Inspect ${dive.repoFile} on GitHub`}
                >
                  <div className="deep-dive-action-left">
                    <div className="deep-dive-action-icon">
                      <FileCode size={16} />
                    </div>
                    <div className="deep-dive-action-info">
                      <span className="deep-dive-action-label">Inspect Source Script</span>
                      <span className="deep-dive-action-path">{dive.repoFile}</span>
                    </div>
                  </div>
                  <div className="deep-dive-action-arrow">
                    <ExternalLink size={15} />
                  </div>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
