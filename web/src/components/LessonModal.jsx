import React, { useState, useEffect } from 'react';
import { useProgress } from '../context/ProgressContext.jsx';
import { COURSE_VIDEOS, COURSE_METADATA } from '../data/videoCatalog.js';
import { 
  X, 
  CheckCircle2, 
  Circle, 
  ExternalLink, 
  BookOpen, 
  Play, 
  Copy, 
  Check, 
  Download, 
  Plus, 
  Terminal, 
  FileText 
} from 'lucide-react';
import mssqlLogo from '../assets/mssql-logo.svg';

export default function LessonModal({ onRunQueryInStudio, onSelectTab }) {
  const { 
    activeLessonId, 
    closeLessonModal, 
    watchedVideos, 
    toggleWatched, 
    getStudentNote, 
    saveStudentNote, 
    studentAttachments, 
    addStudentAttachment 
  } = useProgress();

  const [activeTab, setActiveTab] = useState('overview');
  const [noteText, setNoteText] = useState('');
  const [copied, setCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Saved automatically ✅');

  const video = COURSE_VIDEOS.find(v => v.id === activeLessonId);

  useEffect(() => {
    if (video) {
      setNoteText(getStudentNote(video.id));
      setActiveTab('overview');
    }
  }, [video, getStudentNote]);

  if (!video) return null;

  const isWatched = watchedVideos.includes(video.id);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(video.sampleSql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleNoteChange = (e) => {
    const val = e.target.value;
    setNoteText(val);
    saveStudentNote(video.id, val);
    setSaveStatus('Saving...');
    setTimeout(() => setSaveStatus('Saved automatically ✅'), 400);
  };

  const handleDownloadNotes = () => {
    const content = `# Study Notes: ${video.videoCode} - ${video.title}\nCourse: MaharaTech 2305 (ITI)\nInstructor: ${COURSE_METADATA.instructor}\nDate: ${new Date().toLocaleDateString()}\n\n${noteText}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${video.videoCode}_Study_Notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddLessonAttachment = () => {
    const title = prompt(`Enter Attachment Title for ${video.videoCode}:`);
    if (!title) return;
    const notes = prompt("Enter Description / Notes:") || "";
    const url = prompt("Optional External Link / URL:") || "";
    addStudentAttachment({ title, category: video.videoCode, notes, url });
  };

  const relevantAttachments = studentAttachments.filter(
    a => a.category === video.videoCode || a.category === `Chapter ${video.chapter}`
  );

  return (
    <div className="lesson-modal-overlay active" onClick={closeLessonModal}>
      <div className="lesson-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="lesson-modal-close" onClick={closeLessonModal} aria-label="Close">
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="lesson-modal-header">
          <div className="header-top-row">
            <div className="lesson-code-group">
              <span className="badge badge-mssql-red">{video.videoCode}</span>
              <span className="badge badge-dark">Chapter {video.chapter}</span>
              <span className="badge badge-emerald">{video.level}</span>
            </div>

            <div className="header-actions-group">
              <button 
                className={`btn btn-sm ${isWatched ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => toggleWatched(video.id)}
              >
                {isWatched ? 'Mastered ✅' : 'Mark as Mastered ⚪'}
              </button>
              <a 
                href={video.maharatechUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-sm btn-cyan"
              >
                <ExternalLink size={14} />
                <span>MaharaTech ↗️</span>
              </a>
            </div>
          </div>

          <h2 className="modal-lecture-title">{video.title}</h2>
          <div className="modal-lecture-meta">
            <span>⏱️ <strong>Duration:</strong> {video.duration}</span>
            <span>👨‍🏫 <strong>Instructor:</strong> {COURSE_METADATA.instructor}</span>
            <span>📂 <strong>Repository Script:</strong> <code>{video.repoPath}</code></span>
          </div>

          {/* Modal Tab Navigation */}
          <div className="modal-tab-nav">
            <button 
              className={`modal-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📖 Lesson Deep-Dive
            </button>
            <button 
              className={`modal-tab-btn ${activeTab === 'code' ? 'active' : ''}`}
              onClick={() => setActiveTab('code')}
            >
              ⚡ T-SQL Sandbox
            </button>
            <button 
              className={`modal-tab-btn ${activeTab === 'msdocs' ? 'active' : ''}`}
              onClick={() => setActiveTab('msdocs')}
            >
              📚 Microsoft Learn Docs
            </button>
            <button 
              className={`modal-tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              📝 Study Notes Scratchpad
            </button>
          </div>
        </div>

        {/* Modal Body Panels */}
        <div className="lesson-modal-views">
          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="modal-view-panel active">
              <div className="lesson-section">
                <h4 className="section-heading">Architectural Overview</h4>
                <p className="lesson-desc-text">{video.description}</p>
              </div>

              <div className="lesson-section">
                <h4 className="section-heading">Key Learning Objectives</h4>
                <ul className="lesson-objectives-list">
                  {video.objectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>

              <div className="lesson-section">
                <h4 className="section-heading">Connected Engineering Competencies</h4>
                <div className="lesson-skills-row">
                  {video.skillsConnected.map(s => (
                    <span key={s} className="skill-chip">{s}</span>
                  ))}
                </div>
              </div>

              {/* Hands-on Practice CTA */}
              <div className="connected-labs-card">
                <h4 className="card-subtitle">🚀 Hands-On Practice Across OmniFlow:</h4>
                <div className="labs-action-row">
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      closeLessonModal();
                      onRunQueryInStudio(video.sampleSql);
                    }}
                  >
                    <Play size={14} />
                    <span>Run Query in Studio ⚡</span>
                  </button>

                  {video.challengeId && (
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        closeLessonModal();
                        onSelectTab('challenges');
                      }}
                    >
                      <span>Solve in Challenge Arena 🏆</span>
                    </button>
                  )}

                  {video.erdEntity && (
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        closeLessonModal();
                        onSelectTab('erd');
                      }}
                    >
                      <span>Inspect in Chen ERD ({video.erdEntity}) 🏢</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Code Sandbox */}
          {activeTab === 'code' && (
            <div className="modal-view-panel active">
              <div className="code-view-header">
                <div>
                  <span className="badge badge-green">T-SQL Script Sample</span>
                  <span className="file-path-hint">{video.repoPath}</span>
                </div>
                <button className="btn btn-sm btn-ghost" onClick={handleCopyCode}>
                  {copied ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <pre className="modal-code-block"><code>{video.sampleSql}</code></pre>

              <div className="code-actions-bar">
                <p className="code-note">
                  This script executes natively against the in-browser WASM database engine with zero server dependency.
                </p>
                <button 
                  className="btn btn-mssql-red"
                  onClick={() => {
                    closeLessonModal();
                    onRunQueryInStudio(video.sampleSql);
                  }}
                >
                  <Play size={14} />
                  <span>Execute in Query Studio 🚀</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Microsoft Docs & Attachments */}
          {activeTab === 'msdocs' && (
            <div className="modal-view-panel active">
              {/* Microsoft Docs Banner */}
              {video.microsoftDocsUrl && (
                <div className="ms-docs-feature-box card">
                  <div className="ms-docs-icon-col">
                    <img src={mssqlLogo} alt="MSSQL" className="ms-box-logo" />
                  </div>
                  <div className="ms-docs-content">
                    <div className="ms-badge">Official Microsoft Learn Guide</div>
                    <h3 className="ms-title">{video.microsoftDocTitle}</h3>
                    <p className="ms-desc">
                      Explore official Microsoft SQL Server architecture documentation, T-SQL syntax references, and engine best practices.
                    </p>
                    <a 
                      href={video.microsoftDocsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-sm btn-primary"
                    >
                      <ExternalLink size={14} />
                      <span>Read on Microsoft Learn ↗️</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Attachments Section */}
              <div className="attachments-list-pane">
                <div className="section-heading-row">
                  <h4 className="section-heading">Course & Student Attachments</h4>
                  <button className="btn btn-sm btn-secondary" onClick={handleAddLessonAttachment}>
                    <Plus size={14} />
                    <span>Add Attachment</span>
                  </button>
                </div>

                <div className="attachments-items-list">
                  {(video.attachments || []).map(att => (
                    <div key={att.id} className="attachment-row">
                      <span className={`att-type-badge ${att.type.toLowerCase()}`}>{att.type}</span>
                      <div className="att-details">
                        <div className="att-name">{att.name}</div>
                        <div className="att-path"><code>{att.path}</code></div>
                      </div>
                      <button 
                        className="btn btn-sm btn-ghost"
                        onClick={() => {
                          closeLessonModal();
                          if (att.path.includes('CASE_STUDY')) onSelectTab('docs-case-study');
                          else if (att.path.includes('PERFORMANCE')) onSelectTab('docs-perf');
                          else if (att.path.includes('DISASTER')) onSelectTab('docs-dr');
                        }}
                      >
                        Read Guide
                      </button>
                    </div>
                  ))}

                  {relevantAttachments.map(att => (
                    <div key={att.id} className="attachment-row user-row">
                      <span className="att-type-badge user">STUDENT</span>
                      <div className="att-details">
                        <div className="att-name">{att.title}</div>
                        <div className="att-path">{att.notes || 'Personal study artifact'}</div>
                      </div>
                      {att.url && (
                        <a href={att.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-ghost">
                          Open Link ↗️
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Student Study Notes Scratchpad */}
          {activeTab === 'notes' && (
            <div className="modal-view-panel active">
              <div className="notes-header-row">
                <div>
                  <h4 className="section-heading">Your Personal Study Notes for {video.videoCode}</h4>
                  <p className="notes-sub">Auto-saves to your local browser storage. You can export your notes to markdown anytime.</p>
                </div>
                <div className="notes-status-badge">{saveStatus}</div>
              </div>

              <textarea
                className="study-notes-textarea"
                placeholder="Type your notes, key takeaways, and T-SQL reminders for this lecture..."
                value={noteText}
                onChange={handleNoteChange}
              />

              <div className="notes-actions-row">
                <button className="btn btn-sm btn-secondary" onClick={handleDownloadNotes}>
                  <Download size={14} />
                  <span>Download Notes (.md)</span>
                </button>
                <button 
                  className="btn btn-sm btn-ghost"
                  onClick={() => {
                    if (confirm('Clear notes for this lecture?')) {
                      setNoteText('');
                      saveStudentNote(video.id, '');
                    }
                  }}
                >
                  Clear Notes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
