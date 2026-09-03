'use client';

import { useEffect } from 'react';

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function ScrollMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const header = document.querySelector<HTMLElement>('.site-header');
    const hero = document.querySelector<HTMLElement>('.hero');
    const scenes = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-scene]'));
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

    let lastScrollY = window.scrollY;
    let frame = 0;

    const updateMotion = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
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
      frame = window.requestAnimationFrame(updateMotion);
    };

    window.addEventListener('scroll', requestMotionUpdate, { passive: true });
    window.addEventListener('resize', requestMotionUpdate, { passive: true });

    const loadFrame = window.requestAnimationFrame(() => {
      root.classList.add('motion-loaded');
      updateMotion();
    });
    const settleTimer = window.setTimeout(() => root.classList.add('motion-settled'), 1300);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', requestMotionUpdate);
      window.removeEventListener('resize', requestMotionUpdate);
      window.cancelAnimationFrame(loadFrame);
      window.clearTimeout(settleTimer);
      if (frame) window.cancelAnimationFrame(frame);
      root.classList.remove('motion-ready', 'motion-loaded', 'motion-settled');
      root.style.removeProperty('--hero-scroll');
      revealItems.forEach((item) => item.removeAttribute('data-revealed'));
      scenes.forEach((scene) => scene.style.removeProperty('--view-progress'));
    };
  }, []);

  return null;
}
