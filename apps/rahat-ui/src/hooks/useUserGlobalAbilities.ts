import { createMongoAbility, MongoAbility } from '@casl/ability';
import { useListActiveRoles } from '@rahat-ui/query';
import { useUserStore } from '@rumsan/react-query';
import { UUID } from 'crypto';
import { useMemo } from 'react';
import type { ActiveUserRole } from '../sections/users/use.user.active.roles';

/**
 * Global (platform) abilities built live from the DB via
 * `get_user_active_roles` (same cache key the assign-role flow
 * invalidates), filtered to global assignments (`xrefId: null`).
 * Unlike the JWT snapshot, this reflects role edits without logout.
 */
export const useUserGlobalAbilities = (): {
  ability: MongoAbility;
  isLoading: boolean;
} => {
  const uuid = useUserStore((state) => state.user?.data?.uuid);
  const { data, isLoading } = useListActiveRoles(uuid as UUID);

  const ability = useMemo(() => {
    const raw: unknown = (data as any)?.data ?? data;
    const assignments: ActiveUserRole[] = Array.isArray(raw)
      ? (raw as ActiveUserRole[])
      : [];
    const rules = assignments
      .filter((a) => !a.xrefId)
      .flatMap((a) =>
        (a.Role?.Permission ?? []).map((p) => ({
          action: p.action,
          subject: p.subject,
        }))
      );
    return createMongoAbility(rules);
  }, [data]);

  return { ability, isLoading };
};
