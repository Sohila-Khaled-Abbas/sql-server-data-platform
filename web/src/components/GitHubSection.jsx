import React, { useState } from 'react';
import { ExternalLink, Copy, Check, GitFork, Star, Terminal } from 'lucide-react';
import GithubIcon from './icons/GithubIcon.jsx';
import { REPO_METADATA } from '../data/repositoryData.js';

export default function GitHubSection() {
  const [copied, setCopied] = useState(false);
  const cloneCmd = `git clone ${REPO_METADATA.repoUrl}.git`;

  const handleCopyClone = () => {
    navigator.clipboard.writeText(cloneCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="section">
      <div className="container">
        <div className="github-cta-banner">
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            color: '#fff'
          }}>
            <GithubIcon size={32} />
          </div>

          <h2 className="cta-title">Explore the Full Project</h2>
          <p className="cta-desc">
            The entire SQL Server Data Platform codebase—including migration scripts, containerized CI workflows, deep-dive handbooks, and SSRS reports—is open source and available on GitHub.
          </p>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <a
              href={REPO_METADATA.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ fontSize: '1.05rem', padding: '0.9rem 2rem' }}
            >
              <GithubIcon size={18} />
              <span>View Repository on GitHub</span>
              <ExternalLink size={15} />
            </a>

            <a
              href={`${REPO_METADATA.repoUrl}/issues`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <span>Explore Issues &amp; RFCs</span>
            </a>
          </div>

          {/* Quick Clone Terminal Box */}
          <div style={{
            maxWidth: 580,
            margin: '0 auto',
            background: 'rgba(6, 8, 13, 0.8)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            color: 'var(--accent-cyan)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
              <Terminal size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {cloneCmd}
              </span>
            </div>

            <button
              onClick={handleCopyClone}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                flexShrink: 0,
                marginLeft: '1rem'
              }}
              title="Copy clone command"
            >
              {copied ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Secondary Metadata Badges */}
          <div style={{
            marginTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1.5rem',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)'
          }}>
            <span>Owner: {REPO_METADATA.owner}</span>
            <span>&bull;</span>
            <span>Repo: {REPO_METADATA.name}</span>
            <span>&bull;</span>
            <span>License: {REPO_METADATA.license}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
