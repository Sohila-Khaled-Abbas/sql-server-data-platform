import React from 'react';
import { HardDrive, Zap, Layers, Cpu, ShieldCheck, Workflow } from 'lucide-react';

export default function ProjectHighlights() {
  const highlights = [
    {
      icon: <HardDrive size={24} style={{ color: '#e11d48' }} />,
      title: 'Multi-Filegroup I/O Isolation',
      desc: 'Segregates transactional writes from random index lookups and historical date partitions into 4 isolated physical storage tiers.'
    },
    {
      icon: <Zap size={24} style={{ color: '#38bdf8' }} />,
      title: 'Zero-I/O Sliding Window Archival',
      desc: 'Implements metadata-only horizontal partition switching on date boundaries (Sales.Invoices), eliminating bulk delete table locking.'
    },
    {
      icon: <Workflow size={24} style={{ color: '#10b981' }} />,
      title: 'Network-Optimized TVP Streaming',
      desc: 'Replaces chatty row-by-row API operations with strongly typed Table-Valued Parameters, streaming batch payloads in a single trip.'
    },
    {
      icon: <Layers size={24} style={{ color: '#f59e0b' }} />,
      title: 'Kimball Star Schema & SCD-2',
      desc: 'Engineers an analytical dimensional mart (OmniFlowDW) with conformed dimensions, surrogate keys, and automated SCD Type 2 tracking.'
    },
    {
      icon: <Cpu size={24} style={{ color: '#a855f7' }} />,
      title: 'In-Engine Cryptographic CLR',
      desc: 'Integrates custom C# compiled assemblies inside the database engine to perform high-speed SHA-256 hashing and regular expressions.'
    },
    {
      icon: <ShieldCheck size={24} style={{ color: '#22c55e' }} />,
      title: 'Containerized CI/CD Test Harness',
      desc: 'Automates end-to-end integration testing using pytest against a live Docker SQL Server 2022 instance on every GitHub pull request.'
    }
  ];

  return (
    <section className="section" style={{ background: 'rgba(255, 255, 255, 0.01)' }}>
      <div className="container">
        <span className="section-tag">COMPETENCY HIGHLIGHTS</span>
        <h2 className="section-title">Project Highlights</h2>
        <p className="section-subtitle">
          Concrete database engineering achievements directly demonstrated and verified in the repository codebase.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {highlights.map((h) => (
            <div
              key={h.title}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'rgba(255, 255, 255, 0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                {h.icon}
              </div>

              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.2rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '0.5rem'
              }}>
                {h.title}
              </h3>

              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '0.92rem',
                lineHeight: 1.6
              }}>
                {h.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
