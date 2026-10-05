'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties } from 'react';

const quips = [
  'POW! New idea unlocked.',
  'Plot twist: keep building.',
  'A little curiosity goes a long way.',
];

const particles = Array.from({ length: 9 }, (_, index) => {
  const angle = ((index * 40 - 100) * Math.PI) / 180;
  const distance = 44 + (index % 3) * 7;

  return {
    '--particle-x': `${Math.cos(angle) * distance}px`,
    '--particle-y': `${Math.sin(angle) * distance}px`,
    '--particle-spin': `${index % 2 === 0 ? 110 : -140}deg`,
    '--particle-delay': `${index * 10}ms`,
  } as CSSProperties;
});

type Message = { id: number; text: string };
type Burst = { id: number; reducedMotion: boolean };

export function ComicPlayground() {
  const [quip, setQuip] = useState<Message | null>(null);
  const [status, setStatus] = useState<Message>({ id: 0, text: '' });
  const [burst, setBurst] = useState<Burst | null>(null);
  const nextQuip = useRef(0);
  const activation = useRef(0);
  const timers = useRef<{ quip: number | null; burst: number | null }>({ quip: null, burst: null });

  useEffect(() => {
    const activeTimers = timers.current;

    return () => {
      if (activeTimers.quip !== null) window.clearTimeout(activeTimers.quip);
      if (activeTimers.burst !== null) window.clearTimeout(activeTimers.burst);
    };
  }, []);

  function showMessage(text: string) {
    if (timers.current.quip !== null) window.clearTimeout(timers.current.quip);
    if (timers.current.burst !== null) window.clearTimeout(timers.current.burst);

    const id = ++activation.current;
    const message = { id, text };

    setQuip(message);
    setStatus(message);
    setBurst({ id, reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches });

    timers.current.quip = window.setTimeout(() => {
      setQuip(null);
      timers.current.quip = null;
    }, 3000);

    timers.current.burst = window.setTimeout(() => {
      setBurst(null);
      timers.current.burst = null;
    }, 700);
  }

  function giveSparkAnIdea() {
    showMessage(quips[nextQuip.current]);
    nextQuip.current = (nextQuip.current + 1) % quips.length;
  }

  return (
    <>
      <div className="comic-playground">
        <button className="comic-spark-button" type="button" aria-label="Give the comic spark an idea" title="Tap for a plot twist" onClick={giveSparkAnIdea}>
          <svg viewBox="0 0 88 88" width="80" height="80" aria-hidden="true" focusable="false">
            <path d="M44 4 53 26 74 14 65 36 84 44 65 53 74 75 53 65 44 85 35 64 15 75 25 53 5 44 25 35 15 14 35 25Z" fill="#ffe66a" stroke="#0b0b0b" strokeWidth="3" strokeLinejoin="round" />
            <path d="m30 34 8-1m12 0 7 2" fill="none" stroke="#0b0b0b" strokeWidth="2" strokeLinecap="round" />
            <circle cx="35" cy="43" r="2.8" fill="#0b0b0b" />
            <circle className="comic-eye-right" cx="53" cy="43" r="2.8" fill="#0b0b0b" />
            <ellipse cx="29" cy="51" rx="4" ry="2" fill="#e9958a" opacity=".65" />
            <ellipse cx="59" cy="51" rx="4" ry="2" fill="#e9958a" opacity=".65" />
            <path d="M35 52Q44 63 53 52" fill="none" stroke="#0b0b0b" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>

        <p key={status.id} className="comic-quip" data-visible={quip !== null} aria-hidden="true">{quip?.text ?? ''}</p>
        <output className="sr-only" aria-live="polite" aria-atomic="true"><span key={status.id}>{status.text}</span></output>

        {burst ? (
          <div key={burst.id} className="comic-burst" aria-hidden="true">
            {burst.reducedMotion ? (
              <svg className="comic-static-star" viewBox="0 0 24 24" width="24" height="24" focusable="false">
                <path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" fill="#ffe66a" stroke="#0b0b0b" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            ) : particles.map((style, index) => <span className="comic-particle" key={index} style={style} />)}
          </div>
        ) : null}
      </div>

      <button className="float-card float-profile fun-portrait" type="button" aria-label="Reveal a comic easter egg" title="Psst…" onClick={() => showMessage('BONUS PANEL UNLOCKED!')}>
        <Image src="https://avatars.githubusercontent.com/u/174412353?v=4" alt="" width={220} height={220} priority />
      </button>
    </>
  );
}
