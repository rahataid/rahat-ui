import { UUID } from "crypto"
import PhaseCard from "../../components/phase.card"
import { useActivitiesPhase, useActivitiesStore } from "@rahat-ui/query"

type IProps = {
    projectId: UUID
}

export default function TriggerPhaseCards({ projectId }: IProps) {
    useActivitiesPhase(projectId);
    const phases = useActivitiesStore((state) => state.phases)
    return (
        <div className="flex gap-2 mb-2">
            {phases.filter(p => p.name !== "PREPAREDNESS").map(d => (
                <PhaseCard name={d.name} path={`/projects/aa/${projectId}/phase/${d.uuid}`} />
            ))}
        </div>
    )
}