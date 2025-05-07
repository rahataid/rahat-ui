import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

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

export const useScbBankTransactions = (
  scbConfig: { baseurl: string; accesstoken: string },
  accountNumber: string,
) => {
  const fetchTransactions = async () => {
    const { baseurl, accesstoken } = scbConfig;

    const response = await axios.get(
      `${baseurl}/webhooks/query?accountNumber=${accountNumber}`,
      {
        headers: {
          access_token: accesstoken,
        },
      },
    );

    return response.data;
  };

  return useQuery<ParsedTransaction[]>({
    queryKey: ['scbTransactions', accountNumber],
    queryFn: async () => {
      const transactions = await fetchTransactions();

      return transactions.data.map(parseTransactionDetails);
    },
    enabled: !!accountNumber,
  });
};
