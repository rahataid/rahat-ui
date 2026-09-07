import { PERMISSIONS } from 'apps/community-tool-ui/src/constants/app.const';
import { capitalizeFirstLetter } from 'apps/community-tool-ui/src/utils';

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
  // const options = PERMISSIONS.filter((d) => actions.includes(d.id));
  const actionLabel = (action: string) =>
    action === 'manage' ? 'access all' : action;

  return (
    <div className="border-t pt-4 first:border-t-0 first:pt-0">
      <h3>
        <strong>{capitalizeFirstLetter(subject)}</strong>
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
