import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { ChartDonut } from '@rahat-ui/shadcn/src/components/charts';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { IconLabelBtn } from 'apps/rahat-ui/src/common';
import { ArrowRight, Plus, Settings2 } from 'lucide-react';
import TriggerDetailsCard from './trigger.details.card';
import Image from 'next/image';
import { CardHeading } from 'apps/rahat-ui/src/common/card.heading';
import { SimpleHorizontalBar } from 'apps/rahat-ui/src/components/simple-horizontal-bar';
import TooltipWrapper from 'apps/rahat-ui/src/components/tooltip.wrapper';
import { DISBURSEMENT_COLORS, formatMethod } from '../utils';
import { useTranslations } from 'next-intl';

type IProps = {
  title: string;
  subtitle: string;
  hideAddTrigger?: boolean;
  handleAddTrigger?: () => void;
  chartSeries: number[];
  chartLabels: string[];
  requiredMandatoryTriggers: number;
  requiredOptionalTriggers: number;
  mandatoryTriggers: number;
  optionalTriggers: number;
  triggeredMandatoryTriggers: number;
  triggeredOptionalTriggers: number;
  hideViewDetails?: boolean;
  handleViewDetails?: () => void;
  isActive?: boolean;
  chartType?: 'horizontal' | 'donut';
  isPinned?: boolean;
  onTogglePin?: () => void;
  hidePin?: boolean;
  hasExtendedLogic?: boolean;
  disbursementMethods?: string[];
};

export default function TriggersPhaseCard({
  title,
  subtitle,
  hideAddTrigger = false,
  handleAddTrigger,
  chartLabels,
  chartSeries,
  mandatoryTriggers,
  optionalTriggers,
  requiredMandatoryTriggers,
  requiredOptionalTriggers,
  triggeredMandatoryTriggers,
  triggeredOptionalTriggers,
  hideViewDetails = false,
  isActive,
  handleViewDetails,
  chartType = 'horizontal',
  isPinned = false,
  onTogglePin,
  hidePin = false,
  hasExtendedLogic = false,
  disbursementMethods,
}: IProps) {
  const t = useTranslations('AA_PROJECT');
  const totalCharSeries = chartSeries.reduce((a, b) => a + b, 0);
  return (
    <div className="p-4 rounded-xl border shadow-md flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start justify-between w-full">
            {/* Pin icon in place of status — next to title */}

            <CardHeading
              title={title}
              titleStyle="text-xl"
              description={subtitle}
              status={isActive ? t('TRIGGERED') : t('NOT_TRIGGERED')}
              badgeStyle={`${
                isActive
                  ? 'text-red-500 bg-red-100'
                  : 'text-green-500 bg-green-100'
              } text-xs px-1`}
            />
            {!hidePin && (
              <Button
                variant={'secondary'}
                onClick={onTogglePin}
                className={'mt-1 p-0 bg-transparent w-6 h-6'}
              >
                {isPinned ? (
                  <Image
                    src="/svg/pin-on.svg"
                    alt={t('UNPIN_PHASE')}
                    title={t('UNPIN_PHASE')}
                    className="w-5 h-5 cursor-pointer active:scale-95 transition-transform"
                    width={25}
                    height={25}
                  />
                ) : (
                  <Image
                    src="/svg/pin-off.svg"
                    alt={t('PIN_PHASE')}
                    title={t('PIN_PHASE')}
                    className="w-5 h-5 cursor-pointer active:scale-95 transition-transform"
                    width={25}
                    height={25}
                  />
                )}
              </Button>
            )}
          </div>
        </div>
        {!!disbursementMethods?.length && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {disbursementMethods.map((method, i) => (
              <Badge
                key={method}
                className={`${
                  DISBURSEMENT_COLORS[i % DISBURSEMENT_COLORS.length]
                } text-[10px] font-medium px-2 py-0.5 rounded-sm`}
              >
                {formatMethod(method)}
              </Badge>
            ))}
          </div>
        )}
        {chartType === 'donut' && (
          <div className="flex justify-center mb-1">
            {totalCharSeries === 0 ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <svg
                  className="max-w-[200px] max-h-[200px] w-[250px] h-[250px]"
                  viewBox="0 0 120 120"
                  role="img"
                  aria-label="No data"
                >
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="transparent"
                    stroke="#E0E0E0"
                    strokeWidth="12"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-600">{t('NO_DATA')}</p>
                </div>
              </div>
            ) : (
              <ChartDonut
                series={chartSeries}
                labels={chartLabels}
                donutSize="80%"
                width={250}
                height={200}
                showLegend={chartType === 'donut'}
                colors={['#297AD6', '#E8C468']}
                showDonutLabel={true}
              />
            )}
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          <TriggerDetailsCard
            title={t('MANDATORY')}
            color="blue"
            bgColor="bg-[#EAF2FB]"
            totalTriggers={mandatoryTriggers}
            totalTriggered={triggeredMandatoryTriggers}
            totalRequiredTriggers={requiredMandatoryTriggers}
          />
          <TriggerDetailsCard
            title={t('OPTIONAL')}
            color="yellow"
            bgColor="bg-[#FCF6E9]"
            totalTriggers={optionalTriggers}
            totalTriggered={triggeredOptionalTriggers}
            totalRequiredTriggers={requiredOptionalTriggers}
          />
        </div>

        {chartType === 'horizontal' && (
          <div className="flex justify-center ">
            <SimpleHorizontalBar
              values={chartSeries}
              colors={['#297AD6', '#E8C468']}
              height={15}
            />
          </div>
        )}

        {hasExtendedLogic && (
          <div className="mt-2 flex items-center gap-1.5">
            <Badge className="bg-purple-100 text-purple-700 text-[10px] gap-1 font-normal">
              <Settings2 className="h-3 w-3" />
              Extended Logic
            </Badge>
          </div>
        )}
      </div>

      <div className="flex  gap-2 mt-1 ">
        <div className="flex-1">
          <RoleAuth
            roles={[AARoles.ADMIN, AARoles.Municipality]}
            hasContent={false}
          >
            <TooltipWrapper
              tip={
                isActive
                  ? t('CANNOT_ADD_TRIGGERS_TO_ACTIVE_PHASE')
                  : t('ADD_TRIGGER_TO_THIS_PHASE')
              }
            >
              <IconLabelBtn
                variant="outline"
                className={`border-primary text-primary  w-full ${
                  hideAddTrigger && 'hidden'
                }`}
                Icon={Plus}
                name={t('ADD_TRIGGER')}
                handleClick={handleAddTrigger}
                disabled={isActive}
              />
            </TooltipWrapper>
          </RoleAuth>
        </div>
        <div className="flex-1">
          <IconLabelBtn
            variant="outline"
            className={`border-primary text-primary flex-1 flex-row-reverse gap-2 w-full ${
              hideViewDetails && 'hidden'
            }`}
                Icon={ArrowRight}
                name={t('VIEW_DETAILS')}
                handleClick={handleViewDetails}
          />
        </div>
      </div>
    </div>
  );
}
