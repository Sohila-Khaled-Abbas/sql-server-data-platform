import React, { useEffect, useRef } from 'react';
import { useDatabase } from '../context/DatabaseContext.jsx';
import { useProgress } from '../context/ProgressContext.jsx';
import { 
  Search, 
  Terminal, 
  Menu, 
  Bot, 
  BookOpen, 
  Compass, 
  Code2, 
  Trophy, 
  Database, 
  FileText,
  ListTree,
  Sparkles
} from 'lucide-react';
import mssqlLogo from '../assets/mssql-logo.svg';

export default function Navbar({ 
  onToggleSidebar, 
  onSearch, 
  activeTab, 
  onSelectTab, 
  onOpenChatbot,
  onOpenSyllabus 
}) {
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

  const navItems = [
    { id: 'learn', label: 'Learn & Practice', icon: BookOpen },
    { id: 'roadmap', label: 'Roadmap', icon: Compass },
    { id: 'playground', label: 'Query Studio', icon: Code2 },
    { id: 'challenges', label: 'Challenges', icon: Trophy },
    { id: 'architecture', label: 'Schema & ERD', icon: Database },
    { id: 'msdocs', label: 'MS Docs', icon: FileText }
  ];

  return (
    <header className="app-header modern-header">
      {/* Left: Brand */}
      <div className="header-left">
        <button 
          className="btn-icon mobile-only" 
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation"
        >
          <Menu size={20} />
        </button>

        <div className="logo-group" onClick={() => onSelectTab('learn')} style={{ cursor: 'pointer' }}>
          <div className="mssql-logo-container">
            <img 
              src={mssqlLogo} 
              alt="Microsoft SQL Server Logo" 
              className="mssql-logo-img" 
              width="26" 
              height="26" 
              style={{ width: '26px', height: '26px', objectFit: 'contain', flexShrink: 0 }}
            />
          </div>
          <div>
            <div className="brand-title">
              SQL Server <span className="brand-badge-modern">2022</span>
            </div>
            <div className="brand-subtitle">
              MaharaTech Course 2305 • ITI DBRE Sandbox
            </div>
          </div>
        </div>
      </div>

      {/* Center: Primary Navigation Tabs */}
      <nav className="header-center-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`modern-nav-tab ${isActive ? 'active' : ''}`}
              onClick={() => onSelectTab(item.id)}
            >
              <Icon size={14} className="nav-icon" />
              <span>{item.label}</span>
              {isActive && <div className="active-tab-glow" />}
            </button>
          );
        })}
      </nav>

      {/* Right: Actions, Search, XP, AI Mentor */}
      <div className="header-right">
        {/* Global Search Bar */}
        <div className="header-search-bar">
          <Search size={13} className="text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search topics, T-SQL... (/)"
            onChange={(e) => onSearch(e.target.value)}
          />
          <kbd className="header-search-kbd">/</kbd>
        </div>

        {/* Curriculum Syllabus Button */}
        {onOpenSyllabus && (
          <button 
            onClick={onOpenSyllabus}
            className="navbar-syllabus-btn"
            title="Browse all 102 Course Lessons"
          >
            <ListTree size={14} className="text-cyan-400" />
            <span className="hidden sm:inline">Syllabus</span>
          </button>
        )}

        {/* AI Mentor Header Button */}
        {onOpenChatbot && (
          <button 
            onClick={onOpenChatbot}
            className="navbar-ai-mentor-btn"
            title="Open DBRE AI Study Mentor"
          >
            <Bot size={14} className="text-cyan-400" />
            <span className="hidden sm:inline">AI Mentor</span>
            <span className="nav-pulse-dot" />
          </button>
        )}

        {/* Student Mastery XP & Rank */}
        <div 
          className="modern-rank-badge" 
          title={`Rank: ${rankInfo.rank} (${progressPercent}% Mastered)`}
        >
          <span className="rank-emoji">{rankInfo.icon}</span>
          <span className="xp-count">{totalXp} XP</span>
        </div>
      </div>
    </header>
  );
}
