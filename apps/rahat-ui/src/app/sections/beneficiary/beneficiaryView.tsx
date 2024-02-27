'use client';
import React, { useState } from 'react';

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
import AddBeneficiary from './addBeneficiary';
import { usebeneficiaryListQuery } from '@rahat-ui/query';
import { ListBeneficiary, Meta } from '@rahat-ui/types';

export default function BeneficiaryView() {
  const [selectedData, setSelectedData] = useState<IBeneficiaryItem>();
  const [addBeneficiary, setAddBeneficiary] = useState<Boolean>(false);

  const handleBeneficiaryCardClick = (item: IBeneficiaryItem) => {
    setSelectedData(item);
    setAddBeneficiary(false);
  };

  const handleBeneficiaryAdd = () => {
    setAddBeneficiary(true);
    setSelectedData(undefined);
  };

  const handleView = () => {
    setSelectedData(undefined);
  };
  const { data } = usebeneficiaryListQuery({});
  const tableData: ListBeneficiary[] = React.useMemo(
    () => data?.data || [],
    [data?.data]
  );

  const meta: Meta | undefined = React.useMemo(() => data?.meta, [data?.meta]);

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
            <BeneficiaryNav
              onAddBenficiaryclick={handleBeneficiaryAdd}
              meta={meta}
            />
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
          {selectedData || addBeneficiary ? (
            <>
              <ResizableHandle />
              <ResizablePanel minSize={24}>
                {selectedData && <BeneficiaryDetail data={selectedData} />}
                {addBeneficiary && <AddBeneficiary />}
              </ResizablePanel>
            </>
          ) : null}
        </ResizablePanelGroup>
      </Tabs>
    </div>
  );
}
