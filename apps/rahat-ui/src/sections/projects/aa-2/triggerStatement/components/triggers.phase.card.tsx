import { ChartDonut } from '@rahat-ui/shadcn/src/components/charts';
import { Progress } from '@rahat-ui/shadcn/src/components/ui/progress';
import { Heading, IconLabelBtn } from 'apps/rahat-ui/src/common';
import { ArrowRight, Plus } from 'lucide-react';

type IProps = {
  title: string;
  subtitle: string;
  hideAddTrigger?: boolean;
  handleAddTrigger?: () => void;
  chartSeries: number[];
  chartLabels: string[];
  mandatoryTriggers: number;
  optionalTriggers: number;
  triggeredMandatoryTriggers: number;
  triggeredOptionalTriggers: number;
  hideViewDetails?: boolean;
  handleViewDetails?: () => void;
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
  triggeredMandatoryTriggers,
  triggeredOptionalTriggers,
  hideViewDetails = false,
  handleViewDetails = () => {},
}: IProps) {
  return (
    <div className="p-4 rounded-md border shadow-md flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center space-x-4">
          <Heading title={title} titleStyle="text-xl" description={subtitle} />
          <IconLabelBtn
            variant="outline"
            className={`border-primary text-primary ${
              hideAddTrigger && 'hidden'
            }`}
            Icon={Plus}
            name="Add Trigger"
            handleClick={handleAddTrigger}
          />
        </div>
        <div className="flex justify-center mb-2">
          <ChartDonut
            series={chartSeries}
            labels={chartLabels}
            donutSize="80%"
            width={250}
            height={200}
            showLegend={false}
            colors={['#E8C468', '#297AD6']}
            showDonutLabel={true}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#EAF2FB] rounded-md p-4">
            <p className="text-sm/4">Mandatory</p>
            <p className="font-semibold text-2xl/10">{mandatoryTriggers}</p>
            <div>
              <p className="text-muted-foreground text-sm/4 mb-1">{`${triggeredMandatoryTriggers} triggered`}</p>
              <Progress
                value={Math.floor(
                  (triggeredMandatoryTriggers / mandatoryTriggers) * 100,
                )}
                className="h-2"
                indicatorColor={'bg-[#297AD6]'}
              />
            </div>
          </div>
          <div className="bg-[#FCF6E9] rounded-md p-4">
            <p className="text-sm/4">Optional</p>
            <p className="font-semibold text-2xl/10">{optionalTriggers}</p>
            <div>
              <p className="text-muted-foreground text-sm/4 mb-1">{`${triggeredOptionalTriggers} triggered`}</p>
              <Progress
                value={Math.floor(
                  (triggeredOptionalTriggers / optionalTriggers) * 100,
                )}
                className="h-2"
                indicatorColor={'bg-[#E8C468]'}
              />
            </div>
          </div>
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
