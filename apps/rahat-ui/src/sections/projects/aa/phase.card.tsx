import { Progress } from "@rahat-ui/shadcn/src/components/ui/progress";

type IProps = {
  title: string,
  value: number,
  color: string
}

export default function PhaseCard({ title, value, color }: IProps) {
  return (
    <div className='bg-secondary p-5 rounded w-full shadow'>
      <h1 className="font-semibold mb-0.5">{title}</h1>
      <p className="mb-3">{value}% of {title.toLocaleLowerCase()} completed</p>
      <Progress value={value} className={`bg-${color}-100 h-2`} indicatorColor={`bg-${color}-500`} />
    </div>
  );
}
