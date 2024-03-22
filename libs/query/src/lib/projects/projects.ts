import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TAGS } from '../../config';
import { api } from '../../utils/api';

const createProject = async (payload: any) => {
  const res = await api.post('/projects', payload);
  return res.data;
};

const useProjectCreateMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: any) => createProject(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_ALL_PROJECTS] });
    },
  });
};

const projectActions = async (uuid: any, data: any) => {
  const res = await api.post(`/projects/${uuid}/actions`, data.data);
  return res.data;
};

const useProjectAction = () => {
  return useMutation({
    mutationFn: (data: any) => {
      return projectActions(data?.uuid, data);
    },
  });
};

export { useProjectCreateMutation, useProjectAction };
