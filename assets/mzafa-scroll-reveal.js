(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;

  const revealSelector = [
    '#MainContent > .shopify-section:not(:first-child)',
    '.mzafa-grid3-card',
    '.mzafa-split-card',
    '.mzafa-trust-item',
  ].join(',');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.1 }
  );

  function registerReveals(scope = document) {
    const targets = scope.matches?.(revealSelector)
      ? [scope, ...scope.querySelectorAll(revealSelector)]
      : [...scope.querySelectorAll(revealSelector)];

    targets.forEach((target, index) => {
      if (target.dataset.mzafaRevealReady) return;

      target.dataset.mzafaRevealReady = 'true';
      target.setAttribute('data-mzafa-reveal', '');
      target.style.setProperty('--mzafa-reveal-delay', `${Math.min((index % 4) * 80, 240)}ms`);
      observer.observe(target);
    });
  }

  registerReveals();
  document.documentElement.classList.add('mzafa-reveal-enabled');

  document.addEventListener('shopify:section:load', (event) => registerReveals(event.target));
})();

