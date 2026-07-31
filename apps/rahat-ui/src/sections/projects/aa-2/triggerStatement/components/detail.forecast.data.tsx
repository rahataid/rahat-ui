import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Heading } from 'apps/rahat-ui/src/common';
import { TriangleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SOURCE_CONFIG } from '../trigger.statement.schema';
import { toLabel, TriggerStatement } from '../utils';

type IProps = {
  source: string;
  phase: string;
  triggerStatement: TriggerStatement;
};

export function ForecastDataSection({
  source,
  phase,
  triggerStatement,
}: IProps) {
  const t = useTranslations('AA_PROJECT');
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
  const formattedSourceSubType = toLabel(sourceSubType);

  const getDHMLabel = (
    triggerSourceValue: string,
    triggerSourceSubTypeValue: string,
  ) => {
    switch (triggerSourceValue) {
      case 'prob_humidity':
        return t('HUMIDITY_LEVEL');
      case 'temperature_c':
        return t('TEMPERATURE_LEVEL');
      case 'rainfall_mm':
        return t('RAINFALL_LEVEL');
      default:
        switch (triggerSourceSubTypeValue) {
          case 'warning_level':
            return t('WARNING_LEVEL');
          case 'danger_level':
            return t('DANGER_LEVEL');
          default:
            return t('WATER_LEVEL');
        }
    }
  };

  const setIconLabel = (source: string, triggerSourceSubType: string) => {
    switch (source) {
      case 'DHM':
        return getDHMLabel(triggerSource, triggerSourceSubType);

      case 'GFH':
        return triggerSourceSubType === 'warning_discharge'
          ? t('WARNING_DISCHARGE')
          : t('DANGER_DISCHARGE');

      case 'GLOFAS':
        return t('FLOOD_PROBABILITY');

      default:
        return '';
    }
  };

  return (
    <div className="p-4 border rounded-sm shadow">
      <Heading
        title={t('FORECAST_DATA')}
        titleStyle="text-lg/7"
        description={t('SOURCE_WITH_SUBTYPE', { source, subType: sourceSubTypeLabel })}
      />
      {Object.keys(triggerStatement).length ? (
        <div className="p-3 text-center border rounded">
          <p className="font-semibold text-3xl/10 text-primary">
            {value} {unit || '%'}
          </p>
          <p className="font-medium text-sm/6 flex justify-center items-center gap-2">
            <TriangleAlert size={16} strokeWidth={2.5} color="red" />
            {setIconLabel(source, sourceSubType)}
          </p>
          <Badge className="font-normal">
            ({formattedSourceSubType} {operator} {value} {unit || '%'})
          </Badge>
        </div>
      ) : null}
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
