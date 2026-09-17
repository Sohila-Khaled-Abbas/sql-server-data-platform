import React from 'react';
import { useProgress } from '../context/ProgressContext.jsx';
import { COURSE_VIDEOS, COURSE_METADATA } from '../data/videoCatalog.js';
import { 
  CheckCircle2, 
  Circle, 
  ExternalLink, 
  Plus, 
  Sparkles, 
  Award, 
  FolderPlus, 
  BookOpen, 
  Code, 
  ShieldCheck, 
  Database 
} from 'lucide-react';
import mssqlLogo from '../assets/mssql-logo.svg';

const STAGES = [
  {
    stage: 1,
    title: "Storage Engine & Relational Modeling",
    subtitle: "Physical 8 KB Page Geometry, 3NF Normalization & Constraints",
    badge: "Foundations",
    badgeClass: "badge-cyan",
    videoIds: ["ch01-vid01", "ch01-vid02", "ch01-vid03", "ch01-vid04", "ch01-vid05"],
    milestone: "Company Case Study 3NF Database & Circular FK Resolution",
    skills: ["Storage Internals", "8 KB Page Math", "Peter Chen ERD", "3NF Normalization", "Referential Integrity", "Database Snapshots"],
    msDocsTopic: "Database Files & Extents Architecture Guide"
  },
  {
    stage: 2,
    title: "Transactional Concurrency & Procedural T-SQL",
    subtitle: "ACID Boundaries, Locking Modes, RCSI & Scalar UDF Inlining",
    badge: "Core T-SQL",
    badgeClass: "badge-green",
    videoIds: ["ch02-vid01", "ch02-vid02", "ch02-vid03", "ch02-vid04", "ch02-vid05", "ch02-vid06"],
    milestone: "High-Concurrency ACID Transaction Management & Zero-RBAR Inlining",
    skills: ["ACID Properties", "WAL Logging", "Locking Modes (S/X/IS/IX)", "RCSI Snapshot", "Scalar Inlining", "Inline TVFs"],
    msDocsTopic: "Transaction Locking and Row Versioning Guide"
  },
  {
    stage: 3,
    title: "Advanced Scalability & Ingestion Pipelines",
    subtitle: "Horizontal Partitioning, Sliding Windows, TVPs & High Availability",
    badge: "Data Engineering",
    badgeClass: "badge-purple",
    videoIds: ["ch03-vid01", "ch03-vid02", "ch03-vid03", "ch03-vid04", "ch03-vid05"],
    milestone: "Sub-Second Sliding Window Archival & Always On Disaster Recovery",
    skills: ["Horizontal Partitioning", "Sliding Window SWITCH", "TVP Batch Ingest", "XML Shredding (.nodes)", "Log Shipping & AGs"],
    msDocsTopic: "Partitioned Tables and Indexes & Always On AGs"
  },
  {
    stage: 4,
    title: "Automated Governance, Triggers & Security",
    subtitle: "Defensive Procedures, Audit Change Capture, SQL CLR & SMO",
    badge: "DBRE & DevOps",
    badgeClass: "badge-amber",
    videoIds: ["ch04-vid01", "ch04-vid02", "ch04-vid03", "ch04-vid04", "ch04-vid05"],
    milestone: "Automated Schema Guard System & PowerShell SMO CI/CD Automation",
    skills: ["Production Procedures", "DML inserted/deleted", "DDL EVENTDATA()", "C# SQL CLR Assemblies", "PowerShell SMO"],
    msDocsTopic: "DML & DDL Triggers and CLR Integration Architecture"
  },
  {
    stage: 5,
    title: "Kimball Dimensional Warehousing & Enterprise BI",
    subtitle: "OLAP Star Schemas, Slowly Changing Dimensions (SCD2) & SSRS",
    badge: "Analytics & BI",
    badgeClass: "badge-mssql-red",
    videoIds: ["ch05-vid01", "ch05-vid02", "ch05-vid03", "ch05-vid04"],
    milestone: "OmniFlowDW Star Schema with Temporal Lineage & SSRS Reports",
    skills: ["Kimball Methodology", "Conformed Dimensions", "Surrogate Keys", "SCD Type 2 History", "SSRS Matrix Reports"],
    msDocsTopic: "Columnstore Indexes & Paginated Reporting Services"
  }
];

export default function RoadmapDiagram({ onSelectTab }) {
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
      {/* 1. Header Banner */}
      <div className="roadmap-hero card">
        <div className="roadmap-hero-content">
          <div className="hero-tag-row">
            <span className="badge badge-mssql-red">Microsoft SQL Server 2022</span>
            <span className="badge badge-purple">MaharaTech Course 2305</span>
            <span className="badge badge-cyan">Visual Flowchart Roadmap</span>
          </div>

          <h1 className="hero-title">SQL Server Data Platform & DBRE Learning Roadmap</h1>
          <p className="hero-desc">
            A visual, diagrammatic curriculum traversing the 25 official video lectures of <strong>Implementing and Developing SQL Server Objects</strong> taught by Eng. Rami Mohamed Abonagi (ITI). Click any node to open the lesson inspector, run demonstration queries, and review official Microsoft Learn architecture documentation.
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

      {/* 2. Visual Diagrammatic Flowchart (Stages with SVG Connectors) */}
      <div className="flowchart-section card">
        <div className="section-title-row">
          <div className="title-with-logo">
            <img src={mssqlLogo} alt="MSSQL" className="title-mssql-icon" width="28" height="28" />
            <h2>Interactive 5-Stage Engineering Flowchart</h2>
          </div>
          <span className="badge badge-mssql-red">Interactive Pathway</span>
        </div>

        <div className="flowchart-stages-tree">
          {STAGES.map((stageItem, index) => {
            const stageVideos = COURSE_VIDEOS.filter(v => stageItem.videoIds.includes(v.id));
            const stageWatched = stageVideos.filter(v => watchedVideos.includes(v.id)).length;
            const stagePercent = Math.round((stageWatched / stageVideos.length) * 100);
            const isCompleted = stagePercent === 100;
            const isCurrent = !isCompleted && (index === 0 || stageVideos.some(v => watchedVideos.includes(v.id)));

            return (
              <div key={stageItem.stage} className="flowchart-stage-wrapper">
                {/* Visual Connector Line between Stages */}
                {index > 0 && (
                  <div className="svg-connector-wrapper">
                    <svg width="40" height="40" viewBox="0 0 40 40">
                      <line x1="20" y1="0" x2="20" y2="40" stroke="#CC292B" strokeWidth="2.5" strokeDasharray="4 3" opacity="0.6" />
                      <circle cx="20" cy="20" r="4" fill="#CC292B" />
                    </svg>
                  </div>
                )}

                {/* Stage Flow Card */}
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

                  {/* Skills Grid */}
                  <div className="stage-skills-strip">
                    <span className="skills-label">Core Competencies:</span>
                    {stageItem.skills.map(s => (
                      <span key={s} className="skill-chip">{s}</span>
                    ))}
                  </div>

                  {/* Milestone Banner */}
                  <div className="stage-milestone-box">
                    <Award size={16} className="milestone-icon" />
                    <div className="milestone-content">
                      <strong>Milestone Deliverable:</strong> {stageItem.milestone}
                    </div>
                  </div>

                  {/* Diagrammatic Video Nodes Grid */}
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

      {/* 3. Cross-Cutting Engineering Synergy Matrix */}
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

      {/* 4. Course Attachments Manager */}
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
