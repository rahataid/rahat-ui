import { ClusterMap, StyledMapContainer, THEMES } from '@rahat-ui/shadcn/maps';
import { mapboxBasicConfig } from '../../../../../constants/config';
import { LineChart } from '@rahat-ui/shadcn/src/components/charts';

export default function DHMContent() {
    const seriesData = [
        {
            name: 'Series 1',
            data: [30, 20, 60, 40, 55, 60, 10, 0, 90],
        },
        {
            name: 'Series 2',
            data: [90, 25, 35, 45, 55, 25, 75, 85, 15],
        },
    ];
    return (
        <div className='grid grid-cols-4 gap-2'>
            <div className='h-[calc(100vh-130px)] col-span-3 flex flex-col gap-2'>
                <div className='h-1/2 overflow-hidden rounded-md'>
                    <StyledMapContainer>
                        <ClusterMap {...mapboxBasicConfig} mapStyle={THEMES.light} />
                    </StyledMapContainer>
                </div>
                <div className='h-1/2 bg-card rounded-md'>
                    <LineChart series={seriesData} />
                </div>
            </div>
            <div className='grid grid-rows-3 gap-2 h-full'>
                <div className='bg-card p-4 rounded'>
                    <h1 className='font-semibold text-lg'>Real Time Status</h1>
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
                    <h1 className='font-semibold text-lg'>Threshold Level: N/A</h1>
                    <h1 className='font-semibold text-lg'>Trigger Statement: N/A</h1>
                    <h1 className='font-semibold text-lg'>Phase: Readiness</h1>
                </div>
            </div>

        </div>

    )
}