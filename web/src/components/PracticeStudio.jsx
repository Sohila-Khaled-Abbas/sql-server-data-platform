import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import CodeEditor from './ui/CodeEditor.jsx';
import ResultsTable from './ui/ResultsTable.jsx';
import { useDatabase } from '../context/DatabaseContext.jsx';
import { Terminal, Database, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const DEFAULT_SQL = `-- Write any T-SQL / SQL query here
-- Executes against SQL Server (if backend connected) or in-browser WASM Engine

SELECT 'Hello, Enterprise SQL Server!' AS Greeting,
       DATE('now') AS CurrentDate,
       'WASM & Live Engine Ready' AS PlatformStatus;`;

export default function PracticeStudio({ initialQuery }) {
  const { runSql } = useDatabase();
  const [sql, setSql] = useState(initialQuery || DEFAULT_SQL);
  const [results, setResults] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionMode, setExecutionMode] = useState('auto'); // 'auto' | 'wasm' | 'live'

  useEffect(() => {
    if (initialQuery) {
      setSql(initialQuery);
    }
  }, [initialQuery]);

  const handleRun = useCallback(async (queryToRun) => {
    const code = queryToRun ?? sql;
    if (!code || !code.trim()) {
      toast.error('Please enter a query to execute');
      return;
    }
    
    setIsExecuting(true);
    let ranOnLive = false;

    // 1. Try FastAPI backend if not explicitly set to WASM
    if (executionMode !== 'wasm') {
      try {
        const response = await axios.post('http://localhost:8000/api/query/', {
          sql: code,
          database: 'master'
        }, { timeout: 1500 });
        
        const res = response.data;
        const mappedResults = {
          columns: res.columns,
          rows: res.rows,
          rowCount: res.row_count,
          executionTimeMs: res.execution_time_ms,
          error: res.error,
          engineSource: 'Live SQL Server 2022'
        };
        
        setResults(mappedResults);
        ranOnLive = true;

        if (mappedResults.error) {
          toast.error('SQL Execution Error');
        } else {
          toast.success(`Executed on SQL Server (${mappedResults.executionTimeMs}ms)`);
        }
      } catch {
        // Live server unreachable, fall through to WASM
      }
    }

    // 2. Seamless client-side fallback to WASM engine
    if (!ranOnLive) {
      try {
        const wasmRes = runSql(code);
        const mappedResults = {
          ...wasmRes,
          engineSource: 'In-Browser WASM Engine'
        };
        setResults(mappedResults);

        if (wasmRes.error) {
          toast.error('Query Error: ' + wasmRes.error);
        } else {
          toast.success(`Executed via WASM (${wasmRes.executionTimeMs}ms)`);
        }
      } catch (wasmErr) {
        setResults({ error: wasmErr.message, engineSource: 'WASM Error' });
      }
    }

    setIsExecuting(false);
  }, [sql, runSql, executionMode]);

  const handleClear = useCallback(() => {
    setSql('');
    setResults(null);
  }, []);

  const handleReset = useCallback(() => {
    setSql(DEFAULT_SQL);
    setResults(null);
  }, []);

  return (
    <div className="main-content" style={{ maxWidth: 960 }}>
      <div className="studio-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 className="studio-title">Practice Studio & T-SQL Sandbox</h1>
            <p className="studio-subtitle">
              Interactive query workspace with dual execution: live SQL Server backend or instant in-browser WASM engine.
            </p>
          </div>
          {results?.engineSource && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 600,
              background: results.engineSource.includes('Live') ? 'rgba(34, 197, 94, 0.15)' : 'rgba(56, 189, 248, 0.15)',
              color: results.engineSource.includes('Live') ? '#4ade80' : '#38bdf8',
              border: `1px solid ${results.engineSource.includes('Live') ? 'rgba(34, 197, 94, 0.3)' : 'rgba(56, 189, 248, 0.3)'}`
            }}>
              <CheckCircle2 size={13} />
              <span>{results.engineSource}</span>
            </div>
          )}
        </div>
      </div>

      <div className="sql-editor-section" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <CodeEditor
          value={sql}
          onChange={setSql}
          onExecute={handleRun}
          onReset={handleReset}
          onClear={handleClear}
          placeholder="-- Write your T-SQL query here..."
          minHeight="220px"
          isExecuting={isExecuting}
        />

        {results && (
          <ResultsTable
            results={results}
            emptyMessage="Query executed successfully. No rows returned."
          />
        )}
      </div>
    </div>
  );
}
