'use client';

import {
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/src/components/ui/resizable';
import { Beneficiary } from '@rahataid/sdk';
import { useState } from 'react';
import BeneficiaryTable from './beneficiary.table';

export default function BeneficiaryView() {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel>
        <BeneficiaryTable />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
