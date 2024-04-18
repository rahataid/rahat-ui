'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@rahat-ui/shadcn/components/accordion';
import { ListBeneficiary } from '@rahat-ui/types';
import { Table } from '@tanstack/react-table';
import { useSwal } from '../../components/swal';

type IProps = {
  table: Table<ListBeneficiary>;
};

export default function Filter({ table }: IProps) {
  const dialog = useSwal();
  const totalSelected = table.getFilteredSelectedRowModel().rows.length;

  const selectedAddresses = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original)
    .map((r) => r.walletAddress);

  const handleAssignProject = async () => {
    const { value } = await dialog.fire({
      title: 'Assign Project',
      text: 'Assign a project for the beneficiary',
      showCancelButton: true,
      confirmButtonText: 'Assign',
      cancelButtonText: 'Cancel',
      input: 'select',
      inputOptions: {
        project1: 'Project1',
        project2: 'Project2',
        project3: 'Project3',
      },
      inputPlaceholder: 'Select a project',
    });
    if (value) {
      dialog.fire({
        title: 'Project Assigned',
        text: `Project ${value} has been assigned successfully`,
        icon: 'success',
      });
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
          {totalSelected} {totalSelected > 1 ? 'beneficiaries' : 'beneficiary'}{' '}
          selected.
        </AccordionTrigger>
        <AccordionContent className="p-2 border rounded mt-1">
          <div
            className="p-2 hover:bg-muted rounded cursor-pointer"
            onClick={handleAssignProject}
          >
            Assign Project
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
