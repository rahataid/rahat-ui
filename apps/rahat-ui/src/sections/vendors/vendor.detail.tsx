import React from 'react';
import { Copy, CopyCheck, Trash2 } from 'lucide-react';
import HeaderWithBack from '../projects/components/header.with.back';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
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
import { useTranslations } from 'next-intl';

export default function VendorDetail() {
  const t = useTranslations('Vendors – Detail');
  const g = useTranslations('GLOBAL');
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
      return toast.warning(t('ASSIGNED_VENDOR_CANNOT_BE_DELETED'));
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
          <AlertDialogTitle>{g('ARE_YOU_ABSOLUTELY_SURE')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('THIS_ACTION_CANNOT_BE_UNDONE')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{g('CANCEL')}</AlertDialogCancel>
          <AlertDialogAction onClick={handleContinueClick}>
            {g('CONTINUE')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <HeaderWithBack
          title={t('VENDOR_DETAILS')}
          subtitle={t('HERE_IS_A_DETAILED_VIEW_OF')}
          path="/vendors"
        />
        <div className="flex space-x-2">
          <AlertDialog>
            <AlertDialogTrigger className="flex items-center">
              <Button
                variant="secondary"
                className="text-red-500 bg-red-100"
                disabled={isVendorAssigned}
              >
                <Trash2 className="mr-1" size={18} strokeWidth={1.5} />
                {g('DELETE')}
              </Button>
            </AlertDialogTrigger>
            {renderAlertContent({ handleContinueClick: deleteVendor })}
          </AlertDialog>
        </div>
      </div>
      <div className="p-5 rounded-md shadow border grid grid-cols-4 gap-5">
        <div>
          <h1 className="text-md text-muted-foreground">{t('VENDOR_NAME')}</h1>
          <p className="font-medium">{vendor?.name || g('N_A')}</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">{g('GENDER')}</h1>
          <p className="font-medium">{vendor?.gender || g('N_A')}</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">{g('PROJECT_NAME')}</h1>
          {vendor?.projects?.length ? (
            <div className="flex gap-2 flex-wrap">
              {vendor?.projects?.map((project: any) => {
                return (
                  <p key={project?.id} className="font-medium">
                    {project?.name}
                  </p>
                );
              })}
            </div>
          ) : (
            <p className="font-medium">{g('N_A')}</p>
          )}
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">{g('WALLET_ADDRESS')}</h1>
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => clickToCopy(vendor?.wallet)}
          >
            <p className="text-muted-foreground text-base truncate w-48">
              {vendor?.wallet}
            </p>

            {walletAddressCopied === vendor?.wallet ? (
              <CopyCheck size={15} strokeWidth={1.5} />
            ) : (
              <Copy className="text-slate-500" size={15} strokeWidth={1.5} />
            )}
          </div>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">{g('PHONE_NUMBER')}</h1>
          <p className="font-medium">{vendor?.phone || g('N_A')}</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">{g('EMAIL_ADDRESS')}</h1>
          <p className="font-medium">{vendor?.email || g('N_A')}</p>
        </div>
      </div>
    </div>
  );
}
