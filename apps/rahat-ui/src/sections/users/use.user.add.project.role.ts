import { UUID } from 'crypto';
import { useAssignRoleInProject } from '@rahat-ui/query';
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
  const { mutate, mutateAsync, ...rest } = useAssignRoleInProject();

  return {
    ...rest,
    mutate: (payload: AssignRolePayload) => mutate(toMutationArgs(payload)),
    mutateAsync: (payload: AssignRolePayload) =>
      mutateAsync(toMutationArgs(payload)),
  };
};
