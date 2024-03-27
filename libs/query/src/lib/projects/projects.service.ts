import { CreateProjectPayload } from '@rahat-ui/types';
import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { TAGS } from '../../config';
import { useRSQuery } from '@rumsan/react-query';

import { api } from '../../utils/api';
import { getProjectClient } from '@rahataid/sdk/clients';
import { UUID } from 'crypto';
import { FormattedResponse } from '@rumsan/sdk/utils';
import { ProjectActions } from '@rahataid/sdk/project/project.types';

const createProject = async (payload: CreateProjectPayload) => {
  const res = await api.post('/projects', payload);
  return res.data;
};

export const useProjectCreateMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => createProject(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_ALL_PROJECTS] });
    },
  });
};

const projectActions = async (uuid: any, payload: any) => {
  const res = await api.post(`/projects/${uuid}/actions`, payload);
  return res.data;
};

export const useProjectAction = () => {
  const { queryClient, rumsanService } = useRSQuery();
  const projecClient = getProjectClient(rumsanService.client);
  return useMutation<
    FormattedResponse<any>,
    Error,
    {
      uuid: `${string}-${string}-${string}-${string}-${string}`;
      data: ProjectActions;
    },
    unknown
  >(
    {
      mutationFn: projecClient.projectActions,
    },
    queryClient,
  );
};

export const useProjectSettings = (uuid: UUID) => {
  const q = useProjectAction();
  const query = useQuery({
    queryKey: [TAGS.GET_PROJECT_SETTINGS],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: { action: 'get_settings' },
      });
      return mutate;
    },
  });
  return query;
};

export const useProjectList = (payload: any): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();

  const projectClient = getProjectClient(rumsanService.client);
  return useQuery(
    {
      queryKey: [TAGS.GET_ALL_PROJECTS, payload],
      queryFn: () => projectClient.list(payload),
    },
    queryClient,
  );
};

export const useProject = (uuid: UUID): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();

  const projectClient = getProjectClient(rumsanService.client);
  return useQuery(
    {
      queryKey: [TAGS.GET_PROJECT_DETAILS, uuid],
      queryFn: () => projectClient.get(uuid),
    },
    queryClient,
  );
};
