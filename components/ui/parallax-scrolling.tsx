'use client';

import { useEffect, useId, useRef } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

export interface ParallaxComponentProps {
  className?: string;
  title?: [string, string];
}

/** A self-contained scene: scroll ownership stays with the page. */
export function ParallaxComponent({ className, title = ['Stay', 'curious.'] }: ParallaxComponentProps) {
  const parallaxRef = useRef<HTMLElement>(null);
  const titleId = `parallax-title-${useId().replace(/:/g, '')}`;

  useEffect(() => {
    const root = parallaxRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add('(min-width: 761px) and (prefers-reduced-motion: no-preference)', () => {
      const trigger = root.querySelector<HTMLElement>('[data-parallax-layers]');
      if (!trigger) return;
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      [
        { layer: '1', distance: 14 },
        { layer: '2', distance: 8 },
        { layer: '3', distance: 4 },
        { layer: '4', distance: 1 },
      ].forEach(({ layer, distance }) => {
        timeline.fromTo(trigger.querySelectorAll(`[data-parallax-layer="${layer}"]`),
          { yPercent: -distance }, { yPercent: distance, ease: 'none' }, 0);
      });

      // Refresh only this scene after its lazy images load; other page effects
      // and ScrollTriggers keep their own lifecycle.
      const refresh = () => timeline.scrollTrigger?.refresh();
      const images = Array.from(trigger.querySelectorAll('img'));
      images.forEach((image) => image.addEventListener('load', refresh));
      const frame = window.requestAnimationFrame(refresh);
      return () => {
        window.cancelAnimationFrame(frame);
        images.forEach((image) => image.removeEventListener('load', refresh));
      };
    }, root);

    return () => media.revert();
  }, []);

  return (
    <figure className={cn('parallax', className)} ref={parallaxRef} aria-labelledby={titleId}>
      <div className="parallax__visuals">
        <div data-parallax-layers className="parallax__layers">
          <Image src="/parallax/sky.webp" alt="" fill sizes="(max-width: 760px) 100vw, 43vw" data-parallax-layer="1" className="parallax__layer-img" />
          <Image src="/parallax/mountains.webp" alt="" fill sizes="(max-width: 760px) 100vw, 43vw" data-parallax-layer="2" className="parallax__layer-img" />
          <div data-parallax-layer="3" className="parallax__layer-title">
            <h3 id={titleId} className="parallax__title"><span>{title[0]}</span><span>{title[1]}</span></h3>
          </div>
          <Image src="/parallax/foreground.webp" alt="" fill sizes="(max-width: 760px) 100vw, 43vw" data-parallax-layer="4" className="parallax__layer-img" />
        </div>
        <div className="parallax__fade" aria-hidden="true" />
      </div>
      <p className="parallax__eyebrow">A different perspective</p>
      <figcaption className="parallax__caption">
        <p>Always exploring.</p>
        <a href="https://www.osmo.supply/" target="_blank" rel="noreferrer">Parallax resource by Osmo <ArrowUpRight aria-hidden="true" /></a>
      </figcaption>
    </figure>
  );
}
