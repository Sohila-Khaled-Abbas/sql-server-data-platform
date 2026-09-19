import React, { useState, useEffect, useCallback } from 'react';
import { useDatabase } from '../context/DatabaseContext.jsx';
import { useProgressStore } from '../store/useProgressStore.js';
import { COURSE_VIDEOS, COURSE_METADATA } from '../data/videoCatalog.js';
import confetti from 'canvas-confetti';
import CodeEditor from './ui/CodeEditor.jsx';
import ResultsTable from './ui/ResultsTable.jsx';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Clock,
  CheckCircle2,
  Circle,
} from 'lucide-react';

export default function LessonView({ currentLessonId, onSelectLesson }) {
  const { runSql } = useDatabase();
  const { completedLessons, toggleLesson } = useProgressStore();

  const activeIndex = COURSE_VIDEOS.findIndex(v => v.id === currentLessonId);
  const lesson = COURSE_VIDEOS[activeIndex >= 0 ? activeIndex : 0];
  const isCompleted = completedLessons.includes(lesson.id);
  const prevLesson = activeIndex > 0 ? COURSE_VIDEOS[activeIndex - 1] : null;
  const nextLesson = activeIndex < COURSE_VIDEOS.length - 1 ? COURSE_VIDEOS[activeIndex + 1] : null;

  const [editorSql, setEditorSql] = useState(lesson.sampleSql || '');
  const [queryResults, setQueryResults] = useState(null);

  // Sync when lesson changes
  useEffect(() => {
    if (lesson?.sampleSql) {
      setEditorSql(lesson.sampleSql);
      setQueryResults(null);
    }
  }, [lesson?.id]);

  const handleExecute = useCallback((codeToRun) => {
    const sql = codeToRun ?? editorSql;
    if (!sql || !sql.trim()) {
      toast.error('Please enter a query to execute');
      return;
    }
    setTimeout(() => {
      const res = runSql(sql);
      setQueryResults(res);
      if (res?.error) {
        toast.error('Query execution error');
      } else {
        toast.success(`Executed in ${res?.executionTimeMs || '<1'}ms`);
      }
    }, 15);
  }, [editorSql, runSql]);

  const handleReset = useCallback(() => {
    setEditorSql(lesson.sampleSql || '');
    setQueryResults(null);
  }, [lesson.sampleSql]);

  const handleClear = useCallback(() => {
    setEditorSql('');
    setQueryResults(null);
  }, []);

  const handleToggleComplete = () => {
    const wasCompleted = completedLessons.includes(lesson.id);
    toggleLesson(lesson.id, !wasCompleted);
    if (!wasCompleted) {
      confetti({ particleCount: 60, spread: 55, origin: { y: 0.7 }, colors: ['#818cf8', '#34d399', '#fbbf24'] });
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

      {/* SQL Editor Section */}
      <div className="sql-editor-section" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="sql-editor-label">
          Try it yourself
        </div>
        <CodeEditor
          value={editorSql}
          onChange={setEditorSql}
          onExecute={handleExecute}
          onReset={handleReset}
          onClear={handleClear}
          placeholder="-- Write your T-SQL here..."
          minHeight="180px"
        />

        {/* Results */}
        {queryResults && (
          <ResultsTable
            results={queryResults}
            emptyMessage="Query executed successfully. No rows returned."
          />
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

      {/* Global Resources Embed */}
      <div className="card" style={{ marginTop: '2rem', padding: '1.5rem', borderLeft: '4px solid var(--mssql-red)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--text-primary)' }}>Curated Learning Resources</h3>
        <p style={{ color: 'var(--text-dim)', marginBottom: '1rem', fontSize: '14px' }}>
          Explore these highly recommended resources to deepen your understanding of T-SQL and SQL Server.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Recommended Reading</h4>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-secondary)', fontSize: '13px' }}>
              <li><strong>T-SQL Fundamentals</strong> (Itzik Ben-Gan)</li>
              <li><strong>T-SQL Querying</strong> (Itzik Ben-Gan)</li>
            </ul>
          </div>
          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Official MS Learn</h4>
            <a href="https://learn.microsoft.com/training/paths/design-implement-database-objects/" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'none', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
              Design and Implement DB Objects ↗
            </a>
            <a href="https://learn.microsoft.com/sql/sql-server/tutorials/sql-server-tutorials" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'none', fontSize: '13px', display: 'block' }}>
              SQL Server Tutorials ↗
            </a>
          </div>
          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Practice</h4>
            <a href="https://www.sqlservertutorial.net/" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'none', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
              SQLServerTutorial.net ↗
            </a>
            <a href="https://maharatech.gov.eg/" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'none', fontSize: '13px', display: 'block' }}>
              MaharaTech Official Platform ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
