import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { ChartDonut } from '@rahat-ui/shadcn/src/components/charts';
import { Heading, IconLabelBtn } from 'apps/rahat-ui/src/common';
import { ArrowRight, Plus } from 'lucide-react';
import TriggerDetailsCard from './trigger.details.card';

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
};

export default function TriggersPhaseCard({
  title,
  subtitle,
  hideAddTrigger = false,
  handleAddTrigger = () => {},
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
  handleViewDetails = () => {},
}: IProps) {
  const totalCharSeries = chartSeries.reduce((a, b) => a + b, 0);

  return (
    <div className="p-4 rounded border shadow-md flex flex-col justify-between">
      <div>
        <div className="flex flex-wrap justify-between items-center space-x-4">
          <Heading
            title={title}
            titleStyle="text-xl"
            description={subtitle}
            status={isActive ? 'Triggered' : 'Not Triggered'}
            badgeClassName={`${
              isActive
                ? 'text-red-500 bg-red-100'
                : 'text-green-500 bg-green-100'
            } text-xs`}
          />

          <RoleAuth
            roles={[AARoles.ADMIN, AARoles.Municipality]}
            hasContent={false}
          >
            <IconLabelBtn
              variant="outline"
              className={`border-primary text-primary ${
                hideAddTrigger && 'hidden'
              }`}
              Icon={Plus}
              name="Add Trigger"
              handleClick={handleAddTrigger}
              disabled={isActive}
            />
          </RoleAuth>
        </div>
        <div className="flex justify-center mb-2 ">
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
              showLegend={false}
              colors={['#297AD6', '#E8C468']}
              showDonutLabel={true}
            />
          )}
        </div>
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
      </div>

      <IconLabelBtn
        variant="outline"
        className={`border-primary text-primary w-full mt-8 flex-row-reverse gap-2 ${
          hideViewDetails && 'hidden'
        }`}
        Icon={ArrowRight}
        name="View Details"
        handleClick={handleViewDetails}
      />
    </div>
  );
}
