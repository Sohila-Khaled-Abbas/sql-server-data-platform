import React from 'react';
import { useProgress } from '../context/ProgressContext.jsx';
import { COURSE_VIDEOS } from '../data/videoCatalog.js';
import { BookOpen, Code2, MessageCircle } from 'lucide-react';
import mssqlLogo from '../assets/mssql-logo.svg';

export default function Navbar({ activeTab, onSelectTab, onOpenChatbot }) {
  const { progressPercent } = useProgress();

  const navItems = [
    { id: 'learn', label: 'Lessons', icon: BookOpen },
    { id: 'playground', label: 'Practice', icon: Code2 },
  ];

  return (
    <header className="site-header">
      {/* Brand */}
      <div className="header-brand" onClick={() => onSelectTab('learn')}>
        <img src={mssqlLogo} alt="" className="header-brand-icon" />
        <span className="header-brand-text">
          SQL Platform
          <span className="header-brand-sub">MaharaTech 2305</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="header-nav">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`header-nav-link ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => onSelectTab(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Right: progress + AI */}
      <div className="header-actions">
        <div className="header-progress-pill">
          <div className="header-progress-bar">
            <div 
              className="header-progress-fill" 
              style={{ width: `${progressPercent}%` }} 
            />
          </div>
          <span>{Math.round(progressPercent)}%</span>
        </div>

        <button
          className="header-icon-btn"
          onClick={onOpenChatbot}
          title="AI Mentor"
        >
          <MessageCircle size={16} />
        </button>
      </div>
    </header>
  );
}
