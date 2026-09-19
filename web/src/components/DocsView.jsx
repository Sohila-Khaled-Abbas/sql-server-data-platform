/**
 * DocsView — Documentation & Learning Resources Hub
 * 
 * Replaces the old static resource list with a rich, categorized learning hub.
 * All dead '#' links have been replaced with real, verified Microsoft Learn and
 * community resource URLs.
 * 
 * Categories:
 *   1. Architecture & Design (Microsoft Learn docs)
 *   2. Performance & Storage (engine internals)
 *   3. Development Standards (T-SQL best practices)
 *   4. Books & Reading (recommended industry texts)
 *   5. Video Channels (YouTube and community)
 *   6. Practice Platforms (interactive SQL practice)
 *   7. Certifications (Microsoft certification paths)
 *   8. Tools & Utilities (DBA/DBRE tooling)
 */
import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  FileText,
  ExternalLink,
  Download,
  Search,
  Video,
  Award,
  Wrench,
  GraduationCap,
  Code,
  Database,
  Cpu,
  X,
} from 'lucide-react';
import ResourceCard from './ui/ResourceCard.jsx';

/* ────────────────────────────────────────────────────────────────────── */
/*  RESOURCE DATA — All links verified, no '#' dead links                */
/* ────────────────────────────────────────────────────────────────────── */

const RESOURCE_SECTIONS = [
  {
    id: 'architecture',
    title: 'Architecture & Design',
    icon: <Database size={18} />,
    items: [
      {
        title: 'Company Database ERD (MaharaTech)',
        type: 'PDF',
        url: 'https://maharatech.gov.eg/mod/resource/view.php?id=17519',
        desc: 'Peter Chen Entity-Relationship Diagram for the enterprise schema — CH01 case study.',
      },
      {
        title: 'Relational Database Design (Microsoft Learn)',
        type: 'MS Docs',
        url: 'https://learn.microsoft.com/en-us/sql/relational-databases/tables/primary-and-foreign-key-constraints',
        desc: '6 standard rules for mapping Peter Chen ERD to 3NF tables. Primary key, foreign key, and cascading action constraints.',
      },
      {
        title: 'Star Schema Design Guide (Kimball)',
        type: 'MS Docs',
        url: 'https://learn.microsoft.com/en-us/power-bi/guidance/star-schema',
        desc: 'Dimensional modeling for OLAP data warehouses — fact tables, conformed dimensions, and surrogate keys.',
      },
      {
        title: 'Database Normalization (1NF → BCNF)',
        type: 'MS Docs',
        url: 'https://learn.microsoft.com/en-us/office/troubleshoot/access/database-normalization-description',
        desc: 'Microsoft guide on database normalization forms: First through Boyce-Codd Normal Form.',
      },
    ],
  },
  {
    id: 'performance',
    title: 'Performance & Storage',
    icon: <Cpu size={18} />,
    items: [
      {
        title: '8 KB Page Architecture',
        type: 'MS Docs',
        url: 'https://learn.microsoft.com/en-us/sql/relational-databases/pages-and-extents-architecture-guide',
        desc: 'Deep dive into SQL Server storage engine internals — 96-byte headers, GAM/SGAM, PFS tracking.',
      },
      {
        title: 'Query Processing Architecture Guide',
        type: 'MS Docs',
        url: 'https://learn.microsoft.com/en-us/sql/relational-databases/query-processing-architecture-guide',
        desc: 'Understanding when SQL Server switches from Index Seek to Clustered Scan — the optimizer tipping point.',
      },
      {
        title: 'Transaction Log Architecture',
        type: 'MS Docs',
        url: 'https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-log-architecture-and-management-guide',
        desc: 'VLF structure, log truncation, and Write-Ahead Logging (WAL) protocol internals.',
      },
      {
        title: 'Clustered & Non-Clustered Indexes',
        type: 'MS Docs',
        url: 'https://learn.microsoft.com/en-us/sql/relational-databases/indexes/clustered-and-nonclustered-indexes-described',
        desc: 'B-Tree architecture, covering indexes with INCLUDE columns, and filtered index strategies.',
      },
      {
        title: 'Execution Plans Reference',
        type: 'MS Docs',
        url: 'https://learn.microsoft.com/en-us/sql/relational-databases/performance/execution-plans',
        desc: 'Reading and interpreting graphical and XML execution plans for query optimization.',
      },
    ],
  },
  {
    id: 'development',
    title: 'Development Standards',
    icon: <Code size={18} />,
    items: [
      {
        title: 'T-SQL Coding Standards & Best Practices',
        type: 'MS Docs',
        url: 'https://learn.microsoft.com/en-us/sql/t-sql/language-reference',
        desc: 'Official T-SQL language reference — syntax, built-in functions, data types, and statement semantics.',
      },
      {
        title: 'SET XACT_ABORT & Error Handling',
        type: 'MS Docs',
        url: 'https://learn.microsoft.com/en-us/sql/t-sql/statements/set-xact-abort-transact-sql',
        desc: 'Robust transaction management with XACT_ABORT ON and TRY...CATCH error handling patterns.',
      },
      {
        title: 'Database Integrity: Constraints & Rules',
        type: 'MS Docs',
        url: 'https://learn.microsoft.com/en-us/sql/relational-databases/tables/unique-constraints-and-check-constraints',
        desc: 'Primary Keys, Foreign Keys, Unique, and Check Constraints — the four pillars of data integrity.',
      },
      {
        title: 'Stored Procedures Best Practices',
        type: 'MS Docs',
        url: 'https://learn.microsoft.com/en-us/sql/relational-databases/stored-procedures/stored-procedures-database-engine',
        desc: 'Idempotent procedure design, OUTPUT clause, parameter sniffing avoidance, and defensive coding.',
      },
    ],
  },
  {
    id: 'books',
    title: 'Books & Recommended Reading',
    icon: <BookOpen size={18} />,
    items: [
      {
        title: 'T-SQL Fundamentals — Itzik Ben-Gan',
        type: 'Book',
        url: 'https://www.microsoftpressstore.com/store/t-sql-fundamentals-9780138102104',
        desc: 'The gold-standard introductory text for T-SQL. Covers queries, subqueries, table expressions, window functions, and pivoting.',
      },
      {
        title: 'SQL Server Internals — Kalen Delaney',
        type: 'Book',
        url: 'https://www.amazon.com/Microsoft-SQL-Server-2012-Internals/dp/0735658560',
        desc: 'The deepest technical dive into SQL Server engine internals — storage, memory, query processing, and locking.',
      },
      {
        title: 'The Data Warehouse Toolkit — Ralph Kimball',
        type: 'Book',
        url: 'https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/books/',
        desc: 'Definitive guide to dimensional modeling, star schemas, slowly changing dimensions, and ETL architecture.',
      },
      {
        title: 'Database Reliability Engineering — Campbell & Majors',
        type: 'Book',
        url: 'https://www.oreilly.com/library/view/database-reliability-engineering/9781491925935/',
        desc: 'Modern operational practices for database reliability — monitoring, automation, disaster recovery, and SLOs.',
      },
    ],
  },
  {
    id: 'videos',
    title: 'Video Channels & Talks',
    icon: <Video size={18} />,
    items: [
      {
        title: 'Brent Ozar Unlimited',
        type: 'Video',
        url: 'https://www.youtube.com/@BrentOzar',
        desc: 'SQL Server performance tuning masterclass videos — index tuning, query optimization, and emergency DBA tips.',
      },
      {
        title: 'SQLBits Conference Talks',
        type: 'Video',
        url: 'https://www.youtube.com/@SQLBits',
        desc: 'Free recordings from Europe\'s largest SQL Server conference — engine internals, cloud migration, and data engineering.',
      },
      {
        title: 'Microsoft SQL Server YouTube',
        type: 'Video',
        url: 'https://www.youtube.com/@MicrosoftSQLServer',
        desc: 'Official Microsoft channel — product updates, What\'s New in SQL 2022, Azure SQL, and feature deep-dives.',
      },
      {
        title: 'MaharaTech — SQL Server Course 2305',
        type: 'Course',
        url: 'https://maharatech.gov.eg/course/view.php?id=2305',
        desc: 'The official MaharaTech course page — all 102 video lectures by Eng. Rami Mohamed Abonagi (ITI / MCIT).',
      },
    ],
  },
  {
    id: 'practice',
    title: 'Practice Platforms',
    icon: <GraduationCap size={18} />,
    items: [
      {
        title: 'LeetCode — SQL Study Plan',
        type: 'Platform',
        url: 'https://leetcode.com/studyplan/top-sql-50/',
        desc: 'Top 50 SQL interview problems with instant online judge — aggregations, joins, subqueries, and window functions.',
      },
      {
        title: 'HackerRank — SQL Domain',
        type: 'Platform',
        url: 'https://www.hackerrank.com/domains/sql',
        desc: 'Structured SQL challenges organized by difficulty and topic — great for systematic skill building.',
      },
      {
        title: 'SQLZoo — Interactive Tutorials',
        type: 'Platform',
        url: 'https://sqlzoo.net/wiki/SQL_Tutorial',
        desc: 'Step-by-step interactive SQL tutorials with live execution — beginner through advanced topics.',
      },
      {
        title: 'SQLBolt — Learn SQL Interactively',
        type: 'Platform',
        url: 'https://sqlbolt.com/',
        desc: 'Simple, interactive lessons that teach SQL through guided exercises with immediate feedback.',
      },
      {
        title: 'W3Schools — SQL Tutorial',
        type: 'Platform',
        url: 'https://www.w3schools.com/sql/',
        desc: 'Comprehensive SQL reference with Try It Yourself editor — excellent for quick syntax lookups.',
      },
    ],
  },
  {
    id: 'certifications',
    title: 'Microsoft Certifications',
    icon: <Award size={18} />,
    items: [
      {
        title: 'DP-300: Azure Database Administrator',
        type: 'Cert',
        url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-database-administrator-associate/',
        desc: 'The primary certification for SQL Server DBAs — covers administration, security, monitoring, and high availability.',
      },
      {
        title: 'AZ-900: Azure Fundamentals',
        type: 'Cert',
        url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/',
        desc: 'Foundational Azure certification — cloud concepts, core services, and Azure SQL Database basics.',
      },
      {
        title: 'DP-203: Azure Data Engineer Associate',
        type: 'Cert',
        url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-data-engineer/',
        desc: 'Data engineering certification — Synapse Analytics, Data Factory, and data lake design patterns.',
      },
      {
        title: 'Microsoft Learn: SQL Server Learning Paths',
        type: 'Course',
        url: 'https://learn.microsoft.com/en-us/training/browse/?products=sql-server',
        desc: 'Free, official Microsoft learning paths covering SQL Server fundamentals through advanced administration.',
      },
    ],
  },
  {
    id: 'tools',
    title: 'Tools & Utilities',
    icon: <Wrench size={18} />,
    items: [
      {
        title: 'SQL Server Management Studio (SSMS)',
        type: 'Tool',
        url: 'https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms',
        desc: 'The primary IDE for SQL Server — query editor, object explorer, execution plans, and schema management.',
      },
      {
        title: 'Azure Data Studio',
        type: 'Tool',
        url: 'https://learn.microsoft.com/en-us/azure-data-studio/download-azure-data-studio',
        desc: 'Cross-platform, lightweight SQL editor with Jupyter notebook support and extensible architecture.',
      },
      {
        title: 'SentryOne Plan Explorer',
        type: 'Tool',
        url: 'https://www.sentryone.com/plan-explorer',
        desc: 'Free execution plan analysis tool — far more detailed plan visualization than SSMS\'s built-in viewer.',
      },
      {
        title: 'sp_WhoIsActive by Adam Machanic',
        type: 'Tool',
        url: 'https://github.com/amachanic/sp_whoisactive',
        desc: 'Industry-standard stored procedure for monitoring active queries, blocking chains, and resource usage.',
      },
      {
        title: 'dbatools PowerShell Module',
        type: 'Tool',
        url: 'https://dbatools.io/',
        desc: 'Community-built PowerShell module with 500+ commands for SQL Server administration and automation.',
      },
    ],
  },
];

/* ────────────────────────────────────────────────────────────────────── */
/*  COMPONENT                                                            */
/* ────────────────────────────────────────────────────────────────────── */

export default function DocsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  /** Filtered resources based on search + category */
  const filteredSections = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return RESOURCE_SECTIONS
      .filter((section) => activeCategory === 'all' || section.id === activeCategory)
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          if (!q) return true;
          return (
            item.title.toLowerCase().includes(q) ||
            item.desc.toLowerCase().includes(q) ||
            item.type.toLowerCase().includes(q)
          );
        }),
      }))
      .filter((section) => section.items.length > 0);
  }, [searchQuery, activeCategory]);

  const totalResources = RESOURCE_SECTIONS.reduce((sum, s) => sum + s.items.length, 0);

  return (
    <div className="main-content docs-hub-view">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="docs-hub-header">
        <div className="docs-hub-title-row">
          <div className="docs-hub-icon-box">
            <BookOpen size={28} />
          </div>
          <div>
            <div className="docs-hub-badge">Documentation & Learning Resources</div>
            <h1 className="docs-hub-title">SQL Server Learning Hub</h1>
            <p className="docs-hub-subtitle">
              Curated reference materials, architecture guides, official Microsoft documentation,
              recommended books, practice platforms, and career certification paths for Database
              Reliability Engineers.
            </p>
          </div>
        </div>
        <div className="docs-hub-stats">
          <span className="docs-hub-stat">{totalResources} Resources</span>
          <span className="docs-hub-stat">{RESOURCE_SECTIONS.length} Categories</span>
        </div>
      </div>

      {/* ── Search & Filter Bar ───────────────────────────────────────── */}
      <div className="docs-hub-toolbar">
        <div className="docs-hub-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search resources (e.g. partition, Kimball, LeetCode, SSMS)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="docs-hub-clear-btn" onClick={() => setSearchQuery('')}>
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── Category Filter Pills ─────────────────────────────────────── */}
      <div className="docs-hub-category-pills">
        <button
          className={`docs-hub-pill ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          All ({totalResources})
        </button>
        {RESOURCE_SECTIONS.map((section) => (
          <button
            key={section.id}
            className={`docs-hub-pill ${activeCategory === section.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(section.id)}
          >
            {section.title} ({section.items.length})
          </button>
        ))}
      </div>

      {/* ── Resource Sections ─────────────────────────────────────────── */}
      <div className="docs-hub-sections">
        {filteredSections.map((section) => (
          <div key={section.id} className="docs-hub-section">
            <div className="docs-hub-section-header">
              <span className="docs-hub-section-icon">{section.icon}</span>
              <h3 className="docs-hub-section-title">{section.title}</h3>
              <span className="docs-hub-section-count">{section.items.length}</span>
            </div>
            <div className="docs-hub-section-grid">
              {section.items.map((item, i) => (
                <ResourceCard
                  key={i}
                  title={item.title}
                  description={item.desc}
                  url={item.url}
                  type={item.type}
                  isExternal={true}
                  icon={section.icon}
                />
              ))}
            </div>
          </div>
        ))}

        {filteredSections.length === 0 && (
          <div className="docs-hub-empty">
            <p>No resources matching "{searchQuery}" in this category.</p>
            <button
              className="docs-hub-reset-btn"
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
