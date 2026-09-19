import React from 'react';
import Navbar from './components/Navbar.jsx';
import HeroSection from './components/HeroSection.jsx';
import ProjectOverview from './components/ProjectOverview.jsx';
import ArchitectureSection from './components/ArchitectureSection.jsx';
import RepositoryExplorer from './components/RepositoryExplorer.jsx';
import DatabaseDesign from './components/DatabaseDesign.jsx';
import DataFlowSection from './components/DataFlowSection.jsx';
import SqlEngineeringSection from './components/SqlEngineeringSection.jsx';
import TechnicalDeepDive from './components/TechnicalDeepDive.jsx';
import ProjectHighlights from './components/ProjectHighlights.jsx';
import TechStackSection from './components/TechStackSection.jsx';
import ProjectJourneySection from './components/ProjectJourneySection.jsx';
import GitHubSection from './components/GitHubSection.jsx';
import AboutCreatorSection from './components/AboutCreatorSection.jsx';
import Footer from './components/Footer.jsx';

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

      {/* 5. Explore the Repository */}
      <RepositoryExplorer />

      {/* 6. Database Design & Schemas */}
      <DatabaseDesign />

      {/* 7. How the Data Flows */}
      <DataFlowSection />

      {/* 8. SQL Engineering Showcase */}
      <SqlEngineeringSection />

      {/* 9. Technical Deep Dive */}
      <TechnicalDeepDive />

      {/* 10. Project Highlights */}
      <ProjectHighlights />

      {/* 11. Technology Stack */}
      <TechStackSection />

      {/* 12. Project Journey ("From Problem to Platform") */}
      <ProjectJourneySection />

      {/* 13. GitHub CTA Section */}
      <GitHubSection />

      {/* 14. About the Creator */}
      <AboutCreatorSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
