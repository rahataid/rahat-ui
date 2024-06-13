import { BarChart, ChartDonut } from '@rahat-ui/shadcn/src/components/charts';
import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';
import PieChartCard from '../../components/pie.chart.card';

const pieChartData = [
  {
    title: 'Cash Transfer Method',
    series: [
      { label: 'Mobile Wallet', value: 1384 },
      { label: 'Bank', value: 555 },
    ],
    colors: ['#4CAF50', '#E0CA52'],
  },
  {
    title: 'Household Phone Availability',
    series: [
      { label: 'Phoned', value: 2384 },
      { label: 'UnPhoned', value: 1955 },
    ],
    colors: ['#5258E0', '#E0CA52'],
  },
  {
    title: 'Household Phone Status',
    series: [
      { label: 'Banked', value: 197 },
      { label: 'UnBanked', value: 55 },
    ],
    colors: ['#4CAF50', '#E0CA52'],
  },
  {
    title: 'Type of Phone',
    series: [
      { label: 'Smart', value: 84 },
      { label: 'Simple', value: 555 },
    ],
    colors: ['#5258E0', '#4CAF50'],
  },
];

export default function ChartsContainer() {
  return (
    <>
      <div className="flex gap-4">
        <div className="rounded-sm bg-card p-4">
          <h1 className="text-md font-medium mb-4">
            Cash Supported Households by Gender
          </h1>
          <ChartDonut
            labels={['Male', 'Female', 'Other']}
            series={[934, 561, 727]}
            donutSize="70%"
            width={360}
            height={290}
          />
        </div>
        <div className="rounded-sm bg-card flex-auto">
          <div className="p-4">
            <h1 className="text-md font-medium mb-1">Vulnerability Status</h1>
            <p className="text-primary font-semibold text-2xl">1,500</p>
          </div>
          <Separator />
          <div className="px-4">
            <BarChart
              series={[400, 430, 448, 300, 200, 250]}
              categories={[
                'Pregnant',
                'Lactation',
                'Widow',
                'Senior Citizen',
                'Person with disability',
                'Dalit child below 5',
              ]}
              horizontal={true}
              colors={['#eab308']}
              xaxisLabels={false}
              barHeight={30}
              height={280}
            />
          </div>
        </div>
        <div className="rounded-sm bg-card flex-auto">
          <div className="p-4">
            <h1 className="text-md font-medium mb-1">
              Beneficiary Associated Bank
            </h1>
            <p className="text-primary font-semibold text-2xl">1,500</p>
          </div>
          <Separator />
          <div className="px-4">
            <BarChart
              series={[63, 51, 15, 20, 36, 30, 48, 6, 11]}
              categories={[
                'Agriculture development Bank Ltd',
                'Bank of Kathmandu Ltd',
                'Everest bank Ltd',
                'Global IME bank Ltd',
                'Jyoti bikas bank Ltd',
                'Kanchan development bank',
                'Kathmadnu Bank ltd',
                'Kishan bahuudeshiya sahakari sastha limited',
                'Kumari bank ltd',
              ]}
              horizontal={true}
              colors={['#2563eb']}
              xaxisLabels={false}
              barHeight={15}
              width={450}
              height={280}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {pieChartData.map((chart, index) => (
          <PieChartCard
            key={index}
            title={chart.title}
            series={chart.series}
            colors={chart.colors}
          />
        ))}
      </div>
    </>
  );
}
