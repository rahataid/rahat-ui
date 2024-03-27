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
import { Project, ProjectActions } from '@rahataid/sdk/project/project.types';
import { PaginatedResult, Pagination } from '@rumsan/sdk/types';
import { useProjectSettingsStore, useProjectStore } from './project.store';
import { useEffect } from 'react';
import { isEmpty } from 'lodash';

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
  const { setSettings, settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
    setSettings: state.setSettings,
  }));

  const query = useQuery({
    queryKey: [TAGS.GET_PROJECT_SETTINGS],
    enabled: isEmpty(settings?.[uuid]),
    // enabled: !!settings[uuid],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'settings.get',
          payload: {
            name: 'CONTRACT',
          },
        },
      });
      return mutate.data.value;
    },
    // initialData: settings?.[uuid],
  });

  useEffect(() => {
    if (query.isSuccess) {
      setSettings({
        ...settings,
        [uuid]: query?.data,
      });
    }
  }, [query.data]);

  return query;
};

export const useProjectList = (
  payload: Pagination,
): UseQueryResult<FormattedResponse<Project[]>, Error> => {
  const { queryClient, rumsanService } = useRSQuery();

  const projectClient = getProjectClient(rumsanService.client);
  return useQuery(
    {
      queryKey: [TAGS.GET_ALL_PROJECTS, payload],
      // todo, add support for pagination
      queryFn: () => projectClient.list(payload as any),
      refetchOnWindowFocus: true,
      retryOnMount: true,
    },
    queryClient,
  );
};
export const useProject = (
  uuid: UUID,
): UseQueryResult<FormattedResponse<Project>, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const setSingleProject = useProjectStore((state) => state.setSingleProject);

  const projectClient = getProjectClient(rumsanService.client);
  const query = useQuery(
    {
      queryKey: [TAGS.GET_PROJECT_DETAILS, uuid],
      queryFn: () => projectClient.get(uuid),
    },
    queryClient,
  );

  useEffect(() => {
    if (query.data) {
      setSingleProject(query.data.data); // Access the 'data' property of the 'FormattedResponse' object
    }
  }, [query.data]);
  return query;
};
