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

type EditingSample = (typeof editingSamples)[number];

export function EditingGallery() {
  const [activeSample, setActiveSample] = useState<EditingSample | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !activeSample) return;

    dialog.showModal();
    document.body.classList.add('player-open');

    return () => {
      document.body.classList.remove('player-open');
    };
  }, [activeSample]);

  const closePlayer = () => {
    dialogRef.current?.close();
  };

  return (
    <>
      <div className="editing-grid">
        {editingSamples.map((sample, index) => (
          <button className="editing-card" type="button" onClick={() => setActiveSample(sample)} key={sample.embed} aria-label={`Play ${sample.title} on this page`}>
            <span className="editing-media" style={{ position: 'relative' }}>
              <Image src={sample.image} alt={`${sample.title} editing preview`} fill sizes="(max-width: 760px) 76vw, (max-width: 1120px) 33vw, 20vw" />
              <span className="editing-number">0{index + 1}</span>
              <span className="editing-play"><Play aria-hidden="true" /></span>
            </span>
            <span className="editing-meta"><span>{sample.type}</span><span>{sample.platform}</span></span>
            <strong>{sample.title}</strong>
            <small>Credit · {sample.credit}</small>
          </button>
        ))}
      </div>

      <dialog className="player-dialog" ref={dialogRef} onClose={() => setActiveSample(null)} aria-labelledby="player-title">
        {activeSample ? (
          <div className={`player-panel${activeSample.platform === 'Instagram' ? ' is-instagram' : ''}`}>
            <div className="player-topline">
              <div><span>{activeSample.type}</span><h3 id="player-title">{activeSample.title}</h3></div>
              <button type="button" onClick={closePlayer} aria-label="Close video player"><X aria-hidden="true" /></button>
            </div>
            <div className="player-frame">
              <iframe
                src={activeSample.embed}
                title={`${activeSample.title} embedded ${activeSample.platform} player`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <p>{activeSample.platform} · Credit {activeSample.credit}</p>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
