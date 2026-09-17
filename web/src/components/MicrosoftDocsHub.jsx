import React, { useState, useMemo } from 'react';
import { MICROSOFT_DOCS, MICROSOFT_DMV_DOCS } from '../data/microsoftDocs';
import { BookOpen, ExternalLink, Search, Filter, Cpu, Database, Shield, Zap, Layers, BarChart2 } from 'lucide-react';

const CATEGORY_ICONS = {
  "Storage Engine & Architecture": Database,
  "Concurrency & Locking": Shield,
  "Query Tuning & Optimization": Zap,
  "Scalability & Data Engineering": Layers,
  "High Availability & DBRE": Cpu,
  "Programmability & Automation": Zap,
  "Dimensional Warehousing & BI": BarChart2,
};

export default function MicrosoftDocsHub() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => {
    const cats = new Set(MICROSOFT_DOCS.map(d => d.category));
    return ["All", ...Array.from(cats)];
  }, []);

  const filteredDocs = useMemo(() => {
    return MICROSOFT_DOCS.filter(doc => {
      const matchesCat = selectedCategory === "All" || doc.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        doc.title.toLowerCase().includes(q) ||
        doc.summary.toLowerCase().includes(q) ||
        doc.topics.some(t => t.toLowerCase().includes(q)) ||
        doc.category.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="ms-docs-hub">
      {/* Header Banner */}
      <div className="ms-docs-header">
        <div className="ms-docs-title-row">
          <div className="ms-icon-box">
            <BookOpen className="w-8 h-8 text-ms-red" />
          </div>
          <div>
            <div className="ms-badge">Official Microsoft Learn Reference Library</div>
            <h1>Microsoft SQL Server 2022 Architecture & Internals</h1>
            <p>
              Direct technical specifications, engine internals guides, and architectural manuals from Microsoft Learn, curated for the MaharaTech Data Platform curriculum.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="ms-docs-toolbar">
          <div className="ms-search-box">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Microsoft Learn documentation (e.g. Partitioning, RCSI, DMV, Extents)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-btn" onClick={() => setSearchQuery("")}>×</button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="category-pills">
          {categories.map(cat => (
            <button
              key={cat}
              className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Docs Grid */}
      <div className="ms-docs-grid">
        {filteredDocs.map(doc => {
          const CategoryIcon = CATEGORY_ICONS[doc.category] || Database;
          return (
            <div key={doc.id} className="ms-doc-card">
              <div className="ms-doc-card-top">
                <span className="ms-category-tag">
                  <CategoryIcon className="w-3.5 h-3.5 inline mr-1" />
                  {doc.category}
                </span>
                <span className="ms-badge-small">{doc.badge}</span>
              </div>
              <h3 className="ms-doc-title">
                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-start gap-1">
                  <span>{doc.title}</span>
                  <ExternalLink className="w-4 h-4 flex-shrink-0 text-gray-400 mt-1" />
                </a>
              </h3>
              <p className="ms-doc-summary">{doc.summary}</p>
              <div className="ms-doc-topics">
                {doc.topics.map(t => (
                  <span key={t} className="ms-topic-chip">{t}</span>
                ))}
              </div>
              <div className="ms-doc-card-footer">
                <span className="chapter-meta">Ch {doc.chapter} Aligned</span>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="read-docs-btn"
                >
                  Read on Microsoft Learn →
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDocs.length === 0 && (
        <div className="empty-docs">
          <p>No documentation matching "{searchQuery}" in category "{selectedCategory}".</p>
          <button className="reset-filter-btn" onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}>
            Reset Filters
          </button>
        </div>
      )}

      {/* DMV Reference Section */}
      <div className="dmv-section">
        <div className="dmv-header">
          <Cpu className="w-6 h-6 text-ms-red" />
          <div>
            <h2>Core Dynamic Management Views (DMVs) for DBRE</h2>
            <p>Essential telemetry views referenced across MaharaTech Course 2305 for diagnostics, locking, and index tuning.</p>
          </div>
        </div>
        <div className="dmv-grid">
          {MICROSOFT_DMV_DOCS.map(dmv => (
            <div key={dmv.dmv} className="dmv-card">
              <div className="dmv-code-row">
                <code>{dmv.dmv}</code>
                <a href={dmv.url} target="_blank" rel="noopener noreferrer" title="View Microsoft Docs" className="dmv-link">
                  <ExternalLink className="w-4 h-4 text-gray-400 hover:text-white" />
                </a>
              </div>
              <p className="dmv-purpose">{dmv.purpose}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
