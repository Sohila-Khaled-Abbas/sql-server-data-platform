import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import CodeEditor from './ui/CodeEditor.jsx';
import ResultsTable from './ui/ResultsTable.jsx';
import toast from 'react-hot-toast';

const DEFAULT_SQL = `-- Write any T-SQL query here
-- This runs against the real SQL Server backend

SELECT 'Hello, Backend SQL Server!' AS greeting,
       CURRENT_TIMESTAMP AS executed_at;`;

export default function PracticeStudio({ initialQuery }) {
  const [sql, setSql] = useState(initialQuery || DEFAULT_SQL);
  const [results, setResults] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);

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
    try {
      // Connect to the new FastAPI Backend
      const response = await axios.post('http://localhost:8000/api/query/', {
        sql: code,
        database: 'master'
      });
      
      const res = response.data;
      
      // Map API response to ResultsTable format
      const mappedResults = {
        columns: res.columns,
        rows: res.rows,
        rowCount: res.row_count,
        executionTimeMs: res.execution_time_ms,
        error: res.error
      };
      
      setResults(mappedResults);
      
      if (mappedResults.error) {
        toast.error('Query execution error');
      } else {
        toast.success(`Executed successfully (${mappedResults.executionTimeMs}ms)`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to connect to backend server');
      setResults({ error: 'Backend connection failed. Is the FastAPI server running?' });
    } finally {
      setIsExecuting(false);
    }
  }, [sql]);

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
          Write and execute T-SQL queries against the remote SQL Server database backend.
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
