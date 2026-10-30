'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';

export interface HeroScrollVideoRevealProps {
  eyebrow?: string;
  heading?: string;
  tags?: string[];
  videoSrc?: string;
  mobileVideoSrc?: string;
  posterSrc?: string;
  title?: string;
  credit?: string;
  playbackRange?: { start: number; end: number } | null;
}

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const smoothRange = (value: number, start: number, end: number) => {
  const amount = clamp((value - start) / (end - start));
  return amount * amount * (3 - 2 * amount);
};

function headlineLines(heading: string, compact: boolean) {
  if (heading === 'In motion.') return ['IN MOTION.'];
  const words = heading.toUpperCase().split(/\s+/);
  const target = Math.ceil(heading.length / (compact ? 3 : 2));
  const lines: string[] = [];
  for (const word of words) {
    const last = lines.length - 1;
    if (last < 0 || lines[last].length + word.length > target) lines.push(word);
    else lines[last] += ` ${word}`;
  }
  return lines;
}

export default function HeroScrollVideoReveal({
  eyebrow = 'Selected film',
  heading = 'In motion.',
  tags = [],
  videoSrc = '/andrewww-original.mp4',
  mobileVideoSrc,
  posterSrc = '/andrewww-poster.png',
  title = 'Andrewww',
  credit = 'An edit by Sinister_editzz',
  playbackRange = null,
}: HeroScrollVideoRevealProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const maskRef = useRef<SVGSVGElement>(null);
  const glyphGroupRef = useRef<SVGGElement>(null);
  const outlineRef = useRef<SVGGElement>(null);
  const [size, setSize] = useState({ width: 1440, height: 900 });
  const [playbackRequested, setPlaybackRequested] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const maskId = `reel-type-${useId().replace(/:/g, '')}`;
  const compact = size.width <= 760;
  const lines = useMemo(() => headlineLines(heading, compact), [heading, compact]);
  const longestLine = Math.max(...lines.map((line) => line.length));
  const fontSize = Math.min(size.width * .9 / (longestLine * .48), size.height * .5 / lines.length);
  const lineHeight = fontSize * .94;
  const firstBaseline = size.height * .5 - (lines.length - 1) * lineHeight / 2 + fontSize * .43;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let inView = false;
    const syncPlayback = () => {
      if (inView && !document.hidden && (playbackRequested ?? !preference.matches)) {
        if (playbackRange && video.readyState > 0 && video.duration > playbackRange.start
          && (video.currentTime < playbackRange.start || video.currentTime >= Math.min(playbackRange.end, video.duration))) video.currentTime = playbackRange.start;
        if (video.paused) video.play().catch(() => setIsPlaying(false));
      } else video.pause();
    };
    const videoObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncPlayback();
    }, { rootMargin: '100% 0px' });
    videoObserver.observe(section);
    video.addEventListener('canplay', syncPlayback);
    document.addEventListener('visibilitychange', syncPlayback);
    preference.addEventListener('change', syncPlayback);
    return () => {
      videoObserver.disconnect();
      video.removeEventListener('canplay', syncPlayback);
      document.removeEventListener('visibilitychange', syncPlayback);
      preference.removeEventListener('change', syncPlayback);
      video.pause();
    };
  }, [playbackRequested, playbackRange]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const center = { x: size.width / 2, y: size.height / 2 };
    const readProgress = () => {
      const rect = section.getBoundingClientRect();
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
      return preference.matches ? 1 : clamp(-rect.top / travel);
    };
    const render = (progress: number) => {
      const scale = 1 + .8 * smoothRange(progress, .12, .8);
      const transform = `translate(${center.x} ${center.y}) scale(${scale}) translate(${-center.x} ${-center.y})`;
      glyphGroupRef.current?.setAttribute('transform', transform);
      outlineRef.current?.setAttribute('transform', transform);
      if (outlineRef.current) outlineRef.current.style.opacity = String(1 - smoothRange(progress, .2, .48));
      if (maskRef.current) maskRef.current.style.opacity = String(1 - smoothRange(progress, .24, .8));
      section.style.setProperty('--pin-progress', progress.toFixed(4));
    };
    let targetProgress = readProgress();
    let progress = targetProgress;
    let frame = 0;
    let previousTime = 0;
    const animate = (time: number) => {
      const elapsed = previousTime ? Math.min(time - previousTime, 64) : 16.67;
      previousTime = time;
      progress = preference.matches ? targetProgress
        : progress + (targetProgress - progress) * (1 - Math.exp(-elapsed / 90));
      if (Math.abs(targetProgress - progress) < .0001) progress = targetProgress;
      render(progress);
      if (progress !== targetProgress) frame = window.requestAnimationFrame(animate);
      else {
        frame = 0;
        previousTime = 0;
      }
    };
    const requestUpdate = () => {
      targetProgress = readProgress();
      if (!frame) frame = window.requestAnimationFrame(animate);
    };
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
    preference.addEventListener('change', requestUpdate);
    render(progress);
    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      preference.removeEventListener('change', requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [size]);

  return (
    <section className="reel-reveal reel-type-reveal" id="editing" ref={sectionRef} aria-labelledby="reel-reveal-title">
      <div className="reel-reveal-sticky reel-type-stage" ref={stageRef}>
        <h2 id="reel-reveal-title" className="reel-accessible-title">{heading}</h2>
        <video className="reel-type-video" ref={videoRef} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}
          onLoadedMetadata={(event) => {
            const video = event.currentTarget;
            if (playbackRange && video.duration > playbackRange.start) video.currentTime = playbackRange.start;
          }}
          onTimeUpdate={(event) => {
            const video = event.currentTarget;
            if (playbackRange && video.duration > playbackRange.start && video.currentTime >= Math.min(playbackRange.end, video.duration)) video.currentTime = playbackRange.start;
          }}
          muted loop playsInline preload="metadata" poster={posterSrc} aria-hidden="true">
          {mobileVideoSrc ? <source src={mobileVideoSrc} media="(max-width: 760px)" type="video/mp4" /> : null}
          <source src={videoSrc} type="video/mp4" />
        </video>
        <svg className="reel-type-mask" ref={maskRef} viewBox={`0 0 ${size.width} ${size.height}`} aria-hidden="true" focusable="false">
          <defs>
            <mask id={maskId} x="0" y="0" width={size.width} height={size.height} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" style={{ maskType: 'luminance' }}>
              <rect width={size.width} height={size.height} fill="white" />
              <g ref={glyphGroupRef} fill="black">
                {lines.map((line, index) => <text key={line} x={size.width / 2} y={firstBaseline + index * lineHeight} textAnchor="middle" fontFamily="var(--font-cinema), Impact, sans-serif" fontWeight="400" fontSize={fontSize} letterSpacing={fontSize * .025}>{line}</text>)}
              </g>
            </mask>
          </defs>
          <rect width={size.width} height={size.height} fill="#0b0b0b" mask={`url(#${maskId})`} />
          <g ref={outlineRef} fill="none" stroke="#f3f2ed" strokeOpacity=".24" strokeWidth=".65">
            {lines.map((line, index) => <text key={line} x={size.width / 2} y={firstBaseline + index * lineHeight} textAnchor="middle" fontFamily="var(--font-cinema), Impact, sans-serif" fontWeight="400" fontSize={fontSize} letterSpacing={fontSize * .025} vectorEffect="non-scaling-stroke">{line}</text>)}
          </g>
        </svg>
        <div className="reel-type-intro">
          <p>{eyebrow}</p>
          {tags.length ? <div aria-label="Editing strengths">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div> : null}
          <span className="reel-type-hint">Scroll to reveal ↓</span>
        </div>
        <div className="reel-reveal-outro">
          <span>{credit}</span>
          <strong>{title}</strong>
          <p>More films below.</p>
        </div>
        <div className="reel-type-controls">
          <button type="button" className="reel-motion-toggle" onClick={() => setPlaybackRequested(!isPlaying)} aria-pressed={isPlaying}>
            {isPlaying ? 'Pause film' : 'Play film'}
          </button>
          <a className="reel-motion-toggle" href={videoSrc} target="_blank" rel="noreferrer">Watch film ↗</a>
        </div>
        <span className="reel-reveal-progress" aria-hidden="true" />
      </div>
    </section>
  );
}
