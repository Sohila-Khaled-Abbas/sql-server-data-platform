import React, { useState } from 'react';
import { Database, Menu, X, ExternalLink } from 'lucide-react';
import GithubIcon from './icons/GithubIcon.jsx';
import { REPO_METADATA } from '../data/repositoryData.js';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'Overview', href: '#overview' },
    { label: 'Architecture', href: '#architecture' },
    { label: 'Databases', href: '#database-design', badge: '3 DBs' },
    { label: 'Data Flow', href: '#data-flow' },
    { label: 'SQL Showcase', href: '#sql-engineering' },
    { label: 'Curriculum', href: '#curriculum', badge: '102' },
    { label: 'Deep Dive', href: '#deep-dive' },
    { label: 'Repository', href: '#repository-explorer' },
    { label: 'Tech Stack', href: '#tech-stack' }
  ];

  return (
    <header className="site-nav">
      <div className="container nav-container">
        <a href="#" className="nav-brand">
          <div className="nav-brand-icon">
            <Database size={18} />
          </div>
          <div className="nav-brand-text">
            <span className="nav-brand-title">OmniFlow</span>
            <span className="nav-brand-badge">SQL Server 2022</span>
          </div>
        </a>

        {/* Desktop Links */}
        <nav>
          <ul className="nav-links">
            {navLinks.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="nav-link">
                  <span>{item.label}</span>
                  {item.badge && <span className="nav-link-badge">{item.badge}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Actions: Live DB Status & GitHub */}
        <div className="nav-actions">
          <div className="nav-status-pill" title="Live Instances: OmniFlowDB, OmniFlowDW, ITI & DB2">
            <span className="nav-status-dot" />
            <span>3 DBs Online</span>
          </div>

          <a
            href={REPO_METADATA.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-github-btn"
          >
            <GithubIcon size={15} />
            <span>GitHub</span>
            <ExternalLink size={12} style={{ opacity: 0.6 }} />
          </a>

          <button
            className="nav-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div style={{
          background: 'var(--bg-deep)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="nav-link"
              style={{ fontSize: '1rem', padding: '0.5rem 0' }}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
