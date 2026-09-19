/**
 * CodeEditor — Reusable SQL code editor with react-simple-code-editor & Prism.js syntax highlighting.
 * 
 * Used across: PracticeStudio, LessonView, InteractiveLearningStudio, ChallengeArena
 * 
 * @param {string}   value          - Current SQL code string
 * @param {Function} onChange       - Callback when code changes: (newValue) => void
 * @param {Function} [onExecute]    - Callback when user presses Run or Ctrl+Enter
 * @param {Function} [onReset]      - Callback to reset code to initial state
 * @param {Function} [onClear]      - Callback to clear editor
 * @param {boolean}  [readOnly]     - If true, editor is non-editable (display mode)
 * @param {string}   [placeholder]  - Placeholder text when editor is empty
 * @param {string}   [minHeight]    - CSS min-height for the editor (default: '160px')
 * @param {boolean}  [showToolbar]  - Whether to show the run/copy toolbar (default: true)
 * @param {string}   [className]    - Additional CSS class for the wrapper
 */
import React, { useState, useCallback } from 'react';
import SimpleEditor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-sql.js';
import toast from 'react-hot-toast';
import { Play, Copy, Check, RotateCcw, Trash2 } from 'lucide-react';

const Editor = SimpleEditor.default || SimpleEditor;

export default function CodeEditor({
  value = '',
  onChange,
  onExecute,
  onReset,
  onClear,
  readOnly = false,
  placeholder = '-- Write your T-SQL query here...',
  minHeight = '180px',
  showToolbar = true,
  className = '',
}) {
  const [copied, setCopied] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  /* ── Syntax Highlighter ────────────────────────────────────────────── */
  const highlightCode = useCallback((code) => {
    if (!code) return '';
    try {
      return Prism.highlight(code, Prism.languages.sql, 'sql');
    } catch {
      return code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
  }, []);

  /* ── Copy to clipboard ────────────────────────────────────────────── */
  const handleCopy = useCallback(() => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success('SQL copied to clipboard');
    setTimeout(() => setCopied(false), 1500);
  }, [value]);

  /* ── Execute handler ──────────────────────────────────────────────── */
  const handleExecute = useCallback(() => {
    if (!onExecute || !value.trim()) return;
    setIsExecuting(true);
    try {
      onExecute(value);
    } finally {
      setTimeout(() => setIsExecuting(false), 200);
    }
  }, [onExecute, value]);

  /* ── Keyboard shortcuts ───────────────────────────────────────────── */
  const handleKeyDown = useCallback(
    (e) => {
      // Ctrl+Enter or F5 → Execute
      if ((e.ctrlKey && e.key === 'Enter') || e.key === 'F5') {
        e.preventDefault();
        handleExecute();
      }
    },
    [handleExecute]
  );

  return (
    <div className={`code-editor-component ${className}`}>
      {/* Code Editor Body */}
      <div className="code-editor-body" style={{ minHeight }}>
        <Editor
          value={value}
          onValueChange={(val) => onChange?.(val)}
          highlight={highlightCode}
          placeholder={placeholder}
          readOnly={readOnly}
          padding={14}
          onKeyDown={handleKeyDown}
          className="code-editor-simple-inner"
          textareaClassName="code-editor-simple-textarea"
          style={{
            fontFamily: 'var(--font-mono, "JetBrains Mono", Consolas, monospace)',
            fontSize: '13px',
            minHeight,
            lineHeight: 1.6,
          }}
        />
      </div>

      {/* Toolbar */}
      {showToolbar && (
        <div className="code-editor-toolbar">
          <div className="code-editor-toolbar-left">
            {onExecute && (
              <button
                type="button"
                className="code-editor-run-btn"
                onClick={handleExecute}
                disabled={isExecuting || !value.trim()}
                title="Execute SQL (Ctrl + Enter)"
              >
                <Play size={13} className="fill-current" />
                <span>{isExecuting ? 'Running...' : 'Run'}</span>
              </button>
            )}
            <button
              type="button"
              className="code-editor-icon-btn"
              onClick={handleCopy}
              title="Copy SQL to Clipboard"
            >
              {copied ? <Check size={14} style={{ color: 'var(--success, #10b981)' }} /> : <Copy size={14} />}
            </button>
            {onReset && (
              <button
                type="button"
                className="code-editor-icon-btn"
                onClick={onReset}
                title="Reset to Starter SQL"
              >
                <RotateCcw size={14} />
              </button>
            )}
            {onClear && (
              <button
                type="button"
                className="code-editor-icon-btn"
                onClick={onClear}
                title="Clear Editor"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
          <div className="code-editor-shortcut-hint">
            <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to run
          </div>
        </div>
      )}
    </div>
  );
}
