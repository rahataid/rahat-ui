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
  const [addBeneficiary, setAddBeneficiary] = useState<Boolean>(false);
  const [active, setActive] = useState<string>(BENEFICIARY_NAV_ROUTE.DEFAULT);

  const handleBeneficiaryClick = (item: IBeneficiaryItem) => {
    setSelectedData(item);
    setAddBeneficiary(false);
  };

  const handleView = () => {
    setSelectedData(undefined);
  };

  const handleNav = (item: string) => {
    setActive(item);
  };

  const { data } = beneficiaryQuery.usebeneficiaryList({ order: 'createdAt' });
  
  return (
    <div>
      <Tabs defaultValue="list">
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
            <BeneficiaryNav handleNav={handleNav} meta={data?.meta} />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel minSize={28}>
            {active === BENEFICIARY_NAV_ROUTE.ADD_BENEFICIARY ? (
              <AddBeneficiary />
            ) : active === BENEFICIARY_NAV_ROUTE.IMPORT_BENEFICIARY ? (
              <ImportBeneficiary />
            ) : null}

            {active === BENEFICIARY_NAV_ROUTE.DEFAULT && (
              <>
                <TabsContent value="list">
                  <BeneficiaryListView
                    data={data?.data}
                    meta={data?.meta}
                    handleClick={handleBeneficiaryClick}
                  />
                </TabsContent>
                <TabsContent value="grid">
                  <BeneficiaryGridView
                    handleClick={handleBeneficiaryClick}
                    data={data?.data}
                  />
                </TabsContent>
              </>
            )}
          </ResizablePanel>
          {selectedData || addBeneficiary ? (
            <>
              <ResizableHandle />
              <ResizablePanel minSize={24}>
                {selectedData && <BeneficiaryDetail data={selectedData} />}
                {/* {addBeneficiary && <AddBeneficiary />} */}
              </ResizablePanel>
            </>
          ) : null}
        </ResizablePanelGroup>
      </Tabs>
    </div>
  );
}
