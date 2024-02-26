'use client';

import React, { useState } from 'react';
import { LayoutGrid, AlignJustify } from 'lucide-react';
import {
  TabsList,
  TabsTrigger,
  Tabs,
  TabsContent,
} from '@rahat-ui/shadcn/components/tabs';
import {
  ResizablePanelGroup,
  ResizableHandle,
  ResizablePanel,
} from '@rahat-ui/shadcn/components/resizable';
import BeneficiaryNav from '../../components/beneficiary/nav';
import BeneficiaryListView from '../../components/beneficiary/listView';
import BeneficiaryGridView from '../../components/beneficiary/gridView';
import BeneficiaryDetail from '../../components/beneficiary/beneficiaryDetail';
import { IBeneficiaryItem } from '../../types/beneficiary';
import { usebeneficiaryListQuery } from '@rahat-ui/query';
import { ListBeneficiary } from '@rahat-ui/types';

export default function BeneficiaryView() {
  const [selectedData, setSelectedData] = useState<IBeneficiaryItem>();

  const handleBeneficiaryCardClick = (item: IBeneficiaryItem) => {
    setSelectedData(item);
  };

  const handleView = () => {
    setSelectedData(undefined);
  };
  const { data } = usebeneficiaryListQuery({});
  const tableData: ListBeneficiary[] = React.useMemo(
    () => data?.data || [],
    [data?.data]
  );

  const meta = React.useMemo(() => data?.meta && data?.meta, [data?.meta]);

  console.log(selectedData);
  return (
    <div>
      <Tabs defaultValue="grid">
        <div className="flex items-center justify-between mb-9 mt-8">
          <h1 className="text-3xl font-semibold">Beneficiaries List</h1>
          <TabsList>
            <TabsTrigger value="list" onClick={handleView}>
              <AlignJustify />
            </TabsTrigger>
            <TabsTrigger value="grid" onClick={handleView}>
              <LayoutGrid />
            </TabsTrigger>
          </TabsList>
        </div>
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-max border"
        >
          <ResizablePanel
            minSize={17}
            defaultSize={17}
            maxSize={17}
            className="h-full"
          >
            <BeneficiaryNav />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel minSize={28}>
            <TabsContent value="list">
              <BeneficiaryListView data={tableData} meta={meta} />
            </TabsContent>
            <TabsContent value="grid">
              <BeneficiaryGridView
                handleClick={handleBeneficiaryCardClick}
                data={tableData}
              />
            </TabsContent>
          </ResizablePanel>
          {selectedData && (
            <>
              <ResizableHandle />
              <ResizablePanel minSize={24}>
                <BeneficiaryDetail data={selectedData} />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </Tabs>
    </div>
  );
}
