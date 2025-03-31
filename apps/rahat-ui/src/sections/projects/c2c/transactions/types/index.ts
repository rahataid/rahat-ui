export type Transfers = {
  id: string;
  __typename: 'TokenReceived';
  from: string;
  value: string;
  blockTimestamp: string;
  transactionHash: string;
  token: string;
  blockNumber: string;
};

export type TransferProcessed = {
  id: string;
  __typename: 'TransferProcessed';
  transactionHash: string;
  _amount: string;
  timestamp: string;
  blockTimestamp: string;
  _to: string;
  _from: string;
  _tokenAddress: string;
  blockNumber: string;
};

export type MergeTransactions = Transfers | TransferProcessed;

export type Transaction = {
  id: string;
  topic: string;
  transactionHash: string;
  amount: string;
  timestamp: string;
  blockTimestamp: string;
  to: string;
};

export type TransactionsObject = {
  transfers: Transfers[];
  transferProcesseds: TransferProcessed[];
};
