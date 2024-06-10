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
  query MyQuery {
  tokenReceiveds {
    id
    from
    amount
    blockTimestamp
    transactionHash
    token
    blockNumber
  }
  transferProcesseds {
    blockTimestamp
    transactionHash
    _beneficiary
    _amount
    _tokenAddress
    blockNumber
    id
  }
}
`;

export const ReceivedTransactionDetails = `
  query ReceivedTransactionDetails {
    tokenReceiveds {
      amount
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
    where: {_beneficiary: $beneficiary}
  ) {
    blockTimestamp
    transactionHash
    _beneficiary
    _amount
    _tokenAddress
    blockNumber
    id
  }
  }  
`;
