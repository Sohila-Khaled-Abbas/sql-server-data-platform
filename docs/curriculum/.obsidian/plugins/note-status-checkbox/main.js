'use strict';

/**
 * Note Status Checkbox
 *
 * Per ogni collegamento interno [[Nota]] verso una nota il cui frontmatter
 * combacia con una delle REGOLE configurate, mostra un'icona (Lucide) colorata
 * prima del link, sia in READING MODE che in LIVE PREVIEW.
 * Le regole si configurano dalla pagina impostazioni del plugin.
 */

// Require "sicuri": in Obsidian risolvono i moduli reali; fuori (test Node) tornano {}.
function safeRequire(id) {
  try { return require(id); } catch (e) { return {}; }
}
const obsidian = safeRequire('obsidian');
const cmView = safeRequire('@codemirror/view');
const cmState = safeRequire('@codemirror/state');

const {
  Plugin: ObsidianPlugin,
  PluginSettingTab: ObsidianPluginSettingTab,
  Modal: ObsidianModal,
  setIcon,
  getIconIds,
  editorInfoField,
} = obsidian;
const { ViewPlugin, Decoration, WidgetType: CMWidgetType } = cmView;
const { RangeSetBuilder } = cmState;

// Classi base con fallback: permettono di caricare il modulo anche fuori da Obsidian (test).
const PluginBase = ObsidianPlugin || class {};
const PluginSettingTabBase = ObsidianPluginSettingTab || class {};
const ModalBase = ObsidianModal || class {};
const WidgetTypeBase = CMWidgetType || class {};

const DEFAULT_SETTINGS = { rules: [], iconStroke: 2 };
const TASK_LINE = /^\s*[-*+]\s+\[.\]\s/;
const ICON_PICKER_LIMIT = 200;

// Preset colors shown as swatches in the settings color picker.
const COLOR_PRESETS = [
  { name: 'Green', color: '#2f9e44' },
  { name: 'Yellow', color: '#ffd43b' },
  { name: 'Orange', color: '#e0a106' },
  { name: 'Red', color: '#e03131' },
  { name: 'Blue', color: '#1971c2' },
];

// ---------------------------------------------------------------------------
// LOGICA DI MATCHING (funzioni pure, testabili)
// ---------------------------------------------------------------------------

function readProp(frontmatter, name) {
  if (!frontmatter) return undefined;
  if (Object.prototype.hasOwnProperty.call(frontmatter, name)) return frontmatter[name];
  const target = name.toLowerCase();
  for (const key of Object.keys(frontmatter)) {
    if (key.toLowerCase() === target) return frontmatter[key];
  }
  return undefined;
}

function valueMatches(propValue, ruleValue, caseSensitive) {
  const target = String(ruleValue == null ? '' : ruleValue).trim();
  const candidates = Array.isArray(propValue) ? propValue : [propValue];
  for (const c of candidates) {
    if (c === undefined || c === null) continue;
    const s = String(c).trim();
    if (target === '') {
      if (s !== '') return true; // jolly: combacia con qualsiasi valore non vuoto
      continue;
    }
    if (caseSensitive ? s === target : s.toLowerCase() === target.toLowerCase()) return true;
  }
  return false;
}

function matchRules(frontmatter, rules) {
  if (!frontmatter || !Array.isArray(rules)) return null;
  for (const rule of rules) {
    if (!rule || !rule.field) continue;
    const propValue = readProp(frontmatter, rule.field);
    if (propValue === undefined) continue;
    if (valueMatches(propValue, rule.value, !!rule.caseSensitive)) return rule;
  }
  return null;
}

function resolveLinkRule(app, rawTarget, sourcePath, rules) {
  const linkpath = rawTarget.split('#')[0].split('|')[0].trim();
  if (!linkpath) return null;
  const dest = app.metadataCache.getFirstLinkpathDest(linkpath, sourcePath || '');
  if (!dest) return null;
  const cache = app.metadataCache.getFileCache(dest);
  const fm = cache ? cache.frontmatter : undefined;
  const rule = matchRules(fm, rules);
  if (!rule) return null;
  return { rule, value: readProp(fm, rule.field) };
}

// ---------------------------------------------------------------------------
// RENDERING
// ---------------------------------------------------------------------------

function buildIconEl(rule, value, stroke, ownerDocument) {
  const box = ownerDocument.createElement('span');
  box.className = 'nsc-checkbox';
  const label = `${rule.field}: ${value == null ? '' : Array.isArray(value) ? value.join(', ') : value}`;
  box.setAttribute('aria-label', label);
  box.setAttribute('title', label);
  if (setIcon) setIcon(box, rule.icon);
  if (rule.color) box.style.setProperty('--nsc-icon-color', rule.color);
  box.style.setProperty('--nsc-icon-stroke', `${stroke == null ? 2 : stroke}px`);
  return box;
}

class IconWidget extends WidgetTypeBase {
  constructor(rule, value, stroke) {
    super();
    this.rule = rule;
    this.value = value;
    this.stroke = stroke;
  }
  eq(other) {
    return other.rule.icon === this.rule.icon
      && other.rule.color === this.rule.color
      && other.rule.field === this.rule.field
      && other.value === this.value
      && other.stroke === this.stroke;
  }
  toDOM(view) { return buildIconEl(this.rule, this.value, this.stroke, view.dom.ownerDocument); }
  ignoreEvent() { return true; }
}

function buildDecorations(plugin, view) {
  const app = plugin.app;
  const rules = plugin.settings.rules;
  const stroke = plugin.settings.iconStroke;
  const builder = new RangeSetBuilder();
  const { state } = view;
  const info = state.field(editorInfoField, false);
  const sourcePath = info && info.file ? info.file.path : '';
  const selRanges = state.selection.ranges;

  for (const { from, to } of view.visibleRanges) {
    let line = state.doc.lineAt(from);
    while (line.from <= to) {
      const text = line.text;
      if (!TASK_LINE.test(text)) {
        const re = /\[\[([^\[\]]+?)\]\]/g;
        let m;
        while ((m = re.exec(text)) !== null) {
          if (m.index > 0 && text[m.index - 1] === '!') continue;
          const linkStart = line.from + m.index;
          const linkEnd = linkStart + m[0].length;
          const overlapped = selRanges.some((r) => r.from <= linkEnd && r.to >= linkStart);
          if (overlapped) continue;
          const resolved = resolveLinkRule(app, m[1], sourcePath, rules);
          if (!resolved) continue;
          builder.add(
            linkStart,
            linkStart,
            Decoration.widget({ widget: new IconWidget(resolved.rule, resolved.value, stroke), side: -1 })
          );
        }
      }
      if (line.to + 1 > state.doc.length) break;
      line = state.doc.lineAt(line.to + 1);
    }
  }
  return builder.finish();
}

function createEditorExtension(plugin) {
  return ViewPlugin.fromClass(
    class {
      constructor(view) { this.decorations = buildDecorations(plugin, view); }
      update(update) {
        if (update.docChanged || update.viewportChanged || update.selectionSet) {
          this.decorations = buildDecorations(plugin, update.view);
        }
      }
    },
    { decorations: (v) => v.decorations }
  );
}

// ---------------------------------------------------------------------------
// PLUGIN
// ---------------------------------------------------------------------------

class NoteStatusCheckboxPlugin extends PluginBase {
  async onload() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    this.addSettingTab(new NscSettingTab(this.app, this));

    // --- Reading mode ---
    this.registerMarkdownPostProcessor((el, ctx) => {
      const links = el.querySelectorAll('a.internal-link');
      links.forEach((link) => {
        if (link.closest('.task-list-item')) return;
        const prev = link.previousElementSibling;
        if (prev && prev.classList && prev.classList.contains('nsc-checkbox')) return;
        const href = link.getAttribute('data-href') || link.getAttribute('href') || link.textContent;
        if (!href) return;
        const resolved = resolveLinkRule(this.app, href, ctx.sourcePath, this.settings.rules);
        if (!resolved) return;
        link.parentElement.insertBefore(buildIconEl(
          resolved.rule,
          resolved.value,
          this.settings.iconStroke,
          link.ownerDocument
        ), link);
      });
    });

    // --- Live Preview (editing) ---
    this.editorExtensions = [createEditorExtension(this)];
    this.registerEditorExtension(this.editorExtensions);

    // --- Reattività: cambia il frontmatter di una nota -> aggiorna le viste aperte ---
    this.registerEvent(this.app.metadataCache.on('changed', () => this.refreshAllViews()));
  }

  async saveSettings() {
    await this.saveData(this.settings);
    this.refreshAllViews();
  }

  refreshAllViews() {
    this.app.workspace.iterateAllLeaves((leaf) => {
      const view = leaf.view;
      if (!view) return;
      if (view.previewMode && typeof view.previewMode.rerender === 'function') {
        view.previewMode.rerender(true);
      }
    });
    this.editorExtensions.length = 0;
    this.editorExtensions.push(createEditorExtension(this));
    this.app.workspace.updateOptions();
  }
}

// ---------------------------------------------------------------------------
// IMPOSTAZIONI
// ---------------------------------------------------------------------------

class NscSettingTab extends PluginSettingTabBase {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl('p', {
      cls: 'setting-item-description',
      text: 'Create rules that map frontmatter property values to icons and colors. The first matching rule wins; use the arrows to reorder rules.',
    });

    // Spessore icone (globale)
    const strokeRow = containerEl.createDiv({ cls: 'nsc-stroke-row' });
    strokeRow.createEl('span', { text: 'Icon stroke', cls: 'nsc-stroke-label' });
    const range = strokeRow.createEl('input', { cls: 'nsc-stroke-range' });
    range.type = 'range';
    range.min = '1';
    range.max = '4';
    range.step = '0.25';
    range.value = String(this.plugin.settings.iconStroke == null ? 2 : this.plugin.settings.iconStroke);
    const strokeVal = strokeRow.createEl('span', { cls: 'nsc-stroke-val', text: range.value });
    range.addEventListener('input', () => strokeVal.setText(range.value));
    range.addEventListener('change', async () => {
      this.plugin.settings.iconStroke = parseFloat(range.value);
      await this.plugin.saveSettings();
    });

    const list = containerEl.createDiv({ cls: 'nsc-rules' });
    this.plugin.settings.rules.forEach((rule, index) => this.renderRuleRow(list, rule, index));

    const addBtn = containerEl.createEl('button', { text: '+ Add rule', cls: 'mod-cta nsc-add' });
    addBtn.addEventListener('click', async () => {
      this.plugin.settings.rules.push({ field: '', value: '', caseSensitive: false, icon: 'circle', color: '#9aa0a6' });
      await this.plugin.saveSettings();
      this.display();
    });
  }

  renderRuleRow(parent, rule, index) {
    const row = parent.createDiv({ cls: 'nsc-rule' });

    // Icona
    const iconBtn = row.createEl('button', { cls: 'nsc-icon-btn' });
    iconBtn.setAttribute('aria-label', 'Choose icon');
    this.paintIconButton(iconBtn, rule);
    iconBtn.addEventListener('click', () => {
      new IconPickerModal(this.app, rule.icon, async (chosen) => {
        rule.icon = chosen;
        this.paintIconButton(iconBtn, rule);
        await this.plugin.saveSettings();
      }).open();
    });

    // Colore: bottone che apre il color picker (preset + personalizzato)
    const colorBtn = row.createEl('button', { cls: 'nsc-color-btn' });
    colorBtn.setAttribute('aria-label', 'Choose color');
    this.paintColorButton(colorBtn, rule);
    colorBtn.addEventListener('click', () => {
      new ColorPickerModal(this.app, rule.color, async (chosen) => {
        rule.color = chosen;
        this.paintColorButton(colorBtn, rule);
        this.paintIconButton(iconBtn, rule);
        await this.plugin.saveSettings();
      }).open();
    });

    // Campo
    const field = row.createEl('input', { cls: 'nsc-field' });
    field.type = 'text';
    field.value = rule.field || '';
    field.setAttribute('placeholder', 'property (for example, status)');
    field.addEventListener('change', async () => {
      rule.field = field.value.trim();
      await this.plugin.saveSettings();
    });

    // Valore + gruppo CI/CS + help
    const valueWrap = row.createDiv({ cls: 'nsc-value-wrap' });
    const value = valueWrap.createEl('input', { cls: 'nsc-value' });
    value.type = 'text';
    value.value = rule.value || '';
    value.setAttribute('placeholder', 'value (empty = any)');
    value.addEventListener('change', async () => {
      rule.value = value.value;
      await this.plugin.saveSettings();
    });

    const group = valueWrap.createDiv({ cls: 'nsc-cics' });
    const ci = group.createEl('button', { text: 'CI', cls: 'nsc-cics-btn' });
    const cs = group.createEl('button', { text: 'CS', cls: 'nsc-cics-btn' });
    const paintCics = () => {
      ci.toggleClass('is-active', !rule.caseSensitive);
      cs.toggleClass('is-active', !!rule.caseSensitive);
    };
    paintCics();
    ci.addEventListener('click', async () => { rule.caseSensitive = false; paintCics(); await this.plugin.saveSettings(); });
    cs.addEventListener('click', async () => { rule.caseSensitive = true; paintCics(); await this.plugin.saveSettings(); });

    const help = valueWrap.createEl('span', { text: '?', cls: 'nsc-help' });
    help.setAttribute('aria-label', 'CI = case-insensitive · CS = case-sensitive');

    // Riordino + elimina
    const tools = row.createDiv({ cls: 'nsc-tools' });
    const up = tools.createEl('button', { cls: 'nsc-tool' });
    if (setIcon) setIcon(up, 'arrow-up');
    up.setAttribute('aria-label', 'Move rule up');
    up.disabled = index === 0;
    up.addEventListener('click', () => this.move(index, -1));
    const down = tools.createEl('button', { cls: 'nsc-tool' });
    if (setIcon) setIcon(down, 'arrow-down');
    down.setAttribute('aria-label', 'Move rule down');
    down.disabled = index === this.plugin.settings.rules.length - 1;
    down.addEventListener('click', () => this.move(index, 1));
    const del = tools.createEl('button', { cls: 'nsc-tool' });
    if (setIcon) setIcon(del, 'trash-2');
    del.setAttribute('aria-label', 'Delete rule');
    del.addEventListener('click', async () => {
      this.plugin.settings.rules.splice(index, 1);
      await this.plugin.saveSettings();
      this.display();
    });
  }

  paintIconButton(btn, rule) {
    btn.empty();
    if (setIcon && rule.icon) setIcon(btn, rule.icon);
    btn.style.setProperty('--nsc-icon-color', rule.color || '');
  }

  paintColorButton(btn, rule) {
    btn.style.setProperty('--nsc-swatch-color', rule.color || 'transparent');
  }

  async move(index, delta) {
    const rules = this.plugin.settings.rules;
    const target = index + delta;
    if (target < 0 || target >= rules.length) return;
    const [r] = rules.splice(index, 1);
    rules.splice(target, 0, r);
    await this.plugin.saveSettings();
    this.display();
  }
}

// ---------------------------------------------------------------------------
// PICKER ICONE (modale a griglia)
// ---------------------------------------------------------------------------

class IconPickerModal extends ModalBase {
  constructor(app, current, onChoose) {
    super(app);
    this.current = current;
    this.onChoose = onChoose;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.addClass('nsc-picker');
    contentEl.createEl('h3', { text: 'Choose an icon' });

    const search = contentEl.createEl('input', { cls: 'nsc-picker-search' });
    search.type = 'text';
    search.setAttribute('placeholder', 'Search… (for example, check, clock, star)');

    const note = contentEl.createDiv({ cls: 'nsc-picker-note' });
    const grid = contentEl.createDiv({ cls: 'nsc-picker-grid' });

    const allIds = (getIconIds ? getIconIds() : []).slice().sort();

    const render = (query) => {
      grid.empty();
      const q = query.trim().toLowerCase();
      let ids = q ? allIds.filter((id) => id.toLowerCase().includes(q)) : allIds;
      let truncated = false;
      if (ids.length > ICON_PICKER_LIMIT) {
        ids = ids.slice(0, ICON_PICKER_LIMIT);
        truncated = true;
      }
      note.setText(truncated
        ? `Showing the first ${ICON_PICKER_LIMIT} icons. Refine the search to see more.`
        : `${ids.length} icons`);
      ids.forEach((id) => {
        const cell = grid.createEl('button', { cls: 'nsc-picker-cell' });
        cell.setAttribute('aria-label', id);
        if (setIcon) setIcon(cell, id);
        if (id === this.current) cell.addClass('is-active');
        cell.addEventListener('click', () => { this.onChoose(id); this.close(); });
      });
    };

    search.addEventListener('input', () => render(search.value));
    render('');
    search.focus();
  }

  onClose() { this.contentEl.empty(); }
}

// ---------------------------------------------------------------------------
// PICKER COLORE (preset + personalizzato)
// ---------------------------------------------------------------------------

class ColorPickerModal extends ModalBase {
  constructor(app, current, onChoose) {
    super(app);
    this.current = current;
    this.onChoose = onChoose;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.addClass('nsc-color-modal');
    contentEl.createEl('h3', { text: 'Choose a color' });

    // Preset
    const swatches = contentEl.createDiv({ cls: 'nsc-swatches' });
    COLOR_PRESETS.forEach((preset) => {
      const sw = swatches.createEl('button', { cls: 'nsc-swatch' });
      sw.style.setProperty('--nsc-swatch-color', preset.color);
      sw.setAttribute('aria-label', preset.name);
      if (this.current && preset.color.toLowerCase() === this.current.toLowerCase()) {
        sw.addClass('is-active');
      }
      sw.addEventListener('click', () => { this.onChoose(preset.color); this.close(); });
    });

    // Personalizzato: input nativo + hex
    const custom = contentEl.createDiv({ cls: 'nsc-color-custom' });
    custom.createEl('span', { text: 'Custom', cls: 'nsc-color-custom-label' });
    const color = custom.createEl('input', { cls: 'nsc-color' });
    color.type = 'color';
    if (this.current) color.value = this.current;
    const hex = custom.createEl('input', { cls: 'nsc-hex' });
    hex.type = 'text';
    hex.value = this.current || '';
    hex.setAttribute('placeholder', '#rrggbb');

    color.addEventListener('input', () => { hex.value = color.value; });
    color.addEventListener('change', () => this.onChoose(color.value));
    hex.addEventListener('change', () => {
      const v = hex.value.trim();
      if (/^#[0-9a-fA-F]{6}$/.test(v)) this.onChoose(v);
    });
  }

  onClose() { this.contentEl.empty(); }
}

module.exports = NoteStatusCheckboxPlugin;
module.exports.__test__ = { readProp, valueMatches, matchRules };

/* nosourcemap */