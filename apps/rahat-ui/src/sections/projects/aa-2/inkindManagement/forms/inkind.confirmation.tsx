'use client';

import { Button } from 'libs/shadcn/src/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useCreateInkind } from '@rahat-ui/query';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import type { InkindDetailsValues } from '../schemas/inkind.validation';
import { INKIND_TYPE_LABELS } from '../schemas/inkind.validation';
import { TruncatedCell } from '../../stakeholders/component/TruncatedCell';
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';

interface Props {
  formData: InkindDetailsValues;
  onSuccess: () => void;
}

export default function InkindConfirmation({
  formData,
  onSuccess,
}: Props) {
  const tg = useTranslations('AA Project with Gnosis');
  const tglob = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  const { id } = useParams();
  const router = useRouter();
  const projectUUID = id as UUID;
  const createInkind = useCreateInkind(projectUUID);

  const handleSubmit = async () => {
    try {
      await createInkind.mutateAsync({
        name: formData.name,
        description: formData.description,
        type: formData.type,
        quantity: parseInt(formData.quantity ?? '0', 10) || undefined,
      });
      onSuccess();
    } catch {
      // Error handled by the mutation's onError toast
    }
  };

  return (
    <div className="p-2">
      <div className="flex gap-3 mb-3">
        <div className="w-full p-3 rounded-md bg-gray-50">
          <p className="font-semibold text-sm mb-2">{tg('INKIND_DETAILS')}</p>
          <div className="flex flex-col space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">{tg('INKIND_NAME')}</p>
              <TruncatedCell text={formData.name} maxLength={30} className='text-lg font-semibold text-primary'/>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{tglob('DESCRIPTION')}</p>
              <TruncatedCell text={formData.description} maxLength={50} className='text-lg font-semibold text-primary'/>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{tglob('TYPE')}</p>
              <div className="mt-1 w-fit">
                <p className="text-lg font-semibold text-primary">
                  {tglob(formData.type)}
                </p>
              </div>
            </div>
            {formData.quantity && (
              <div>
                <p className="text-sm text-muted-foreground">{tg('QUANTITY')}</p>
                <p className="text-lg font-semibold text-primary">
                  {formatNum(formData.quantity)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push(`/projects/aa/${id}/inkind-management?tab=inkindList`)}
          disabled={createInkind.isPending}
        >
          {tglob('CANCEL')}
        </Button>
        <Button
          className="px-10"
          onClick={handleSubmit}
          disabled={createInkind.isPending}
        >
          {createInkind.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {tg('CREATING')}
            </>
          ) : (
            tg('CREATE_INKIND')
          )}
        </Button>
      </div>
    </div>
  );
}
