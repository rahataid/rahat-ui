import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const baseUrl = process.env['NEXT_PUBLIC_SCB_BASE_URL'];
const access_token = process.env['NEXT_PUBLIC_SCB_ACCESS_TOKEN'];

interface SCBTransactionData {
  txnDetails: string;
  txnAmount: string;
  createdAt: string;
  accountNumber: string;
  accountName: string;
}

interface ParsedTransaction {
  txId: string;
  accountNumber: string;
  accountName: string;
  currency: string;
  amount: string;
  date: string;
}

const fetchScbData = async (accountNumber: string) => {
  const response = await axios.get(
    `${baseUrl}/webhooks/query?accountNumber=${accountNumber}`,
    {
      headers: {
        access_token: `${access_token}`,
      },
    },
  );
  return response.data;
};

const parseTransactionDetails = (
  transaction: SCBTransactionData,
): ParsedTransaction => {
  const details = transaction.txnDetails.split(', ');
  const amountParts = transaction.txnAmount.split(', ');
  const accountNumber = transaction.accountNumber;
  const accountName = transaction.accountName;
  const currency = amountParts[0].split(':')[1].trim();
  const amount = amountParts[1].split(':')[1].trim();

  return {
    txId: details[1],
    accountNumber,
    accountName,
    currency,
    amount,
    date: new Date(transaction.createdAt).toLocaleDateString(),
  };
};

export const useScbBankTransactions = (accountNumber: string) => {
  return useQuery({
    queryKey: ['scbTransactions', accountNumber],
    queryFn: async () => {
      const scbData = await fetchScbData(accountNumber);
      const parsedTransactions: ParsedTransaction[] = scbData.data.map(
        (transaction: SCBTransactionData) =>
          parseTransactionDetails(transaction),
      );
      return parsedTransactions;
    },
    enabled: !!accountNumber, // ensures the query only runs if accountNumber is provided
  });
};
