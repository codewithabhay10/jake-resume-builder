import type {
  Bullet,
  EducationEntry,
  ExperienceEntry,
  GenericEntry,
  GenericLayout,
  ProjectEntry,
  Section,
  SkillCategory,
} from '../types';
import { latexEscape, latexEscapeDate, latexEscapeUrl } from './escape';
import { richHtmlToLatex } from './richToLatex';
import {
  buildContactItems,
  ensureHttp,
  findPersonal,
  findSocialLinks,
  hasRenderableContent,
  nonEmptyBullets,
} from '../utils/render';

/** The verbatim "Jake's Resume" preamble + custom macros (MIT, J. Gutierrez). */
const PREAMBLE = String.raw`%-------------------------
% Resume in Latex
% Author : Jake Gutierrez
% Based off of: https://github.com/sb2nov/resume
% License : MIT
%------------------------

\documentclass[letterpaper,11pt]{article}

\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\usepackage{tabularx}
\input{glyphtounicode}


%----------FONT OPTIONS----------
% sans-serif
% \usepackage[sfdefault]{FiraSans}
% \usepackage[sfdefault]{roboto}
% \usepackage[sfdefault]{noto-sans}
% \usepackage[default]{sourcesanspro}

% serif
% \usepackage{CormorantGaramond}
% \usepackage{charter}


\pagestyle{fancy}
\fancyhf{} % clear all header and footer fields
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

% Adjust margins
\addtolength{\oddsidemargin}{-0.5in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1in}
\addtolength{\topmargin}{-.5in}
\addtolength{\textheight}{1.0in}

\urlstyle{same}

\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

% Sections formatting
\titleformat{\section}{
  \vspace{-4pt}\scshape\raggedright\large
}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\pdfgentounicode=1

%-------------------------
% Custom commands
\newcommand{\resumeItem}[1]{
  \item\small{
    {#1 \vspace{-2pt}}
  }
}

\newcommand{\resumeSubheading}[4]{
  \vspace{-2pt}\item
    \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{#1} & #2 \\
      \textit{\small#3} & \textit{\small #4} \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeSubSubheading}[2]{
    \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \textit{\small#1} & \textit{\small #2} \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeProjectHeading}[2]{
    \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \small#1 & #2 \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeSubItem}[1]{\resumeItem{#1}\vspace{-4pt}}

\renewcommand\labelitemii{$\vcenter{\hbox{\tiny$\bullet$}}$}

\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.15in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`;

/** Build the full Jake's-Resume .tex document from the resume sections. */
export function generateLatex(sections: Section[]): string {
  const out: string[] = [PREAMBLE, '', '\\begin{document}', ''];

  out.push(buildHeader(sections));

  for (const section of sections) {
    if (section.type === 'personal' || section.type === 'social') continue;
    if (!hasRenderableContent(section)) continue;
    out.push(buildSection(section));
  }

  out.push('\\end{document}');
  return out.join('\n');
}

function buildHeader(sections: Section[]): string {
  const personal = findPersonal(sections);
  const social = findSocialLinks(sections);
  const items = buildContactItems(personal, social);

  const contactParts = items.map((it) =>
    it.href
      ? `\\href{${it.href}}{\\underline{${latexEscape(it.display)}}}`
      : latexEscape(it.display),
  );

  const name = latexEscape(personal.fullName) || '\\,';
  const contactLine =
    contactParts.length > 0
      ? '    \\small ' + contactParts.join(' $|$ ')
      : '';

  return [
    '%----------HEADING----------',
    '\\begin{center}',
    `    {\\Huge ${name}} \\\\ \\vspace{1pt}`,
    contactLine,
    '\\end{center}',
    '',
  ]
    .filter((l) => l !== '')
    .join('\n');
}

function buildSection(section: Section): string {
  const title = latexEscape(section.title);
  switch (section.type) {
    case 'education':
      return wrapList(title, section.entries.map(eduEntry));
    case 'experience':
      return wrapList(title, section.entries.map(expEntry));
    case 'projects':
      return wrapList(title, section.entries.map(projectEntry));
    case 'generic':
      if (section.layout === 'bullets') {
        return buildGenericBullets(title, section.entries);
      }
      return wrapList(
        title,
        section.entries.map((e) => genericEntry(e, section.layout)),
      );
    case 'skills':
      return buildSkills(title, section.categories);
    default:
      return '';
  }
}

function wrapList(title: string, entries: string[]): string {
  return [
    `\\section{${title}}`,
    '  \\resumeSubHeadingListStart',
    ...entries,
    '  \\resumeSubHeadingListEnd',
    '',
  ].join('\n');
}

function eduEntry(e: EducationEntry): string {
  const lines = [
    '    \\resumeSubheading',
    `      {${latexEscape(e.institution)}}{${latexEscape(e.location)}}`,
    `      {${latexEscape(e.degree)}}{${latexEscapeDate(e.dateRange)}}`,
  ];
  lines.push(bulletBlock(e.bullets));
  return lines.filter(Boolean).join('\n');
}

function expEntry(e: ExperienceEntry): string {
  const lines = [
    '    \\resumeSubheading',
    `      {${latexEscape(e.role)}}{${latexEscapeDate(e.dateRange)}}`,
    `      {${latexEscape(e.company)}}{${latexEscape(e.location)}}`,
  ];
  lines.push(bulletBlock(e.bullets));
  return lines.filter(Boolean).join('\n');
}

function projectEntry(e: ProjectEntry): string {
  const left = e.technologies.trim()
    ? `\\textbf{${latexEscape(e.name)}} $|$ \\emph{${latexEscape(e.technologies)}}`
    : `\\textbf{${latexEscape(e.name)}}`;
  const lines = [
    '    \\resumeProjectHeading',
    `      {${left}}{${latexEscapeDate(e.dateRange)}}`,
  ];
  lines.push(bulletBlock(e.bullets));
  return lines.filter(Boolean).join('\n');
}

/** LaTeX-escape `text`, wrapping it in an \href (Jake's underline style) when
 * a URL is supplied so the heading/subheading becomes a clickable link. */
function linkedText(text: string, url: string): string {
  const escaped = latexEscape(text);
  const href = ensureHttp(url);
  return href
    ? `\\href{${latexEscapeUrl(href)}}{\\underline{${escaped}}}`
    : escaped;
}

function genericEntry(e: GenericEntry, layout: GenericLayout): string {
  const heading = linkedText(e.heading, e.headingUrl);
  const lines: string[] = [];

  if (layout === 'inline') {
    // Heading and subheading on one line, date/location on the right.
    const sub = e.subheading.trim()
      ? ` $|$ \\textit{${linkedText(e.subheading, e.subheadingUrl)}}`
      : '';
    const right = [
      e.date.trim() ? latexEscapeDate(e.date) : '',
      e.location.trim() ? latexEscape(e.location) : '',
    ]
      .filter(Boolean)
      .join(' $\\cdot$ ');
    lines.push(
      '    \\resumeProjectHeading',
      `      {\\textbf{${heading}}${sub}}{${right}}`,
    );
  } else if (e.subheading.trim() || e.location.trim()) {
    lines.push(
      '    \\resumeSubheading',
      `      {${heading}}{${latexEscapeDate(e.date)}}`,
      `      {${linkedText(e.subheading, e.subheadingUrl)}}{${latexEscape(e.location)}}`,
    );
  } else {
    lines.push(
      '    \\resumeProjectHeading',
      `      {\\textbf{${heading}}}{${latexEscapeDate(e.date)}}`,
    );
  }

  lines.push(bulletBlock(e.bullets));
  return lines.filter(Boolean).join('\n');
}

/** Bullets-only generic section: a flat itemize of every entry's bullets. */
function buildGenericBullets(title: string, entries: GenericEntry[]): string {
  const items = entries.flatMap((e) => nonEmptyBullets(e.bullets));
  return [
    `\\section{${title}}`,
    '  \\begin{itemize}[leftmargin=0.15in]',
    ...items.map((b) => `    \\resumeItem{${richHtmlToLatex(b.html)}}`),
    '  \\end{itemize}',
    '',
  ].join('\n');
}

/** \resumeItemListStart ... \resumeItemListEnd — only when bullets exist. */
function bulletBlock(bullets: Bullet[]): string {
  const items = nonEmptyBullets(bullets);
  if (items.length === 0) return '';
  return [
    '      \\resumeItemListStart',
    ...items.map((b) => `        \\resumeItem{${richHtmlToLatex(b.html)}}`),
    '      \\resumeItemListEnd',
  ].join('\n');
}

function buildSkills(title: string, categories: SkillCategory[]): string {
  const lines = categories
    .filter((c) => c.name.trim() || c.items.trim())
    .map(
      (c) =>
        `     \\textbf{${latexEscape(c.name)}}{: ${latexEscape(c.items)}} \\\\`,
    );
  return [
    `\\section{${title}}`,
    ' \\begin{itemize}[leftmargin=0.15in, label={}]',
    '    \\small{\\item{',
    ...lines,
    '    }}',
    ' \\end{itemize}',
    '',
  ].join('\n');
}
