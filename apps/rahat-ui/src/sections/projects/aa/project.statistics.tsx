import DataCard from 'apps/rahat-ui/src/components/dataCard';
import AAPhaseCard from './phase.card';
import { ChartDonut } from '@rahat-ui/shadcn/src/components/charts';

const DataCardData = [
  {
    title: 'Beneficiaries Onboarded',
    subtitle: '+2 from last month',
    number: '5,06,734',
  },
  {
    title: 'Communication Project',
    subtitle: '+2 from last month',
    number: '550',
  },
  {
    title: 'Distribution Project',
    subtitle: '+2 from last month',
    number: '5,550',
  },
];

const BeneficiaryCardData = [
  {
    title: 'Beneficiary Bank Status',
    subtitle: 'Worem ipsum dolor sit amet, consectetur adipiscing',
    labels: ['Type 1', 'Type 2', 'Type 3'],
  },
  {
    title: 'Beneficiary Tool',
    subtitle: 'Worem ipsum dolor sit amet, consectetur adipiscing',
    labels: ['Type 1', 'Type 2', 'Type 3'],
  },
  {
    title: 'Beneficiary Gender',
    subtitle: 'Worem ipsum dolor sit amet, consectetur adipiscing',
    labels: ['Male', 'Female', 'Other'],
  },
];

type IProps = {
  phasesStats: Array<{
    totalActivities: Number;
    totalCompletedActivities: Number;
    completedPercentage: Number;
    phase: any;
  }>;
};

export default function ProjectStatistics({ phasesStats }: IProps) {
  console.log(phasesStats);

  return (
    <div className="grid gap-4">
      <h1 className="font-semibold text-lg">Project Statistics</h1>
      {/* Phase Cards  */}
      <div className="flex justify-between items-center gap-4">
        {phasesStats?.map((d) => (
          <AAPhaseCard
            key={d.phase?.uuid}
            title={d.phase?.name}
            value={Number(d.completedPercentage)}
            color={'red'}
            isActive={d.phase?.isActive}
          />
        ))}
      </div>
      {/* Data Cards  */}
      <div className="flex justify-between items-center gap-4">
        {DataCardData?.map((d) => (
          <DataCard
            key={d.title}
            className="w-full"
            title={d.title}
            subTitle={d.subtitle}
            number={d.number}
          />
        ))}
      </div>
      {/* Project Beneficiary Cards  */}
      <div className="flex justify-between items-center gap-4">
        {BeneficiaryCardData?.map((d) => (
          <div key={d.title} className="shadow p-5 rounded w-full">
            <h1 className="font-semibold mb-1">{d.title}</h1>
            <p className="text-muted-foreground text-sm mb-3">{d.subtitle}</p>
            <div className="flex justify-center">
              <ChartDonut
                labels={d.labels}
                series={[934, 561, 727]}
                donutSize="80%"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
