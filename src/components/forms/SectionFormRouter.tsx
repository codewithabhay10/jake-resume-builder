import type { Section } from '../../types';
import { PersonalForm } from './PersonalForm';
import { SocialForm } from './SocialForm';
import { EducationForm } from './EducationForm';
import { ExperienceForm } from './ExperienceForm';
import { ProjectsForm } from './ProjectsForm';
import { SkillsForm } from './SkillsForm';
import { GenericForm } from './GenericForm';

/** Renders the correct form for a section based on its discriminated type. */
export function SectionFormRouter({ section }: { section: Section }) {
  switch (section.type) {
    case 'personal':
      return <PersonalForm section={section} />;
    case 'social':
      return <SocialForm section={section} />;
    case 'education':
      return <EducationForm section={section} />;
    case 'experience':
      return <ExperienceForm section={section} />;
    case 'projects':
      return <ProjectsForm section={section} />;
    case 'skills':
      return <SkillsForm section={section} />;
    case 'generic':
      return <GenericForm section={section} />;
  }
}
