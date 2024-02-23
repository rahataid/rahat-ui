'use client';

import { useState } from 'react';
import { Tabs, TabsContent } from '@rahat-ui/shadcn/components/tabs';
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

export default function BeneficiaryView() {
  const [selectedData, setSelectedData] = useState<IBeneficiaryItem>();

  const handleBeneficiaryCardClick = (item: IBeneficiaryItem) => {
    setSelectedData(item);
  };

  const handleView = () => {
    setSelectedData(undefined);
  };

  return (
    <div className="mt-2">
      <Tabs defaultValue="grid">
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-max border"
        >
          <ResizablePanel
            minSize={20}
            defaultSize={20}
            maxSize={20}
            className="h-full"
          >
            <BeneficiaryNav handleView={handleView} />
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
