import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import React from 'react';
import { Copy, CopyCheck, User, Users } from 'lucide-react';
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
          title="Consumer details"
          subtitle="Here is the detailed view of selected consumer"
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
      <div className="p-5 rounded-md  grid grid-cols-4 gap-5">
        {/* <div>
          <h1 className="text-md text-muted-foreground">Beneficiary Name</h1>
          <p className="font-medium">{name}</p>
        </div> */}
        <div className="flex items-center gap-2 shadow border p-5">
          <div
            className={'rounded-full h-8 w-8 flex items-center justify-center '}
          >
            <User size={20} strokeWidth={2} />
          </div>
          <div>
            <p className="font-medium">{phone}</p>

            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => clickToCopy(walletAddress)}
            >
              <p className="text-muted-foreground">
                {truncateEthAddress(walletAddress)}
              </p>
              {walletAddressCopied === walletAddress ? (
                <CopyCheck size={15} strokeWidth={1.5} />
              ) : (
                <Copy className="text-slate-500" size={15} strokeWidth={1.5} />
              )}
            </div>
            <p className="font-medium text-muted-foreground">{gender}</p>
          </div>
        </div>

        <div className="shadow border p-5">
          <p className="font-medium">Voucher Usage</p>
          <p className="font-medium">
            <Badge>{eyeCheckupStatus}</Badge>
          </p>
        </div>

        <div className="shadow border p-5">
          <p className="font-medium">Glass Type</p>
          <p className="font-medium">
            <Badge>{voucherType}</Badge>
          </p>
        </div>

        <div className="shadow border p-5">
          <p className="font-medium">Consent Status</p>
          <p className="font-medium">
            <Badge>{voucherType}</Badge>
          </p>
        </div>
      </div>
    </div>
  );
}
