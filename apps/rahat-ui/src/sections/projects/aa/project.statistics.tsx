import DataCard from 'apps/rahat-ui/src/components/dataCard';
import AAPhaseCard from './phase.card';
import { ChartDonut } from '@rahat-ui/shadcn/src/components/charts';

const CardData = [
    { title: "Preparedness", value: 65, color: 'yellow' },
    { title: "Readiness", value: 45, color: 'green' },
    { title: "Activation", value: 35, color: 'red' }
]

const DataCardData = [
    { title: "Beneficiaries Onboarded", subtitle: "+2 from last month", number: "5,06,734" },
    { title: "Communication Project", subtitle: "+2 from last month", number: "550" },
    { title: "Distribution Project", subtitle: "+2 from last month", number: "5,550" }
]

const BeneficiaryCardData = [
    { title: "Beneficiary Bank Status", subtitle: 'Worem ipsum dolor sit amet, consectetur adipiscing', labels: ['Type 1', 'Type 2', 'Type 3'] },
    { title: "Beneficiary Tool", subtitle: 'Worem ipsum dolor sit amet, consectetur adipiscing', labels: ['Type 1', 'Type 2', 'Type 3'] },
    { title: "Beneficiary Gender", subtitle: 'Worem ipsum dolor sit amet, consectetur adipiscing', labels: ['Male', 'Female', 'Other'] },
]

export default function ProjectStatistics() {
    return (
        <div className='grid gap-4'>
            <h1 className='font-semibold text-lg'>Project Statistics</h1>
            {/* Phase Cards  */}
            <div className='flex justify-between items-center gap-4'>
                {CardData?.map(d => <AAPhaseCard key={d.title} title={d.title} value={d.value} color={d.color} />)}
            </div>
            {/* Data Cards  */}
            <div className='flex justify-between items-center gap-4'>
                {DataCardData?.map(d => <DataCard key={d.title} className='w-full' title={d.title} subTitle={d.subtitle} number={d.number} />
                )}
            </div>
            {/* Project Beneficiary Cards  */}
            <div className='flex justify-between items-center gap-4'>
                {BeneficiaryCardData?.map(d => (
                    <div key={d.title} className='shadow p-5 rounded w-full'>
                        <h1 className='font-semibold mb-1'>{d.title}</h1>
                        <p className='text-muted-foreground text-sm mb-3'>{d.subtitle}</p>
                        <div className='flex justify-center'>
                            <ChartDonut labels={d.labels} series={[934, 561, 727]} donutSize='80%' />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}