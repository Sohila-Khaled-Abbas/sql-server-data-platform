import React from 'react';
import Navbar from './components/Navbar.jsx';
import HeroSection from './components/HeroSection.jsx';
import ProjectOverview from './components/ProjectOverview.jsx';
import ArchitectureSection from './components/ArchitectureSection.jsx';
import DatabaseDesign from './components/DatabaseDesign.jsx';
import DataFlowSection from './components/DataFlowSection.jsx';
import SqlEngineeringSection from './components/SqlEngineeringSection.jsx';
import InteractivePlayground from './components/InteractivePlayground.jsx';
import CurriculumSection from './components/CurriculumSection.jsx';
import TechnicalDeepDive from './components/TechnicalDeepDive.jsx';
import ProjectHighlights from './components/ProjectHighlights.jsx';
import RepositoryExplorer from './components/RepositoryExplorer.jsx';
import TechStackSection from './components/TechStackSection.jsx';
import ProjectJourneySection from './components/ProjectJourneySection.jsx';
import GitHubSection from './components/GitHubSection.jsx';
import AboutCreatorSection from './components/AboutCreatorSection.jsx';
import Footer from './components/Footer.jsx';
import ScrollProgressWidget from './components/ScrollProgressWidget.jsx';

import './styles/portfolio.css';

export default function App() {
  return (
    <div className="portfolio-app-root">
      {/* Background Technical Grid Overlay */}
      <div className="grid-overlay" />

      {/* 1. Sticky Navigation */}
      <Navbar />

      {/* 2. Hero Section with Live Data Topology */}
      <HeroSection />

      {/* 3. Project Overview ("What is this project?") */}
      <ProjectOverview />

      {/* 4. Data Platform Architecture */}
      <ArchitectureSection />

      {/* 5. Database Design & Multi-Database Schemas (OmniFlowDW, Company, ITI & DB2 CH01_VID06) */}
      <DatabaseDesign />

      {/* 6. How the Data Flows */}
      <DataFlowSection />

      {/* 7. SQL Engineering Showcase */}
      <SqlEngineeringSection />

      {/* 8. Interactive Live Query Execution Simulator */}
      <InteractivePlayground />

      {/* 9. Curriculum & Obsidian Second Brain (102 Lessons) */}
      <CurriculumSection />

      {/* 10. Technical Deep Dive */}
      <TechnicalDeepDive />

      {/* 10. Project Highlights */}
      <ProjectHighlights />

      {/* 11. Explore the Repository */}
      <RepositoryExplorer />

      {/* 12. Technology Stack */}
      <TechStackSection />

      {/* 13. Project Journey ("From Problem to Platform") */}
      <ProjectJourneySection />

      {/* 14. GitHub CTA Section */}
      <GitHubSection />

      {/* 15. About the Creator */}
      <AboutCreatorSection />

      {/* Footer */}
      <Footer />

      {/* Floating Scroll & Quick Jump Widget */}
      <ScrollProgressWidget />
    </div>
  );
}
