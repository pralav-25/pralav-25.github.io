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

const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;
const blend = (from: Position, to: Position, amount: number): Position => ({
  x: mix(from.x, to.x, amount), y: mix(from.y, to.y, amount),
  rotate: mix(from.rotate, to.rotate, amount), scale: mix(from.scale, to.scale, amount),
});

function positions(index: number, total: number, size: Size) {
  const cardWidth = Math.min(168, Math.max(124, size.width * .115));
  const cardHeight = cardWidth * 90 / 128;
  const circleAngle = (-90 + index / total * 360) * Math.PI / 180;
  const radiusX = Math.min(470, size.width * .33);
  const radiusY = Math.min(310, size.height * .32);
  const centeredIndex = index - (total - 1) / 2;
  const normalizedIndex = total > 1 ? centeredIndex / ((total - 1) / 2) : 0;
  // Equal horizontal spacing keeps every arc panel reachable, including on small laptops.
  const arcScale = Math.min(1, (size.width - 64 - (total - 1) * 8) / (total * cardWidth));
  const arcSpan = size.width - 64 - cardWidth * arcScale;

  return {
    cardWidth, cardHeight,
    circle: { x: Math.cos(circleAngle) * radiusX, y: Math.sin(circleAngle) * radiusY + 32, rotate: index % 2 ? 6 : -6, scale: 1 },
    arc: { x: normalizedIndex * arcSpan / 2, y: size.height * (.14 + normalizedIndex ** 2 * .09), rotate: normalizedIndex * 9, scale: arcScale },
  };
}

function MorphCard({ project, index, total, size, enhanced, progress }: {
  project: MorphProject;
  index: number;
  total: number;
  size: Size;
  enhanced: boolean;
  progress: MotionValue<number>;
}) {
  const layout = positions(index, total, size);
  const current = () => {
    return blend(layout.circle, layout.arc, Math.min(1, Math.max(0, progress.get())));
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
          <Image src={project.image} alt={project.imageAlt ?? ''} width={640} height={450} sizes="(prefers-reduced-motion: reduce) 40vw, (max-width: 520px) 42vw, (max-width: 959px) 28vw, 168px" />
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
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [size, setSize] = useState<Size>({ width: 1200, height: 720 });
  const focusHeld = useRef(false);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'], trackContentSize: true });
  const morphProgress = useTransform(scrollYProgress, [0, .1, .88, 1], [0, 0, 1, 1]);
  const morphSource = useMotionValue(0);
  const smoothMorph = useSpring(morphSource, { stiffness: 180, damping: 32 });
  const copyY = useTransform(smoothMorph, [0, 1], [0, -size.height * .16]);

  function holdForFocus() {
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
    const preference = window.matchMedia('(min-width: 960px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)');
    const updatePreference = () => setEnhanced(preference.matches);
    const frame = window.requestAnimationFrame(updatePreference);
    preference.addEventListener('change', updatePreference);
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(stage);
    return () => {
      window.cancelAnimationFrame(frame);
      preference.removeEventListener('change', updatePreference);
      observer.disconnect();
    };
  }, []);

  return (
    <section className={`morph-projects${enhanced ? ' morph-enhanced' : ''}`} aria-labelledby="project-explorer-title" ref={sectionRef}>
      <div className="morph-stage" ref={stageRef} onFocusCapture={holdForFocus} onBlurCapture={releaseFocus}>
        <motion.div className="morph-copy" style={enhanced ? { y: copyY, opacity: 1 } : { y: 0, opacity: 1 }}>
          <span className="morph-caption">{projects.length} projects · pick a panel</span>
          <h3 id="project-explorer-title">Curiosity,<br />in motion.</h3>
          <p className="morph-desktop-hint">Scroll to explore the projects.<br />Flip a panel to take a closer look.</p>
          <p className="morph-static-hint">Tap a panel to explore the project.</p>
        </motion.div>
        <div className="morph-deck">
          {projects.map((project, index) => (
            <MorphCard key={project.name} project={project} index={index} total={projects.length} size={size} enhanced={enhanced} progress={smoothMorph} />
          ))}
        </div>
        <span className="morph-scroll-note" aria-hidden="true">The full story is just below ↓</span>
      </div>
    </section>
  );
}
