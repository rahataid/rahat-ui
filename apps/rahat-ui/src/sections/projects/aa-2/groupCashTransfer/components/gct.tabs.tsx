'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'libs/shadcn/src/components/ui/tabs';
import { useActiveTab } from 'apps/rahat-ui/src/utils/useActivetab';
import GctList from './gct.list';
import GctManagementList from './gct.management.list';
import GctOverview from './gct.overview';
import { IconLabelBtn, SpinnerLoader } from 'apps/rahat-ui/src/common';
import { CloudDownloadIcon } from 'lucide-react';
import { DateRangePicker } from 'apps/rahat-ui/src/components/datePickerRange';
import { exportGctData, hasGctData } from '../utils/gct.utils';
import { useGetGctData } from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import TooltipWrapper from 'apps/rahat-ui/src/components/tooltip.wrapper';

// ─── Tab registry ─────────────────────────────────────────────────────────────

const GCT_TABS = [
  { value: 'overview', labelKey: 'OVERVIEW' },
  { value: 'gctGroupList', labelKey: 'GCT_GROUP_LIST' },
  { value: 'gctManagementList', labelKey: 'GCT_MANAGEMENT' },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function GctTabs() {
  const t = useTranslations('AA_PROJECT_WITH_CASH_TRACKER');
  const tg = useTranslations('GLOBAL');
  const { activeTab, setActiveTab } = useActiveTab('overview');
  const { id } = useParams();
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();

  const { data, isPending } = useGetGctData(id as UUID, {
    startDate,
    endDate,
  });
  const stats = data?.data ?? data ?? null;
  const hasData = hasGctData(stats);

  useEffect(() => {
    if (!activeTab) setActiveTab('overview');
  }, [activeTab, setActiveTab]);

  const handleDateChange = (range: any) => {
    if (range?.from && range?.to) {
      setStartDate(range.from.toISOString());
      setEndDate(range.to.toISOString());
    }
  };

  const handleClearDate = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  // if (isPending) return <SpinnerLoader />;
  return (
    <div className="rounded-md border overflow-hidden">
      <Tabs
        value={activeTab || 'overview'}
        defaultValue={activeTab || 'overview'}
        onValueChange={setActiveTab}
      >
        <div className="px-4 pt-3">
          <div className="flex items-center justify-between gap-4">
            <TabsList className="border bg-secondary rounded mb-2">
              {GCT_TABS.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="w-full data-[state=active]:bg-white data-[state=active]:text-gray-700"
                >
                  {t(tab.labelKey)}
                </TabsTrigger>
              ))}
            </TabsList>
            {activeTab === 'overview' && (
              <div className="flex gap-2 items-center mb-2">
                <TooltipWrapper
                  tip={hasData ? '' : tg('NO_GCT_DATA_TO_EXPORT')}
                >
                  <IconLabelBtn
                    Icon={CloudDownloadIcon}
                    handleClick={() => exportGctData(stats)}
                    name={tg('EXPORT_REPORT')}
                    variant="outline"
                    disabled={!hasData}
                    className="text-[clamp(11px,1vw,14px)] h-[clamp(28px,3vw,36px)] px-2 sm:px-3"
                  />
                </TooltipWrapper>
                <DateRangePicker
                  placeholder={tg('PICK_DATE_RANGE')}
                  handleDateChange={handleDateChange}
                  handleClearDate={handleClearDate}
                  type="range"
                  className="h-[clamp(28px,3vw,36px)] text-[clamp(11px,1vw,14px)]"
                />
              </div>
            )}
          </div>
        </div>

        <TabsContent value="overview" className="px-4 pb-4 mt-0 overflow-auto">
          <GctOverview stats={stats} isPending={isPending} />
        </TabsContent>
        <TabsContent
          value="gctGroupList"
          className="px-4 pb-4 mt-0 overflow-auto"
        >
          <GctList />
        </TabsContent>
        <TabsContent
          value="gctManagementList"
          className="px-4 pb-4 mt-0 overflow-auto"
        >
          <GctManagementList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
