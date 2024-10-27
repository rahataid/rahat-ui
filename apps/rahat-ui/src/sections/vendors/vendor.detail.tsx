import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import React from 'react';
import { Copy, CopyCheck, FolderPlus, Pencil, Trash2 } from 'lucide-react';
import HeaderWithBack from '../projects/components/header.with.back';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import CoreBtnComponent from '../../components/core.btn';
import { useGetVendor } from '@rahat-ui/query';

export default function VendorDetail() {
  const { id } = useParams() as { id: UUID };
  const vendor = useGetVendor(id);
  const [walletAddressCopied, setWalletAddressCopied] =
    React.useState<string>();

  const clickToCopy = (walletAddress: string) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(walletAddress);
  };
  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <HeaderWithBack
          title="Vendor details"
          subtitle="Here is a detailed view of the selected vendor"
          path="/vendors"
        />
        <div className="flex space-x-2">
          <CoreBtnComponent
            className="text-primary bg-sky-50"
            name="Assign to Project"
            Icon={FolderPlus}
            handleClick={() => {}}
          />
          <CoreBtnComponent name="Edit" Icon={Pencil} handleClick={() => {}} />
          <CoreBtnComponent
            className="bg-red-100 text-red-600"
            name="Delete"
            Icon={Trash2}
            handleClick={() => {}}
          />
        </div>
      </div>
      <div className="p-5 rounded-md shadow border grid grid-cols-4 gap-5">
        <div>
          <h1 className="text-md text-muted-foreground">Vendor Name</h1>
          <p className="font-medium">{vendor.data?.data?.name || 'N/A'}</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Gender</h1>
          <p className="font-medium">{vendor.data?.data?.gender || 'N/A'}</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Project Name</h1>
          {vendor.data?.data?.projects?.map((project) => {
            return <p className="font-medium">{project?.name}</p>;
          })}
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Wallet Address</h1>
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => clickToCopy(vendor.data?.data?.wallet)}
          >
            <p>{truncateEthAddress(vendor.data?.data?.wallet)}</p>

            {walletAddressCopied === vendor.data?.data?.wallet ? (
              <CopyCheck size={15} strokeWidth={1.5} />
            ) : (
              <Copy className="text-slate-500" size={15} strokeWidth={1.5} />
            )}
          </div>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Phone Number</h1>
          <p className="font-medium">{vendor.data?.data?.phone || 'N/A'}</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Email Address</h1>
          <p className="font-medium">{vendor.data?.data?.email || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}
