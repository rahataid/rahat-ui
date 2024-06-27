export const ProjectDetails = `
  query ProjectDetails {
    tokenBalances {
      id,
      balance
    }
  }
`;

export const ProjectTransactions = `
query ProjectTransactions{
   claimCreateds {
    amount
    blockNumber
    blockTimestamp
    claimId
    claimee
    claimer
    id
    otpServer
    token
    transactionHash
   }
  claimProcesseds {
    amount
    beneficiary
    blockNumber
    blockTimestamp
    claimer
    id
    token
    transactionHash
  }

  tokensAllocateds {
    amount
    beneficiary
    blockNumber
    blockTimestamp
    id
    token
    transactionHash
  }
}
`

export const VendorTransactions = `
query VendorTransactions($vendor:String!) {
  claimCreateds (where:{claimer:$vendor}){
    amount
    blockNumber
    blockTimestamp
    claimId
    claimee
    claimer
    id
    otpServer
    token
    transactionHash
   }
  claimProcesseds(where:{claimer:$vendor}) {
    amount
    beneficiary
    blockNumber
    blockTimestamp
    claimer
    id
    token
    transactionHash
  }
}
`

export const BeneficiaryTransactions = `
query beneficiaryTransactions($beneficiaryAddress:String!){

tokensAllocateds(where:{beneficiary: $beneficiaryAddress} ) {
    amount
    beneficiary
    blockNumber
    blockTimestamp
    id
    token
    transactionHash
  }
}

`
