import type { Section } from '../../types';
import { useResumeStore } from '../../store/useResumeStore';
import { Field } from '../common/ui';

export function PersonalForm({
  section,
}: {
  section: Extract<Section, { type: 'personal' }>;
}) {
  const updatePersonal = useResumeStore((s) => s.updatePersonal);
  const d = section.data;
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Field
        label="Full Name"
        value={d.fullName}
        onChange={(v) => updatePersonal({ fullName: v })}
        placeholder="Jake Ryan"
      />
      <Field
        label="Phone"
        value={d.phone}
        onChange={(v) => updatePersonal({ phone: v })}
        placeholder="123-456-7890"
      />
      <Field
        label="Email"
        type="email"
        value={d.email}
        onChange={(v) => updatePersonal({ email: v })}
        placeholder="jake@su.edu"
      />
      <Field
        label="Location"
        optional
        value={d.location}
        onChange={(v) => updatePersonal({ location: v })}
        placeholder="Georgetown, TX"
      />
      <div className="sm:col-span-2">
        <Field
          label="Website"
          optional
          value={d.website}
          onChange={(v) => updatePersonal({ website: v })}
          placeholder="jakeryan.dev"
        />
      </div>
    </div>
  );
}
