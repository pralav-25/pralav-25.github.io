'use client';

import { useEffect, useRef, useState } from 'react';

export interface HeroScrollVideoRevealProps {
  eyebrow?: string;
  heading?: string;
  tags?: string[];
  videoSrc?: string;
  mobileVideoSrc?: string;
  title?: string;
  credit?: string;
}

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export default function HeroScrollVideoReveal({
  eyebrow = 'Creative practice · Editing',
  heading = 'A cut should feel inevitable.',
  tags = ['Story-led', 'Beat-synced', 'Short-form'],
  videoSrc = '/rb22.mp4',
  mobileVideoSrc = '/rb22-mobile.mp4',
  title = 'Motion with purpose.',
  credit = 'Original edit · Sinister_editzz',
}: HeroScrollVideoRevealProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playbackRequested, setPlaybackRequested] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let inView = false;
    const syncPlayback = () => {
      if (inView && !document.hidden && (playbackRequested ?? !preference.matches)) {
        video.play().catch(() => {});
      } else video.pause();
    };
    const videoObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncPlayback();
    }, { rootMargin: '30% 0px' });
    videoObserver.observe(section);
    document.addEventListener('visibilitychange', syncPlayback);
    preference.addEventListener('change', syncPlayback);

    let frame = 0;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
      section.style.setProperty('--pin-progress', preference.matches ? '1' : clamp(-rect.top / travel).toFixed(4));
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
      document.removeEventListener('visibilitychange', syncPlayback);
      preference.removeEventListener('change', syncPlayback);
      video.pause();
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [playbackRequested]);

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
            <video ref={videoRef} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} muted loop playsInline preload="none" poster="/edit-redbull.jpg">
              <source src={mobileVideoSrc} media="(max-width: 760px)" type="video/mp4" />
              <source src={videoSrc} type="video/mp4" />
            </video>
          </div>
          <div className="reel-reveal-shade" />
        </div>

        <div className="reel-reveal-outro">
          <span>{credit}</span>
          <strong>{title}</strong>
          <p>Keep scrolling to play the full selection.</p>

        </div>
          <button type="button" className="reel-motion-toggle" onClick={() => setPlaybackRequested(!isPlaying)} aria-pressed={isPlaying}>
            {isPlaying ? 'Pause background video' : 'Play background video'}
          </button>
        <span className="reel-reveal-progress" aria-hidden="true" />
      </div>
    </section>
  );
}
