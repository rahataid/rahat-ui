import { truncateEthAddress } from '@rumsan/sdk/utils';
import { ColumnDef } from '@tanstack/react-table';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import { Eye } from 'lucide-react';
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

  const columns: ColumnDef<any>[] = [
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
