import { capitalizeFirstLetter } from 'apps/community-tool-ui/src/utils';
import { useTranslations } from 'next-intl';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';

type ProjectPermissionsCardProps = {
  subject: string;
  actions: string[];
  existingActions: string[];
  onUpdate: (subject: string, action: string) => void;
};

export default function ProjectPermissionsCard({
  subject,
  actions,
  existingActions,
  onUpdate,
}: ProjectPermissionsCardProps) {
  const tg = useTranslations('GLOBAL');
  const tp = useTranslations('USERS_ROLES_PERMISSIONS');

  // Same convention as the sibling PermissionsCard: actions resolve against
  // PERM_* (GLOBAL's DELETE/UPDATE/CREATE are imperative button labels, not
  // permission names), subjects resolve against GLOBAL.
  const actionLabel = (slug: string) =>
    translateValue(tp, `PERM_${String(slug).toUpperCase()}`, {
      fallback: capitalizeFirstLetter(slug),
    });

  const subjectLabel = (slug: string) =>
    translateValue(tg, slug, { fallback: capitalizeFirstLetter(slug) });

  return (
    <div className="border-t pt-4 first:border-t-0 first:pt-0">
      <h3>
        <strong>{subjectLabel(subject)}</strong>
      </h3>
      <div className="flex flex-wrap gap-x-6 gap-y-1">
        {actions.map((d) => (
          <div key={d} className="flex items-center">
            <input
              type="checkbox"
              checked={existingActions.includes(d)}
              onChange={() => onUpdate(subject, d)}
              className="mr-2"
            />
            <label>{actionLabel(d)}</label>
          </div>
        ))}
      </div>
    </div>
  );
}
