import { executeQuery, PRESET_QUERIES } from '../db/engine.js';

export function setupQueryPlayground() {
  const sqlInput = document.getElementById('sqlInput');
  const runQueryBtn = document.getElementById('runQueryBtn');
  const presetSelect = document.getElementById('queryPresetSelect');
  const resultContainer = document.getElementById('queryResultContainer');
  const rowCountBadge = document.getElementById('resultRowCount');
  const durationBadge = document.getElementById('resultDuration');
  const formatBtn = document.getElementById('formatSqlBtn');
  const clearBtn = document.getElementById('clearEditorBtn');
  const exportCsvBtn = document.getElementById('exportCsvBtn');

  let currentResults = null;

  // Set default initial query
  if (sqlInput && presetSelect) {
    sqlInput.value = PRESET_QUERIES.company_hierarchy;

    presetSelect.addEventListener('change', () => {
      const selectedKey = presetSelect.value;
      if (PRESET_QUERIES[selectedKey]) {
        sqlInput.value = PRESET_QUERIES[selectedKey];
        run();
      }
    });
  }

  function run() {
    const query = sqlInput.value.trim();
    if (!query) return;

    const result = executeQuery(query);
    currentResults = result;
    renderResults(result);
  }

  function renderResults(result) {
    rowCountBadge.textContent = `${result.rowCount} rows`;
    durationBadge.textContent = `${result.executionTimeMs} ms`;

    if (result.error) {
      resultContainer.innerHTML = `
        <div style="padding: 24px; color: var(--accent-rose); font-family: var(--font-mono); font-size: 0.85rem;">
          <div style="font-weight: 700; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
            <span>⚠️ SQL Execution Error</span>
          </div>
          <pre style="background: rgba(244, 63, 94, 0.1); border: 1px solid rgba(244, 63, 94, 0.3); padding: 12px; border-radius: 6px; white-space: pre-wrap;">${escapeHtml(result.error)}</pre>
        </div>
      `;
      return;
    }

    if (result.message && (!result.columns || result.columns.length === 0)) {
      resultContainer.innerHTML = `
        <div style="padding: 24px; color: var(--accent-emerald); font-family: var(--font-mono); font-size: 0.85rem;">
          <div style="font-weight: 700;">✅ ${escapeHtml(result.message)}</div>
        </div>
      `;
      return;
    }

    if (!result.columns || result.columns.length === 0) {
      resultContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📂</div>
          <div class="empty-text">0 rows returned by this query.</div>
        </div>
      `;
      return;
    }

    let html = '<table class="data-table"><thead><tr>';
    result.columns.forEach(col => {
      html += `<th>${escapeHtml(col)}</th>`;
    });
    html += '</tr></thead><tbody>';

    result.values.forEach(row => {
      html += '<tr>';
      row.forEach(val => {
        const displayVal = val === null ? '<span style="color: var(--text-muted); font-style: italic;">NULL</span>' : escapeHtml(String(val));
        html += `<td>${displayVal}</td>`;
      });
      html += '</tr>';
    });

    html += '</tbody></table>';
    resultContainer.innerHTML = html;
  }

  function exportCsv() {
    if (!currentResults || !currentResults.columns || currentResults.columns.length === 0) {
      alert('No query results available to export.');
      return;
    }

    let csv = currentResults.columns.join(',') + '\n';
    currentResults.values.forEach(row => {
      const escapedRow = row.map(v => {
        if (v === null) return '';
        const str = String(v);
        return str.includes(',') ? `"${str.replace(/"/g, '""')}"` : str;
      });
      csv += escapedRow.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `query_results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (runQueryBtn) runQueryBtn.addEventListener('click', run);

  if (sqlInput) {
    sqlInput.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        run();
      }
    });
  }

  if (formatBtn && presetSelect) {
    formatBtn.addEventListener('click', () => {
      const selected = presetSelect.value;
      if (PRESET_QUERIES[selected]) sqlInput.value = PRESET_QUERIES[selected];
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      sqlInput.value = '';
      sqlInput.focus();
    });
  }

  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', exportCsv);
  }

  // Run initial preset once DB is ready
  run();
}

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}
