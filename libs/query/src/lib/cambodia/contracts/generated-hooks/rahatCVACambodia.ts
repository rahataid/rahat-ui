import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RahatCVACambodia
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rahatCvaCambodiaAbi = [
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
      { name: 'chw', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'CHWAdded',
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
    inputs: [
      { name: '_tokenAddress', internalType: 'address', type: 'address' },
      { name: '_chwAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'allocateTokenToChw',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__
 */
export const useReadRahatCvaCambodia = /*#__PURE__*/ createUseReadContract({
  abi: rahatCvaCambodiaAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__ and `functionName` set to `"IID_RAHAT_PROJECT"`
 */
export const useReadRahatCvaCambodiaIidRahatProject =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatCvaCambodiaAbi,
    functionName: 'IID_RAHAT_PROJECT',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__ and `functionName` set to `"RahatClaim"`
 */
export const useReadRahatCvaCambodiaRahatClaim =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatCvaCambodiaAbi,
    functionName: 'RahatClaim',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__ and `functionName` set to `"beneficiaryCount"`
 */
export const useReadRahatCvaCambodiaBeneficiaryCount =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatCvaCambodiaAbi,
    functionName: 'beneficiaryCount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__ and `functionName` set to `"getServedBen"`
 */
export const useReadRahatCvaCambodiaGetServedBen =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatCvaCambodiaAbi,
    functionName: 'getServedBen',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__ and `functionName` set to `"isBeneficiary"`
 */
export const useReadRahatCvaCambodiaIsBeneficiary =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatCvaCambodiaAbi,
    functionName: 'isBeneficiary',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__ and `functionName` set to `"isTrustedForwarder"`
 */
export const useReadRahatCvaCambodiaIsTrustedForwarder =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatCvaCambodiaAbi,
    functionName: 'isTrustedForwarder',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__ and `functionName` set to `"name"`
 */
export const useReadRahatCvaCambodiaName = /*#__PURE__*/ createUseReadContract({
  abi: rahatCvaCambodiaAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadRahatCvaCambodiaSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatCvaCambodiaAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__ and `functionName` set to `"tokenAllocations"`
 */
export const useReadRahatCvaCambodiaTokenAllocations =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatCvaCambodiaAbi,
    functionName: 'tokenAllocations',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__ and `functionName` set to `"tokenClaimed"`
 */
export const useReadRahatCvaCambodiaTokenClaimed =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatCvaCambodiaAbi,
    functionName: 'tokenClaimed',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__ and `functionName` set to `"totalAllocated"`
 */
export const useReadRahatCvaCambodiaTotalAllocated =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatCvaCambodiaAbi,
    functionName: 'totalAllocated',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__ and `functionName` set to `"trustedForwarder"`
 */
export const useReadRahatCvaCambodiaTrustedForwarder =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatCvaCambodiaAbi,
    functionName: 'trustedForwarder',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__
 */
export const useWriteRahatCvaCambodia = /*#__PURE__*/ createUseWriteContract({
  abi: rahatCvaCambodiaAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__ and `functionName` set to `"allocateToken"`
 */
export const useWriteRahatCvaCambodiaAllocateToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatCvaCambodiaAbi,
    functionName: 'allocateToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__ and `functionName` set to `"allocateTokenToChw"`
 */
export const useWriteRahatCvaCambodiaAllocateTokenToChw =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatCvaCambodiaAbi,
    functionName: 'allocateTokenToChw',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__ and `functionName` set to `"disburseToken"`
 */
export const useWriteRahatCvaCambodiaDisburseToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatCvaCambodiaAbi,
    functionName: 'disburseToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__ and `functionName` set to `"disburseTokenBatch"`
 */
export const useWriteRahatCvaCambodiaDisburseTokenBatch =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatCvaCambodiaAbi,
    functionName: 'disburseTokenBatch',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__ and `functionName` set to `"multicall"`
 */
export const useWriteRahatCvaCambodiaMulticall =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatCvaCambodiaAbi,
    functionName: 'multicall',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__ and `functionName` set to `"transferTokenToClaimer"`
 */
export const useWriteRahatCvaCambodiaTransferTokenToClaimer =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatCvaCambodiaAbi,
    functionName: 'transferTokenToClaimer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__ and `functionName` set to `"updateClaimer"`
 */
export const useWriteRahatCvaCambodiaUpdateClaimer =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatCvaCambodiaAbi,
    functionName: 'updateClaimer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__
 */
export const useSimulateRahatCvaCambodia =
  /*#__PURE__*/ createUseSimulateContract({ abi: rahatCvaCambodiaAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__ and `functionName` set to `"allocateToken"`
 */
export const useSimulateRahatCvaCambodiaAllocateToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatCvaCambodiaAbi,
    functionName: 'allocateToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__ and `functionName` set to `"allocateTokenToChw"`
 */
export const useSimulateRahatCvaCambodiaAllocateTokenToChw =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatCvaCambodiaAbi,
    functionName: 'allocateTokenToChw',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__ and `functionName` set to `"disburseToken"`
 */
export const useSimulateRahatCvaCambodiaDisburseToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatCvaCambodiaAbi,
    functionName: 'disburseToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__ and `functionName` set to `"disburseTokenBatch"`
 */
export const useSimulateRahatCvaCambodiaDisburseTokenBatch =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatCvaCambodiaAbi,
    functionName: 'disburseTokenBatch',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__ and `functionName` set to `"multicall"`
 */
export const useSimulateRahatCvaCambodiaMulticall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatCvaCambodiaAbi,
    functionName: 'multicall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__ and `functionName` set to `"transferTokenToClaimer"`
 */
export const useSimulateRahatCvaCambodiaTransferTokenToClaimer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatCvaCambodiaAbi,
    functionName: 'transferTokenToClaimer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__ and `functionName` set to `"updateClaimer"`
 */
export const useSimulateRahatCvaCambodiaUpdateClaimer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatCvaCambodiaAbi,
    functionName: 'updateClaimer',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__
 */
export const useWatchRahatCvaCambodiaEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: rahatCvaCambodiaAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__ and `eventName` set to `"BeneficiaryAdded"`
 */
export const useWatchRahatCvaCambodiaBeneficiaryAddedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatCvaCambodiaAbi,
    eventName: 'BeneficiaryAdded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__ and `eventName` set to `"BeneficiaryRemoved"`
 */
export const useWatchRahatCvaCambodiaBeneficiaryRemovedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatCvaCambodiaAbi,
    eventName: 'BeneficiaryRemoved',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__ and `eventName` set to `"CHWAdded"`
 */
export const useWatchRahatCvaCambodiaChwAddedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatCvaCambodiaAbi,
    eventName: 'CHWAdded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__ and `eventName` set to `"ClaimProcessed"`
 */
export const useWatchRahatCvaCambodiaClaimProcessedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatCvaCambodiaAbi,
    eventName: 'ClaimProcessed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__ and `eventName` set to `"ClaimerUpdated"`
 */
export const useWatchRahatCvaCambodiaClaimerUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatCvaCambodiaAbi,
    eventName: 'ClaimerUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__ and `eventName` set to `"TokensAllocated"`
 */
export const useWatchRahatCvaCambodiaTokensAllocatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatCvaCambodiaAbi,
    eventName: 'TokensAllocated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatCvaCambodiaAbi}__ and `eventName` set to `"TokensDisbursed"`
 */
export const useWatchRahatCvaCambodiaTokensDisbursedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatCvaCambodiaAbi,
    eventName: 'TokensDisbursed',
  })
