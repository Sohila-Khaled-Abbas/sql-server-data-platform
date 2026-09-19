import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDatabase } from '../context/DatabaseContext.jsx';
import { useProgress } from '../store/useProgressStore.js';
import { COURSE_VIDEOS, COURSE_METADATA } from '../data/videoCatalog.js';
import confetti from 'canvas-confetti';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Circle, 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  ExternalLink, 
  Database, 
  Code, 
  Sparkles, 
  Terminal, 
  Clock, 
  ListTree, 
  ChevronRight, 
  Bot,
  Copy,
  Check,
  Table,
  Layers,
  FileCode2,
  HelpCircle
} from 'lucide-react';

export default function InteractiveLearningStudio({ 
  currentLessonId, 
  onSelectLesson, 
  onOpenSyllabus, 
  onOpenChatbot 
}) {
  const { runSql, tables } = useDatabase();
  const { watchedVideos, toggleWatched, totalXp } = useProgress();

  // Active lesson index & item
  const activeIndex = COURSE_VIDEOS.findIndex(v => v.id === currentLessonId);
  const currentLesson = COURSE_VIDEOS[activeIndex >= 0 ? activeIndex : 0];
  const isCompleted = watchedVideos.includes(currentLesson.id);

  // SQL Editor State
  const [editorSql, setEditorSql] = useState(currentLesson.sampleSql || '');
  const [queryResults, setQueryResults] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState('results'); // 'results' | 'schema'
  const [copiedCode, setCopiedCode] = useState(false);
  const textareaRef = useRef(null);

  // Sync editor query when lesson changes
  useEffect(() => {
    if (currentLesson?.sampleSql) {
      setEditorSql(currentLesson.sampleSql);
      setQueryResults(null);
    }
  }, [currentLesson?.id]);

  // Execute SQL
  const handleExecute = useCallback((sqlToRun) => {
    const text = sqlToRun !== undefined ? sqlToRun : editorSql;
    if (!text.trim()) return;

    setIsExecuting(true);
    setTimeout(() => {
      const res = runSql(text);
      setQueryResults(res);
      setIsExecuting(false);
      setActiveRightTab('results');
    }, 15);
  }, [editorSql, runSql]);

  // Keyboard shortcut: Ctrl+Enter to execute
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey && e.key === 'Enter') || e.key === 'F5') {
        e.preventDefault();
        handleExecute();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleExecute]);

  // Toggle Completion with Confetti
  const handleToggleComplete = () => {
    const nextState = !isCompleted;
    toggleWatched(currentLesson.id);

    if (nextState) {
      // Trigger festive celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.8 },
          colors: ['#0284c7', '#38bdf8', '#10b981', '#f59e0b', '#8b5cf6']
        });
      } catch (e) {
        // Safe fallback
      }
    }
  };

  // Next & Previous Lesson
  const handlePrev = () => {
    if (activeIndex > 0) {
      onSelectLesson(COURSE_VIDEOS[activeIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (activeIndex < COURSE_VIDEOS.length - 1) {
      onSelectLesson(COURSE_VIDEOS[activeIndex + 1].id);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(editorSql);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleResetCode = () => {
    setEditorSql(currentLesson.sampleSql || '');
  };

  return (
    <div className="learning-studio-layout">
      {/* Studio Sub-Header */}
      <div className="studio-topbar">
        <div className="studio-topbar-left">
          <button 
            onClick={onOpenSyllabus} 
            className="syllabus-toggle-btn"
            title="Browse all 7 Chapters and 102 Lessons"
          >
            <ListTree size={16} className="text-cyan-400" />
            <span>Curriculum Syllabus</span>
            <span className="chapter-tag-pill">
              Ch. {currentLesson.chapter} ({activeIndex + 1}/{COURSE_VIDEOS.length})
            </span>
          </button>

          <div className="topbar-divider" />

          <div className="lesson-breadcrumb">
            <span className="lesson-code-badge">{currentLesson.videoCode}</span>
            <span className="lesson-breadcrumb-title">{currentLesson.title}</span>
          </div>
        </div>

        <div className="studio-topbar-right">
          <button
            onClick={handleToggleComplete}
            className={`complete-toggle-btn ${isCompleted ? 'completed' : ''}`}
            title={isCompleted ? "Lesson completed (+50 XP)" : "Mark lesson as completed"}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>Completed (+50 XP)</span>
              </>
            ) : (
              <>
                <Circle size={16} className="text-gray-400" />
                <span>Mark Completed</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenChatbot}
            className="ask-mentor-studio-btn"
            title="Ask AI Study Mentor about this lesson"
          >
            <Bot size={15} className="text-cyan-400" />
            <span>Ask Mentor</span>
          </button>
        </div>
      </div>

      {/* Main Split-Screen Workspace */}
      <div className="studio-split-container">
        {/* LEFT COLUMN: Pedagogical Theory & Concepts */}
        <section className="studio-theory-pane">
          <div className="theory-scroll-content">
            {/* Chapter Header */}
            <div className="theory-meta-header">
              <span className="theory-chapter-label">{currentLesson.chapterTitle}</span>
              <div className="theory-duration">
                <Clock size={13} />
                <span>{currentLesson.duration}</span>
                <span className="level-pill">{currentLesson.level}</span>
              </div>
            </div>

            <h1 className="theory-title">{currentLesson.title}</h1>

            <p className="theory-lead-desc">
              {currentLesson.description}
            </p>

            {/* Authentic Video Link Banner */}
            <div className="maharatech-video-banner">
              <div className="flex items-center gap-2">
                <span className="video-icon-indicator">▶</span>
                <div>
                  <div className="font-semibold text-xs text-white">Authentic Video Lecture</div>
                  <div className="text-xs text-gray-400">By Eng. Rami Mohamed Abonagi (ITI / MCIT)</div>
                </div>
              </div>
              <a 
                href={currentLesson.maharatechUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-xs btn-outline-cyan"
              >
                Watch on MaharaTech <ExternalLink size={12} />
              </a>
            </div>

            {/* Core Objectives */}
            <div className="theory-section-card">
              <h3 className="section-card-title">
                <Sparkles size={14} className="text-amber-400" />
                What You Will Master in This Lesson
              </h3>
              <ul className="objectives-list">
                {currentLesson.objectives.map((obj, i) => (
                  <li key={i} className="objective-item">
                    <span className="check-dot">✓</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills & Concepts */}
            <div className="theory-section-card">
              <h3 className="section-card-title">
                <Layers size={14} className="text-cyan-400" />
                Core Architectural Skills & Patterns
              </h3>
              <div className="skills-chip-wrap">
                {currentLesson.skillsConnected.map((skill, i) => (
                  <span key={i} className="skill-chip">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Official Microsoft Learn Reference */}
            {currentLesson.microsoftDocsUrl && (
              <div className="theory-section-card ms-learn-card">
                <div className="flex items-start gap-3">
                  <div className="ms-icon-bubble">
                    <BookOpen size={16} className="text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">
                      Official Microsoft Learn Manual
                    </div>
                    <a 
                      href={currentLesson.microsoftDocsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ms-doc-link-title"
                    >
                      {currentLesson.microsoftDocTitle} <ExternalLink size={12} className="inline ml-1" />
                    </a>
                    <p className="text-xs text-gray-400 mt-1">
                      Production engineering reference covering SQL Server 2022 internal mechanics, syntax parameters, and optimization guidelines.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Source Script in Workspace */}
            {currentLesson.repoPath && (
              <div className="theory-section-card repo-script-card">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 flex items-center gap-1.5">
                    <FileCode2 size={14} className="text-emerald-400" />
                    Solution Script in Project Repository:
                  </span>
                  <code className="text-xs text-emerald-400 font-mono">{currentLesson.repoPath}</code>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: Interactive Live SQL Studio */}
        <section className="studio-query-pane">
          {/* Query Editor Header */}
          <div className="editor-control-header">
            <div className="flex items-center gap-2">
              <div className="editor-tab active">
                <Terminal size={14} className="text-cyan-400" />
                <span>Interactive T-SQL Editor</span>
              </div>
              <span className="badge badge-subtle">Target DB: ITItest</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button 
                onClick={handleCopyCode} 
                className="editor-icon-btn" 
                title="Copy SQL code"
              >
                {copiedCode ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
              <button 
                onClick={handleResetCode} 
                className="editor-icon-btn" 
                title="Reset to original lesson query"
              >
                <RotateCcw size={14} />
              </button>
              <button 
                onClick={() => handleExecute()}
                className="run-query-action-btn"
                disabled={isExecuting}
                title="Execute SQL Query (Ctrl + Enter)"
              >
                <Play size={14} className="fill-current" />
                <span>{isExecuting ? 'Executing...' : 'Run Query'}</span>
                <kbd className="kbd-shortcut">Ctrl+↵</kbd>
              </button>
            </div>
          </div>

          {/* Code Textarea Editor */}
          <div className="editor-wrapper">
            <textarea
              ref={textareaRef}
              className="studio-code-input"
              value={editorSql}
              onChange={(e) => setEditorSql(e.target.value)}
              placeholder="Write your T-SQL query here or modify the lesson code..."
              spellCheck={false}
            />
          </div>

          {/* Results & Schema Tab Switcher */}
          <div className="results-tab-bar">
            <div className="flex items-center gap-1">
              <button
                className={`result-tab-btn ${activeRightTab === 'results' ? 'active' : ''}`}
                onClick={() => setActiveRightTab('results')}
              >
                <Table size={13} />
                <span>Execution Results</span>
                {queryResults?.values && (
                  <span className="results-badge">{queryResults.values.length} rows</span>
                )}
              </button>

              <button
                className={`result-tab-btn ${activeRightTab === 'schema' ? 'active' : ''}`}
                onClick={() => setActiveRightTab('schema')}
              >
                <Database size={13} />
                <span>Active Database Schema</span>
              </button>
            </div>

            {queryResults && (
              <div className="execution-stat-pill">
                <span>⏱️ {queryResults.executionTimeMs || '<1'} ms</span>
              </div>
            )}
          </div>

          {/* Results Display Area */}
          <div className="results-display-area">
            {activeRightTab === 'results' ? (
              queryResults ? (
                queryResults.error ? (
                  <div className="sql-error-box">
                    <div className="error-badge">SQL Execution Error</div>
                    <pre className="error-text">{queryResults.error}</pre>
                    <p className="text-xs text-gray-400 mt-2">
                      Need help? Click <strong>Ask Mentor</strong> above to explain this error and suggest a fix!
                    </p>
                  </div>
                ) : queryResults.columns && queryResults.columns.length > 0 ? (
                  <div className="table-responsive-container">
                    <table className="results-table">
                      <thead>
                        <tr>
                          {queryResults.columns.map((col, idx) => (
                            <th key={idx}>{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {queryResults.values.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.map((val, cIdx) => (
                              <td key={cIdx}>
                                {val === null ? <span className="null-val">NULL</span> : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="query-empty-state">
                    <CheckCircle2 size={24} className="text-emerald-400 mb-2" />
                    <div className="font-semibold text-sm text-white">Command(s) completed successfully.</div>
                    <div className="text-xs text-gray-400">{queryResults.rowsAffected ?? 0} row(s) affected.</div>
                  </div>
                )
              ) : (
                <div className="query-empty-state">
                  <Play size={28} className="text-gray-500 mb-2" />
                  <div className="font-semibold text-sm text-gray-300">Ready to execute query</div>
                  <div className="text-xs text-gray-400">
                    Click <strong>Run Query</strong> or press <kbd className="kbd-shortcut">Ctrl+Enter</kbd> to run against the in-memory engine.
                  </div>
                </div>
              )
            ) : (
              /* Schema Browser Tab */
              <div className="schema-browser-content">
                <div className="schema-db-header">
                  <Database size={15} className="text-emerald-400" />
                  <span className="font-bold text-sm text-white">Database: ITItest</span>
                  <span className="text-xs text-gray-400">Location: ...\CH01\Mydb\</span>
                </div>
                <div className="schema-table-grid">
                  <div className="schema-card">
                    <div className="schema-card-head">
                      <span className="table-name">dbo.emp</span>
                      <span className="badge badge-xs badge-cyan">fg1: file2.ndf</span>
                    </div>
                    <ul className="schema-col-list">
                      <li><span className="pk-badge">PK</span> <strong>eid</strong>: INT</li>
                      <li><strong>ename</strong>: NVARCHAR(50)</li>
                      <li><strong>salary</strong>: MONEY</li>
                      <li><strong>eadd</strong>: NVARCHAR(50) [DEFAULT 'cairo']</li>
                      <li><span className="fk-badge">FK</span> <strong>dnum</strong> &rarr; depts(did)</li>
                      <li><strong>overtime</strong>: MONEY</li>
                      <li><strong>hiredate</strong>: DATE</li>
                      <li><strong>age</strong>: AS YEAR(GETDATE()) - YEAR(bd)</li>
                      <li><strong>netsal</strong>: AS ISNULL(salary, 0) + ISNULL(overtime, 0)</li>
                    </ul>
                  </div>

                  <div className="schema-card">
                    <div className="schema-card-head">
                      <span className="table-name">dbo.depts</span>
                      <span className="badge badge-xs badge-cyan">fg1: file2.ndf</span>
                    </div>
                    <ul className="schema-col-list">
                      <li><span className="pk-badge">PK</span> <strong>did</strong>: INT</li>
                      <li><strong>dname</strong>: NVARCHAR(50)</li>
                    </ul>
                  </div>

                  <div className="schema-card">
                    <div className="schema-card-head">
                      <span className="table-name">OmniFlowDB Core</span>
                      <span className="badge badge-xs badge-purple">Enterprise 3NF</span>
                    </div>
                    <ul className="schema-col-list">
                      <li><strong>Employee</strong> (SSN, FName, LName, Dno)</li>
                      <li><strong>Department</strong> (DNum, DName, MgrSSN)</li>
                      <li><strong>Project</strong> (PNum, PName, DNum)</li>
                      <li><strong>WorksOn</strong> (ESSN, PNo, Hours)</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Studio Bottom Bar: Step-by-Step Navigation Flow */}
      <div className="studio-bottombar">
        <button
          onClick={handlePrev}
          disabled={activeIndex === 0}
          className="nav-lesson-btn"
          title="Previous Lesson"
        >
          <ArrowLeft size={16} />
          <span>Previous: {activeIndex > 0 ? COURSE_VIDEOS[activeIndex - 1].videoCode : 'Start'}</span>
        </button>

        <div className="bottombar-center-meta">
          <span className="progress-fraction-label">
            Lesson {activeIndex + 1} of {COURSE_VIDEOS.length}
          </span>
          <div className="bottombar-progress-track">
            <div 
              className="bottombar-progress-fill" 
              style={{ width: `${((activeIndex + 1) / COURSE_VIDEOS.length) * 100}%` }}
            />
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={activeIndex === COURSE_VIDEOS.length - 1}
          className="nav-lesson-btn next-btn"
          title="Next Lesson"
        >
          <span>Next: {activeIndex < COURSE_VIDEOS.length - 1 ? COURSE_VIDEOS[activeIndex + 1].videoCode : 'End'}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
