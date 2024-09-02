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
    eventType
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
    eventType
  }
  tokensAllocateds {
    amount
    beneficiary
    blockNumber
    blockTimestamp
    id
    token
    transactionHash
    eventType
  }
  offlineClaimProcesseds{
    id
    amount
    beneficiary
    vendor
    tokenAddress
    blockNumber
    blockTimestamp
    transactionHash
    eventType
  }

  otpAddeds{
  id
  beneficiary
  tokenAddress
  amount
  otpHash
  blockNumber
  blockTimestamp
  transactionHash
  eventType
  }

  otpVerifieds{
    id
    amount
    beneficiary
    tokenAddress
    blockNumber
    blockTimestamp
    transactionHash
    eventType
  }
}
`;

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
    eventType
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
    eventType
  }
  offlineClaimProcesseds(where:{vendor:$vendor}){
    id
    amount
    beneficiary
    vendor
    tokenAddress
    blockNumber
    blockTimestamp
    transactionHash
    eventType
    }
}
`;

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
    eventType
  }
  claimCreateds (where:{claimee:$beneficiaryAddress}){
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
    eventType
   }
  otpAddeds(where:{beneficiary:$beneficiaryAddress}){
    id
    beneficiary
    tokenAddress
    amount
    otpHash
    blockNumber
    blockTimestamp
    transactionHash
    eventType
  }
}
`;

export const TreasuryTokenTransactions = `
query MyQuery {
  transfers {
    transactionHash
    value
    to
    id
    from
    blockNumber
    blockTimestamp
  }
}
`;
