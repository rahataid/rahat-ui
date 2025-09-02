import { gql } from 'urql';
export const ProjectDetails = `
  query ProjectDetails {
    tokenBalances {
      id,
      balance
    }
  }
`;

export const TransactionDetails = `
  query MyQuery($contractAddress: String, $to: String, $first: Int, $skip: Int) {
    transfers(where: {to: $contractAddress}) {
      blockNumber
      blockTimestamp
      from
      id
      transactionHash
      value
    }
    transferProcesseds(where: {_to_contains: $to}, first: $first, skip: $skip) {
      blockTimestamp
      transactionHash
      _to
      _amount
      _tokenAddress
      blockNumber
      id
    }
}
`;

export const ReceivedTransactionDetails = `
  query ReceivedTransactionDetails($contractAddress: String) {
    transfers(where: {to: $contractAddress}) {
      value
      blockTimestamp
      from
      transactionHash
    }
  }`;

export const BeneficiaryTransaction = `
  query beneficiaryTransaction($beneficiary: String) {
    tokenReceiveds(where: {from: $beneficiary}) {
      amount
      blockTimestamp
      from
      transactionHash
      token
      id
      blockNumber
    }
    transferProcesseds(
      where: {_to: $beneficiary}
    ) {
      blockTimestamp
      transactionHash
      _to
      _amount
      _tokenAddress
      blockNumber
      id
  }
  }  
`;

export const BeneficiaryTransactionDetails = `
  query BeneficiaryTransactionDetail($beneficiary: String, $contractAddress: String) {
    transfers(where: {to: $beneficiary, from: $contractAddress}) {
      blockNumber
      blockTimestamp
      from
      id
      to
      transactionHash
      value
    }
  }
`;
