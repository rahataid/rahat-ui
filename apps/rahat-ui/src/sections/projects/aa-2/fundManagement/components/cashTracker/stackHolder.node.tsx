import { AlertCircle, Check, Info } from 'lucide-react';

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
          status === 'confirmed' || isFirst
            ? 'bg-green-500 text-white'
            : status === 'pending'
            ? 'bg-amber-500 text-white'
            : 'bg-red-500 text-white'
        }`}
      >
        {status === 'confirmed' || isFirst ? (
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
                Project Budget:{' '}
                <span className="font-medium text-gray-900">
                  Rs. {Number(balance + sent).toFixed(2)}
                </span>
              </p>
              <p>
                Remaining Balance:{' '}
                <span className="font-medium text-gray-900">Rs. {balance}</span>
              </p>
            </div>
          ) : name === 'Beneficiary' ? (
            <>
              <div className="text-xs text-gray-600">
                <p>
                  Claimed:{' '}
                  <span className="font-medium text-gray-900">
                    Rs. {received.toLocaleString()}
                  </span>
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="text-xs text-gray-600">
                <p>
                  Received Balance:{' '}
                  <span className="font-medium text-gray-900">
                    Rs. {received.toLocaleString()}
                  </span>
                </p>
                <p>
                  Remaining Balance:{' '}
                  <span className="font-medium text-gray-900">
                    Rs. {balance.toLocaleString()}
                  </span>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Timestamp */}
        <div className="mt-2 text-xs text-gray-500">
          {formatDate(new Date(date))}
        </div>
      </div>
    </div>
  );
}
export default StakeholderNode;
