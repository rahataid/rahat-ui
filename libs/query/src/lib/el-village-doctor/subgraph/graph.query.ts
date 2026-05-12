export const CambodiaProjectTransactions = `
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

export const CambodiaVendorTransactions = `
query VendorTransactions($vendor:String!) {
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

export const VillageDoctorVendorTransactions = `
query VendorTransactions($vendor: String!) {
  claimCreateds(
    first: 1000
    orderBy: blockTimestamp
    orderDirection: desc
    where: { claimer: $vendor }
  ) {
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
  claimProcesseds(
    first: 1000
    orderBy: blockTimestamp
    orderDirection: desc
    where: { claimer: $vendor }
  ) {
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
  tokensAllocateds(
    first: 1000
    orderBy: blockTimestamp
    orderDirection: desc
    where: { beneficiary: $vendor }
  ) {
    amount
    beneficiary
    blockNumber
    blockTimestamp
    id
    token
    transactionHash
    eventType
  }
  claimDetails(
    first: 1000
    orderBy: blockTimestamp
    orderDirection: desc
    where: { vendorAddress: $vendor }
  ) {
    id
    beneficiary
    vendorAddress
    tokenAddress
    amount
    blockNumber
    blockTimestamp
    transactionHash
    isProcessed
  }
  otpVerifieds(
    first: 1000
    orderBy: blockTimestamp
    orderDirection: desc
    where: { vendor: $vendor }
  ) {
    id
    beneficiary
    vendor
    tokenAddress
    amount
    blockNumber
    blockTimestamp
    transactionHash
    eventType
  }
  offlineClaimProcesseds(
    first: 1000
    orderBy: blockTimestamp
    orderDirection: desc
    where: { vendor: $vendor }
  ) {
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

export const CambodiaBeneficiaryTransactions = `
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
  claimProcesseds(where:{beneficiary:$beneficiaryAddress}) {
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
