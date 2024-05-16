import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// C2CProject
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const c2CProjectAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_community', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AddressEmptyCode',
  },
  { type: 'error', inputs: [], name: 'FailedInnerCall' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'BeneficiaryAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'BeneficiaryRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_beneficiary',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ClaimAssigned',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_beneficiary',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_tokenAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ClaimProcessed',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'ProjectLocked' },
  { type: 'event', anonymous: false, inputs: [], name: 'ProjectUnlocked' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TokenBudgetDecrease',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TokenBudgetIncrease',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TokenReceived',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'TokenRegistered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TokenTransfer',
  },
  {
    type: 'function',
    inputs: [],
    name: 'IID_RAHAT_PROJECT',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'RahatCommunity',
    outputs: [
      { name: '', internalType: 'contract IRahatCommunity', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_from', internalType: 'address', type: 'address' },
      { name: '_tokenAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'acceptToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_beneficiary', internalType: 'address', type: 'address' },
    ],
    name: 'addBeneficiary',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_beneficiary', internalType: 'address', type: 'address' },
      { name: '_tokenAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assignClaims',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'beneficiaryClaims',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'beneficiaryCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'community',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_address', internalType: 'address', type: 'address' }],
    name: 'isBeneficiary',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'isDonor',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'data', internalType: 'bytes[]', type: 'bytes[]' }],
    name: 'multicall',
    outputs: [{ name: 'results', internalType: 'bytes[]', type: 'bytes[]' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_beneficiary', internalType: 'address', type: 'address' },
      { name: '_tokenAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'processTransferToBeneficiary',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_beneficiary', internalType: 'address', type: 'address' },
      { name: '_tokenAddress', internalType: 'address', type: 'address' },
    ],
    name: 'removeBeneficiary',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_tokenAddress', internalType: 'address', type: 'address' },
    ],
    name: 'tokenBudget',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalClaimsAssigned',
    outputs: [
      { name: '_totalClaims', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_tokenAddress', internalType: 'address', type: 'address' },
    ],
    name: 'withdrawToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link c2CProjectAbi}__
 */
export const useReadC2CProject = /*#__PURE__*/ createUseReadContract({
  abi: c2CProjectAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link c2CProjectAbi}__ and `functionName` set to `"IID_RAHAT_PROJECT"`
 */
export const useReadC2CProjectIidRahatProject =
  /*#__PURE__*/ createUseReadContract({
    abi: c2CProjectAbi,
    functionName: 'IID_RAHAT_PROJECT',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link c2CProjectAbi}__ and `functionName` set to `"RahatCommunity"`
 */
export const useReadC2CProjectRahatCommunity =
  /*#__PURE__*/ createUseReadContract({
    abi: c2CProjectAbi,
    functionName: 'RahatCommunity',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link c2CProjectAbi}__ and `functionName` set to `"beneficiaryClaims"`
 */
export const useReadC2CProjectBeneficiaryClaims =
  /*#__PURE__*/ createUseReadContract({
    abi: c2CProjectAbi,
    functionName: 'beneficiaryClaims',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link c2CProjectAbi}__ and `functionName` set to `"beneficiaryCount"`
 */
export const useReadC2CProjectBeneficiaryCount =
  /*#__PURE__*/ createUseReadContract({
    abi: c2CProjectAbi,
    functionName: 'beneficiaryCount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link c2CProjectAbi}__ and `functionName` set to `"community"`
 */
export const useReadC2CProjectCommunity = /*#__PURE__*/ createUseReadContract({
  abi: c2CProjectAbi,
  functionName: 'community',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link c2CProjectAbi}__ and `functionName` set to `"isBeneficiary"`
 */
export const useReadC2CProjectIsBeneficiary =
  /*#__PURE__*/ createUseReadContract({
    abi: c2CProjectAbi,
    functionName: 'isBeneficiary',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link c2CProjectAbi}__ and `functionName` set to `"isDonor"`
 */
export const useReadC2CProjectIsDonor = /*#__PURE__*/ createUseReadContract({
  abi: c2CProjectAbi,
  functionName: 'isDonor',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link c2CProjectAbi}__ and `functionName` set to `"name"`
 */
export const useReadC2CProjectName = /*#__PURE__*/ createUseReadContract({
  abi: c2CProjectAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link c2CProjectAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadC2CProjectSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: c2CProjectAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link c2CProjectAbi}__ and `functionName` set to `"tokenBudget"`
 */
export const useReadC2CProjectTokenBudget = /*#__PURE__*/ createUseReadContract(
  { abi: c2CProjectAbi, functionName: 'tokenBudget' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link c2CProjectAbi}__ and `functionName` set to `"totalClaimsAssigned"`
 */
export const useReadC2CProjectTotalClaimsAssigned =
  /*#__PURE__*/ createUseReadContract({
    abi: c2CProjectAbi,
    functionName: 'totalClaimsAssigned',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link c2CProjectAbi}__
 */
export const useWriteC2CProject = /*#__PURE__*/ createUseWriteContract({
  abi: c2CProjectAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link c2CProjectAbi}__ and `functionName` set to `"acceptToken"`
 */
export const useWriteC2CProjectAcceptToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: c2CProjectAbi,
    functionName: 'acceptToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link c2CProjectAbi}__ and `functionName` set to `"addBeneficiary"`
 */
export const useWriteC2CProjectAddBeneficiary =
  /*#__PURE__*/ createUseWriteContract({
    abi: c2CProjectAbi,
    functionName: 'addBeneficiary',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link c2CProjectAbi}__ and `functionName` set to `"assignClaims"`
 */
export const useWriteC2CProjectAssignClaims =
  /*#__PURE__*/ createUseWriteContract({
    abi: c2CProjectAbi,
    functionName: 'assignClaims',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link c2CProjectAbi}__ and `functionName` set to `"multicall"`
 */
export const useWriteC2CProjectMulticall = /*#__PURE__*/ createUseWriteContract(
  { abi: c2CProjectAbi, functionName: 'multicall' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link c2CProjectAbi}__ and `functionName` set to `"processTransferToBeneficiary"`
 */
export const useWriteC2CProjectProcessTransferToBeneficiary =
  /*#__PURE__*/ createUseWriteContract({
    abi: c2CProjectAbi,
    functionName: 'processTransferToBeneficiary',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link c2CProjectAbi}__ and `functionName` set to `"removeBeneficiary"`
 */
export const useWriteC2CProjectRemoveBeneficiary =
  /*#__PURE__*/ createUseWriteContract({
    abi: c2CProjectAbi,
    functionName: 'removeBeneficiary',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link c2CProjectAbi}__ and `functionName` set to `"withdrawToken"`
 */
export const useWriteC2CProjectWithdrawToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: c2CProjectAbi,
    functionName: 'withdrawToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link c2CProjectAbi}__
 */
export const useSimulateC2CProject = /*#__PURE__*/ createUseSimulateContract({
  abi: c2CProjectAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link c2CProjectAbi}__ and `functionName` set to `"acceptToken"`
 */
export const useSimulateC2CProjectAcceptToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: c2CProjectAbi,
    functionName: 'acceptToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link c2CProjectAbi}__ and `functionName` set to `"addBeneficiary"`
 */
export const useSimulateC2CProjectAddBeneficiary =
  /*#__PURE__*/ createUseSimulateContract({
    abi: c2CProjectAbi,
    functionName: 'addBeneficiary',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link c2CProjectAbi}__ and `functionName` set to `"assignClaims"`
 */
export const useSimulateC2CProjectAssignClaims =
  /*#__PURE__*/ createUseSimulateContract({
    abi: c2CProjectAbi,
    functionName: 'assignClaims',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link c2CProjectAbi}__ and `functionName` set to `"multicall"`
 */
export const useSimulateC2CProjectMulticall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: c2CProjectAbi,
    functionName: 'multicall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link c2CProjectAbi}__ and `functionName` set to `"processTransferToBeneficiary"`
 */
export const useSimulateC2CProjectProcessTransferToBeneficiary =
  /*#__PURE__*/ createUseSimulateContract({
    abi: c2CProjectAbi,
    functionName: 'processTransferToBeneficiary',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link c2CProjectAbi}__ and `functionName` set to `"removeBeneficiary"`
 */
export const useSimulateC2CProjectRemoveBeneficiary =
  /*#__PURE__*/ createUseSimulateContract({
    abi: c2CProjectAbi,
    functionName: 'removeBeneficiary',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link c2CProjectAbi}__ and `functionName` set to `"withdrawToken"`
 */
export const useSimulateC2CProjectWithdrawToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: c2CProjectAbi,
    functionName: 'withdrawToken',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link c2CProjectAbi}__
 */
export const useWatchC2CProjectEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: c2CProjectAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link c2CProjectAbi}__ and `eventName` set to `"BeneficiaryAdded"`
 */
export const useWatchC2CProjectBeneficiaryAddedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: c2CProjectAbi,
    eventName: 'BeneficiaryAdded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link c2CProjectAbi}__ and `eventName` set to `"BeneficiaryRemoved"`
 */
export const useWatchC2CProjectBeneficiaryRemovedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: c2CProjectAbi,
    eventName: 'BeneficiaryRemoved',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link c2CProjectAbi}__ and `eventName` set to `"ClaimAssigned"`
 */
export const useWatchC2CProjectClaimAssignedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: c2CProjectAbi,
    eventName: 'ClaimAssigned',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link c2CProjectAbi}__ and `eventName` set to `"ClaimProcessed"`
 */
export const useWatchC2CProjectClaimProcessedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: c2CProjectAbi,
    eventName: 'ClaimProcessed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link c2CProjectAbi}__ and `eventName` set to `"ProjectLocked"`
 */
export const useWatchC2CProjectProjectLockedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: c2CProjectAbi,
    eventName: 'ProjectLocked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link c2CProjectAbi}__ and `eventName` set to `"ProjectUnlocked"`
 */
export const useWatchC2CProjectProjectUnlockedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: c2CProjectAbi,
    eventName: 'ProjectUnlocked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link c2CProjectAbi}__ and `eventName` set to `"TokenBudgetDecrease"`
 */
export const useWatchC2CProjectTokenBudgetDecreaseEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: c2CProjectAbi,
    eventName: 'TokenBudgetDecrease',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link c2CProjectAbi}__ and `eventName` set to `"TokenBudgetIncrease"`
 */
export const useWatchC2CProjectTokenBudgetIncreaseEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: c2CProjectAbi,
    eventName: 'TokenBudgetIncrease',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link c2CProjectAbi}__ and `eventName` set to `"TokenReceived"`
 */
export const useWatchC2CProjectTokenReceivedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: c2CProjectAbi,
    eventName: 'TokenReceived',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link c2CProjectAbi}__ and `eventName` set to `"TokenRegistered"`
 */
export const useWatchC2CProjectTokenRegisteredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: c2CProjectAbi,
    eventName: 'TokenRegistered',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link c2CProjectAbi}__ and `eventName` set to `"TokenTransfer"`
 */
export const useWatchC2CProjectTokenTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: c2CProjectAbi,
    eventName: 'TokenTransfer',
  })
