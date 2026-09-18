import React, { useState, useMemo } from 'react';
import { useProgress } from '../context/ProgressContext.jsx';
import { COURSE_VIDEOS, COURSE_METADATA } from '../data/videoCatalog.js';
import { MICROSOFT_DMV_DOCS } from '../data/microsoftDocs.js';
import { 
  Search, 
  CheckCircle2, 
  Circle, 
  ExternalLink, 
  BookOpen, 
  Play, 
  Clock, 
  Flame, 
  BookMarked 
} from 'lucide-react';
import mssqlLogo from '../assets/mssql-logo.svg';

export default function VideoLearningHub({ onRunQueryInStudio, onSelectTab }) {
  const { watchedVideos, toggleWatched, openLessonModal, progressPercent, watchedCount, totalVideos, totalXp } = useProgress();
  const [activeChapter, setActiveChapter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVideos = useMemo(() => {
    return COURSE_VIDEOS.filter(v => {
      const matchChapter = activeChapter === 'all' || v.chapter === Number(activeChapter);
      const matchSearch = !searchTerm || 
        v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.videoCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.skillsConnected.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (v.microsoftDocTitle && v.microsoftDocTitle.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchChapter && matchSearch;
    });
  }, [activeChapter, searchTerm]);

  return (
    <div className="video-learning-hub-container">
      {/* 1. Hub Header */}
      <div className="resources-hero card">
        <div className="hero-content">
          <div className="hero-tag-row">
            <span className="badge badge-mssql-red">{COURSE_METADATA.institution}</span>
            <span className="badge badge-purple">Course {COURSE_METADATA.courseId}</span>
            <span className="badge badge-cyan">25 Video Lectures</span>
          </div>

          <h1 className="hero-title">{COURSE_METADATA.courseTitle}</h1>
          <p className="hero-desc">
            Taught by <strong>{COURSE_METADATA.instructor}</strong>. Master Microsoft SQL Server objects, 8 KB storage internals, ACID transaction boundaries, and Kimball star schemas with direct links to official Microsoft Learn technical documentation.
          </p>

          {/* Watch Progress Dashboard */}
          <div className="video-progress-dashboard">
            <div className="progress-info-row">
              <div className="progress-stat">
                <span className="stat-number">{watchedCount} / {totalVideos}</span>
                <span className="stat-label">Videos Mastered</span>
              </div>
              <div className="progress-stat">
                <span className="stat-number">{progressPercent}%</span>
                <span className="stat-label">Curriculum Done</span>
              </div>
              <div className="progress-stat">
                <span className="stat-number">{totalXp} XP</span>
                <span className="stat-label">Mastery XP</span>
              </div>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>

        <div className="hero-actions">
          <a 
            href={COURSE_METADATA.portalUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-primary"
          >
            <ExternalLink size={16} />
            <span>MaharaTech Portal</span>
          </a>
          <button className="btn btn-secondary" onClick={() => onSelectTab('roadmap')}>
            <BookMarked size={16} />
            <span>View Roadmap Flowchart</span>
          </button>
        </div>
      </div>

      {/* 2. Controls & Search Bar */}
      <div className="hub-controls-bar card">
        <div className="chapter-filter-pills">
          <button 
            className={`filter-pill ${activeChapter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveChapter('all')}
          >
            All ({COURSE_VIDEOS.length})
          </button>
          <button 
            className={`filter-pill ${activeChapter === '1' ? 'active' : ''}`}
            onClick={() => setActiveChapter('1')}
          >
            Ch 1: Storage & Schemas (5)
          </button>
          <button 
            className={`filter-pill ${activeChapter === '2' ? 'active' : ''}`}
            onClick={() => setActiveChapter('2')}
          >
            Ch 2: T-SQL & Concurrency (6)
          </button>
          <button 
            className={`filter-pill ${activeChapter === '3' ? 'active' : ''}`}
            onClick={() => setActiveChapter('3')}
          >
            Ch 3: Scalability & Partitioning (5)
          </button>
          <button 
            className={`filter-pill ${activeChapter === '4' ? 'active' : ''}`}
            onClick={() => setActiveChapter('4')}
          >
            Ch 4: Automation & Triggers (5)
          </button>
          <button 
            className={`filter-pill ${activeChapter === '5' ? 'active' : ''}`}
            onClick={() => setActiveChapter('5')}
          >
            Ch 5: Warehousing & BI (4)
          </button>
        </div>

        <div className="hub-search-wrapper">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by topic, skill, or code (e.g. partition, TVP, trigger, ERD)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="btn-clear-search" onClick={() => setSearchTerm('')}>✕</button>
          )}
        </div>
      </div>

      {/* 3. Video Cards Grid */}
      <div className="video-cards-grid">
        {filteredVideos.map(video => {
          const isWatched = watchedVideos.includes(video.id);
          return (
            <div 
              key={video.id} 
              className={`video-lecture-card card ${isWatched ? 'card-watched' : ''}`}
            >
              <div className="video-card-header">
                <div className="video-badge-row">
                  <span className="badge badge-mssql-red">{video.videoCode}</span>
                  <span className="badge badge-dark">Ch {video.chapter}</span>
                  <span className="badge badge-emerald">{video.level}</span>
                </div>
                <button 
                  className={`watch-status-toggle ${isWatched ? 'active' : ''}`}
                  onClick={() => toggleWatched(video.id)}
                  title={isWatched ? "Mark as unwatched" : "Mark as mastered"}
                >
                  {isWatched ? 'Mastered ✅' : 'Unwatched ⚪'}
                </button>
              </div>

              <h3 className="video-card-title">{video.title}</h3>
              <p className="video-card-desc">{video.description}</p>

              {/* Connected Skills */}
              <div className="video-skills-tags">
                {video.skillsConnected.map(s => (
                  <span key={s} className="skill-tag">{s}</span>
                ))}
              </div>

              {/* Official Microsoft Docs Link */}
              {video.microsoftDocsUrl && (
                <div className="ms-docs-card-link">
                  <BookOpen size={13} className="text-mssql-red" />
                  <a 
                    href={video.microsoftDocsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ms-doc-anchor"
                  >
                    MS Docs: {video.microsoftDocTitle} ↗️
                  </a>
                </div>
              )}

              {/* Card Footer Actions */}
              <div className="video-card-footer">
                <div className="video-duration">
                  <Clock size={13} />
                  <span>{video.duration}</span>
                </div>

                <div className="video-action-buttons">
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => openLessonModal(video.id)}
                  >
                    Study Lesson 📖
                  </button>
                  <button 
                    className="btn btn-sm btn-ghost"
                    onClick={() => onRunQueryInStudio(video.sampleSql)}
                    title="Run query in Query Studio"
                  >
                    Run Code ⚡
                  </button>
                  <a 
                    href={video.maharatechUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-sm btn-ghost"
                    title="Watch on MaharaTech"
                  >
                    Portal ↗️
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. DBRE Cheatsheets Suite */}
      <div className="cheatsheets-section">
        <div className="section-title-row">
          <div className="title-with-logo">
            <img 
              src={mssqlLogo} 
              alt="MSSQL" 
              className="title-mssql-icon" 
              width="28" 
              height="28" 
              style={{ width: '28px', height: '28px', maxWidth: '28px', maxHeight: '28px', objectFit: 'contain', flexShrink: 0, display: 'inline-block' }}
            />
            <h2>High-Value DBRE Reference Cheatsheets</h2>
          </div>
          <span className="badge badge-mssql-red">Production Ready</span>
        </div>

        <div className="cheatsheets-grid">
          {/* Cheatsheet 1: Concurrency Matrix */}
          <div className="cheatsheet-card card">
            <h3 className="card-title">ACID Transaction Isolation Levels Matrix</h3>
            <p className="card-summary">Preventing data corruption and concurrency anomalies across SQL Server transactions:</p>
            <table className="cheatsheet-table">
              <thead>
                <tr>
                  <th>Isolation Level</th>
                  <th>Dirty Read</th>
                  <th>Non-Repeatable</th>
                  <th>Phantom Read</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Read Uncommitted</strong> (NOLOCK)</td>
                  <td className="danger">Allowed ❌</td>
                  <td className="danger">Allowed ❌</td>
                  <td className="danger">Allowed ❌</td>
                </tr>
                <tr>
                  <td><strong>Read Committed</strong> (Default)</td>
                  <td className="success">Prevented ✅</td>
                  <td className="danger">Allowed ❌</td>
                  <td className="danger">Allowed ❌</td>
                </tr>
                <tr>
                  <td><strong>Repeatable Read</strong></td>
                  <td className="success">Prevented ✅</td>
                  <td className="success">Prevented ✅</td>
                  <td className="danger">Allowed ❌</td>
                </tr>
                <tr>
                  <td><strong>Serializable</strong> (Key Range)</td>
                  <td className="success">Prevented ✅</td>
                  <td className="success">Prevented ✅</td>
                  <td className="success">Prevented ✅</td>
                </tr>
                <tr>
                  <td><strong>Snapshot (RCSI)</strong></td>
                  <td className="success">Prevented ✅</td>
                  <td className="success">Prevented ✅</td>
                  <td className="success">Prevented ✅</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Cheatsheet 2: Production Diagnostic DMVs */}
          <div className="cheatsheet-card card">
            <h3 className="card-title">Top Production Diagnostic DMVs</h3>
            <p className="card-summary">Essential Dynamic Management Views with direct Microsoft documentation:</p>
            <div className="dmv-list">
              {MICROSOFT_DMV_DOCS.map(d => (
                <div key={d.dmv} className="dmv-item">
                  <div className="dmv-code-row">
                    <code>{d.dmv}</code>
                    <a href={d.url} target="_blank" rel="noopener noreferrer" className="dmv-doc-link">
                      MS Learn ↗️
                    </a>
                  </div>
                  <span>{d.purpose}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cheatsheet 3: Storage Engine Geometry Math */}
          <div className="cheatsheet-card card">
            <h3 className="card-title">Storage Engine Math & Page Geometry</h3>
            <ul className="storage-math-list">
              <li><strong>Page Size</strong>: <code>8,192 bytes</code> (8 KB). 96 bytes page header, 8,060 bytes usable row data, 36 bytes slot offset array.</li>
              <li><strong>Extent Size</strong>: <code>64 KB</code> (8 physically contiguous 8 KB pages). Uniform extents belong to a single database object.</li>
              <li><strong>Rows Per Page Formula</strong>: <code>Floor(8060 / (RowSizeInBytes + 2))</code>.</li>
              <li><strong>Fill Factor Strategy</strong>: <code>FILLFACTOR = 85</code> reserves 15% headroom on index leaf pages to prevent expensive page splits.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
