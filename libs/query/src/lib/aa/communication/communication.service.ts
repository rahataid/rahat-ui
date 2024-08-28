import { useQuery } from "@tanstack/react-query";
import { useProjectAction } from "../../projects";
import { UUID } from "crypto";

export const useGetCommunicationLogs = (uuid: UUID, communicationId: string, activityId: string) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['communicationlogs', uuid, communicationId],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'aa.activities.communication.sessionLogs',
          payload: {
            communicationId,
            activityId
          },
        },
      });
      return mutate.data;
    },
  });

  return query;
};