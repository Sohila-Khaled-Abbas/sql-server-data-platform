import React, { useState, useMemo } from 'react';
import { 
  FolderGit2, 
  FileCode, 
  FileText, 
  Terminal, 
  Settings, 
  CheckCircle2, 
  Search, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { REPO_FILES, REPO_METADATA } from '../data/repositoryData.js';

export default function RepositoryExplorer() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = ['All', 'SQL', 'Docs', 'Scripts', 'Config', 'Tests'];

  const filteredFiles = useMemo(() => {
    return REPO_FILES.filter((file) => {
      const matchesFilter = selectedFilter === 'All' || file.category === selectedFilter;
      const matchesSearch = file.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            file.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [selectedFilter, searchQuery]);

  const getFileIcon = (category) => {
    switch (category) {
      case 'SQL': return <FileCode size={16} className="file-icon-badge" style={{ color: '#38bdf8' }} />;
      case 'Docs': return <FileText size={16} className="file-icon-badge" style={{ color: '#a855f7' }} />;
      case 'Scripts': return <Terminal size={16} className="file-icon-badge" style={{ color: '#10b981' }} />;
      case 'Config': return <Settings size={16} className="file-icon-badge" style={{ color: '#f59e0b' }} />;
      case 'Tests': return <CheckCircle2 size={16} className="file-icon-badge" style={{ color: '#22c55e' }} />;
      default: return <FileCode size={16} className="file-icon-badge" />;
    }
  };

  return (
    <section id="repository-explorer" className="section">
      <div className="container">
        <span className="section-tag">CODEBASE BROWSER</span>
        <h2 className="section-title">Explore the Repository</h2>
        <p className="section-subtitle">
          An interactive, searchable index of production SQL scripts, architectural specifications, runbooks, and test suites across the repository.
        </p>

        <div className="repo-explorer-shell">
          {/* Toolbar */}
          <div className="explorer-toolbar">
            <div className="explorer-filters">
              {filters.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedFilter(cat)}
                  className={`filter-btn ${selectedFilter === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Realtime Search Input */}
            <div style={{ position: 'relative', minWidth: 260 }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: 11, color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search scripts, schemas, docs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-deep)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '20px',
                  padding: '0.45rem 1rem 0.45rem 2.25rem',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* File Count & Info */}
          <div style={{
            padding: '0.75rem 1.5rem',
            background: 'rgba(255, 255, 255, 0.02)',
            borderBottom: '1px solid var(--border-subtle)',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>Showing {filteredFiles.length} repository artifacts</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>Branch: master &bull; Commit Verified</span>
          </div>

          {/* Interactive File Rows */}
          <div className="explorer-file-list">
            {filteredFiles.map((file) => (
              <a
                key={file.path}
                href={`${REPO_METADATA.repoUrl}/blob/master/${file.path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="explorer-row"
              >
                <div className="file-identity">
                  {getFileIcon(file.category)}
                  <div>
                    <div className="file-path">{file.path}</div>
                    <div className="file-desc">{file.desc}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)'
                  }}>
                    ~{file.lines} lines
                  </span>
                  <ExternalLink size={14} style={{ color: 'var(--text-muted)' }} />
                </div>
              </a>
            ))}

            {filteredFiles.length === 0 && (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No repository files matched "{searchQuery}".
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
