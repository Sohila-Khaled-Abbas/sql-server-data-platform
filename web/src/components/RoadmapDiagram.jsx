import React, { useState, useMemo } from 'react';
import { useProgress } from '../context/ProgressContext.jsx';
import { COURSE_VIDEOS, COURSE_METADATA } from '../data/videoCatalog.js';
import { CONCEPT_CATEGORIES, COURSE_CONCEPTS } from '../data/courseConceptRoadmap.js';
import { 
  CheckCircle2, 
  Circle, 
  ExternalLink,
  GraduationCap, 
  Plus, 
  Sparkles, 
  Award, 
  FolderPlus, 
  BookOpen, 
  Code, 
  ShieldCheck, 
  Database,
  Search,
  Play,
  Copy,
  Check,
  X,
  Layers,
  Zap,
  HardDrive,
  Server,
  BarChart3,
  GitFork,
  ArrowRight,
  Workflow,
  Compass
} from 'lucide-react';
import mssqlLogo from '../assets/mssql-logo.svg';

const STAGES = [
  {
    stage: 1,
    title: "CH01: Database Creation and Management",
    subtitle: "Storage Architecture, Filegroups, Relational Integrity, Indexes & Snapshots",
    badge: "16 Lessons",
    badgeClass: "badge-cyan",
    videoIds: [
      "ch01-vid01", "ch01-vid02", "ch01-vid03", "ch01-vid04",
      "ch01-vid05", "ch01-vid06", "ch01-vid07", "ch01-vid08",
      "ch01-vid09", "ch01-vid10", "ch01-vid11", "ch01-vid12",
      "ch01-vid13", "ch01-vid14", "ch01-vid15", "ch01-vid16"
    ],
    milestone: "ITItest Live Lab & Enterprise 3NF Relational Model",
    skills: ["Storage Engine Internals", "8 KB Page Math", "Multi-Filegroups", "Integrity Constraints", "Clustered/Non-Clustered Indexes", "Database Snapshots"],
    msDocsTopic: "Database Files & Extents Architecture Guide"
  },
  {
    stage: 2,
    title: "CH02: SQL Programming Essentials",
    subtitle: "Variables, Flow Control, UDFs, System Databases, Temp Tables & Transactions",
    badge: "15 Lessons",
    badgeClass: "badge-green",
    videoIds: [
      "ch02-vid01", "ch02-vid02", "ch02-vid03", "ch02-vid04",
      "ch02-vid05", "ch02-vid06", "ch02-vid07", "ch02-vid08",
      "ch02-vid09", "ch02-vid10", "ch02-vid11", "ch02-vid12",
      "ch02-vid13", "ch02-vid14", "ch02-vid15"
    ],
    milestone: "High-Concurrency ACID Transaction Management & Zero-RBAR Inlining",
    skills: ["T-SQL Variables", "Control of Flow", "Scalar & Inline TVFs", "System Databases", "Temp Tables", "ACID Boundaries & Savepoints"],
    msDocsTopic: "Transaction Locking and Row Versioning Guide"
  },
  {
    stage: 3,
    title: "CH03: Advanced Query Techniques & High Availability",
    subtitle: "Views, Partitioning, XML Shredding, CTEs, TVPs, Mirroring & Log Shipping",
    badge: "23 Lessons",
    badgeClass: "badge-purple",
    videoIds: [
      "ch03-vid01", "ch03-vid02", "ch03-vid03", "ch03-vid04",
      "ch03-vid05", "ch03-vid06", "ch03-vid07", "ch03-vid08",
      "ch03-vid09", "ch03-vid10", "ch03-vid11", "ch03-vid12",
      "ch03-vid13", "ch03-vid14", "ch03-vid15", "ch03-vid16",
      "ch03-vid17", "ch03-vid18", "ch03-vid19", "ch03-vid20",
      "ch03-vid21", "ch03-vid22", "ch03-vid23"
    ],
    milestone: "Sub-Second Sliding Window Archival & Database Disaster Recovery",
    skills: ["Indexed Views", "Horizontal Range Partitioning", "FOR XML & XQuery", "Recursive CTEs", "Table-Valued Parameters", "Database Mirroring & Log Shipping"],
    msDocsTopic: "Partitioned Tables and Indexes & Always On AGs"
  },
  {
    stage: 4,
    title: "CH04: Procedures, Triggers & SQL Automation",
    subtitle: "Stored Procedures, Audit Triggers, Cursors, Managed CLR & SMO SDK",
    badge: "27 Lessons",
    badgeClass: "badge-amber",
    videoIds: [
      "ch04-vid01", "ch04-vid02", "ch04-vid03", "ch04-vid04",
      "ch04-vid05", "ch04-vid06", "ch04-vid07", "ch04-vid08",
      "ch04-vid09", "ch04-vid10", "ch04-vid11", "ch04-vid12",
      "ch04-vid13", "ch04-vid14", "ch04-vid15", "ch04-vid16",
      "ch04-vid17", "ch04-vid18", "ch04-vid19", "ch04-vid20",
      "ch04-vid21", "ch04-vid22", "ch04-vid23", "ch04-vid24",
      "ch04-vid25", "ch04-vid26", "ch04-vid27"
    ],
    milestone: "Automated Schema Guard System & PowerShell SMO CI/CD Automation",
    skills: ["Idempotent Stored Procedures", "DML Audit Triggers", "DDL Server Triggers", "OUTPUT Clause", "C# SQL CLR Assemblies", "PowerShell SMO Automation"],
    msDocsTopic: "DML & DDL Triggers and CLR Integration Architecture"
  },
  {
    stage: 5,
    title: "CH05: Reporting and Data Warehousing",
    subtitle: "Paginated SSRS, Matrix Reports, Parameters, OLAP vs OLTP & Kimball Star",
    badge: "20 Lessons",
    badgeClass: "badge-mssql-red",
    videoIds: [
      "ch05-vid01", "ch05-vid02", "ch05-vid03", "ch05-vid04",
      "ch05-vid05", "ch05-vid06", "ch05-vid07", "ch05-vid08",
      "ch05-vid09", "ch05-vid10", "ch05-vid11", "ch05-vid12",
      "ch05-vid13", "ch05-vid14", "ch05-vid15", "ch05-vid16",
      "ch05-vid17", "ch05-vid18", "ch05-vid19", "ch05-vid20"
    ],
    milestone: "OmniFlowDW Star Schema with Temporal Lineage & SSRS Reports",
    skills: ["SSRS Paginated Reports", "Tablix & Matrix Groupings", "Cascading Parameters", "RDLC Local Reports", "OLAP vs OLTP", "Kimball Star Schema & SCDs"],
    msDocsTopic: "Columnstore Indexes & Paginated Reporting Services"
  },
  {
    stage: 6,
    title: "Final Project: Enterprise Capstone Platform",
    subtitle: "Unified Multi-Filegroup, Partitioned, Automated & Paginated Architecture",
    badge: "Capstone",
    badgeClass: "badge-blue",
    videoIds: ["final-project"],
    milestone: "Production Enterprise Data Platform Automated Deployment",
    skills: ["Full Platform Architecture", "Automated DBRE Migration", "Continuous Integration", "End-to-End Verification"],
    msDocsTopic: "SQL Server Enterprise Architecture Guide"
  }
];

export default function RoadmapDiagram({ onSelectTab, onRunQueryInStudio }) {
  const { 
    watchedVideos, 
    toggleWatched, 
    openLessonModal, 
    progressPercent, 
    watchedCount, 
    totalVideos, 
    totalXp, 
    rankInfo,
    studentAttachments,
    addStudentAttachment 
  } = useProgress();

  // View state: 'concepts' | 'stages' | 'career'
  const [activeView, setActiveView] = useState('concepts');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [conceptSearch, setConceptSearch] = useState('');
  const [activeConcept, setActiveConcept] = useState(null);
  const [copiedConceptId, setCopiedConceptId] = useState(null);

  const filteredConcepts = useMemo(() => {
    return COURSE_CONCEPTS.filter(c => {
      const matchCat = selectedCategory === 'all' || c.categoryId === selectedCategory;
      const matchSearch = !conceptSearch || 
        c.title.toLowerCase().includes(conceptSearch.toLowerCase()) ||
        c.summary.toLowerCase().includes(conceptSearch.toLowerCase()) ||
        c.dbreSignificance.toLowerCase().includes(conceptSearch.toLowerCase()) ||
        c.videoCode.toLowerCase().includes(conceptSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, conceptSearch]);

  const handleCopyTsql = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedConceptId(id);
    setTimeout(() => setCopiedConceptId(null), 2000);
  };

  const handleAddAttachment = () => {
    const title = prompt("Enter Attachment Title (e.g. 'Chapter 2 Homework Solutions' or 'Lecture Slides PDF'):");
    if (!title) return;
    const category = prompt("Enter Category / Chapter (e.g. 'Chapter 1', 'SQL Script', 'General'):") || "General";
    const notes = prompt("Enter Brief Notes:") || "";
    const url = prompt("Optional External URL (leave blank if none):") || "";
    addStudentAttachment({ title, category, notes, url });
  };

  return (
    <div className="roadmap-diagram-container">
      {/* 1. Header Hero */}
      <div className="roadmap-hero card">
        <div className="roadmap-hero-content">
          <div className="hero-tag-row">
            <span className="badge badge-mssql-red">Microsoft SQL Server 2022</span>
            <span className="badge badge-purple">MaharaTech Course 2305</span>
            <span className="badge badge-cyan">Interactive Architecture Roadmap</span>
          </div>

          <h1 className="hero-title">SQL Server Data Platform & DBRE Learning Roadmap</h1>
          <p className="hero-desc">
            A visual, architectural curriculum traversing all 102 official modules of <strong>Implementing and Developing SQL Server Objects</strong> taught by Eng. Rami Mohamed Abonagi (ITI). Toggle between the <strong>Course Concepts Architecture Flowchart</strong>, the <strong>Curriculum Stages Progression</strong>, and the <strong>DBRE Career Roadmap</strong> to inspect relational patterns, storage internals, and career growth paths.
          </p>

          {/* Current Rank Banner */}
          <div className="rank-banner">
            <div className="rank-icon">{rankInfo.icon}</div>
            <div className="rank-details">
              <div className="rank-label">Current Professional Seniority</div>
              <div className="rank-title" style={{ color: rankInfo.color }}>{rankInfo.rank}</div>
            </div>
            <div className="rank-stats">
              <div className="rank-stat-item">
                <span className="stat-num">{watchedCount} / {totalVideos}</span>
                <span className="stat-lbl">Lectures Mastered</span>
              </div>
              <div className="rank-stat-item">
                <span className="stat-num">{totalXp} XP</span>
                <span className="stat-lbl">Earned Mastery XP</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="overall-progress-bar-wrapper">
            <div className="progress-bar-header">
              <span>Overall Curriculum Completion</span>
              <strong>{progressPercent}% Complete</strong>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>

        <div className="roadmap-hero-actions">
          <a 
            href={COURSE_METADATA.portalUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-primary"
          >
            <ExternalLink size={16} />
            <span>MaharaTech Portal</span>
          </a>
          <button className="btn btn-secondary" onClick={handleAddAttachment}>
            <Plus size={16} />
            <span>Add Course Attachment</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive View Switcher Tabs */}
      <div className="roadmap-view-switcher card">
        <div className="switcher-tabs">
          <button 
            className={`switcher-tab-btn ${activeView === 'concepts' ? 'active' : ''}`}
            onClick={() => setActiveView('concepts')}
          >
            <Workflow size={18} />
            <div className="tab-text">
              <span className="tab-title">Concept Architecture Roadmap</span>
              <span className="tab-sub">Interactive 7-tier core engineering flowchart</span>
            </div>
            <span className="badge badge-sm badge-cyan">Flowchart</span>
          </button>

          <button 
            className={`switcher-tab-btn ${activeView === 'stages' ? 'active' : ''}`}
            onClick={() => setActiveView('stages')}
          >
            <Compass size={18} />
            <div className="tab-text">
              <span className="tab-title">Curriculum Stages Progression</span>
              <span className="tab-sub">Chapter-by-chapter 102 lesson tracking</span>
            </div>
            <span className="badge badge-sm badge-dark">102 Lessons</span>
          </button>

          <button 
            className={`switcher-tab-btn ${activeView === 'career' ? 'active' : ''}`}
            onClick={() => setActiveView('career')}
          >
            <GraduationCap size={18} />
            <div className="tab-text">
              <span className="tab-title">DBRE Career Roadmap</span>
              <span className="tab-sub">5-phase career progression path</span>
            </div>
            <span className="badge badge-sm badge-green">Career</span>
          </button>
        </div>
      </div>

      {/* VIEW A: CONCEPT ARCHITECTURE ROADMAP */}
      {activeView === 'concepts' && (
        <div className="concept-roadmap-section card">
          <div className="section-title-row">
            <div className="title-with-logo">
              <img 
                src={mssqlLogo} 
                alt="MSSQL" 
                className="title-mssql-icon" 
                width="28" 
                height="28" 
                style={{ width: '28px', height: '28px', maxWidth: '28px', maxHeight: '28px', objectFit: 'contain', flexShrink: 0, display: 'inline-block' }}
              />
              <div>
                <h2>SQL Server 2022 Core Concept Flowchart</h2>
                <p className="section-subtitle">
                  Architectural dependency graph tracking storage engine mechanics, relational integrity, indexing, concurrency, programmability, and data warehousing.
                </p>
              </div>
            </div>
            <span className="badge badge-mssql-red">7 Core Architecture Tiers</span>
          </div>

          {/* Controls: Search & Category Filter Pills */}
          <div className="concept-controls-bar">
            <div className="concept-search-input-wrapper">
              <Search size={15} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Filter concepts by keyword (e.g. 8 KB, B-Tree, RCSI, XML)..."
                value={conceptSearch}
                onChange={(e) => setConceptSearch(e.target.value)}
              />
              {conceptSearch && (
                <button onClick={() => setConceptSearch('')} className="clear-search-btn">
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="concept-pill-filters">
              <button 
                className={`concept-filter-pill ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                All Concepts ({COURSE_CONCEPTS.length})
              </button>
              {CONCEPT_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  className={`concept-filter-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{ '--pill-accent': cat.color }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Concept Architecture Nodes Flow */}
          <div className="concept-nodes-flow">
            {filteredConcepts.map((concept, idx) => {
              const catMeta = CONCEPT_CATEGORIES.find(c => c.id === concept.categoryId) || {};
              const isCopied = copiedConceptId === concept.id;

              return (
                <React.Fragment key={concept.id}>
                  {/* Visual SVG Flow Connector between concepts */}
                  {idx > 0 && (
                    <div className="concept-flow-arrow-row">
                      <div className="flow-line-vertical" />
                      <div className="flow-arrow-head">
                        <ArrowRight size={14} className="rotate-90 text-cyan-400" />
                      </div>
                    </div>
                  )}

                  {/* Concept Flow Card */}
                  <div 
                    className="concept-flow-card"
                    style={{ '--card-accent': catMeta.color || '#38bdf8' }}
                  >
                    <div className="concept-card-top">
                      <div className="concept-tier-badge">
                        <span>TIER 0{concept.tier}</span>
                        <span className="concept-dot" />
                        <span>{catMeta.label}</span>
                      </div>

                      <div className="concept-level-badge">
                        <span className={`badge badge-sm ${
                          concept.level === 'Foundational' ? 'badge-cyan' :
                          concept.level === 'Intermediate' ? 'badge-purple' : 'badge-mssql-red'
                        }`}>
                          {concept.level}
                        </span>
                      </div>
                    </div>

                    <div className="concept-card-main">
                      <h3 className="concept-title">{concept.title}</h3>
                      <p className="concept-summary">{concept.summary}</p>
                      
                      <div className="concept-dbre-box">
                        <strong className="dbre-tag">⚡ DBRE Significance:</strong>
                        <span>{concept.dbreSignificance}</span>
                      </div>

                      {/* Code Snippet Box with Actions */}
                      <div className="concept-sql-box">
                        <div className="sql-box-header">
                          <span className="sql-box-tag">
                            <Code size={12} />
                            T-SQL Architecture Implementation
                          </span>
                          <div className="sql-box-actions">
                            <button 
                              className="sql-action-btn"
                              onClick={() => handleCopyTsql(concept.tSqlExample, concept.id)}
                              title="Copy T-SQL snippet"
                            >
                              {isCopied ? <Check size={12} className="text-emerald" /> : <Copy size={12} />}
                              <span>{isCopied ? 'Copied' : 'Copy'}</span>
                            </button>
                            {onRunQueryInStudio && (
                              <button 
                                className="sql-action-btn run-btn"
                                onClick={() => onRunQueryInStudio(concept.tSqlExample)}
                                title="Run in interactive Query Studio"
                              >
                                <Play size={12} className="fill-current" />
                                <span>Run in Studio</span>
                              </button>
                            )}
                          </div>
                        </div>
                        <pre className="concept-sql-pre">
                          <code>{concept.tSqlExample}</code>
                        </pre>
                      </div>
                    </div>

                    <div className="concept-card-footer">
                      <div className="concept-link-item">
                        <span className="link-lbl">Official Lecture:</span>
                        <span className="badge badge-sm badge-dark">{concept.videoCode}</span>
                        <span className="video-title-link">{concept.videoTitle}</span>
                      </div>

                      <div className="concept-actions-right">
                        <a 
                          href={concept.msDocUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-ghost doc-link-btn"
                        >
                          <BookOpen size={13} />
                          <span>Microsoft Learn ↗</span>
                        </a>
                        <button 
                          className="btn btn-sm btn-secondary inspect-btn"
                          onClick={() => setActiveConcept(concept)}
                        >
                          <span>Deep Dive</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW B: CURRICULUM STAGES & MODULES */}
      {activeView === 'stages' && (
        <div className="flowchart-section card">
          <div className="section-title-row">
            <div className="title-with-logo">
              <img 
                src={mssqlLogo} 
                alt="MSSQL" 
                className="title-mssql-icon" 
                width="28" 
                height="28" 
                style={{ width: '28px', height: '28px', maxWidth: '28px', maxHeight: '28px', objectFit: 'contain', flexShrink: 0, display: 'inline-block' }}
              />
              <div>
                <h2>Interactive 6-Stage Curriculum Progression</h2>
                <p className="section-subtitle">
                  Traversing the complete 102 modules across Storage, T-SQL, Indexing, Triggers, CLR, and Reporting.
                </p>
              </div>
            </div>
            <span className="badge badge-mssql-red">102 Course Modules</span>
          </div>

          <div className="flowchart-stages-tree">
            {STAGES.map((stageItem, index) => {
              const stageVideos = COURSE_VIDEOS.filter(v => stageItem.videoIds.includes(v.id));
              const stageWatched = stageVideos.filter(v => watchedVideos.includes(v.id)).length;
              const stagePercent = stageVideos.length > 0 ? Math.round((stageWatched / stageVideos.length) * 100) : 0;
              const isCompleted = stagePercent === 100 && stageVideos.length > 0;
              const isCurrent = !isCompleted && (index === 0 || stageVideos.some(v => watchedVideos.includes(v.id)));

              return (
                <div key={stageItem.stage} className="flowchart-stage-wrapper">
                  {index > 0 && (
                    <div className="svg-connector-wrapper">
                      <svg width="40" height="40" viewBox="0 0 40 40">
                        <line x1="20" y1="0" x2="20" y2="40" stroke="#CC292B" strokeWidth="2.5" strokeDasharray="4 3" opacity="0.6" />
                        <circle cx="20" cy="20" r="4" fill="#CC292B" />
                      </svg>
                    </div>
                  )}

                  <div className={`flowchart-stage-card ${isCompleted ? 'stage-done' : ''} ${isCurrent ? 'stage-active' : ''}`}>
                    <div className="stage-top-bar">
                      <div className="stage-number-pill">
                        <span className="stage-num-text">STAGE 0{stageItem.stage}</span>
                        <span className="stage-status-icon">
                          {isCompleted ? '✅' : isCurrent ? '⚡' : '🔒'}
                        </span>
                      </div>

                      <div className="stage-heading-info">
                        <div className="stage-title-row">
                          <span className={`badge ${stageItem.badgeClass}`}>{stageItem.badge}</span>
                          <h3 className="stage-name">{stageItem.title}</h3>
                        </div>
                        <p className="stage-subtext">{stageItem.subtitle}</p>
                      </div>

                      <div className="stage-progress-indicator">
                        <div className="stage-pct">{stageWatched} / {stageVideos.length} Done ({stagePercent}%)</div>
                        <div className="stage-mini-track">
                          <div className="stage-mini-fill" style={{ width: `${stagePercent}%` }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="stage-skills-strip">
                      <span className="skills-label">Core Competencies:</span>
                      {stageItem.skills.map(s => (
                        <span key={s} className="skill-chip">{s}</span>
                      ))}
                    </div>

                    <div className="stage-milestone-box">
                      <Award size={16} className="milestone-icon" />
                      <div className="milestone-content">
                        <strong>Milestone Deliverable:</strong> {stageItem.milestone}
                      </div>
                    </div>

                    <div className="stage-nodes-grid">
                      {stageVideos.map(v => {
                        const isWatched = watchedVideos.includes(v.id);
                        return (
                          <div 
                            key={v.id} 
                            className={`diagram-node-item ${isWatched ? 'node-done' : ''}`}
                            onClick={() => openLessonModal(v.id)}
                          >
                            <div className="node-top-meta">
                              <button 
                                className="node-check-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleWatched(v.id);
                                }}
                                title={isWatched ? "Mark as unwatched" : "Mark as mastered"}
                              >
                                {isWatched ? <CheckCircle2 size={16} className="text-emerald" /> : <Circle size={16} />}
                              </button>
                              <span className="node-code">{v.videoCode}</span>
                              <span className="node-time">{v.duration}</span>
                            </div>

                            <div className="node-title">{v.title}</div>

                            <div className="node-footer">
                              <span className="badge badge-sm badge-dark">{v.level}</span>
                              <span className="node-inspect-cta">Inspect 📖</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW C: DBRE CAREER ROADMAP */}
      {activeView === 'career' && (
        <div className="career-roadmap-section card">
          <div className="section-title-row">
            <div className="title-with-logo">
              <GraduationCap size={28} className="text-emerald" />
              <div>
                <h2>Database Reliability Engineer Career Roadmap</h2>
                <p className="section-subtitle">
                  A 5-phase progression path from SQL beginner to enterprise DBRE architect, with curated resources at each stage.
                </p>
              </div>
            </div>
            <span className="badge badge-green">5 Career Phases</span>
          </div>

          <div className="career-phases-flow">
            {/* Phase 1: Foundation */}
            <div className="career-phase-card" style={{ '--phase-accent': '#0ea5e9' }}>
              <div className="career-phase-header">
                <span className="career-phase-number">Phase 01</span>
                <span className="career-phase-level badge badge-cyan">Beginner</span>
              </div>
              <h3 className="career-phase-title">🧱 SQL Foundations & Relational Theory</h3>
              <p className="career-phase-desc">
                Master the building blocks: SQL syntax, relational algebra, 3NF normalization, ERD design, and basic CRUD operations.
              </p>
              <div className="career-phase-topics">
                <span>SELECT/INSERT/UPDATE/DELETE</span>
                <span>JOINs & Subqueries</span>
                <span>Data Types</span>
                <span>Peter Chen ERD</span>
                <span>1NF → 3NF</span>
                <span>Primary & Foreign Keys</span>
              </div>
              <div className="career-phase-resources">
                <strong>Resources:</strong>
                <a href="https://sqlbolt.com/" target="_blank" rel="noopener noreferrer">SQLBolt ↗</a>
                <a href="https://www.w3schools.com/sql/" target="_blank" rel="noopener noreferrer">W3Schools SQL ↗</a>
                <a href="https://sqlzoo.net/wiki/SQL_Tutorial" target="_blank" rel="noopener noreferrer">SQLZoo ↗</a>
              </div>
              <div className="career-phase-course-link">
                📚 Course Alignment: <strong>CH01 VID01–VID05</strong> (Storage, Filegroups, ERD, Relational Mapping)
              </div>
            </div>

            <div className="career-phase-connector">
              <div className="connector-line" />
              <div className="connector-arrow">▼</div>
            </div>

            {/* Phase 2: Intermediate */}
            <div className="career-phase-card" style={{ '--phase-accent': '#10b981' }}>
              <div className="career-phase-header">
                <span className="career-phase-number">Phase 02</span>
                <span className="career-phase-level badge badge-green">Intermediate</span>
              </div>
              <h3 className="career-phase-title">⚡ T-SQL Programming & Transactions</h3>
              <p className="career-phase-desc">
                Write production T-SQL: variables, control flow, stored procedures, UDFs, error handling with TRY/CATCH, and ACID transactions.
              </p>
              <div className="career-phase-topics">
                <span>Variables & Flow Control</span>
                <span>Stored Procedures</span>
                <span>Scalar & Table UDFs</span>
                <span>TRY...CATCH</span>
                <span>XACT_ABORT</span>
                <span>Temp Tables</span>
                <span>Transactions & Savepoints</span>
              </div>
              <div className="career-phase-resources">
                <strong>Resources:</strong>
                <a href="https://www.microsoftpressstore.com/store/t-sql-fundamentals-9780138102104" target="_blank" rel="noopener noreferrer">T-SQL Fundamentals (Itzik Ben-Gan) ↗</a>
                <a href="https://leetcode.com/studyplan/top-sql-50/" target="_blank" rel="noopener noreferrer">LeetCode SQL 50 ↗</a>
              </div>
              <div className="career-phase-course-link">
                📚 Course Alignment: <strong>CH02</strong> (Variables, UDFs, System DBs, ACID Transactions)
              </div>
            </div>

            <div className="career-phase-connector">
              <div className="connector-line" />
              <div className="connector-arrow">▼</div>
            </div>

            {/* Phase 3: Advanced */}
            <div className="career-phase-card" style={{ '--phase-accent': '#8b5cf6' }}>
              <div className="career-phase-header">
                <span className="career-phase-number">Phase 03</span>
                <span className="career-phase-level badge badge-purple">Advanced</span>
              </div>
              <h3 className="career-phase-title">🔍 Performance Tuning & High Availability</h3>
              <p className="career-phase-desc">
                Optimize at scale: B-Tree indexing, execution plan analysis, partitioning, covering indexes, views, CTEs, and disaster recovery with Log Shipping and Database Mirroring.
              </p>
              <div className="career-phase-topics">
                <span>Clustered & NC Indexes</span>
                <span>Execution Plans</span>
                <span>Partitioning</span>
                <span>Table-Valued Parameters</span>
                <span>Indexed Views</span>
                <span>Log Shipping</span>
                <span>Database Mirroring</span>
                <span>XML/XQuery</span>
              </div>
              <div className="career-phase-resources">
                <strong>Resources:</strong>
                <a href="https://www.youtube.com/@BrentOzar" target="_blank" rel="noopener noreferrer">Brent Ozar (YouTube) ↗</a>
                <a href="https://www.sentryone.com/plan-explorer" target="_blank" rel="noopener noreferrer">Plan Explorer ↗</a>
                <a href="https://learn.microsoft.com/en-us/sql/relational-databases/query-processing-architecture-guide" target="_blank" rel="noopener noreferrer">Query Processing Guide ↗</a>
              </div>
              <div className="career-phase-course-link">
                📚 Course Alignment: <strong>CH01 VID06–16 + CH03</strong> (Indexes, Views, Partitioning, HA/DR)
              </div>
            </div>

            <div className="career-phase-connector">
              <div className="connector-line" />
              <div className="connector-arrow">▼</div>
            </div>

            {/* Phase 4: Expert */}
            <div className="career-phase-card" style={{ '--phase-accent': '#f59e0b' }}>
              <div className="career-phase-header">
                <span className="career-phase-number">Phase 04</span>
                <span className="career-phase-level badge badge-amber">Expert</span>
              </div>
              <h3 className="career-phase-title">🛡️ Automation, Governance & Security</h3>
              <p className="career-phase-desc">
                Build enterprise systems: DML/DDL audit triggers, schema guard triggers, CLR integration, PowerShell SMO automation, and CI/CD database deployment pipelines.
              </p>
              <div className="career-phase-topics">
                <span>DML Audit Triggers</span>
                <span>DDL Security Triggers</span>
                <span>OUTPUT Clause</span>
                <span>C# SQL CLR</span>
                <span>PowerShell SMO</span>
                <span>GitHub Actions CI/CD</span>
                <span>Idempotent Migrations</span>
              </div>
              <div className="career-phase-resources">
                <strong>Resources:</strong>
                <a href="https://dbatools.io/" target="_blank" rel="noopener noreferrer">dbatools PowerShell ↗</a>
                <a href="https://github.com/amachanic/sp_whoisactive" target="_blank" rel="noopener noreferrer">sp_WhoIsActive ↗</a>
                <a href="https://learn.microsoft.com/en-us/credentials/certifications/azure-database-administrator-associate/" target="_blank" rel="noopener noreferrer">DP-300 Certification ↗</a>
              </div>
              <div className="career-phase-course-link">
                📚 Course Alignment: <strong>CH04</strong> (Stored Procedures, Triggers, CLR, SMO)
              </div>
            </div>

            <div className="career-phase-connector">
              <div className="connector-line" />
              <div className="connector-arrow">▼</div>
            </div>

            {/* Phase 5: Architect */}
            <div className="career-phase-card" style={{ '--phase-accent': '#CC292B' }}>
              <div className="career-phase-header">
                <span className="career-phase-number">Phase 05</span>
                <span className="career-phase-level badge badge-mssql-red">Architect</span>
              </div>
              <h3 className="career-phase-title">📊 Data Warehousing & Enterprise Architecture</h3>
              <p className="career-phase-desc">
                Design enterprise data platforms: Kimball star schemas, Slowly Changing Dimensions (SCD), SSRS reporting, OLAP vs OLTP, columnstore indexes, and full platform architecture.
              </p>
              <div className="career-phase-topics">
                <span>Star Schema Design</span>
                <span>SCD Type 1 & 2</span>
                <span>Surrogate Keys</span>
                <span>Columnstore Indexes</span>
                <span>SSRS Reports</span>
                <span>ETL Architecture</span>
                <span>Enterprise DBRE</span>
              </div>
              <div className="career-phase-resources">
                <strong>Resources:</strong>
                <a href="https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/books/" target="_blank" rel="noopener noreferrer">Kimball Toolkit ↗</a>
                <a href="https://www.oreilly.com/library/view/database-reliability-engineering/9781491925935/" target="_blank" rel="noopener noreferrer">Database Reliability Engineering ↗</a>
                <a href="https://learn.microsoft.com/en-us/credentials/certifications/azure-data-engineer/" target="_blank" rel="noopener noreferrer">DP-203 Data Engineer ↗</a>
              </div>
              <div className="career-phase-course-link">
                📚 Course Alignment: <strong>CH05 + Final Capstone</strong> (Kimball Star, SCD, SSRS, Platform Deployment)
              </div>
            </div>
          </div>

          {/* Career Progress Indicator */}
          <div className="career-progress-summary">
            <div className="career-progress-info">
              <span>Your current progress places you at:</span>
              <strong style={{ color: progressPercent < 20 ? '#0ea5e9' : progressPercent < 40 ? '#10b981' : progressPercent < 60 ? '#8b5cf6' : progressPercent < 80 ? '#f59e0b' : '#CC292B' }}>
                {progressPercent < 20 ? 'Phase 1: SQL Foundations' :
                 progressPercent < 40 ? 'Phase 2: T-SQL Programming' :
                 progressPercent < 60 ? 'Phase 3: Performance & HA' :
                 progressPercent < 80 ? 'Phase 4: Automation & Governance' :
                 'Phase 5: Enterprise Architecture'}
              </strong>
            </div>
            <div className="career-progress-bar-track">
              <div className="career-progress-bar-fill" style={{ width: `${progressPercent}%` }} />
            </div>
            <span className="career-progress-pct">{progressPercent}% Complete</span>
          </div>
        </div>
      )}

      {/* 3. Concept Deep Dive Modal */}
      {activeConcept && (
        <div className="concept-modal-overlay" onClick={() => setActiveConcept(null)}>
          <div className="concept-modal-content card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex items-center gap-2">
                <span className="badge badge-cyan">Tier 0{activeConcept.tier}</span>
                <h3 className="modal-title">{activeConcept.title}</h3>
              </div>
              <button onClick={() => setActiveConcept(null)} className="close-btn">
                <X size={16} />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h4>📐 Architecture Overview</h4>
                <p>{activeConcept.summary}</p>
              </div>

              <div className="modal-section">
                <h4>⚡ Production DBRE Impact</h4>
                <p>{activeConcept.dbreSignificance}</p>
              </div>

              <div className="modal-section">
                <h4>💻 Production T-SQL Implementation</h4>
                <pre className="concept-modal-pre">
                  <code>{activeConcept.tSqlExample}</code>
                </pre>
              </div>

              <div className="modal-actions-bar">
                {onRunQueryInStudio && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      onRunQueryInStudio(activeConcept.tSqlExample);
                      setActiveConcept(null);
                    }}
                  >
                    <Play size={14} className="fill-current" />
                    <span>Run Query in Query Studio</span>
                  </button>
                )}
                <a 
                  href={activeConcept.msDocUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  <ExternalLink size={14} />
                  <span>Open Microsoft Documentation</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Cross-Cutting Engineering Synergy Matrix */}
      <div className="skill-matrix-section card">
        <div className="section-title-row">
          <h2>🌐 Microsoft SQL Server Engineering Competency Matrix</h2>
          <span className="badge badge-mssql-red">5 Core Disciplines</span>
        </div>
        <p className="matrix-desc">
          Mastering MaharaTech Course 2305 interconnects foundational relational development with five essential disciplines in enterprise data platform engineering:
        </p>

        <div className="competency-grid">
          <div className="competency-card">
            <div className="comp-header">
              <span className="comp-icon">🛡️</span>
              <h4>Database Reliability Engineering (DBRE)</h4>
            </div>
            <p>Always On Availability Groups, NTFS copy-on-write snapshots, point-in-time recovery with STOPAT, and automated schema guard DDL triggers.</p>
            <div className="comp-topics">
              <span>Always On AG</span><span>Snapshots</span><span>STOPAT</span><span>DDL Triggers</span>
            </div>
          </div>

          <div className="competency-card">
            <div className="comp-header">
              <span className="comp-icon">⚡</span>
              <h4>High-Throughput Data Engineering</h4>
            </div>
            <p>High-speed bulk ingestion via Table-Valued Parameters (TVPs), metadata-only sliding window partition switching, and XML shredding pipelines.</p>
            <div className="comp-topics">
              <span>TVP Ingestion</span><span>Sliding Window</span><span>XML Nodes</span><span>Staging ETL</span>
            </div>
          </div>

          <div className="competency-card">
            <div className="comp-header">
              <span className="comp-icon">🔍</span>
              <h4>Query Optimization & Storage Internals</h4>
            </div>
            <p>8 KB Page geometry, B-Tree clustered vs non-clustered index structures, covering index seeks, scalar UDF inlining, and tipping point analysis.</p>
            <div className="comp-topics">
              <span>8 KB Pages</span><span>Covering Index</span><span>UDF Inlining</span><span>Tipping Point</span>
            </div>
          </div>

          <div className="competency-card">
            <div className="comp-header">
              <span className="comp-icon">📊</span>
              <h4>Kimball Dimensional Modeling & BI</h4>
            </div>
            <p>OLTP to OLAP paradigm transition, star schemas with conformed dimensions, Slowly Changing Dimensions (SCD Type 2), and SSRS Matrix reports.</p>
            <div className="comp-topics">
              <span>Star Schema</span><span>SCD Type 2</span><span>Surrogate Keys</span><span>SSRS .rdl</span>
            </div>
          </div>

          <div className="competency-card">
            <div className="comp-header">
              <span className="comp-icon">🤖</span>
              <h4>Software Architecture & DevOps</h4>
            </div>
            <p>Compiled C# SQL CLR assemblies, automated database administration via PowerShell SMO, Python testing harnesses, and GitHub Actions CI/CD.</p>
            <div className="comp-topics">
              <span>C# CLR</span><span>PowerShell SMO</span><span>GitHub CI/CD</span><span>Idempotent DDL</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Course Attachments Manager */}
      <div className="attachments-section card">
        <div className="section-title-row">
          <h2>📎 Course Attachments & Student Resources</h2>
          <button className="btn btn-sm btn-secondary" onClick={handleAddAttachment}>
            <Plus size={14} />
            <span>Add Attachment</span>
          </button>
        </div>
        <p className="attachments-desc">
          Register course slides, homework prompts, exercise scripts, and personal notes as you move through each step of the course.
        </p>

        <div className="attachments-grid">
          <div className="attachment-item-card core-att" onClick={() => onSelectTab('docs-case-study')}>
            <BookOpen size={20} className="att-icon" />
            <div className="att-info">
              <div className="att-title">Company Case Study Implementation Guide</div>
              <div className="att-meta">CH01 Peter Chen ERD to 3NF Relational Mapping • Markdown</div>
            </div>
            <span className="att-badge">Official Guide</span>
          </div>

          <div className="attachment-item-card core-att" onClick={() => onSelectTab('docs-perf')}>
            <Code size={20} className="att-icon" />
            <div className="att-info">
              <div className="att-title">Performance Tuning & Indexing Handbook</div>
              <div className="att-meta">CH02 & CH03 Execution Plans, SARGability & Inlining • Markdown</div>
            </div>
            <span className="att-badge">Official Guide</span>
          </div>

          <div className="attachment-item-card core-att" onClick={() => onSelectTab('docs-dr')}>
            <ShieldCheck size={20} className="att-icon" />
            <div className="att-info">
              <div className="att-title">Disaster Recovery & HA Runbook</div>
              <div className="att-meta">CH03 Log Shipping, Snapshots & Standby Failover • Markdown</div>
            </div>
            <span className="att-badge">Official Guide</span>
          </div>

          {studentAttachments.map(att => (
            <div key={att.id} className="attachment-item-card user-att">
              <Database size={20} className="att-icon" />
              <div className="att-info">
                <div className="att-title">{att.title}</div>
                <div className="att-meta">{att.category} • {att.notes || 'User Note'}</div>
              </div>
              {att.url && (
                <a href={att.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-ghost">
                  Open ↗️
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
