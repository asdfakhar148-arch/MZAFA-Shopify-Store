(() => {
  if (window.mzafaStoryScrollInitialized) return;
  window.mzafaStoryScrollInitialized = true;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compactViewport = window.matchMedia('(max-width: 749px)');

  function initializeStory(story) {
    if (story.dataset.mzafaStoryReady) return;

    const sticky = story.querySelector('.mzafa-story__sticky');
    const cards = [...story.querySelectorAll('[data-mzafa-story-card]')];
    if (!sticky || cards.length === 0) return;

    story.dataset.mzafaStoryReady = 'true';
    let frame = null;

    function setActiveCard(activeIndex) {
      cards.forEach((card, index) => {
        const isActive = index === activeIndex;
        card.classList.toggle('is-active', isActive);
        card.toggleAttribute('aria-hidden', !isActive);
        card.inert = !isActive;
      });
    }

    function updateStory() {
      frame = null;

      if (compactViewport.matches || reducedMotion.matches) {
        cards.forEach((card) => {
          card.classList.add('is-active');
          card.removeAttribute('aria-hidden');
          card.inert = false;
        });
        return;
      }

      const storyBounds = story.getBoundingClientRect();
      const scrollDistance = Math.max(story.offsetHeight - sticky.offsetHeight, 1);
      const progress = Math.min(1, Math.max(0, -storyBounds.top / scrollDistance));
      const activeIndex = Math.min(cards.length - 1, Math.floor(progress * cards.length));
      setActiveCard(activeIndex);
    }

    function requestUpdate() {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(updateStory);
    }

    document.addEventListener('scroll', requestUpdate, { passive: true, capture: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
    reducedMotion.addEventListener('change', requestUpdate);
    compactViewport.addEventListener('change', requestUpdate);
    updateStory();
  }

  function initialize(scope = document) {
    if (scope.matches?.('[data-mzafa-story]')) initializeStory(scope);
    scope.querySelectorAll?.('[data-mzafa-story]').forEach(initializeStory);
  }

  initialize();
  document.addEventListener('shopify:section:load', (event) => initialize(event.target));
})();

