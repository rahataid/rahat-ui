import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import { ColumnDef } from '@tanstack/react-table';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import { EllipsisVertical, Eye } from 'lucide-react';
import { useState } from 'react';
import BeneficiaryDetail from './beneficiary.detail';

export type Beneficiary = {
  walletAddress: string;
  gender: string;
  internetStatus: string;
  phoneStatus: string;
  bankedStatus: string;
};

export const useCvaBeneficiaryTableColumns = () => {
  const { setSecondPanelComponent, closeSecondPanel } = useSecondPanel();
  const [walletAddressCopied, setWalletAddressCopied] = useState<number>();

  const clickToCopy = (walletAddress: string, index: number) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(index);
  };

  // const openSplitDetailView = useCallback((rowDetail: any) => {
  //   setSecondPanelComponent(
  //     <BeneficiaryDetail
  //       closeSecondPanel={closeSecondPanel}
  //       data={rowDetail}
  //     />,
  //   );
  // }, []);

  const columns: ColumnDef<any>[] = [
    // {
    //   id: 'select',
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && 'indeterminate')
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    // {
    //   accessorKey: 'walletAddress',
    //   header: 'Wallet Address',
    //   cell: ({ row }) => (
    //     <TooltipProvider delayDuration={100}>
    //       <Tooltip>
    //         <TooltipTrigger
    //           className="flex items-center gap-3 cursor-pointer"
    //           onClick={() =>
    //             clickToCopy(row.getValue('walletAddress'), row.index)
    //           }
    //         >
    //           <p>{truncateEthAddress(row.getValue('walletAddress'))}</p>
    //           {walletAddressCopied === row.index ? (
    //             <CopyCheck size={15} strokeWidth={1.5} />
    //           ) : (
    //             <Copy className="text-slate-500" size={15} strokeWidth={1.5} />
    //           )}
    //         </TooltipTrigger>
    //         <TooltipContent className="bg-secondary" side="bottom">
    //           <p className="text-xs font-medium">
    //             {walletAddressCopied === row.index ? 'copied' : 'click to copy'}
    //           </p>
    //         </TooltipContent>
    //       </Tooltip>
    //     </TooltipProvider>
    //   ),
    // },
    {
      accessorKey: 'walletAddress',
      header: 'WalletAddress',
      cell: ({ row }) => (
        <div
          className="cursor-pointer"
          onClick={() => {
            setSecondPanelComponent(
              <BeneficiaryDetail
                beneficiaryDetails={row.original}
                closeSecondPanel={closeSecondPanel}
              />,
            );
          }}
        >
          {truncateEthAddress(row.getValue('walletAddress'))}
        </div>
      ),
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
      cell: ({ row }) => <div>{row.getValue('gender')}</div>,
    },
    {
      accessorKey: 'internetStatus',
      header: 'Internet Access',
      cell: ({ row }) => <div>{row.getValue('internetStatus')}</div>,
    },
    {
      accessorKey: 'phoneStatus',
      header: 'Phone Type',
      cell: ({ row }) => <div>{row.getValue('phoneStatus')}</div>,
    },
    {
      accessorKey: 'bankedStatus',
      header: 'Banking Status',
      cell: ({ row }) => <div>{row.getValue('bankedStatus')}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Eye
              onClick={() => {
                setSecondPanelComponent(
                  <BeneficiaryDetail
                    beneficiaryDetails={row.original}
                    closeSecondPanel={closeSecondPanel}
                  />,
                );
              }}
              className="hover:text-primary cursor-pointer"
              size={16}
              strokeWidth={1.5}
            />
          </div>
        );
      },
    },
  ];
  return columns;
};
