import React, { useState } from 'react';
import { DatabaseProvider } from './context/DatabaseContext.jsx';
import { ProgressProvider } from './context/ProgressContext.jsx';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import InteractiveLearningStudio from './components/InteractiveLearningStudio.jsx';
import ChapterSyllabus from './components/ChapterSyllabus.jsx';
import RoadmapDiagram from './components/RoadmapDiagram.jsx';
import VideoLearningHub from './components/VideoLearningHub.jsx';
import QueryStudio from './components/QueryStudio.jsx';
import ChallengeArena from './components/ChallengeArena.jsx';
import MicrosoftDocsHub from './components/MicrosoftDocsHub.jsx';
import ProjectBlueprints from './components/ProjectBlueprints.jsx';
import ErdExplorer from './components/ErdExplorer.jsx';
import PlanSimulator from './components/PlanSimulator.jsx';
import QuizMaster from './components/QuizMaster.jsx';
import DocsViewer from './components/DocsViewer.jsx';
import LessonModal from './components/LessonModal.jsx';
import AIChatbot from './components/AIChatbot.jsx';
import ArchitectureViewer from './components/ArchitectureViewer.jsx';
import MigrationSimulator from './components/MigrationSimulator.jsx';
import { Bot } from 'lucide-react';
import { COURSE_VIDEOS } from './data/videoCatalog.js';

function MainLayout() {
  // Flagship interactive learning mode is the primary view
  const [activeTab, setActiveTab] = useState('learn');
  const [activeLessonId, setActiveLessonId] = useState('ch01-vid01');
  const [isSyllabusOpen, setIsSyllabusOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [studioInitialQuery, setStudioInitialQuery] = useState(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRunInStudio = (sql) => {
    setStudioInitialQuery(sql);
    setActiveTab('playground');
  };

  const handleSelectLesson = (lesson) => {
    const id = typeof lesson === 'string' ? lesson : lesson?.id;
    if (id) {
      setActiveLessonId(id);
      setActiveTab('learn');
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      // Find matching lesson
      const q = query.toLowerCase().trim();
      const match = COURSE_VIDEOS.find(v => 
        v.title.toLowerCase().includes(q) || 
        v.videoCode.toLowerCase().includes(q) ||
        v.skillsConnected.some(s => s.toLowerCase().includes(q))
      );
      if (match) {
        setActiveLessonId(match.id);
        setActiveTab('learn');
      }
    }
  };

  return (
    <div className="app-root modern-root">
      {/* Header */}
      <Navbar
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        onSearch={handleSearch}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenChatbot={() => setIsChatbotOpen(true)}
        onOpenSyllabus={() => setIsSyllabusOpen(true)}
      />

      {/* Main Container */}
      <div className="app-container">
        {/* Sidebar (secondary deep-dive tools) */}
        <Sidebar
          isOpen={sidebarOpen}
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setSidebarOpen(false);
          }}
          onRunQueryInStudio={handleRunInStudio}
        />

        {/* Content View Stage */}
        <main className="app-main-content">
          {/* 1. Flagship Guided Interactive Learning Studio */}
          {activeTab === 'learn' && (
            <InteractiveLearningStudio
              currentLessonId={activeLessonId}
              onSelectLesson={(id) => setActiveLessonId(id)}
              onOpenSyllabus={() => setIsSyllabusOpen(true)}
              onOpenChatbot={() => setIsChatbotOpen(true)}
            />
          )}

          {/* 2. Concept Architecture Roadmap */}
          {activeTab === 'roadmap' && (
            <RoadmapDiagram
              onSelectLesson={handleSelectLesson}
              onSelectStage={(stage) => {
                setActiveTab('learn');
              }}
            />
          )}

          {/* 3. Catalog Hub (Legacy optional view) */}
          {activeTab === 'resources' && (
            <VideoLearningHub
              onSelectLesson={handleSelectLesson}
              onRunSql={handleRunInStudio}
            />
          )}

          {/* 4. Microsoft Learn Docs Hub */}
          {activeTab === 'msdocs' && (
            <MicrosoftDocsHub />
          )}

          {/* 5. Free-form Query Studio */}
          {activeTab === 'playground' && (
            <QueryStudio
              initialQuery={studioInitialQuery}
              onClearInitial={() => setStudioInitialQuery(null)}
            />
          )}

          {/* 6. Challenge Arena */}
          {activeTab === 'challenges' && (
            <ChallengeArena />
          )}

          {/* 7. Enterprise Blueprints */}
          {activeTab === 'projects' && (
            <ProjectBlueprints onRunInPlayground={handleRunInStudio} />
          )}

          {/* 8. Architecture & Schema Inspector */}
          {activeTab === 'architecture' && (
            <ArchitectureViewer onSelectTab={setActiveTab} onRunQueryInStudio={handleRunInStudio} />
          )}

          {/* 9. Migrations Simulator */}
          {activeTab === 'migrations' && (
            <MigrationSimulator />
          )}

          {/* 10. Peter Chen ERD Explorer */}
          {activeTab === 'erd' && (
            <ErdExplorer onRunInPlayground={handleRunInStudio} />
          )}

          {/* 11. Execution Plan Simulator */}
          {activeTab === 'plan-simulator' && (
            <PlanSimulator />
          )}

          {/* 12. DBRE Quiz Master */}
          {activeTab === 'quiz' && (
            <QuizMaster />
          )}

          {/* 13. Markdown Documentation Viewer */}
          {activeTab.startsWith('docs-') && (
            <DocsViewer docKey={activeTab} onBack={() => setActiveTab('learn')} />
          )}
        </main>
      </div>

      {/* Curriculum Syllabus Drawer */}
      <ChapterSyllabus
        isOpen={isSyllabusOpen}
        onClose={() => setIsSyllabusOpen(false)}
        activeLessonId={activeLessonId}
        onSelectLesson={(id) => {
          setActiveLessonId(id);
          setActiveTab('learn');
        }}
      />

      {/* Lesson Inspector Modal (self-manages visibility via activeLessonId) */}
      <LessonModal
        onRunQueryInStudio={handleRunInStudio}
        onSelectTab={setActiveTab}
      />

      {/* Floating AI Chatbot Button (Hidden when drawer is open) */}
      {!isChatbotOpen && (
        <button
          className="floating-chatbot-btn"
          onClick={() => setIsChatbotOpen(true)}
          title="Open DBRE & MaharaTech AI Study Mentor"
        >
          <Bot className="w-5 h-5 text-white" />
          <span className="btn-text">Ask AI Mentor</span>
          <span className="pulse-ping" />
        </button>
      )}

      {/* Slide-out AI Chatbot Drawer */}
      <AIChatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        onRunInPlayground={handleRunInStudio}
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
