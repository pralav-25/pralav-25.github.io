import { ArrowDownRight, ArrowUpRight, Code2, Film, GitBranch, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { EditingGallery } from '@/components/editing-gallery';

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
    category: 'Agency product experience',
    description: 'A distinct web-agency concept with service discovery, a project estimator, accessible navigation, and a lead flow.',
    skills: ['JavaScript', 'Responsive UI', 'Accessibility'],
    image: '/w4u-card.png',
    source: 'https://github.com/pralav-25/w4u',
    live: 'https://w4u-indol.vercel.app',
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
  },
  {
    number: '04',
    name: 'Editing Portfolio',
    category: 'Creative technology',
    description: 'A responsive home for short-form, sports, and story-led video work, pairing React with visual editing practice.',
    skills: ['React', 'TypeScript', 'Video'],
    image: '/editing-card.png',
    source: 'https://github.com/pralav-25/Editing_Portfolio',
  },
];

const disciplines = [
  { icon: Code2, label: 'Product engineering', copy: 'Responsive interfaces, interactive prototypes, APIs, and practical data layers.' },
  { icon: ShieldCheck, label: 'Secure thinking', copy: 'Accessible controls, tested logic, documented choices, and sensible defaults.' },
  { icon: Film, label: 'Visual storytelling', copy: 'Editing, motion, hierarchy, and presentation that make the idea easier to understand.' },
];

const ticker = ['React', 'TypeScript', 'FastAPI', 'Creative code', 'DaVinci Resolve'];

export default function Home() {
  return (
    <main>
      <section className="hero" id="top" aria-labelledby="hero-title">
        <header className="site-header">
          <a className="brand" href="#top" aria-label="Pralav Singh, home">PRALAV<sup>25</sup></a>
          <nav aria-label="Primary navigation">
            <a href="#work">Work</a>
            <a href="#editing">Editing</a>
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
          </nav>
          <div className="header-actions">
            <a className="login-link" href="https://github.com/pralav-25" target="_blank" rel="noreferrer">GitHub</a>
            <a className="contact-pill" href="mailto:singhpralav07@gmail.com">Contact <ArrowUpRight aria-hidden="true" /></a>
          </div>
        </header>

        <a className="float-card float-struct" href="https://github.com/pralav-25/StructIQ" target="_blank" rel="noreferrer" aria-label="View StructIQ">
          <Image src="/structiq-card.png" alt="StructIQ project preview" fill sizes="250px" />
        </a>
        <a className="float-card float-flow" href="https://flow-lock-nine.vercel.app" target="_blank" rel="noreferrer" aria-label="View FlowLock">
          <Image src="/flowlock-card.png" alt="FlowLock project preview" fill sizes="210px" />
        </a>
        <a className="float-card float-w4u" href="https://w4u-indol.vercel.app" target="_blank" rel="noreferrer" aria-label="View Websites4U">
          <Image src="/w4u-card.png" alt="Websites4U project preview" fill sizes="260px" />
        </a>
        <a className="float-card float-edit" href="https://www.instagram.com/ig_sinisterrrr/" target="_blank" rel="noreferrer" aria-label="View Pralav's editing work on Instagram">
          <Image src="/editing-card.png" alt="Editing portfolio preview" fill sizes="205px" />
        </a>
        <div className="float-card float-profile" aria-hidden="true">
          <Image src="https://avatars.githubusercontent.com/u/174412353?v=4" alt="" width={220} height={220} priority />
        </div>

        <div className="hero-center">
          <p className="hero-kicker">A developer &amp; creative portfolio by Pralav Singh</p>
          <h1 id="hero-title">
            <span>Developer</span>
            <span>Designer</span>
            <span className="reverse">Builder</span>
          </h1>
          <p className="hero-intro">I build useful digital products, shape clear interfaces, and tell stories through code and motion.</p>
          <a className="hero-cta" href="#work">Explore the work <ArrowDownRight aria-hidden="true" /></a>
        </div>

        <div className="hero-status"><span /> Open to internships &amp; early-career roles</div>
      </section>

      <div className="ticker" aria-label="Core skills">
        <div className="ticker-track">
          {[...ticker, ...ticker].map((item, index) => <span key={`${item}-${index}`}>{item}<b>✦</b></span>)}
        </div>
      </div>

      <section className="work" id="work" aria-labelledby="work-title">
        <div className="work-heading">
          <p>Selected work · 2025—2026</p>
          <h2 id="work-title">Come for the craft.<br />Stay for the thinking.</h2>
          <a href="https://github.com/pralav-25?tab=repositories" target="_blank" rel="noreferrer">View all repositories <ArrowUpRight aria-hidden="true" /></a>
        </div>

        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.name}>
              <a className="project-media" href={project.live ?? project.source} target="_blank" rel="noreferrer" aria-label={`Open ${project.name}`}>
                <Image src={project.image} alt={`${project.name} project preview`} fill sizes="(max-width: 760px) 100vw, 50vw" />
                <span>{project.number}</span>
              </a>
              <div className="project-copy">
                <div><p>{project.category}</p><h3>{project.name}</h3></div>
                <p>{project.description}</p>
                <div className="project-foot">
                  <div aria-label={`${project.name} skills`}>{project.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
                  <div>
                    <a href={project.source} target="_blank" rel="noreferrer">Code <GitBranch aria-hidden="true" /></a>
                    {project.live ? <a href={project.live} target="_blank" rel="noreferrer">Live <ArrowUpRight aria-hidden="true" /></a> : null}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="editing-work" id="editing" aria-labelledby="editing-title">
        <div className="editing-heading">
          <p>Editing samples · 04 original cuts</p>
          <h2 id="editing-title">Motion, pace,<br />and storytelling.</h2>
          <p>Short-form edits published by Sinister_editzz, plus one clearly credited Instagram reference.</p>
        </div>

        <EditingGallery />
      </section>

      <section className="about" id="about" aria-labelledby="about-title">
        <div className="about-portrait">
          <Image src="https://avatars.githubusercontent.com/u/174412353?v=4" alt="Pralav Singh" width={640} height={640} />
          <span>India · 20.59° N / 78.96° E</span>
        </div>
        <div className="about-copy">
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
        <div className="skills-heading">
          <p className="section-label">How I make things</p>
          <h2 id="skills-title">Useful. Legible.<br />Considered.</h2>
        </div>
        <div className="discipline-list">
          {disciplines.map(({ icon: Icon, label, copy }, index) => (
            <article key={label}>
              <span className="discipline-number">0{index + 1}</span>
              <Icon aria-hidden="true" />
              <h3>{label}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contact" id="contact" aria-labelledby="contact-title">
        <p>Let&apos;s make something that earns attention.</p>
        <h2 id="contact-title">Have an internship,<br />project, or idea?</h2>
        <div>
          <a href="mailto:singhpralav07@gmail.com"><Mail aria-hidden="true" /> Email me</a>
          <a href="https://github.com/pralav-25" target="_blank" rel="noreferrer"><GitBranch aria-hidden="true" /> Follow the work</a>
        </div>
        <Sparkles className="contact-spark" aria-hidden="true" />
      </section>

      <footer>
        <a className="brand footer-brand" href="#top">PRALAV<sup>25</sup></a>
        <p>Developer · Editor · Problem solver</p>
        <div><a href="mailto:singhpralav07@gmail.com">Email</a><a href="https://github.com/pralav-25">GitHub</a><a href="https://www.instagram.com/ig_sinisterrrr/">Instagram</a></div>
        <span>© 2026 Pralav Singh</span>
      </footer>
    </main>
  );
}
