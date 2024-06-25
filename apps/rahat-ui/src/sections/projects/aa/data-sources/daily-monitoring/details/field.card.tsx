import { Cloud } from 'lucide-react';
import FieldSubCard from './field.sub.card';

type IProps = {
  title: string;
  data: Array<any>;
};

export default function FieldCard({ title, data }: IProps) {
  return (
    <div className="bg-card p-2 rounded-sm flex-auto">
      <div className="flex gap-2 items-center mb-4">
        <div className="p-2 rounded-full bg-[#EEF4FC]">
          <Cloud size={20} />
        </div>
        <h1 className="font-medium text-md">{title}</h1>
      </div>
      <div className="grid gap-2">
        {data?.map((d) => (
          <FieldSubCard day={d.label} status={d.value} />
        ))}
      </div>
    </div>
  );
}
