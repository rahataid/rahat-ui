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


export const GetTotalFundDistributed = gql`query MyQuery {
  benTokensAssigneds(first: 1000) {
    amount
  }
}
`
