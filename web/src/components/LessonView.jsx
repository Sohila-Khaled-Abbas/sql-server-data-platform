import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDatabase } from '../context/DatabaseContext.jsx';
import { useProgress } from '../context/ProgressContext.jsx';
import { COURSE_VIDEOS, COURSE_METADATA } from '../data/videoCatalog.js';
import confetti from 'canvas-confetti';
import {
  Play,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Clock,
  CheckCircle2,
  Circle,
  Copy,
  Check,
} from 'lucide-react';

export default function LessonView({ currentLessonId, onSelectLesson }) {
  const { runSql } = useDatabase();
  const { watchedVideos, toggleWatched } = useProgress();

  const activeIndex = COURSE_VIDEOS.findIndex(v => v.id === currentLessonId);
  const lesson = COURSE_VIDEOS[activeIndex >= 0 ? activeIndex : 0];
  const isCompleted = watchedVideos.includes(lesson.id);
  const prevLesson = activeIndex > 0 ? COURSE_VIDEOS[activeIndex - 1] : null;
  const nextLesson = activeIndex < COURSE_VIDEOS.length - 1 ? COURSE_VIDEOS[activeIndex + 1] : null;

  const [editorSql, setEditorSql] = useState(lesson.sampleSql || '');
  const [queryResults, setQueryResults] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);

  // Sync when lesson changes
  useEffect(() => {
    if (lesson?.sampleSql) {
      setEditorSql(lesson.sampleSql);
      setQueryResults(null);
    }
  }, [lesson?.id]);

  const handleExecute = useCallback(() => {
    if (!editorSql.trim()) return;
    setIsExecuting(true);
    setTimeout(() => {
      const res = runSql(editorSql);
      setQueryResults(res);
      setIsExecuting(false);
    }, 15);
  }, [editorSql, runSql]);

  // Ctrl+Enter
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey && e.key === 'Enter') || e.key === 'F5') {
        e.preventDefault();
        handleExecute();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleExecute]);

  const handleCopy = () => {
    navigator.clipboard.writeText(editorSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleToggleComplete = () => {
    const wasCompleted = watchedVideos.includes(lesson.id);
    toggleWatched(lesson.id);
    if (!wasCompleted) {
      confetti({ particleCount: 60, spread: 55, origin: { y: 0.7 }, colors: ['#818cf8', '#34d399', '#fbbf24'] });
    }
  };

  // Tab support in textarea
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newValue = editorSql.substring(0, start) + '  ' + editorSql.substring(end);
      setEditorSql(newValue);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };

  // Chapter name from lesson
  const chapterName = lesson.chapterTitle?.replace(/^Chapter \d+:\s*/, '') || 'Course';

  return (
    <div className="main-content">
      {/* Breadcrumb */}
      <div className="lesson-breadcrumb">
        <span className="lesson-breadcrumb-link" onClick={() => {}}>
          Ch. {lesson.chapter}
        </span>
        <span className="lesson-breadcrumb-sep">›</span>
        <span className="lesson-breadcrumb-current">{lesson.videoCode}</span>
      </div>

      {/* Header */}
      <div className="lesson-header">
        <div className="lesson-number">
          Lesson {activeIndex + 1} of {COURSE_VIDEOS.length}
        </div>
        <h1 className="lesson-title">{lesson.title}</h1>
        <div className="lesson-meta">
          <span className="lesson-meta-item">
            <Clock size={13} />
            {lesson.duration}
          </span>
          <span className="lesson-meta-item">
            {lesson.level}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="lesson-body">
        <p>{lesson.description}</p>
      </div>

      {/* Objectives */}
      {lesson.objectives?.length > 0 && (
        <div className="lesson-objectives">
          <div className="lesson-objectives-title">What you will learn</div>
          <ul>
            {lesson.objectives.map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Links */}
      <div className="lesson-links">
        {lesson.maharatechUrl && (
          <a
            href={lesson.maharatechUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="lesson-link"
          >
            <ExternalLink size={14} />
            Watch on MaharaTech
          </a>
        )}
        {lesson.microsoftDocsUrl && (
          <a
            href={lesson.microsoftDocsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="lesson-link"
          >
            <ExternalLink size={14} />
            {lesson.microsoftDocTitle || 'Microsoft Docs'}
          </a>
        )}
      </div>

      {/* SQL Editor */}
      <div className="sql-editor-section">
        <div className="sql-editor-label">
          Try it yourself
        </div>
        <div className="sql-editor-container">
          <textarea
            ref={textareaRef}
            className="sql-editor-textarea"
            value={editorSql}
            onChange={(e) => setEditorSql(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="-- Write your T-SQL here..."
            spellCheck={false}
          />
          <div className="sql-editor-toolbar">
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                className="sql-run-btn"
                onClick={handleExecute}
                disabled={isExecuting || !editorSql.trim()}
              >
                <Play size={14} />
                {isExecuting ? 'Running...' : 'Run'}
              </button>
              <button
                className="header-icon-btn"
                onClick={handleCopy}
                title="Copy SQL"
                style={{ width: 32, height: 32 }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
            <div className="sql-shortcut-hint">
              <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to run
            </div>
          </div>
        </div>

        {/* Results */}
        {queryResults && (
          <div className="sql-results">
            <div className="sql-results-header">
              <span className="sql-results-title">
                {queryResults.error ? 'Error' : 'Results'}
              </span>
              {queryResults.rows && (
                <span className="sql-results-count">
                  {queryResults.rows.length} row{queryResults.rows.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {queryResults.error ? (
              <div className="sql-results-error">{queryResults.error}</div>
            ) : queryResults.rows?.length > 0 ? (
              <div className="sql-results-table-wrap">
                <table>
                  <thead>
                    <tr>
                      {queryResults.columns.map((col, i) => (
                        <th key={i}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResults.rows.map((row, ri) => (
                      <tr key={ri}>
                        {queryResults.columns.map((col, ci) => (
                          <td key={ci}>{row[col] ?? 'NULL'}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="sql-results-success">
                <CheckCircle2 size={15} />
                Query executed successfully. No rows returned.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="lesson-nav-bottom">
        {prevLesson ? (
          <button
            className="lesson-nav-btn"
            onClick={() => onSelectLesson(prevLesson.id)}
          >
            <ArrowLeft size={14} />
            {prevLesson.title}
          </button>
        ) : <div />}

        <button
          className={`lesson-complete-btn ${isCompleted ? 'done' : 'not-done'}`}
          onClick={handleToggleComplete}
        >
          {isCompleted ? <CheckCircle2 size={15} /> : <Circle size={15} />}
          {isCompleted ? 'Completed' : 'Mark complete'}
        </button>

        {nextLesson ? (
          <button
            className="lesson-nav-btn"
            onClick={() => onSelectLesson(nextLesson.id)}
          >
            {nextLesson.title}
            <ArrowRight size={14} />
          </button>
        ) : <div />}
      </div>
    </div>
  );
}
