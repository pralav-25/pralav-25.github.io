import { ArrowDown, ArrowUpRight, Code2, GitBranch, Mail, Play, ShieldCheck, Sparkles } from 'lucide-react';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const projects = [
  {
    number: '01',
    name: 'StructIQ',
    category: 'Infrastructure · FastAPI',
    description: 'A predictive infrastructure-monitoring prototype with a FastAPI service, SQLite data layer, asset diagnostics, and tested health scoring.',
    evidence: ['Python', 'FastAPI', 'SQLite', 'Unit tests'],
    source: 'https://github.com/pralav-25/StructIQ',
  },
  {
    number: '02',
    name: 'Websites4U',
    category: 'Product experience · Frontend',
    description: 'A responsive agency experience with service discovery, an interactive project estimator, accessible navigation, and a working email lead flow.',
    evidence: ['JavaScript', 'Accessibility', 'Responsive UI'],
    source: 'https://github.com/pralav-25/w4u',
    live: 'https://w4u-indol.vercel.app',
  },
  {
    number: '03',
    name: 'FlowLock',
    category: 'Cybersecurity · Interactive concept',
    description: 'A behavior-based API abuse detection concept that explains rate-limit bypass scenarios through an interactive visual experience.',
    evidence: ['API security', 'JavaScript', 'Three.js'],
    source: 'https://github.com/pralav-25/FlowLock',
    live: 'https://flow-lock-nine.vercel.app',
  },
  {
    number: '04',
    name: 'Editing Portfolio',
    category: 'Creative technology · Storytelling',
    description: 'A responsive portfolio for short-form, sports, and story-led video work, pairing React engineering with visual editing practice.',
    evidence: ['React', 'TypeScript', 'Video editing'],
    source: 'https://github.com/pralav-25/Editing_Portfolio',
    live: 'https://editing-portfolio-three.vercel.app',
  },
];

const capabilities = [
  { icon: Code2, title: 'Build the product', copy: 'Responsive interfaces, interactive prototypes, APIs, and pragmatic data layers.' },
  { icon: ShieldCheck, title: 'Respect the details', copy: 'Accessible controls, secure defaults, documented decisions, and testable logic.' },
  { icon: Sparkles, title: 'Tell the story', copy: 'Clear visual hierarchy, motion, video editing, and presentation that supports the idea.' },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Pralav Singh, home">
          <span className="brand-mark">PS</span>
          <span className="brand-copy">Pralav Singh<small>Developer &amp; creative technologist</small></span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#capabilities">Capabilities</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="header-github" href="https://github.com/pralav-25" target="_blank" rel="noreferrer">
          <GitBranch aria-hidden="true" /> GitHub
        </a>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <Badge className="availability"><span aria-hidden="true" />Open to internships &amp; early-career roles</Badge>
          <p className="eyebrow">Developer · Editor · Problem solver</p>
          <h1 id="hero-title">I turn practical ideas into <em>clear digital products.</em></h1>
          <p className="hero-intro">I&apos;m Pralav, a developer and video editor based in India. My work connects engineering, usable interfaces, and visual storytelling.</p>
          <div className="hero-actions">
            <a className={cn(buttonVariants({ size: 'lg' }), 'primary-cta')} href="#work">Explore selected work <ArrowDown aria-hidden="true" /></a>
            <a className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'secondary-cta')} href="mailto:singhpralav07@gmail.com"><Mail aria-hidden="true" />Email me</a>
          </div>
          <dl className="proof-row" aria-label="Portfolio summary">
            <div><dt>13</dt><dd>Public repositories</dd></div>
            <div><dt>Full stack</dt><dd>Frontend to data</dd></div>
            <div><dt>2 disciplines</dt><dd>Code and editing</dd></div>
          </dl>
        </div>

        <aside className="portrait-card" aria-label="About Pralav Singh">
          <div className="portrait-frame">
            <Image src="https://avatars.githubusercontent.com/u/174412353?v=4" alt="Pralav Singh" width={460} height={460} priority />
          </div>
          <div className="portrait-caption">
            <span>Currently exploring</span>
            <strong>Product engineering · API security · creative technology</strong>
          </div>
          <span className="coordinate">20.59° N · 78.96° E</span>
        </aside>
      </section>

      <section className="marquee" aria-label="Technical toolkit">
        <div>{['HTML & CSS', 'JavaScript', 'TypeScript', 'React', 'Python', 'FastAPI', 'SQLite', 'DaVinci Resolve'].map((skill) => <span key={skill}>{skill}</span>)}</div>
      </section>

      <section className="section work-section" id="work" aria-labelledby="work-title">
        <div className="section-heading">
          <div><p className="eyebrow">Selected work · 2025–2026</p><h2 id="work-title">Evidence over adjectives.</h2></div>
          <p>Four projects that show how I approach products, systems, security, and visual communication. Source is public; live demos are linked where available.</p>
        </div>
        <div className="project-list">
          {projects.map((project) => (
            <article className="project" key={project.name}>
              <div className="project-number" aria-hidden="true">{project.number}</div>
              <div className="project-body">
                <p>{project.category}</p>
                <h3>{project.name}</h3>
                <p className="project-description">{project.description}</p>
                <div className="tags" aria-label={`${project.name} technologies`}>{project.evidence.map((item) => <span key={item}>{item}</span>)}</div>
              </div>
              <div className="project-links">
                <a href={project.source} target="_blank" rel="noreferrer">Source <ArrowUpRight aria-hidden="true" /></a>
                {project.live ? <a href={project.live} target="_blank" rel="noreferrer">Live demo <Play aria-hidden="true" /></a> : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section capability-section" id="capabilities" aria-labelledby="capabilities-title">
        <div className="section-heading compact"><div><p className="eyebrow">How I work</p><h2 id="capabilities-title">Useful, legible, considered.</h2></div></div>
        <div className="capability-grid">
          {capabilities.map(({ icon: Icon, title, copy }, index) => (
            <article key={title}>
              <span className="capability-icon"><Icon aria-hidden="true" /></span>
              <span className="capability-index">0{index + 1}</span>
              <h3>{title}</h3><p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact" aria-labelledby="contact-title">
        <p className="eyebrow">Let&apos;s build something useful</p>
        <h2 id="contact-title">Have an internship, project, or idea in mind?</h2>
        <div className="contact-actions">
          <a href="mailto:singhpralav07@gmail.com"><Mail aria-hidden="true" />singhpralav07@gmail.com</a>
          <a href="https://github.com/pralav-25" target="_blank" rel="noreferrer"><GitBranch aria-hidden="true" />github.com/pralav-25</a>
        </div>
      </section>

      <footer><span>Designed and built by Pralav Singh.</span><span>India · 2026</span></footer>
    </main>
  );
}
