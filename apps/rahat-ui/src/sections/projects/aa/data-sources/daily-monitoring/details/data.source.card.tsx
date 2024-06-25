import { Calendar } from 'lucide-react';
import { ReactNode } from 'react';

type IProps = {
  source: string;
  component: ReactNode;
};

export default function DataSourceCard({ source, component }: IProps) {
  return (
    <div className="p-4 bg-secondary rounded-sm">
      <div className="mb-2 flex justify-between items-center">
        <h1 className="text-primary font-semibold">Data Source : {source}</h1>
        <div className="flex gap-2 items-center">
          <div>
            <h1 className="text-muted-foreground text-xs text-right">-</h1>
            <p className="text-sm">-</p>
          </div>
          <div className="p-2 rounded-full bg-primary text-white">
            <Calendar size={20} />
          </div>
        </div>
      </div>
      {component}
    </div>
  );
}
