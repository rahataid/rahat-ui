import { PERMISSIONS } from 'apps/community-tool-ui/src/constants/app.const';
import { capitalizeFirstLetter } from 'apps/community-tool-ui/src/utils';
import { ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';

export default function ViewPermissions({ subject, existingActions }: any) {
  const tg = useTranslations('GLOBAL');
  const tp = useTranslations('USERS_ROLES_PERMISSIONS');

  // Subjects and actions arrive as lowercase slugs ("beneficiary", "manage").
  // Actions resolve against PERM_* first: GLOBAL's DELETE/UPDATE/CREATE are
  // imperative button labels ("मेटाउनुहोस्" = "Delete it!"), which read wrong as
  // the name of a permission, and they are shared with 25+ real buttons so they
  // cannot be reworded here. Subjects still use GLOBAL, where the plain nouns fit.
  const actionLabel = (slug: string, fallback: string) =>
    translateValue(tp, `PERM_${String(slug).toUpperCase()}`, { fallback });

  const subjectLabel = (slug: string, fallback: string) =>
    translateValue(tg, String(slug).toUpperCase(), { fallback });

  return (
    <div className="mt-2 pb-1 border-b">
      <p className="font-medium">
        {subjectLabel(subject, capitalizeFirstLetter(subject))}
      </p>
      <div className="flex flex-wrap space-x-4">
        {PERMISSIONS.map(
          (d) =>
            existingActions.includes(d.id) && (
              <div key={d.id} className="flex items-center mt-1">
                <>
                  <ShieldCheck className="" color="green" size={18} />
                  <label>{actionLabel(d.id, d.label)}</label>
                </>
              </div>
            ),
        )}
      </div>
    </div>
  );
}
