import { useRouter } from "next/navigation"
import { Button } from "@rahat-ui/shadcn/src/components/ui/button"
import { Plus } from "lucide-react"

type IProps = {
    path: string,
    name: string
}

export default function AddButton({ path, name }: IProps) {
    const router = useRouter();
    return <Button type='button' onClick={() => router.push(path)}><Plus size={18} className='mr-1' /> Add {name}</Button>
}