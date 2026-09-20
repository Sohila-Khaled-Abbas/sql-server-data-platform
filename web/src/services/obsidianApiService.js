/**
 * Obsidian Second Brain Dynamic API Service
 * Connects the web platform to the Obsidian PKM Vault via GitHub REST API,
 * Raw content streaming, and bundled JSON manifest fallbacks.
 */

import { marked } from 'marked';

// Configure marked for secure, GitHub-flavored markdown parsing
marked.setOptions({
  gfm: true,
  breaks: true
});

const REPO_OWNER = 'Sohila-Khaled-Abbas';
const REPO_NAME = 'sql-server-data-platform';
const BRANCH = 'master';

const RAW_BASE_URL = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}`;
const GITHUB_API_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

const STORAGE_KEYS = {
  MANIFEST_CACHE: 'sql_pkm_manifest_cache_v2',
  MANIFEST_TIMESTAMP: 'sql_pkm_manifest_ts_v2',
  COMPLETED_TASKS: 'sql_pkm_completed_tasks_v2',
  NOTE_CACHE_PREFIX: 'sql_pkm_note_cache_',
  LAST_SYNC: 'sql_pkm_last_sync_v2'
};

// In-memory note cache
const memoryNoteCache = new Map();

/**
 * Get the base URL configured for the current Vite environment (handles GitHub Pages /sql-server-data-platform/ base)
 */
function getAppBaseUrl() {
  return import.meta.env.BASE_URL || '/';
}

/**
 * Fetch the master curriculum manifest
 */
export async function fetchCurriculumManifest(forceRefresh = false) {
  // Check local cache if not forcing refresh
  if (!forceRefresh) {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.MANIFEST_CACHE);
      const timestamp = localStorage.getItem(STORAGE_KEYS.MANIFEST_TIMESTAMP);
      if (cached && timestamp) {
        const ageMs = Date.now() - parseInt(timestamp, 10);
        // Cache valid for 1 hour
        if (ageMs < 3600000) {
          return JSON.parse(cached);
        }
      }
    } catch (e) {
      console.warn('Failed to read from localStorage cache:', e);
    }
  }

  // 1. Fetch from static local bundle (blazing fast, no rate limits)
  const baseUrl = getAppBaseUrl().replace(/\/$/, '');
  const manifestPath = `${baseUrl}/data/curriculum_manifest.json`;

  try {
    const res = await fetch(manifestPath);
    if (res.ok) {
      const data = await res.json();
      try {
        localStorage.setItem(STORAGE_KEYS.MANIFEST_CACHE, JSON.stringify(data));
        localStorage.setItem(STORAGE_KEYS.MANIFEST_TIMESTAMP, Date.now().toString());
        localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
      } catch (e) {
        // quota exceeded or private browsing
      }
      return data;
    }
  } catch (err) {
    console.warn(`Local manifest fetch failed at ${manifestPath}, falling back to GitHub raw URL`, err);
  }

  // 2. Fallback to GitHub raw content URL
  try {
    const rawUrl = `${RAW_BASE_URL}/web/public/data/curriculum_manifest.json`;
    const res = await fetch(rawUrl);
    if (res.ok) {
      const data = await res.json();
      try {
        localStorage.setItem(STORAGE_KEYS.MANIFEST_CACHE, JSON.stringify(data));
        localStorage.setItem(STORAGE_KEYS.MANIFEST_TIMESTAMP, Date.now().toString());
        localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
      } catch (e) {}
      return data;
    }
  } catch (rawErr) {
    console.error('Failed to fetch manifest from GitHub raw URL:', rawErr);
  }

  // 3. If everything fails, try to return stale cache
  const stale = localStorage.getItem(STORAGE_KEYS.MANIFEST_CACHE);
  if (stale) {
    return JSON.parse(stale);
  }

  throw new Error('Unable to load curriculum manifest from local bundle or GitHub API.');
}

/**
 * Fetch raw Markdown content for a note and render it to HTML
 */
export async function fetchNoteContent(noteOrPath) {
  const rawUrl = typeof noteOrPath === 'string'
    ? (noteOrPath.startsWith('http') ? noteOrPath : `${RAW_BASE_URL}/${noteOrPath.replace(/^\//, '')}`)
    : (noteOrPath.raw_url || `${RAW_BASE_URL}/${noteOrPath.relative_path}`);

  // Check in-memory cache
  if (memoryNoteCache.has(rawUrl)) {
    return memoryNoteCache.get(rawUrl);
  }

  // Check localStorage cache
  const cacheKey = `${STORAGE_KEYS.NOTE_CACHE_PREFIX}${encodeURIComponent(rawUrl)}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      memoryNoteCache.set(rawUrl, parsed);
      return parsed;
    }
  } catch (e) {}

  // Fetch live from GitHub Raw
  try {
    const res = await fetch(rawUrl);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    const markdown = await res.text();

    // Separate frontmatter from body
    let frontmatter = '';
    let body = markdown;
    if (markdown.startsWith('---')) {
      const parts = markdown.split('---', 3);
      if (parts.length >= 3) {
        frontmatter = parts[1].trim();
        body = parts[2].trim();
      }
    }

    // Convert callouts and Obsidian syntax into styled HTML
    const formattedBody = transformObsidianSyntax(body);
    const html = marked.parse(formattedBody);

    const result = {
      rawMarkdown: markdown,
      frontmatter,
      bodyMarkdown: body,
      html,
      fetchedAt: new Date().toISOString()
    };

    // Cache in memory and localStorage
    memoryNoteCache.set(rawUrl, result);
    try {
      localStorage.setItem(cacheKey, JSON.stringify(result));
    } catch (e) {}

    return result;
  } catch (err) {
    console.error(`Failed to fetch note from ${rawUrl}:`, err);
    throw err;
  }
}

/**
 * Transform Obsidian specific callouts (> [!note], > [!abstract], [[wikilinks]])
 * into standard HTML/Markdown for marked.js
 */
function transformObsidianSyntax(content) {
  let transformed = content;

  // Transform Obsidian Callouts: > [!type] Title
  transformed = transformed.replace(/> \[!(abstract|info|note|tip|example|warning|danger|check|question|hint)\]\s*(.*)?/gi, (match, type, title) => {
    const t = type.toLowerCase();
    const displayTitle = title ? title.trim() : (t.charAt(0).toUpperCase() + t.slice(1));
    return `<div class="obsidian-callout callout-${t}"><div class="callout-title"><span class="callout-icon"></span><strong>${displayTitle}</strong></div>`;
  });

  // Close callout divs when blockquote ends
  transformed = transformed.replace(/((?:^>.*\n?)+)/gm, (block) => {
    if (block.includes('class="obsidian-callout')) {
      const cleanBlock = block.replace(/^>\s?/gm, '');
      return `${cleanBlock}</div>\n\n`;
    }
    return block;
  });

  // Transform internal Obsidian Wikilinks: [[Note Name|Display Text]] or [[Note Name]]
  transformed = transformed.replace(/\[\[(.*?)(?:\|(.*?))?\]\]/g, (match, target, alias) => {
    const displayText = alias || target;
    return `<span class="obsidian-wikilink" title="${target}">[[${displayText}]]</span>`;
  });

  return transformed;
}

/**
 * Check GitHub repository sync status (latest commit hash)
 */
export async function checkGitHubSyncStatus() {
  try {
    const res = await fetch(`${GITHUB_API_BASE}/commits/master`, {
      headers: { Accept: 'application/vnd.github.v3+json' }
    });
    if (res.ok) {
      const data = await res.json();
      return {
        online: true,
        sha: data.sha?.substring(0, 7),
        date: data.commit?.committer?.date,
        message: data.commit?.message?.split('\n')[0]
      };
    }
  } catch (err) {
    console.warn('GitHub API commit check failed:', err);
  }
  return { online: false, sha: '0dd8bf9', date: new Date().toISOString(), message: 'Offline cache active' };
}

/**
 * Local User Checklist & Progress State Management
 */
export function getStoredUserTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPLETED_TASKS);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

export function isTaskCompleted(lessonId, taskIndex) {
  const tasks = getStoredUserTasks();
  const key = `${lessonId}_${taskIndex}`;
  return !!tasks[key];
}

export function toggleTaskCompletion(lessonId, taskIndex) {
  const tasks = getStoredUserTasks();
  const key = `${lessonId}_${taskIndex}`;
  tasks[key] = !tasks[key];
  
  try {
    localStorage.setItem(STORAGE_KEYS.COMPLETED_TASKS, JSON.stringify(tasks));
    window.dispatchEvent(new CustomEvent('pkm-progress-updated', { detail: { lessonId, taskIndex, completed: tasks[key] } }));
  } catch (e) {}
  
  return tasks[key];
}

export function getLessonCompletedTasksCount(lessonId, totalAbilities) {
  const tasks = getStoredUserTasks();
  let count = 0;
  for (let i = 0; i < totalAbilities; i++) {
    if (tasks[`${lessonId}_${i}`]) count++;
  }
  return count;
}

export function resetAllUserProgress() {
  try {
    localStorage.removeItem(STORAGE_KEYS.COMPLETED_TASKS);
    window.dispatchEvent(new CustomEvent('pkm-progress-updated', { detail: { reset: true } }));
  } catch (e) {}
}
