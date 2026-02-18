import { AlertCircle, Check, Info, Package } from 'lucide-react';

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
      <div className="mt-4 text-center max-w-32">
        <p className="font-medium text-sm text-gray-900 mb-2">{name}</p>

        {/* Stock Display */}
        <div className="space-y-1">
          {name === 'Beneficiary' ? (
            <>
              <div className="text-xs text-gray-600">
                <p>
                  Received Stocks:{' '}
                  <span className="font-medium text-gray-900">
                    Rs. {received.toLocaleString()}
                  </span>
                </p>
              </div>
            </>
          ) : (
            <div className="text-xs text-gray-600">
              <p>
                Stock:{' '}
                <span className="font-medium text-gray-900">
                  {received.toLocaleString()}
                </span>
              </p>
              <p>
                Remaining Stocks:{' '}
                <span className="font-medium text-gray-900">
                  {balance.toLocaleString()}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className="mt-2 text-xs text-blue-400">
          {formatDate(new Date())}
        </div>
      </div>
    </div>
  );
}
export default InKindStakeholderNode;
