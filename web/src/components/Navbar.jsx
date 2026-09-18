import React, { useEffect, useRef } from 'react';
import { useDatabase } from '../context/DatabaseContext.jsx';
import { useProgress } from '../context/ProgressContext.jsx';
import { Search, Terminal, Menu, Bot } from 'lucide-react';
import mssqlLogo from '../assets/mssql-logo.svg';

export default function Navbar({ onToggleSidebar, onSearch, activeTab, onSelectTab, onOpenChatbot }) {
  const { engineStatus, engineStatusText } = useDatabase();
  const { totalXp, progressPercent, rankInfo } = useProgress();
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="app-header">
      <div className="header-left">
        <button 
          className="btn-icon mobile-only" 
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation"
        >
          <Menu size={20} />
        </button>

        <div className="logo-group" onClick={() => onSelectTab('roadmap')} style={{ cursor: 'pointer' }}>
          <div className="mssql-logo-container">
            <img 
              src={mssqlLogo} 
              alt="Microsoft SQL Server Logo" 
              className="mssql-logo-img" 
              width="32" 
              height="32" 
              style={{ width: '32px', height: '32px', maxWidth: '32px', maxHeight: '32px', objectFit: 'contain', flexShrink: 0 }}
            />
          </div>
          <div>
            <div className="brand-title">
              Microsoft SQL Server <span className="badge badge-mssql-red">2022 Platform</span>
            </div>
            <div className="brand-subtitle">
              MaharaTech Course 2305 • ITI Data Engineering Sandbox
            </div>
          </div>
        </div>
      </div>

      <div className="header-center">
        <div className="global-search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search T-SQL, MS Docs, topics... (/)"
            onChange={(e) => onSearch(e.target.value)}
          />
          <kbd className="search-kbd">/</kbd>
        </div>
      </div>

      <div className="header-right">
        {/* Engine Status Pill */}
        <div className={`status-pill ${engineStatus === 'online' ? 'online' : 'warning'}`}>
          <span className="pulse-dot"></span>
          <span>{engineStatus === 'online' ? 'SQL Engine Ready' : engineStatusText}</span>
        </div>

        {/* AI Mentor Quick Nav Button */}
        {onOpenChatbot && (
          <button 
            onClick={onOpenChatbot}
            className="navbar-ai-mentor-btn"
            title="Open DBRE AI Study Mentor"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(99, 102, 241, 0.25))',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              color: '#38bdf8',
              fontWeight: 600,
              fontSize: '0.8rem',
              borderRadius: '8px',
              padding: '6px 12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(6, 182, 212, 0.15)'
            }}
          >
            <Bot size={15} className="text-cyan-400" />
            <span>AI Mentor</span>
          </button>
        )}

        {/* Student Mastery XP & Rank */}
        <div 
          className="user-rank-pill" 
          title={`Rank: ${rankInfo.rank}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}
        >
          <span className="rank-emoji">{rankInfo.icon}</span>
          <div className="rank-meta" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="xp-val" style={{ fontWeight: 700, color: '#f59e0b' }}>{totalXp} XP</span>
            <span 
              className="prog-val" 
              style={{ color: '#94a3b8', fontSize: '0.75rem', paddingLeft: '8px', borderLeft: '1px solid rgba(255, 255, 255, 0.15)' }}
            >
              {progressPercent}% Mastered
            </span>
          </div>
        </div>

        {/* GitHub Link */}
        <a 
          href="https://github.com/Sohila-Khaled-Abbas/sql-server-data-platform" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn btn-secondary btn-sm github-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          <span>GitHub</span>
        </a>
      </div>
    </header>
  );
}
