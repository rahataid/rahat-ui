import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { Settings2 } from 'lucide-react';
import type {
  ExtendedTriggerLogic,
  ExtendedTriggerLogicGroup,
} from '../types/extended-trigger-logic.types';

type TriggerItem = {
  uuid?: string;
  logicKey?: string;
  title?: string;
};

type IProps = {
  extendedTriggerLogic?: ExtendedTriggerLogic | null;
  triggers?: TriggerItem[];
  onConfigure?: () => void;
};

function resolveLogicKey(
  logicKey: string,
  triggers: TriggerItem[],
): string {
  const found = triggers.find((t) => t.logicKey === logicKey);
  return found?.title || logicKey;
}

function GroupCard({
  group,
  index,
  triggers,
}: {
  group: ExtendedTriggerLogicGroup;
  index: number;
  triggers: TriggerItem[];
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">Group {index + 1}</p>
        <Badge
          variant="outline"
          className={`text-xs ${
            group.operator === 'AND'
              ? 'border-blue-400 text-blue-600'
              : 'border-orange-400 text-orange-600'
          }`}
        >
          {group.operator}
        </Badge>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {group.triggers.map((logicKey) => (
          <Badge
            key={logicKey}
            className="bg-white border text-gray-700 font-normal text-xs"
          >
            {resolveLogicKey(logicKey, triggers)}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export default function ExtendedTriggerLogicCard({
  extendedTriggerLogic,
  triggers = [],
  onConfigure,
}: IProps) {
  const hasConfig =
    extendedTriggerLogic &&
    extendedTriggerLogic.groups &&
    extendedTriggerLogic.groups.length > 0;

  return (
    <div className="mt-4 p-4 rounded-xl border shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-base font-semibold">Extended Trigger Logic</p>
          <p className="text-xs text-muted-foreground">
            Additional grouped AND/OR conditions
          </p>
        </div>
        <RoleAuth
          roles={[AARoles.ADMIN, AARoles.Municipality]}
          hasContent={false}
        >
          <Button
            variant="outline"
            size="sm"
            className="border-primary text-primary gap-1.5"
            onClick={onConfigure}
          >
            <Settings2 className="h-4 w-4" />
            View / Configure
          </Button>
        </RoleAuth>
      </div>

      {hasConfig ? (
        <div className="space-y-2">
          {extendedTriggerLogic.groups.map((group, i) => (
            <div key={i}>
              <GroupCard group={group} index={i} triggers={triggers} />
              {i < extendedTriggerLogic.groups.length - 1 && (
                <div className="flex items-center justify-center py-1.5">
                  <Badge
                    className={`text-xs ${
                      extendedTriggerLogic.joinOperator === 'AND'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {extendedTriggerLogic.joinOperator}
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-sm text-gray-400">
          No extended trigger logic configured
        </div>
      )}
    </div>
  );
}
