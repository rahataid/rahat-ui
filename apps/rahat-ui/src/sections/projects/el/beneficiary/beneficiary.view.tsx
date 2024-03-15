'use client';

import { useState } from 'react';
import {
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/src/components/ui/resizable';
import BeneficiaryTable from './beneficiary.table';
import BeneficiaryDetail from './beneficiary.detail';

export default function BeneficiaryView() {
  const [selectedBeneficiary, setSelectedBeneficiary] = useState();

  const handleRowClick = (selected) => {
    setSelectedBeneficiary(selected);
  };

  const handleClose = () => {
    setSelectedBeneficiary(undefined);
  };
  return (
    <ResizablePanelGroup className="bg-secondary" direction="horizontal">
      <ResizablePanel>
        <BeneficiaryTable />
      </ResizablePanel>
      {selectedBeneficiary && (
        <ResizablePanel defaultSize={32}>
          <BeneficiaryDetail
            data={selectedBeneficiary}
            handleClose={handleClose}
          />
        </ResizablePanel>
      )}
    </ResizablePanelGroup>
  );
}
