import { UUID } from 'crypto';
import { useAssignRoleInProjects, useBulkProjectAssign } from '@rahat-ui/query';
import { AssignRole } from '@rumsan/sdk/types';

type AssignRolePayload = {
  uuid: UUID;
  name: string;
  expiry?: string;
  xrefId?: string;
};

const toMutationArgs = ({ uuid, name, expiry, xrefId }: AssignRolePayload) => {
  const data: AssignRole = {
    name,
    ...(expiry ? { expiry } : {}),
    ...(xrefId ? { xrefId } : {}),
  };
  return { uuid, data };
};

export const useUserAssignRole = () => {
  const { mutate, mutateAsync, ...rest } = useAssignRoleInProjects();

  return {
    ...rest,
    mutate: (payload: AssignRolePayload) => mutate(toMutationArgs(payload)),
    mutateAsync: (payload: AssignRolePayload) =>
      mutateAsync(toMutationArgs(payload)),
  };
};

export const useAssigToMultipleProjects = () => {
  const { mutateAsync, ...rest } = useBulkProjectAssign();
  return {
    ...rest,
    mutateAsync: (payload: {
      uuid: UUID;
      data: { roles: Pick<AssignRole, 'name' | 'xrefId'>[] };
    }) => mutateAsync(payload),
  };
};
