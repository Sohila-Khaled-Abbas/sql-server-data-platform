/**
 * App.jsx — Root application shell with full sidebar + content routing.
 *
 * Routes all 14+ sidebar/navbar tabs to their corresponding view components.
 * Uses a TAB_COMPONENTS map for clean O(1) lookup instead of long if/else chains.
 */
import React, { useState, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import { DatabaseProvider } from './context/DatabaseContext.jsx';
import { ProgressProvider } from './context/ProgressContext.jsx';

/* ── Layout Components ──────────────────────────────────────────────── */
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';

/* ── View Components ────────────────────────────────────────────────── */
import LessonView from './components/LessonView.jsx';
import LessonList from './components/LessonList.jsx';
import PracticeStudio from './components/PracticeStudio.jsx';
import DocsView from './components/DocsView.jsx';
import DocsViewer from './components/DocsViewer.jsx';
import AIChatbot from './components/AIChatbot.jsx';
import RoadmapDiagram from './components/RoadmapDiagram.jsx';
import VideoLearningHub from './components/VideoLearningHub.jsx';
import MicrosoftDocsHub from './components/MicrosoftDocsHub.jsx';
import ChallengeArena from './components/ChallengeArena.jsx';
import ProjectBlueprints from './components/ProjectBlueprints.jsx';
import ArchitectureViewer from './components/ArchitectureViewer.jsx';
import MigrationSimulator from './components/MigrationSimulator.jsx';
import ErdExplorer from './components/ErdExplorer.jsx';
import PlanSimulator from './components/PlanSimulator.jsx';
import QuizMaster from './components/QuizMaster.jsx';
import QueryStudio from './components/QueryStudio.jsx';

/* ── Data ───────────────────────────────────────────────────────────── */
import { COURSE_VIDEOS } from './data/videoCatalog.js';

/* ──────────────────────────────────────────────────────────────────── */
/*  MAIN LAYOUT                                                        */
/* ──────────────────────────────────────────────────────────────────── */

function MainLayout() {
  /* ── Navigation state ────────────────────────────────────────────── */
  const [activeTab, setActiveTab] = useState('roadmap');
  const [activeLessonId, setActiveLessonId] = useState('ch01-vid01');
  const [viewMode, setViewMode] = useState('lesson');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [studioInitialQuery, setStudioInitialQuery] = useState(null);

  /* ── Lesson selection handler ────────────────────────────────────── */
  const handleSelectLesson = useCallback((id) => {
    setActiveLessonId(id);
    setViewMode('lesson');
    setActiveTab('learn');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /* ── Tab change handler ──────────────────────────────────────────── */
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    if (tab === 'learn') {
      setViewMode('lesson');
    }
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /* ── Run query in playground ─────────────────────────────────────── */
  const handleRunQueryInStudio = useCallback((sql) => {
    setStudioInitialQuery(sql);
    setActiveTab('playground');
  }, []);

  /* ── Toggle sidebar ──────────────────────────────────────────────── */
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  /* ── Render the active tab's content ─────────────────────────────── */
  const renderContent = () => {
    switch (activeTab) {
      /* ── Learning Journey ──────────────────────────────────────────── */
      case 'roadmap':
        return (
          <RoadmapDiagram
            onSelectTab={handleTabChange}
            onRunQueryInStudio={handleRunQueryInStudio}
          />
        );

      case 'resources':
        return (
          <VideoLearningHub
            onSelectTab={handleTabChange}
            onRunQueryInStudio={handleRunQueryInStudio}
          />
        );

      case 'msdocs':
        return <MicrosoftDocsHub />;

      case 'learn':
        return viewMode === 'lesson' ? (
          <LessonView
            currentLessonId={activeLessonId}
            onSelectLesson={handleSelectLesson}
          />
        ) : (
          <LessonList
            activeLessonId={activeLessonId}
            onSelectLesson={handleSelectLesson}
          />
        );

      /* ── Interactive Labs & Sandbox ────────────────────────────────── */
      case 'playground':
        return <PracticeStudio initialQuery={studioInitialQuery} />;

      case 'query-studio':
        return <QueryStudio />;

      case 'challenges':
        return <ChallengeArena onRunQueryInStudio={handleRunQueryInStudio} />;

      case 'projects':
        return <ProjectBlueprints />;

      case 'architecture':
        return <ArchitectureViewer />;

      case 'migrations':
        return <MigrationSimulator />;

      case 'erd':
        return <ErdExplorer />;

      case 'plan-simulator':
        return <PlanSimulator />;

      case 'quiz':
        return <QuizMaster />;

      /* ── Documentation ────────────────────────────────────────────── */
      case 'docs':
        return <DocsView />;

      case 'docs-case-study':
      case 'docs-perf':
      case 'docs-dr':
      case 'docs-learning':
      case 'docs-syllabus':
        return (
          <DocsViewer
            docKey={activeTab}
            onBack={() => handleTabChange('roadmap')}
          />
        );

      default:
        return (
          <RoadmapDiagram
            onSelectTab={handleTabChange}
            onRunQueryInStudio={handleRunQueryInStudio}
          />
        );
    }
  };

  return (
    <div className="app-shell">
      {/* ── Top Navigation Bar ──────────────────────────────────────── */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        onOpenChatbot={() => setIsChatbotOpen(true)}
        onToggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      {/* ── Layout: Sidebar + Main Content ─────────────────────────── */}
      <div className="app-layout">
        {/* Sidebar Navigation */}
        <Sidebar
          isOpen={isSidebarOpen}
          activeTab={activeTab}
          onSelectTab={handleTabChange}
          onRunQueryInStudio={handleRunQueryInStudio}
        />

        {/* Mobile sidebar overlay */}
        {isSidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main className="app-main-content">
          {renderContent()}
        </main>
      </div>

      {/* ── AI Chatbot Drawer ──────────────────────────────────────── */}
      <div
        className={`ai-drawer-overlay ${isChatbotOpen ? 'open' : ''}`}
        onClick={() => setIsChatbotOpen(false)}
      />
      <AIChatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        onRunInPlayground={(sql) => {
          setStudioInitialQuery(sql);
          setActiveTab('playground');
        }}
        pageContext={{
          activeTab,
          activeLesson: COURSE_VIDEOS.find((v) => v.id === activeLessonId),
          currentQuery: studioInitialQuery,
        }}
      />

      {/* ── Toast Notifications ────────────────────────────────────── */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#e2e8f0',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            fontSize: '13px',
          },
        }}
      />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  APP ROOT                                                            */
/* ──────────────────────────────────────────────────────────────────── */

export default function App() {
  return (
    <DatabaseProvider>
      <ProgressProvider>
        <MainLayout />
      </ProgressProvider>
    </DatabaseProvider>
  );
}
