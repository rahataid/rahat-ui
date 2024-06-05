import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AAProject
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const aaProjectAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_defaultToken', internalType: 'address', type: 'address' },
      { name: '_forwarder', internalType: 'address', type: 'address' },
      { name: '_accessManager', internalType: 'address', type: 'address' },
      { name: '_triggerManager', internalType: 'address', type: 'address' },
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
      {
        name: 'beneficiary',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'BenTokensAssigned',
  },
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
        name: 'beneficiary',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'assigner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ClaimAssigned',
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
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'vendorAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'status', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'VendorUpdated',
  },
  {
    type: 'function',
    inputs: [],
    name: 'AccessManager',
    outputs: [
      { name: '', internalType: 'contract IAccessManager', type: 'address' },
    ],
    stateMutability: 'view',
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
    name: 'TriggerManager',
    outputs: [
      { name: '', internalType: 'contract ITriggerManager', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_address', internalType: 'address', type: 'address' }],
    name: 'addBeneficiary',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_beneficiary', internalType: 'address', type: 'address' },
      { name: '_tokenAssigned', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assignClaims',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_address', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'assignTokenToBeneficiary',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'benTokens',
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
    inputs: [{ name: '_address', internalType: 'address', type: 'address' }],
    name: 'checkVendorStatus',
    outputs: [{ name: '_vendorStatus', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'defaultToken',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_tokenAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseTokenBudget',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [{ name: 'forwarder', internalType: 'address', type: 'address' }],
    name: 'isTrustedForwarder',
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
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'registeredTokens',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_address', internalType: 'address', type: 'address' }],
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
    inputs: [],
    name: 'trustedForwarder',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aaProjectAbi}__
 */
export const useReadAaProject = /*#__PURE__*/ createUseReadContract({
  abi: aaProjectAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aaProjectAbi}__ and `functionName` set to `"AccessManager"`
 */
export const useReadAaProjectAccessManager =
  /*#__PURE__*/ createUseReadContract({
    abi: aaProjectAbi,
    functionName: 'AccessManager',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aaProjectAbi}__ and `functionName` set to `"IID_RAHAT_PROJECT"`
 */
export const useReadAaProjectIidRahatProject =
  /*#__PURE__*/ createUseReadContract({
    abi: aaProjectAbi,
    functionName: 'IID_RAHAT_PROJECT',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aaProjectAbi}__ and `functionName` set to `"TriggerManager"`
 */
export const useReadAaProjectTriggerManager =
  /*#__PURE__*/ createUseReadContract({
    abi: aaProjectAbi,
    functionName: 'TriggerManager',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aaProjectAbi}__ and `functionName` set to `"benTokens"`
 */
export const useReadAaProjectBenTokens = /*#__PURE__*/ createUseReadContract({
  abi: aaProjectAbi,
  functionName: 'benTokens',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aaProjectAbi}__ and `functionName` set to `"beneficiaryCount"`
 */
export const useReadAaProjectBeneficiaryCount =
  /*#__PURE__*/ createUseReadContract({
    abi: aaProjectAbi,
    functionName: 'beneficiaryCount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aaProjectAbi}__ and `functionName` set to `"checkVendorStatus"`
 */
export const useReadAaProjectCheckVendorStatus =
  /*#__PURE__*/ createUseReadContract({
    abi: aaProjectAbi,
    functionName: 'checkVendorStatus',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aaProjectAbi}__ and `functionName` set to `"defaultToken"`
 */
export const useReadAaProjectDefaultToken = /*#__PURE__*/ createUseReadContract(
  { abi: aaProjectAbi, functionName: 'defaultToken' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aaProjectAbi}__ and `functionName` set to `"isBeneficiary"`
 */
export const useReadAaProjectIsBeneficiary =
  /*#__PURE__*/ createUseReadContract({
    abi: aaProjectAbi,
    functionName: 'isBeneficiary',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aaProjectAbi}__ and `functionName` set to `"isTrustedForwarder"`
 */
export const useReadAaProjectIsTrustedForwarder =
  /*#__PURE__*/ createUseReadContract({
    abi: aaProjectAbi,
    functionName: 'isTrustedForwarder',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aaProjectAbi}__ and `functionName` set to `"name"`
 */
export const useReadAaProjectName = /*#__PURE__*/ createUseReadContract({
  abi: aaProjectAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aaProjectAbi}__ and `functionName` set to `"registeredTokens"`
 */
export const useReadAaProjectRegisteredTokens =
  /*#__PURE__*/ createUseReadContract({
    abi: aaProjectAbi,
    functionName: 'registeredTokens',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aaProjectAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadAaProjectSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: aaProjectAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aaProjectAbi}__ and `functionName` set to `"tokenBudget"`
 */
export const useReadAaProjectTokenBudget = /*#__PURE__*/ createUseReadContract({
  abi: aaProjectAbi,
  functionName: 'tokenBudget',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aaProjectAbi}__ and `functionName` set to `"totalClaimsAssigned"`
 */
export const useReadAaProjectTotalClaimsAssigned =
  /*#__PURE__*/ createUseReadContract({
    abi: aaProjectAbi,
    functionName: 'totalClaimsAssigned',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link aaProjectAbi}__ and `functionName` set to `"trustedForwarder"`
 */
export const useReadAaProjectTrustedForwarder =
  /*#__PURE__*/ createUseReadContract({
    abi: aaProjectAbi,
    functionName: 'trustedForwarder',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aaProjectAbi}__
 */
export const useWriteAaProject = /*#__PURE__*/ createUseWriteContract({
  abi: aaProjectAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aaProjectAbi}__ and `functionName` set to `"addBeneficiary"`
 */
export const useWriteAaProjectAddBeneficiary =
  /*#__PURE__*/ createUseWriteContract({
    abi: aaProjectAbi,
    functionName: 'addBeneficiary',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aaProjectAbi}__ and `functionName` set to `"assignClaims"`
 */
export const useWriteAaProjectAssignClaims =
  /*#__PURE__*/ createUseWriteContract({
    abi: aaProjectAbi,
    functionName: 'assignClaims',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aaProjectAbi}__ and `functionName` set to `"assignTokenToBeneficiary"`
 */
export const useWriteAaProjectAssignTokenToBeneficiary =
  /*#__PURE__*/ createUseWriteContract({
    abi: aaProjectAbi,
    functionName: 'assignTokenToBeneficiary',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aaProjectAbi}__ and `functionName` set to `"increaseTokenBudget"`
 */
export const useWriteAaProjectIncreaseTokenBudget =
  /*#__PURE__*/ createUseWriteContract({
    abi: aaProjectAbi,
    functionName: 'increaseTokenBudget',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aaProjectAbi}__ and `functionName` set to `"multicall"`
 */
export const useWriteAaProjectMulticall = /*#__PURE__*/ createUseWriteContract({
  abi: aaProjectAbi,
  functionName: 'multicall',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link aaProjectAbi}__ and `functionName` set to `"removeBeneficiary"`
 */
export const useWriteAaProjectRemoveBeneficiary =
  /*#__PURE__*/ createUseWriteContract({
    abi: aaProjectAbi,
    functionName: 'removeBeneficiary',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aaProjectAbi}__
 */
export const useSimulateAaProject = /*#__PURE__*/ createUseSimulateContract({
  abi: aaProjectAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aaProjectAbi}__ and `functionName` set to `"addBeneficiary"`
 */
export const useSimulateAaProjectAddBeneficiary =
  /*#__PURE__*/ createUseSimulateContract({
    abi: aaProjectAbi,
    functionName: 'addBeneficiary',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aaProjectAbi}__ and `functionName` set to `"assignClaims"`
 */
export const useSimulateAaProjectAssignClaims =
  /*#__PURE__*/ createUseSimulateContract({
    abi: aaProjectAbi,
    functionName: 'assignClaims',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aaProjectAbi}__ and `functionName` set to `"assignTokenToBeneficiary"`
 */
export const useSimulateAaProjectAssignTokenToBeneficiary =
  /*#__PURE__*/ createUseSimulateContract({
    abi: aaProjectAbi,
    functionName: 'assignTokenToBeneficiary',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aaProjectAbi}__ and `functionName` set to `"increaseTokenBudget"`
 */
export const useSimulateAaProjectIncreaseTokenBudget =
  /*#__PURE__*/ createUseSimulateContract({
    abi: aaProjectAbi,
    functionName: 'increaseTokenBudget',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aaProjectAbi}__ and `functionName` set to `"multicall"`
 */
export const useSimulateAaProjectMulticall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: aaProjectAbi,
    functionName: 'multicall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link aaProjectAbi}__ and `functionName` set to `"removeBeneficiary"`
 */
export const useSimulateAaProjectRemoveBeneficiary =
  /*#__PURE__*/ createUseSimulateContract({
    abi: aaProjectAbi,
    functionName: 'removeBeneficiary',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link aaProjectAbi}__
 */
export const useWatchAaProjectEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: aaProjectAbi },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link aaProjectAbi}__ and `eventName` set to `"BenTokensAssigned"`
 */
export const useWatchAaProjectBenTokensAssignedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: aaProjectAbi,
    eventName: 'BenTokensAssigned',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link aaProjectAbi}__ and `eventName` set to `"BeneficiaryAdded"`
 */
export const useWatchAaProjectBeneficiaryAddedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: aaProjectAbi,
    eventName: 'BeneficiaryAdded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link aaProjectAbi}__ and `eventName` set to `"BeneficiaryRemoved"`
 */
export const useWatchAaProjectBeneficiaryRemovedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: aaProjectAbi,
    eventName: 'BeneficiaryRemoved',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link aaProjectAbi}__ and `eventName` set to `"ClaimAssigned"`
 */
export const useWatchAaProjectClaimAssignedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: aaProjectAbi,
    eventName: 'ClaimAssigned',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link aaProjectAbi}__ and `eventName` set to `"TokenBudgetDecrease"`
 */
export const useWatchAaProjectTokenBudgetDecreaseEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: aaProjectAbi,
    eventName: 'TokenBudgetDecrease',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link aaProjectAbi}__ and `eventName` set to `"TokenBudgetIncrease"`
 */
export const useWatchAaProjectTokenBudgetIncreaseEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: aaProjectAbi,
    eventName: 'TokenBudgetIncrease',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link aaProjectAbi}__ and `eventName` set to `"TokenReceived"`
 */
export const useWatchAaProjectTokenReceivedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: aaProjectAbi,
    eventName: 'TokenReceived',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link aaProjectAbi}__ and `eventName` set to `"TokenRegistered"`
 */
export const useWatchAaProjectTokenRegisteredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: aaProjectAbi,
    eventName: 'TokenRegistered',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link aaProjectAbi}__ and `eventName` set to `"TokenTransfer"`
 */
export const useWatchAaProjectTokenTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: aaProjectAbi,
    eventName: 'TokenTransfer',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link aaProjectAbi}__ and `eventName` set to `"VendorUpdated"`
 */
export const useWatchAaProjectVendorUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: aaProjectAbi,
    eventName: 'VendorUpdated',
  })
