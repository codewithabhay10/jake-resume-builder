import { forwardRef } from 'react';
import type { Bullet, GenericEntry, Section } from '../types';
import {
  buildContactItems,
  findPersonal,
  findSocialLinks,
  hasRenderableContent,
  nonEmptyBullets,
} from '../utils/render';
import { sanitizeBulletHtml } from '../utils/richText';

/** HTML/CSS reproduction of "Jake's Resume" — kept structurally identical to
 * the generated .tex so the preview matches what compiles on Overleaf. */
export const ResumeDocument = forwardRef<HTMLDivElement, { sections: Section[] }>(
  function ResumeDocument({ sections }, ref) {
    const personal = findPersonal(sections);
    const social = findSocialLinks(sections);
    const contactItems = buildContactItems(personal, social);

    return (
      <div ref={ref} className="resume-page">
        {/* ---------- Header ---------- */}
        <header className="resume-header">
          <div className="resume-name">{personal.fullName || 'Your Name'}</div>
          {contactItems.length > 0 && (
            <div className="resume-contact">
              {contactItems.map((item, i) => (
                <span key={i}>
                  {i > 0 && <span className="sep">|</span>}
                  {item.href ? (
                    <a href={item.href}>{item.display}</a>
                  ) : (
                    <span>{item.display}</span>
                  )}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* ---------- Body sections ---------- */}
        {sections.map((section) => {
          if (section.type === 'personal' || section.type === 'social') return null;
          if (!hasRenderableContent(section)) return null;
          return <SectionBlock key={section.id} section={section} />;
        })}
      </div>
    );
  },
);

function SectionBlock({ section }: { section: Section }) {
  return (
    <section className="resume-section">
      <div className="resume-section-title">{section.title}</div>
      <SectionBody section={section} />
    </section>
  );
}

function SectionBody({ section }: { section: Section }) {
  switch (section.type) {
    case 'education':
      return (
        <ul className="resume-list">
          {section.entries.map((e) => (
            <li className="resume-entry" key={e.id}>
              <Subheading
                a={e.institution}
                b={e.location}
                c={e.degree}
                d={e.dateRange}
              />
              <Bullets bullets={e.bullets} />
            </li>
          ))}
        </ul>
      );
    case 'experience':
      return (
        <ul className="resume-list">
          {section.entries.map((e) => (
            <li className="resume-entry" key={e.id}>
              <Subheading a={e.role} b={e.dateRange} c={e.company} d={e.location} />
              <Bullets bullets={e.bullets} />
            </li>
          ))}
        </ul>
      );
    case 'projects':
      return (
        <ul className="resume-list">
          {section.entries.map((e) => (
            <li className="resume-entry" key={e.id}>
              <div className="entry-row project-heading">
                <span className="left">
                  <span className="proj-name">{e.name}</span>
                  {e.technologies.trim() && (
                    <>
                      {' | '}
                      <span className="proj-tech">{e.technologies}</span>
                    </>
                  )}
                </span>
                {e.dateRange.trim() && (
                  <span className="right entry-date">{e.dateRange}</span>
                )}
              </div>
              <Bullets bullets={e.bullets} />
            </li>
          ))}
        </ul>
      );
    case 'generic':
      return (
        <ul className="resume-list">
          {section.entries.map((e) => (
            <li className="resume-entry" key={e.id}>
              <GenericHeading entry={e} />
              <Bullets bullets={e.bullets} />
            </li>
          ))}
        </ul>
      );
    case 'skills':
      return (
        <div className="skills">
          {section.categories
            .filter((c) => c.name.trim() || c.items.trim())
            .map((c) => (
              <div key={c.id}>
                {c.name.trim() && <span className="skill-cat">{c.name}</span>}
                {c.name.trim() ? ': ' : ''}
                {c.items}
              </div>
            ))}
        </div>
      );
    default:
      return null;
  }
}

/** Two-row \resumeSubheading: bold a | right b, then italic c | italic d. */
function Subheading({
  a,
  b,
  c,
  d,
}: {
  a: string;
  b: string;
  c: string;
  d: string;
}) {
  return (
    <>
      <div className="entry-row">
        <span className="left entry-title">{a}</span>
        <span className="right entry-date">{b}</span>
      </div>
      {(c.trim() || d.trim()) && (
        <div className="entry-row">
          <span className="left entry-sub">{c}</span>
          <span className="right entry-date-italic">{d}</span>
        </div>
      )}
    </>
  );
}

function GenericHeading({ entry }: { entry: GenericEntry }) {
  const hasSub = entry.subheading.trim() || entry.location.trim();
  if (hasSub) {
    return (
      <Subheading
        a={entry.heading}
        b={entry.date}
        c={entry.subheading}
        d={entry.location}
      />
    );
  }
  return (
    <div className="entry-row">
      <span className="left entry-title">{entry.heading}</span>
      {entry.date.trim() && (
        <span className="right entry-date">{entry.date}</span>
      )}
    </div>
  );
}

function Bullets({ bullets }: { bullets: Bullet[] }) {
  const items = nonEmptyBullets(bullets);
  if (items.length === 0) return null;
  return (
    <ul className="bullets">
      {items.map((b) => (
        <li
          key={b.id}
          dangerouslySetInnerHTML={{ __html: sanitizeBulletHtml(b.html) }}
        />
      ))}
    </ul>
  );
}
