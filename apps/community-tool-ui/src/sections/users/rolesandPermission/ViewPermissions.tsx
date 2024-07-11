import { PERMISSIONS } from 'apps/community-tool-ui/src/constants/app.const';
import { capitalizeFirstLetter } from 'apps/community-tool-ui/src/utils';
import { ShieldCheck } from 'lucide-react';

export default function ViewPermissions({ subject, existingActions }: any) {
  return (
    <div className="mt-4 divide-y divide-gray-200 dark:divide-gray-700">
      <h3>
        <strong>{capitalizeFirstLetter(subject)}</strong>
      </h3>
      <div className="flex flex-wrap">
        {PERMISSIONS.map((d) => (
          <div key={d.id} className="flex items-center mt-2">
            {existingActions.includes(d.id) && (
              <>
                <ShieldCheck className="ml-2" color="green" size={18} />
                <label>{d.label}</label>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
