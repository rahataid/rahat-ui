import { Folder, ArrowDownToLine } from "lucide-react"
import Link from "next/link"

type IProps = {
    name: string;
    path: string
}

export default function DocumentCard({ name, path }: IProps) {
    return (
        <div className="p-4 rounded border flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-full bg-secondary text-primary">
                    <Folder size={20} />
                </div>
                <h1 className="text-primary font-medium">{name}</h1>
            </div>
            <Link href={path} target="_blank" className="p-1 rounded-full hover:bg-secondary">
                <ArrowDownToLine size={20} className="text-muted-foreground" />
            </Link>
        </div>
    )
}