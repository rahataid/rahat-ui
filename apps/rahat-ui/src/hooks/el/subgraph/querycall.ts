import { GraphQuery } from '@rahataid/el-subgraph';
import { formatDate } from '../../../utils';

const formatTransaction = (trans: any) => ({
  beneficiary: trans.beneficiary || trans.referrerBeneficiaries,
  vendor:trans.vendor || '',
  processedBy: trans.beneficiary || trans.vendor || trans.referrerVendor || trans.claimer || trans.beneficiaryAddress,
  topic: trans.eventType,
  timestamp: formatDate(trans.blockTimestamp),
  txHash: trans.transactionHash,
  amount: '', 
  voucherId: trans.tokenAddress || trans.token || '',
  id: trans.transactionHash
});

const mapTransactions = (transactions: any[]) => transactions.map(formatTransaction);



export const getBeneficiaryTransaction = async (address: string,queryService:GraphQuery) => {
  // const { queryService } = useGraphService();
  const res = await queryService.useBeneficiaryTransaction(address);

  const claimedAssigned = res?.claimAssigneds || [];
  const claimProcessed = res?.projectClaimProcesseds || [];
  const beneficiaryReferred = res?.beneficiaryReferreds || [];
  const data = mapTransactions(claimedAssigned.concat(claimProcessed, beneficiaryReferred));

  return { data, error: res?.error };
};

export const getProjectTransaction = async (queryService:GraphQuery) => {
  const res = await queryService.useProjectTransaction();

  const transactionTypes = ['claimAssigneds', 'projectClaimProcesseds', 'beneficiaryReferreds', 'beneficiaryAddeds', 'claimCreateds', 'tokenBudgetIncreases'];
  // const data = mapTransactions(transactionTypes.reduce((acc, type) => acc.concat(res?.data[type] || []), []));
  // console.log(data)
  const data = transactionTypes.reduce((acc, type) => {
    const transactions = res?.data[type] || [];
    return acc.concat(transactions.map(formatTransaction));
  }, []);
  console.log(data)
  return  data
};

export const getProjectVoucher = async (projectAddress: string,queryService:GraphQuery) => {
  const voucherRes = await queryService?.useProjectVoucher(projectAddress);
  return voucherRes;
};

export const getBeneficiaryVoucher = async (beneficiaryAddress: string,queryService:GraphQuery) => {
  // const { queryService } = useGraphService();
  const voucherRes = await queryService.useBeneficiaryVoucher(beneficiaryAddress);
  return voucherRes;
};



// export const getBeneficiaryTransaction = async (address:string,queryService:GraphQuery)=>{
//     // const {queryService} = useGraphService();
//     const res = await queryService.useBeneficiaryTransaction(address);

//     const claimedAssigned = res?.claimAssigneds
//     const claimProcessed = res?.projectClaimProcesseds;
//     const beneficiaryReferred = res?.beneficiaryReferreds;
//     const data:any =[]
    
//     claimedAssigned.map((trans)=>{
//      data.push({
//        processedBy:trans.beneficiary,
//        topic:trans.eventType,
//        timeStamp:formatDate(trans.blockTimestamp),
//        transactionHash:trans.transactionHash,
//        amount:''
//      })
//      // const claimRes = queryService?.useClaimAssigned(trans.id);
//    })
//    claimProcessed.map((trans)=>{
//      data.push({
//        processedBy:trans.vendor,
//        topic:trans.eventType,
//        timeStamp:formatDate(trans.blockTimestamp),
//        transactionHash:trans.transactionHash,
//        amount:''

//      })
//    })
//    beneficiaryReferred.map((trans)=>{
//      data.push({
//        processedBy:trans.referrerVendor,
//        topic:trans.eventType,
//        timeStamp:formatDate(trans.blockTimestamp),
//        transactionHash:trans.transactionHash

//      })
//    })
//     return data  


// }

// export const getProjectTransaction = async(queryService:GraphQuery)=>{
//     // const {queryService} = useGraphService();
//     const res = await queryService.useProjectTransaction();
    
//     const claimedAssigned = res?.data?.claimAssigneds
//     const claimProcessed = res?.data?.projectClaimProcesseds;
//     const beneficiaryReferred = res?.data?.beneficiaryReferreds;
//     const beneficiaryAdded = res?.data?.beneficiaryAddeds;
//     const claimCreated = res?.data?.claimCreateds;
//     const tokenBudgetIncrease = res?.data?.tokenBudgetIncreases
//     const data =[]
        
//     claimedAssigned.map((trans)=>{
//     data.push({
//         beneficiary:trans.beneficiary,
//         topic:trans.eventType,
//         timestamp:formatDate(trans.blockTimestamp),
//         txHash:trans.transactionHash,
//         voucherId:trans.tokenAddress
//          })
//          // const claimRes = queryService?.useClaimAssigned(trans.id);
//        })
//        claimProcessed.map((trans)=>{
//          data.push({
//            beneficiary:trans.beneficiary,
//            topic:trans.eventType,
//            timestamp:formatDate(trans.blockTimestamp),
//            txHash:trans.transactionHash,
//            voucherId:trans.token
//          })
//        })
//        beneficiaryReferred.map((trans)=>{
//          data.push({
//            beneficiary:trans.referrerBeneficiaries,
//            topic:trans.eventType,
//            timestamp:formatDate(trans.blockTimestamp),
//            txHash:trans.transactionHash
   
//          })
         
//        })
   
//        claimCreated.map((trans)=>{
//          data.push({
//            beneficiary:trans.claimer,
//            txHash:trans.transactionHash,
//            timestamp:formatDate(trans.blockTimestamp),
//            topic:trans?.eventType,
//            voucherId:trans.token
//          })
//        })
   
//        beneficiaryAdded.map((trans)=>{
//          data.push({
//            topic:trans.eventType,
//            timestamp:formatDate(trans.blockTimestamp),
//            txHash:trans.transactionHash,
//            beneficiary:trans.beneficiaryAddress
//          })
//        })
   
//        tokenBudgetIncrease.map((trans)=>{
//          data.push({
//            topic:trans.eventType,
//            txHash:trans.transactionHash,
//            timestamp:formatDate(trans.blockTimestamp),
//            voucherId:trans?.tokenAddress
//          })
//        })
//     return data;

// }

// export const getProjectVoucher = async(projectAddress:string,queryService:GraphQuery)=>{
//     // const {queryService} = useGraphService();
//     const voucherRes = await queryService?.useProjectVoucher(projectAddress);
//     return voucherRes

// }

// export const getBeneficiaryVoucher = async(beneficiaryAddress: string,queryService:GraphQuery)=>{
//     // const {queryService} = useGraphService();
//     const voucherRes = await queryService.useBeneficiaryVoucher(beneficiaryAddress);
//     return voucherRes;
// }

