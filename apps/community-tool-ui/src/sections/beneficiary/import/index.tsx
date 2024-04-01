'use client';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/src/components/ui/resizable';
import { Tabs } from '@rahat-ui/shadcn/src/components/ui/tabs';
import React from 'react';
import BeneficiaryNav from '../../../sections/beneficiary/nav';
import ImportBen from './Beneficiary';

export default function ImportBeneficiary() {
  return (
    <Tabs defaultValue="list" className="h-full">
      <ResizablePanelGroup direction="horizontal" className="min-h-max bg-card">
        <ResizablePanel minSize={20} defaultSize={20} maxSize={20}>
          <BeneficiaryNav />
        </ResizablePanel>
        <ResizableHandle />

        <ResizablePanel minSize={28}>
          <ImportBen />
        </ResizablePanel>
      </ResizablePanelGroup>
    </Tabs>
  );
}
