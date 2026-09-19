/**
 * Navbar — Top navigation bar with sidebar toggle, primary tabs, and progress indicator.
 *
 * @param {string}   activeTab       - Currently active tab key
 * @param {Function} onSelectTab     - Tab change handler
 * @param {Function} onOpenChatbot   - Opens the AI chatbot drawer
 * @param {Function} onToggleSidebar - Toggles sidebar open/close
 * @param {boolean}  isSidebarOpen   - Whether the sidebar is currently open
 */
import React from 'react';
import { useProgress } from '../context/ProgressContext.jsx';
import {
  BookOpen,
  Code2,
  FileText,
  MessageCircle,
  Menu,
  X,
  Map,
  GraduationCap,
} from 'lucide-react';
import mssqlLogo from '../assets/mssql-logo.svg';

/** Primary navigation tabs shown in the top bar */
const NAV_ITEMS = [
  { id: 'roadmap',    label: 'Roadmap',   icon: Map },
  { id: 'learn',      label: 'Lessons',   icon: BookOpen },
  { id: 'playground', label: 'Practice',  icon: Code2 },
  { id: 'docs',       label: 'Resources', icon: GraduationCap },
];

export default function Navbar({
  activeTab,
  onSelectTab,
  onOpenChatbot,
  onToggleSidebar,
  isSidebarOpen,
}) {
  const { progressPercent } = useProgress();

  return (
    <header className="site-header">
      {/* ── Hamburger + Brand ──────────────────────────────────────── */}
      <div className="header-left">
        <button
          className="header-hamburger-btn"
          onClick={onToggleSidebar}
          title={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="header-brand" onClick={() => onSelectTab('roadmap')}>
          <img src={mssqlLogo} alt="" className="header-brand-icon" />
          <span className="header-brand-text">
            SQL Platform
            <span className="header-brand-sub">MaharaTech 2305</span>
          </span>
        </div>
      </div>

      {/* ── Primary Navigation ─────────────────────────────────────── */}
      <nav className="header-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`header-nav-link ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onSelectTab(item.id)}
          >
            <item.icon size={14} className="header-nav-icon" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* ── Right: progress + AI ───────────────────────────────────── */}
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
