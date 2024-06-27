export const ProjectDetails = `
  query ProjectDetails {
    tokenBalances {
      id,
      balance
    }
  }
`;

export const TransactionLists = `
  query TransactionLists {
  transfers {
    transactionHash
    value
    id
    from
    blockTimestamp
    blockNumber
    to
  }
}
`;

export const ClaimAssigneds = `
query ClaimAssignedQuery($beneficiary: String) {
  claimAssigneds(
    where: {beneficiary: $beneficiary}  
  ) {
    amount
    beneficiary
    blockNumber
    blockTimestamp
    id
    transactionHash
  }
}
`;
