/* Progressive enhancement: no requests, tracking or persistent storage. */
(() => {
  'use strict';

  const dialogueSelector = document.getElementById('dialogue-selector');
  const dialoguePanels = document.getElementById('dialogue-panels');
  const compareButton = document.getElementById('compare-dialogues');
  const comparison = document.getElementById('dialogue-comparison');
  const dialogueStatus = document.getElementById('dialogue-status');
  const dialogueA = document.getElementById('dialogue-a');
  const dialogueB = document.getElementById('dialogue-b');

  if (dialogueSelector && dialoguePanels && compareButton && comparison && dialogueStatus && dialogueA && dialogueB) {
    const radios = Array.from(dialogueSelector.querySelectorAll('input[name="dialogue-view"]'));

    function showDialogue(value, announce = true) {
      if (value !== 'a' && value !== 'b') return;
      dialogueA.hidden = value !== 'a';
      dialogueB.hidden = value !== 'b';
      comparison.hidden = true;
      dialoguePanels.classList.remove('is-comparing');
      compareButton.setAttribute('aria-pressed', 'false');
      dialogueStatus.textContent = announce ? `È visibile il dialogo ${value.toUpperCase()}.` : '';
    }

    dialogueSelector.addEventListener('change', (event) => {
      if (event.target.matches('input[name="dialogue-view"]') && event.target.checked) {
        showDialogue(event.target.value);
      }
    });

    compareButton.addEventListener('click', () => {
      radios.forEach((radio) => { radio.checked = false; });
      dialogueA.hidden = false;
      dialogueB.hidden = false;
      comparison.hidden = false;
      dialoguePanels.classList.add('is-comparing');
      compareButton.setAttribute('aria-pressed', 'true');
      dialogueStatus.textContent = 'Confronto attivo: entrambi i dialoghi sono visibili.';
      // Focus stays on the button; choosing either radio returns to one dialogue.
    });

    const initial = radios.find((radio) => radio.checked) || radios.find((radio) => radio.value === 'a');
    if (initial) {
      initial.checked = true;
      showDialogue(initial.value, false);
      dialogueSelector.hidden = false;
      compareButton.hidden = false;
    }
  }

  const selector = document.getElementById('prompt-selector');
  const panels = Array.from(document.querySelectorAll('article.prompt-panel'));

  if (selector && panels.length) {
    // A change of operation invalidates pending clipboard responses and focus moves.
    let copyRequest = 0;

    function showSelectedPrompt() {
      const selected = selector.querySelector('input[name="prompt"]:checked');
      if (!selected || !panels.some((panel) => panel.id === `prompt-${selected.value}`)) return;
      copyRequest += 1;
      panels.forEach((panel) => {
        panel.hidden = panel.id !== `prompt-${selected.value}`;
        const status = panel.querySelector('.copy-status');
        const fallback = panel.querySelector('.copy-fallback');
        if (status) status.textContent = '';
        if (fallback) fallback.hidden = true;
      });
    }

    selector.addEventListener('change', (event) => {
      if (event.target.matches('input[name="prompt"]')) showSelectedPrompt();
    });

    panels.forEach((panel) => {
      const text = panel.querySelector('.prompt-text');
      const button = panel.querySelector('.copy-prompt');
      const status = panel.querySelector('.copy-status');
      const fallback = panel.querySelector('.copy-fallback');
      const textarea = fallback && fallback.querySelector('textarea');
      if (!text || !button || !status || !fallback || !textarea) return;

      button.addEventListener('click', async (event) => {
        event.preventDefault();
        const content = text.textContent.trim();
        const request = ++copyRequest;
        const isCurrent = () => request === copyRequest && !panel.hidden;
        status.textContent = '';
        fallback.hidden = true;

        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
          try {
            await navigator.clipboard.writeText(content);
            if (isCurrent()) status.textContent = 'Prompt copiato negli appunti.';
            // Successful Clipboard API use does not move the reader's focus.
            return;
          } catch {
            // Fall back to selected plain text when clipboard access is unavailable.
          }
        }

        if (!isCurrent()) return;
        textarea.value = content;
        fallback.hidden = false;
        textarea.focus();
        textarea.select();

        let copied = false;
        try {
          if (typeof document.execCommand === 'function') {
            copied = document.execCommand('copy');
          }
        } catch {
          copied = false;
        }

        if (!isCurrent()) return;
        if (copied) {
          status.textContent = 'Prompt copiato negli appunti.';
          button.focus({ preventScroll: true });
          fallback.hidden = true;
        } else {
          status.textContent = 'La copia automatica non è riuscita. Il testo è selezionato: usa Ctrl+C, ⌘C o il comando Copia del tuo dispositivo.';
        }
      });

      button.hidden = false;
    });

    showSelectedPrompt();
    selector.hidden = false;
  }

  const essay = document.getElementById('saggio-completo');
  if (essay) {
    function revealEssayFragment() {
      let fragment;
      try {
        fragment = decodeURIComponent(window.location.hash.slice(1));
      } catch {
        return;
      }
      if (!fragment) return;
      const target = document.getElementById(fragment);
      if (!target || !essay.contains(target)) return;
      essay.open = true;
      target.scrollIntoView({ behavior: 'auto', block: 'start' });
      if (target.hasAttribute('tabindex')) target.focus({ preventScroll: true });
    }

    window.addEventListener('hashchange', revealEssayFragment);
    revealEssayFragment();
  }
})();
