import { PERMISSIONS } from 'apps/community-tool-ui/src/constants/app.const';
import { capitalizeFirstLetter } from 'apps/community-tool-ui/src/utils';
import { ShieldCheck } from 'lucide-react';

export default function ViewPermissions({ subject, existingActions }: any) {
  return (
    <div className="mt-2 pb-1 border-b">
      <p className="font-medium">{capitalizeFirstLetter(subject)}</p>
      <div className="flex flex-wrap space-x-4">
        {PERMISSIONS.map(
          (d) =>
            existingActions.includes(d.id) && (
              <div key={d.id} className="flex items-center mt-1">
                <>
                  <ShieldCheck className="" color="green" size={18} />
                  <label>{d.label}</label>
                </>
              </div>
            ),
        )}
      </div>
    </div>
  );
}
