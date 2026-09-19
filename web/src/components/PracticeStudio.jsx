import React, { useState, useCallback, useEffect } from 'react';
import { useDatabase } from '../context/DatabaseContext.jsx';
import CodeEditor from './ui/CodeEditor.jsx';
import ResultsTable from './ui/ResultsTable.jsx';
import toast from 'react-hot-toast';

const DEFAULT_SQL = `-- Write any T-SQL query here
-- This runs against the in-memory WASM engine

SELECT 'Hello, SQL Server!' AS greeting,
       CURRENT_TIMESTAMP AS executed_at;`;

export default function PracticeStudio({ initialQuery }) {
  const { runSql } = useDatabase();
  const [sql, setSql] = useState(initialQuery || DEFAULT_SQL);
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (initialQuery) {
      setSql(initialQuery);
    }
  }, [initialQuery]);

  const handleRun = useCallback((queryToRun) => {
    const code = queryToRun ?? sql;
    if (!code || !code.trim()) {
      toast.error('Please enter a query to execute');
      return;
    }
    setTimeout(() => {
      const res = runSql(code);
      setResults(res);
      if (res?.error) {
        toast.error('Query execution error');
      } else {
        toast.success(`Executed successfully (${res?.executionTimeMs || '<1'}ms)`);
      }
    }, 15);
  }, [sql, runSql]);

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
        <h1 className="studio-title">Practice Studio & T-SQL Sandbox</h1>
        <p className="studio-subtitle">
          Write and execute T-SQL queries against the in-memory WASM database engine with syntax highlighting and schema exploration.
        </p>
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

