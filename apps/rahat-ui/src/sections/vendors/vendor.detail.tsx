import { truncateEthAddress } from '@rumsan/sdk/utils';
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
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import TableLoader from '../../components/table.loader';

export default function VendorDetail() {
  const { id } = useParams() as { id: UUID };
  const router = useRouter();
  const { data: vendorDetail, isFetching } = useGetVendor(id);

  const vendor = React.useMemo(() => {
    const data = vendorDetail?.data;
    if (!data) return null;

    const isProjectVendorList = Array.isArray(data);
    const ref = isProjectVendorList ? data[0]?.User : data;
    const projects = isProjectVendorList
      ? data.map((v: any) => ({ id: v.Project.uuid, name: v.Project.name }))
      : undefined;

    return {
      name: ref?.name,
      gender: ref?.gender,
      email: ref?.email,
      phone: ref?.phone,
      wallet: ref?.wallet,
      projects,
    };
  }, [vendorDetail]);

  const isVendorAssigned = vendor?.projects?.length;
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

  return isFetching ? (
    <TableLoader />
  ) : (
    <div className="p-4">
      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
        <HeaderWithBack
          title="Vendor Details"
          subtitle="Here is a detailed view of the selected vendor"
          path="/vendors"
        />
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
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
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteVendor}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-5 rounded-md shadow border grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        <DetailItem title="Vendor Name" content={vendor?.name} />
        <DetailItem title="Gender" content={vendor?.gender} />
        <DetailItem
          title="Project Name"
          content={
            vendor?.projects?.length ? (
              <div className="flex gap-2 flex-wrap">
                {vendor.projects.map((project: any) => (
                  <Badge key={project.id}>{project?.name}</Badge>
                ))}
              </div>
            ) : (
              'N/A'
            )
          }
        />
        <DetailItem
          title="Wallet Address"
          content={
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
          }
        />
        <DetailItem title="Phone Number" content={vendor?.phone} />
        <DetailItem title="Email Address" content={vendor?.email} />
      </div>
    </div>
  );
}

// Reusable Detail Item Component
const DetailItem = ({
  title,
  content,
}: {
  title: string;
  content?: React.ReactNode;
}) => (
  <div>
    <h1 className="text-md text-muted-foreground">{title}</h1>
    <p className="font-medium">{content || 'N/A'}</p>
  </div>
);
