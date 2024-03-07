'use client';

import { useState, useCallback } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/components/resizable';
import { Tabs } from '@rahat-ui/shadcn/components/tabs';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  ProjectDetailsNav,
  EditProject,
  ProjectBeneficiaryTable,
  ProjectVendorTable,
  ProjectBeneficiaryDetail,
  ProjectCampaignVoiceTable,
  ProjectCampaignTextTable,
} from '../../../sections/projects';
import ProjectDetails from './projectDetails';
import { PROJECT_DETAIL_NAV_ROUTE } from 'apps/rahat-ui/src/constants/project.detail.const';
import { Beneficiary } from '@rahataid/sdk/types';
import ProjectTransactionView from 'apps/rahat-ui/src/sections/projects/projectTransactionView';

export default function ProjectPage() {
  const [active, setActive] = useState<string>(
    PROJECT_DETAIL_NAV_ROUTE.DEFAULT
  );
  const [selectedData, setSelectedData] = useState<Beneficiary>();

  const handleBeneficiaryClick = useCallback((item: Beneficiary) => {
    setSelectedData(item);
  }, []);

  const handleNav = useCallback((item: string) => {
    setActive(item);
  }, []);

  const handleClose = () => {
    setSelectedData(null);
  };
  return (
    <div className="mb-5">
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
            <ProjectDetailsNav
              title={'Project Details'}
              handleNav={handleNav}
              active={active}
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>
            {active === PROJECT_DETAIL_NAV_ROUTE.DEFAULT && (
              <ScrollArea className="h-custom">
                <ProjectDetails />
              </ScrollArea>
            )}
            {active === PROJECT_DETAIL_NAV_ROUTE.EDIT && (
              <EditProject handleGoBack={handleNav} />
            )}
            {active === PROJECT_DETAIL_NAV_ROUTE.BENEFICIARY && (
              <ProjectBeneficiaryTable handleClick={handleBeneficiaryClick} />
            )}
            {active === PROJECT_DETAIL_NAV_ROUTE.VENDOR && (
              <ProjectVendorTable />
            )}
            {active === PROJECT_DETAIL_NAV_ROUTE.VOICE && (
              <ProjectCampaignVoiceTable />
            )}
            {active === PROJECT_DETAIL_NAV_ROUTE.TEXT && (
              <ProjectCampaignTextTable />
            )}
            {active === PROJECT_DETAIL_NAV_ROUTE.TRANSACTION && (
              <ProjectTransactionView />
            )}
          </ResizablePanel>
          {selectedData ? (
            <>
              <ResizableHandle />
              <ResizablePanel minSize={28} defaultSize={28}>
                {selectedData && (
                  <ProjectBeneficiaryDetail
                    data={selectedData}
                    handleClose={handleClose}
                  />
                )}
              </ResizablePanel>
            </>
          ) : null}
        </ResizablePanelGroup>
      </Tabs>
    </div>
  );
}
