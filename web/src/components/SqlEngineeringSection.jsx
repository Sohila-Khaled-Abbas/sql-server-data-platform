import React, { useState } from 'react';
import { SQL_ENGINEERING_SHOWCASE, REPO_METADATA } from '../data/repositoryData.js';
import { Copy, Check, ExternalLink, Code2 } from 'lucide-react';

export default function SqlEngineeringSection() {
  const [selectedTechId, setSelectedTechId] = useState(SQL_ENGINEERING_SHOWCASE[0].id);
  const [copied, setCopied] = useState(false);

  const activeTech = SQL_ENGINEERING_SHOWCASE.find(t => t.id === selectedTechId) || SQL_ENGINEERING_SHOWCASE[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeTech.snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="sql-engineering" className="section">
      <div className="container">
        <span className="section-tag">ADVANCED T-SQL PATTERNS</span>
        <h2 className="section-title">SQL Engineering</h2>
        <p className="section-subtitle">
          Battle-tested T-SQL programming patterns extracted directly from the repository—prioritizing set-based operations, ACID guarantees, and storage engine optimization.
        </p>

        <div className="sql-eng-shell">
          {/* Left: Technique Selector Sidebar */}
          <div className="sql-nav-panel">
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '0.5rem',
              paddingLeft: '0.5rem'
            }}>
              Curated Techniques
            </span>

            {SQL_ENGINEERING_SHOWCASE.map((tech) => {
              const isActive = tech.id === selectedTechId;
              return (
                <button
                  key={tech.id}
                  onClick={() => {
                    setSelectedTechId(tech.id);
                    setCopied(false);
                  }}
                  className={`sql-nav-item ${isActive ? 'active' : ''}`}
                >
                  <div>{tech.title}</div>
                  <div style={{ fontSize: '0.74rem', color: isActive ? '#fff' : 'var(--text-muted)', fontWeight: 400 }}>
                    {tech.category}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Code & Detail Display */}
          <div className="sql-code-display">
            <div className="code-header-bar">
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                  {activeTech.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
                  {activeTech.summary}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                <button onClick={handleCopy} className="copy-code-btn">
                  {copied ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy Code'}</span>
                </button>

                <a
                  href={`${REPO_METADATA.repoUrl}/blob/master/${activeTech.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="copy-code-btn"
                  title="View file in GitHub repository"
                >
                  <ExternalLink size={14} />
                  <span>GitHub</span>
                </a>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
              padding: '0 0.5rem'
            }}>
              <span className="code-file-label">&bull; {activeTech.file}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                T-SQL
              </span>
            </div>

            <pre className="code-block-pre">
              <code>{activeTech.snippet}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
