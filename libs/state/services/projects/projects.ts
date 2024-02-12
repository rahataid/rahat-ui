import { useMutation, useQueryClient } from '@tanstack/react-query';

import api from '../../../utils/api';
import { TAGS } from '../../const/const';
import { CreateProjectPayload } from '../../../types/project.type';

const createProject = async (payload: CreateProjectPayload) => {
  const res = await api.post('/projects', payload);
  return res.data;
};

const projectCreateMutation = (payload: CreateProjectPayload) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => createProject(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TAGS.GET_ALL_PROJECTS] });
    },
  });
};

export { projectCreateMutation };
