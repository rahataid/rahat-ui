'use client';

import { Checkbox } from '@rahat-ui/shadcn/components/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSecondPanel } from '../../../../providers/second-panel-provider';
import GrievanceDetail from './grievance.detail';
// import BeneficiaryDetail from '../../../../sections/projects/el/beneficiary/beneficiary.detail';

export const useGrievanceTableColumns = ({
  data,
  rowDetails,
  setRowDetails,
}: any) => {
  const { setSecondPanelComponent, closeSecondPanel, secondPanel } =
    useSecondPanel();
  const [walletAddressCopied, setWalletAddressCopied] = useState<number>();
  const clickToCopy = (walletAddress: string, index: number) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(index);
  };

  const openSplitDetailView = (row: any) => {
    setRowDetails(row);
  };

  useEffect(() => {
    const details = secondPanel?.props?.details;
    if (details && data?.length > 0) {
      const updatedRow = data.find((row) => row.id == details.id);

      setRowDetails(updatedRow);
    }
  }, [data]);

  useEffect(() => {
    if (rowDetails) {
      setSecondPanelComponent(
        <GrievanceDetail
          closeSecondPanel={closeSecondPanel}
          details={rowDetails}
        />,
      );
    }
  }, [rowDetails]);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'reporter',
      header: 'Reporter',
      cell: ({ row }) => (
        <div
          className="cursor-pointer"
          onClick={() => openSplitDetailView(row.original)}
        >
          {row.original?.reportedBy}
        </div>
      ),
    },

    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => <div> {row.getValue('title')}</div>,
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => <div> {row.getValue('type')}</div>,
    },
    {
      accessorKey: 'createdBy',
      header: 'Created By',
      cell: ({ row }) => <div> {row.original?.createdBy?.name}</div>,
    },
    {
      accessorKey: 'createdOn',
      header: 'Created On',
      cell: ({ row }) => {
        const timestamp = row.original?.createdAt;
        if (!timestamp) return null;

        const [datePart, timePart] = timestamp.split('T');
        const formattedTime = timePart.split('.')[0];

        return (
          <div>
            {datePart} - {formattedTime}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <div> {row.getValue('status')}</div>,
    },

    {
      id: 'actions',
      enableHiding: false,
      header: 'Actions',
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
