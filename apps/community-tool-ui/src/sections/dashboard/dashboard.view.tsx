'use client';

import { useAppStatsList, useListPalikas } from '@rahat-ui/community-query';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { DownloadCloud, LucideShipWheel } from 'lucide-react';
import HouseHoldHeadInsights from './houseHoldHeadInsights';
import HouseHoldInsights from './houseHoldInsights';
import PopulationInsights from './populatioInsights';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { FilterStatsDto } from '@rahataid/community-tool-sdk/app';
import React from 'react';
import SearchDropdownComponent from '../../components/searchDropdownComponent';
import { sanitizeAndExportReport } from '../../utils';
import WARDNUMBER from '../../utils/wardData.json';

export default function DashboardView() {
  const [filters, setFilters] = React.useState<FilterStatsDto>({});
  const handleSelect = (key: string, value: string) => {
    if (key === 'Palika') {
      setFilters({ ...filters, location: value });
    }
    if (key === 'Ward') {
      setFilters({ ...filters, ward_no: value });
    }
  };
  const { data } = useAppStatsList(filters);
  const { data: listPalika } = useListPalikas();
  const transformedData =
    listPalika?.data?.map((item) => ({
      label: item.location as string,
      value: item.location as string,
    })) || [];

  transformedData.unshift({ label: 'All', value: '' });

  const transformedWardNumber =
    WARDNUMBER.map((item) => ({
      label: item.wardnumber.toString(),
      value: item.wardnumber.toString(),
    })) || [];

  const handleDownloadClick = () => {
    return sanitizeAndExportReport(data?.data || []);
  };
  transformedWardNumber.unshift({ label: 'All', value: '' });

  return (
    <div>
      <div className="grid grid-cols grid-cols-2 gap-4 px-4 pt-2 place-content-between">
        <div className="cols-span-1 flex items-center text-xl text-primary font-semibold">
          {!data ? 'Loading...' : 'Population Insights'}
        </div>
        <div className=" cols-span-1 flex items-center place-content-end gap-0">
          <SearchDropdownComponent
            transformedData={transformedData}
            title={'Palika'}
            handleSelect={handleSelect}
          />
          <SearchDropdownComponent
            transformedData={transformedWardNumber}
            title={'Ward'}
            handleSelect={handleSelect}
          />

          <Button
            onClick={handleDownloadClick}
            className="mx-1 hover:bg-white bg-white text-black rounded"
            size={'sm'}
          >
            <DownloadCloud className="mr-2 h-3 w-3" />
            Download
          </Button>
        </div>
      </div>

      {!data ? (
        <div className="flex h-screen w-screen items-center justify-center">
          <LucideShipWheel className="animate-spin" size={24} />
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-100px)] px-4 py-2">
          <PopulationInsights data={data} />
          <div className="mt-8"></div>
          <HouseHoldInsights data={data} />
          <div className="mt-8"></div>
          <HouseHoldHeadInsights data={data} />
        </ScrollArea>
      )}
    </div>
  );
}
