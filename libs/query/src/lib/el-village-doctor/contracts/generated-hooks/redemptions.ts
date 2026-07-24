import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Redemptions
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const redemptionsAbi = [
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
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TokenRedeemed',
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
    name: 'isConsumingScheduledOp',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_tokenAddress', internalType: 'address', type: 'address' },
      { name: '_from', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'redeemToken',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link redemptionsAbi}__
 */
export const useReadRedemptions = /*#__PURE__*/ createUseReadContract({
  abi: redemptionsAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link redemptionsAbi}__ and `functionName` set to `"authority"`
 */
export const useReadRedemptionsAuthority = /*#__PURE__*/ createUseReadContract({
  abi: redemptionsAbi,
  functionName: 'authority',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link redemptionsAbi}__ and `functionName` set to `"getAllowanceAndBalance"`
 */
export const useReadRedemptionsGetAllowanceAndBalance =
  /*#__PURE__*/ createUseReadContract({
    abi: redemptionsAbi,
    functionName: 'getAllowanceAndBalance',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link redemptionsAbi}__ and `functionName` set to `"isConsumingScheduledOp"`
 */
export const useReadRedemptionsIsConsumingScheduledOp =
  /*#__PURE__*/ createUseReadContract({
    abi: redemptionsAbi,
    functionName: 'isConsumingScheduledOp',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link redemptionsAbi}__
 */
export const useWriteRedemptions = /*#__PURE__*/ createUseWriteContract({
  abi: redemptionsAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link redemptionsAbi}__ and `functionName` set to `"approveToken"`
 */
export const useWriteRedemptionsApproveToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: redemptionsAbi,
    functionName: 'approveToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link redemptionsAbi}__ and `functionName` set to `"claimToken"`
 */
export const useWriteRedemptionsClaimToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: redemptionsAbi,
    functionName: 'claimToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link redemptionsAbi}__ and `functionName` set to `"redeemToken"`
 */
export const useWriteRedemptionsRedeemToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: redemptionsAbi,
    functionName: 'redeemToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link redemptionsAbi}__ and `functionName` set to `"setAuthority"`
 */
export const useWriteRedemptionsSetAuthority =
  /*#__PURE__*/ createUseWriteContract({
    abi: redemptionsAbi,
    functionName: 'setAuthority',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link redemptionsAbi}__ and `functionName` set to `"transferFromToken"`
 */
export const useWriteRedemptionsTransferFromToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: redemptionsAbi,
    functionName: 'transferFromToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link redemptionsAbi}__ and `functionName` set to `"transferToken"`
 */
export const useWriteRedemptionsTransferToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: redemptionsAbi,
    functionName: 'transferToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link redemptionsAbi}__
 */
export const useSimulateRedemptions = /*#__PURE__*/ createUseSimulateContract({
  abi: redemptionsAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link redemptionsAbi}__ and `functionName` set to `"approveToken"`
 */
export const useSimulateRedemptionsApproveToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: redemptionsAbi,
    functionName: 'approveToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link redemptionsAbi}__ and `functionName` set to `"claimToken"`
 */
export const useSimulateRedemptionsClaimToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: redemptionsAbi,
    functionName: 'claimToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link redemptionsAbi}__ and `functionName` set to `"redeemToken"`
 */
export const useSimulateRedemptionsRedeemToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: redemptionsAbi,
    functionName: 'redeemToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link redemptionsAbi}__ and `functionName` set to `"setAuthority"`
 */
export const useSimulateRedemptionsSetAuthority =
  /*#__PURE__*/ createUseSimulateContract({
    abi: redemptionsAbi,
    functionName: 'setAuthority',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link redemptionsAbi}__ and `functionName` set to `"transferFromToken"`
 */
export const useSimulateRedemptionsTransferFromToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: redemptionsAbi,
    functionName: 'transferFromToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link redemptionsAbi}__ and `functionName` set to `"transferToken"`
 */
export const useSimulateRedemptionsTransferToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: redemptionsAbi,
    functionName: 'transferToken',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link redemptionsAbi}__
 */
export const useWatchRedemptionsEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: redemptionsAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link redemptionsAbi}__ and `eventName` set to `"AuthorityUpdated"`
 */
export const useWatchRedemptionsAuthorityUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: redemptionsAbi,
    eventName: 'AuthorityUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link redemptionsAbi}__ and `eventName` set to `"TokenRedeemed"`
 */
export const useWatchRedemptionsTokenRedeemedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: redemptionsAbi,
    eventName: 'TokenRedeemed',
  })
