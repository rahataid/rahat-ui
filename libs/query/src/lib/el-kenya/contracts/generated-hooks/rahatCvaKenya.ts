import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RahatCvaKenya
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rahatCvaKenyaAbi = [
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
        name: 'vendor',
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
    name: 'WalkInBeneficiairyAdded',
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
    name: 'RahatClaim',
    outputs: [
      { name: '', internalType: 'contract IRahatClaim', type: 'address' },
    ],
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
    name: 'addWalkInBeneficiary',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [{ name: '_vendor', internalType: 'address', type: 'address' }],
    name: 'getServedBen',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'tokenClaimed',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCvaKenyaAbi}__
 */
export const useReadRahatCvaKenya = /*#__PURE__*/ createUseReadContract({
  abi: rahatCvaKenyaAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCvaKenyaAbi}__ and `functionName` set to `"IID_RAHAT_PROJECT"`
 */
export const useReadRahatCvaKenyaIidRahatProject =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatCvaKenyaAbi,
    functionName: 'IID_RAHAT_PROJECT',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCvaKenyaAbi}__ and `functionName` set to `"RahatClaim"`
 */
export const useReadRahatCvaKenyaRahatClaim =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatCvaKenyaAbi,
    functionName: 'RahatClaim',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCvaKenyaAbi}__ and `functionName` set to `"beneficiaryCount"`
 */
export const useReadRahatCvaKenyaBeneficiaryCount =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatCvaKenyaAbi,
    functionName: 'beneficiaryCount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCvaKenyaAbi}__ and `functionName` set to `"getServedBen"`
 */
export const useReadRahatCvaKenyaGetServedBen =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatCvaKenyaAbi,
    functionName: 'getServedBen',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCvaKenyaAbi}__ and `functionName` set to `"isBeneficiary"`
 */
export const useReadRahatCvaKenyaIsBeneficiary =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatCvaKenyaAbi,
    functionName: 'isBeneficiary',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCvaKenyaAbi}__ and `functionName` set to `"isTrustedForwarder"`
 */
export const useReadRahatCvaKenyaIsTrustedForwarder =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatCvaKenyaAbi,
    functionName: 'isTrustedForwarder',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCvaKenyaAbi}__ and `functionName` set to `"name"`
 */
export const useReadRahatCvaKenyaName = /*#__PURE__*/ createUseReadContract({
  abi: rahatCvaKenyaAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCvaKenyaAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadRahatCvaKenyaSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatCvaKenyaAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCvaKenyaAbi}__ and `functionName` set to `"tokenAllocations"`
 */
export const useReadRahatCvaKenyaTokenAllocations =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatCvaKenyaAbi,
    functionName: 'tokenAllocations',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCvaKenyaAbi}__ and `functionName` set to `"tokenClaimed"`
 */
export const useReadRahatCvaKenyaTokenClaimed =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatCvaKenyaAbi,
    functionName: 'tokenClaimed',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCvaKenyaAbi}__ and `functionName` set to `"totalAllocated"`
 */
export const useReadRahatCvaKenyaTotalAllocated =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatCvaKenyaAbi,
    functionName: 'totalAllocated',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCvaKenyaAbi}__ and `functionName` set to `"trustedForwarder"`
 */
export const useReadRahatCvaKenyaTrustedForwarder =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatCvaKenyaAbi,
    functionName: 'trustedForwarder',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatCvaKenyaAbi}__
 */
export const useWriteRahatCvaKenya = /*#__PURE__*/ createUseWriteContract({
  abi: rahatCvaKenyaAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatCvaKenyaAbi}__ and `functionName` set to `"addWalkInBeneficiary"`
 */
export const useWriteRahatCvaKenyaAddWalkInBeneficiary =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatCvaKenyaAbi,
    functionName: 'addWalkInBeneficiary',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatCvaKenyaAbi}__ and `functionName` set to `"allocateToken"`
 */
export const useWriteRahatCvaKenyaAllocateToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatCvaKenyaAbi,
    functionName: 'allocateToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatCvaKenyaAbi}__ and `functionName` set to `"disburseToken"`
 */
export const useWriteRahatCvaKenyaDisburseToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatCvaKenyaAbi,
    functionName: 'disburseToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatCvaKenyaAbi}__ and `functionName` set to `"disburseTokenBatch"`
 */
export const useWriteRahatCvaKenyaDisburseTokenBatch =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatCvaKenyaAbi,
    functionName: 'disburseTokenBatch',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatCvaKenyaAbi}__ and `functionName` set to `"multicall"`
 */
export const useWriteRahatCvaKenyaMulticall =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatCvaKenyaAbi,
    functionName: 'multicall',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatCvaKenyaAbi}__ and `functionName` set to `"transferTokenToClaimer"`
 */
export const useWriteRahatCvaKenyaTransferTokenToClaimer =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatCvaKenyaAbi,
    functionName: 'transferTokenToClaimer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatCvaKenyaAbi}__ and `functionName` set to `"updateClaimer"`
 */
export const useWriteRahatCvaKenyaUpdateClaimer =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatCvaKenyaAbi,
    functionName: 'updateClaimer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatCvaKenyaAbi}__
 */
export const useSimulateRahatCvaKenya = /*#__PURE__*/ createUseSimulateContract(
  { abi: rahatCvaKenyaAbi },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatCvaKenyaAbi}__ and `functionName` set to `"addWalkInBeneficiary"`
 */
export const useSimulateRahatCvaKenyaAddWalkInBeneficiary =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatCvaKenyaAbi,
    functionName: 'addWalkInBeneficiary',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatCvaKenyaAbi}__ and `functionName` set to `"allocateToken"`
 */
export const useSimulateRahatCvaKenyaAllocateToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatCvaKenyaAbi,
    functionName: 'allocateToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatCvaKenyaAbi}__ and `functionName` set to `"disburseToken"`
 */
export const useSimulateRahatCvaKenyaDisburseToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatCvaKenyaAbi,
    functionName: 'disburseToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatCvaKenyaAbi}__ and `functionName` set to `"disburseTokenBatch"`
 */
export const useSimulateRahatCvaKenyaDisburseTokenBatch =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatCvaKenyaAbi,
    functionName: 'disburseTokenBatch',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatCvaKenyaAbi}__ and `functionName` set to `"multicall"`
 */
export const useSimulateRahatCvaKenyaMulticall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatCvaKenyaAbi,
    functionName: 'multicall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatCvaKenyaAbi}__ and `functionName` set to `"transferTokenToClaimer"`
 */
export const useSimulateRahatCvaKenyaTransferTokenToClaimer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatCvaKenyaAbi,
    functionName: 'transferTokenToClaimer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatCvaKenyaAbi}__ and `functionName` set to `"updateClaimer"`
 */
export const useSimulateRahatCvaKenyaUpdateClaimer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatCvaKenyaAbi,
    functionName: 'updateClaimer',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatCvaKenyaAbi}__
 */
export const useWatchRahatCvaKenyaEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: rahatCvaKenyaAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatCvaKenyaAbi}__ and `eventName` set to `"BeneficiaryAdded"`
 */
export const useWatchRahatCvaKenyaBeneficiaryAddedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatCvaKenyaAbi,
    eventName: 'BeneficiaryAdded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatCvaKenyaAbi}__ and `eventName` set to `"BeneficiaryRemoved"`
 */
export const useWatchRahatCvaKenyaBeneficiaryRemovedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatCvaKenyaAbi,
    eventName: 'BeneficiaryRemoved',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatCvaKenyaAbi}__ and `eventName` set to `"ClaimProcessed"`
 */
export const useWatchRahatCvaKenyaClaimProcessedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatCvaKenyaAbi,
    eventName: 'ClaimProcessed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatCvaKenyaAbi}__ and `eventName` set to `"ClaimerUpdated"`
 */
export const useWatchRahatCvaKenyaClaimerUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatCvaKenyaAbi,
    eventName: 'ClaimerUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatCvaKenyaAbi}__ and `eventName` set to `"TokensAllocated"`
 */
export const useWatchRahatCvaKenyaTokensAllocatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatCvaKenyaAbi,
    eventName: 'TokensAllocated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatCvaKenyaAbi}__ and `eventName` set to `"TokensDisbursed"`
 */
export const useWatchRahatCvaKenyaTokensDisbursedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatCvaKenyaAbi,
    eventName: 'TokensDisbursed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatCvaKenyaAbi}__ and `eventName` set to `"WalkInBeneficiairyAdded"`
 */
export const useWatchRahatCvaKenyaWalkInBeneficiairyAddedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatCvaKenyaAbi,
    eventName: 'WalkInBeneficiairyAdded',
  })
