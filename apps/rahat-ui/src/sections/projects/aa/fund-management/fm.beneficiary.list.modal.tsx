import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Eye } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';

export function BeneficiaryList({ beneficiaryData }: any) {
  const t = useTranslations('AA_PROJECT');
  const formatNum = useNumberFormat();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Eye
          className="text-primary-forground cursor-pointer"
          size={20}
          strokeWidth={1.5}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="mb-6">
          <DialogTitle>{t('BENEFICIARY_LIST')}</DialogTitle>
          <DialogDescription>
            {t('BENEFICIARIES_ASSIGNED_UNDER_THIS_GROUP', {
              count: formatNum(beneficiaryData?.length ?? 0),
            })}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-72">
          {beneficiaryData?.map((d: any) => {
            return (
              <>
                <div
                  className="flex items-center justify-normal gap-6 p-2 max-w-md bg-card
            rounded-lg shadow mb-2"
                >
                  <Image
                    className="rounded-full"
                    src={'/profile.png'}
                    height={20}
                    width={20}
                    alt="profile pic"
                  />
                  <p className="text-magenta">{d?.Beneficiary?.pii?.name}</p>
                </div>
              </>
            );
          })}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
