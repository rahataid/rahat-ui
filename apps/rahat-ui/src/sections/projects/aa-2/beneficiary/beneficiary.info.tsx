import { useMemo } from 'react';
import { Copy, CopyCheck, User } from 'lucide-react';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { DataItem } from 'apps/rahat-ui/src/common';
import { useInkindDetails, useTokenDetails } from '@rahat-ui/query';
import { useTranslations } from 'next-intl';
import { useNumberFormat, useLabelDigits } from 'apps/rahat-ui/src/utils/useNumberFormat';
import { usePhoneFormat } from 'apps/rahat-ui/src/utils/usePhoneFormat';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import InkindDetails from './beneficiary.inkind.details';

type IProps = {
  beneficiary: any;
};
interface InKindItem {
  inkindName: string;
  availableAmount: number;
  assignedAmount?: number;
  inkindType: string;
  redeemedAmount: number;
  status: string;
}
const BeneficiaryInfo = ({ beneficiary }: IProps) => {
  const params = useParams();
  const projectId = params.id as UUID;
  const beneficiaryId = params.uuid as UUID;
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  const formatDigits = useLabelDigits();
  const formatPhone = usePhoneFormat();
  const { clickToCopy, copyAction } = useCopy();

  const { data: tokenData, isPending } = useTokenDetails({
    projectUUID: projectId,
    beneficiaryUUID: beneficiaryId,
  });

  const { data: inKindData, isPending: isInKindPending } = useInkindDetails({
    projectUUID: projectId,
    beneficiaryUUID: beneficiaryId,
  });

  const filteredInkinds = useMemo(
    () =>
      (inKindData?.inkinds || []).filter(
        (item: InKindItem) =>
          item.inkindType === 'PRE_DEFINED' ||
          (item.inkindType === 'WALK_IN' && item.redeemedAmount > 0),
      ),
    [inKindData?.inkinds],
  );

  const hasTokenData = !!(tokenData?.assignedToken || tokenData?.redemmedToken);
  const showBorder = filteredInkinds.length > 0;

  const formatEnumValue = (value?: string) =>
    (value && tg.has(value.toUpperCase() as any)
      ? tg(value.toUpperCase() as any)
      : value) ?? '';

  return (
    <>
      <div className="flex items-center">
        <div className="h-24 w-24 rounded-md bg-gray-700 flex justify-center items-center">
          <User color="white" />
        </div>

        <div className="flex flex-col ml-6">
          <div className="flex items-center">
            <div className="text-lg text-muted-foreground truncate w-48 overflow-hidden mr-2">
              {beneficiary?.walletAddress || tg('N_A')}
            </div>
            <button
              onClick={() => clickToCopy(beneficiary?.walletAddress || '', 1)}
              className="ml-2 text-sm text-gray-500"
            >
              {copyAction === 1 ? <CopyCheck /> : <Copy />}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 py-4">
        <DataItem
          label={tg('ESTIMATED_AGE')}
          value={
            beneficiary?.projectData?.age
              ? formatNum(beneficiary.projectData.age)
              : tg('N_A')
          }
        />
        <DataItem
          label={tg('GENDER')}
          value={formatEnumValue(beneficiary?.projectData?.gender) || tg('N_A')}
        />
        <DataItem
          label={tg('PHONE_NUMBER')}
          value={formatPhone(beneficiary?.extras?.phone) || tg('N_A')}
        />
        <div>
          <h1 className="text-lg text-black">{tg('ADDRESS')}</h1>
          <div className=" text-sm text-muted-foreground font-medium flex gap-1 capitalize">
            <p>{beneficiary?.projectData?.location || ''}</p>
            {beneficiary?.extras?.ward_no && (
              <p>{t('WARD')} {t('NO')} - {formatDigits(beneficiary.extras.ward_no)}</p>
            )}
            <p>
              {!beneficiary?.extras?.location &&
                !beneficiary?.projectData?.location &&
                !beneficiary?.extras?.ward_no &&
                tg('N_A')}
            </p>
          </div>
        </div>
        <DataItem
          label={tg('BANKING_STATUS')}
          value={formatEnumValue(beneficiary?.projectData?.bankedStatus)}
          isBadge
        />
        <DataItem
          label={t('PHONE_TYPE')}
          value={formatEnumValue(beneficiary?.projectData?.phoneStatus)}
          isBadge
        />
        <DataItem
          label={t('INTERNET_TYPE')}
          value={formatEnumValue(beneficiary?.projectData?.internetStatus)}
          isBadge
        />
      </div>
      <div
        className={`p-4 w-full max-w-2xl bg-white ${
          showBorder ? 'border rounded-xl shadow-sm' : ''
        }`}
      >
        {/* Title */}
        {isPending ? (
          <>
            <div className="animate-pulse flex gap-4 mb-6">
              <div className="flex-1 bg-gray-200 rounded-xl p-4 text-center">
                <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto"></div>
              </div>

              <div className="flex-1 bg-gray-200 rounded-xl p-4 text-center">
                <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto"></div>
              </div>
            </div>
            <div className="flex-1 bg-gray-200 rounded-xl p-4 text-center">
              <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto"></div>
            </div>
          </>
        ) : hasTokenData ? (
          <div className="flex gap-4 mb-6">
            <div className="flex-1 bg-gray-100 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-500">{t('ASSIGNED')}</p>
              <h3 className="text-xl font-bold">
                {formatNum(tokenData?.assignedToken)} {t('TOKENS')}
              </h3>
              <p className="text-gray-600">{t('CURRENCY_NPR')} {formatNum(tokenData?.assignedToken)}</p>
            </div>
            <div className="flex-1 bg-gray-100 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-500">{t('REDEEMED')}</p>
              <h3 className="text-xl font-bold">
                {formatNum(tokenData?.redemmedToken)} {t('TOKENS')}
              </h3>
              <p className="text-gray-600">{t('CURRENCY_NPR')} {formatNum(tokenData?.redemmedToken)}</p>
            </div>
          </div>
        ) : null}

        {filteredInkinds.length > 0 && (
          <InkindDetails filteredInkinds={filteredInkinds} />
        )}
      </div>
    </>
  );
};

export default BeneficiaryInfo;
