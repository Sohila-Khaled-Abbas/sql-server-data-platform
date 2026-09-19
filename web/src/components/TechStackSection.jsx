import React from 'react';
import { Database, Code2, Layers, Terminal, Container, CheckCircle2, Server, Workflow, FileText, Cpu } from 'lucide-react';
import {
  SqlServerLogo,
  PythonLogo,
  CSharpLogo,
  PowerShellLogo,
  DockerLogo,
  GitHubActionsLogo,
  PytestLogo,
  TsqltLogo,
  KimballLogo,
  SsrsLogo,
  SmoLogo,
  TsqlLogo
} from './icons/TechLogos.jsx';

export default function TechStackSection() {
  const stackGroups = [
    {
      category: 'Database Engine',
      badge: 'Core Engine',
      icon: <Database size={18} style={{ color: '#e11d48' }} />,
      items: [
        { 
          name: 'Microsoft SQL Server 2022', 
          role: 'Target enterprise relational engine running OLTP and OLAP databases.',
          logo: <SqlServerLogo size={24} />
        },
        { 
          name: 'Transact-SQL (T-SQL)', 
          role: 'Core language for physical filegroups, partitioning, triggers, and procedures.',
          logo: <TsqlLogo size={24} />
        },
        { 
          name: 'SQL Server Storage Engine', 
          role: 'Multi-filegroup IO isolation (PRIMARY, DATA_FG, INDEX_FG, ARCHIVE_FG).',
          logo: <Server size={24} style={{ color: '#e11d48' }} />
        }
      ]
    },
    {
      category: 'Data Warehousing & Modeling',
      badge: 'OLAP / Kimball',
      icon: <Layers size={18} style={{ color: '#38bdf8' }} />,
      items: [
        { 
          name: 'Kimball Star Schema', 
          role: 'Dimensional architecture for OmniFlowDW with conformed dimensions.',
          logo: <KimballLogo size={24} />
        },
        { 
          name: 'Slowly Changing Dimensions', 
          role: 'Native implementation of SCD Type 1 and Type 2 validity tracking.',
          logo: <Layers size={24} style={{ color: '#38bdf8' }} />
        },
        { 
          name: '3NF Relational Modeling', 
          role: 'Peter Chen ERD mapping to 3NF schemas with circular foreign keys.',
          logo: <Workflow size={24} style={{ color: '#0ea5e9' }} />
        }
      ]
    },
    {
      category: 'Languages & Extensibility',
      badge: 'Development',
      icon: <Code2 size={18} style={{ color: '#10b981' }} />,
      items: [
        { 
          name: 'Python 3.10+', 
          role: 'Automated test suites, synthetic data generation, and SMO administration.',
          logo: <PythonLogo size={24} />
        },
        { 
          name: 'C# (.NET Framework)', 
          role: 'In-engine compiled SQL CLR assemblies for SHA-256 and regex.',
          logo: <CSharpLogo size={24} />
        },
        { 
          name: 'PowerShell 7+', 
          role: 'Deployment orchestration and SMO backup verification scripts.',
          logo: <PowerShellLogo size={24} />
        }
      ]
    },
    {
      category: 'Automation & Operations',
      badge: 'Administration',
      icon: <Terminal size={18} style={{ color: '#f59e0b' }} />,
      items: [
        { 
          name: 'Microsoft SMO', 
          role: 'SQL Server Management Objects for declarative schema generation.',
          logo: <SmoLogo size={24} />
        },
        { 
          name: 'SQL Server Agent', 
          role: 'Automated maintenance jobs for Full, Diff, and 15-min Log backup chains.',
          logo: <Terminal size={24} style={{ color: '#f59e0b' }} />
        },
        { 
          name: 'SSRS (.rdl)', 
          role: 'SQL Server Reporting Services parameterized operational report definitions.',
          logo: <SsrsLogo size={24} />
        }
      ]
    },
    {
      category: 'Infrastructure & DevOps',
      badge: 'Containers & CI',
      icon: <Container size={18} style={{ color: '#a855f7' }} />,
      items: [
        { 
          name: 'Docker & Docker Compose', 
          role: 'Containerized SQL Server 2022 Developer environment for local & CI tests.',
          logo: <DockerLogo size={24} />
        },
        { 
          name: 'GitHub Actions', 
          role: 'Automated CI/CD workflows for T-SQL validation, container integration, and deploy.',
          logo: <GitHubActionsLogo size={24} />
        },
        { 
          name: 'Dependabot', 
          role: 'Automated dependency and security vulnerability management.',
          logo: <Container size={24} style={{ color: '#c084fc' }} />
        }
      ]
    },
    {
      category: 'Testing & Verification',
      badge: 'DBRE Testing',
      icon: <CheckCircle2 size={18} style={{ color: '#22c55e' }} />,
      items: [
        { 
          name: 'pytest Integration Harness', 
          role: 'Python DBRE integration harness asserting schemas and throughput.',
          logo: <PytestLogo size={24} />
        },
        { 
          name: 'pyodbc Driver Engine', 
          role: 'ODBC connection driver for programmatic SQL Server test execution.',
          logo: <Cpu size={24} style={{ color: '#22c55e' }} />
        },
        { 
          name: 'tSQLt Unit Testing', 
          role: 'In-engine database unit testing classes for stored procedure assertions.',
          logo: <TsqltLogo size={24} />
        }
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
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  {group.icon}
                  <h3 className="stack-cat-title" style={{ margin: 0, padding: 0, border: 'none' }}>
                    {group.category}
                  </h3>
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  color: 'var(--text-muted)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '2px 8px',
                  borderRadius: '10px'
                }}>
                  {group.badge}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {group.items.map((item) => (
                  <div key={item.name} className="tech-item-box">
                    <div className="tech-item-logo">
                      {item.logo}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div className="tech-item-name">
                        {item.name}
                      </div>
                      <div className="tech-item-role">
                        {item.role}
                      </div>
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
