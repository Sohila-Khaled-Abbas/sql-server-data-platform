/**
 * Interactive Video Learning Hub & DBRE Engineering Cheatsheets
 * Connects directly to MaharaTech Course 2305 (Eng. Rami Mohamed Abonagi, ITI)
 * Features chapter filtering, real-time search, watch tracking, and 1-click lab execution.
 */

import { COURSE_VIDEOS, COURSE_METADATA } from './video-catalog.js';
import { getWatchedVideos, toggleVideoWatched } from './learning-roadmap.js';

export function setupLearningResources(callbacks = {}) {
  const { onRunQueryInPlayground, onSwitchTab } = callbacks;
  const container = document.getElementById('learningResourcesContainer');
  if (!container) return;

  let activeChapterFilter = 'all';
  let searchTerm = '';

  function render() {
    const watched = getWatchedVideos();
    const totalCount = COURSE_VIDEOS.length;
    const watchedCount = watched.length;
    const progressPercent = Math.round((watchedCount / totalCount) * 100);

    // Filter videos
    const filteredVideos = COURSE_VIDEOS.filter(video => {
      const matchesChapter = activeChapterFilter === 'all' || video.chapter === Number(activeChapterFilter);
      const matchesSearch = !searchTerm || 
        video.title.toLowerCase().includes(searchTerm) ||
        video.videoCode.toLowerCase().includes(searchTerm) ||
        video.description.toLowerCase().includes(searchTerm) ||
        video.skillsConnected.some(s => s.toLowerCase().includes(searchTerm));
      return matchesChapter && matchesSearch;
    });

    container.innerHTML = `
      <!-- Top Hero Banner -->
      <div class="resources-hero card">
        <div class="hero-content">
          <div class="hero-tag-row">
            <span class="badge badge-purple">${COURSE_METADATA.institution}</span>
            <span class="badge badge-cyan">Course ${COURSE_METADATA.courseId}</span>
            <span class="badge badge-emerald">25 Video Lectures</span>
          </div>
          <h1 class="hero-title">${COURSE_METADATA.courseTitle}</h1>
          <p class="hero-desc">
            Instructor: <strong>${COURSE_METADATA.instructor}</strong>. Official course video curriculum mapped directly to in-browser SQL execution, Peter Chen ERD modeling, and production DBRE performance tuning.
          </p>

          <!-- Real-Time Watch Progress Meter -->
          <div class="video-progress-dashboard">
            <div class="progress-info-row">
              <div class="progress-stat">
                <span class="stat-number">${watchedCount} / ${totalCount}</span>
                <span class="stat-label">Videos Mastered</span>
              </div>
              <div class="progress-stat">
                <span class="stat-number">${progressPercent}%</span>
                <span class="stat-label">Curriculum Completed</span>
              </div>
              <div class="progress-stat">
                <span class="stat-number">${watchedCount * 50} XP</span>
                <span class="stat-label">Platform Mastery</span>
              </div>
            </div>
            <div class="progress-bar-track">
              <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
            </div>
          </div>
        </div>

        <div class="hero-actions">
          <a href="${COURSE_METADATA.portalUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            <span>Open MaharaTech Portal</span>
          </a>
          <button id="viewRoadmapFromHubBtn" class="btn btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
            <span>View Learning Roadmap 🗺️</span>
          </button>
        </div>
      </div>

      <!-- Filter Controls & Search Bar -->
      <div class="hub-controls-bar card">
        <div class="chapter-filter-pills">
          <button class="filter-pill ${activeChapterFilter === 'all' ? 'active' : ''}" data-chapter="all">All (${totalCount})</button>
          <button class="filter-pill ${activeChapterFilter === '1' ? 'active' : ''}" data-chapter="1">Ch 1: Storage & Schemas (5)</button>
          <button class="filter-pill ${activeChapterFilter === '2' ? 'active' : ''}" data-chapter="2">Ch 2: T-SQL & Concurrency (6)</button>
          <button class="filter-pill ${activeChapterFilter === '3' ? 'active' : ''}" data-chapter="3">Ch 3: Scalability & Partitioning (5)</button>
          <button class="filter-pill ${activeChapterFilter === '4' ? 'active' : ''}" data-chapter="4">Ch 4: Automation & Triggers (5)</button>
          <button class="filter-pill ${activeChapterFilter === '5' ? 'active' : ''}" data-chapter="5">Ch 5: Warehousing & BI (4)</button>
        </div>

        <div class="hub-search-wrapper">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" id="hubVideoSearch" placeholder="Search by topic, skill, or code (e.g. partition, TVP, trigger, ERD)..." value="${searchTerm}" />
          ${searchTerm ? `<button id="clearHubSearchBtn" class="btn-clear-search">✕</button>` : ''}
        </div>
      </div>

      <!-- Video Grid -->
      <div class="video-cards-grid">
        ${filteredVideos.length === 0 ? `
          <div class="empty-video-state card">
            <div class="empty-icon">🔍</div>
            <h3>No video lectures found matching "${searchTerm}"</h3>
            <p>Try searching for broader keywords like <em>storage</em>, <em>ACID</em>, <em>partition</em>, <em>trigger</em>, or <em>Kimball</em>.</p>
            <button id="resetSearchBtn" class="btn btn-secondary btn-sm">Reset Filters</button>
          </div>
        ` : filteredVideos.map(video => {
          const isWatched = watched.includes(video.id);
          return `
            <div class="video-lecture-card card ${isWatched ? 'card-watched' : ''}" data-video-id="${video.id}">
              <div class="video-card-header">
                <div class="video-badge-row">
                  <span class="badge badge-purple">${video.videoCode}</span>
                  <span class="badge badge-cyan">Ch ${video.chapter}</span>
                  <span class="badge badge-emerald">${video.level}</span>
                </div>
                <button class="watch-status-toggle" data-video-id="${video.id}" title="${isWatched ? 'Mark as unwatched' : 'Mark as mastered'}">
                  ${isWatched ? '✅ Mastered' : '⚪ Unwatched'}
                </button>
              </div>

              <h3 class="video-card-title">${video.title}</h3>
              <p class="video-card-desc">${video.description}</p>

              <div class="video-skills-tags">
                ${video.skillsConnected.map(s => `<span class="skill-tag">${s}</span>`).join('')}
              </div>

              <div class="video-card-footer">
                <div class="video-duration">⏱️ ${video.duration}</div>
                <div class="video-action-buttons">
                  <button class="btn btn-sm btn-primary inspect-btn" data-video-id="${video.id}">
                    Study Lesson 📖
                  </button>
                  <button class="btn btn-sm btn-ghost run-query-btn" data-video-id="${video.id}" title="Run demonstration in Playground">
                    Run Code ⚡
                  </button>
                  <a href="${video.maharatechUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-ghost maharatech-link" title="Open on MaharaTech">
                    Portal ↗️
                  </a>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Bottom Interactive DBRE Cheatsheets Section -->
      <div class="cheatsheets-section">
        <div class="section-title-row">
          <h2>⚡ High-Value DBRE Reference Cheatsheets</h2>
          <span class="badge badge-cyan">Instant Diagnostics</span>
        </div>

        <div class="cheatsheets-grid">
          <!-- Cheatsheet 1: Concurrency Isolation Levels Matrix -->
          <div class="cheatsheet-card card">
            <h3 class="card-title">ACID Transaction Isolation Levels Matrix</h3>
            <p class="card-summary">Preventing data corruption and concurrency anomalies across SQL Server transactions:</p>
            <table class="cheatsheet-table">
              <thead>
                <tr>
                  <th>Isolation Level</th>
                  <th>Dirty Read</th>
                  <th>Non-Repeatable</th>
                  <th>Phantom Read</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Read Uncommitted</strong> (NOLOCK)</td>
                  <td class="danger">Allowed ❌</td>
                  <td class="danger">Allowed ❌</td>
                  <td class="danger">Allowed ❌</td>
                </tr>
                <tr>
                  <td><strong>Read Committed</strong> (Default)</td>
                  <td class="success">Prevented ✅</td>
                  <td class="danger">Allowed ❌</td>
                  <td class="danger">Allowed ❌</td>
                </tr>
                <tr>
                  <td><strong>Repeatable Read</strong></td>
                  <td class="success">Prevented ✅</td>
                  <td class="success">Prevented ✅</td>
                  <td class="danger">Allowed ❌</td>
                </tr>
                <tr>
                  <td><strong>Serializable</strong> (Key Range)</td>
                  <td class="success">Prevented ✅</td>
                  <td class="success">Prevented ✅</td>
                  <td class="success">Prevented ✅</td>
                </tr>
                <tr>
                  <td><strong>Snapshot (RCSI)</strong></td>
                  <td class="success">Prevented ✅</td>
                  <td class="success">Prevented ✅</td>
                  <td class="success">Prevented ✅</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Cheatsheet 2: Top Production Diagnostic DMVs -->
          <div class="cheatsheet-card card">
            <h3 class="card-title">Top Production Diagnostic DMVs</h3>
            <p class="card-summary">Essential Dynamic Management Views for database performance telemetry:</p>
            <div class="dmv-list">
              <div class="dmv-item">
                <code>sys.dm_exec_query_stats</code>
                <span>Top queries ranked by CPU time, logical I/O reads, and execution counts.</span>
              </div>
              <div class="dmv-item">
                <code>sys.dm_os_wait_stats</code>
                <span>Server-wide resource bottleneck diagnosis (PAGEIOLATCH_SH, CXPACKET, LCK_M_X).</span>
              </div>
              <div class="dmv-item">
                <code>sys.dm_db_index_physical_stats</code>
                <span>Index fragmentation percentage, page count, and leaf allocation density.</span>
              </div>
              <div class="dmv-item">
                <code>sys.dm_db_index_usage_stats</code>
                <span>Index seek vs scan activity (identifies costly unused indexes consuming write I/O).</span>
              </div>
              <div class="dmv-item">
                <code>sys.dm_tran_locks</code>
                <span>Active lock allocations, lock escalation flags, and deadlock analysis.</span>
              </div>
            </div>
          </div>

          <!-- Cheatsheet 3: Physical Storage Engine Math -->
          <div class="cheatsheet-card card">
            <h3 class="card-title">Storage Engine Math & Page Geometry</h3>
            <ul class="storage-math-list">
              <li><strong>Page Size</strong>: <code>8,192 bytes</code> (8 KB). 96 bytes page header, 8,060 bytes usable row data, 36 bytes slot offset array.</li>
              <li><strong>Extent Size</strong>: <code>64 KB</code> (8 physically contiguous 8 KB pages). Uniform extents belong to a single database object.</li>
              <li><strong>Rows Per Page Formula</strong>: <code>Floor(8060 / (RowSizeInBytes + 2))</code>.</li>
              <li><strong>Fill Factor Strategy</strong>: <code>FILLFACTOR = 85</code> reserves 15% headroom on index leaf pages to prevent expensive page splits.</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    // Event Bindings
    // 1. Chapter filter pills
    container.querySelectorAll('.filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        activeChapterFilter = btn.getAttribute('data-chapter');
        render();
      });
    });

    // 2. Search input
    const searchInput = container.querySelector('#hubVideoSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value.toLowerCase().trim();
        render();
        // Restore focus to search input
        const reFocused = container.querySelector('#hubVideoSearch');
        if (reFocused) {
          reFocused.focus();
          reFocused.setSelectionRange(reFocused.value.length, reFocused.value.length);
        }
      });
    }

    const clearSearchBtn = container.querySelector('#clearHubSearchBtn');
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        searchTerm = '';
        render();
      });
    }

    const resetBtn = container.querySelector('#resetSearchBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        searchTerm = '';
        activeChapterFilter = 'all';
        render();
      });
    }

    // 3. Inspect Lesson button
    container.querySelectorAll('.inspect-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const vidId = btn.getAttribute('data-video-id');
        if (window.openLessonModal) window.openLessonModal(vidId);
      });
    });

    // 4. Run Demonstration Query in Playground
    container.querySelectorAll('.run-query-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const vidId = btn.getAttribute('data-video-id');
        const video = COURSE_VIDEOS.find(v => v.id === vidId);
        if (video && onRunQueryInPlayground) {
          onRunQueryInPlayground(video.sampleSql);
        }
      });
    });

    // 5. Watch Status toggle
    container.querySelectorAll('.watch-status-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const vidId = btn.getAttribute('data-video-id');
        toggleVideoWatched(vidId);
        render();
        window.dispatchEvent(new CustomEvent('omniflow:progress-updated'));
      });
    });

    // 6. View roadmap button
    const viewRoadmapBtn = container.querySelector('#viewRoadmapFromHubBtn');
    if (viewRoadmapBtn && onSwitchTab) {
      viewRoadmapBtn.addEventListener('click', () => {
        onSwitchTab('roadmap');
      });
    }
  }

  // Listen for progress updates triggered from lesson modal or roadmap
  window.addEventListener('omniflow:progress-updated', () => {
    render();
  });

  render();
}
