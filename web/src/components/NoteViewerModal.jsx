import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  BookOpen, 
  CheckSquare, 
  Square, 
  Code2, 
  Sparkles, 
  AlertCircle, 
  Clock, 
  Share2, 
  ChevronRight, 
  FileText,
  PlayCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  fetchNoteContent, 
  isTaskCompleted, 
  toggleTaskCompletion 
} from '../services/obsidianApiService.js';

export default function NoteViewerModal({ note, isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noteContent, setNoteContent] = useState(null);
  const [copied, setCopied] = useState(false);
  const [taskStates, setTaskStates] = useState({});
  const contentRef = useRef(null);

  // Load note content when modal opens or note changes
  useEffect(() => {
    if (!isOpen || !note) {
      setNoteContent(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    // Initialize local task states
    const initialTasks = {};
    if (note.abilities && note.abilities.length > 0) {
      note.abilities.forEach((_, idx) => {
        initialTasks[idx] = isTaskCompleted(note.id, idx);
      });
    }
    setTaskStates(initialTasks);

    fetchNoteContent(note)
      .then((data) => {
        if (isMounted) {
          setNoteContent(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(`Failed to load note content: ${err.message}`);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, note]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !note) return null;

  const handleToggleTask = (taskIndex) => {
    const newState = toggleTaskCompletion(note.id, taskIndex);
    const updated = { ...taskStates, [taskIndex]: newState };
    setTaskStates(updated);

    // If all tasks are completed, trigger celebration confetti!
    if (note.abilities && note.abilities.length > 0) {
      const allDone = note.abilities.every((_, i) => updated[i]);
      if (allDone && newState) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }
    }
  };

  const handleCopyMarkdown = () => {
    if (!noteContent) return;
    navigator.clipboard.writeText(noteContent.rawMarkdown || noteContent.bodyMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const completedCount = note.abilities ? note.abilities.filter((_, i) => taskStates[i]).length : 0;
  const totalCount = note.abilities ? note.abilities.length : 0;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="note-modal-backdrop" onClick={onClose}>
      <div 
        className="note-modal-container" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="note-modal-header">
          <div className="note-header-breadcrumbs">
            <span className="breadcrumb-pill" style={{ color: note.chapter_color || '#CC292B' }}>
              {note.chapter || 'COURSE'}
            </span>
            <ChevronRight size={14} className="breadcrumb-divider" />
            <span className="breadcrumb-id">{note.id}</span>
            <ChevronRight size={14} className="breadcrumb-divider" />
            <span className="breadcrumb-title">{note.title}</span>
          </div>

          <div className="note-header-actions">
            <button 
              className="note-action-btn" 
              onClick={handleCopyMarkdown}
              title="Copy Raw Markdown Note"
            >
              {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
              <span>{copied ? 'Copied' : 'Copy MD'}</span>
            </button>

            <a 
              href={note.github_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="note-action-btn"
              title="Open Note on GitHub"
            >
              <ExternalLink size={16} />
              <span>GitHub</span>
            </a>

            {note.source && (
              <a 
                href={note.source} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="note-action-btn note-action-source"
                title="Watch Lecture on MaharaTech"
              >
                <PlayCircle size={16} color="#38bdf8" />
                <span>MaharaTech</span>
              </a>
            )}

            <button 
              className="note-close-btn" 
              onClick={onClose} 
              title="Close (Esc)"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Meta Strip */}
        <div className="note-modal-meta-strip">
          <div className="meta-left">
            <span className={`meta-badge difficulty-${note.difficulty || 'medium'}`}>
              {note.difficulty ? note.difficulty.toUpperCase() : 'MEDIUM'}
            </span>
            <span className="meta-badge status-badge">
              {note.status || 'In Progress'}
            </span>
            {note.code_reference && (
              <span className="meta-code-ref">
                <Code2 size={13} />
                <code>{note.code_reference}</code>
              </span>
            )}
          </div>

          {totalCount > 0 && (
            <div className="meta-right">
              <div className="meta-progress-label">
                Mastery: <strong>{completedCount} / {totalCount}</strong> ({progressPercent}%)
              </div>
              <div className="meta-progress-track">
                <div 
                  className="meta-progress-bar" 
                  style={{ width: `${progressPercent}%`, background: note.chapter_color || '#CC292B' }} 
                />
              </div>
            </div>
          )}
        </div>

        {/* Interactive Abilities Checklist (Top of Modal) */}
        {note.abilities && note.abilities.length > 0 && (
          <div className="note-abilities-card">
            <div className="abilities-header">
              <Sparkles size={16} color="#38bdf8" />
              <h4>🎯 What I Should Be Able to Do (Interactive Checklist)</h4>
            </div>
            <ul className="abilities-list">
              {note.abilities.map((ability, idx) => (
                <li 
                  key={idx} 
                  className={`ability-item ${taskStates[idx] ? 'completed' : ''}`}
                  onClick={() => handleToggleTask(idx)}
                >
                  <button className="ability-checkbox-btn" aria-label="Toggle task">
                    {taskStates[idx] ? (
                      <CheckSquare size={18} color="#10b981" />
                    ) : (
                      <Square size={18} color="#64748b" />
                    )}
                  </button>
                  <span className="ability-text">{ability.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Modal Scrollable Content */}
        <div className="note-modal-body" ref={contentRef}>
          {loading && (
            <div className="note-loading-spinner">
              <div className="spinner-ring" />
              <p>Streaming note from Obsidian Second Brain API...</p>
            </div>
          )}

          {error && (
            <div className="note-error-state">
              <AlertCircle size={32} color="#ef4444" />
              <h3>Failed to Load Note</h3>
              <p>{error}</p>
              <a 
                href={note.github_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-primary"
              >
                View on GitHub Instead
              </a>
            </div>
          )}

          {!loading && !error && noteContent && (
            <div 
              className="note-rendered-markdown" 
              dangerouslySetInnerHTML={{ __html: noteContent.html }} 
            />
          )}
        </div>

        {/* Modal Footer */}
        <div className="note-modal-footer">
          <div className="footer-topics">
            {note.topics && note.topics.map((t, idx) => (
              <span key={idx} className="topic-tag">#{t}</span>
            ))}
          </div>
          <div className="footer-sync">
            <Clock size={14} />
            <span>Synced from master branch via Obsidian API</span>
          </div>
        </div>
      </div>
    </div>
  );
}
