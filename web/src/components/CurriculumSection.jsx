import React from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  FolderGit2, 
  CheckSquare, 
  Layers, 
  HardDrive, 
  Code2, 
  Cpu, 
  BarChart3, 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  GitBranch,
  ShieldCheck
} from 'lucide-react';
import { CURRICULUM_CHAPTERS, OBSIDIAN_VAULT_METRICS, REPO_METADATA } from '../data/repositoryData.js';

export default function CurriculumSection() {
  const getChapterIcon = (iconName) => {
    switch (iconName) {
      case 'HardDrive': return <HardDrive size={18} />;
      case 'Code2': return <Code2 size={18} />;
      case 'Layers': return <Layers size={18} />;
      case 'Cpu': return <Cpu size={18} />;
      case 'BarChart3': return <BarChart3 size={18} />;
      default: return <BookOpen size={18} />;
    }
  };

  return (
    <section id="curriculum" className="section">
      <div className="container">
        <span className="section-tag">MAHARATECH 2305 &bull; 102 LESSONS</span>
        <h2 className="section-title">Curriculum & Obsidian Second Brain</h2>
        <p className="section-subtitle">
          A comprehensive 5-chapter engineering curriculum spanning storage internals, ACID transactions, partitioning, programmability, SSRS, and Kimball data warehousing — coupled with a connected Obsidian Second Brain.
        </p>

        {/* Top Summary Metrics Bar */}
        <div className="curriculum-metrics-bar">
          <div className="curriculum-metric-item">
            <div className="metric-val">{OBSIDIAN_VAULT_METRICS.totalLessons}</div>
            <div className="metric-lbl">Video Lessons</div>
          </div>
          <div className="curriculum-metric-divider" />
          <div className="curriculum-metric-item">
            <div className="metric-val">{OBSIDIAN_VAULT_METRICS.totalChapters}</div>
            <div className="metric-lbl">Engineering Chapters</div>
          </div>
          <div className="curriculum-metric-divider" />
          <div className="curriculum-metric-item">
            <div className="metric-val">100%</div>
            <div className="metric-lbl">Production Code Covered</div>
          </div>
          <div className="curriculum-metric-divider" />
          <div className="curriculum-metric-item">
            <div className="metric-val">SQL-Red</div>
            <div className="metric-lbl">Obsidian PKM Theme</div>
          </div>
        </div>

        {/* 5 Chapters Grid */}
        <div className="curriculum-chapters-grid">
          {CURRICULUM_CHAPTERS.map((ch) => (
            <div key={ch.id} className="chapter-card">
              <div className="chapter-header">
                <div className="chapter-badge" style={{ color: ch.color, borderColor: `${ch.color}40`, background: `${ch.color}15` }}>
                  {getChapterIcon(ch.icon)}
                  <span>{ch.id}</span>
                </div>
                <span className="chapter-lesson-count">{ch.lessons} Lessons</span>
              </div>

              <h3 className="chapter-title">{ch.title}</h3>
              <p className="chapter-desc">{ch.description}</p>

              <div className="chapter-topics">
                <div className="topics-heading">Core Competencies:</div>
                <ul className="topics-list">
                  {ch.keyTopics.map((topic, idx) => (
                    <li key={idx}>
                      <span className="topic-bullet" style={{ background: ch.color }} />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="chapter-actions">
                <a
                  href={`${REPO_METADATA.repoUrl}/blob/master/${ch.githubReadme}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chapter-btn chapter-btn-obsidian"
                  title="Inspect Obsidian Chapter Hub on GitHub"
                >
                  <BookOpen size={14} />
                  <span>Obsidian Hub</span>
                  <ExternalLink size={12} style={{ opacity: 0.6 }} />
                </a>

                <a
                  href={ch.platformAnchor}
                  className="chapter-btn chapter-btn-platform"
                  title="Cross-reference live platform architecture"
                >
                  <span>Platform View</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Obsidian Second Brain Workflow Highlights */}
        <div className="obsidian-features-shell">
          <div className="obsidian-features-header">
            <div className="obsidian-features-tag">
              <Sparkles size={14} />
              <span>SECOND BRAIN ARCHITECTURE</span>
            </div>
            <h3 className="obsidian-features-title">Engineered Personal Knowledge Management (PKM)</h3>
            <p className="obsidian-features-sub">
              Designed for long-term database engineering retention. Every lesson note operates as an atomic knowledge node connected via metadata, Dataview queries, and live platform links.
            </p>
          </div>

          <div className="obsidian-features-grid">
            <div className="obsidian-feat-card">
              <div className="feat-icon-box" style={{ color: '#38bdf8' }}>
                <Code2 size={20} />
              </div>
              <h4 className="feat-title">Dataview Query Engine</h4>
              <p className="feat-desc">
                Dynamic automated dashboards across all 102 lessons, aggregating completion percentages, pending tasks, and related topics without manual bookmark maintenance.
              </p>
            </div>

            <div className="obsidian-feat-card">
              <div className="feat-icon-box" style={{ color: '#10b981' }}>
                <CheckSquare size={20} />
              </div>
              <h4 className="feat-title">4-Stage Verification Workflow</h4>
              <p className="feat-desc">
                Rigorous mastery cycle tracking <em>Watched</em>, <em>Reproduced in SSMS</em>, <em>Tested Edge Cases</em>, and <em>Documented</em> across every single lecture note.
              </p>
            </div>

            <div className="obsidian-feat-card">
              <div className="feat-icon-box" style={{ color: '#ec4899' }}>
                <ShieldCheck size={20} />
              </div>
              <h4 className="feat-title">Evaluation & Trade-off Tables</h4>
              <p className="feat-desc">
                Structured mental models questioning Correctness invariants, Performance storage/page impacts, and Architecture trade-offs for each T-SQL feature.
              </p>
            </div>

            <div className="obsidian-feat-card">
              <div className="feat-icon-box" style={{ color: '#f59e0b' }}>
                <GitBranch size={20} />
              </div>
              <h4 className="feat-title">Bi-Directional Platform Linkage</h4>
              <p className="feat-desc">
                Seamless two-way bridge connecting local Obsidian markdown vaults to live GitHub Pages interactive visualizations, GitHub repo files, and official MaharaTech lectures.
              </p>
            </div>
          </div>

          {/* Quick Access Action Bar */}
          <div className="curriculum-cta-bar">
            <a
              href={`${REPO_METADATA.repoUrl}/tree/master/docs/curriculum`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <FolderGit2 size={16} />
              <span>Browse Obsidian Vault on GitHub</span>
              <ExternalLink size={14} />
            </a>

            <a
              href={`${REPO_METADATA.repoUrl}/blob/master/${OBSIDIAN_VAULT_METRICS.trackerPath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              <CheckSquare size={16} />
              <span>Live Course Dashboard</span>
            </a>

            <a
              href={`${REPO_METADATA.repoUrl}/blob/master/${OBSIDIAN_VAULT_METRICS.studyPlanPath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              <Calendar size={16} />
              <span>DBRE Learning Roadmap</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
