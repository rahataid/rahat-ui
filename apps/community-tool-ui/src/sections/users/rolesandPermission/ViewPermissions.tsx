import { PERMISSIONS } from 'apps/community-tool-ui/src/constants/app.const';
import { capitalizeFirstLetter } from 'apps/community-tool-ui/src/utils';
import { ShieldCheck, ShieldX } from 'lucide-react';

export default function ViewPermissions({ subject, existingActions }: any) {
  const beneficiars = [
    {
      name: 'John',
      extras: {
        above_65: 3,
        male: 3,
      },
    },
    {
      name: 'John',
      extras: {
        above_65: 3,
        male: 3,
      },
    },
  ];
  return (
    <div className="mt-4 divide-y divide-gray-200 dark:divide-gray-700">
      <h3>{capitalizeFirstLetter(subject)}:</h3>
      <div className="flex flex-wrap gap-4">
        {PERMISSIONS.map((d) => (
          <div key={d.id} className="flex items-center mt-2">
            {existingActions.includes(d.id) ? (
              <ShieldCheck color="green" size={18} />
            ) : (
              <ShieldX color="red" size={18} />
            )}
            <label>
              {' '}
              {existingActions.includes(d.id) ? <b>{d.label}</b> : d.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
