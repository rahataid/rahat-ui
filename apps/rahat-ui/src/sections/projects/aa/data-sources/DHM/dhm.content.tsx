import { StyledMapContainer, THEMES } from '@rahat-ui/shadcn/maps';
import { mapboxBasicConfig } from '../../../../../constants/config';
import { LineChart } from '@rahat-ui/shadcn/src/components/charts';
import DHMMap from './map';

const renderStatus = ({ warningLevel, dangerLevel, waterLevel }: any) => {
    let status;
    if (waterLevel >= dangerLevel) {
        status = "danger";
    } else if (waterLevel >= warningLevel) {
        status = "warning";
    } else {
        status = "safe";
    }

    return (
        <div>
            <p className={`mt-4 sm:mt-8 sm:w-2/3 ${status === "danger" ? "text-red-500" : status === "warning" ? "text-yellow-500" : "text-green-500"}`}>
                {status === "danger" ? "Water is in danger level!" : status === "warning" ? "Water is in warning level!" : "Water is in a safe level."}
            </p>
        </div>
    );
};

export default function DHMContent({ data }: any) {

    if(!data.length){
        return <p>Data not found for DHM.</p>
    }
    
    const latestData = data[0]
    const recentEight = data.slice(0, 8)

    const xAxisLabel = recentEight.map((d: any) => {
        const date = new Date(d.data.waterLevelOn)
        return date.toLocaleTimeString()
    })

    const dangerLevel = latestData.dataSource.triggerStatement.dangerLevel;
    const warningLevel = latestData.dataSource.triggerStatement.warningLevel;

    const chartOptions: ApexCharts.ApexOptions = {
        xaxis: {
            categories: xAxisLabel.reverse(),
            title: {
                text: 'Time'
            }
        },
        yaxis: {
            title: {
                text: 'Water Level'
            },
            max: 12
        },
        annotations: {
            yaxis: [
                {
                    y: dangerLevel,
                    borderColor: '#D2042D',
                    borderWidth: 2,
                    label: {
                        style: {
                            color: '#D2042D',
                        },
                        text: 'Danger Level'
                    }
                },
                {
                    y: warningLevel,
                    borderColor: '#FFC300',
                    borderWidth: 2,
                    label: {
                        style: {
                            color: '#FFC300',
                        },
                        text: 'Warning Level'
                    }
                }
            ]
        },
        tooltip: {
            x: {
                show: false,
            },
            marker: { show: false },
        },
        dataLabels: {
            enabled: true,
        },
    }


    const waterLevelData = recentEight.map((d: any) => {
        return d.data.waterLevel
    })
    
    const seriesData = [
        {
            name: 'Water Level',
            data: waterLevelData.reverse(),
        }
    ];

    console.log()

    return (
        <div className='grid grid-cols-4 gap-2'>
            <div className='h-[calc(100vh-130px)] col-span-3 flex flex-col gap-2'>
                <div className='h-1/2 overflow-hidden rounded-md'>
                    <StyledMapContainer>
                        <DHMMap {...mapboxBasicConfig} mapStyle={THEMES.light} />
                    </StyledMapContainer>
                </div>
                <div className='h-1/2 bg-card rounded-md'>
                    <LineChart series={seriesData} lineChartOptions={chartOptions} />
                </div>
            </div>
            <div className='grid grid-rows-3 gap-2 h-full'>
                <div className='bg-card p-4 rounded'>
                    <h1 className='font-semibold text-lg'>Real Time Status</h1>
                    <p>Station: {latestData.data.title}</p>
                    <p>Basin: {latestData.data.basin}</p>
                    {/* <p>Status: {latestData.data.status}</p>
                    <p>Warning Level: N/A</p>
                     */}
                    <p>Water Level: {latestData.data.waterLevel}</p>
                    <p>Water Level On: {(new Date(latestData.data.waterLevelOn)).toLocaleString()}</p>
                    <p>Longitude: {latestData.data.point.coordinates[0]}</p>
                    <p>Latitude: {latestData.data.point.coordinates[1]}</p>
                    <p>Description: {latestData.data.description}</p>
                </div>
                <div className='bg-card p-4 rounded'>
                    <h1 className='font-semibold text-lg'>Bulletin Today</h1>
                    <p>Station: N/A</p>
                    <p>Basin: N/A</p>
                    <p>Status: N/A</p>
                    <p>Warning Level: N/A</p>
                    <p>Flow: N/A</p>
                    <p>Longitude: N/A</p>
                    <p>Latitude: N/A</p>
                    <p>Description: N/A</p>
                </div>
                <div className='bg-card p-4 rounded'>
                    <h1 className='font-semibold text-lg'>Water Level: {latestData.data.waterLevel}</h1>
                    <h1 className='font-semibold text-lg'>
                        <div>Danger Level: {latestData.dataSource.triggerStatement.dangerLevel}</div>
                        <div>Warning Level: {latestData.dataSource.triggerStatement.warningLevel}</div>
                    </h1>
                    {renderStatus({
                        warningLevel: warningLevel,
                        dangerLevel: dangerLevel,
                        waterLevel: latestData.data.waterLevel
                    })}
                    {/* <h1 className='font-semibold text-lg'>Phase: Readiness</h1> */}
                </div>
            </div>

        </div>

    )
}