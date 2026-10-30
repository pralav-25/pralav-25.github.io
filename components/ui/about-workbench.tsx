'use client';

import { useEffect, useId, useRef } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Code2, Film, Play } from 'lucide-react';

const clamp = (value: number) => Math.min(1, Math.max(0, value));

/** A portfolio-specific composition built from Pralav's software and editing work. */
export function AboutWorkbench() {
  const rootRef = useRef<HTMLElement>(null);
  const titleId = `workbench-${useId().replace(/:/g, '')}`;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const preference = window.matchMedia('(min-width: 761px) and (prefers-reduced-motion: no-preference)');
    let inView = false;
    let frame = 0;

    const renderDepth = () => {
      frame = 0;
      if (!preference.matches) return;
      const rect = root.getBoundingClientRect();
      const progress = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height));
      root.style.setProperty('--workbench-depth', ((progress - .5) * 2).toFixed(4));
    };
    const requestDepth = () => {
      if (inView && preference.matches && !frame) frame = window.requestAnimationFrame(renderDepth);
    };
    const resetPreference = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      root.style.removeProperty('--workbench-depth');
      requestDepth();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      requestDepth();
    }, { rootMargin: '20% 0px' });
    observer.observe(root);
    window.addEventListener('scroll', requestDepth, { passive: true });
    window.addEventListener('resize', requestDepth, { passive: true });
    preference.addEventListener('change', resetPreference);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', requestDepth);
      window.removeEventListener('resize', requestDepth);
      preference.removeEventListener('change', resetPreference);
      if (frame) window.cancelAnimationFrame(frame);
      root.style.removeProperty('--workbench-depth');
    };
  }, []);

  return (
    <figure className="about-workbench" ref={rootRef} aria-labelledby={titleId}>
      <div className="workbench-grid" aria-hidden="true" />
      <div className="workbench-header"><span className="workbench-mark">P/S</span><span>Pralav Singh<br />Code &amp; motion</span><span className="workbench-cross" aria-hidden="true">✳</span></div>

      <a className="workbench-project" href="https://chroma-tawny.vercel.app/" target="_blank" rel="noreferrer" aria-label="Explore CHROMA, my creative coding project">
        <div className="workbench-project-bar"><Code2 aria-hidden="true" /><span>CHROMA / Creative code</span><ArrowUpRight aria-hidden="true" /></div>
        <div className="workbench-project-image"><Image src="/chroma-card.jpg" alt="CHROMA shader studio displaying Pralav's violet and orange canvas and palette controls" fill sizes="(max-width: 760px) 80vw, 36vw" /></div>
      </a>

      <p className="workbench-title" id={titleId}><span>Code.</span><span>Cut.</span><span>Repeat.</span></p>
      <span className="workbench-side-note" aria-hidden="true">Idea → interface → frame</span>

      <a className="workbench-film" href="#editing" aria-label="Watch Andrewww, my original video edit">
        <div className="workbench-film-sprockets" aria-hidden="true" />
        <div className="workbench-film-image"><Image src="/andrewww-poster.png" alt="A still from the Andrewww video edit by Sinister_editzz" fill sizes="(max-width: 760px) 78vw, 36vw" /><span className="workbench-film-play"><Play aria-hidden="true" /></span></div>
        <div className="workbench-film-label"><Film aria-hidden="true" /><span>Andrewww / Original edit</span><ArrowUpRight aria-hidden="true" /></div>
      </a>

      <figcaption className="workbench-caption"><span>Two crafts.<br /><strong>One curious mind.</strong></span><span className="workbench-signature" aria-hidden="true">PS<span>↗</span></span></figcaption>
    </figure>
  );
}
