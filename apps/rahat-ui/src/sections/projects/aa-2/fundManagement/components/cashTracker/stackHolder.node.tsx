import { AlertCircle, Check, Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';
import { useDateFormat } from 'apps/rahat-ui/src/utils/useDateFormat';

function StakeholderNode({
  name,
  status,
  balance,
  received,
  date,
  sent,
  index,
  isFirst,
}: {
  name: string;
  status: string;
  balance: number;
  received: number;
  sent: number;
  date: Date;
  index?: number;
  isFirst?: boolean;
}) {
  const t = useTranslations('AA Project');
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
      <div className="mt-4 text-center ">
        <p className="font-medium text-sm text-gray-900 mb-2">{name}</p>

        {/* Amount Display */}
        <div className="space-y-1 text-xs">
          {isFirst ? (
            <div className="text-xs text-gray-600">
              <p>
                {t('PROJECT_BUDGET_LABEL')}{' '}
                <span className="font-medium text-gray-900">
                  Rs. {formatNum(Number(balance + sent))}
                </span>
              </p>
              <p>
{t('REMAINING_BALANCE_LABEL')}{' '}
                  <span className="font-medium text-gray-900">Rs. {formatNum(balance)}</span>
              </p>
            </div>
          ) : name === 'Beneficiary' ? (
            <>
              <div className="text-xs text-gray-600">
                <p>
                  {t('CLAIMED')}{' '}
                  <span className="font-medium text-gray-900">
                    Rs. {formatNum(received ?? 0)}
                  </span>
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="text-xs text-gray-600">
                <p>
                  {t('RECEIVED_BALANCE')}{' '}
                  <span className="font-medium text-gray-900">
                    Rs. {formatNum(received ?? 0)}
                  </span>
                </p>
                <p>
{t('REMAINING_BALANCE_LABEL')}{' '}
                  <span className="font-medium text-gray-900">
                    Rs. {formatNum(balance ?? 0)}
                  </span>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Timestamp */}
        {(sent !== 0 || balance !== 0 || received !== 0) && (
          <div className="mt-2 text-xs text-gray-500">
            {formatDate(date, 'dd MMMM, yyyy')}
          </div>
        )}
      </div>
    </div>
  );
}
export default StakeholderNode;
