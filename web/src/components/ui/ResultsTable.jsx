/**
 * ResultsTable — Reusable SQL query results display.
 * 
 * Handles three states:
 *   1. Error   → Red error box with message
 *   2. Data    → Scrollable table with column headers and rows
 *   3. Empty   → Success message with zero rows
 * 
 * Used by: LessonView, PracticeStudio, InteractiveLearningStudio, ChallengeArena, QueryStudio
 *
 * @param {object}  results          - Query result object from DatabaseContext.runSql()
 * @param {string}  [results.error]  - Error message (if query failed)
 * @param {Array}   [results.columns] - Column name strings
 * @param {Array}   [results.rows]   - Array of row objects (keyed by column name)
 * @param {Array}   [results.values] - Array of row arrays (positional values)
 * @param {number}  [results.rowsAffected] - Rows affected for DML statements
 * @param {string}  [emptyMessage]   - Custom message for zero-row results
 * @param {string}  [className]      - Additional CSS class
 */
import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ResultsTable({
  results,
  emptyMessage = 'Query executed successfully. No rows returned.',
  className = '',
}) {
  if (!results) return null;

  /* ── Error State ───────────────────────────────────────────────────── */
  if (results.error) {
    return (
      <div className={`results-table-component error-state ${className}`}>
        <div className="results-table-header">
          <AlertTriangle size={14} className="results-error-icon" />
          <span className="results-table-title">Error</span>
        </div>
        <div className="results-table-error">{results.error}</div>
      </div>
    );
  }

  /* ── Determine data shape: rows (object array) vs values (2D array) ─ */
  const columns = results.columns || [];
  const hasObjectRows = results.rows && results.rows.length > 0;
  const hasValueRows = results.values && results.values.length > 0;
  const rowCount = hasObjectRows
    ? results.rows.length
    : hasValueRows
      ? results.values.length
      : 0;

  /* ── Empty / Success State ─────────────────────────────────────────── */
  if (rowCount === 0) {
    return (
      <div className={`results-table-component empty-state ${className}`}>
        <div className="results-table-header">
          <CheckCircle2 size={14} className="results-success-icon" />
          <span className="results-table-title">Success</span>
          {results.rowsAffected != null && (
            <span className="results-table-count">
              {results.rowsAffected} row(s) affected
            </span>
          )}
        </div>
        <div className="results-table-empty">{emptyMessage}</div>
      </div>
    );
  }

  /* ── Data Table State ──────────────────────────────────────────────── */
  return (
    <div className={`results-table-component data-state ${className}`}>
      <div className="results-table-header">
        <span className="results-table-title">Results</span>
        <span className="results-table-count">
          {rowCount} row{rowCount !== 1 ? 's' : ''}
        </span>
        {results.executionTimeMs != null && (
          <span className="results-table-time">
            ⏱️ {results.executionTimeMs || '<1'} ms
          </span>
        )}
      </div>
      <div className="results-table-scroll">
        <table className="results-table">
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={i}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hasObjectRows
              ? results.rows.map((row, ri) => (
                  <tr key={ri}>
                    {columns.map((col, ci) => (
                      <td key={ci}>
                        {row[col] === null || row[col] === undefined ? (
                          <span className="null-val">NULL</span>
                        ) : (
                          String(row[col])
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              : results.values.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((val, ci) => (
                      <td key={ci}>
                        {val === null || val === undefined ? (
                          <span className="null-val">NULL</span>
                        ) : (
                          String(val)
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
