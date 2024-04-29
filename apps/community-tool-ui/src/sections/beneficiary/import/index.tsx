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
import { useActiveFieldDefinitionsList } from '@rahat-ui/community-query';

export default function ImportBeneficiary() {
  let extraFields = [];
  const { data } = useActiveFieldDefinitionsList();
  if (data && data.data.length > 0) {
    const myFields = data.data.map((obj: any) => obj.name);
    extraFields = myFields;
  }

  return <ImportBen extraFields={extraFields} />;
}
