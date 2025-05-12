import * as React from 'react';
import { Cloud, Info } from 'lucide-react';
import FieldSubCard from './field.sub.card';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';

type IProps = {
  title: string;
  subTitle?: string;
  data: any;
  source: string;
};

export default function FieldCard({ title, subTitle, data, source }: IProps) {
  const renderColor = React.useCallback((status: string) => {
    if (status === 'Low Risk') return 'bg-green-100 text-green-500';
    if (status === 'Medium Risk') return 'bg-yellow-100 text-yellow-500';
    else return 'bg-red-100 text-red-500';
  }, []);
  return (
    <div className="bg-card p-2 rounded-sm flex-auto">
      <div className="flex gap-2 items-center mb-4">
        <div className="p-2 rounded-full bg-[#EEF4FC]">
          <Cloud size={20} />
        </div>
        <div>
          <h1 className="font-medium text-md">{title}</h1>
          {subTitle && (
            <p className="text-sm font-muted-foreground">{subTitle}</p>
          )}
        </div>
      </div>
      {source === 'DHM' && (
        <div className="grid gap-2">
          {data?.map((d: any) => (
            <FieldSubCard day={d.label} status={d.value} />
          ))}
          {title === 'Realtime Monitoring (River Watch)' && (
            <p className="text-muted-foreground flex gap-1 items-center text-sm">
              <Info size={16} /> Danger Level 10.8m
            </p>
          )}
        </div>
      )}

      {(source === 'GLOFAS' ||
        source === 'NCMRWF Deterministic & Probabilistic') && (
        <div
          className={`bg-[#f8f8f8] px-2 py-4 rounded-sm ${
            !data ? 'opacity-50' : ''
          }`}
        >
          <p>{data ?? 'N/A'}</p>
        </div>
      )}

      {source === 'NCMRWF Accumulated' &&
        (title ===
        'Heavy Rainfall Forecast in Karnali Basin (upstream areas)' ? (
          <Badge className="px-6 py-2 text-sm bg-green-100 text-green-500">
            {data ?? 'N/A'}
          </Badge>
        ) : (
          <div
            className={`bg-[#f8f8f8] px-2 py-4 rounded-sm ${
              !data ? 'opacity-50' : ''
            }`}
          >
            <p>{data ?? 'N/A'}</p>
          </div>
        ))}

      {source === 'Flash Flood Risk Monitoring' && (
        <Badge className={`px-6 py-2 text-sm ${renderColor(data)}`}>
          {data ?? 'N/A'}
        </Badge>
      )}
    </div>
  );
}
