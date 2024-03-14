'use client';

import {
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/src/components/ui/resizable';
import BeneficiaryTable from './beneficiary.table';

export default function BeneficiaryView() {
  // const handleClose = () => {
  //   setSelectedBeneficiary(undefined);
  // };

  return (
    <ResizablePanelGroup className="bg-secondary" direction="horizontal">
      <ResizablePanel>
        <BeneficiaryTable />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
