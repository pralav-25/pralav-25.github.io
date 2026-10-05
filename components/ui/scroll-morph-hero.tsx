'use client';

import Image from 'next/image';
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionStyle, type MotionValue } from 'framer-motion';
import { useEffect, useRef, useState, type FocusEvent } from 'react';

export type MorphProject = {
  name: string;
  number: string;
  category: string;
  image: string;
  imageAlt?: string;
  href: string;
  note: string;
  featured?: boolean;
};

type Position = { x: number; y: number; rotate: number; scale: number };
type Size = { width: number; height: number };

const scatter = [
  [-.38, -.26, -11], [-.18, -.33, 8], [.05, -.31, -6],
  [.35, -.24, 12], [.36, .14, -9], [.19, .31, 7],
  [-.04, .31, -12], [-.32, .22, 6], [-.37, -.02, -4],
];
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;
const blend = (from: Position, to: Position, amount: number): Position => ({
  x: mix(from.x, to.x, amount), y: mix(from.y, to.y, amount),
  rotate: mix(from.rotate, to.rotate, amount), scale: mix(from.scale, to.scale, amount),
});

function positions(index: number, total: number, size: Size) {
  const cardWidth = Math.min(128, Math.max(100, size.width * .105));
  const cardHeight = cardWidth * 90 / 128;
  const lineScale = Math.min(1, (size.width - 64 - (total - 1) * 10) / (total * cardWidth));
  const lineSpacing = cardWidth * lineScale + 10;
  const circleAngle = (-90 + index / total * 360) * Math.PI / 180;
  const radiusX = Math.min(370, size.width * .34);
  const radiusY = 180;
  const scatterPoint = scatter[index % scatter.length];
  const centeredIndex = index - (total - 1) / 2;
  const normalizedIndex = total > 1 ? centeredIndex / ((total - 1) / 2) : 0;
  // Equal horizontal spacing keeps every arc panel reachable, including on small laptops.
  const arcScale = Math.min(1, (size.width - 64 - (total - 1) * 8) / (total * cardWidth));
  const arcSpan = size.width - 64 - cardWidth * arcScale;

  return {
    cardWidth, cardHeight,
    scattered: { x: scatterPoint[0] * size.width, y: scatterPoint[1] * size.height, rotate: scatterPoint[2], scale: .92 },
    line: { x: centeredIndex * lineSpacing, y: 0, rotate: 0, scale: lineScale },
    circle: { x: Math.cos(circleAngle) * radiusX, y: Math.sin(circleAngle) * radiusY, rotate: index % 2 ? 6 : -6, scale: 1 },
    arc: { x: normalizedIndex * arcSpan / 2, y: 88 + normalizedIndex ** 2 * 62, rotate: normalizedIndex * 9, scale: arcScale },
  };
}

function MorphCard({ project, index, total, size, enhanced, intro, progress }: {
  project: MorphProject;
  index: number;
  total: number;
  size: Size;
  enhanced: boolean;
  intro: MotionValue<number>;
  progress: MotionValue<number>;
}) {
  const layout = positions(index, total, size);
  const current = () => {
    const phase = Math.min(2, Math.max(0, intro.get()));
    const destination = blend(layout.circle, layout.arc, Math.min(1, Math.max(0, progress.get())));
    return phase < 1 ? blend(layout.scattered, layout.line, phase) : blend(layout.line, destination, phase - 1);
  };
  const x = useTransform(() => current().x);
  const y = useTransform(() => current().y);
  const rotate = useTransform(() => current().rotate);
  const scale = useTransform(() => current().scale);
  const style: MotionStyle & { '--morph-card-width': string; '--morph-card-height': string } = {
    '--morph-card-width': `${layout.cardWidth}px`,
    '--morph-card-height': `${layout.cardHeight}px`,
    ...(enhanced ? { x, y, rotate, scale } : { x: 0, y: 0, rotate: 0, scale: 1 }),
  };

  return (
    <motion.a className="morph-card" href={project.href} aria-label={`Explore ${project.name}`} style={style}>
      <span className="morph-flipper">
        <span className="morph-front">
          <Image src={project.image} alt={project.imageAlt ?? ''} width={640} height={450} sizes="(prefers-reduced-motion: reduce) 40vw, (max-width: 520px) 42vw, (max-width: 959px) 28vw, 128px" />
          <span className="morph-number" aria-hidden="true">{project.number}</span>
          <span className="morph-name">{project.name}</span>
        </span>
        <span className="morph-back" aria-hidden="true">
          <strong>{project.name}</strong>
          <span>{project.note}</span>
          <b>View project ↓</b>
        </span>
      </span>
    </motion.a>
  );
}

export default function ScrollMorphHero({ projects }: { projects: MorphProject[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [size, setSize] = useState<Size>({ width: 1200, height: 560 });
  const played = useRef(false);
  const focusHeld = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intro = useMotionValue(0);
  const smoothIntro = useSpring(intro, { stiffness: 90, damping: 23 });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start 16px', 'end 576px'] });
  const morphProgress = useTransform(scrollYProgress, [0, .12, .9, 1], [0, 0, 1, 1]);
  const morphSource = useMotionValue(0);
  const smoothMorph = useSpring(morphSource, { stiffness: 120, damping: 30 });
  const copyY = useTransform(smoothMorph, [0, 1], [0, -132]);
  const copyOpacity = useTransform(smoothIntro, [0, .7, 1, 1.4, 2], [1, .15, 0, .15, 1]);

  function finishIntro() {
    played.current = true;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    intro.set(2);
    smoothIntro.jump(2);
  }

  function holdForFocus() {
    finishIntro();
    if (focusHeld.current) return;
    focusHeld.current = true;
    morphSource.set(morphProgress.get());
    smoothMorph.jump(morphProgress.get());
  }

  function releaseFocus(event: FocusEvent<HTMLDivElement>) {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    focusHeld.current = false;
    morphSource.set(morphProgress.get());
  }

  useEffect(() => {
    morphSource.set(morphProgress.get());
    return morphProgress.on('change', (value) => {
      if (!focusHeld.current) morphSource.set(value);
    });
  }, [morphProgress, morphSource]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const preference = window.matchMedia('(min-width: 960px) and (prefers-reduced-motion: no-preference)');
    const updatePreference = () => {
      setEnhanced(preference.matches);
      const target = preference.matches && !played.current ? 0 : 2;
      intro.set(target);
      smoothIntro.jump(target);
    };
    const frame = window.requestAnimationFrame(updatePreference);
    preference.addEventListener('change', updatePreference);
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setSize({ width: entry.contentRect.width, height: 560 });
    });
    observer.observe(stage);
    return () => {
      window.cancelAnimationFrame(frame);
      preference.removeEventListener('change', updatePreference);
      observer.disconnect();
    };
  }, [intro, smoothIntro]);

  useEffect(() => {
    const stage = stageRef.current;
    const activeTimers = timers.current;
    if (!stage || !enhanced || played.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      if (played.current) {
        observer.disconnect();
        return;
      }
      played.current = true;
      activeTimers.push(setTimeout(() => intro.set(1), 300));
      activeTimers.push(setTimeout(() => intro.set(2), 1050));
      observer.disconnect();
    }, { threshold: .35 });
    observer.observe(stage);
    return () => {
      observer.disconnect();
      activeTimers.forEach(clearTimeout);
      activeTimers.length = 0;
    };
  }, [enhanced, intro]);

  useEffect(() => {
    const activeTimers = timers.current;
    return () => activeTimers.forEach(clearTimeout);
  }, []);

  return (
    <div className={`morph-projects${enhanced ? ' morph-enhanced' : ''}`} ref={sectionRef}>
      <div className="morph-stage" ref={stageRef} onFocusCapture={holdForFocus} onBlurCapture={releaseFocus}>
        <motion.div className="morph-copy" style={enhanced ? { y: copyY, opacity: copyOpacity } : undefined}>
          <span className="morph-caption">{projects.length} projects · pick a panel</span>
          <h3>Curiosity,<br />in motion.</h3>
          <p className="morph-desktop-hint">Scroll to shuffle.<br />Flip a panel to find your next project.</p>
          <p className="morph-static-hint">Tap a panel to explore the project.</p>
        </motion.div>
        <div className="morph-deck">
          {projects.map((project, index) => (
            <MorphCard key={project.name} project={project} index={index} total={projects.length} size={size} enhanced={enhanced} intro={smoothIntro} progress={smoothMorph} />
          ))}
        </div>
        <span className="morph-scroll-note" aria-hidden="true">The full story is just below ↓</span>
      </div>
    </div>
  );
}
