import { gql } from 'urql';

export const TransactionDetails = gql`
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
