// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
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
