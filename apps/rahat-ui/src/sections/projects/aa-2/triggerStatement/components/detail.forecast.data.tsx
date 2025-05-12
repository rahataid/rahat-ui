import { Heading } from 'apps/rahat-ui/src/common';
import { TriangleAlert } from 'lucide-react';

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
  return (
    <div className="p-4 border rounded-sm shadow">
      <Heading
        title="Forecast Data"
        titleStyle="text-lg/7"
        description={`Source: ${source}`}
      />
      {source === 'GLOFAS' && (
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
    </div>
  );
}
