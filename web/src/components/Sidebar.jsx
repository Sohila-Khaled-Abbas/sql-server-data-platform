import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext.jsx';
import { useProgress } from '../context/ProgressContext.jsx';
import { 
  Map, 
  Video, 
  Terminal, 
  Trophy, 
  BookOpen, 
  Layers, 
  Building, 
  Cpu, 
  CheckCircle2, 
  FileText, 
  Database, 
  ChevronRight, 
  ChevronDown, 
  Table, 
  Key, 
  ExternalLink 
} from 'lucide-react';

export default function Sidebar({ isOpen, activeTab, onSelectTab, onRunQueryInStudio }) {
  const { schemaTree } = useDatabase();
  const { totalXp, progressPercent } = useProgress();
  const [expandedDb, setExpandedDb] = useState({ company: true, omniflow_dw: false });
  const [expandedTables, setExpandedTables] = useState({ Employee: true, FactSales: true });

  const toggleDb = (dbId) => {
    setExpandedDb(prev => ({ ...prev, [dbId]: !prev[dbId] }));
  };

  const toggleTable = (tableName) => {
    setExpandedTables(prev => ({ ...prev, [tableName]: !prev[tableName] }));
  };

  const handleTableClick = (tableName) => {
    onSelectTab('playground');
    if (onRunQueryInStudio) {
      onRunQueryInStudio(`-- Quick Object Explorer Inspect: ${tableName}
SELECT * 
FROM ${tableName} 
LIMIT 25;`);
    }
  };

  return (
    <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
      {/* 1. Main Navigation Tabs */}
      <div className="sidebar-section-title">Course Learning Journey</div>
      <nav className="sidebar-nav">
        <button 
          className={`nav-item ${activeTab === 'roadmap' ? 'active' : ''}`}
          onClick={() => onSelectTab('roadmap')}
        >
          <Map size={18} className="nav-icon" />
          <span className="nav-label">Course Roadmap</span>
          <span className="nav-pill badge-mssql-red">5 Stages</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'resources' ? 'active' : ''}`}
          onClick={() => onSelectTab('resources')}
        >
          <Video size={18} className="nav-icon" />
          <span className="nav-label">25-Video Hub</span>
          <span className="nav-pill badge-cyan">25 Vids</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'msdocs' ? 'active' : ''}`}
          onClick={() => onSelectTab('msdocs')}
        >
          <BookOpen size={18} className="nav-icon" />
          <span className="nav-label">Microsoft Docs Hub</span>
          <span className="nav-pill badge-blue">MS Learn</span>
        </button>
      </nav>

      {/* 2. Interactive Labs */}
      <div className="sidebar-section-title">Interactive Labs & Sandbox</div>
      <nav className="sidebar-nav">
        <button 
          className={`nav-item ${activeTab === 'playground' ? 'active' : ''}`}
          onClick={() => onSelectTab('playground')}
        >
          <Terminal size={18} className="nav-icon" />
          <span className="nav-label">Query Studio</span>
          <span className="nav-pill">WASM</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'challenges' ? 'active' : ''}`}
          onClick={() => onSelectTab('challenges')}
        >
          <Trophy size={18} className="nav-icon" />
          <span className="nav-label">SQL Challenge Arena</span>
          <span className="nav-pill badge-amber">{totalXp} XP</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => onSelectTab('projects')}
        >
          <Layers size={18} className="nav-icon" />
          <span className="nav-label">Enterprise Blueprints</span>
          <span className="nav-pill badge-cyan">Projects</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'architecture' ? 'active' : ''}`}
          onClick={() => onSelectTab('architecture')}
        >
          <Building size={18} className="nav-icon" />
          <span className="nav-label">Architecture Topology</span>
          <span className="nav-pill badge-purple">System Design</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'migrations' ? 'active' : ''}`}
          onClick={() => onSelectTab('migrations')}
        >
          <Terminal size={18} className="nav-icon" />
          <span className="nav-label">Migration Runner</span>
          <span className="nav-pill badge-green">CI/CD Engine</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'erd' ? 'active' : ''}`}
          onClick={() => onSelectTab('erd')}
        >
          <Building size={18} className="nav-icon" />
          <span className="nav-label">Case Study Chen ERD</span>
          <span className="nav-pill badge-purple">CH01</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'plan-simulator' ? 'active' : ''}`}
          onClick={() => onSelectTab('plan-simulator')}
        >
          <Cpu size={18} className="nav-icon" />
          <span className="nav-label">Execution Plan Simulator</span>
          <span className="nav-pill badge-green">Tuning</span>
        </button>

        <button 
          className={`nav-item ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => onSelectTab('quiz')}
        >
          <CheckCircle2 size={18} className="nav-icon" />
          <span className="nav-label">DBRE Knowledge Check</span>
          <span className="nav-pill badge-amber">8 Qs</span>
        </button>
      </nav>

      {/* 3. Object Explorer Tree (SSMS Style) */}
      <div className="sidebar-section-title object-explorer-title">
        <Database size={14} />
        <span>Object Explorer</span>
      </div>
      <div className="object-explorer-tree">
        {schemaTree.databases.map((db) => {
          const isDbOpen = !!expandedDb[db.id];
          return (
            <div key={db.id} className="oe-db-node">
              <div className="oe-item-header db-header" onClick={() => toggleDb(db.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isDbOpen ? <ChevronDown size={14} style={{ flexShrink: 0 }} /> : <ChevronRight size={14} style={{ flexShrink: 0 }} />}
                <Database size={14} className="oe-icon db-icon" style={{ flexShrink: 0 }} />
                <span className="oe-name db-name" style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{db.name}</span>
                <span className="oe-tag" style={{ marginLeft: 'auto', flexShrink: 0 }}>{db.type}</span>
              </div>

              {isDbOpen && (
                <div className="oe-children-tables" style={{ paddingLeft: '14px', borderLeft: '1px solid rgba(255, 255, 255, 0.1)', marginLeft: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {db.tables.map((table) => {
                    const isTableOpen = !!expandedTables[table.name];
                    return (
                      <div key={table.name} className="oe-table-node">
                        <div className="oe-item-header table-header" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span onClick={() => toggleTable(table.name)} className="oe-toggle" style={{ cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}>
                            {isTableOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                          </span>
                          <span 
                            className="oe-table-clickable" 
                            onClick={() => handleTableClick(table.name)}
                            title={`Click to query ${table.name}`}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', flexGrow: 1, overflow: 'hidden', cursor: 'pointer' }}
                          >
                            <Table size={13} className="oe-icon table-icon" style={{ flexShrink: 0, color: '#38bdf8' }} />
                            <span className="oe-name table-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{table.name}</span>
                          </span>
                          <span className="oe-count-badge" style={{ marginLeft: 'auto', flexShrink: 0, fontSize: '0.68rem', padding: '1px 5px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
                            {table.rowCount}r
                          </span>
                        </div>

                        {isTableOpen && (
                          <div className="oe-columns-list" style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '2px', margin: '4px 0' }}>
                            {table.columns.map((col) => (
                              <div key={col.name} className="oe-col-item" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#cbd5e1' }}>
                                {col.isPk ? (
                                  <Key size={11} className="col-pk-icon" title="Primary Key" style={{ color: '#f59e0b', flexShrink: 0 }} />
                                ) : (
                                  <span className="col-bullet" style={{ color: '#64748b', fontSize: '0.8rem', width: '11px', textAlign: 'center' }}>•</span>
                                )}
                                <span className={`col-name ${col.isPk ? 'is-pk' : ''}`} style={{ fontWeight: col.isPk ? 600 : 400, color: col.isPk ? '#f59e0b' : '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {col.name}
                                </span>
                                <span className="col-type" style={{ marginLeft: 'auto', fontSize: '0.65rem', color: '#64748b', fontFamily: 'monospace' }}>
                                  {col.type}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. Course Docs */}
      <div className="sidebar-section-title">Course Documentation</div>
      <nav className="sidebar-nav">
        <button 
          className={`nav-item ${activeTab === 'docs-case-study' ? 'active' : ''}`}
          onClick={() => onSelectTab('docs-case-study')}
        >
          <FileText size={16} className="nav-icon" />
          <span className="nav-label">CH01 Case Study Guide</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'docs-perf' ? 'active' : ''}`}
          onClick={() => onSelectTab('docs-perf')}
        >
          <FileText size={16} className="nav-icon" />
          <span className="nav-label">Performance Handbook</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'docs-dr' ? 'active' : ''}`}
          onClick={() => onSelectTab('docs-dr')}
        >
          <FileText size={16} className="nav-icon" />
          <span className="nav-label">Disaster Recovery Runbook</span>
        </button>
      </nav>

      {/* Footer Card */}
      <div className="sidebar-footer">
        <div className="platform-meta-card">
          <div className="meta-title">Microsoft SQL Server 2022</div>
          <div className="meta-desc">React 19 • WASM SQLite Engine</div>
          <div className="meta-tags">
            <span className="meta-tag">OLTP</span>
            <span className="meta-tag">Kimball DW</span>
            <span className="meta-tag">MS Learn</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
