/**
 * Interactive & Dynamic Learning Roadmap
 * Connected to MaharaTech Course 2305: Implementing and Developing SQL Server Objects
 * Features dynamic progress curve, cross-skill synergy matrix, and user attachment registry.
 */

import { COURSE_VIDEOS, COURSE_METADATA } from './video-catalog.js';

const STORAGE_KEY_WATCHED = 'omniflow_watched_videos';
const STORAGE_KEY_ATTACHMENTS = 'omniflow_student_attachments';

export const ROADMAP_STAGES = [
  {
    stageNumber: 1,
    title: "Storage Engine & Relational Modeling",
    subtitle: "Physical Storage Geometry, 3NF Normalization & Constraints",
    badge: "Foundations",
    badgeClass: "badge-cyan",
    icon: "🏢",
    chapter: 1,
    skills: ["Storage Internals", "8 KB Page Math", "Peter Chen ERD", "3NF Normalization", "Referential Integrity", "Database Snapshots"],
    videoIds: ["ch01-vid01", "ch01-vid02", "ch01-vid03", "ch01-vid04", "ch01-vid05"],
    deliverable: "Idempotent multi-filegroup 3NF Company Case Study database with circular foreign key resolution."
  },
  {
    stageNumber: 2,
    title: "Transactional Concurrency & Procedural T-SQL",
    subtitle: "ACID Isolation Levels, Locking Anomaly Mitigation & UDF Optimization",
    badge: "Core T-SQL",
    badgeClass: "badge-green",
    icon: "⚡",
    chapter: 2,
    skills: ["ACID Properties", "Transaction Log WAL", "Lock Modes (S/X/IS/IX)", "Snapshot Isolation (RCSI)", "UDF Inlining", "Inline TVFs"],
    videoIds: ["ch02-vid01", "ch02-vid02", "ch02-vid03", "ch02-vid04", "ch02-vid05", "ch02-vid06"],
    deliverable: "High-concurrency transactional payroll processing avoiding RBAR scalar function penalties."
  },
  {
    stageNumber: 3,
    title: "Advanced Scalability & Ingestion Pipelines",
    subtitle: "Horizontal Partitioning, Sliding Windows, TVPs & High Availability",
    badge: "Data Engineering",
    badgeClass: "badge-purple",
    icon: "🚀",
    chapter: 3,
    skills: ["Horizontal Partitioning", "Sliding Window SWITCH", "TVP Bulk Ingestion", "XML Shredding (.nodes)", "Log Shipping & AGs"],
    videoIds: ["ch03-vid01", "ch03-vid02", "ch03-vid03", "ch03-vid04", "ch03-vid05"],
    deliverable: "High-throughput telemetry ingestion pipeline with metadata-only partition switching and zero-downtime DR."
  },
  {
    stageNumber: 4,
    title: "Automated Governance, Triggers & Security",
    subtitle: "Defensive Stored Procedures, Audit Capture, SQL CLR & SMO Automation",
    badge: "DBRE & DevOps",
    badgeClass: "badge-amber",
    icon: "🛡️",
    chapter: 4,
    skills: ["Production Procedures", "DML inserted/deleted", "DDL EVENTDATA()", "C# SQL CLR Assemblies", "PowerShell SMO CI/CD"],
    videoIds: ["ch04-vid01", "ch04-vid02", "ch04-vid03", "ch04-vid04", "ch04-vid05"],
    deliverable: "Automated schema guard system capturing unauthorized DDL and rolling back corrupt multi-row DML."
  },
  {
    stageNumber: 5,
    title: "Kimball Dimensional Warehousing & Enterprise BI",
    subtitle: "OLAP Star Schemas, Slowly Changing Dimensions & SSRS Matrix Reporting",
    badge: "Analytics & BI",
    badgeClass: "badge-cyan",
    icon: "📊",
    chapter: 5,
    skills: ["Kimball Dimensional Modeling", "Conformed Dimensions", "Surrogate Keys", "SCD Type 2 History", "SSRS Matrix Reports"],
    videoIds: ["ch05-vid01", "ch05-vid02", "ch05-vid03", "ch05-vid04"],
    deliverable: "OmniFlowDW dimensional star schema with customer temporal lineage and drill-down executive matrix reporting."
  }
];

export function getWatchedVideos() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_WATCHED) || '[]');
  } catch (e) {
    return [];
  }
}

export function toggleVideoWatched(videoId) {
  const watched = getWatchedVideos();
  const idx = watched.indexOf(videoId);
  if (idx > -1) {
    watched.splice(idx, 1);
  } else {
    watched.push(videoId);
  }
  localStorage.setItem(STORAGE_KEY_WATCHED, JSON.stringify(watched));
  return watched;
}

export function getStudentAttachments() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_ATTACHMENTS) || '[]');
  } catch (e) {
    return [];
  }
}

export function saveStudentAttachment(attachment) {
  const list = getStudentAttachments();
  list.push({
    ...attachment,
    id: 'att-user-' + Date.now(),
    dateAdded: new Date().toISOString()
  });
  localStorage.setItem(STORAGE_KEY_ATTACHMENTS, JSON.stringify(list));
  return list;
}

export function computeStudentRank(masteryPercent) {
  if (masteryPercent >= 90) return { rank: "Lead DBRE & High Availability Architect", icon: "👑", color: "#f59e0b" };
  if (masteryPercent >= 70) return { rank: "Senior Data Platform Engineer", icon: "🌟", color: "#06b6d4" };
  if (masteryPercent >= 50) return { rank: "T-SQL Software Engineer", icon: "🚀", color: "#10b981" };
  if (masteryPercent >= 25) return { rank: "Junior Database Developer", icon: "🌱", color: "#8b5cf6" };
  return { rank: "Apprentice Data Explorer", icon: "🧭", color: "#94a3b8" };
}

export function setupLearningRoadmap(onOpenLessonModal, onSwitchTab) {
  const container = document.getElementById('learningRoadmapContainer');
  if (!container) return;

  function render() {
    const watched = getWatchedVideos();
    const userAttachments = getStudentAttachments();
    const totalVideos = COURSE_VIDEOS.length;
    const watchedCount = watched.length;
    const progressPercent = Math.round((watchedCount / totalVideos) * 100);
    const rankInfo = computeStudentRank(progressPercent);

    container.innerHTML = `
      <!-- Top Roadmap Header & Dynamic Mastery Progress -->
      <div class="roadmap-hero card">
        <div class="roadmap-hero-content">
          <div class="hero-tag-row">
            <span class="badge badge-purple">MaharaTech Course 2305</span>
            <span class="badge badge-cyan">Dynamic Learning Roadmap</span>
            <span class="badge badge-emerald">Interactive Engineering Journey</span>
          </div>
          <h1 class="hero-title">SQL Server Engineering & DBRE Mastery Roadmap</h1>
          <p class="hero-desc">
            A dynamic, structured pathway through the 25 lectures of <strong>Implementing and Developing SQL Server Objects</strong> taught by Eng. Rami Mohamed Abonagi (ITI). As you master lectures, complete challenges, and provide course attachments, your learning curve dynamically updates below.
          </p>

          <div class="rank-banner">
            <div class="rank-icon">${rankInfo.icon}</div>
            <div class="rank-details">
              <div class="rank-label">Current Professional Rank</div>
              <div class="rank-title" style="color: ${rankInfo.color}">${rankInfo.rank}</div>
            </div>
            <div class="rank-stats">
              <div class="rank-stat-item">
                <span class="stat-num">${watchedCount} / ${totalVideos}</span>
                <span class="stat-lbl">Lectures Mastered</span>
              </div>
              <div class="rank-stat-item">
                <span class="stat-num">${userAttachments.length}</span>
                <span class="stat-lbl">Custom Attachments</span>
              </div>
              <div class="rank-stat-item">
                <span class="stat-num">${watchedCount * 50} XP</span>
                <span class="stat-lbl">Earned Course XP</span>
              </div>
            </div>
          </div>

          <!-- Overall Dynamic Progress Bar -->
          <div class="overall-progress-bar-wrapper">
            <div class="progress-bar-header">
              <span>Overall Curriculum Completion</span>
              <strong>${progressPercent}% Complete</strong>
            </div>
            <div class="progress-bar-track">
              <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
            </div>
          </div>
        </div>

        <div class="roadmap-hero-actions">
          <a href="${COURSE_METADATA.portalUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            <span>Open MaharaTech Portal</span>
          </a>
          <button id="addAttachmentBtn" class="btn btn-secondary btn-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            <span>Add Course Attachment</span>
          </button>
        </div>
      </div>

      <!-- Quick Jump Hub to Interactive Labs -->
      <div class="quick-labs-banner card">
        <div class="banner-title">⚡ Interactive Pedagogy Pipeline:</div>
        <div class="quick-labs-links">
          <button class="btn btn-ghost btn-sm lab-link" data-tab="resources">🎥 25-Video Hub</button>
          <button class="btn btn-ghost btn-sm lab-link" data-tab="playground">⚡ In-Browser SQL Engine</button>
          <button class="btn btn-ghost btn-sm lab-link" data-tab="challenges">🏆 SQL Challenge Arena</button>
          <button class="btn btn-ghost btn-sm lab-link" data-tab="projects">🏗️ Enterprise Blueprints</button>
          <button class="btn btn-ghost btn-sm lab-link" data-tab="erd">🏢 Case Study Chen ERD</button>
          <button class="btn btn-ghost btn-sm lab-link" data-tab="plan-simulator">📊 Plan Simulator</button>
          <button class="btn btn-ghost btn-sm lab-link" data-tab="quiz">🧠 DBRE Quiz</button>
        </div>
      </div>

      <!-- 5 Progressive Stages Roadmap Tree -->
      <div class="roadmap-stages-container">
        <div class="section-title-row">
          <h2>🎯 5 Progressive Stages of Data Platform Engineering</h2>
          <span class="badge badge-purple">Click any lecture node to inspect details, run queries & take notes</span>
        </div>

        <div class="stages-timeline">
          ${ROADMAP_STAGES.map((stage) => {
            const stageVideos = COURSE_VIDEOS.filter(v => stage.videoIds.includes(v.id));
            const stageWatched = stageVideos.filter(v => watched.includes(v.id)).length;
            const stagePercent = Math.round((stageWatched / stageVideos.length) * 100);
            const isStageComplete = stagePercent === 100;

            return `
              <div class="roadmap-stage-card card ${isStageComplete ? 'stage-completed' : ''}">
                <div class="stage-header-row">
                  <div class="stage-number-badge">
                    <span class="stage-icon">${stage.icon}</span>
                    <span class="stage-step">Stage ${stage.stageNumber}</span>
                  </div>
                  <div class="stage-heading">
                    <div class="stage-title-group">
                      <span class="badge ${stage.badgeClass}">${stage.badge}</span>
                      <h3 class="stage-title">${stage.title}</h3>
                    </div>
                    <p class="stage-subtitle">${stage.subtitle}</p>
                  </div>
                  <div class="stage-progress-badge">
                    <div class="stage-progress-text">${stageWatched}/${stageVideos.length} Done (${stagePercent}%)</div>
                    <div class="stage-progress-mini-bar">
                      <div class="stage-progress-mini-fill" style="width: ${stagePercent}%;"></div>
                    </div>
                  </div>
                </div>

                <!-- Stage Connected Skills Tags -->
                <div class="stage-skills-matrix">
                  <span class="skills-matrix-label">Cross-Cutting Skills:</span>
                  ${stage.skills.map(s => `<span class="skill-pill">${s}</span>`).join('')}
                </div>

                <!-- Stage Deliverable Callout -->
                <div class="stage-deliverable">
                  <strong>📦 Milestone Project:</strong> ${stage.deliverable}
                </div>

                <!-- Stage Video Lecture Nodes -->
                <div class="stage-lecture-grid">
                  ${stageVideos.map(v => {
                    const isWatched = watched.includes(v.id);
                    return `
                      <div class="lecture-node-card ${isWatched ? 'node-watched' : ''}" data-video-id="${v.id}">
                        <div class="lecture-node-top">
                          <button class="node-status-toggle" data-video-id="${v.id}" title="${isWatched ? 'Mark as unwatched' : 'Mark as mastered'}">
                            ${isWatched ? '✅' : '⚪'}
                          </button>
                          <span class="lecture-code">${v.videoCode}</span>
                          <span class="lecture-duration">${v.duration}</span>
                        </div>
                        <div class="lecture-node-title">${v.title}</div>
                        <div class="lecture-node-bottom">
                          <span class="badge badge-sm badge-emerald">${v.level}</span>
                          <button class="btn btn-sm btn-ghost inspect-lecture-btn" data-video-id="${v.id}">
                            Inspect 📖
                          </button>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Cross-Skill Synergy & Engineering Matrix -->
      <div class="skill-matrix-section card">
        <div class="section-title-row">
          <h2>🌐 Cross-Cutting Engineering Competency Matrix</h2>
          <span class="badge badge-cyan">Skills Interconnection</span>
        </div>
        <p class="matrix-desc">
          Course 2305 directly connects foundational database knowledge to the 5 major modern engineering disciplines:
        </p>

        <div class="competency-grid">
          <div class="competency-card">
            <div class="comp-header">
              <span class="comp-icon">🛡️</span>
              <h4>Database Reliability Engineering (DBRE)</h4>
            </div>
            <p>High Availability (Always On AGs, Log Shipping), point-in-time recovery with NTFS snapshots, non-locking CDC triggers, and DDL schema drift protection.</p>
            <div class="comp-topics">
              <span>Snapshots</span><span>Log Shipping</span><span>DDL Triggers</span><span>XACT_ABORT</span>
            </div>
          </div>

          <div class="competency-card">
            <div class="comp-header">
              <span class="comp-icon">⚡</span>
              <h4>High-Throughput Data Engineering</h4>
            </div>
            <p>Bulk ingestion via Table-Valued Parameters (TVPs), metadata-only sliding window partition switching, and semi-structured XML shredding pipelines.</p>
            <div class="comp-topics">
              <span>TVP Ingestion</span><span>Partition Switching</span><span>XML Nodes</span><span>Staging ETL</span>
            </div>
          </div>

          <div class="competency-card">
            <div class="comp-header">
              <span class="comp-icon">🔍</span>
              <h4>Query Optimization & Storage Internals</h4>
            </div>
            <p>8 KB Page geometry, B-Tree clustered vs non-clustered indexes, covering index seeks, scalar function inlining, and cardinality estimation tuning.</p>
            <div class="comp-topics">
              <span>8 KB Pages</span><span>Covering Index</span><span>UDF Inlining</span><span>Tipping Point</span>
            </div>
          </div>

          <div class="competency-card">
            <div class="comp-header">
              <span class="comp-icon">📊</span>
              <h4>Kimball Dimensional Modeling & BI</h4>
            </div>
            <p>OLTP to OLAP paradigm transition, star schemas with conformed dimensions, Slowly Changing Dimensions (SCD Type 2), and SSRS Matrix reports.</p>
            <div class="comp-topics">
              <span>Star Schema</span><span>SCD Type 2</span><span>Surrogate Keys</span><span>SSRS .rdl</span>
            </div>
          </div>

          <div class="competency-card">
            <div class="comp-header">
              <span class="comp-icon">🤖</span>
              <h4>Software Architecture & DevOps</h4>
            </div>
            <p>Compiled C# SQL CLR assemblies, automated database administration via PowerShell SMO, Python testing harnesses, and GitHub Actions CI/CD.</p>
            <div class="comp-topics">
              <span>C# CLR</span><span>PowerShell SMO</span><span>GitHub CI/CD</span><span>Idempotent DDL</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Dynamic Course Attachments Manager Section -->
      <div class="attachments-section card">
        <div class="section-title-row">
          <h2>📎 Dynamic Course Attachments & Student Resources</h2>
          <span class="badge badge-amber">Persistent Student Artifacts</span>
        </div>
        <p class="attachments-desc">
          As you move through each step of the course, you can register and organize course slides, homework prompts, exercise solutions, and external notes. All attachments are saved locally and accessible across the platform.
        </p>

        <div class="attachments-grid">
          <!-- Pre-seeded Core Course Attachments -->
          <div class="attachment-item-card core-att">
            <div class="att-icon">📋</div>
            <div class="att-info">
              <div class="att-title">Company Case Study Implementation Guide</div>
              <div class="att-meta">CH01 Peter Chen ERD to 3NF Relational Mapping • Markdown</div>
            </div>
            <button class="btn btn-sm btn-ghost open-doc-att" data-tab="docs-case-study">Read Guide</button>
          </div>

          <div class="attachment-item-card core-att">
            <div class="att-icon">⚡</div>
            <div class="att-info">
              <div class="att-title">ACID Concurrency & Locking Guide</div>
              <div class="att-meta">CH02 Transaction Isolation & RCSI Deep-Dive • Markdown</div>
            </div>
            <button class="btn btn-sm btn-ghost open-doc-att" data-tab="docs-learning">Read Guide</button>
          </div>

          <div class="attachment-item-card core-att">
            <div class="att-icon">🛡️</div>
            <div class="att-info">
              <div class="att-title">Disaster Recovery & HA Runbook</div>
              <div class="att-meta">CH03 Log Shipping, Snapshots & Standby Failover • Markdown</div>
            </div>
            <button class="btn btn-sm btn-ghost open-doc-att" data-tab="docs-dr">Read Guide</button>
          </div>

          <div class="attachment-item-card core-att">
            <div class="att-icon">🚀</div>
            <div class="att-info">
              <div class="att-title">Performance Tuning & Indexing Handbook</div>
              <div class="att-meta">CH02 & CH03 Execution Plans, SARGability & Inlining • Markdown</div>
            </div>
            <button class="btn btn-sm btn-ghost open-doc-att" data-tab="docs-perf">Read Guide</button>
          </div>

          <!-- Dynamically Added User Attachments -->
          ${userAttachments.map(att => `
            <div class="attachment-item-card user-att">
              <div class="att-icon">📌</div>
              <div class="att-info">
                <div class="att-title">${att.title}</div>
                <div class="att-meta">${att.category} • ${att.notes || 'User Note'}</div>
              </div>
              ${att.url ? `<a href="${att.url}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-ghost">Open ↗️</a>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Event Bindings
    // 1. Lab jump links
    container.querySelectorAll('.lab-link').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        if (onSwitchTab) onSwitchTab(tab);
      });
    });

    // 2. Doc attachment links
    container.querySelectorAll('.open-doc-att').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        if (onSwitchTab) onSwitchTab(tab);
      });
    });

    // 3. Inspect lecture modal trigger
    container.querySelectorAll('.inspect-lecture-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const vidId = btn.getAttribute('data-video-id');
        if (onOpenLessonModal) onOpenLessonModal(vidId);
      });
    });

    container.querySelectorAll('.lecture-node-card').forEach(card => {
      card.addEventListener('click', () => {
        const vidId = card.getAttribute('data-video-id');
        if (onOpenLessonModal) onOpenLessonModal(vidId);
      });
    });

    // 4. Status toggle button (check / uncheck)
    container.querySelectorAll('.node-status-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const vidId = btn.getAttribute('data-video-id');
        toggleVideoWatched(vidId);
        render();
      });
    });

    // 5. Add custom attachment modal trigger
    const addAttBtn = container.querySelector('#addAttachmentBtn');
    if (addAttBtn) {
      addAttBtn.addEventListener('click', () => {
        promptAddAttachment(render);
      });
    }
  }

  function promptAddAttachment(onSuccess) {
    const title = prompt("Enter Attachment or Note Title (e.g., 'Chapter 2 Quiz Solutions' or 'Lecture 4 Slides'):");
    if (!title) return;
    const category = prompt("Enter Category / Chapter (e.g., 'Chapter 1', 'Homework', 'SQL Script'):") || "General";
    const notes = prompt("Enter Summary / Notes for this attachment:") || "";
    const url = prompt("Optional External URL / Link (leave blank if none):") || "";

    saveStudentAttachment({ title, category, notes, url });
    onSuccess();
  }

  render();
}
