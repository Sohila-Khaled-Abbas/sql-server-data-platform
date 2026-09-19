import React from 'react';
import { CREATOR_PROFILE, REPO_METADATA } from '../data/repositoryData.js';
import { ExternalLink, GraduationCap, Award } from 'lucide-react';
import GithubIcon from './icons/GithubIcon.jsx';

export default function AboutCreatorSection() {
  return (
    <section className="section" style={{ borderTop: '1px solid var(--border-subtle)' }}>
      <div className="container">
        <span className="section-tag">PORTFOLIO ARCHITECT</span>
        <h2 className="section-title">About the Creator</h2>
        <p className="section-subtitle">
          Data Engineering &bull; Database Reliability Engineering &bull; Modern Analytics Platform
        </p>

        <div className="creator-card">
          <div className="creator-avatar-box">
            <div className="creator-avatar-inner">
              {CREATOR_PROFILE.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
          </div>

          <div>
            <h3 className="creator-name">{CREATOR_PROFILE.name}</h3>
            <div className="creator-role">{CREATOR_PROFILE.title}</div>

            <p className="creator-bio">
              {CREATOR_PROFILE.bio}
            </p>

            <div style={{
              marginTop: '1.5rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center'
            }}>
              <a
                href={CREATOR_PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem' }}
              >
                <GithubIcon size={15} />
                <span>GitHub Profile</span>
                <ExternalLink size={12} />
              </a>

              <a
                href={REPO_METADATA.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem' }}
              >
                <span>Project Repository</span>
                <ExternalLink size={12} />
              </a>

              <span style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)'
              }}>
                ITI Course 2305 &bull; Eng. Rami Mohamed Abonagi
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
