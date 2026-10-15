import { UUID } from 'crypto';
import {
  useAssignRoleInProjects,
  useBulkProjectAssign,
  useDeleteRoleAssociatedWithProject,
} from '@rahat-ui/query';
import { AssignRole } from '@rumsan/sdk/types';
import { toast } from 'react-toastify';

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
export const useRemoveRoleInProject = () => {
  const { mutateAsync } = useDeleteRoleAssociatedWithProject();
  return {
    mutateAsync: (payload: { uuid: UUID; xrefId: UUID; name: string }) =>
      mutateAsync(payload),
  };
};
