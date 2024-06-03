'use client';

import {
  useAppStatsList,
  useCommunityBeneficiaryStatsList,
  useListPalikas,
} from '@rahat-ui/community-query';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { DownloadCloud, LucideShipWheel } from 'lucide-react';
import HouseHoldHeadInsights from './houseHoldHeadInsights';
import HouseHoldInsights from './houseHoldInsights';
import PopulationInsights from './populatioInsights';
// import SearchLocationComponent from '../../components/searchDropdownComponent';
import React from 'react';
import WARDNUMBER from '../../utils/wardData.json';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import SearchDropdownComponent from '../../components/searchDropdownComponent';
import { FilterStatsDto } from '@rahataid/community-tool-sdk/app';
export default function DashboardView() {
  const [filters, setFilters] = React.useState<FilterStatsDto>({});
  const handleSelect = (key: string, value: string) => {
    if (key === 'palika') {
      setFilters({ ...filters, location: value });
    }
    if (key === 'ward number') {
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

  const transformedWardNumber =
    WARDNUMBER.map((item) => ({
      label: item.wardnumber.toString(),
      value: item.wardnumber.toString(),
    })) || [];

  return (
    <div>
      <div className="grid  gap-4 px-4 pt-2 justify-items-end">
        <div className="cols-span-1 gap-2 mx-2 px-2 justify-items-end">
          <SearchDropdownComponent
            transformedData={transformedData}
            title={'palika'}
            handleSelect={handleSelect}
          />
          <SearchDropdownComponent
            transformedData={transformedWardNumber}
            title={'ward number'}
            handleSelect={handleSelect}
          />

          <Button className="mx-0" size={'sm'}>
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
        <ScrollArea className="h-[calc(100vh-68px)] px-4 py-2">
          <PopulationInsights data={data} />
          <HouseHoldInsights data={data} />
          <HouseHoldHeadInsights data={data} />
        </ScrollArea>
      )}
    </div>
  );
}
