import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RahatPayrollProject
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rahatPayrollProjectAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_rahatClaim', internalType: 'address', type: 'address' },
      { name: '_forwarder', internalType: 'address', type: 'address' },
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
        name: 'beneficiary',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'claimer',
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
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ClaimProcessed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'claimer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ClaimerUpdated',
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
        indexed: false,
      },
    ],
    name: 'TokensAllocated',
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
        indexed: false,
      },
    ],
    name: 'TokensDisbursed',
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
    inputs: [
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_beneficiary', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'allocateToken',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_beneficiary', internalType: 'address', type: 'address' },
    ],
    name: 'disburseToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_tokenAddress', internalType: 'address', type: 'address' },
    ],
    name: 'disburseTokenBatch',
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
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'tokenAllocations',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalAllocated',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_tokenAddress', internalType: 'address', type: 'address' },
      { name: '_benAddress', internalType: 'address', type: 'address' },
      { name: '_vendorAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferTokenToClaimer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'trustedForwarder',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_claimer', internalType: 'address', type: 'address' },
      { name: '_approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'updateClaimer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatPayrollProjectAbi}__
 */
export const useReadRahatPayrollProject = /*#__PURE__*/ createUseReadContract({
  abi: rahatPayrollProjectAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatPayrollProjectAbi}__ and `functionName` set to `"IID_RAHAT_PROJECT"`
 */
export const useReadRahatPayrollProjectIidRahatProject =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatPayrollProjectAbi,
    functionName: 'IID_RAHAT_PROJECT',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatPayrollProjectAbi}__ and `functionName` set to `"beneficiaryCount"`
 */
export const useReadRahatPayrollProjectBeneficiaryCount =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatPayrollProjectAbi,
    functionName: 'beneficiaryCount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatPayrollProjectAbi}__ and `functionName` set to `"isBeneficiary"`
 */
export const useReadRahatPayrollProjectIsBeneficiary =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatPayrollProjectAbi,
    functionName: 'isBeneficiary',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatPayrollProjectAbi}__ and `functionName` set to `"isTrustedForwarder"`
 */
export const useReadRahatPayrollProjectIsTrustedForwarder =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatPayrollProjectAbi,
    functionName: 'isTrustedForwarder',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatPayrollProjectAbi}__ and `functionName` set to `"name"`
 */
export const useReadRahatPayrollProjectName =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatPayrollProjectAbi,
    functionName: 'name',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatPayrollProjectAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadRahatPayrollProjectSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatPayrollProjectAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatPayrollProjectAbi}__ and `functionName` set to `"tokenAllocations"`
 */
export const useReadRahatPayrollProjectTokenAllocations =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatPayrollProjectAbi,
    functionName: 'tokenAllocations',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatPayrollProjectAbi}__ and `functionName` set to `"totalAllocated"`
 */
export const useReadRahatPayrollProjectTotalAllocated =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatPayrollProjectAbi,
    functionName: 'totalAllocated',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatPayrollProjectAbi}__ and `functionName` set to `"trustedForwarder"`
 */
export const useReadRahatPayrollProjectTrustedForwarder =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatPayrollProjectAbi,
    functionName: 'trustedForwarder',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatPayrollProjectAbi}__
 */
export const useWriteRahatPayrollProject = /*#__PURE__*/ createUseWriteContract(
  { abi: rahatPayrollProjectAbi },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatPayrollProjectAbi}__ and `functionName` set to `"allocateToken"`
 */
export const useWriteRahatPayrollProjectAllocateToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatPayrollProjectAbi,
    functionName: 'allocateToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatPayrollProjectAbi}__ and `functionName` set to `"disburseToken"`
 */
export const useWriteRahatPayrollProjectDisburseToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatPayrollProjectAbi,
    functionName: 'disburseToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatPayrollProjectAbi}__ and `functionName` set to `"disburseTokenBatch"`
 */
export const useWriteRahatPayrollProjectDisburseTokenBatch =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatPayrollProjectAbi,
    functionName: 'disburseTokenBatch',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatPayrollProjectAbi}__ and `functionName` set to `"multicall"`
 */
export const useWriteRahatPayrollProjectMulticall =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatPayrollProjectAbi,
    functionName: 'multicall',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatPayrollProjectAbi}__ and `functionName` set to `"transferTokenToClaimer"`
 */
export const useWriteRahatPayrollProjectTransferTokenToClaimer =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatPayrollProjectAbi,
    functionName: 'transferTokenToClaimer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatPayrollProjectAbi}__ and `functionName` set to `"updateClaimer"`
 */
export const useWriteRahatPayrollProjectUpdateClaimer =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatPayrollProjectAbi,
    functionName: 'updateClaimer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatPayrollProjectAbi}__
 */
export const useSimulateRahatPayrollProject =
  /*#__PURE__*/ createUseSimulateContract({ abi: rahatPayrollProjectAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatPayrollProjectAbi}__ and `functionName` set to `"allocateToken"`
 */
export const useSimulateRahatPayrollProjectAllocateToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatPayrollProjectAbi,
    functionName: 'allocateToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatPayrollProjectAbi}__ and `functionName` set to `"disburseToken"`
 */
export const useSimulateRahatPayrollProjectDisburseToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatPayrollProjectAbi,
    functionName: 'disburseToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatPayrollProjectAbi}__ and `functionName` set to `"disburseTokenBatch"`
 */
export const useSimulateRahatPayrollProjectDisburseTokenBatch =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatPayrollProjectAbi,
    functionName: 'disburseTokenBatch',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatPayrollProjectAbi}__ and `functionName` set to `"multicall"`
 */
export const useSimulateRahatPayrollProjectMulticall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatPayrollProjectAbi,
    functionName: 'multicall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatPayrollProjectAbi}__ and `functionName` set to `"transferTokenToClaimer"`
 */
export const useSimulateRahatPayrollProjectTransferTokenToClaimer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatPayrollProjectAbi,
    functionName: 'transferTokenToClaimer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatPayrollProjectAbi}__ and `functionName` set to `"updateClaimer"`
 */
export const useSimulateRahatPayrollProjectUpdateClaimer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatPayrollProjectAbi,
    functionName: 'updateClaimer',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatPayrollProjectAbi}__
 */
export const useWatchRahatPayrollProjectEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: rahatPayrollProjectAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatPayrollProjectAbi}__ and `eventName` set to `"BeneficiaryAdded"`
 */
export const useWatchRahatPayrollProjectBeneficiaryAddedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatPayrollProjectAbi,
    eventName: 'BeneficiaryAdded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatPayrollProjectAbi}__ and `eventName` set to `"BeneficiaryRemoved"`
 */
export const useWatchRahatPayrollProjectBeneficiaryRemovedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatPayrollProjectAbi,
    eventName: 'BeneficiaryRemoved',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatPayrollProjectAbi}__ and `eventName` set to `"ClaimProcessed"`
 */
export const useWatchRahatPayrollProjectClaimProcessedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatPayrollProjectAbi,
    eventName: 'ClaimProcessed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatPayrollProjectAbi}__ and `eventName` set to `"ClaimerUpdated"`
 */
export const useWatchRahatPayrollProjectClaimerUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatPayrollProjectAbi,
    eventName: 'ClaimerUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatPayrollProjectAbi}__ and `eventName` set to `"TokensAllocated"`
 */
export const useWatchRahatPayrollProjectTokensAllocatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatPayrollProjectAbi,
    eventName: 'TokensAllocated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatPayrollProjectAbi}__ and `eventName` set to `"TokensDisbursed"`
 */
export const useWatchRahatPayrollProjectTokensDisbursedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatPayrollProjectAbi,
    eventName: 'TokensDisbursed',
  })
