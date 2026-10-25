/* Progressive enhancement only: no requests, tracking or persistent storage. */
(() => {
  'use strict';

  const form = document.getElementById('answer-form');
  const checkButton = document.getElementById('check-answer');
  const feedback = document.getElementById('answer-feedback');
  const result = document.getElementById('answer-result');
  const quizFallback = document.getElementById('quiz-fallback');
  const answers = {
    a: 'Hai scelto A. Il tono è sicuro, ma i fatti non reggono.',
    b: 'Hai scelto B. È la risposta meglio fondata: va comunque verificata.'
  };

  if (form && checkButton && feedback && result) {
    const selectedAnswer = () => form.querySelector('input[name="answer"]:checked');

    form.addEventListener('change', (event) => {
      if (!event.target.matches('input[name="answer"]')) return;
      const selected = selectedAnswer();
      checkButton.disabled = !selected || !Object.hasOwn(answers, selected.value);
      feedback.hidden = true;
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const selected = selectedAnswer();
      if (!selected || !Object.hasOwn(answers, selected.value)) return;
      result.textContent = answers[selected.value];
      feedback.hidden = false;
      result.setAttribute('tabindex', '-1');
      result.focus();
    });

    const selected = selectedAnswer();
    checkButton.disabled = !selected || !Object.hasOwn(answers, selected.value);
    checkButton.hidden = false;
    if (quizFallback) quizFallback.hidden = true;
  }

  const selector = document.getElementById('prompt-selector');
  const panels = Array.from(document.querySelectorAll('article.prompt-panel'));
  if (!selector || !panels.length) return;

  // Invalidate a pending clipboard operation when the reader changes prompt.
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
          // Successful Clipboard API use never moves the reader's focus.
          return;
        } catch {
          // Offer the selected plain text when clipboard access is unavailable.
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
})();
