import { ArrowRightLeft, Copy, CopyCheck } from 'lucide-react';

interface TransactionLogItemProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  txHash?: string;
  amount?: string | number;
  date?: string;
  time?: string;
  onCopy?: () => void;
  isCopied?: boolean;
  txUrl?: string;
}

export const TransactionLogItem = ({
  title,
  subtitle,
  txHash,
  amount,
  date,
  time,
  onCopy,
  isCopied,
  txUrl,
}: TransactionLogItemProps) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-gray-200 rounded-full">
        <ArrowRightLeft className="text-grey-600 w-5 h-5" />
      </div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        {txHash && (
          <div className="flex items-center">
            <a
              href={txUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base text-blue-500 hover:underline cursor-pointer"
            >
              <p className="text-sm truncate w-48 overflow-hidden">{txHash}</p>
            </a>
            <button onClick={onCopy} className="ml-2 text-sm text-gray-500">
              {isCopied ? (
                <CopyCheck className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
    <div>
      {amount !== undefined && (
        <p className="text-sm text-end font-semibold text-green-600">
          {amount}
        </p>
      )}
      {date && <p className="text-sm text-end text-gray-400">{date}</p>}
      {time && <p className="text-sm text-end text-gray-400">{time}</p>}
    </div>
  </div>
);
