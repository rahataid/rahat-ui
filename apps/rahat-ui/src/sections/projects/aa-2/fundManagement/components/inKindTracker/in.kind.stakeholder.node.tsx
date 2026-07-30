import { AlertCircle, Check, Info, Package } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';
import { useDateFormat } from 'apps/rahat-ui/src/utils/useDateFormat';

function InKindStakeholderNode({
  name,
  status,
  balance,
  received,
  index,
  isFirst,
}: {
  name: string;
  status: string;
  balance: number;
  received: number;
  index?: number;
  isFirst?: boolean;
}) {
  const t = useTranslations('AA_PROJECT_WITH_GNOSIS');
  const formatNum = useNumberFormat();
  const formatDate = useDateFormat();

  return (
    <div className="flex flex-col items-center">
      {/* Status Circle */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center z-10 
        ${
          status === 'confirmed'
            ? 'bg-green-500 text-white'
            : status === 'pending'
            ? 'bg-amber-500 text-white'
            : 'bg-red-500 text-white'
        }`}
      >
        {status === 'confirmed' ? (
          <Check size={16} />
        ) : status === 'pending' ? (
          <Info size={16} />
        ) : (
          <AlertCircle size={16} />
        )}
      </div>

      {/* Content */}
      <div className="mt-4 text-center max-w-32">
        <p className="font-medium text-sm text-gray-900 mb-2">{name}</p>

        {/* Stock Display */}
        <div className="space-y-1">
          {name === 'Beneficiary' ? (
            <>
              <div className="text-xs text-gray-600">
                <p>
                  {t('RECEIVED_STOCKS')}{' '}
                  <span className="font-medium text-gray-900">
                    Rs. {formatNum(received)}
                  </span>
                </p>
              </div>
            </>
          ) : (
            <div className="text-xs text-gray-600">
              <p>
                {t('STOCK_LABEL')}{' '}
                <span className="font-medium text-gray-900">
                  {formatNum(received)}
                </span>
              </p>
              <p>
                {t('REMAINING_STOCK')}:{' '}
                <span className="font-medium text-gray-900">
                  {formatNum(balance)}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className="mt-2 text-xs text-blue-400">
          {formatDate(new Date(), 'dd MMMM, yyyy')}
        </div>
      </div>
    </div>
  );
}
export default InKindStakeholderNode;
