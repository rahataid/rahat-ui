'use client';

import React, { useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@rahat-ui/shadcn/components/accordion';
import { Table } from '@tanstack/react-table';
import { ListBeneficiary } from '@rahataid/community-tool-sdk/beneficiary';
// import { useSwal } from '/src/components/swal';
import Swal from 'sweetalert2';
import { useRumsanService } from '../../providers/service.provider';

type IProps = {
  selectedData: number[];
  handleClose: () => void;
};

export default function Filter({ selectedData, handleClose }: IProps) {
  //   const dialog = useSwal();
  //   const totalSelected = table.getFilteredSelectedRowModel().rows.length;
  const perPage = 15;
  const currentPage = 1;
  const { communityGroupQuery, communityBeneficiaryGroupQuery } =
    useRumsanService();

  const beneficiaryGroup =
    communityBeneficiaryGroupQuery.useCommunityBeneficiaryGroupCreate();
  const { data: groupData } = communityGroupQuery.useCommunityGroupList({
    perPage,
    page: currentPage,
  });

  const inputOptions: { [key: string]: string } = {};
  groupData?.data?.rows.forEach((row: { id: string; name: string }) => {
    inputOptions[row.id] = row.name;
  });

  const totalSelected = selectedData.length;

  const handleAssignBeneficiariesGroup = async () => {
    const res = await beneficiaryGroup.mutateAsync({
      inputOptions,
      selectedData,
    });

    res?.response?.success && handleClose();
  };

  return (
    <Accordion
      type="single"
      collapsible
      className="px-2 pb-4 text-muted-foreground"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="no-underline bg-muted hover:bg-primary p-2 rounded hover:text-white">
          {totalSelected} {totalSelected > 1 ? 'beneficiaries' : 'beneficiary'}{' '}
          selected.
        </AccordionTrigger>
        <AccordionContent className="p-2 border rounded mt-1">
          <div
            className="p-2 hover:bg-muted rounded cursor-pointer"
            onClick={handleAssignBeneficiariesGroup}
          >
            Create Beneficiarries Group
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
