import { UUID } from "crypto";
import { useProjectAction } from "../../projects";
import { useQuery } from "@tanstack/react-query";

export const useSinglePhase = (
    uuid: UUID,
    phaseId: UUID
) => {
    const q = useProjectAction();
    const query = useQuery({
        queryKey: ['phase', uuid, phaseId],
        queryFn: async () => {
            const mutate = await q.mutateAsync({
                uuid,
                data: {
                    action: 'aaProject.phases.getOne',
                    payload: {
                        uuid: phaseId,
                    },
                },
            });
            return mutate.data;
        },
    });
    return query;
};