import {
  useCommuicationStatsforBeneficiaryandStakeHolders,
  usePagination,
} from '@rahat-ui/query';
import { Heading, IconLabelBtn } from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import React from 'react';
import CommunicationsChartsStats from './components/commsShartsStats';
import CommunicationsStatsSkeleton from './components/commsSkeleton';
import CommsActivitiesTable from './table/comms.activities.table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { useActiveTab } from 'apps/rahat-ui/src/utils/useActivetab';
import { IndividualLogTab } from './components/IndividualLogs';
import { CloudDownloadIcon } from 'lucide-react';
import { DateRangePicker } from 'apps/rahat-ui/src/components/datePickerRange';

export default function CommunicationMainLogsView() {
  const { id: ProjectId } = useParams();
  const { filters, setFilters } = usePagination();

  const { data, isLoading: isLoadingBenefStakeholdersStats } =
    useCommuicationStatsforBeneficiaryandStakeHolders(
      ProjectId as UUID,
      filters,
    );
  const { activeTab, setActiveTab } = useActiveTab('overview');

  const handleDateChange = (range: any) => {
    if (range?.from && range?.to) {
      setFilters({
        ...filters,
        startDate: range.from.toISOString(),
        endDate: range.to.toISOString(),
        _v: Date.now(),
      });
    }
  };

  const handleClearDate = () => {
    setFilters({ _v: Date.now() });
  };

  return (
    <div className="flex flex-col p-4">
      <Heading
        title="Communications Logs"
        description="Track all the activity based logs here"
      />
      <Tabs
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="items-center mt-4"
      >
        <div className="flex items-center justify-between gap-4">
          <TabsList className="grid grid-cols-3 gap-1.5 w-[414px] h-[40px] bg-[#F0F1F3] rounded-md p-1">
            <TabsTrigger
              value="overview"
              className={`${
                activeTab === 'overview'
                  ? 'bg-white no-underline text-black'
                  : 'text-black'
              } h-full w-full p-1 font-inter text-[14px] leading-[24px] tracking-[0%]`}
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="communicationLog"
              className={`${
                activeTab === 'communicationLog'
                  ? 'bg-white no-underline text-black'
                  : 'text-black'
              } h-full w-full p-1 font-inter text-[14px] leading-[24px] tracking-[0%]`}
            >
              Activity Based Log
            </TabsTrigger>
            <TabsTrigger
              value="individualLog"
              className={`${
                activeTab === 'individualLog'
                  ? 'bg-white no-underline text-black'
                  : 'text-black'
              } h-full w-full p-1 font-inter text-[14px] leading-[24px] tracking-[0%]`}
            >
              Individual Logs
            </TabsTrigger>
          </TabsList>
          {activeTab === 'overview' && (
            <div className="flex gap-2 items-center">
              <IconLabelBtn
                Icon={CloudDownloadIcon}
                name={'Export Report'}
                variant="outline"
                className="text-[clamp(11px,1vw,14px)] h-[clamp(28px,3vw,36px)] px-2 sm:px-3"
              />
              <DateRangePicker
                placeholder="Pick date range"
                handleDateChange={handleDateChange}
                handleClearDate={handleClearDate}
                type="range"
              />
            </div>
          )}
        </div>
        <TabsContent value="overview">
          {isLoadingBenefStakeholdersStats ? (
            <CommunicationsStatsSkeleton />
          ) : (
            <CommunicationsChartsStats statsBenefStakeholders={data} />
          )}
        </TabsContent>
        <TabsContent value="communicationLog">
          <CommsActivitiesTable />
        </TabsContent>
        <TabsContent value="individualLog">
          <IndividualLogTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
