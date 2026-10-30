import { ParallaxComponent } from '@/components/ui/parallax-scrolling';
import { SmoothScroll } from '@/components/smooth-scroll';

/** Standalone usage example; not an extra public route. */
export default function ParallaxDemo() {
  return <>
    <SmoothScroll />
    <ParallaxComponent className="parallax--demo" />
  </>;
}
