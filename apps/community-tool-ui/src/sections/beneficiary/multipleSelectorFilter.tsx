'use client';

import {
  useCommunityBeneficiaryGroupCreate,
  useCommunityBeneficiaryStore,
  useCommunityGroupList,
} from '@rahat-ui/community-query';
import { usePagination } from '@rahat-ui/query';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@rahat-ui/shadcn/components/accordion';

export default function Filter() {
  const { pagination, filters } = usePagination();
  const { selectedBeneficiaries, setSelectedBeneficiaries } =
    useCommunityBeneficiaryStore();

  const commuinityBeneficiaryGroupCreate = useCommunityBeneficiaryGroupCreate();

  filters.autoCreated = 'false';
  pagination.perPage = 20;
  pagination.page = 1;
  const { data: groupData } = useCommunityGroupList({
    ...pagination,
    ...filters,
  });
  const inputOptions: { [key: string]: string } = {};

  groupData?.data?.rows.forEach((row: { uuid: string; name: string }) => {
    inputOptions[row.uuid] = row.name;
  });

  console.log(inputOptions);
  const totalSelected = selectedBeneficiaries && selectedBeneficiaries.length;

  const handleAssignBeneficiariesGroup = async () => {
    const res = await commuinityBeneficiaryGroupCreate.mutateAsync({
      inputOptions,
      selectedBeneficiaries,
    });
    if (res?.response?.success) {
      setSelectedBeneficiaries([]);
    }
  };

  return (
    <Accordion
      type="single"
      collapsible
      className="px-2 pb-4 text-muted-foreground"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="no-underline bg-muted hover:bg-primary p-2 rounded hover:text-white">
          {totalSelected}{' '}
          {(totalSelected as number) > 1 ? 'beneficiaries' : 'beneficiary'}{' '}
          selected.
        </AccordionTrigger>
        <AccordionContent className="p-2 border rounded mt-1">
          <div
            className="p-2 hover:bg-muted rounded cursor-pointer"
            onClick={handleAssignBeneficiariesGroup}
          >
            Assign Group
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
