import React, { useState } from 'react';
import { 
  Database, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  FolderGit2, 
  ExternalLink,
  ChevronRight,
  HardDrive
} from 'lucide-react';
import { ARCHITECTURE_LAYERS, REPO_METADATA } from '../data/repositoryData.js';

export default function ArchitectureSection() {
  const [activeLayerId, setActiveLayerId] = useState(ARCHITECTURE_LAYERS[0].id);
  const [inspectedComponent, setInspectedComponent] = useState(ARCHITECTURE_LAYERS[0].components[0]);

  const activeLayer = ARCHITECTURE_LAYERS.find(l => l.id === activeLayerId) || ARCHITECTURE_LAYERS[0];

  return (
    <section id="architecture" className="section">
      <div className="container">
        <span className="section-tag">SYSTEM TOPOLOGY</span>
        <h2 className="section-title">Data Platform Architecture</h2>
        <p className="section-subtitle">
          An end-to-end layered architecture separating high-throughput transactional OLTP from decoupled Kimball analytical warehousing and automated governance.
        </p>

        {/* Layer Selector Tabs */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '2rem'
        }}>
          {ARCHITECTURE_LAYERS.map((layer) => {
            const isActive = layer.id === activeLayerId;
            return (
              <button
                key={layer.id}
                onClick={() => {
                  setActiveLayerId(layer.id);
                  setInspectedComponent(layer.components[0]);
                }}
                style={{
                  background: isActive ? 'rgba(225, 29, 72, 0.15)' : 'var(--bg-surface)',
                  border: `1px solid ${isActive ? 'var(--accent-red)' : 'var(--border-subtle)'}`,
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  padding: '0.65rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>{layer.name.split('&')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Main Architecture Inspector Display */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* Left: Interactive Components Grid for the Active Layer */}
          <div className="arch-layer-card">
            <div className="arch-layer-header">
              <div className="arch-layer-title">
                <Database size={20} className="text-red" style={{ color: 'var(--accent-red)' }} />
                <span>{activeLayer.name}</span>
              </div>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--accent-cyan)',
                background: 'rgba(56, 189, 248, 0.08)',
                padding: '3px 8px',
                borderRadius: '4px'
              }}>
                {activeLayer.repoPath}
              </span>
            </div>

            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.95rem',
              marginBottom: '1.75rem',
              lineHeight: 1.6
            }}>
              {activeLayer.description}
            </p>

            <div className="arch-components-grid">
              {activeLayer.components.map((comp) => {
                const isSelected = inspectedComponent?.name === comp.name;
                return (
                  <div
                    key={comp.name}
                    className="arch-comp-box"
                    onClick={() => setInspectedComponent(comp)}
                    style={{
                      borderColor: isSelected ? 'var(--accent-red)' : 'var(--border-subtle)',
                      background: isSelected ? 'rgba(225, 29, 72, 0.08)' : 'var(--bg-surface)'
                    }}
                  >
                    <div>
                      <div className="arch-comp-name" style={{ color: isSelected ? 'var(--accent-red)' : 'var(--accent-cyan)' }}>
                        {comp.name}
                      </div>
                      <div className="arch-comp-role">{comp.role}</div>
                    </div>
                    <div className="arch-comp-file-wrapper" title={comp.file}>
                      <FolderGit2 size={12} style={{ flexShrink: 0, color: isSelected ? 'var(--accent-red)' : 'var(--accent-cyan)' }} />
                      <span className="arch-comp-file-text">{comp.file}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Component Detail & GitHub Link Card */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            position: 'sticky',
            top: '6rem'
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--accent-red)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 700
            }}>
              COMPONENT INSPECTOR
            </span>

            {inspectedComponent ? (() => {
              const resolvedPath = inspectedComponent.file.startsWith('src/') || inspectedComponent.file.startsWith('docs/')
                ? inspectedComponent.file
                : `${activeLayer.repoPath}${inspectedComponent.file}`;
              return (
                <div style={{ marginTop: '1rem' }}>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: '0.5rem'
                  }}>
                    {inspectedComponent.name}
                  </h3>

                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    marginBottom: '1.5rem'
                  }}>
                    {inspectedComponent.role}
                  </p>

                  <div style={{
                    background: 'var(--bg-deep)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      Repository Implementation:
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      color: 'var(--accent-cyan)',
                      wordBreak: 'break-all'
                    }}>
                      {resolvedPath}
                    </div>
                  </div>

                  <a
                    href={`${REPO_METADATA.repoUrl}/blob/master/${resolvedPath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ width: '100%' }}
                  >
                    <span>View File in GitHub</span>
                    <ExternalLink size={15} />
                  </a>
                </div>
              );
            })() : (
              <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
                Click any component on the left to inspect its implementation details.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
