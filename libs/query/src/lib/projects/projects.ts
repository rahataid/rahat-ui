import { CreateProjectPayload } from '@rahat-ui/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TAGS } from '../../config';
import api from '../../utils/api';

const createProject = async (payload: CreateProjectPayload) => {
  const res = await api.post('/projects', payload);
  return res.data;
};

const projectCreateMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => createProject(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_ALL_PROJECTS] });
    },
  });
};

export { projectCreateMutation };
