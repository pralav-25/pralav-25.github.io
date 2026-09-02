'use client';

import { useEffect, useRef } from 'react';

export interface HeroScrollVideoRevealProps {
  eyebrow?: string;
  heading?: string;
  tags?: string[];
  videoSrc?: string;
  title?: string;
  credit?: string;
}

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export default function HeroScrollVideoReveal({
  eyebrow = 'Creative practice · Editing',
  heading = 'A cut should feel inevitable.',
  tags = ['Story-led', 'Beat-synced', 'Short-form'],
  videoSrc = '/rb22.mp4',
  title = 'Motion with purpose.',
  credit = 'Original edit · Sinister_editzz',
}: HeroScrollVideoRevealProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const hydrateAndPlay = () => {
      if (!video.src) video.src = videoSrc;
      video.play().catch(() => {});
    };
    const videoObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) hydrateAndPlay();
        else video.pause();
      },
      { rootMargin: '30% 0px' },
    );
    videoObserver.observe(section);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      section.style.setProperty('--pin-progress', '1');
      hydrateAndPlay();
      return () => {
        videoObserver.disconnect();
        video.pause();
      };
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
      videoObserver.disconnect();
      video.pause();
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [videoSrc]);

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
            <video ref={videoRef} autoPlay muted loop playsInline preload="metadata" poster="/edit-redbull.jpg" />
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
