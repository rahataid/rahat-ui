export const KenyaProjectTransactions = (first: number, timeStamp: number) => `
query ProjectTransactions{
  walkInBeneficiaryAddeds (first: ${first}, where: { blockTimestamp_lt: ${timeStamp} },  orderBy: blockTimestamp,orderDirection: desc) {
    id,
    beneficiary,
    tokenAddress,
    vendor,
    amount,
    blockNumber,
    blockTimestamp,
    transactionHash,
    eventType
  }
  claimCreateds (first: ${first}, where: { blockTimestamp_lt: ${timeStamp} },  orderBy: blockTimestamp,orderDirection: desc) {
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
  claimProcesseds (first: ${first}, where: { blockTimestamp_lt: ${timeStamp} },  orderBy: blockTimestamp,orderDirection: desc) {
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
  tokensAllocateds (first: ${first}, where: { blockTimestamp_lt: ${timeStamp} },  orderBy: blockTimestamp,orderDirection: desc) {
    amount
    beneficiary
    blockNumber
    blockTimestamp
    id
    token
    transactionHash
    eventType
  }
  offlineClaimProcesseds (first: ${first}, where: { blockTimestamp_lt: ${timeStamp} },  orderBy: blockTimestamp,orderDirection: desc) {
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
    
    otpAddeds (first: ${first}, where: { blockTimestamp_lt: ${timeStamp} },  orderBy: blockTimestamp,orderDirection: desc) {
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

  otpVerifieds (first: ${first}, where: { blockTimestamp_lt: ${timeStamp} },  orderBy: blockTimestamp,orderDirection: desc) {
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

export const SmsVoucherProjectTransactions = (
  first: number,
  timeStamp: number,
) => `
query ProjectTransactions{
  walkInBeneficiaryAddeds(first: ${first}, where: { blockTimestamp_lt: ${timeStamp} },  orderBy: blockTimestamp,orderDirection: desc) {
    id,
    beneficiary,
    tokenAddress,
    vendor,
    amount,
    blockNumber,
    blockTimestamp,
    transactionHash,
    eventType
  }
  
}
`;

export const KenyaVendorTransactions = `
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
  walkInBeneficiaryAddeds(where:{vendor:$vendor}){
    id,
    beneficiary,
    tokenAddress,
    vendor,
    amount,
    blockNumber,
    blockTimestamp,
    transactionHash,
    eventType
  
}
}
`;

export const KenyaBeneficiaryTransactions = `
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

export const KenyaWalkInBeneficiaryTransactions = `
query walkInBeneficiary{
  walkInBeneficiaryAddeds{
    id,
    beneficiary,
    tokenAddress,
    vendor,
    amount,
    blockNumber,
    blockTimestamp,
    transactionHash,
    eventType
  
}
}`;
