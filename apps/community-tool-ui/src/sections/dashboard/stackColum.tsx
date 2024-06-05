import { Separator } from '@radix-ui/react-separator';
import { ChartColumnStacked } from '@rahat-ui/shadcn/charts';

type IProps = {
  data: any;
  stacked?: boolean;
  title?: string;
  width?: number | string;
  height?: number | string;
};

const StackColumn = ({ data, stacked, width, height, title }: IProps) => {
  const fiveTo18Male = data?.data
    ?.filter((f) => f.name === 'TOTAL_BY_AGEGROUP')?.[0]
    ?.data?.find((f) => f.id === '5_18__male');
  const fiveTo18Female = data?.data
    ?.filter((f) => f.name === 'TOTAL_BY_AGEGROUP')?.[0]
    ?.data?.find((f) => f.id === '5_18__female');

  const maleBelowAge5years = data?.data
    ?.filter((f) => f.name === 'TOTAL_BY_AGEGROUP')?.[0]
    ?.data?.find((f) => f.id === 'male_below_the_age_of_5_years');
  const femaleBelowAge5years = data?.data
    ?.filter((f) => f.name === 'TOTAL_BY_AGEGROUP')?.[0]
    ?.data?.find((f) => f.id === 'female_below_the_age_of_5_years');

  const male19to49years = data?.data
    ?.filter((f) => f.name === 'TOTAL_BY_AGEGROUP')?.[0]
    ?.data?.find((f) => f.id === '1949_male');
  const female19to49years = data?.data
    ?.filter((f) => f.name === 'TOTAL_BY_AGEGROUP')?.[0]
    ?.data?.find((f) => f.id === '1949_female');

  const male50to65years = data?.data
    ?.filter((f) => f.name === 'TOTAL_BY_AGEGROUP')?.[0]
    ?.data?.find((f) => f.id === '5065_male');
  const female50to65years = data?.data
    ?.filter((f) => f.name === 'TOTAL_BY_AGEGROUP')?.[0]
    ?.data?.find((f) => f.id === '5065_female');

  const maleAbove65years = data?.data
    ?.filter((f) => f.name === 'TOTAL_BY_AGEGROUP')?.[0]
    ?.data?.find((f) => f.id === '65_above_male');
  const femaleAbove65years = data?.data
    ?.filter((f) => f.name === 'TOTAL_BY_AGEGROUP')?.[0]
    ?.data?.find((f) => f.id === '65_above_female');

  const ageGroups = [
    {
      name: 'male',
      data: [
        maleBelowAge5years?.count || 0,
        fiveTo18Male?.count || 0,
        male19to49years?.count || 0,
        male50to65years?.count || 0,
        maleAbove65years?.count || 0,
      ],
    },
    {
      name: 'female',
      data: [
        femaleBelowAge5years?.count || 0,
        fiveTo18Female?.count || 0,
        female19to49years?.count || 0,
        female50to65years?.count || 0,
        femaleAbove65years?.count || 0,
      ],
    },
  ];
  const categories = ['<5', '5-18', '19-49', '50-65', '>65'];

  return (
    <div className="bg-card rounded shadow w-full mt-2 ">
      <p className="mt-6 mb-2 ml-4">{title}</p>
      <ChartColumnStacked
        series={ageGroups}
        stacked={stacked}
        height={height}
        width={width}
        categories={categories}
      />
    </div>
  );
};

export default StackColumn;
