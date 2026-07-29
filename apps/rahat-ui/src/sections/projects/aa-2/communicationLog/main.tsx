import { useCommuicationStatsforBeneficiaryandStakeHolders } from '@rahat-ui/query';
import { Heading } from 'apps/rahat-ui/src/common';
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
import { DatePicker } from 'apps/rahat-ui/src/components/datePicker';
import { X } from 'lucide-react';

export default function CommunicationMainLogsView() {
  const { id: ProjectId } = useParams();
  const [startDate, setStartDate] = React.useState<Date | undefined>();
  const [endDate, setEndDate] = React.useState<Date | undefined>();

  const { data, isLoading: isLoadingBenefStakeholdersStats } =
    useCommuicationStatsforBeneficiaryandStakeHolders(ProjectId as UUID, {
      start: startDate,
      end: endDate,
    });
  const { activeTab, setActiveTab } = useActiveTab('overview');

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
              {(startDate || endDate) && (
                <X
                  className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground shrink-0"
                  onClick={() => {
                    setStartDate(undefined);
                    setEndDate(undefined);
                  }}
                />
              )}
              <DatePicker
                placeholder="Pick Start Date"
                handleDateChange={(date: Date) => setStartDate(date)}
                type="start"
                selectedDate={startDate}
                maxDate={endDate}
                className="w-[160px]"
              />
              <DatePicker
                placeholder="Pick End Date"
                handleDateChange={(date: Date) => setEndDate(date)}
                type="end"
                selectedDate={endDate}
                minDate={startDate}
                className="w-[160px]"
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
