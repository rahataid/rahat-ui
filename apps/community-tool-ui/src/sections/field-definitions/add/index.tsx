'use client';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/src/components/ui/resizable';
import { Tabs } from '@rahat-ui/shadcn/src/components/ui/tabs';
import React, { useState } from 'react';
import BeneficiaryNav from '../../../sections/beneficiary/nav';
import FieldDefAdd from './addFieldDefinitions';
import ExcelUploader from '../import/ExcelUploader';

export default function AddFieldDefinitions() {
  const [activeTab, setActiveTab] = useState<'add' | 'import' | null>('add');
  const handleTabChange = (tab: 'add' | 'import') => {
    setActiveTab(tab);
  };
  return (
    <>
      {activeTab === 'add' && <FieldDefAdd handleTabChange={handleTabChange} />}

      {activeTab === 'import' && (
        <div className="p-4 h-add rounded border bg-white">
          <ExcelUploader handleTabChange={handleTabChange} />
        </div>
      )}
    </>
  );
}
