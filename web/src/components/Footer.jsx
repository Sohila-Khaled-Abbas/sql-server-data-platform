import React from 'react';
import { Database } from 'lucide-react';
import { REPO_METADATA } from '../data/repositoryData.js';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: 'rgba(225, 29, 72, 0.15)',
            color: 'var(--accent-red)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Database size={15} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-primary)' }}>
              {REPO_METADATA.name}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Microsoft SQL Server 2022 Data Platform &bull; {REPO_METADATA.license} License
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.5rem',
          fontSize: '0.85rem'
        }}>
          <a href="#overview" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Overview</a>
          <a href="#architecture" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Architecture</a>
          <a href="#database-design" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Database Design</a>
          <a href="#data-flow" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Data Flow</a>
          <a href="#sql-engineering" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>SQL Engineering</a>
          <a href="#deep-dive" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Deep Dive</a>
          <a href="#repository-explorer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Repository</a>
          <a href={REPO_METADATA.repoUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-red)', textDecoration: 'none' }}>GitHub &rarr;</a>
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textAlign: 'right' }}>
          Engineered by {REPO_METADATA.owner} &bull; {REPO_METADATA.updatedDate}
        </div>
      </div>
    </footer>
  );
}
