import { gql } from "urql";

export const BeneficiaryAssignedToken = gql`query
benTokensAssigneds($beneficiary:String!)
{
   benTokensAssigneds(where: { beneficiary: $beneficiary }) {
        amount
        beneficiary
        blockNumber
        blockTimestamp
        id
        transactionHash
    }
  }
`
