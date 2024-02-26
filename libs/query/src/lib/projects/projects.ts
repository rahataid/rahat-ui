import { CreateProjectPayload } from '@rahat-ui/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TAGS } from '../../config';
import { createApiInstance } from '../../utils/api';

const baseURL = process.env['NEXT_PUBLIC_API_HOST_URL'];

const api = createApiInstance(baseURL || '');

const createProject = async (payload: CreateProjectPayload) => {
  const res = await api.post('/projects', payload);
  return res.data;
};

const useProjectCreateMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => createProject(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_ALL_PROJECTS] });
    },
  });
};

export { useProjectCreateMutation };
