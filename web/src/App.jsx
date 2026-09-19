import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import ErrorBoundary from './components/ErrorBoundary.jsx';
import { DatabaseProvider } from './context/DatabaseContext.jsx';
import { useAppStore } from './store/useAppStore.js';

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
import MicrosoftDocsHub from './components/MicrosoftDocsHub.jsx';
import ChallengeArena from './components/ChallengeArena.jsx';
import ProjectBlueprints from './components/ProjectBlueprints.jsx';
import ArchitectureViewer from './components/ArchitectureViewer.jsx';
import MigrationSimulator from './components/MigrationSimulator.jsx';
import ErdExplorer from './components/ErdExplorer.jsx';
import PlanSimulator from './components/PlanSimulator.jsx';
import QuizMaster from './components/QuizMaster.jsx';
import QueryStudio from './components/QueryStudio.jsx';

import { COURSE_VIDEOS } from './data/videoCatalog.js';

/* ── Map Routes to Active Tabs ──────────────────────────────────────── */
const getActiveTabFromPath = (path) => {
  if (path === '/') return 'roadmap';
  if (path === '/msdocs') return 'msdocs';
  if (path.startsWith('/learn')) return 'learn';
  if (path === '/playground') return 'playground';
  if (path === '/query-studio') return 'query-studio';
  if (path === '/challenges') return 'challenges';
  if (path === '/projects') return 'projects';
  if (path === '/architecture') return 'architecture';
  if (path === '/migrations') return 'migrations';
  if (path === '/erd') return 'erd';
  if (path === '/plan-simulator') return 'plan-simulator';
  if (path === '/quiz') return 'quiz';
  if (path === '/docs') return 'docs';
  if (path.startsWith('/docs/')) {
    const slug = path.replace('/docs/', '');
    return slug.startsWith('docs-') ? slug : `docs-${slug}`;
  }
  return 'roadmap';
};

/* ── Animated Route Wrapper ─────────────────────────────────────────── */
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.25, ease: "easeOut" }}
    style={{ height: '100%' }}
  >
    {children}
  </motion.div>
);

/* ── Docs Route Wrapper Component ───────────────────────────────────── */
function DocsRouteWrapper() {
  const { docId } = useParams();
  const navigate = useNavigate();
  const docKey = docId ? (docId.startsWith('docs-') ? docId : `docs-${docId}`) : 'docs-case-study';
  return (
    <PageTransition>
      <DocsViewer docKey={docKey} onBack={() => navigate('/docs')} />
    </PageTransition>
  );
}

/* ── Main Layout ────────────────────────────────────────────────────── */
function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { 
    isSidebarOpen, 
    toggleSidebar, 
    setSidebarOpen,
    isChatbotOpen,
    setChatbotOpen,
    studioInitialQuery,
    setStudioQuery
  } = useAppStore();

  const activeTab = getActiveTabFromPath(location.pathname);

  // Adapters for legacy prop passing
  const handleTabChange = (tab) => {
    const routeMap = {
      'roadmap': '/',
      'resources': '/learn',
      'msdocs': '/msdocs',
      'learn': '/learn',
      'playground': '/playground',
      'query-studio': '/query-studio',
      'challenges': '/challenges',
      'projects': '/projects',
      'architecture': '/architecture',
      'migrations': '/migrations',
      'erd': '/erd',
      'plan-simulator': '/plan-simulator',
      'quiz': '/quiz',
      'docs': '/docs',
      'docs-case-study': '/docs/case-study',
      'docs-perf': '/docs/perf',
      'docs-dr': '/docs/dr',
      'docs-learning': '/docs/learning',
      'docs-syllabus': '/docs/syllabus'
    };
    navigate(routeMap[tab] || '/');
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRunQueryInStudio = (sql) => {
    setStudioQuery(sql);
    navigate('/playground');
  };

  const handleSelectLesson = (id) => {
    navigate(`/learn/${id}`);
  };

  // Close sidebar on location change for mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location, setSidebarOpen]);

  return (
    <div className="app-shell">
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        onOpenChatbot={() => setChatbotOpen(true)}
        onToggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="app-layout">
        <Sidebar
          isOpen={isSidebarOpen}
          activeTab={activeTab}
          onSelectTab={handleTabChange}
          onRunQueryInStudio={handleRunQueryInStudio}
        />

        {isSidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="app-main-content">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><RoadmapDiagram onSelectTab={handleTabChange} onRunQueryInStudio={handleRunQueryInStudio} /></PageTransition>} />
              <Route path="/msdocs" element={<PageTransition><MicrosoftDocsHub /></PageTransition>} />
              
              <Route path="/learn" element={<PageTransition><LessonList activeLessonId="ch01-vid01" onSelectLesson={handleSelectLesson} /></PageTransition>} />
              <Route path="/learn/:id" element={<PageTransition><LessonView currentLessonId={location.pathname.split('/').pop()} onSelectLesson={handleSelectLesson} /></PageTransition>} />
              
              <Route path="/playground" element={<PageTransition><PracticeStudio initialQuery={studioInitialQuery} /></PageTransition>} />
              <Route path="/query-studio" element={<PageTransition><QueryStudio /></PageTransition>} />
              <Route path="/challenges" element={<PageTransition><ChallengeArena onRunQueryInStudio={handleRunQueryInStudio} /></PageTransition>} />
              <Route path="/projects" element={<PageTransition><ProjectBlueprints /></PageTransition>} />
              <Route path="/architecture" element={<PageTransition><ArchitectureViewer /></PageTransition>} />
              <Route path="/migrations" element={<PageTransition><MigrationSimulator /></PageTransition>} />
              <Route path="/erd" element={<PageTransition><ErdExplorer /></PageTransition>} />
              <Route path="/plan-simulator" element={<PageTransition><PlanSimulator /></PageTransition>} />
              <Route path="/quiz" element={<PageTransition><QuizMaster /></PageTransition>} />
              <Route path="/docs" element={<PageTransition><DocsView /></PageTransition>} />
              <Route path="/docs/:docId" element={<DocsRouteWrapper />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>

      <AIChatbot 
        isOpen={isChatbotOpen} 
        onClose={() => setChatbotOpen(false)} 
        onRunInPlayground={handleRunQueryInStudio}
      />

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

export default function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <DatabaseProvider>
          <MainLayout />
        </DatabaseProvider>
      </HashRouter>
    </ErrorBoundary>
  );
}
