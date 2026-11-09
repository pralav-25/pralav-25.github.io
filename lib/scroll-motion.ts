/** Own scroll/reveal effects independently of React and restart them on preference changes. */
const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

function mountMode(view: Window, reducedMotion: boolean) {
  const root = view.document.documentElement;
  const header = view.document.querySelector<HTMLElement>('.site-header');
  const hero = view.document.querySelector<HTMLElement>('.hero');
  const scenes = Array.from(view.document.querySelectorAll<HTMLElement>('[data-scroll-scene]'));
  const revealItems = Array.from(view.document.querySelectorAll<HTMLElement>('[data-reveal]'));

  root.classList.add('motion-ready');

  if (reducedMotion) {
    root.classList.add('motion-loaded');
    revealItems.forEach((item) => item.setAttribute('data-revealed', 'true'));
    return () => {
      root.classList.remove('motion-ready', 'motion-loaded');
      revealItems.forEach((item) => item.removeAttribute('data-revealed'));
    };
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.setAttribute('data-revealed', 'true');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );

  revealItems.forEach((item) => observer.observe(item));

  let lastScrollY = view.scrollY;
  let frame = 0;

  const updateMotion = () => {
    const scrollY = view.scrollY;
    const viewportHeight = view.innerHeight;
    const heroHeight = hero?.offsetHeight ?? viewportHeight;
    const heroProgress = clamp(scrollY / Math.max(heroHeight * 0.58, 1));

    root.style.setProperty('--hero-scroll', heroProgress.toFixed(4));
    header?.classList.toggle('is-scrolled', scrollY > 30);

    if (Math.abs(scrollY - lastScrollY) > 3) {
      header?.classList.toggle('is-scroll-hidden', scrollY > lastScrollY && scrollY > 140);
      lastScrollY = scrollY;
    }

    scenes.forEach((scene) => {
      const rect = scene.getBoundingClientRect();
      const progress = clamp((viewportHeight - rect.top) / (viewportHeight + rect.height));
      scene.style.setProperty('--view-progress', progress.toFixed(4));
    });

    frame = 0;
  };

  const requestMotionUpdate = () => {
    if (frame) return;
    frame = view.requestAnimationFrame(updateMotion);
  };

  view.addEventListener('scroll', requestMotionUpdate, { passive: true });
  view.addEventListener('resize', requestMotionUpdate, { passive: true });

  frame = view.requestAnimationFrame(() => {
    root.classList.add('motion-loaded');
    updateMotion();
  });
  const settleTimer = view.setTimeout(() => root.classList.add('motion-settled'), 1300);

  return () => {
    observer.disconnect();
    view.removeEventListener('scroll', requestMotionUpdate);
    view.removeEventListener('resize', requestMotionUpdate);
    view.clearTimeout(settleTimer);
    if (frame) view.cancelAnimationFrame(frame);
    root.classList.remove('motion-ready', 'motion-loaded', 'motion-settled');
    root.style.removeProperty('--hero-scroll');
    revealItems.forEach((item) => item.removeAttribute('data-revealed'));
    scenes.forEach((scene) => scene.style.removeProperty('--view-progress'));
    header?.classList.remove('is-scrolled', 'is-scroll-hidden');
  };
}

export function mountScrollMotion(view: Window = window) {
  const preference = view.matchMedia('(prefers-reduced-motion: reduce)');
  let cleanup = mountMode(view, preference.matches);
  const refresh = () => {
    cleanup();
    cleanup = mountMode(view, preference.matches);
  };
  preference.addEventListener('change', refresh);
  return () => {
    preference.removeEventListener('change', refresh);
    cleanup();
  };
}
