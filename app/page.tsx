'use client';

import { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Code2, Film, GitBranch, Mail, Menu, ShieldCheck, X } from 'lucide-react';
import Image from 'next/image';

const projects = [
  {
    number: '01',
    name: 'StructIQ',
    category: 'Infrastructure intelligence',
    description: 'Predictive monitoring with a FastAPI service, SQLite data layer, asset diagnostics, and tested health scoring.',
    skills: ['Python', 'FastAPI', 'SQLite'],
    image: '/structiq-card.png',
    source: 'https://github.com/pralav-25/StructIQ',
  },
  {
    number: '02',
    name: 'Websites4U',
    category: 'Independent agency concept',
    description: 'A distinct web-agency experience with service discovery, a project estimator, accessible navigation, and a clear lead flow.',
    skills: ['JavaScript', 'Responsive UI', 'Accessibility'],
    image: '/w4u-card.png',
    source: 'https://github.com/pralav-25/w4u',
    live: 'https://w4u-indol.vercel.app',
    liveLabel: 'Live site',
  },
  {
    number: '03',
    name: 'FlowLock',
    category: 'Interactive API security',
    description: 'A visual product concept that explains behavior-based abuse detection and rate-limit bypass scenarios.',
    skills: ['API Security', 'JavaScript', 'Three.js'],
    image: '/flowlock-card.png',
    source: 'https://github.com/pralav-25/FlowLock',
    live: 'https://flow-lock-nine.vercel.app',
    liveLabel: 'Live site',
  },
  {
    number: '04',
    name: 'Sinister/Edit',
    category: 'Creative technology',
    description: 'A responsive home for short-form, sports, and story-led video work, pairing React with visual editing practice.',
    skills: ['React', 'TypeScript', 'Video'],
    image: '/editing-card.png',
    source: 'https://github.com/pralav-25/Editing_Portfolio',
    live: 'https://www.instagram.com/ig_sinisterrrr/',
    liveLabel: 'Watch reels',
  },
];

const disciplines = [
  { icon: Code2, label: 'Product engineering', copy: 'Responsive interfaces, interactive prototypes, APIs, and practical data layers.' },
  { icon: ShieldCheck, label: 'Secure thinking', copy: 'Accessible controls, tested logic, documented choices, and sensible defaults.' },
  { icon: Film, label: 'Visual storytelling', copy: 'Editing, motion, hierarchy, and presentation that make the idea easier to understand.' },
];

const ticker = ['Developers', 'Designers', 'Editors', 'Builders'];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [compactNav, setCompactNav] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('motion-ready');

    let previousY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      if (currentY <= 24) setCompactNav(false);
      else if (currentY > previousY) setCompactNav(true);
      else if (currentY < previousY) setCompactNav(false);
      previousY = currentY;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.14 },
    );

    document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKeyDown);
      document.documentElement.classList.remove('motion-ready');
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <a className="skip-link" href="#work">Skip to selected work</a>

      <header className={`site-header${compactNav ? ' is-compact' : ''}`}>
        <a className="brand" href="#top" aria-label="Pralav Singh, home">PRALAV<sup>25</sup></a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#skills">Practice</a>
        </nav>
        <div className="header-actions">
          <a className="github-link" href="https://github.com/pralav-25" target="_blank" rel="noreferrer">GitHub</a>
          <a className="contact-pill" href="mailto:singhpralav07@gmail.com">Contact <ArrowUpRight aria-hidden="true" /></a>
          <button className="menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            <span>{menuOpen ? 'Close' : 'Menu'}</span>
          </button>
        </div>
      </header>

      <div className={`mobile-menu${menuOpen ? ' is-open' : ''}`} id="mobile-menu" aria-hidden={!menuOpen} inert={!menuOpen}>
        <nav aria-label="Mobile navigation">
          <a href="#work" onClick={closeMenu}><span>01</span> Work</a>
          <a href="#about" onClick={closeMenu}><span>02</span> About</a>
          <a href="#skills" onClick={closeMenu}><span>03</span> Practice</a>
          <a href="#contact" onClick={closeMenu}><span>04</span> Contact</a>
        </nav>
        <div><a href="https://github.com/pralav-25" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.instagram.com/ig_sinisterrrr/" target="_blank" rel="noreferrer">Instagram ↗</a></div>
      </div>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-center">
          <p className="hero-kicker">Independent developer and visual editor<br />Based in India · Available worldwide</p>
          <h1 id="hero-title">
            <span className="hero-line"><span>Developer</span></span>
            <span className="hero-line"><span>Designer</span></span>
            <span className="hero-line"><span>Builder</span></span>
          </h1>
          <div className="hero-bottom">
            <p className="hero-intro">I build useful digital products, shape clear interfaces, and tell stories through code and motion.</p>
            <a className="hero-cta" href="#work">Explore the work <ArrowDownRight aria-hidden="true" /></a>
          </div>
        </div>
        <div className="hero-status"><span /> Open to internships &amp; early-career roles</div>
      </section>

      <div className="ticker" aria-label="Creative disciplines">
        <div className="ticker-track">
          {[...ticker, ...ticker].map((item, index) => <span key={`${item}-${index}`}>{item}<b>·</b></span>)}
        </div>
      </div>

      <section className="work" id="work" aria-labelledby="work-title">
        <div className="work-heading reveal" data-reveal>
          <p>Selected work · 2025—2026</p>
          <h2 id="work-title">Come for the work.<br />Stay for the thinking.</h2>
          <a href="https://github.com/pralav-25?tab=repositories" target="_blank" rel="noreferrer">All repositories <ArrowUpRight aria-hidden="true" /></a>
        </div>

        <div className="project-grid">
          {projects.map((project, index) => (
            <article className={`project-card project-card-${index + 1} reveal`} data-reveal key={project.name}>
              <a className="project-media" href={project.live ?? project.source} target="_blank" rel="noreferrer" aria-label={`Open ${project.name}`}>
                <Image src={project.image} alt={`${project.name} project preview`} fill sizes="(max-width: 760px) 100vw, (max-width: 1200px) 55vw, 50vw" />
                <span>{project.number}</span>
                <em>View project</em>
              </a>
              <div className="project-copy">
                <div className="project-title-row"><p>{project.category}</p><h3>{project.name}</h3></div>
                <p>{project.description}</p>
                <div className="project-foot">
                  <div aria-label={`${project.name} skills`}>{project.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
                  <div>
                    <a href={project.source} target="_blank" rel="noreferrer">Code <GitBranch aria-hidden="true" /></a>
                    {project.live ? <a href={project.live} target="_blank" rel="noreferrer">{project.liveLabel} <ArrowUpRight aria-hidden="true" /></a> : null}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about" id="about" aria-labelledby="about-title">
        <div className="about-portrait image-reveal" data-reveal>
          <Image src="https://avatars.githubusercontent.com/u/174412353?v=4" alt="Pralav Singh" width={800} height={800} />
          <span>India · 20.59° N / 78.96° E</span>
        </div>
        <div className="about-copy reveal" data-reveal>
          <p className="section-label">A little about me</p>
          <h2 id="about-title">I care about how things work—and how they feel.</h2>
          <p>I&apos;m Pralav, a developer and video editor based in India. I move between engineering, interface design, API security, and visual storytelling to turn practical ideas into clear experiences.</p>
          <dl>
            <div><dt>13</dt><dd>Public repositories</dd></div>
            <div><dt>2</dt><dd>Creative disciplines</dd></div>
            <div><dt>∞</dt><dd>Curiosity</dd></div>
          </dl>
        </div>
      </section>

      <section className="skills" id="skills" aria-labelledby="skills-title">
        <div className="skills-heading reveal" data-reveal>
          <p className="section-label">How I make things</p>
          <h2 id="skills-title">Useful. Legible.<br />Considered.</h2>
        </div>
        <div className="discipline-list">
          {disciplines.map(({ icon: Icon, label, copy }, index) => (
            <article className="reveal" data-reveal key={label}>
              <span className="discipline-number">0{index + 1}</span>
              <Icon aria-hidden="true" />
              <h3>{label}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contact reveal" data-reveal id="contact" aria-labelledby="contact-title">
        <p>Let&apos;s make something that earns attention.</p>
        <h2 id="contact-title">Have an internship,<br />project, or idea?</h2>
        <div>
          <a href="mailto:singhpralav07@gmail.com"><Mail aria-hidden="true" /> Email me <ArrowUpRight aria-hidden="true" /></a>
          <a href="https://github.com/pralav-25" target="_blank" rel="noreferrer"><GitBranch aria-hidden="true" /> Follow the work</a>
        </div>
      </section>

      <footer>
        <div className="footer-statement"><p>Pralav Singh</p><h2>Building useful things<br />with code and motion.</h2></div>
        <div className="footer-meta">
          <p>Developer · Editor · Problem solver</p>
          <nav aria-label="Footer navigation"><a href="mailto:singhpralav07@gmail.com">Email</a><a href="https://github.com/pralav-25" target="_blank" rel="noreferrer">GitHub</a><a href="https://www.instagram.com/ig_sinisterrrr/" target="_blank" rel="noreferrer">Instagram</a></nav>
          <span>© 2026 Pralav Singh</span>
        </div>
      </footer>
    </main>
  );
}
