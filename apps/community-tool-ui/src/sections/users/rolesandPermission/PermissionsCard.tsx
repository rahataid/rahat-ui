import { PERMISSIONS } from 'apps/community-tool-ui/src/constants/app.const';
import { capitalizeFirstLetter } from 'apps/community-tool-ui/src/utils';

export default function PermissionsCard({
  subject,
  existingActions,
  onUpdate,
}: any) {
  return (
    <div className="mt-5 divide-y divide-gray-200 dark:divide-gray-700">
      <h3>
        <strong>{capitalizeFirstLetter(subject)}</strong>
      </h3>
      <div className="flex flex-wrap gap-4">
        {PERMISSIONS.map((d) => (
          <div key={d.id} className="flex items-center">
            <input
              type="checkbox"
              checked={existingActions.includes(d.id)}
              onChange={() => onUpdate(subject, d.id)}
              className="mr-2"
            />
            <label>{d.label}</label>
          </div>
        ))}
      </div>
    </div>
  );
}
