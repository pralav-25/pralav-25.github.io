'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

/** Optional page-level owner for standalone scenes. Mount once per page. */
export function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const lenis = new Lenis({ autoRaf: false, anchors: true });
      const tick = (time: number) => lenis.raf(time * 1000);
      const syncScroll = () => ScrollTrigger.update();
      lenis.on('scroll', syncScroll);
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        lenis.off('scroll', syncScroll);
        lenis.destroy();
      };
    });
    return () => media.revert();
  }, []);

  return null;
}
