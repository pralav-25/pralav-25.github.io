'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, X } from 'lucide-react';
import Image from 'next/image';

const editingSamples = [
  {
    title: 'RB22 / Max Verstappen',
    platform: 'YouTube Short',
    credit: 'Sinister_editzz',
    type: 'Original edit',
    image: '/edit-redbull.jpg',
    embed: 'https://www.youtube-nocookie.com/embed/U3FacqdL5e4?autoplay=1&rel=0&playsinline=1',
  },
  {
    title: 'Why Do We Fall?',
    platform: 'YouTube Short',
    credit: 'Sinister_editzz',
    type: 'Original edit',
    image: '/edit-hamilton.jpg',
    embed: 'https://www.youtube-nocookie.com/embed/-NPh8XWfVhY?autoplay=1&rel=0&playsinline=1',
  },
  {
    title: 'Max the Verstappen',
    platform: 'YouTube Short',
    credit: 'Sinister_editzz',
    type: 'Original edit',
    image: '/edit-verstappen.jpg',
    embed: 'https://www.youtube-nocookie.com/embed/S1RUcgtZc8c?autoplay=1&rel=0&playsinline=1',
  },
  {
    title: 'Iron Man / Poster Boy',
    platform: 'YouTube Short',
    credit: 'Sinister_editzz',
    type: 'Original edit',
    image: '/edit-ironman.jpg',
    embed: 'https://www.youtube-nocookie.com/embed/7zNr4y9W338?autoplay=1&rel=0&playsinline=1',
  },
  {
    title: 'Accuracy',
    platform: 'Instagram',
    credit: 'Executor',
    type: 'Editing reference',
    image: '/edit-reference-instagram.jpg',
    embed: 'https://www.instagram.com/p/DUlD3i5k2Z6/embed/',
  },
];

export function EditingGallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const controls = useRef<(HTMLButtonElement | null)[]>([]);
  const previousIndex = useRef<number | null>(null);

  useEffect(() => {
    const target = activeIndex ?? previousIndex.current;
    if (target !== null) controls.current[target]?.focus({ preventScroll: true });
    previousIndex.current = activeIndex;
    if (activeIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveIndex(null);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [activeIndex]);

  return (
    <div className="editing-grid">
      {editingSamples.map((sample, index) => {
        const isActive = activeIndex === index;

        return (
          <article className={`editing-card${sample.platform === 'Instagram' ? ' is-reference' : ''}${isActive ? ' is-playing' : ''}`} data-reveal="card" key={sample.embed}>
            <div className="editing-media" data-scroll-scene>
              {isActive ? (
                <iframe
                  src={sample.embed}
                  title={`${sample.title} embedded ${sample.platform} player`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <Image src={sample.image} alt={`${sample.title} editing preview`} fill sizes="(max-width: 760px) 76vw, (max-width: 1120px) 33vw, 20vw" />
              )}
              <span className="editing-number">0{index + 1}</span>
              {isActive ? (
                <button ref={(element) => { controls.current[index] = element; }} className="editing-stop" type="button" onClick={() => setActiveIndex(null)} aria-label={`Stop ${sample.title}`}>
                  <X aria-hidden="true" /><span>Close</span>
                </button>
              ) : (
                <button ref={(element) => { controls.current[index] = element; }} className="editing-play" type="button" onClick={() => setActiveIndex(index)} aria-label={`Play ${sample.title} here`}>
                  <Play aria-hidden="true" />
                </button>
              )}
            </div>
            <span className="editing-meta"><span>{sample.type}</span><span>{sample.platform}</span></span>
            <strong>{sample.title}</strong>
            <small>Credit · {sample.credit}</small>
            <a className="editing-original" href={sample.platform === 'Instagram'
              ? 'https://www.instagram.com/p/DUlD3i5k2Z6/'
              : `https://www.youtube.com/watch?v=${new URL(sample.embed).pathname.split('/').pop()}`}
              target="_blank" rel="noreferrer">Open on {sample.platform === 'Instagram' ? 'Instagram' : 'YouTube'} ↗</a>
          </article>
        );
      })}
    </div>
  );
}
