import { PERMISSIONS } from 'apps/community-tool-ui/src/constants/app.const';
import { capitalizeFirstLetter } from 'apps/community-tool-ui/src/utils';
import { useTranslations } from 'next-intl';

export default function PermissionsCard({
  subject,
  existingActions,
  onUpdate,
}: any) {
  const tg = useTranslations('GLOBAL');
  const tp = useTranslations('USERS_ROLES_PERMISSIONS');

  // Subjects and actions arrive as lowercase slugs ("beneficiary", "manage").
  // Actions resolve against PERM_* first: GLOBAL's DELETE/UPDATE/CREATE are
  // imperative button labels ("मेटाउनुहोस्" = "Delete it!"), which read wrong as
  // the name of a permission, and they are shared with 25+ real buttons so they
  // cannot be reworded here. Subjects still use GLOBAL, where the plain nouns fit.
  const actionLabel = (slug: string, fallback: string) => {
    const key = `PERM_${String(slug).toUpperCase()}`;
    return tp.has(key as never) ? tp(key as never) : fallback;
  };

  const subjectLabel = (slug: string, fallback: string) => {
    const key = String(slug).toUpperCase();
    return tg.has(key as never) ? tg(key as never) : fallback;
  };

  return (
    <div className={subject !== 'all' ? 'border-t pt-4' : ''}>
      <h3>
        <strong>{subjectLabel(subject, capitalizeFirstLetter(subject))}</strong>
      </h3>
      <div className="flex flex-wrap gap-8">
        {PERMISSIONS.map((d) => (
          <div key={d.id} className="flex items-center mb-1">
            <input
              type="checkbox"
              checked={existingActions.includes(d.id)}
              onChange={() => onUpdate(subject, d.id)}
              className="mr-2"
            />
            <label>{actionLabel(d.id, d.label)}</label>
          </div>
        ))}
      </div>
    </div>
  );
}
