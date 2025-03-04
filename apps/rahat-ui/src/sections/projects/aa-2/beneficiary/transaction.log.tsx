import React from 'react';

import { ScrollArea } from '../../../../../libs/shadcn/src/components/ui/scroll-area';
import useCopy from '../../../hooks/useCopy';
import { ArrowRightLeft, Copy, CopyCheck } from 'lucide-react';

const transactions = [
  {
    id: 1,
    type: 'Token Assigned',
    address: '0xb81dA6366ab7dAb06151D55Af059e496F56170d5',
    date: '21 July, 2024',
    amount: '+10 USDC',
  },
  {
    id: 2,
    type: 'Token Assigned',
    address: '1B2yPQrXoEfghGefi3',
    date: '21 July, 2024',
    amount: '+10 USDC',
  },
  {
    id: 3,
    type: 'Token Assigned',
    address: '1C3zPQtYnIjklGefi4',
    date: '21 July, 2024',
    amount: '+10 USDC',
  },
  {
    id: 4,
    type: 'Token Assigned',
    address: '1D4xPQuXmMnopGefi5',
    date: '21 July, 2024',
    amount: '+10 USDC',
  },
  {
    id: 5,
    type: 'Token Assigned',
    address: '1E5yPQvXqRstuGefi6',
    date: '21 July, 2024',
    amount: '+10 USDC',
  },
  {
    id: 6,
    type: 'Token Assigned',
    address: '1F6zPQwXvWxyzGefi7',
    date: '21 July, 2024',
    amount: '+10 USDC',
  },
  {
    id: 7,
    type: 'Token Assigned',
    address: '1G7xPQxXpAbcdGefi8',
    date: '21 July, 2024',
    amount: '+10 USDC',
  },
  {
    id: 8,
    type: 'Token Assigned',
    address: '1H8yPQyXoEfghGefi9',
    date: '21 July, 2024',
    amount: '+10 USDC',
  },
  {
    id: 9,
    type: 'Token Assigned',
    address: '1I9zPQzYnIjklGefiA',
    date: '21 July, 2024',
    amount: '+10 USDC',
  },
];

const TransactionLogs = () => {
  const { clickToCopy, copyAction } = useCopy();
  return (
    <>
      <h2 className="text-xl font-semibold">Transaction Log</h2>
      <p className="text-sm text-muted-foreground">
        List of all token transactions
      </p>
      <ScrollArea className="h-[calc(100vh-500px)] mt-4">
        {transactions.map((txn) => (
          <div
            key={txn.id}
            className="flex items-center justify-between border-b last:border-b-0 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-200 rounded-full">
                <ArrowRightLeft className="text-grey-600 w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {txn.type}
                </p>
                <div className="flex items-center">
                  <p className="text-xs text-muted-foreground truncate w-48 overflow-hidden">
                    {txn.address}
                  </p>
                  <button
                    onClick={() => clickToCopy(txn.address, txn.id)}
                    className="ml-2 text-sm text-gray-500"
                  >
                    {copyAction === txn.id ? (
                      <CopyCheck className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-400">{txn.date}</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-green-600">{txn.amount}</p>
          </div>
        ))}
      </ScrollArea>
    </>
  );
};

export default TransactionLogs;
