import React, { useState } from 'react';
import { DatabaseProvider } from './context/DatabaseContext.jsx';
import { ProgressProvider } from './context/ProgressContext.jsx';
import Navbar from './components/Navbar.jsx';
import LessonView from './components/LessonView.jsx';
import LessonList from './components/LessonList.jsx';
import PracticeStudio from './components/PracticeStudio.jsx';
import AIChatbot from './components/AIChatbot.jsx';
import { COURSE_VIDEOS } from './data/videoCatalog.js';

function MainLayout() {
  const [activeTab, setActiveTab] = useState('learn');
  const [activeLessonId, setActiveLessonId] = useState('ch01-vid01');
  const [viewMode, setViewMode] = useState('lesson'); // 'lesson' or 'list'
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [studioInitialQuery, setStudioInitialQuery] = useState(null);

  const handleSelectLesson = (id) => {
    setActiveLessonId(id);
    setViewMode('lesson');
    setActiveTab('learn');
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'learn') {
      setViewMode('lesson');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-shell">
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        onOpenChatbot={() => setIsChatbotOpen(true)}
      />

      {/* Learn Tab */}
      {activeTab === 'learn' && viewMode === 'lesson' && (
        <LessonView
          currentLessonId={activeLessonId}
          onSelectLesson={handleSelectLesson}
        />
      )}

      {activeTab === 'learn' && viewMode === 'list' && (
        <LessonList
          activeLessonId={activeLessonId}
          onSelectLesson={handleSelectLesson}
        />
      )}

      {/* Practice Tab */}
      {activeTab === 'playground' && (
        <PracticeStudio initialQuery={studioInitialQuery} />
      )}

      {/* AI Chatbot Drawer */}
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
          activeLesson: COURSE_VIDEOS.find(v => v.id === activeLessonId),
          currentQuery: studioInitialQuery
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <DatabaseProvider>
      <ProgressProvider>
        <MainLayout />
      </ProgressProvider>
    </DatabaseProvider>
  );
}
