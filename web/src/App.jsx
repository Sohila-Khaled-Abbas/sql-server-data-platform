import React, { useState } from 'react';
import { DatabaseProvider } from './context/DatabaseContext.jsx';
import { ProgressProvider } from './context/ProgressContext.jsx';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
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
import { MessageSquare, Bot } from 'lucide-react';

function MainLayout() {
  const [activeTab, setActiveTab] = useState('roadmap');
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
    setSelectedLesson(lesson);
  };

  const handleCloseModal = () => {
    setSelectedLesson(null);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // If user searches from navbar, automatically switch to 25-video hub or docs hub if not already there
    if (query && activeTab !== 'resources' && activeTab !== 'msdocs' && activeTab !== 'playground') {
      setActiveTab('resources');
    }
  };

  return (
    <div className="app-root">
      {/* Header */}
      <Navbar
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        onSearch={handleSearch}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Container */}
      <div className="app-container">
        {/* Sidebar */}
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
          {activeTab === 'roadmap' && (
            <RoadmapDiagram
              onSelectLesson={handleSelectLesson}
              onSelectStage={(stage) => {
                setActiveTab('resources');
              }}
            />
          )}

          {activeTab === 'resources' && (
            <VideoLearningHub
              onSelectLesson={handleSelectLesson}
              onRunSql={handleRunInStudio}
            />
          )}

          {activeTab === 'msdocs' && (
            <MicrosoftDocsHub />
          )}

          {activeTab === 'playground' && (
            <QueryStudio
              initialQuery={studioInitialQuery}
              onClearInitial={() => setStudioInitialQuery(null)}
            />
          )}

          {activeTab === 'challenges' && (
            <ChallengeArena />
          )}

          {activeTab === 'projects' && (
            <ProjectBlueprints onRunInPlayground={handleRunInStudio} />
          )}

          {activeTab === 'architecture' && (
            <ArchitectureViewer onSelectTab={setActiveTab} onRunQueryInStudio={handleRunInStudio} />
          )}

          {activeTab === 'migrations' && (
            <MigrationSimulator />
          )}

          {activeTab === 'erd' && (
            <ErdExplorer onRunInPlayground={handleRunInStudio} />
          )}

          {activeTab === 'plan-simulator' && (
            <PlanSimulator />
          )}

          {activeTab === 'quiz' && (
            <QuizMaster />
          )}

          {activeTab.startsWith('docs-') && (
            <DocsViewer docKey={activeTab} onBack={() => setActiveTab('roadmap')} />
          )}
        </main>
      </div>

      {/* Lesson Inspector Modal (self-manages visibility via activeLessonId) */}
      <LessonModal
        onRunQueryInStudio={handleRunInStudio}
        onSelectTab={setActiveTab}
      />

      {/* Floating AI Chatbot Button */}
      <button
        className="floating-chatbot-btn"
        onClick={() => setIsChatbotOpen(prev => !prev)}
        title="Open DBRE & MaharaTech AI Study Mentor"
      >
        <Bot className="w-5 h-5 text-white" />
        <span className="btn-text">Ask AI Mentor</span>
      </button>

      {/* Slide-out AI Chatbot Drawer */}
      <AIChatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        onRunInPlayground={handleRunInStudio}
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
