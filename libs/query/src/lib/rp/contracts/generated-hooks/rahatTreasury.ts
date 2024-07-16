import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RahatTreasury
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rahatTreasuryAbi = [
  {
    type: 'constructor',
    inputs: [{ name: '_manager', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [{ name: 'authority', internalType: 'address', type: 'address' }],
    name: 'AccessManagedInvalidAuthority',
  },
  {
    type: 'error',
    inputs: [
      { name: 'caller', internalType: 'address', type: 'address' },
      { name: 'delay', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'AccessManagedRequiredDelay',
  },
  {
    type: 'error',
    inputs: [{ name: 'caller', internalType: 'address', type: 'address' }],
    name: 'AccessManagedUnauthorized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'authority',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AuthorityUpdated',
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
    name: 'TokenCreated',
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
        name: 'approveAddress',
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
    name: 'TokenMintedAndApproved',
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
        name: 'receiverAddress',
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
    name: 'TokenMintedAndSent',
  },
  {
    type: 'function',
    inputs: [],
    name: 'IID_RAHAT_TREASURY',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_spender', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approveToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_from', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'claimToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_symbol', internalType: 'string', type: 'string' },
      { name: '_description', internalType: 'string', type: 'string' },
      { name: 'decimals', internalType: 'uint8', type: 'uint8' },
      { name: '_initialSupply', internalType: 'uint256', type: 'uint256' },
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_manager', internalType: 'address', type: 'address' },
      { name: '_forwarder', internalType: 'address', type: 'address' },
    ],
    name: 'createToken',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_from', internalType: 'address', type: 'address' },
    ],
    name: 'getAllowanceAndBalance',
    outputs: [
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTokens',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isConsumingScheduledOp',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mintToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_approveAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mintTokenAndApprove',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_receiver', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mintTokenAndSend',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newAuthority', internalType: 'address', type: 'address' },
    ],
    name: 'setAuthority',
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
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_from', internalType: 'address', type: 'address' },
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFromToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatTreasuryAbi}__
 */
export const useReadRahatTreasury = /*#__PURE__*/ createUseReadContract({
  abi: rahatTreasuryAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `functionName` set to `"IID_RAHAT_TREASURY"`
 */
export const useReadRahatTreasuryIidRahatTreasury =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatTreasuryAbi,
    functionName: 'IID_RAHAT_TREASURY',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `functionName` set to `"authority"`
 */
export const useReadRahatTreasuryAuthority =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatTreasuryAbi,
    functionName: 'authority',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `functionName` set to `"getAllowanceAndBalance"`
 */
export const useReadRahatTreasuryGetAllowanceAndBalance =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatTreasuryAbi,
    functionName: 'getAllowanceAndBalance',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `functionName` set to `"getTokens"`
 */
export const useReadRahatTreasuryGetTokens =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatTreasuryAbi,
    functionName: 'getTokens',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `functionName` set to `"isConsumingScheduledOp"`
 */
export const useReadRahatTreasuryIsConsumingScheduledOp =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatTreasuryAbi,
    functionName: 'isConsumingScheduledOp',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadRahatTreasurySupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatTreasuryAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatTreasuryAbi}__
 */
export const useWriteRahatTreasury = /*#__PURE__*/ createUseWriteContract({
  abi: rahatTreasuryAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `functionName` set to `"approveToken"`
 */
export const useWriteRahatTreasuryApproveToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatTreasuryAbi,
    functionName: 'approveToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `functionName` set to `"claimToken"`
 */
export const useWriteRahatTreasuryClaimToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatTreasuryAbi,
    functionName: 'claimToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `functionName` set to `"createToken"`
 */
export const useWriteRahatTreasuryCreateToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatTreasuryAbi,
    functionName: 'createToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `functionName` set to `"mintToken"`
 */
export const useWriteRahatTreasuryMintToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatTreasuryAbi,
    functionName: 'mintToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `functionName` set to `"mintTokenAndApprove"`
 */
export const useWriteRahatTreasuryMintTokenAndApprove =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatTreasuryAbi,
    functionName: 'mintTokenAndApprove',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `functionName` set to `"mintTokenAndSend"`
 */
export const useWriteRahatTreasuryMintTokenAndSend =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatTreasuryAbi,
    functionName: 'mintTokenAndSend',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `functionName` set to `"setAuthority"`
 */
export const useWriteRahatTreasurySetAuthority =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatTreasuryAbi,
    functionName: 'setAuthority',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `functionName` set to `"transferFromToken"`
 */
export const useWriteRahatTreasuryTransferFromToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatTreasuryAbi,
    functionName: 'transferFromToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `functionName` set to `"transferToken"`
 */
export const useWriteRahatTreasuryTransferToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatTreasuryAbi,
    functionName: 'transferToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatTreasuryAbi}__
 */
export const useSimulateRahatTreasury = /*#__PURE__*/ createUseSimulateContract(
  { abi: rahatTreasuryAbi },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `functionName` set to `"approveToken"`
 */
export const useSimulateRahatTreasuryApproveToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatTreasuryAbi,
    functionName: 'approveToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `functionName` set to `"claimToken"`
 */
export const useSimulateRahatTreasuryClaimToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatTreasuryAbi,
    functionName: 'claimToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `functionName` set to `"createToken"`
 */
export const useSimulateRahatTreasuryCreateToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatTreasuryAbi,
    functionName: 'createToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `functionName` set to `"mintToken"`
 */
export const useSimulateRahatTreasuryMintToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatTreasuryAbi,
    functionName: 'mintToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `functionName` set to `"mintTokenAndApprove"`
 */
export const useSimulateRahatTreasuryMintTokenAndApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatTreasuryAbi,
    functionName: 'mintTokenAndApprove',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `functionName` set to `"mintTokenAndSend"`
 */
export const useSimulateRahatTreasuryMintTokenAndSend =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatTreasuryAbi,
    functionName: 'mintTokenAndSend',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `functionName` set to `"setAuthority"`
 */
export const useSimulateRahatTreasurySetAuthority =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatTreasuryAbi,
    functionName: 'setAuthority',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `functionName` set to `"transferFromToken"`
 */
export const useSimulateRahatTreasuryTransferFromToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatTreasuryAbi,
    functionName: 'transferFromToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `functionName` set to `"transferToken"`
 */
export const useSimulateRahatTreasuryTransferToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatTreasuryAbi,
    functionName: 'transferToken',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatTreasuryAbi}__
 */
export const useWatchRahatTreasuryEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: rahatTreasuryAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `eventName` set to `"AuthorityUpdated"`
 */
export const useWatchRahatTreasuryAuthorityUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatTreasuryAbi,
    eventName: 'AuthorityUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `eventName` set to `"TokenCreated"`
 */
export const useWatchRahatTreasuryTokenCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatTreasuryAbi,
    eventName: 'TokenCreated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `eventName` set to `"TokenMintedAndApproved"`
 */
export const useWatchRahatTreasuryTokenMintedAndApprovedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatTreasuryAbi,
    eventName: 'TokenMintedAndApproved',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `eventName` set to `"TokenMintedAndSent"`
 */
export const useWatchRahatTreasuryTokenMintedAndSentEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatTreasuryAbi,
    eventName: 'TokenMintedAndSent',
  })
