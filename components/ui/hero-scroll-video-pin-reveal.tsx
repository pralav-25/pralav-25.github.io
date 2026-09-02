'use client';

import { useEffect, useRef } from 'react';

export interface HeroScrollVideoRevealProps {
  eyebrow?: string;
  heading?: string;
  tags?: string[];
  videoId?: string;
  title?: string;
  credit?: string;
}

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export default function HeroScrollVideoReveal({
  eyebrow = 'Creative practice · Editing',
  heading = 'A cut should feel inevitable.',
  tags = ['Story-led', 'Beat-synced', 'Short-form'],
  videoId = 'U3FacqdL5e4',
  title = 'Motion with purpose.',
  credit = 'Original edit · Sinister_editzz',
}: HeroScrollVideoRevealProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      section.style.setProperty('--pin-progress', '1');
      return;
    }

    let frame = 0;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
      section.style.setProperty('--pin-progress', clamp(-rect.top / travel).toFixed(4));
      frame = 0;
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const videoSrc = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&rel=0&disablekb=1`;

  return (
    <section className="reel-reveal" id="editing" ref={sectionRef} aria-labelledby="reel-reveal-title">
      <div className="reel-reveal-sticky">
        <div className="reel-reveal-intro">
          <p>{eyebrow}</p>
          <h2 id="reel-reveal-title">{heading}</h2>
          <div aria-label="Editing strengths">
            {tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </div>

        <div className="reel-reveal-window" aria-hidden="true">
          <div className="reel-reveal-backdrop" />
          <div className="reel-reveal-frame">
            <iframe
              src={videoSrc}
              title="Muted preview of Pralav Singh's Red Bull editing sample"
              allow="autoplay; encrypted-media; picture-in-picture"
              loading="lazy"
              tabIndex={-1}
            />
          </div>
          <div className="reel-reveal-shade" />
        </div>

        <div className="reel-reveal-outro">
          <span>{credit}</span>
          <strong>{title}</strong>
          <p>Keep scrolling to play the full selection.</p>
        </div>
        <span className="reel-reveal-progress" aria-hidden="true" />
      </div>
    </section>
  );
}
