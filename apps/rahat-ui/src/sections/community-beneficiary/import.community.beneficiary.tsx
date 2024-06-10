'use client';

import {
  useBeneficiaryStore,
  useListTempGroups,
  useTempBeneficiaryImport,
} from '@rahat-ui/query';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@rahat-ui/shadcn/components/accordion';
import { useRouter } from 'next/navigation';

export default function ImportTempCommunityBeneficiary() {
  const router = useRouter();

  const { communityBeneficiariesUUID, setCommunityBeneficiariesUUID } =
    useBeneficiaryStore();

  const importTempBeneficiaries = useTempBeneficiaryImport();

  const { data: tempGroups } = useListTempGroups();

  const inputOptions: { [key: string]: string } = {};

  tempGroups?.data?.forEach(
    (group: { groupName: string }) =>
      (inputOptions[group.groupName] = group.groupName),
  );

  const totalSelected =
    communityBeneficiariesUUID && communityBeneficiariesUUID.length;

  const handleImportTempBeneficiaries = async () => {
    const res = await importTempBeneficiaries.mutateAsync({
      inputOptions,
      communityBeneficiariesUUID,
    });
    if(!res) return;
    setCommunityBeneficiariesUUID([]);
    setTimeout(() => {
      if(res)
      router.push('/beneficiary')
    },1000);
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
            onClick={handleImportTempBeneficiaries}
          >
            Import Selected Beneficiaries
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
