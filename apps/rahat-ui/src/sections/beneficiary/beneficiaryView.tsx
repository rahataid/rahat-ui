'use client';
import React, { useState } from 'react';

import { Tabs, TabsContent } from '@rahat-ui/shadcn/components/tabs';
import {
  ResizablePanelGroup,
  ResizableHandle,
  ResizablePanel,
} from '@rahat-ui/shadcn/components/resizable';
import BeneficiaryNav from '../../sections/beneficiary/nav';
import BeneficiaryListView from '../../sections/beneficiary/listView';
import BeneficiaryGridView from '../../sections/beneficiary/gridView';
import BeneficiaryDetail from '../../sections/beneficiary/beneficiaryDetail';
import { IBeneficiaryItem } from '../../types/beneficiary';
import AddBeneficiary from './addBeneficiary';
import { BENEFICIARY_NAV_ROUTE } from '../../const/beneficiary.const';
import ImportBeneficiary from './importBeneficiary';
import {
  ServiceContext,
  ServiceContextType,
} from '../../providers/service.provider';

export default function BeneficiaryView() {
  const { beneficiaryQuery } = React.useContext(
    ServiceContext
  ) as ServiceContextType;
  const [selectedData, setSelectedData] = useState<IBeneficiaryItem>();
  const [addBeneficiary, setAddBeneficiary] = useState<boolean>(false);
  const [active, setActive] = useState<string>(BENEFICIARY_NAV_ROUTE.DEFAULT);

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

  const handleImport = (item: string) => {
    setActive(item);
  };

  const { data } = beneficiaryQuery.useListBeneficiary({ order: 'createdAt' });

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
              handleImport={handleImport}
              onAddBenficiaryclick={handleBeneficiaryAdd}
              data={data?.data}
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel minSize={28}>
            {active === BENEFICIARY_NAV_ROUTE.IMPORT_BENEFICIARY && (
              <ImportBeneficiary />
            )}
            <TabsContent value="list">
              <BeneficiaryListView data={data?.data} meta={data?.meta} />
            </TabsContent>
            <TabsContent value="grid">
              <BeneficiaryGridView
                handleClick={handleBeneficiaryCardClick}
                data={data?.data}
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
