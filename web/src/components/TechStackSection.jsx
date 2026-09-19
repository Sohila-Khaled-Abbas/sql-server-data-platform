import React from 'react';
import { Database, Code2, Layers, Terminal, Container, CheckCircle2 } from 'lucide-react';

export default function TechStackSection() {
  const stackGroups = [
    {
      category: 'Database Engine',
      icon: <Database size={18} style={{ color: '#e11d48' }} />,
      items: [
        { name: 'Microsoft SQL Server 2022', role: 'Target enterprise relational engine running OLTP and OLAP databases.' },
        { name: 'Transact-SQL (T-SQL)', role: 'Core language for physical filegroups, partitioning, triggers, and procedures.' },
        { name: 'SQL Server Storage Engine', role: 'Multi-filegroup IO isolation (PRIMARY, DATA_FG, INDEX_FG, ARCHIVE_FG).' }
      ]
    },
    {
      category: 'Data Warehousing & Modeling',
      icon: <Layers size={18} style={{ color: '#38bdf8' }} />,
      items: [
        { name: 'Kimball Star Schema', role: 'Dimensional architecture for OmniFlowDW with conformed dimensions.' },
        { name: 'Slowly Changing Dimensions', role: 'Native implementation of SCD Type 1 and Type 2 validity tracking.' },
        { name: '3NF Relational Modeling', role: 'Peter Chen ERD mapping to 3NF schemas with circular foreign keys.' }
      ]
    },
    {
      category: 'Languages & Extensibility',
      icon: <Code2 size={18} style={{ color: '#10b981' }} />,
      items: [
        { name: 'Python 3.10+', role: 'Automated test suites, synthetic data generation, and SMO administration.' },
        { name: 'C# (.NET Framework)', role: 'In-engine compiled SQL CLR assemblies for SHA-256 and regex.' },
        { name: 'PowerShell 7+', role: 'Deployment orchestration and SMO backup verification scripts.' }
      ]
    },
    {
      category: 'Automation & Operations',
      icon: <Terminal size={18} style={{ color: '#f59e0b' }} />,
      items: [
        { name: 'Microsoft SMO', role: 'SQL Server Management Objects for declarative schema generation.' },
        { name: 'SQL Server Agent', role: 'Automated maintenance jobs for Full, Diff, and 15-min Log backup chains.' },
        { name: 'SSRS (.rdl)', role: 'SQL Server Reporting Services parameterized operational report definitions.' }
      ]
    },
    {
      category: 'Infrastructure & DevOps',
      icon: <Container size={18} style={{ color: '#a855f7' }} />,
      items: [
        { name: 'Docker & Docker Compose', role: 'Containerized SQL Server 2022 Developer environment for local & CI tests.' },
        { name: 'GitHub Actions', role: 'Automated CI/CD workflows for T-SQL validation, container integration, and deploy.' },
        { name: 'Dependabot', role: 'Automated dependency and security vulnerability management.' }
      ]
    },
    {
      category: 'Testing & Verification',
      icon: <CheckCircle2 size={18} style={{ color: '#22c55e' }} />,
      items: [
        { name: 'pytest', role: 'Python DBRE integration harness asserting schemas and throughput against SQL Server.' },
        { name: 'pyodbc', role: 'ODBC connection driver for programmatic SQL Server test execution.' },
        { name: 'tSQLt', role: 'In-engine database unit testing classes for stored procedure assertions.' }
      ]
    }
  ];

  return (
    <section id="tech-stack" className="section">
      <div className="container">
        <span className="section-tag">VERIFIED TECHNOLOGIES</span>
        <h2 className="section-title">Technology Stack</h2>
        <p className="section-subtitle">
          Every technology listed is actively utilized and verified in the repository codebase without external dependencies or fabricated claims.
        </p>

        <div className="tech-stack-grid">
          {stackGroups.map((group) => (
            <div key={group.category} className="stack-category-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                {group.icon}
                <h3 className="stack-cat-title" style={{ margin: 0, padding: 0, border: 'none' }}>
                  {group.category}
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {group.items.map((item) => (
                  <div key={item.name} style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.85rem'
                  }}>
                    <div style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      marginBottom: '0.25rem'
                    }}>
                      {item.name}
                    </div>
                    <div style={{
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.45
                    }}>
                      {item.role}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
