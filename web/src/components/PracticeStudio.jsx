import React, { useState, useCallback } from 'react';
import { useDatabase } from '../context/DatabaseContext.jsx';
import {
  Play,
  CheckCircle2,
  Trash2,
  Copy,
  Check,
} from 'lucide-react';

const DEFAULT_SQL = `-- Write any T-SQL query here
-- This runs against the in-memory WASM engine

SELECT 'Hello, SQL Server!' AS greeting,
       CURRENT_TIMESTAMP AS executed_at;`;

export default function PracticeStudio({ initialQuery }) {
  const { runSql } = useDatabase();
  const [sql, setSql] = useState(initialQuery || DEFAULT_SQL);
  const [results, setResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRun = useCallback(() => {
    if (!sql.trim()) return;
    setIsRunning(true);
    setTimeout(() => {
      const res = runSql(sql);
      setResults(res);
      setIsRunning(false);
    }, 15);
  }, [sql, runSql]);

  const handleClear = () => {
    setSql('');
    setResults(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey && e.key === 'Enter') || e.key === 'F5') {
      e.preventDefault();
      handleRun();
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      setSql(sql.substring(0, start) + '  ' + sql.substring(end));
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="main-content" style={{ maxWidth: 900 }}>
      <div className="studio-header">
        <h1 className="studio-title">Practice Studio</h1>
        <p className="studio-subtitle">
          Write and execute T-SQL queries against the in-memory WASM engine.
        </p>
      </div>

      <div className="sql-editor-section">
        <div className="sql-editor-container">
          <textarea
            className="sql-editor-textarea"
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="-- Write your T-SQL query here..."
            spellCheck={false}
            style={{ minHeight: 220 }}
          />
          <div className="sql-editor-toolbar">
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                className="sql-run-btn"
                onClick={handleRun}
                disabled={isRunning || !sql.trim()}
              >
                <Play size={14} />
                {isRunning ? 'Running...' : 'Run'}
              </button>
              <button className="header-icon-btn" onClick={handleCopy} title="Copy">
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
              <button className="header-icon-btn" onClick={handleClear} title="Clear">
                <Trash2 size={14} />
              </button>
            </div>
            <div className="sql-shortcut-hint">
              <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to run
            </div>
          </div>
        </div>

        {results && (
          <div className="sql-results">
            <div className="sql-results-header">
              <span className="sql-results-title">
                {results.error ? 'Error' : 'Results'}
              </span>
              {results.rows && (
                <span className="sql-results-count">
                  {results.rows.length} row{results.rows.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {results.error ? (
              <div className="sql-results-error">{results.error}</div>
            ) : results.rows?.length > 0 ? (
              <div className="sql-results-table-wrap">
                <table>
                  <thead>
                    <tr>
                      {results.columns.map((col, i) => (
                        <th key={i}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.rows.map((row, ri) => (
                      <tr key={ri}>
                        {results.columns.map((col, ci) => (
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
    </div>
  );
}
