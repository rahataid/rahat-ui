import { AlertCircle, Check, Info } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

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
                  Rs. {Number(balance + sent).toFixed(2)}
                </span>
              </p>
              <p>
                {t('REMAINING_BALANCE_LABEL')}{' '}
                <span className="font-medium text-gray-900">Rs. {balance}</span>
              </p>
            </div>
          ) : name === 'Beneficiary' ? (
            <>
              <div className="text-xs text-gray-600">
                <p>
                  {t('CLAIMED')}{' '}
                  <span className="font-medium text-gray-900">
                    Rs. {received?.toLocaleString()}
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
                    Rs. {received?.toLocaleString()}
                  </span>
                </p>
                <p>
{t('REMAINING_BALANCE_LABEL')}{' '}
                  <span className="font-medium text-gray-900">
                    Rs. {balance?.toLocaleString()}
                  </span>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Timestamp */}
        {(sent !== 0 || balance !== 0 || received !== 0) && (
          <div className="mt-2 text-xs text-gray-500">
            {formatDate(new Date(date))}
          </div>
        )}
      </div>
    </div>
  );
}
export default StakeholderNode;
