import type { Bullet, Section } from '../types';
import { uid } from '../utils/id';

const b = (html: string): Bullet => ({ id: uid('b'), html });

/**
 * A complete CS-student sample resume (the classic "Jake Ryan" example that
 * ships with Jake's Resume), plus one add-on section to show off the optional
 * templates. Used by the "Load Sample Data" button.
 */
export function createSampleSections(): Section[] {
  return [
    {
      id: uid('sec'),
      type: 'personal',
      title: 'Personal Information',
      removable: false,
      category: 'core',
      data: {
        fullName: 'Jake Ryan',
        phone: '123-456-7890',
        email: 'jake@su.edu',
        location: 'Georgetown, TX',
        website: '',
      },
    },
    {
      id: uid('sec'),
      type: 'social',
      title: 'Additional Social Links',
      removable: false,
      category: 'core',
      links: [
        { id: uid('ln'), label: 'LinkedIn', url: 'https://linkedin.com/in/jake' },
        { id: uid('ln'), label: 'GitHub', url: 'https://github.com/jake' },
      ],
    },
    {
      id: uid('sec'),
      type: 'education',
      title: 'Education',
      removable: false,
      category: 'core',
      entries: [
        {
          id: uid('edu'),
          institution: 'Southwestern University',
          location: 'Georgetown, TX',
          degree: 'Bachelor of Arts in Computer Science, Minor in Business',
          dateRange: 'Aug. 2018 -- May 2021',
        },
        {
          id: uid('edu'),
          institution: 'Blinn College',
          location: 'Bryan, TX',
          degree: "Associate's in Liberal Arts",
          dateRange: 'Aug. 2014 -- May 2018',
        },
      ],
    },
    {
      id: uid('sec'),
      type: 'experience',
      title: 'Experience',
      removable: false,
      category: 'core',
      entries: [
        {
          id: uid('exp'),
          role: 'Undergraduate Research Assistant',
          dateRange: 'June 2020 -- Present',
          company: 'Texas A&M University',
          location: 'College Station, TX',
          bullets: [
            b('Developed a <b>REST API</b> using FastAPI and PostgreSQL to store data from learning management systems'),
            b('Developed a full-stack web application using Flask, React, PostgreSQL and Docker to analyze GitHub data'),
            b('Explored ways to visualize GitHub collaboration in a classroom setting'),
          ],
        },
        {
          id: uid('exp'),
          role: 'Information Technology Support Specialist',
          dateRange: 'Sep. 2018 -- Present',
          company: 'Southwestern University',
          location: 'Georgetown, TX',
          bullets: [
            b('Communicate with managers to set up campus computers used on campus'),
            b('Assess and troubleshoot computer problems brought by students, faculty and staff'),
            b('Maintain upkeep of computers, classroom equipment, and 200 printers across campus'),
          ],
        },
        {
          id: uid('exp'),
          role: 'Artificial Intelligence Research Assistant',
          dateRange: 'May 2019 -- July 2019',
          company: 'Southwestern University',
          location: 'Georgetown, TX',
          bullets: [
            b('Explored methods to generate video game dungeons based off of <i>The Legend of Zelda</i>'),
            b('Developed a game in Java to test the generated dungeons'),
            b('Contributed 50K+ lines of code to an established codebase via Git'),
            b('Conducted a human subject study to determine which video game dungeon generation technique is more enjoyable'),
            b('Wrote an 8-page paper and gave multiple presentations on-campus'),
            b('Presented virtually to the World Conference on Computational Intelligence'),
          ],
        },
      ],
    },
    {
      id: uid('sec'),
      type: 'projects',
      title: 'Projects',
      removable: false,
      category: 'core',
      entries: [
        {
          id: uid('proj'),
          name: 'Gitlytics',
          technologies: 'Python, Flask, React, PostgreSQL, Docker',
          dateRange: 'June 2020 -- Present',
          bullets: [
            b('Developed a full-stack web application using Flask serving a REST API with React as the frontend'),
            b("Implemented GitHub OAuth to get data from user's repositories"),
            b('Visualized GitHub data to show collaboration'),
            b('Used Celery and Redis for asynchronous tasks'),
          ],
        },
        {
          id: uid('proj'),
          name: 'Simple Paintball',
          technologies: 'Spigot API, Java, Maven, TravisCI, Git',
          dateRange: 'May 2018 -- May 2020',
          bullets: [
            b('Developed a Minecraft server plugin to entertain kids during free time for a previous job'),
            b('Published plugin to websites gaining 2K+ downloads and an average 4.5/5-star review'),
            b('Implemented continuous delivery using TravisCI to build the plugin upon new releases'),
            b('Collaborated with Minecraft server administrators to suggest features and get feedback'),
          ],
        },
      ],
    },
    {
      id: uid('sec'),
      type: 'skills',
      title: 'Technical Skills',
      removable: false,
      category: 'core',
      categories: [
        {
          id: uid('skill'),
          name: 'Languages',
          items: 'Java, Python, C/C++, SQL (Postgres), JavaScript, HTML/CSS, R',
        },
        {
          id: uid('skill'),
          name: 'Frameworks',
          items: 'React, Node.js, Flask, JUnit, WordPress, Material-UI, FastAPI',
        },
        {
          id: uid('skill'),
          name: 'Developer Tools',
          items: 'Git, Docker, TravisCI, Google Cloud Platform, VS Code, PyCharm, IntelliJ, Eclipse',
        },
        {
          id: uid('skill'),
          name: 'Libraries',
          items: 'pandas, NumPy, Matplotlib',
        },
      ],
    },
    {
      id: uid('sec'),
      type: 'generic',
      title: 'Certifications',
      removable: true,
      category: 'professional',
      entries: [
        {
          id: uid('gen'),
          heading: 'AWS Certified Cloud Practitioner',
          subheading: 'Amazon Web Services',
          date: 'Mar. 2021',
          location: '',
          bullets: [],
        },
      ],
    },
  ];
}
