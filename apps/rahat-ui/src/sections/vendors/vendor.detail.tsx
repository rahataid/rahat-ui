import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';
import React from 'react';
import { Copy, CopyCheck, FolderPlus, Pencil, Trash2 } from 'lucide-react';
import HeaderWithBack from '../projects/components/header.with.back';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import CoreBtnComponent from '../../components/core.btn';
import { useGetVendor, useRemoveVendor } from '@rahat-ui/query';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { toast } from 'react-toastify';

export default function VendorDetail() {
  const { id } = useParams() as { id: UUID };
  const router = useRouter();
  const { data: vendorDetail, isLoading } = useGetVendor(id);
  const vendor = React.useMemo(() => vendorDetail?.data, [vendorDetail]);
  const isVendorAssigned = React.useMemo(
    () => vendor?.projects?.length,
    [vendor],
  );
  const removeVendor = useRemoveVendor();
  const [walletAddressCopied, setWalletAddressCopied] =
    React.useState<string>();

  const clickToCopy = (walletAddress: string) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(walletAddress);
  };

  const deleteVendor = async () => {
    if (isVendorAssigned)
      return toast.warning('Assigned vendor cannot be deleted.');
    await removeVendor.mutateAsync({ vendorId: id });
    router.push('/vendors');
  };

  const renderAlertContent = ({
    handleContinueClick,
  }: {
    handleContinueClick: () => void;
  }) => {
    return (
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleContinueClick}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    );
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
          {/* <CoreBtnComponent
            className="text-primary bg-sky-50"
            name="Assign to Project"
            Icon={FolderPlus}
            handleClick={() => { }}
          /> */}
          <CoreBtnComponent
            name="Edit"
            Icon={Pencil}
            handleClick={() => router.push(`/vendors/${id}/edit`)}
          />
          <AlertDialog>
            <AlertDialogTrigger className="flex items-center">
              <Button
                variant="secondary"
                className="text-red-500 bg-red-100"
                disabled={isVendorAssigned}
              >
                <Trash2 className="mr-1" size={18} strokeWidth={1.5} />
                Delete
              </Button>
            </AlertDialogTrigger>
            {renderAlertContent({ handleContinueClick: deleteVendor })}
          </AlertDialog>
        </div>
      </div>
      <div className="p-5 rounded-md shadow border grid grid-cols-4 gap-5">
        <div>
          <h1 className="text-md text-muted-foreground">Vendor Name</h1>
          <p className="font-medium">{vendor?.name || 'N/A'}</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Gender</h1>
          <p className="font-medium">{vendor?.gender || 'N/A'}</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Project Name</h1>
          {vendor?.projects?.length ? (
            <div className="flex gap-2 flex-wrap">
              {vendor?.projects?.map((project: any) => {
                return <p className="font-medium">{project?.name}</p>;
              })}
            </div>
          ) : (
            <p className="font-medium">N/A</p>
          )}
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Wallet Address</h1>
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => clickToCopy(vendor?.wallet)}
          >
            <p>{truncateEthAddress(vendor?.wallet)}</p>

            {walletAddressCopied === vendor?.wallet ? (
              <CopyCheck size={15} strokeWidth={1.5} />
            ) : (
              <Copy className="text-slate-500" size={15} strokeWidth={1.5} />
            )}
          </div>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Phone Number</h1>
          <p className="font-medium">{vendor?.phone || 'N/A'}</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Email Address</h1>
          <p className="font-medium">{vendor?.email || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}
