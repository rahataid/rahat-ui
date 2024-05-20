import { UUID } from "crypto"
import PhaseCard from "../../components/phase.card"

type IProps = {
    projectId: UUID
}

export default function TriggerPhaseCards({ projectId }: IProps) {
    const phaseId = 1
    return (
        <div className="flex gap-2 mb-2">
            <PhaseCard initial="R" name="Readiness Phase" path={`/projects/aa/${projectId}/phase/${phaseId}`} />
            <PhaseCard initial="A" name="Activation Phase" path={`/projects/aa/${projectId}/phase/${phaseId}`} />
        </div>
    )
}