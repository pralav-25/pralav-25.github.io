"use client";

import { useState } from 'react';
import { ArrowUpRight, GitBranch } from 'lucide-react';
import Image from 'next/image';

const projects = [
  {
    number: '01',
    name: 'ShiftWatch',
    category: 'Featured · Machine learning & data drift',
    description: 'A reproducible ML evaluation pipeline and interactive dashboard for spotting data drift. Compares three classifiers with five-fold cross-validation, then checks new data with PSI, KS tests, and missingness alerts. Includes a numerical CSV comparison CLI.',
    evidence: 'On 54 held-out UCI Wine rows, accuracy fell from 98.1% to 53.7% under a controlled synthetic stress test, with four shifted features flagged. Backed by 31 automated tests.',
    skills: ['Python', 'scikit-learn', 'SciPy', 'React', 'TypeScript'],
    image: '/shiftwatch-results.png',
    imageAlt: 'ShiftWatch experiment: accuracy across untouched, moderate shift, severe shift, and missing-data scenarios, alongside flagged feature counts.',
    source: 'https://github.com/pralav-25/shiftwatch',
    live: 'https://pralav-25.github.io/shiftwatch/',
    methodology: 'https://github.com/pralav-25/shiftwatch/blob/main/docs/methodology.md',
    featured: true,
  },
  {
    number: '02',
    name: 'StructIQ',
    category: 'Infrastructure intelligence',
    description: 'Predictive monitoring with a FastAPI service, SQLite data layer, asset diagnostics, and tested health scoring.',
    skills: ['Python', 'FastAPI', 'SQLite'],
    image: '/structiq-card.png',
    source: 'https://github.com/pralav-25/StructIQ',
  },
  {
    number: '03',
    name: 'Websites4U',
    category: 'Agency product experience',
    description: 'A distinct web-agency concept with service discovery, a project estimator, accessible navigation, and a lead flow.',
    skills: ['JavaScript', 'Responsive UI', 'Accessibility'],
    image: '/w4u-card.png',
    source: 'https://github.com/pralav-25/w4u',
    live: 'https://w4u-indol.vercel.app',
  },
  {
    number: '04',
    name: 'FlowLock',
    category: 'Interactive API security',
    description: 'A visual product concept that explains behavior-based abuse detection and rate-limit bypass scenarios.',
    skills: ['API Security', 'JavaScript', 'Three.js'],
    image: '/flowlock-card.png',
    source: 'https://github.com/pralav-25/FlowLock',
    live: 'https://flow-lock-nine.vercel.app',
  },
  {
    number: '05',
    name: 'Editing Portfolio',
    category: 'Creative technology',
    description: 'A responsive home for short-form, sports, and story-led video work, pairing React with visual editing practice.',
    skills: ['React', 'TypeScript', 'Video'],
    image: '/editing-card.png',
    source: 'https://github.com/pralav-25/Editing_Portfolio',
  },
];

export function ProjectBrowser() {
  const [query, setQuery] = useState('');
  const term = query.trim().toLocaleLowerCase();
  const matches = (project: typeof projects[number]) =>
    [project.name, project.category, project.description, ...project.skills]
      .join(' ').toLocaleLowerCase().includes(term);
  const count = projects.filter(matches).length;
  return <>
    <div className="project-search">
      <label htmlFor="project-query">Find a project by name, skill, or topic</label>
      <div>
        <input id="project-query" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try Python, React, or security" aria-controls="project-results" />
        {query && <button type="button" onClick={() => setQuery('')}>Clear search</button>}
      </div>
      <output aria-live="polite">{count ? `${count} of ${projects.length} projects` : 'No matching projects. Try another skill or clear your search.'}</output>
    </div>
        <div className="project-grid" id="project-results">
          {projects.map((project) => (
            <article hidden={!matches(project)} className={`project-card${project.featured ? ' project-featured' : ''}`} data-reveal="card" key={project.name} id={project.featured ? 'shiftwatch' : undefined}>
              <a className="project-media" data-scroll-scene href={project.live ?? project.source} target="_blank" rel="noreferrer" aria-label={`Open ${project.name}`}>
                <Image src={project.image} alt={project.imageAlt ?? `${project.name} project preview`} fill sizes={project.featured ? '(max-width: 1280px) 100vw, 1280px' : '(max-width: 760px) 100vw, 50vw'} />
                {!project.featured ? <span>{project.number}</span> : null}
              </a>
              <div className="project-copy">
                <div><p>{project.category}</p><h3>{project.name}</h3></div>
                <p>{project.description}</p>
                {project.evidence ? <p className="project-evidence">{project.evidence} <a href={project.methodology} target="_blank" rel="noreferrer">Read the methodology <ArrowUpRight aria-hidden="true" /></a></p> : null}
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
  </>;
}
