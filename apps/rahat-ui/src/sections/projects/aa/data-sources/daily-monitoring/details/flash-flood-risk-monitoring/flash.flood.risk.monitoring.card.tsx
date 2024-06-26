import * as React from 'react';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import DataSourceCard from '../data.source.card';
import FieldCard from '../field.card';

type IProps = {
  data: any;
};

export default function FlashFloodRiskMonitoringCard({ data }: IProps) {
  const sanitizedData = React.useMemo(() => {
    return data?.map((d: any) => [{ label: 'Status', value: d.status }]);
  }, [data]);

  const renderFieldCardContainer = React.useCallback(() => {
    return (
      <div className="grid grid-cols-4">
        {sanitizedData?.map((item: any) =>
          item?.map((d: any) => (
            <FieldCard
              key={d.label}
              title={d.label}
              source="Flash Flood Risk Monitoring"
              data={d.value}
            />
          )),
        )}
      </div>
    );
  }, [sanitizedData]);

  return (
    <ScrollArea className="h-[calc(100vh-352px)] pr-4" type="always">
      <DataSourceCard
        source="Flash Flood Risk Monitoring"
        component={renderFieldCardContainer()}
      />
    </ScrollArea>
  );
}
