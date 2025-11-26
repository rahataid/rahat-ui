import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Heading } from 'apps/rahat-ui/src/common';
import { TriangleAlert } from 'lucide-react';
import { SOURCE_CONFIG } from '../trigger.statement.schema';
import { capitalizeFirstLetter } from 'apps/rahat-ui/src/utils';

type IProps = {
  source: string;
  phase: string;
  triggerStatement: any;
};

export function ForecastDataSection({
  source,
  phase,
  triggerStatement,
}: IProps) {
  const {
    value,
    source: triggerSource,
    operator,
    expression,
    sourceSubType,
  } = triggerStatement;
  const sourceSubTypeLabel =
    SOURCE_CONFIG[triggerSource as keyof typeof SOURCE_CONFIG]?.sourceSubType;
  const unit = sourceSubTypeLabel?.match(/\((.*?)\)/)?.[1] || '';
  const formattedSourceSubType = sourceSubType?.replace('_', ' ');

  return (
    <div className="p-4 border rounded-sm shadow">
      <Heading
        title="Forecast Data"
        titleStyle="text-lg/7"
        description={`Source: ${source} - ${sourceSubTypeLabel}`}
      />
      <div className="p-3 text-center border rounded">
        <p className="font-semibold text-3xl/10 text-primary">
          {value} {unit}
        </p>
        <p className="font-medium text-sm/6 flex justify-center items-center gap-2">
          <TriangleAlert size={16} strokeWidth={2.5} color="red" />
          {capitalizeFirstLetter(formattedSourceSubType || '')}
        </p>
        <Badge className="font-normal">
          {formattedSourceSubType} {operator} {value} {unit}
        </Badge>
      </div>
      {/* {source === 'GLOFAS' && (
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 text-center border rounded">
            <p className="font-semibold text-3xl/10 text-primary">
              {triggerStatement?.minLeadTimeDays}
            </p>
            <p className="font-medium text-sm/6">Minimum Lead Time Days</p>
          </div>
          <div className="p-3 text-center border rounded">
            <p className="font-semibold text-3xl/10 text-primary">
              {triggerStatement?.maxLeadTimeDays}
            </p>
            <p className="font-medium text-sm/6">Maximum Lead Time Days</p>
          </div>
          <div className="p-3 text-center border rounded">
            <p className="font-semibold text-3xl/10 text-primary">
              {triggerStatement?.probability}
            </p>
            <p className="font-medium text-sm/6">Forecast Probability</p>
          </div>
        </div>
      )}

      {source === 'DHM' && phase === 'ACTIVATION' && (
        <div className="p-3 text-center border rounded">
          <p className="font-semibold text-3xl/10 text-primary">
            {triggerStatement?.dangerLevel || 'N/A'}
          </p>
          <p className="font-medium text-sm/6 flex justify-center items-center gap-2">
            <TriangleAlert size={16} strokeWidth={2.5} color="red" />
            Danger Level
          </p>
        </div>
      )}

      {source === 'DHM' && phase === 'READINESS' && (
        <div className="p-3 text-center border rounded">
          <p className="font-semibold text-3xl/10 text-primary">
            {triggerStatement?.warningLevel || 'N/A'}
          </p>
          <p className="font-medium text-sm/6 flex justify-center items-center gap-2">
            <TriangleAlert size={16} strokeWidth={2.5} color="orange" />
            Warning Level
          </p>
        </div>
      )}

      {source === 'DAILY_MONITORING' && (
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 text-center border rounded">
            <p className="font-semibold text-3xl/10 text-primary">
              {triggerStatement?.forecast}
            </p>
            <p className="font-medium text-sm/6">Forecast</p>
          </div>
          <div className="p-3 text-center border rounded">
            <p className="font-semibold text-3xl/10 text-primary">
              {triggerStatement?.daysToConsiderPrior}
            </p>
            <p className="font-medium text-sm/6">
              No. of days to consider prior
            </p>
          </div>
          <div className="p-3 text-center border rounded">
            <p className="font-semibold text-3xl/10 text-primary">
              {triggerStatement?.forecastStatus}
            </p>
            <p className="font-medium text-sm/6">Forecast Status</p>
          </div>
        </div>
      )} */}
    </div>
  );
}
