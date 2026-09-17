import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext.jsx';
import { useProgress } from '../context/ProgressContext.jsx';
import { CHALLENGES } from '../data/challenges.js';
import { 
  Trophy, 
  CheckCircle2, 
  Circle, 
  Play, 
  Lightbulb, 
  BookOpen, 
  RotateCcw, 
  AlertCircle, 
  Sparkles 
} from 'lucide-react';

export default function ChallengeArena() {
  const { runSql } = useDatabase();
  const { completedChallenges, markChallengeComplete } = useProgress();
  const [activeChallengeId, setActiveChallengeId] = useState(CHALLENGES[0].id);
  const [editorSql, setEditorSql] = useState(CHALLENGES[0].starterSql);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [testStatus, setTestStatus] = useState(null); // { pass: boolean, error?: string }
  const [testResult, setTestResult] = useState(null);

  const activeChallenge = CHALLENGES.find(c => c.id === activeChallengeId) || CHALLENGES[0];

  const handleSelectChallenge = (ch) => {
    setActiveChallengeId(ch.id);
    setEditorSql(ch.starterSql);
    setShowHint(false);
    setShowSolution(false);
    setTestStatus(null);
    setTestResult(null);
  };

  const handleRunTest = (isSubmit = false) => {
    setTestStatus({ running: true });
    setTimeout(() => {
      const res = runSql(editorSql);
      setTestResult(res);

      if (res.error) {
        setTestStatus({ pass: false, error: res.error });
        return;
      }

      const verification = activeChallenge.verify(res);
      if (verification.pass) {
        setTestStatus({ pass: true });
        if (isSubmit) {
          markChallengeComplete(activeChallenge.id, activeChallenge.xp);
        }
      } else {
        setTestStatus({ pass: false, error: verification.error });
      }
    }, 20);
  };

  return (
    <div className="challenge-arena-container">
      {/* Header */}
      <div className="arena-header card">
        <div>
          <h1 className="arena-title">SQL Challenge Arena & Problem Solver</h1>
          <p className="arena-desc">
            LeetCode-style database engineering challenges with automated assertions verified in real-time by the in-browser WASM database engine.
          </p>
        </div>
        <div className="arena-score-badge">
          <Trophy size={18} className="text-amber" />
          <span>{completedChallenges.length} / {CHALLENGES.length} Solved</span>
        </div>
      </div>

      <div className="challenge-arena-layout">
        {/* Left Sidebar: Problem List */}
        <div className="challenge-sidebar-pane card">
          <div className="pane-header">
            <h3>Problem Sets</h3>
            <span className="badge badge-cyan">{CHALLENGES.length} Problems</span>
          </div>

          <div className="challenge-list">
            {CHALLENGES.map((ch, idx) => {
              const isSolved = completedChallenges.includes(ch.id);
              const isSelected = ch.id === activeChallengeId;
              return (
                <div 
                  key={ch.id}
                  className={`challenge-item ${isSelected ? 'active' : ''} ${isSolved ? 'solved' : ''}`}
                  onClick={() => handleSelectChallenge(ch)}
                >
                  <div className="item-status">
                    {isSolved ? <CheckCircle2 size={16} className="text-emerald" /> : <Circle size={16} />}
                  </div>
                  <div className="item-details">
                    <div className="item-title">{idx + 1}. {ch.title}</div>
                    <div className="item-tags">
                      <span className={`badge badge-sm ${
                        ch.difficulty === 'Easy' ? 'badge-green' : ch.difficulty === 'Medium' ? 'badge-amber' : 'badge-mssql-red'
                      }`}>
                        {ch.difficulty}
                      </span>
                      <span className="xp-tag">+{ch.xp} XP</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Area: Problem Statement & Code Editor */}
        <div className="challenge-workspace-pane">
          {/* Problem Details Card */}
          <div className="challenge-detail-card card">
            <div className="challenge-detail-header">
              <div>
                <h2 className="challenge-active-title">{activeChallenge.title}</h2>
                <div className="challenge-badges-row">
                  <span className={`badge ${
                    activeChallenge.difficulty === 'Easy' ? 'badge-green' : activeChallenge.difficulty === 'Medium' ? 'badge-amber' : 'badge-mssql-red'
                  }`}>
                    {activeChallenge.difficulty}
                  </span>
                  <span className="badge badge-purple">{activeChallenge.topic}</span>
                  <span className="badge badge-cyan">+{activeChallenge.xp} XP</span>
                </div>
              </div>

              <div className="challenge-actions-row">
                <button 
                  className="btn btn-sm btn-ghost" 
                  onClick={() => setShowHint(!showHint)}
                >
                  <Lightbulb size={14} />
                  <span>Hint</span>
                </button>
                <button 
                  className="btn btn-sm btn-ghost" 
                  onClick={() => setShowSolution(!showSolution)}
                >
                  <BookOpen size={14} />
                  <span>Reference Solution</span>
                </button>
                <button 
                  className="btn btn-sm btn-ghost" 
                  onClick={() => setEditorSql(activeChallenge.starterSql)}
                >
                  <RotateCcw size={14} />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <div 
              className="challenge-active-desc" 
              dangerouslySetInnerHTML={{ __html: activeChallenge.description }} 
            />

            {showHint && (
              <div className="challenge-hint-box">
                <Lightbulb size={16} className="hint-icon" />
                <p>{activeChallenge.hint}</p>
              </div>
            )}

            {showSolution && (
              <div className="challenge-solution-box">
                <div className="sol-header">
                  <span>Reference T-SQL Solution</span>
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => setEditorSql(activeChallenge.solution)}
                  >
                    Load into Editor
                  </button>
                </div>
                <pre><code>{activeChallenge.solution}</code></pre>
              </div>
            )}
          </div>

          {/* Editor & Runner Card */}
          <div className="challenge-editor-card card">
            <div className="console-toolbar">
              <div className="console-label">
                <span className="pulse-dot"></span>
                <span>T-SQL Query Solution</span>
              </div>

              <div className="console-actions">
                <button 
                  className="btn btn-sm btn-secondary"
                  onClick={() => handleRunTest(false)}
                >
                  <Play size={14} />
                  <span>Run Test 🧪</span>
                </button>
                <button 
                  className="btn btn-sm btn-mssql-red"
                  onClick={() => handleRunTest(true)}
                >
                  <Sparkles size={14} />
                  <span>Submit Solution 🚀</span>
                </button>
              </div>
            </div>

            <textarea
              className="challenge-textarea"
              rows={8}
              spellCheck="false"
              value={editorSql}
              onChange={(e) => setEditorSql(e.target.value)}
            />

            {/* Test Status Banner */}
            {testStatus && (
              <div className={`test-status-banner ${testStatus.pass ? 'test-pass' : 'test-fail'}`}>
                {testStatus.pass ? (
                  <>
                    <CheckCircle2 size={18} />
                    <span>Test Passed! Congratulations, your query satisfies all constraints. (+{activeChallenge.xp} XP)</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={18} />
                    <span>Assertion Failed: {testStatus.error}</span>
                  </>
                )}
              </div>
            )}

            {/* Execution Output Grid */}
            {testResult && testResult.columns && (
              <div className="challenge-output-pane">
                <div className="output-header">
                  <span>Execution Output ({testResult.rowCount} rows in {testResult.executionTimeMs} ms)</span>
                </div>
                <div className="output-table-scroll">
                  <table className="query-result-table">
                    <thead>
                      <tr>
                        {testResult.columns.map(c => <th key={c}>{c}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {testResult.values.slice(0, 10).map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((val, cIdx) => (
                            <td key={cIdx}>{val === null ? 'NULL' : String(val)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
