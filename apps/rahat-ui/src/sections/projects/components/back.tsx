import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type IProps = {
    path: string;
}

export default function Back({ path }: IProps) {
    return (
        <Link href={path}>
            <ArrowLeft
                size={25}
                strokeWidth={1.5}
                className="cursor-pointer opacity-70 hover:opacity-100"
            />
        </Link>
    )
}