import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';
import React from 'react';
import { Copy, CopyCheck } from 'lucide-react';
import HeaderWithBack from '../../components/header.with.back';
import { useParams, useSearchParams } from 'next/navigation';
import { UUID } from 'crypto';
import EditButton from '../../../../components/edit.btn';
import DeleteButton from '../../../../components/delete.btn';

export default function BeneficiaryDetail() {
  const { id, benId } = useParams() as { id: UUID; benId: UUID };
  const [walletAddressCopied, setWalletAddressCopied] =
    React.useState<string>();

  const searchParams = useSearchParams();
  const phone = searchParams.get('phone');
  const type = searchParams.get('type');
  const name = searchParams.get('name');
  const walletAddress = searchParams.get('walletAddress') || '';
  const gender = searchParams.get('gender') || '';
  const voucherType = searchParams.get('voucherType') || '';
  const voucherStatus = searchParams.get('voucherStatus') || '';
  const glassesStatus = searchParams.get('glassesStatus') || '';
  const eyeCheckupStatus = searchParams.get('eyeCheckupStatus') || '';
  const location = searchParams.get('location') || '-';
  const serialNumber = searchParams.get('serialNumber') || '-';

  const clickToCopy = (walletAddress: string) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(walletAddress);
  };
  return (
    <div className="h-[calc(100vh-95px)] m-4">
      <div className="flex justify-between items-center">
        <HeaderWithBack
          title="Beneficiary details"
          subtitle="Here is the detailed view of selected beneficiary"
          path={`/projects/el-kenya/${id}/beneficiary`}
        />
        {/* <div className="flex space-x-2">
          <EditButton className="border-none bg-sky-50 shadow-none" path=""/>
          <DeleteButton
            className="border-none bg-red-100 shadow-none"
            name="beneficiary"
            handleContinueClick={() => {}}
          />
        </div> */}
      </div>
      <div className="p-5 rounded-md shadow border grid grid-cols-4 gap-5">
        {/* <div>
          <h1 className="text-md text-muted-foreground">Beneficiary Name</h1>
          <p className="font-medium">{name}</p>
        </div> */}
        <div>
          <h1 className="text-md text-muted-foreground">Gender</h1>
          <p className="font-medium">{gender}</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Phone Number</h1>
          <p className="font-medium">{phone}</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Wallet Address</h1>
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => clickToCopy(walletAddress)}
          >
            <p>{truncateEthAddress(walletAddress)}</p>
            {walletAddressCopied === walletAddress ? (
              <CopyCheck size={15} strokeWidth={1.5} />
            ) : (
              <Copy className="text-slate-500" size={15} strokeWidth={1.5} />
            )}
          </div>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Beneficiary Type</h1>
          <p className="font-medium">
            <Badge>{type}</Badge>
          </p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Eye Checkup Status</h1>
          <p className="font-medium">
            <Badge>{eyeCheckupStatus}</Badge>
          </p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Glasses Status</h1>
          <p className="font-medium">
            <Badge>{glassesStatus}</Badge>
          </p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Voucher Type</h1>
          <p className="font-medium">
            <Badge>{voucherType}</Badge>
          </p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Voucher Status</h1>
          <p className="font-medium">
            <Badge>{voucherStatus}</Badge>
          </p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Location</h1>
          <p className="font-medium">{location}</p>
        </div>
        {type === 'WALK_IN' && (
          <div>
            <h1 className="text-md text-muted-foreground">Serial Number</h1>
            <p className="font-medium">{serialNumber}</p>
          </div>
        )}
      </div>
    </div>
  );
}
