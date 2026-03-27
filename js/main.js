document.addEventListener('DOMContentLoaded', () => {
  /* ── Terminal animation data ─────────────────────────── */
  const TERMINAL_LINES = [
    { type: 'comment', text: '# Install via Homebrew' },
    { type: 'command', segments: [
      { text: 'brew install', cls: 't-cmd' },
      { text: 'mcs-cli/tap/mcs', cls: 't-arg' }
    ]},
    { type: 'blank' },
    { type: 'comment', text: '# Add a tech pack' },
    { type: 'command', segments: [
      { text: 'mcs pack add', cls: 't-cmd' },
      { text: 'mcs-cli/memory', cls: 't-arg' }
    ]},
    { type: 'output', segments: [
      { text: '[OK]', cls: 't-success' },
      { text: " Pack 'Memory' added successfully.", cls: 't-out' }
    ]},
    { type: 'blank' },
    { type: 'comment', text: '# Sync your project' },
    { type: 'command', segments: [
      { text: 'cd', cls: 't-cmd' },
      { text: '~/Developer/my-project', cls: 't-path' }
    ]},
    { type: 'command', segments: [
      { text: 'mcs sync', cls: 't-cmd' }
    ]},
    { type: 'output', segments: [
      { text: '[OK]', cls: 't-success' },
      { text: ' Updated .mcs-project', cls: 't-out' }
    ]},
    { type: 'blank' },
    { type: 'comment', text: '# Verify everything' },
    { type: 'command', segments: [
      { text: 'mcs doctor', cls: 't-cmd' }
    ]},
    { type: 'output', segments: [
      { text: '✓', cls: 't-success' },
      { text: ' Dependencies: ', cls: 't-out' },
      { text: 'all installed', cls: 't-dim' }
    ]},
    { type: 'output', segments: [
      { text: '✓', cls: 't-success' },
      { text: ' MCP Servers: ', cls: 't-out' },
      { text: 'registered', cls: 't-dim' }
    ]},
    { type: 'output', segments: [
      { text: '✓', cls: 't-success' },
      { text: ' Hooks: ', cls: 't-out' },
      { text: 'present and executable', cls: 't-dim' }
    ]},
    { type: 'output', segments: [
      { text: '3 passed', cls: 't-success' },
      { text: ', 0 issues', cls: 't-dim' }
    ]}
  ];

  const CHAR_DELAY = 45;
  const LINE_PAUSE = 150;
  const OUTPUT_PAUSE = 500;

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function createSpan(cls, text) {
    const el = document.createElement('span');
    el.className = cls;
    if (text) el.textContent = text;
    return el;
  }

  async function animateTerminal(body) {
    body.style.height = body.offsetHeight + 'px';
    body.textContent = '';
    body.classList.add('animated');

    const cursor = createSpan('terminal-cursor', '\u2588');
    body.appendChild(cursor);

    for (const line of TERMINAL_LINES) {
      if (line.type === 'blank') {
        body.insertBefore(document.createTextNode('\n'), cursor);
        continue;
      }

      if (line.type === 'comment') {
        await delay(LINE_PAUSE);
        body.insertBefore(createSpan('t-comment', line.text), cursor);
        body.insertBefore(document.createTextNode('\n'), cursor);
        continue;
      }

      if (line.type === 'command') {
        await delay(LINE_PAUSE);

        // Prompt
        body.insertBefore(createSpan('t-prompt', '$'), cursor);
        body.insertBefore(document.createTextNode(' '), cursor);

        // Type each segment character by character
        for (let s = 0; s < line.segments.length; s++) {
          if (s > 0) {
            body.insertBefore(document.createTextNode(' '), cursor);
          }
          const seg = line.segments[s];
          const span = createSpan(seg.cls);
          body.insertBefore(span, cursor);

          for (const ch of seg.text) {
            span.textContent += ch;
            await delay(CHAR_DELAY);
          }
        }

        body.insertBefore(document.createTextNode('\n'), cursor);
        continue;
      }

      if (line.type === 'output') {
        await delay(OUTPUT_PAUSE);

        for (const seg of line.segments) {
          body.insertBefore(createSpan(seg.cls, seg.text), cursor);
        }
        body.insertBefore(document.createTextNode('\n'), cursor);
        continue;
      }
    }
  }

  /* ── Intersection Observer ──────────────────────────── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const terminalEl = document.querySelector('.terminal');
  let terminalAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        if (entry.target === terminalEl && !terminalAnimated) {
          terminalAnimated = true;
          const body = terminalEl.querySelector('.terminal-body');
          if (body) {
            if (prefersReducedMotion) {
              body.classList.add('animated');
            } else {
              setTimeout(() => animateTerminal(body), 900);
            }
          }
        }
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
});
