import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { ChartDonut } from '@rahat-ui/shadcn/src/components/charts';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Heading, IconLabelBtn } from 'apps/rahat-ui/src/common';
import { ArrowRight, Plus } from 'lucide-react';
import TriggerDetailsCard from './trigger.details.card';
import Image from 'next/image';
import { SimpleHorizontalBar } from 'apps/rahat-ui/src/components/simple-horizontal-bar';
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
}: IProps) {
  const totalCharSeries = chartSeries.reduce((a, b) => a + b, 0);
  return (
    <div className="p-4 rounded border shadow-md flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start justify-between w-full">
            {/* Pin icon in place of status — next to title */}
            <Heading
              title={title}
              titleStyle="text-xl"
              description={subtitle}
              status={isActive ? 'Triggered' : 'Not Triggered'}
              badgeClassName={`${
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
                    alt="Unpin phase"
                    title="Unpin phase"
                    className="w-5 h-5 cursor-pointer active:scale-95 transition-transform"
                    width={25}
                    height={25}
                  />
                ) : (
                  <Image
                    src="/svg/pin-off.svg"
                    alt="Pin phase"
                    title="Pin phase"
                    className="w-5 h-5 cursor-pointer active:scale-95 transition-transform"
                    width={25}
                    height={25}
                  />
                )}
              </Button>
            )}
          </div>
        </div>
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
                  <p className="text-gray-600">No Data</p>
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
            title="Mandatory"
            color="blue"
            bgColor="bg-[#EAF2FB]"
            totalTriggers={mandatoryTriggers}
            totalTriggered={triggeredMandatoryTriggers}
            totalRequiredTriggers={requiredMandatoryTriggers}
          />
          <TriggerDetailsCard
            title="Optional"
            color="yellow"
            bgColor="bg-[#FCF6E9]"
            totalTriggers={optionalTriggers}
            totalTriggered={triggeredOptionalTriggers}
            totalRequiredTriggers={requiredOptionalTriggers}
          />
        </div>

        {chartType === 'horizontal' && (
          <div className="flex gap-2 w-full mt-4 justify-center items-center mx-auto">
            <p className="text-2xl font-medium text-blue-500">
              {mandatoryTriggers + optionalTriggers}
            </p>
            <p className="text-sm/4">Total Triggers</p>
          </div>
        )}

        {chartType === 'horizontal' && (
          <div className="flex justify-center ">
            <SimpleHorizontalBar
              values={chartSeries}
              colors={['#297AD6', '#E8C468']}
              height={15}
            />
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-1 ">
        <RoleAuth
          roles={[AARoles.ADMIN, AARoles.Municipality]}
          hasContent={false}
        >
          <IconLabelBtn
            variant="outline"
            className={`border-primary text-primary flex-1 ${
              hideAddTrigger && 'hidden'
            }`}
            Icon={Plus}
            name="Add Trigger"
            handleClick={handleAddTrigger}
            disabled={isActive}
          />
        </RoleAuth>
        <IconLabelBtn
          variant="outline"
          className={`border-primary text-primary flex-1 flex-row-reverse gap-2 ${
            hideViewDetails && 'hidden'
          }`}
          Icon={ArrowRight}
          name="View Details"
          handleClick={handleViewDetails}
        />
      </div>
    </div>
  );
}
