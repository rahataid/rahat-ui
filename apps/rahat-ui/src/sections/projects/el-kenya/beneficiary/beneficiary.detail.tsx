import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import React from 'react';
import { Copy, CopyCheck } from 'lucide-react';
import HeaderWithBack from '../../components/header.with.back';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import EditButton from '../../components/edit.btn';
import DeleteButton from '../../components/delete.btn';

export default function BeneficiaryDetail() {
  const { id } = useParams() as { id: UUID };
  const [walletAddressCopied, setWalletAddressCopied] =
    React.useState<number>();

  const clickToCopy = (walletAddress: string, id: number) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(id);
  };
  return (
    <div className="h-[calc(100vh-95px)] m-4">
      <div className="flex justify-between items-center">
        <HeaderWithBack
          title="Beneficiary details"
          subtitle="Here is the detailed view of selected beneficiary"
          path={`/projects/el-kenya/${id}/beneficiary`}
        />
        <div className="flex space-x-2">
          <EditButton className="border-none bg-sky-50 shadow-none" path="" />
          <DeleteButton
            className="border-none bg-red-100 shadow-none"
            name="beneficiary"
            handleContinueClick={() => { }}
          />
        </div>
      </div>
      <div className="p-5 rounded-md shadow border grid grid-cols-4 gap-5">
        <div>
          <h1 className="text-md text-muted-foreground">Beneficiary Name</h1>
          <p className="font-medium">John Doe</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Gender</h1>
          <p className="font-medium">Male</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Phone Number</h1>
          <p className="font-medium">+9779876543210</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Wallet Address</h1>
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => clickToCopy('4567876545', 4567876545)}
          >
            <p>{truncateEthAddress('4567876545')}</p>
            {walletAddressCopied === 4567876545 ? (
              <CopyCheck size={15} strokeWidth={1.5} />
            ) : (
              <Copy className="text-slate-500" size={15} strokeWidth={1.5} />
            )}
          </div>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Beneficiary Type</h1>
          <p className="font-medium">
            <Badge>-</Badge>
          </p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Eye Checkup Status</h1>
          <p className="font-medium">
            <Badge>-</Badge>
          </p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Glasses Status</h1>
          <p className="font-medium">
            <Badge>-</Badge>
          </p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Voucher Type</h1>
          <p className="font-medium">
            <Badge>-</Badge>
          </p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Voucher Status</h1>
          <p className="font-medium">
            <Badge>-</Badge>
          </p>
        </div>
      </div>
    </div>
  );
}
