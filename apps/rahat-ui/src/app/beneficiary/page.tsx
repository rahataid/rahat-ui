'use client';

import { useState } from 'react';
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

export default function BeneficiaryPage() {
  const [selectedData, setSelectedData] = useState<IBeneficiaryItem>();

  const handleBeneficiaryCardClick = (item: IBeneficiaryItem) => {
    setSelectedData(item);
  };

  const handleView = () => {
    setSelectedData(undefined);
  };

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
              <BeneficiaryListView />
            </TabsContent>
            <TabsContent value="grid">
              <BeneficiaryGridView handleClick={handleBeneficiaryCardClick} />
            </TabsContent>
          </ResizablePanel>
          <ResizableHandle />
          {selectedData && (
            <ResizablePanel minSize={24}>
              <BeneficiaryDetail data={selectedData} />
            </ResizablePanel>
          )}
        </ResizablePanelGroup>
      </Tabs>
    </div>
  );
}
