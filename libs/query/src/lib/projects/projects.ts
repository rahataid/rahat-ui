import { useMutation, useQueryClient } from '@tanstack/react-query';

import api from '@/libs/utils/api';
import { TAGS } from '@/libs/state/const/const';
import { CreateProjectPayload } from '@/libs/types/project.type';

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
