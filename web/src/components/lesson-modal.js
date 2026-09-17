/**
 * Interactive Lesson Inspector Modal
 * Deep-dive pedagogical view for MaharaTech Course 2305 video lectures.
 * Provides lecture breakdowns, runnable T-SQL code, student notes scratchpad, and attachment management.
 */

import { COURSE_VIDEOS, COURSE_METADATA } from './video-catalog.js';
import { getWatchedVideos, toggleVideoWatched, saveStudentAttachment, getStudentAttachments } from './learning-roadmap.js';

export function setupLessonModal(callbacks = {}) {
  const { onRunQueryInPlayground, onSwitchTab } = callbacks;

  const modalOverlay = document.getElementById('lessonModalOverlay');
  if (!modalOverlay) return;

  const modalCloseBtn = document.getElementById('lessonModalCloseBtn');
  const modalContent = document.getElementById('lessonModalBody');

  // Close handlers
  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Open modal for a specific video ID
  window.openLessonModal = function (videoId) {
    const video = COURSE_VIDEOS.find(v => v.id === videoId);
    if (!video || !modalContent) return;

    renderModalContent(video);
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  function renderModalContent(video) {
    const watched = getWatchedVideos();
    const isWatched = watched.includes(video.id);
    const userNotes = localStorage.getItem(`omniflow_notes_${video.id}`) || '';
    const allUserAttachments = getStudentAttachments();
    const lessonUserAttachments = allUserAttachments.filter(a => a.category === video.videoCode || a.category === `Chapter ${video.chapter}`);

    modalContent.innerHTML = `
      <div class="lesson-modal-header">
        <div class="header-top-row">
          <div class="lesson-code-group">
            <span class="badge badge-purple">${video.videoCode}</span>
            <span class="badge badge-cyan">${video.chapterTitle}</span>
            <span class="badge badge-emerald">${video.level}</span>
          </div>
          <div class="header-actions-group">
            <button id="toggleWatchedBtn" class="btn btn-sm ${isWatched ? 'btn-primary' : 'btn-secondary'}">
              ${isWatched ? 'Mastered ✅' : 'Mark as Mastered ⚪'}
            </button>
            <a href="${video.maharatechUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-cyan">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              <span>Watch on MaharaTech ↗️</span>
            </a>
          </div>
        </div>

        <h2 class="modal-lecture-title">${video.title}</h2>
        <div class="modal-lecture-meta">
          <span>⏱️ <strong>Duration:</strong> ${video.duration}</span>
          <span>👨‍🏫 <strong>Instructor:</strong> ${COURSE_METADATA.instructor} (ITI)</span>
          <span>📂 <strong>Repository Script:</strong> <code>${video.repoPath}</code></span>
        </div>

        <!-- Modal Nav Tabs -->
        <div class="modal-tab-nav">
          <button class="modal-tab-btn active" data-tab="overview">📖 Lesson Deep-Dive</button>
          <button class="modal-tab-btn" data-tab="code">⚡ Runnable T-SQL Sandbox</button>
          <button class="modal-tab-btn" data-tab="attachments">📎 Course Attachments (${(video.attachments?.length || 0) + lessonUserAttachments.length})</button>
          <button class="modal-tab-btn" data-tab="notes">📝 Student Study Notes</button>
        </div>
      </div>

      <div class="lesson-modal-views">
        <!-- Tab 1: Overview & Objectives -->
        <div class="modal-view-panel active" id="modalView-overview">
          <div class="lesson-section">
            <h4 class="section-heading">Architectural Overview</h4>
            <p class="lesson-desc-text">${video.description}</p>
          </div>

          <div class="lesson-section">
            <h4 class="section-heading">Key Learning Objectives</h4>
            <ul class="lesson-objectives-list">
              ${video.objectives.map(o => `<li>${o}</li>`).join('')}
            </ul>
          </div>

          <div class="lesson-section">
            <h4 class="section-heading">Connected Engineering Disciplines</h4>
            <div class="lesson-skills-row">
              ${video.skillsConnected.map(s => `<span class="badge badge-purple">${s}</span>`).join('')}
            </div>
          </div>

          <!-- Connected Labs Callout Box -->
          <div class="connected-labs-card">
            <h4 class="card-subtitle">🚀 Hands-On Practice Across OmniFlow:</h4>
            <div class="labs-action-row">
              <button id="modalRunInPlaygroundBtn" class="btn btn-primary btn-sm">
                <span>Run Demonstration Query ⚡</span>
              </button>
              ${video.challengeId ? `
                <button id="modalJumpChallengeBtn" class="btn btn-secondary btn-sm">
                  <span>Solve in Challenge Arena 🏆</span>
                </button>
              ` : ''}
              ${video.erdEntity ? `
                <button id="modalJumpErdBtn" class="btn btn-secondary btn-sm">
                  <span>Inspect in Chen ERD (${video.erdEntity}) 🏢</span>
                </button>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- Tab 2: Runnable Code Sandbox -->
        <div class="modal-view-panel" id="modalView-code">
          <div class="code-view-header">
            <div>
              <span class="badge badge-green">T-SQL Script Sample</span>
              <span class="file-path-hint">${video.repoPath}</span>
            </div>
            <button id="copyCodeBtn" class="btn btn-sm btn-ghost">📋 Copy Code</button>
          </div>

          <pre class="modal-code-block"><code>${video.sampleSql}</code></pre>

          <div class="code-actions-bar">
            <p class="code-note">This script can be executed instantly in our in-memory WASM database engine with zero setup.</p>
            <button id="modalExecutePlaygroundBtn" class="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              <span>Run in Playground 🚀</span>
            </button>
          </div>
        </div>

        <!-- Tab 3: Attachments & Resources -->
        <div class="modal-view-panel" id="modalView-attachments">
          <div class="attachments-list-pane">
            <div class="section-heading-row">
              <h4 class="section-heading">Official Course & Repository Artifacts</h4>
              <button id="addLessonAttachmentBtn" class="btn btn-sm btn-secondary">+ Add Attachment</button>
            </div>

            <div class="attachments-items-list">
              ${(video.attachments || []).map(att => `
                <div class="attachment-row">
                  <span class="att-type-badge ${att.type.toLowerCase()}">${att.type}</span>
                  <div class="att-details">
                    <div class="att-name">${att.name}</div>
                    <div class="att-path"><code>${att.path}</code></div>
                  </div>
                  <button class="btn btn-sm btn-ghost open-att-file" data-path="${att.path}">View in Platform</button>
                </div>
              `).join('')}

              ${lessonUserAttachments.map(att => `
                <div class="attachment-row user-row">
                  <span class="att-type-badge user">STUDENT</span>
                  <div class="att-details">
                    <div class="att-name">${att.title}</div>
                    <div class="att-path">${att.notes || 'Personal study artifact'}</div>
                  </div>
                  ${att.url ? `<a href="${att.url}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-ghost">Open Link ↗️</a>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Tab 4: Student Study Notes Scratchpad -->
        <div class="modal-view-panel" id="modalView-notes">
          <div class="notes-header-row">
            <div>
              <h4 class="section-heading">Your Personal Study Scratchpad</h4>
              <p class="notes-sub">Write notes, lecture key takeaways, or syntax reminders. Notes auto-save to browser storage.</p>
            </div>
            <div class="notes-status-badge" id="notesSaveStatus">Saved automatically ✅</div>
          </div>

          <textarea id="lessonNotesInput" class="study-notes-textarea" placeholder="Type your personal lecture notes here for ${video.videoCode}...">${userNotes}</textarea>

          <div class="notes-actions-row">
            <button id="exportNotesBtn" class="btn btn-sm btn-secondary">💾 Download Notes (.md)</button>
            <button id="clearNotesBtn" class="btn btn-sm btn-ghost">Clear Notes</button>
          </div>
        </div>
      </div>
    `;

    // Tab Switching inside Modal
    const tabBtns = modalContent.querySelectorAll('.modal-tab-btn');
    const tabPanels = modalContent.querySelectorAll('.modal-view-panel');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const panel = modalContent.querySelector(`#modalView-${target}`);
        if (panel) panel.classList.add('active');
      });
    });

    // 1. Toggle watched
    const toggleBtn = modalContent.querySelector('#toggleWatchedBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const updatedWatched = toggleVideoWatched(video.id);
        const watchedNow = updatedWatched.includes(video.id);
        toggleBtn.textContent = watchedNow ? 'Mastered ✅' : 'Mark as Mastered ⚪';
        toggleBtn.className = `btn btn-sm ${watchedNow ? 'btn-primary' : 'btn-secondary'}`;
        // Trigger global progress update
        window.dispatchEvent(new CustomEvent('omniflow:progress-updated'));
      });
    }

    // 2. Run in playground buttons
    const triggerPlayground = () => {
      closeModal();
      if (onRunQueryInPlayground) {
        onRunQueryInPlayground(video.sampleSql);
      }
    };

    const runBtn1 = modalContent.querySelector('#modalRunInPlaygroundBtn');
    const runBtn2 = modalContent.querySelector('#modalExecutePlaygroundBtn');
    if (runBtn1) runBtn1.addEventListener('click', triggerPlayground);
    if (runBtn2) runBtn2.addEventListener('click', triggerPlayground);

    // 3. Jump to challenge
    const jumpChallengeBtn = modalContent.querySelector('#modalJumpChallengeBtn');
    if (jumpChallengeBtn && onSwitchTab) {
      jumpChallengeBtn.addEventListener('click', () => {
        closeModal();
        onSwitchTab('challenges');
      });
    }

    // 4. Jump to ERD
    const jumpErdBtn = modalContent.querySelector('#modalJumpErdBtn');
    if (jumpErdBtn && onSwitchTab) {
      jumpErdBtn.addEventListener('click', () => {
        closeModal();
        onSwitchTab('erd');
      });
    }

    // 5. Copy Code button
    const copyBtn = modalContent.querySelector('#copyCodeBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(video.sampleSql);
          copyBtn.textContent = 'Copied! ✅';
          setTimeout(() => { copyBtn.textContent = '📋 Copy Code'; }, 2000);
        } catch (e) {
          copyBtn.textContent = 'Failed to copy';
        }
      });
    }

    // 6. Notes Auto-save
    const notesInput = modalContent.querySelector('#lessonNotesInput');
    const saveStatus = modalContent.querySelector('#notesSaveStatus');
    if (notesInput) {
      notesInput.addEventListener('input', () => {
        localStorage.setItem(`omniflow_notes_${video.id}`, notesInput.value);
        if (saveStatus) {
          saveStatus.textContent = 'Saving...';
          setTimeout(() => { saveStatus.textContent = 'Saved automatically ✅'; }, 500);
        }
      });
    }

    // 7. Download Notes
    const exportNotesBtn = modalContent.querySelector('#exportNotesBtn');
    if (exportNotesBtn && notesInput) {
      exportNotesBtn.addEventListener('click', () => {
        const text = `# Study Notes: ${video.videoCode} - ${video.title}\n\n${notesInput.value}`;
        const blob = new Blob([text], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${video.videoCode}_Study_Notes.md`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    // 8. Clear Notes
    const clearNotesBtn = modalContent.querySelector('#clearNotesBtn');
    if (clearNotesBtn && notesInput) {
      clearNotesBtn.addEventListener('click', () => {
        if (confirm('Clear personal notes for this lesson?')) {
          notesInput.value = '';
          localStorage.removeItem(`omniflow_notes_${video.id}`);
          if (saveStatus) saveStatus.textContent = 'Notes cleared';
        }
      });
    }

    // 9. Add Attachment to this specific lesson
    const addLessonAttBtn = modalContent.querySelector('#addLessonAttachmentBtn');
    if (addLessonAttBtn) {
      addLessonAttBtn.addEventListener('click', () => {
        const title = prompt(`Enter Attachment Title for ${video.videoCode}:`);
        if (!title) return;
        const notes = prompt("Enter Description / Notes for this attachment:") || "";
        const url = prompt("Optional External URL / File Link (leave blank if none):") || "";

        saveStudentAttachment({
          title,
          category: video.videoCode,
          notes,
          url
        });

        renderModalContent(video);
      });
    }

    // 10. Open attachment file in doc viewer
    modalContent.querySelectorAll('.open-att-file').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = btn.getAttribute('data-path');
        closeModal();
        if (p.includes('CASE_STUDY')) onSwitchTab('docs-case-study');
        else if (p.includes('PERFORMANCE')) onSwitchTab('docs-perf');
        else if (p.includes('DISASTER')) onSwitchTab('docs-dr');
        else if (p.includes('ACID')) onSwitchTab('docs-learning');
        else onSwitchTab('docs-syllabus');
      });
    });
  }
}
