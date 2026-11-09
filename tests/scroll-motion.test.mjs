import test from 'node:test';
import assert from 'node:assert/strict';
import { mountScrollMotion } from '../lib/scroll-motion.ts';

function fixture(t, reduced = false) {
  const listeners = new Map(), mediaListeners = new Set(), frames = new Map(), timers = new Map();
  const observers = [];
  let nextId = 1;
  const element = () => {
    const style = new Map(), classes = new Set(), attributes = new Map();
    return {
      style: {
        setProperty: (name, value) => style.set(name, value),
        removeProperty: (name) => style.delete(name),
      },
      classList: {
        add: (...names) => names.forEach((name) => classes.add(name)),
        remove: (...names) => names.forEach((name) => classes.delete(name)),
        toggle: (name, enabled) => enabled ? classes.add(name) : classes.delete(name),
      },
      setAttribute: (name, value) => attributes.set(name, value),
      removeAttribute: (name) => attributes.delete(name),
      getBoundingClientRect: () => ({ top: 300, height: 600 }),
      offsetHeight: 1000, styleValues: style, classes, attributes,
    };
  };
  const root = element(), header = element(), hero = element(), scene = element(), reveal = element();
  const preference = {
    matches: reduced,
    addEventListener: (_name, fn) => mediaListeners.add(fn),
    removeEventListener: (_name, fn) => mediaListeners.delete(fn),
  };
  const view = {
    document: {
      documentElement: root,
      querySelector: (selector) => selector === '.site-header' ? header : hero,
      querySelectorAll: (selector) => selector === '[data-scroll-scene]' ? [scene] : [reveal],
    },
    scrollY: 0, innerHeight: 1000,
    matchMedia: () => preference,
    addEventListener: (name, fn) => listeners.set(name, fn),
    removeEventListener: (name) => listeners.delete(name),
    requestAnimationFrame: (fn) => { const id = nextId++; frames.set(id, fn); return id; },
    cancelAnimationFrame: (id) => frames.delete(id),
    setTimeout: (fn) => { const id = nextId++; timers.set(id, fn); return id; },
    clearTimeout: (id) => timers.delete(id),
  };
  const original = globalThis.IntersectionObserver;
  globalThis.IntersectionObserver = class {
    constructor() { this.disconnected = false; observers.push(this); }
    observe() {}
    unobserve() {}
    disconnect() { this.disconnected = true; }
  };
  t.after(() => {
    if (original === undefined) delete globalThis.IntersectionObserver;
    else globalThis.IntersectionObserver = original;
  });
  const dispose = mountScrollMotion(view);
  return {
    root, header, scene, reveal, frames, timers, listeners, mediaListeners, observers, dispose,
    flush() { const pending = [...frames.values()]; frames.clear(); pending.forEach((fn) => fn()); },
    scroll(y) { view.scrollY = y; listeners.get('scroll')?.(); },
    reduce(value) { preference.matches = value; mediaListeners.forEach((fn) => fn()); },
  };
}

test('live reduced motion clears transforms, restores the header and reveals content', (t) => {
  const app = fixture(t);
  t.after(app.dispose);
  app.flush();
  app.scroll(300);
  app.flush();
  assert.ok(app.header.classes.has('is-scroll-hidden'));
  assert.ok(app.scene.styleValues.has('--view-progress'));
  app.scroll(350);
  app.reduce(true);
  assert.equal(app.frames.size, 0);
  assert.equal(app.timers.size, 0);
  assert.equal(app.listeners.size, 0);
  assert.ok(app.observers.every((observer) => observer.disconnected));
  assert.equal(app.root.styleValues.size, 0);
  assert.equal(app.scene.styleValues.size, 0);
  assert.equal(app.header.classes.has('is-scroll-hidden'), false);
  assert.equal(app.reveal.attributes.get('data-revealed'), 'true');
});

test('an initially reduced preference can switch to normal motion and back', (t) => {
  const app = fixture(t, true);
  t.after(app.dispose);
  assert.equal(app.listeners.size, 0);
  assert.equal(app.frames.size, 0);
  assert.equal(app.reveal.attributes.get('data-revealed'), 'true');
  app.reduce(false);
  app.flush();
  assert.equal(app.listeners.size, 2);
  assert.ok(app.scene.styleValues.has('--view-progress'));
  app.reduce(true);
  assert.equal(app.listeners.size, 0);
  assert.equal(app.scene.styleValues.size, 0);
});

test('unmount releases active observers, all event handlers, frames, timers and owned state', (t) => {
  const app = fixture(t);
  app.flush();
  app.scroll(300);
  app.flush();
  app.scroll(350);
  app.dispose();
  assert.equal(app.frames.size, 0);
  assert.equal(app.timers.size, 0);
  assert.equal(app.listeners.size, 0);
  assert.equal(app.mediaListeners.size, 0);
  assert.ok(app.observers.every((observer) => observer.disconnected));
  assert.equal(app.root.classes.size, 0);
  assert.equal(app.root.styleValues.size, 0);
  assert.equal(app.scene.styleValues.size, 0);
  assert.equal(app.header.classes.size, 0);
  assert.equal(app.reveal.attributes.size, 0);
});

test('scroll events share the initial load frame and unmount cancels it before execution', (t) => {
  const app = fixture(t);
  app.scroll(200);
  app.scroll(300);
  assert.equal(app.frames.size, 1);
  app.dispose();
  app.flush();
  assert.equal(app.root.classes.size, 0);
  assert.equal(app.scene.styleValues.size, 0);
});
