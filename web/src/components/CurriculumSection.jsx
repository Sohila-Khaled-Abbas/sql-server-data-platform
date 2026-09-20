import React, { useState, useEffect, useMemo } from 'react';
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
  ShieldCheck,
  Search,
  RefreshCw,
  Filter,
  CheckCircle2,
  Clock,
  FileCode,
  Flame,
  Zap,
  HelpCircle,
  Database
} from 'lucide-react';
import { 
  fetchCurriculumManifest, 
  checkGitHubSyncStatus,
  getStoredUserTasks,
  getLessonCompletedTasksCount
} from '../services/obsidianApiService.js';
import NoteViewerModal from './NoteViewerModal.jsx';
import { REPO_METADATA } from '../data/repositoryData.js';

export default function CurriculumSection() {
  const [manifest, setManifest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('lessons'); // 'lessons' | 'concepts' | 'patterns' | 'cheats' | 'overview'
  const [chapterFilter, setChapterFilter] = useState('ALL');
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userTasks, setUserTasks] = useState({});

  // Load manifest & sync status on mount
  useEffect(() => {
    loadManifestData(false);
    checkGitHubSyncStatus().then(setSyncStatus);

    const handleProgressUpdate = () => {
      setUserTasks(getStoredUserTasks());
    };
    window.addEventListener('pkm-progress-updated', handleProgressUpdate);
    setUserTasks(getStoredUserTasks());

    return () => {
      window.removeEventListener('pkm-progress-updated', handleProgressUpdate);
    };
  }, []);

  const loadManifestData = async (forceRefresh = false) => {
    if (forceRefresh) setSyncing(true);
    try {
      const data = await fetchCurriculumManifest(forceRefresh);
      setManifest(data);
      if (forceRefresh) {
        const updatedStatus = await checkGitHubSyncStatus();
        setSyncStatus(updatedStatus);
      }
    } catch (err) {
      console.error('Failed to load curriculum manifest:', err);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  const openNoteModal = (note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  // Filter lessons
  const filteredLessons = useMemo(() => {
    if (!manifest || !manifest.lessons) return [];

    return manifest.lessons.filter((lesson) => {
      // Chapter filter
      if (chapterFilter !== 'ALL' && lesson.chapter !== chapterFilter) {
        return false;
      }
      // Difficulty filter
      if (difficultyFilter !== 'ALL' && lesson.difficulty !== difficultyFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchTitle = lesson.title.toLowerCase().includes(q);
        const matchId = lesson.id.toLowerCase().includes(q);
        const matchTopic = lesson.topics && lesson.topics.some(t => t.toLowerCase().includes(q));
        const matchCode = lesson.code_reference && lesson.code_reference.toLowerCase().includes(q);
        if (!matchTitle && !matchId && !matchTopic && !matchCode) {
          return false;
        }
      }
      return true;
    });
  }, [manifest, chapterFilter, difficultyFilter, searchQuery]);

  // Filter concepts
  const filteredConcepts = useMemo(() => {
    if (!manifest || !manifest.concepts) return [];
    if (searchQuery.trim() === '') return manifest.concepts;
    const q = searchQuery.toLowerCase();
    return manifest.concepts.filter(c => 
      c.title.toLowerCase().includes(q) || 
      c.domain.toLowerCase().includes(q) || 
      (c.summary && c.summary.toLowerCase().includes(q))
    );
  }, [manifest, searchQuery]);

  // Filter SQL patterns
  const filteredPatterns = useMemo(() => {
    if (!manifest || !manifest.sql_patterns) return [];
    if (searchQuery.trim() === '') return manifest.sql_patterns;
    const q = searchQuery.toLowerCase();
    return manifest.sql_patterns.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) || 
      (p.problem && p.problem.toLowerCase().includes(q))
    );
  }, [manifest, searchQuery]);

  // Calculate overall task completion metrics
  const totalTasksCount = useMemo(() => {
    if (!manifest || !manifest.lessons) return 0;
    return manifest.lessons.reduce((acc, l) => acc + (l.abilities ? l.abilities.length : 0), 0);
  }, [manifest]);

  const completedTasksCount = useMemo(() => {
    return Object.values(userTasks).filter(Boolean).length;
  }, [userTasks]);

  const overallProgressPercent = totalTasksCount > 0 
    ? Math.round((completedTasksCount / totalTasksCount) * 100) 
    : 0;

  const getChapterIcon = (iconName) => {
    switch (iconName) {
      case 'HardDrive': return <HardDrive size={18} />;
      case 'Code2': return <Code2 size={18} />;
      case 'Layers': return <Layers size={18} />;
      case 'Cpu': return <Cpu size={18} />;
      case 'BarChart3': return <BarChart3 size={18} />;
      case 'GitBranch': return <GitBranch size={18} />;
      default: return <BookOpen size={18} />;
    }
  };

  return (
    <section id="curriculum" className="section curriculum-enhanced-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-row">
          <div>
            <span className="section-tag">MAHARATECH 2305 &bull; OBSIDIAN SECOND BRAIN</span>
            <h2 className="section-title">Curriculum & Personal Knowledge Management (PKM)</h2>
            <p className="section-subtitle">
              A dynamically integrated 10-folder Second Brain vault covering 102 lessons, 33 architectural concepts, 18 T-SQL patterns, and 20 cheat sheets — powered by a live GitHub API sync.
            </p>
          </div>

          {/* Live Sync Status Pill */}
          <div className="pkm-sync-status-card">
            <div className="sync-status-indicator">
              <span className="sync-dot active" />
              <span className="sync-text">
                {syncStatus?.online ? `GitHub API Connected (${syncStatus.sha || 'master'})` : 'Local Manifest Active'}
              </span>
            </div>
            <button 
              className={`sync-refresh-btn ${syncing ? 'spinning' : ''}`}
              onClick={() => loadManifestData(true)}
              title="Force sync curriculum from GitHub master branch"
              disabled={syncing}
            >
              <RefreshCw size={14} />
              <span>{syncing ? 'Syncing...' : 'Sync Vault'}</span>
            </button>
          </div>
        </div>

        {/* Top Summary Metrics & Progress Bar */}
        <div className="curriculum-metrics-bar">
          <div className="curriculum-metric-item">
            <div className="metric-val">{manifest?.total_lessons || 102}</div>
            <div className="metric-lbl">Video Lessons</div>
          </div>
          <div className="curriculum-metric-divider" />
          <div className="curriculum-metric-item">
            <div className="metric-val">{manifest?.total_concepts || 33}</div>
            <div className="metric-lbl">Atomic Concepts</div>
          </div>
          <div className="curriculum-metric-divider" />
          <div className="curriculum-metric-item">
            <div className="metric-val">{manifest?.total_patterns || 18}</div>
            <div className="metric-lbl">T-SQL Patterns</div>
          </div>
          <div className="curriculum-metric-divider" />
          <div className="curriculum-metric-item">
            <div className="metric-val">{manifest?.total_cheat_sheets || 20}</div>
            <div className="metric-lbl">Revision Cheat Sheets</div>
          </div>
          <div className="curriculum-metric-divider" />
          <div className="curriculum-metric-item progress-metric-box">
            <div className="metric-val highlight-accent">{overallProgressPercent}%</div>
            <div className="metric-lbl">Abilities Mastered ({completedTasksCount}/{totalTasksCount})</div>
            <div className="curriculum-global-progress-track">
              <div 
                className="curriculum-global-progress-fill" 
                style={{ width: `${overallProgressPercent}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Second Brain Navigation Tabs */}
        <div className="pkm-tab-nav">
          <button 
            className={`pkm-tab-btn ${activeTab === 'lessons' ? 'active' : ''}`}
            onClick={() => setActiveTab('lessons')}
          >
            <BookOpen size={16} />
            <span>102 Video Lessons</span>
            <span className="pkm-tab-count">{manifest?.total_lessons || 102}</span>
          </button>

          <button 
            className={`pkm-tab-btn ${activeTab === 'concepts' ? 'active' : ''}`}
            onClick={() => setActiveTab('concepts')}
          >
            <Zap size={16} />
            <span>Concept Graph</span>
            <span className="pkm-tab-count">{manifest?.total_concepts || 33}</span>
          </button>

          <button 
            className={`pkm-tab-btn ${activeTab === 'patterns' ? 'active' : ''}`}
            onClick={() => setActiveTab('patterns')}
          >
            <Code2 size={16} />
            <span>SQL Pattern Cookbook</span>
            <span className="pkm-tab-count">{manifest?.total_patterns || 18}</span>
          </button>

          <button 
            className={`pkm-tab-btn ${activeTab === 'cheats' ? 'active' : ''}`}
            onClick={() => setActiveTab('cheats')}
          >
            <FileCode size={16} />
            <span>Cheat Sheets</span>
            <span className="pkm-tab-count">{manifest?.total_cheat_sheets || 20}</span>
          </button>

          <button 
            className={`pkm-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Layers size={16} />
            <span>Chapter Hubs</span>
            <span className="pkm-tab-count">5</span>
          </button>
        </div>

        {/* Dynamic Search & Filters Toolbar */}
        {activeTab !== 'overview' && (
          <div className="pkm-toolbar">
            <div className="pkm-search-box">
              <Search size={16} className="search-icon" />
              <input 
                type="text" 
                placeholder={`Search across ${activeTab}... (e.g. Filegroups, TVP, B-Tree, SCD2)`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>&times;</button>
              )}
            </div>

            {activeTab === 'lessons' && (
              <div className="pkm-filters-group">
                <div className="chapter-filter-pills">
                  {['ALL', 'CH01', 'CH02', 'CH03', 'CH04', 'CH05', 'FINAL'].map((ch) => (
                    <button 
                      key={ch}
                      className={`filter-pill ${chapterFilter === ch ? 'active' : ''}`}
                      onClick={() => setChapterFilter(ch)}
                    >
                      {ch}
                    </button>
                  ))}
                </div>

                <div className="difficulty-select-wrap">
                  <select 
                    value={difficultyFilter} 
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="difficulty-select"
                  >
                    <option value="ALL">All Difficulties</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 1: 102 VIDEO LESSONS EXPLORER */}
        {activeTab === 'lessons' && (
          <div className="lessons-tab-view">
            <div className="results-count-bar">
              <span>Showing <strong>{filteredLessons.length}</strong> of {manifest?.total_lessons || 102} lessons</span>
              {chapterFilter !== 'ALL' && <span className="active-filter-badge">Chapter: {chapterFilter}</span>}
              {difficultyFilter !== 'ALL' && <span className="active-filter-badge">Difficulty: {difficultyFilter}</span>}
            </div>

            <div className="lessons-cards-grid">
              {filteredLessons.map((lesson) => {
                const totalAbilities = lesson.abilities ? lesson.abilities.length : 0;
                const completedAbilities = getLessonCompletedTasksCount(lesson.id, totalAbilities);
                const isFullyMastered = totalAbilities > 0 && completedAbilities === totalAbilities;

                return (
                  <div 
                    key={lesson.id} 
                    className={`lesson-interactive-card ${isFullyMastered ? 'mastered' : ''}`}
                  >
                    <div className="lesson-card-header">
                      <div className="lesson-badge-wrap">
                        <span 
                          className="lesson-ch-badge" 
                          style={{ color: lesson.chapter_color || '#38bdf8', borderColor: `${lesson.chapter_color || '#38bdf8'}40` }}
                        >
                          {lesson.chapter}
                        </span>
                        <span className="lesson-id-tag">{lesson.id}</span>
                      </div>
                      <span className={`lesson-diff-pill diff-${lesson.difficulty || 'medium'}`}>
                        {lesson.difficulty || 'medium'}
                      </span>
                    </div>

                    <h3 className="lesson-card-title">{lesson.title}</h3>

                    {lesson.learning_goal && (
                      <p className="lesson-card-goal">{lesson.learning_goal}</p>
                    )}

                    {lesson.topics && lesson.topics.length > 0 && (
                      <div className="lesson-topics-strip">
                        {lesson.topics.slice(0, 3).map((topic, i) => (
                          <span key={i} className="topic-pill">#{topic}</span>
                        ))}
                      </div>
                    )}

                    <div className="lesson-card-progress">
                      <div className="progress-info">
                        <span className="progress-text">
                          Abilities: <strong>{completedAbilities} / {totalAbilities}</strong>
                        </span>
                        {isFullyMastered && (
                          <span className="mastered-tag">
                            <CheckCircle2 size={13} color="#10b981" />
                            <span>Mastered</span>
                          </span>
                        )}
                      </div>
                      <div className="progress-bar-track">
                        <div 
                          className="progress-bar-fill" 
                          style={{ 
                            width: `${totalAbilities > 0 ? (completedAbilities / totalAbilities) * 100 : 0}%`,
                            background: lesson.chapter_color || '#38bdf8'
                          }} 
                        />
                      </div>
                    </div>

                    <div className="lesson-card-actions">
                      <button 
                        className="btn-read-note"
                        onClick={() => openNoteModal(lesson)}
                        title="Read full 17-section note rendered dynamically via API"
                      >
                        <BookOpen size={14} />
                        <span>Read Note</span>
                      </button>

                      <a 
                        href={lesson.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-link-gh"
                        title="Open on GitHub"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ATOMIC CONCEPT GRAPH (33 CONCEPTS) */}
        {activeTab === 'concepts' && (
          <div className="concepts-tab-view">
            <div className="results-count-bar">
              <span>Showing <strong>{filteredConcepts.length}</strong> of {manifest?.total_concepts || 33} atomic concepts</span>
            </div>

            <div className="concepts-grid">
              {filteredConcepts.map((concept) => (
                <div key={concept.id} className="concept-card">
                  <div className="concept-header">
                    <span className="concept-domain-badge">{concept.domain}</span>
                    <button 
                      className="btn-icon-read"
                      onClick={() => openNoteModal(concept)}
                      title="Open Concept Note"
                    >
                      <BookOpen size={14} />
                    </button>
                  </div>
                  <h4 className="concept-title">{concept.title}</h4>
                  <p className="concept-summary">{concept.summary || 'Fundamental database architectural concept and engine mechanics.'}</p>
                  <div className="concept-footer">
                    <button 
                      className="btn-concept-read"
                      onClick={() => openNoteModal(concept)}
                    >
                      <span>Read Concept Note</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SQL PATTERN COOKBOOK (18 PATTERNS) */}
        {activeTab === 'patterns' && (
          <div className="patterns-tab-view">
            <div className="results-count-bar">
              <span>Showing <strong>{filteredPatterns.length}</strong> of {manifest?.total_patterns || 18} production T-SQL recipes</span>
            </div>

            <div className="patterns-grid">
              {filteredPatterns.map((pattern) => (
                <div key={pattern.id} className="pattern-card">
                  <div className="pattern-header">
                    <span className="pattern-cat-badge">{pattern.category}</span>
                    <button 
                      className="btn-icon-read"
                      onClick={() => openNoteModal(pattern)}
                      title="Inspect Pattern Implementation"
                    >
                      <Code2 size={14} />
                    </button>
                  </div>
                  <h4 className="pattern-title">{pattern.title}</h4>
                  <p className="pattern-desc">{pattern.problem || 'Production T-SQL recipe addressing high-throughput and reliability challenges.'}</p>
                  <div className="pattern-footer">
                    <button 
                      className="btn-pattern-read"
                      onClick={() => openNoteModal(pattern)}
                    >
                      <span>Open T-SQL Pattern</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: REVISION CHEAT SHEETS (20 SHEETS) */}
        {activeTab === 'cheats' && (
          <div className="cheats-tab-view">
            <div className="results-count-bar">
              <span>Showing <strong>{manifest?.cheat_sheets?.length || 20}</strong> fast-reference syntax cheat sheets</span>
            </div>

            <div className="cheats-grid">
              {manifest?.cheat_sheets?.map((cs) => (
                <div key={cs.id} className="cheat-card" onClick={() => openNoteModal(cs)}>
                  <div className="cheat-icon-box">
                    <FileCode size={20} color="#38bdf8" />
                  </div>
                  <div className="cheat-info">
                    <h4 className="cheat-title">{cs.title}</h4>
                    <span className="cheat-path">docs/curriculum/06 - REVISION/Cheat Sheets</span>
                  </div>
                  <ArrowRight size={16} className="cheat-arrow" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: 5 CHAPTER HUBS OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="overview-tab-view">
            <div className="curriculum-chapters-grid">
              {manifest?.chapters?.map((ch) => (
                <div key={ch.id} className="chapter-card">
                  <div className="chapter-header">
                    <div className="chapter-badge" style={{ color: ch.color, borderColor: `${ch.color}40`, background: `${ch.color}15` }}>
                      {getChapterIcon(ch.icon)}
                      <span>{ch.id}</span>
                    </div>
                    <span className="chapter-lesson-count">{ch.lesson_count} Lessons</span>
                  </div>

                  <h3 className="chapter-title">{ch.title}</h3>
                  <p className="chapter-desc">
                    Comprehensive study notes, interactive checklists, production T-SQL scripts, and edge-case drills.
                  </p>

                  <div className="chapter-actions">
                    <a
                      href={ch.readme_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="chapter-btn chapter-btn-obsidian"
                      title="Inspect Chapter Hub on GitHub"
                    >
                      <BookOpen size={14} />
                      <span>Chapter Hub</span>
                      <ExternalLink size={12} style={{ opacity: 0.6 }} />
                    </a>

                    <button
                      onClick={() => {
                        setChapterFilter(ch.id);
                        setActiveTab('lessons');
                      }}
                      className="chapter-btn chapter-btn-platform"
                      title="Explore lessons in this chapter"
                    >
                      <span>Explore Lessons</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
              href={`${REPO_METADATA.repoUrl}/blob/master/docs/curriculum/00%20-%20HOME/Course%20Dashboard.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              <CheckSquare size={16} />
              <span>Live Course Dashboard</span>
            </a>

            <a
              href={`${REPO_METADATA.repoUrl}/blob/master/docs/curriculum/00%20-%20HOME/Learning%20Roadmap.md`}
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

      {/* Slide-over Note Viewer Modal */}
      <NoteViewerModal 
        note={selectedNote}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedNote(null);
        }}
      />
    </section>
  );
}
