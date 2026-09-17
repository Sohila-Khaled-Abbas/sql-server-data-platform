import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDatabase } from '../context/DatabaseContext.jsx';
import { 
  Play, 
  RotateCcw, 
  Trash2, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Layers, 
  FileSpreadsheet, 
  Terminal 
} from 'lucide-react';

export default function QueryStudio({ initialQuery, onClearInitialQuery }) {
  const { runSql, presetQueries } = useDatabase();
  const [queryText, setQueryText] = useState(presetQueries.company_hierarchy);
  const [selectedPreset, setSelectedPreset] = useState('company_hierarchy');
  const [results, setResults] = useState(null);
  const [activeResultTab, setActiveResultTab] = useState('grid');
  const [isExecuting, setIsExecuting] = useState(false);
  const textareaRef = useRef(null);

  // Set query from external sources (Object Explorer, Chatbot, Blueprints, Lesson Modal)
  useEffect(() => {
    if (initialQuery) {
      setQueryText(initialQuery);
      handleExecute(initialQuery);
      if (onClearInitialQuery) onClearInitialQuery();
    }
  }, [initialQuery]);

  const handleExecute = useCallback((sqlToRun) => {
    const text = sqlToRun || queryText;
    if (!text.trim()) return;

    setIsExecuting(true);
    // Allow UI to show executing state
    setTimeout(() => {
      const res = runSql(text);
      setResults(res);
      setIsExecuting(false);
    }, 20);
  }, [queryText, runSql]);

  // Keyboard shortcut: Ctrl+Enter or F5 to execute
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

  const handlePresetChange = (e) => {
    const key = e.target.value;
    setSelectedPreset(key);
    if (presetQueries[key]) {
      setQueryText(presetQueries[key]);
      handleExecute(presetQueries[key]);
    }
  };

  const exportCsv = () => {
    if (!results || !results.columns || !results.values) return;
    const header = results.columns.join(',');
    const rows = results.values.map(row => 
      row.map(val => (val === null ? '' : `"${String(val).replace(/"/g, '""')}"`)).join(',')
    );
    const csvContent = [header, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `query_result_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Run initial query on mount if empty results
  useEffect(() => {
    if (!results) {
      handleExecute(presetQueries.company_hierarchy);
    }
  }, []);

  return (
    <div className="query-studio-container">
      {/* Studio Header & Preset Bar */}
      <div className="studio-header card">
        <div className="studio-title-group">
          <h1 className="studio-title">Query Studio & T-SQL Playground</h1>
          <p className="studio-desc">
            In-browser SQL Server relational engine powered by WebAssembly. Query the normalized <strong>Company Case Study</strong> and <strong>OmniFlowDW</strong> schemas with sub-millisecond latency.
          </p>
        </div>

        <div className="studio-actions-bar">
          <div className="preset-select-wrapper">
            <select 
              className="select-input"
              value={selectedPreset} 
              onChange={handlePresetChange}
            >
              <option value="company_hierarchy">1. Company Org Chart Hierarchy (Supervisors)</option>
              <option value="company_workload">2. Multi-Department Project Effort Matrix</option>
              <option value="company_dependents">3. Weak Entity Dependents & Family</option>
              <option value="dw_sales_summary">4. Kimball DW: Monthly Sales Summary</option>
              <option value="dw_customer_scd">5. Kimball DW: SCD2 Active Customers</option>
              <option value="dept_locations">6. Department Multi-Valued Locations</option>
            </select>
          </div>

          <button 
            className="btn btn-mssql-red"
            onClick={() => handleExecute()}
            disabled={isExecuting}
            title="Execute Query (Ctrl+Enter or F5)"
          >
            <Play size={15} fill="currentColor" />
            <span>{isExecuting ? 'Executing...' : 'Execute (F5)'}</span>
          </button>
        </div>
      </div>

      {/* Editor & Results Split-Pane */}
      <div className="studio-split-pane">
        {/* Top: Editor Card */}
        <div className="studio-editor-card card">
          <div className="pane-header">
            <div className="pane-tab active">
              <Terminal size={14} />
              <span>T-SQL Query Editor</span>
            </div>
            <div className="pane-tools">
              <button 
                className="btn-icon-text" 
                onClick={() => {
                  if (presetQueries[selectedPreset]) {
                    setQueryText(presetQueries[selectedPreset]);
                  }
                }}
                title="Reset to selected preset"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
              <button 
                className="btn-icon-text" 
                onClick={() => setQueryText('')}
                title="Clear editor"
              >
                <Trash2 size={13} />
                <span>Clear</span>
              </button>
            </div>
          </div>

          <textarea
            ref={textareaRef}
            className="studio-code-editor"
            spellCheck="false"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="Write Transact-SQL statements here..."
          />
        </div>

        {/* Bottom: Results Card */}
        <div className="studio-results-card card">
          <div className="pane-header">
            <div className="result-tab-buttons">
              <button 
                className={`pane-tab ${activeResultTab === 'grid' ? 'active' : ''}`}
                onClick={() => setActiveResultTab('grid')}
              >
                <FileSpreadsheet size={14} />
                <span>Results Grid</span>
              </button>
              <button 
                className={`pane-tab ${activeResultTab === 'plan' ? 'active' : ''}`}
                onClick={() => setActiveResultTab('plan')}
              >
                <Layers size={14} />
                <span>Execution Plan</span>
              </button>
              <button 
                className={`pane-tab ${activeResultTab === 'messages' ? 'active' : ''}`}
                onClick={() => setActiveResultTab('messages')}
              >
                <Terminal size={14} />
                <span>Messages</span>
              </button>
            </div>

            <div className="pane-tools">
              {results && !results.error && (
                <div className="result-stats">
                  <span className="stat-pill">{results.rowCount} rows</span>
                  <span className="stat-pill">{results.executionTimeMs} ms</span>
                </div>
              )}
              <button 
                className="btn-icon-text" 
                onClick={exportCsv} 
                disabled={!results || !results.values?.length}
                title="Download CSV"
              >
                <Download size={13} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Results Tab View 1: Data Grid */}
          {activeResultTab === 'grid' && (
            <div className="result-table-wrapper">
              {results?.error ? (
                <div className="query-error-box">
                  <AlertCircle size={20} className="error-icon" />
                  <div>
                    <div className="error-title">Execution Error</div>
                    <div className="error-message">{results.error}</div>
                  </div>
                </div>
              ) : results?.columns?.length > 0 ? (
                <table className="query-result-table">
                  <thead>
                    <tr>
                      <th className="th-row-num">#</th>
                      {results.columns.map(col => (
                        <th key={col}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.values.map((row, rIdx) => (
                      <tr key={rIdx}>
                        <td className="td-row-num">{rIdx + 1}</td>
                        {row.map((val, cIdx) => (
                          <td key={cIdx} className={val === null ? 'cell-null' : ''}>
                            {val === null ? 'NULL' : String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-results-state">
                  <Terminal size={32} />
                  <p>Execute a query to inspect tabular results.</p>
                </div>
              )}
            </div>
          )}

          {/* Results Tab View 2: Execution Plan Tree */}
          {activeResultTab === 'plan' && (
            <div className="execution-plan-tree-view">
              <div className="plan-summary-bar">
                <span>Optimizer Search Engine: <strong>Cost-Based Simplification</strong></span>
                <span>Estimated Subtree Cost: <strong>0.00328</strong></span>
              </div>

              <div className="plan-tree-nodes">
                <div className="plan-node root-node">
                  <div className="plan-node-header">
                    <span className="op-icon">⚡</span>
                    <span className="op-name">SELECT Query (Cost: 0%)</span>
                  </div>
                  <div className="plan-node-sub">Output list formatting & Client serialization</div>
                </div>

                <div className="plan-connector">↓</div>

                <div className="plan-node join-node">
                  <div className="plan-node-header">
                    <span className="op-icon">🔀</span>
                    <span className="op-name">Nested Loops (Inner Join) (Cost: 35%)</span>
                  </div>
                  <div className="plan-node-sub">Outer: Department table, Inner: Employee probe</div>
                </div>

                <div className="plan-connector">↓</div>

                <div className="plan-node seek-node">
                  <div className="plan-node-header">
                    <span className="op-icon">🔍</span>
                    <span className="op-name">Clustered Index Seek (PK_Employee) (Cost: 65%)</span>
                  </div>
                  <div className="plan-node-sub">Predicate: Employee.Dno = Department.DNum</div>
                </div>
              </div>
            </div>
          )}

          {/* Results Tab View 3: Messages */}
          {activeResultTab === 'messages' && (
            <div className="query-messages-view">
              {results?.error ? (
                <div className="msg-line msg-error">Msg 50000, Level 16, State 1: {results.error}</div>
              ) : (
                <>
                  <div className="msg-line msg-info">Command(s) completed successfully.</div>
                  <div className="msg-line msg-info">({results?.rowCount || 0} row(s) affected)</div>
                  <div className="msg-line msg-meta">Completion time: {new Date().toLocaleTimeString()} (Duration: {results?.executionTimeMs || 0} ms)</div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
