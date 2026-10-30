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

function headlineLines(heading: string, compact: boolean) {
  if (heading === 'In motion.') return ['IN', 'MOTION.'];
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
  const textRefs = useRef<Array<SVGTextElement | null>>([]);
  const [size, setSize] = useState({ width: 1440, height: 900 });
  const [playbackRequested, setPlaybackRequested] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const maskId = `reel-type-${useId().replace(/:/g, '')}`;
  const compact = size.width <= 760;
  const lines = useMemo(() => headlineLines(heading, compact), [heading, compact]);
  const longestLine = Math.max(...lines.map((line) => line.length));
  const fontSize = Math.min(size.width * .9 / (longestLine * .62), size.height * .5 / lines.length);
  const lineHeight = fontSize * .94;
  const firstBaseline = size.height * .5 - (lines.length - 1) * lineHeight / 2 + fontSize * .34;

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
    let anchor = { ...center, width: fontSize * .18, height: fontSize };
    // Zoom into a solid letter stroke, so the same footage naturally fills the stage.
    const targetLine = lines.findLastIndex((line) => /[IHTE]/.test(line));
    const target = textRefs.current[targetLine];
    if (target && !preference.matches) {
      const index = lines[targetLine].lastIndexOf('I') >= 0
        ? lines[targetLine].lastIndexOf('I') : lines[targetLine].search(/[HTE]/);
      if (index >= 0 && index < target.getNumberOfChars()) {
        const glyph = target.getExtentOfChar(index);
        anchor = { x: glyph.x + glyph.width / 2, y: glyph.y + glyph.height * .45, width: glyph.width, height: glyph.height };
      }
    }
    const finalScale = Math.max(80, size.width / Math.max(anchor.width * .4, 1) * 1.2);
    let frame = 0;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = preference.matches ? 1 : clamp(-rect.top / travel);
      const scale = finalScale ** progress;
      const move = 1 - 1 / scale;
      const x = anchor.x + (center.x - anchor.x) * move;
      const y = anchor.y + (center.y - anchor.y) * move;
      const transform = `translate(${x} ${y}) scale(${scale}) translate(${-anchor.x} ${-anchor.y})`;
      glyphGroupRef.current?.setAttribute('transform', transform);
      outlineRef.current?.setAttribute('transform', transform);
      // Dissolve the final edges after the glyph has grown beyond the viewport.
      if (maskRef.current) maskRef.current.style.opacity = String(1 - clamp((progress - .88) / .12));
      section.style.setProperty('--pin-progress', progress.toFixed(4));
      frame = 0;
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
    preference.addEventListener('change', requestUpdate);
    update();
    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      preference.removeEventListener('change', requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [lines, size, fontSize]);

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
                {lines.map((line, index) => <text key={line} ref={(element) => { textRefs.current[index] = element; }} x={size.width / 2} y={firstBaseline + index * lineHeight} textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="950" fontSize={fontSize} letterSpacing={-fontSize * .055}>{line}</text>)}
              </g>
            </mask>
          </defs>
          <rect width={size.width} height={size.height} fill="#0b0b0b" mask={`url(#${maskId})`} />
          <g ref={outlineRef} fill="none" stroke="#f3f2ed" strokeOpacity=".24" strokeWidth=".65">
            {lines.map((line, index) => <text key={line} x={size.width / 2} y={firstBaseline + index * lineHeight} textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="950" fontSize={fontSize} letterSpacing={-fontSize * .055}>{line}</text>)}
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
