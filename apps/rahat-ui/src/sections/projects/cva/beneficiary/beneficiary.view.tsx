'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/src/components/ui/resizable';
import { Beneficiary } from '@rahataid/sdk';
import { useState } from 'react';
import BeneficiaryDetail from './beneficiary.detail';
import BeneficiaryTable from './beneficiary.table';

export default function BeneficiaryView() {
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary>();

  const handleRowClick = (selected: Beneficiary) => {
    setSelectedBeneficiary(selected);
  };

  const handleClose = () => {
    setSelectedBeneficiary(undefined);
  };
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel>
        <BeneficiaryTable handleClick={handleRowClick} />
      </ResizablePanel>
      {selectedBeneficiary && (
        <>
          <ResizableHandle />
          <ResizablePanel defaultSize={32}>
            <BeneficiaryDetail
              data={selectedBeneficiary}
              handleClose={handleClose}
            />
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
}
