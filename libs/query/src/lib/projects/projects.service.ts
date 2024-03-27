import { CreateProjectPayload } from '@rahat-ui/types';
import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { TAGS } from '../../config';
import { useRSQuery } from '@rumsan/react-query';

import { api } from '../../utils/api';
import { getProjectClient } from '@rahataid/sdk/clients';

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
  return useMutation({
    mutationFn: (data: any) => projectActions(data?.uuid, data.payload),
  });
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
