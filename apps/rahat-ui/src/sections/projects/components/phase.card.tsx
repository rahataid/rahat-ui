import Link from "next/link"
import { Settings } from "lucide-react"

type IProps = {
    path: string
    initial: string
    name: string
}

export default function PhaseCard({ path, initial, name }: IProps) {
    return (
        <Link href={path}>
            <div className="relative w-48 bg-card rounded p-4 grid gap-3 place-items-center">
                <Settings size={20} className="absolute top-4 right-4 text-muted-foreground" />
                <div className="w-20 h-20 rounded-full bg-secondary grid place-items-center">
                    <p className="font-semibold text-4xl text-muted-foreground">{initial}</p>
                </div>
                <p className="font-medium">{name}</p>
            </div>
        </Link>
    )
}