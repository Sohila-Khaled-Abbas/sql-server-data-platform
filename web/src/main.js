import './style.css';
import { initDatabase, PRESET_QUERIES } from './db/engine.js';
import { setupQueryPlayground } from './components/query-playground.js';
import { setupErdExplorer } from './components/erd-explorer.js';
import { setupPlanSimulator } from './components/plan-simulator.js';
import { setupQuizMaster } from './components/quiz-master.js';
import { setupLearningResources } from './components/learning-resources.js';
import { setupDocsViewer } from './components/docs-viewer.js';
import { setupChallengesArena } from './components/sql-challenges.js';
import { setupProjectBlueprints } from './components/project-blueprints.js';
import { setupChatbot } from './components/db-chatbot.js';
import { setupLearningRoadmap } from './components/learning-roadmap.js';
import { setupLessonModal } from './components/lesson-modal.js';

document.addEventListener('DOMContentLoaded', async () => {
  const engineStatusText = document.getElementById('engineStatusText');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const appSidebar = document.getElementById('appSidebar');
  const navItems = document.querySelectorAll('.nav-item');
  const searchInput = document.getElementById('globalSearchInput');
  const chatbotDrawer = document.getElementById('chatbotDrawer');

  // Mobile sidebar toggle
  if (sidebarToggle && appSidebar) {
    sidebarToggle.addEventListener('click', () => {
      appSidebar.classList.toggle('open');
    });
  }

  // Global keyboard shortcuts: '/' to search, 'Esc' to close drawers/modals
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      if (searchInput) searchInput.focus();
    } else if (e.key === 'Escape') {
      if (chatbotDrawer) chatbotDrawer.classList.remove('open');
      if (appSidebar) appSidebar.classList.remove('open');
    }
  });

  // Search input handler
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const term = searchInput.value.toLowerCase().trim();
      if (!term) return;

      // Quick keyword routing
      if (term.includes('roadmap') || term.includes('stage') || term.includes('curriculum')) {
        switchTab('roadmap');
      } else if (term.includes('challenge') || term.includes('problem') || term.includes('leetcode')) {
        switchTab('challenges');
      } else if (term.includes('project') || term.includes('blueprint') || term.includes('alpha') || term.includes('tvp')) {
        switchTab('projects');
      } else if (term.includes('erd') || term.includes('chen') || term.includes('company') || term.includes('emp')) {
        switchTab('erd');
      } else if (term.includes('plan') || term.includes('index') || term.includes('lookup') || term.includes('tipping')) {
        switchTab('plan-simulator');
      } else if (term.includes('quiz') || term.includes('test') || term.includes('question')) {
        switchTab('quiz');
      } else if (term.includes('video') || term.includes('cheatsheet') || term.includes('dmv') || term.includes('resource') || term.includes('lesson')) {
        switchTab('resources');
      } else if (term.includes('perf') || term.includes('join')) {
        switchTab('docs-perf');
      } else if (term.includes('dr') || term.includes('backup') || term.includes('snapshot') || term.includes('stopat')) {
        switchTab('docs-dr');
      } else if (term.includes('query') || term.includes('sql') || term.includes('select')) {
        switchTab('playground');
      }
    });
  }

  // Tab switching logic
  function switchTab(tabId) {
    navItems.forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Close mobile sidebar if open
    if (appSidebar) appSidebar.classList.remove('open');

    // Handle docs tabs vs interactive lab tabs
    if (tabId.startsWith('docs-')) {
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      const docsViewerSection = document.getElementById('tab-docs-viewer');
      if (docsViewerSection) {
        docsViewerSection.classList.add('active');
        setupDocsViewer(tabId);
      }
    } else {
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      const targetSection = document.getElementById(`tab-${tabId}`);
      if (targetSection) targetSection.classList.add('active');
    }
  }

  navItems.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  // Switch to playground and run custom SQL string (e.g. from Chatbot, Lessons, or Projects)
  function runCustomQueryInPlayground(sqlText) {
    switchTab('playground');
    const sqlInput = document.getElementById('sqlInput');
    const runBtn = document.getElementById('runQueryBtn');

    if (sqlInput && sqlText) {
      sqlInput.value = sqlText;
      if (runBtn) runBtn.click();
    }
  }

  // Switch to playground and set preset query from ERD Explorer
  function switchTabAndSetQuery(presetKey) {
    switchTab('playground');
    const select = document.getElementById('queryPresetSelect');
    const sqlInput = document.getElementById('sqlInput');
    const runBtn = document.getElementById('runQueryBtn');

    if (select && PRESET_QUERIES[presetKey]) {
      select.value = presetKey;
      sqlInput.value = PRESET_QUERIES[presetKey];
      if (runBtn) runBtn.click();
    }
  }

  // 1. Initialize Labs, Roadmap, Hub & Resources
  setupLessonModal({
    onRunQueryInPlayground: runCustomQueryInPlayground,
    onSwitchTab: switchTab
  });

  setupLearningRoadmap(
    (videoId) => {
      if (window.openLessonModal) window.openLessonModal(videoId);
    },
    switchTab
  );

  setupLearningResources({
    onRunQueryInPlayground: runCustomQueryInPlayground,
    onSwitchTab: switchTab
  });

  setupErdExplorer(switchTabAndSetQuery);
  setupPlanSimulator();
  setupQuizMaster();
  setupChallengesArena();
  setupProjectBlueprints(runCustomQueryInPlayground);
  setupChatbot(runCustomQueryInPlayground);

  // 2. Initialize in-browser WASM Database Engine
  try {
    await initDatabase((status) => {
      if (engineStatusText) {
        engineStatusText.textContent = status;
        if (status.includes('Online')) {
          engineStatusText.parentElement.style.color = 'var(--accent-emerald)';
        }
      }
    });

    setupQueryPlayground();
  } catch (err) {
    if (engineStatusText) {
      engineStatusText.textContent = 'Engine Offline (WASM fallback)';
      engineStatusText.parentElement.style.color = '#f43f5e';
    }
    console.error('SQL Engine init error:', err);
    // Still initialize playground so UI is responsive
    setupQueryPlayground();
  }
});
