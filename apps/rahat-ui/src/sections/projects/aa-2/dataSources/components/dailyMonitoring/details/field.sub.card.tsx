import { BarChart2 } from 'lucide-react';
import { useCallback } from 'react';

type IProps = {
  day: string;
  status: string;
};

export default function FieldSubCard({ day, status }: IProps) {
  const renderIconColor = useCallback(
    (status: string) => {
      if (status === 'Steady' || status === 'Decrease') return 'green';
      if (status === 'Increase') return 'red';
      if (status === 'Minor Fluctuations' || status === 'Minor Increase')
        return 'yellow';
      return 'black';
    },
    [status],
  );
  return (
    <div
      className={`bg-[#f8f8f8] px-2 py-4 flex gap-3 rounded-sm ${
        !status ? 'opacity-50' : ''
      }`}
    >
      <BarChart2 size={20} className={`text-${renderIconColor(status)}-500`} />
      <div>
        <h1 className="text-muted-foreground text-sm">{day || 'N/A'}</h1>
        <p className="w-[200px]">{status || 'N/A'}</p>
      </div>
    </div>
  );
}
