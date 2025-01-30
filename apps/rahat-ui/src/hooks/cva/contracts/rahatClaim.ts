// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RahatClaim
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rahatClaimAbi = [
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
        name: 'claimId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'claimer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'claimee',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'otpServer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ClaimCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'claimId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'ClaimProcessed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'claimId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'OtpAddedToClaim',
  },
  {
    type: 'function',
    inputs: [
      { name: '_claimId', internalType: 'uint256', type: 'uint256' },
      { name: '_otpHash', internalType: 'bytes32', type: 'bytes32' },
      { name: '_expiryDate', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'addOtpToClaim',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'claimCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'claims',
    outputs: [
      { name: 'ownerAddress', internalType: 'address', type: 'address' },
      { name: 'claimerAddress', internalType: 'address', type: 'address' },
      { name: 'claimeeAddress', internalType: 'address', type: 'address' },
      { name: 'otpServerAddress', internalType: 'address', type: 'address' },
      { name: 'tokenAddress', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'expiryDate', internalType: 'uint256', type: 'uint256' },
      { name: 'otpHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'isProcessed', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_claimerAddress', internalType: 'address', type: 'address' },
      { name: '_claimeeAddress', internalType: 'address', type: 'address' },
      { name: '_otpServerAddress', internalType: 'address', type: 'address' },
      { name: '_tokenAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createClaim',
    outputs: [{ name: 'claimId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_data', internalType: 'string', type: 'string' }],
    name: 'findHash',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'pure',
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
    inputs: [
      { name: '_claimId', internalType: 'uint256', type: 'uint256' },
      { name: '_otp', internalType: 'string', type: 'string' },
    ],
    name: 'processClaim',
    outputs: [
      {
        name: 'claim_',
        internalType: 'struct IRahatClaim.Claim',
        type: 'tuple',
        components: [
          { name: 'ownerAddress', internalType: 'address', type: 'address' },
          { name: 'claimerAddress', internalType: 'address', type: 'address' },
          { name: 'claimeeAddress', internalType: 'address', type: 'address' },
          {
            name: 'otpServerAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'tokenAddress', internalType: 'address', type: 'address' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'expiryDate', internalType: 'uint256', type: 'uint256' },
          { name: 'otpHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'isProcessed', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatClaimAbi}__
 */
export const useReadRahatClaim = /*#__PURE__*/ createUseReadContract({
  abi: rahatClaimAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatClaimAbi}__ and `functionName` set to `"claimCount"`
 */
export const useReadRahatClaimClaimCount = /*#__PURE__*/ createUseReadContract({
  abi: rahatClaimAbi,
  functionName: 'claimCount',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatClaimAbi}__ and `functionName` set to `"claims"`
 */
export const useReadRahatClaimClaims = /*#__PURE__*/ createUseReadContract({
  abi: rahatClaimAbi,
  functionName: 'claims',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatClaimAbi}__ and `functionName` set to `"findHash"`
 */
export const useReadRahatClaimFindHash = /*#__PURE__*/ createUseReadContract({
  abi: rahatClaimAbi,
  functionName: 'findHash',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatClaimAbi}__
 */
export const useWriteRahatClaim = /*#__PURE__*/ createUseWriteContract({
  abi: rahatClaimAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatClaimAbi}__ and `functionName` set to `"addOtpToClaim"`
 */
export const useWriteRahatClaimAddOtpToClaim =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatClaimAbi,
    functionName: 'addOtpToClaim',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatClaimAbi}__ and `functionName` set to `"createClaim"`
 */
export const useWriteRahatClaimCreateClaim =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatClaimAbi,
    functionName: 'createClaim',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatClaimAbi}__ and `functionName` set to `"multicall"`
 */
export const useWriteRahatClaimMulticall = /*#__PURE__*/ createUseWriteContract(
  { abi: rahatClaimAbi, functionName: 'multicall' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatClaimAbi}__ and `functionName` set to `"processClaim"`
 */
export const useWriteRahatClaimProcessClaim =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatClaimAbi,
    functionName: 'processClaim',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatClaimAbi}__
 */
export const useSimulateRahatClaim = /*#__PURE__*/ createUseSimulateContract({
  abi: rahatClaimAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatClaimAbi}__ and `functionName` set to `"addOtpToClaim"`
 */
export const useSimulateRahatClaimAddOtpToClaim =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatClaimAbi,
    functionName: 'addOtpToClaim',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatClaimAbi}__ and `functionName` set to `"createClaim"`
 */
export const useSimulateRahatClaimCreateClaim =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatClaimAbi,
    functionName: 'createClaim',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatClaimAbi}__ and `functionName` set to `"multicall"`
 */
export const useSimulateRahatClaimMulticall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatClaimAbi,
    functionName: 'multicall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatClaimAbi}__ and `functionName` set to `"processClaim"`
 */
export const useSimulateRahatClaimProcessClaim =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatClaimAbi,
    functionName: 'processClaim',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatClaimAbi}__
 */
export const useWatchRahatClaimEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: rahatClaimAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatClaimAbi}__ and `eventName` set to `"ClaimCreated"`
 */
export const useWatchRahatClaimClaimCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatClaimAbi,
    eventName: 'ClaimCreated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatClaimAbi}__ and `eventName` set to `"ClaimProcessed"`
 */
export const useWatchRahatClaimClaimProcessedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatClaimAbi,
    eventName: 'ClaimProcessed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatClaimAbi}__ and `eventName` set to `"OtpAddedToClaim"`
 */
export const useWatchRahatClaimOtpAddedToClaimEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatClaimAbi,
    eventName: 'OtpAddedToClaim',
  })
