import React from 'react';
import { Book, FileText, Download, ExternalLink } from 'lucide-react';

export default function DocsView() {
  const resources = [
    {
      category: "Architecture & Design",
      items: [
        { title: "Company Database ERD", type: "PDF", link: "https://maharatech.gov.eg/mod/resource/view.php?id=17519", desc: "Peter Chen Entity-Relationship Diagram for the enterprise schema." },
        { title: "Relational Mapping Rules", type: "Docs", link: "#", desc: "6 standard rules for mapping Peter Chen ERD to 3NF tables." },
        { title: "Kimball Star Schema", type: "Guide", link: "#", desc: "Dimensional modeling for OLAP data warehouses." }
      ]
    },
    {
      category: "Performance & Storage",
      items: [
        { title: "8 KB Page Architecture", type: "MS Docs", link: "https://learn.microsoft.com/en-us/sql/relational-databases/pages-and-extents-architecture-guide", desc: "Deep dive into SQL Server storage engine internals." },
        { title: "Query Optimizer Tipping Point", type: "Article", link: "#", desc: "Understanding when SQL Server switches from Index Seek to Clustered Scan." },
        { title: "Transaction Log Architecture", type: "MS Docs", link: "https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-log-architecture-and-management-guide", desc: "VLF, truncation, and Write-Ahead Logging (WAL)." }
      ]
    },
    {
      category: "Development Standards",
      items: [
        { title: "T-SQL Coding Standards", type: "MD", link: "#", desc: "Best practices for writing clean, performant T-SQL code." },
        { title: "ACID & XACT_ABORT", type: "Guide", link: "#", desc: "Robust transaction management and error handling." },
        { title: "Database Integrity Cheatsheet", type: "PDF", link: "#", desc: "Primary Keys, Foreign Keys, Unique, and Check Constraints." }
      ]
    }
  ];

  return (
    <div className="main-content">
      <div className="lesson-header">
        <h1 className="lesson-title">Documentation & Resources</h1>
        <p className="lesson-meta" style={{ marginTop: 8 }}>
          Curated reference materials, architecture guides, and official Microsoft documentation for DBREs.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginTop: '40px' }}>
        {resources.map((section, idx) => (
          <div key={idx}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              {section.category}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {section.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ marginTop: '2px', color: 'var(--accent)' }}>
                    {item.type === 'PDF' ? <Download size={18} /> : item.type === 'MS Docs' ? <ExternalLink size={18} /> : <FileText size={18} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>
                      {item.title}
                    </a>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{item.desc}</p>
                  </div>
                  <span style={{ fontSize: '11px', padding: '2px 8px', background: 'var(--bg-tertiary)', borderRadius: '12px', color: 'var(--text-muted)' }}>
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
