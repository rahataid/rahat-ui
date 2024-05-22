'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@rahat-ui/shadcn/components/checkbox';
import BeneficiaryDetail from '../../../../sections/projects/el/beneficiary/beneficiary.detail';
import { Eye } from 'lucide-react';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';

export const useProjectBeneficiaryTableColumns = () => {
  const { setSecondPanelComponent, closeSecondPanel } = useSecondPanel();

  const openSplitDetailView = (rowDetail: any) => {
    setSecondPanelComponent(
      <BeneficiaryDetail
        closeSecondPanel={closeSecondPanel}
        beneficiaryDetails={rowDetail}
      />,
    );
  };

  const columns: ColumnDef<any>[] = [
    {
      id: 'select',
      header: '',

      cell: ({ row }) => {
        const isDisabled = row.getValue('voucher') != 'Not Assigned';
        const isChecked = row.getIsSelected() && !isDisabled;
        return (
          <Checkbox
            checked={isChecked}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            disabled={isDisabled}
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div
          className="cursor-pointer"
          onClick={() => openSplitDetailView(row.original)}
        >
          {row.getValue('name')}
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => <div> {row.getValue('type')}</div>,
    },

    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <div> {row.getValue('phone')}</div>,
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
      cell: ({ row }) => <div> {row.getValue('gender')}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Eye
            size={20}
            strokeWidth={1.5}
            className="cursor-pointer hover:text-primary"
            onClick={() => openSplitDetailView(row.original)}
          />
        );
      },
    },
  ];

  return columns;
};
