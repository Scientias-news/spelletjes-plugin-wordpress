/**
 * Scientias Spellen — Admin vragenbuilder
 *
 * Laadt de opgeslagen vragen (JSON) en toont ze als interactieve kaarten.
 * Beheert toevoegen, verwijderen en volgorde wijzigen.
 * Serialiseert alles terug naar JSON bij het opslaan van het bericht.
 */
(function () {
  'use strict';

  // ---- State ----------------------------------------------------------------

  let questions = [];
  let collapsed  = {};   // index → boolean (is card collapsed?)

  // ---- Helpers ---------------------------------------------------------------

  function gameType() {
    return document.getElementById('scsp_game_type')?.value || 'quiz';
  }

  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ---- Initialization -------------------------------------------------------

  function init() {
    const jsonInput = document.getElementById('scsp_questions_json');
    if (!jsonInput) return;

    try { questions = JSON.parse(jsonInput.value) || []; }
    catch (e) { questions = []; }

    renderAll();
    updateCountHint();

    // Game type change → re-render with correct card template
    document.getElementById('scsp_game_type')?.addEventListener('change', function () {
      if (questions.length > 0) {
        const confirmed = confirm(
          'Let op: als je het speltype wijzigt terwijl er al vragen zijn, ' +
          'worden de bestaande vragen gewist. Doorgaan?'
        );
        if (!confirmed) {
          this.value = document.getElementById('scsp_game_type_mirror')?.value || 'quiz';
          return;
        }
        questions = [];
      }
      renderAll();
      updateCountHint();
    });

    // Add question button
    document.getElementById('scsp-add-btn')?.addEventListener('click', addQuestion);

    // Event delegation for card actions (delete, move, toggle collapse)
    document.getElementById('scsp-builder')?.addEventListener('click', handleCardAction);

    // JSON import: knop opent file picker programmatisch (betrouwbaarder dan label+hidden)
    document.getElementById('scsp-import-btn')?.addEventListener('click', function () {
      document.getElementById('scsp-json-import')?.click();
    });
    document.getElementById('scsp-json-import')?.addEventListener('change', handleImport);

    // Export / sample panel
    document.getElementById('scsp-export-btn')?.addEventListener('click', handleExport);
    document.getElementById('scsp-sample-btn')?.addEventListener('click', toggleSamplePanel);
    document.querySelectorAll('.scsp-stab').forEach(btn =>
      btn.addEventListener('click', switchSampleTab)
    );

    // Serialize op form submit (fallback) én op klik van de WordPress-opslaanknoppen.
    // WordPress admin verwerkt saves soms vóór het submit-event afgevuurd wordt,
    // dus koppel serialize aan de knoppen zelf als primaire trigger.
    document.getElementById('post')?.addEventListener('submit', serialize, { capture: true });
    ['publish', 'save-post'].forEach(function (id) {
      document.getElementById(id)?.addEventListener('click', serialize);
    });
  }

  // ---- Add a new empty question card ----------------------------------------

  function addQuestion() {
    const type = gameType();
    if (type === 'quiz') {
      questions.push({
        category:    '',
        question:    '',
        options:     ['', '', '', ''],
        correct:     0,
        explanation: '',
      });
    } else {
      questions.push({
        icon:        '🔬',
        statement:   '',
        answer:      true,
        explanation: '',
      });
    }
    const newIndex = questions.length - 1;
    collapsed[newIndex] = false;

    renderAll();
    updateCountHint();

    // Scroll new card into view
    const cards = document.querySelectorAll('.scsp-q-card');
    cards[cards.length - 1]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ---- Remove a question ----------------------------------------------------

  function removeQuestion(index) {
    if (!confirm('Wil je deze vraag echt verwijderen?')) return;
    // Serialize current values before splicing so we don't lose edits
    serializeToState();
    questions.splice(index, 1);
    // Rebuild collapsed map
    const newCollapsed = {};
    Object.entries(collapsed).forEach(([k, v]) => {
      const ki = parseInt(k, 10);
      if (ki < index) newCollapsed[ki] = v;
      else if (ki > index) newCollapsed[ki - 1] = v;
    });
    collapsed = newCollapsed;
    renderAll();
    updateCountHint();
  }

  // ---- Move a question up or down -------------------------------------------

  function moveQuestion(index, direction) {
    serializeToState();
    const target = index + direction;
    if (target < 0 || target >= questions.length) return;
    [questions[index], questions[target]] = [questions[target], questions[index]];
    [collapsed[index], collapsed[target]] = [collapsed[target], collapsed[index]];
    renderAll();
  }

  // ---- Toggle card collapse -------------------------------------------------

  function toggleCollapse(index) {
    collapsed[index] = !collapsed[index];
    const card = document.querySelector(`.scsp-q-card[data-index="${index}"]`);
    const body = card?.querySelector('.scsp-q-body');
    const hint = card?.querySelector('.scsp-q-toggle');
    if (body) body.classList.toggle('collapsed', collapsed[index]);
    if (hint) hint.textContent = collapsed[index] ? '▶ Uitklappen' : '▼ Inklappen';
  }

  // ---- Event delegation on the builder container ----------------------------

  function handleCardAction(e) {
    const card = e.target.closest('.scsp-q-card');
    if (!card) return;
    const index = parseInt(card.dataset.index, 10);

    if (e.target.closest('.scsp-delete-btn')) {
      removeQuestion(index);
    } else if (e.target.closest('.scsp-up-btn')) {
      moveQuestion(index, -1);
    } else if (e.target.closest('.scsp-down-btn')) {
      moveQuestion(index, 1);
    } else if (e.target.closest('.scsp-q-header') && !e.target.closest('.scsp-q-actions')) {
      toggleCollapse(index);
    }
  }

  // ---- Render all cards -----------------------------------------------------

  function renderAll() {
    const container = document.getElementById('scsp-builder');
    if (!container) return;

    if (questions.length === 0) {
      container.innerHTML = '<p class="scsp-empty">Nog geen vragen toegevoegd. Klik op "+ Vraag toevoegen" om te beginnen.</p>';
      return;
    }

    const type = gameType();
    container.innerHTML = questions.map((q, i) =>
      type === 'quiz' ? renderQuizCard(q, i) : renderFeitCard(q, i)
    ).join('');
  }

  // ---- Quiz card template ---------------------------------------------------

  function renderQuizCard(q, index) {
    const isCollapsed = !!collapsed[index];
    const preview = isCollapsed && q.question
      ? '<span class="scsp-q-toggle" style="margin-left:8px;color:#888;font-size:12px">' + esc(q.question.substring(0, 60)) + (q.question.length > 60 ? '…' : '') + '</span>'
      : '';

    return `
<div class="scsp-q-card" data-index="${index}">
  <div class="scsp-q-header">
    <span class="scsp-q-num">Vraag ${index + 1}${preview}</span>
    <div class="scsp-q-actions">
      <button type="button" class="scsp-up-btn" title="Omhoog"   ${index === 0 ? 'disabled' : ''}>↑</button>
      <button type="button" class="scsp-down-btn" title="Omlaag" ${index === questions.length - 1 ? 'disabled' : ''}>↓</button>
      <button type="button" class="scsp-delete-btn" title="Verwijder">×</button>
    </div>
  </div>
  <div class="scsp-q-body${isCollapsed ? ' collapsed' : ''}">
    <div class="scsp-row">
      <label>Categorie <span class="scsp-hint">(optioneel, bijv. "Evolutie")</span></label>
      <input type="text" data-field="category" value="${esc(q.category)}"
             placeholder="bijv. Biologie, Evolutie, Fysica…">
    </div>
    <div class="scsp-row">
      <label>Vraag <span class="scsp-required">*</span></label>
      <textarea data-field="question" rows="2"
                placeholder="Typ hier de vraag…">${esc(q.question)}</textarea>
    </div>
    <div class="scsp-row">
      <label>Antwoordopties
        <span class="scsp-hint">(klik het rondje links om het juiste antwoord aan te geven)</span>
      </label>
      <div class="scsp-options">
        ${['A', 'B', 'C', 'D'].map((letter, oi) => `
        <div class="scsp-opt">
          <input type="radio" name="correct_${index}" data-field="correct"
                 value="${oi}" ${parseInt(q.correct, 10) === oi ? 'checked' : ''}>
          <span class="scsp-opt-letter">${letter}</span>
          <input type="text" data-field="option-${oi}"
                 value="${esc((q.options || [])[oi])}"
                 placeholder="Antwoord ${letter}">
        </div>`).join('')}
      </div>
    </div>
    <div class="scsp-row">
      <label>Uitleg <span class="scsp-hint">(wordt getoond na beantwoording)</span></label>
      <textarea data-field="explanation" rows="2"
                placeholder="Korte uitleg over het juiste antwoord…">${esc(q.explanation)}</textarea>
    </div>
  </div>
</div>`;
  }

  // ---- Feit of Fabel card template ------------------------------------------

  function renderFeitCard(q, index) {
    const isCollapsed = !!collapsed[index];
    const preview = isCollapsed && q.statement
      ? '<span class="scsp-q-toggle" style="margin-left:8px;color:#888;font-size:12px">' + esc(q.statement.substring(0, 60)) + (q.statement.length > 60 ? '…' : '') + '</span>'
      : '';
    const isFeit  = q.answer === true  || q.answer === 'true';
    const isFabel = q.answer === false || q.answer === 'false';

    return `
<div class="scsp-q-card feit-card" data-index="${index}">
  <div class="scsp-q-header">
    <span class="scsp-q-num">Uitspraak ${index + 1}${preview}</span>
    <div class="scsp-q-actions">
      <button type="button" class="scsp-up-btn"   title="Omhoog"  ${index === 0 ? 'disabled' : ''}>↑</button>
      <button type="button" class="scsp-down-btn" title="Omlaag"  ${index === questions.length - 1 ? 'disabled' : ''}>↓</button>
      <button type="button" class="scsp-delete-btn" title="Verwijder">×</button>
    </div>
  </div>
  <div class="scsp-q-body${isCollapsed ? ' collapsed' : ''}">
    <div class="scsp-row scsp-row-inline">
      <div style="flex:0 0 70px">
        <label>Icoon</label>
        <input type="text" data-field="icon" class="scsp-icon-input"
               value="${esc(q.icon || '🔬')}" placeholder="🔬">
      </div>
      <div style="flex:1">
        <label>Antwoord <span class="scsp-required">*</span></label>
        <div class="scsp-radio-group">
          <label class="scsp-radio-label scsp-feit">
            <input type="radio" name="answer_${index}" data-field="answer"
                   value="true" ${isFeit ? 'checked' : ''}>
            ✓ Feit
          </label>
          <label class="scsp-radio-label scsp-fabel">
            <input type="radio" name="answer_${index}" data-field="answer"
                   value="false" ${isFabel ? 'checked' : ''}>
            ✗ Fabel
          </label>
        </div>
      </div>
    </div>
    <div class="scsp-row">
      <label>Uitspraak <span class="scsp-required">*</span></label>
      <textarea data-field="statement" rows="2"
                placeholder="Typ hier de uitspraak (zonder aanhalingstekens)…">${esc(q.statement)}</textarea>
    </div>
    <div class="scsp-row">
      <label>Uitleg <span class="scsp-hint">(wordt getoond na beantwoording)</span></label>
      <textarea data-field="explanation" rows="2"
                placeholder="Waarom is dit feit of fabel?…">${esc(q.explanation)}</textarea>
    </div>
  </div>
</div>`;
  }

  // ---- Read all card fields back into `questions` array --------------------

  function serializeToState() {
    const cards = document.querySelectorAll('.scsp-q-card');
    const type  = gameType();
    const result = [];

    cards.forEach(card => {
      const f = name => card.querySelector(`[data-field="${name}"]`);

      if (type === 'quiz') {
        result.push({
          category:    (f('category')?.value    || '').trim(),
          question:    (f('question')?.value    || '').trim(),
          options:     [0, 1, 2, 3].map(i => (f(`option-${i}`)?.value || '').trim()),
          correct:     parseInt(card.querySelector('[data-field="correct"]:checked')?.value ?? '0', 10),
          explanation: (f('explanation')?.value || '').trim(),
        });
      } else {
        const answerEl = card.querySelector('[data-field="answer"]:checked');
        result.push({
          icon:        (f('icon')?.value        || '🔬').trim(),
          statement:   (f('statement')?.value   || '').trim(),
          answer:      answerEl ? answerEl.value === 'true' : true,
          explanation: (f('explanation')?.value || '').trim(),
        });
      }
    });

    questions = result;
  }

  // ---- Serialize on form submit --------------------------------------------

  function serialize() {
    serializeToState();
    const jsonInput = document.getElementById('scsp_questions_json');
    if (jsonInput) {
      jsonInput.value = JSON.stringify(questions);
    }
  }

  // ---- Update count hint ---------------------------------------------------

  function updateCountHint() {
    const hint = document.getElementById('scsp-count-hint');
    if (!hint) return;
    const n    = questions.length;
    const type = gameType();
    const noun = type === 'quiz' ? (n === 1 ? 'vraag' : 'vragen') : (n === 1 ? 'uitspraak' : 'uitspraken');
    hint.textContent = n === 0
      ? 'Voeg minimaal 5 ' + noun + ' toe voor een goed spel.'
      : n + ' ' + noun + ' toegevoegd.';
  }

  // ---- JSON IMPORT ---------------------------------------------------------

  function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
    const MAX_ITEMS = 100;
    if (file.size > MAX_SIZE) {
      showFeedback('error', 'Bestand te groot. Maximum bestandsgrootte is 5 MB.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const data = JSON.parse(event.target.result);

        if (!Array.isArray(data) || data.length === 0) {
          showFeedback('error', 'Ongeldig bestand: verwacht een JSON-array met minimaal één vraag.');
          return;
        }

        if (data.length > MAX_ITEMS) {
          showFeedback('error', 'Te veel items in dit bestand. Maximum is ' + MAX_ITEMS + '.');
          return;
        }

        const type       = gameType();
        const validation = validateImport(data, type);
        if (!validation.ok) {
          showFeedback('error', validation.message);
          return;
        }

        // Normalize imported data to match expected shape
        const normalized = data.map(q => type === 'quiz'
          ? {
              category:    String(q.category    || '').trim(),
              question:    String(q.question    || '').trim(),
              options:     (Array.isArray(q.options) ? q.options : []).map(o => String(o).trim()),
              correct:     Math.max(0, Math.min(3, parseInt(q.correct ?? 0, 10))),
              explanation: String(q.explanation || '').trim(),
            }
          : {
              icon:        String(q.icon        || '🔬').trim(),
              statement:   String(q.statement   || '').trim(),
              answer:      q.answer === true || q.answer === 'true',
              explanation: String(q.explanation || '').trim(),
            }
        );

        // If questions already exist, ask what to do
        if (questions.length > 0) {
          const append = confirm(
            normalized.length + ' ' + (type === 'quiz' ? 'vragen' : 'uitspraken') +
            ' gevonden in het bestand.\n\n' +
            'OK  →  Toevoegen aan bestaande vragen\n' +
            'Annuleren  →  Bestaande vragen vervangen'
          );
          serializeToState();
          questions = append ? [...questions, ...normalized] : normalized;
        } else {
          questions = normalized;
        }

        renderAll();
        updateCountHint();
        showFeedback(
          'success',
          normalized.length + ' ' + (type === 'quiz' ? 'vragen' : 'uitspraken') +
          ' succesvol geïmporteerd uit "' + file.name + '".'
        );

      } catch (err) {
        showFeedback('error', 'Kon het bestand niet lezen. Controleer of het een geldig JSON-bestand is.');
      }

      // Reset het file-input zodat hetzelfde bestand nogmaals te kiezen is
      e.target.value = '';
    };

    reader.readAsText(file, 'UTF-8');
  }

  function validateImport(data, type) {
    const missing = type === 'quiz'
      ? data.filter(q => !q.question || !Array.isArray(q.options) || q.options.length < 2)
      : data.filter(q => !q.statement);

    if (missing.length > 0) {
      const noun = type === 'quiz'
        ? 'vragen missen het veld "question" of "options"'
        : 'uitspraken missen het veld "statement"';
      return { ok: false, message: missing.length + ' ' + noun + '.' };
    }
    return { ok: true };
  }

  // ---- JSON EXPORT ---------------------------------------------------------

  function handleExport() {
    serializeToState();

    if (questions.length === 0) {
      alert('Er zijn nog geen vragen om te exporteren.');
      return;
    }

    const json     = JSON.stringify(questions, null, 2);
    const blob     = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url      = URL.createObjectURL(blob);
    const title    = document.getElementById('title')?.value || 'vragen';
    const filename = title.toLowerCase()
                         .replace(/[^a-z0-9]+/gi, '-')
                         .replace(/^-+|-+$/g, '') + '.json';

    const a = document.createElement('a');
    a.href     = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ---- FEEDBACK BANNER -----------------------------------------------------

  function showFeedback(type, message) {
    const el = document.getElementById('scsp-import-feedback');
    if (!el) return;
    const colors = {
      success: { bg: '#f0fdf4', border: '#86efac', color: '#166534' },
      error:   { bg: '#fef2f2', border: '#fca5a5', color: '#991b1b' },
    };
    const c = colors[type] || colors.error;

    const box = document.createElement('div');
    box.style.padding = '8px 12px';
    box.style.borderRadius = '4px';
    box.style.fontSize = '13px';
    box.style.background = c.bg;
    box.style.border = '1px solid ' + c.border;
    box.style.color = c.color;
    box.textContent = String(message || '');

    el.replaceChildren(box);

    // Auto-hide after 6 seconds
    setTimeout(() => { if (el) el.replaceChildren(); }, 6000);
  }

  // ---- SAMPLE FORMAT PANEL -------------------------------------------------

  const SAMPLE = {
    quiz: JSON.stringify([
      {
        category:    'Evolutie',
        question:    'Wie publiceerde in 1859 "On the Origin of Species"?',
        options:     ['Gregor Mendel', 'Charles Darwin', 'Alfred Wallace', 'Thomas Huxley'],
        correct:     1,
        explanation: 'Charles Darwin legde hiermee de basis voor de moderne evolutietheorie.',
      },
      {
        category:    'Evolutie',
        question:    'Hoe oud is de aarde naar huidige schatting?',
        options:     ['2,5 miljard jaar', '4,5 miljard jaar', '6 miljard jaar', '10 miljard jaar'],
        correct:     1,
        explanation: 'Radiometrische datering wijst op een leeftijd van ~4,54 miljard jaar.',
      },
    ], null, 2),

    feit: JSON.stringify([
      {
        icon:        '🦎',
        statement:   'Vogels zijn directe afstammelingen van dinosauriërs.',
        answer:      true,
        explanation: 'Vogels evolueerden uit theropode dinosauriërs; ze zijn in feite levende dino\'s.',
      },
      {
        icon:        '🐟',
        statement:   'Vissen zijn de oudste gewervelde dieren op aarde.',
        answer:      true,
        explanation: 'De eerste gewervelde dieren waren primitieve visachtige wezens, zo\'n 500 miljoen jaar geleden.',
      },
    ], null, 2),
  };

  function toggleSamplePanel() {
    const panel = document.getElementById('scsp-sample-panel');
    if (!panel) return;
    const open = panel.style.display !== 'none';
    panel.style.display = open ? 'none' : 'block';
    if (!open) renderSampleCode('quiz'); // toon quiz als standaard tab
  }

  function switchSampleTab(e) {
    const tab = e.currentTarget.dataset.tab;
    document.querySelectorAll('.scsp-stab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    renderSampleCode(tab);
  }

  function renderSampleCode(tab) {
    const pre = document.getElementById('scsp-sample-code');
    if (pre) pre.textContent = SAMPLE[tab] || '';
  }

  // ---- Bootstrap -----------------------------------------------------------

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
