import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Progress } from '@rahat-ui/shadcn/src/components/ui/progress';

type IProps = {
  title: string;
  value: number;
  color: string;
  isActive: boolean;
};

export default function PhaseCard({ title, value, color, isActive }: IProps) {
  return (
    <div className="bg-card p-5 rounded w-full shadow">
      <h1 className="font-semibold mb-0.5">{title}</h1>
      <Badge
        className={`my-1 px-2 py-1 rounded-md ${
          isActive ? 'bg-red-300' : 'bg-green-200'
        }`}
      >
        {isActive ? 'active' : 'not active'}
      </Badge>
      <p className="mb-3">
        {value}% of {title.toLocaleLowerCase()} activities completed
      </p>
      <Progress
        value={value}
        className={`bg-${color}-100 h-2`}
        indicatorColor={`bg-${color}-500`}
      />
    </div>
  );
}
