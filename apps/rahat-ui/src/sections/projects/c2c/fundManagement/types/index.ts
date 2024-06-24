export type TokenReceived = {
  __typename: 'TokenReceived';
  from: string;
  amount: string;
  blockTimestamp: string;
  transactionHash: string;
};

export type TransferProcessed = {
  __typename: 'TransferProcessed';
  transactionHash: string;
  _amount: string;
  timestamp: string;
  blockTimestamp: string;
  _beneficiary: string;
};

export type Transaction = TokenReceived | TransferProcessed;

export type TransactionsObject = {
  tokenReceiveds: TokenReceived[];
  transferProcesseds: TransferProcessed[];
};
