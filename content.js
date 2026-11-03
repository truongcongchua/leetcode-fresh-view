(() => {
  'use strict';
  let settings = { hideSolved: true, hideDifficulty: true, hideSubmissions: false };
  let scheduled = false;
  const marker = 'data-lcfv-hidden';
  const isProblem = () => /^\/problems\/[^/]+(?:\/|$)/.test(location.pathname);
  const normalized = element => (element.textContent || '').replace(/\s+/g, ' ').trim();

  function titleForPage() {
    const slug = location.pathname.split('/')[2];
    const links = [...document.querySelectorAll('a[href*="/problems/"]')];
    return links.find(a => {
      try {
        const url = new URL(a.href, location.href);
        return url.pathname.split('/')[2] === slug && /^\d+\.\s*\S/.test(normalized(a));
      } catch { return false; }
    }) || [...document.querySelectorAll('h1, [class*="text-title-large"]')]
      .find(el => /^\d+\.\s*\S/.test(normalized(el)) && normalized(el).length < 250);
  }

  function scan() {
    scheduled = false;
    document.querySelectorAll(`[${marker}]`).forEach(el => el.removeAttribute(marker));
    if (!isProblem()) return;
    // Verified on LeetCode's FlexLayout DOM: hide the clickable wrapper,
    // not just its nested title (which has two overlapping text elements).
    if (settings.hideSubmissions) {
      document.querySelectorAll('[id="submissions_tab"]').forEach(tab => {
        const button = tab.closest('.flexlayout__tab_button, [role="tab"]') || tab;
        button.setAttribute(marker, '');
      });
    }
    const title = titleForPage();
    if (!title) return;
    // Only inspect a few compact ancestors of the numbered problem heading.
    let scope = title.parentElement;
    for (let depth = 0; scope && scope !== document.body && depth < 5; depth++, scope = scope.parentElement) {
      if (scope.querySelector('textarea, [contenteditable="true"], .monaco-editor')) break;
      const candidates = [...scope.querySelectorAll('span, div')].filter(el =>
        settings.hideSolved && normalized(el) === 'Solved' && !el.contains(title) &&
        !el.querySelector('button, input, textarea, a')
      );
      for (const el of candidates) {
        let badge = el;
        // Include a sibling SVG/check icon, but never take the entire title row.
        for (let step = 0; step < 2; step++) {
          const parent = badge.parentElement;
          if (!parent || parent === scope || parent.contains(title) || normalized(parent) !== 'Solved') break;
          if (parent.querySelector('button, input, textarea, a')) break;
          badge = parent;
        }
        badge.setAttribute(marker, '');
      }
      // Keep walking: difficulty badges usually sit below the title row.
    }
    let difficultyScope = title.parentElement;
    for (let depth = 0; difficultyScope && depth < 10; depth++, difficultyScope = difficultyScope.parentElement) {
      // The real description panel also contains the discussion editor.
      // Its presence must not stop us before reaching the metadata row.
      if (difficultyScope === document.body) break;
      const badges = [...difficultyScope.querySelectorAll('div, span, button')].filter(el => {
        if (!settings.hideDifficulty || !/^(Easy|Medium|Hard)$/.test(normalized(el))) return false;
        if (el.contains(title) || el.querySelector('input, textarea, a')) return false;
        if (el.closest('article, p, pre, code, [contenteditable], textarea, .monaco-editor, .markdown, .elfjS, [data-track-load="description_content"]')) return false;
        // Match the compact metadata row beside Topics/Companies rather than
        // depending on one Tailwind color class, which varies across layouts.
        let row = el.parentElement;
        for (let step = 0; row && step < 3; step++, row = row.parentElement) {
          if (row.contains(title)) break;
          const text = normalized(row);
          if (text.length < 200 && [...row.querySelectorAll('button, span, div')]
            .some(item => /^(Topics|Companies)$/.test(normalized(item)))) return true;
        }
        return /text-difficulty-(easy|medium|hard)/.test(el.className || '');
      });
      badges.forEach(el => el.setAttribute(marker, ''));
      if (badges.length) break;
    }
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(scan);
  }
  function applySettings(values) {
    settings = {
      hideSolved: values.hideSolved ?? values.enabled ?? true,
      hideDifficulty: values.hideDifficulty ?? values.enabled ?? true,
      hideSubmissions: values.hideSubmissions ?? false
    };
    document.documentElement.removeAttribute('data-lcfv-off');
    schedule();
  }
  const observer = new MutationObserver(schedule);
  function start() {
    observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
    chrome.storage.local.get(['enabled', 'hideSolved', 'hideDifficulty', 'hideSubmissions']).then(applySettings);
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && ['enabled', 'hideSolved', 'hideDifficulty', 'hideSubmissions'].some(key => key in changes)) {
        chrome.storage.local.get(['enabled', 'hideSolved', 'hideDifficulty', 'hideSubmissions']).then(applySettings);
      }
    });
    chrome.runtime.onMessage.addListener((message, sender, reply) => {
      if (message.type !== 'fresh-view-settings') return;
      chrome.storage.local.get(['enabled', 'hideSolved', 'hideDifficulty', 'hideSubmissions']).then(values => {
        applySettings(values);
        scan();
        reply({ applied: true, problemPage: isProblem(), titleFound: Boolean(titleForPage()), submissionsFound: Boolean(document.getElementById('submissions_tab')) });
      });
      return true;
    });
    addEventListener('popstate', schedule);
    schedule();
  }
  if (document.documentElement) start();
  else addEventListener('DOMContentLoaded', start, { once: true });
})();
