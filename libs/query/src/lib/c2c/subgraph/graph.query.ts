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
      amount
      blockTimestamp
      from
      transactionHash
    }

    transferProcesseds {
      blockTimestamp
      transactionHash
      _beneficiary
      _amount
    }
  }
`;
