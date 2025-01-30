// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RahatToken
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rahatTokenAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_symbol', internalType: 'string', type: 'string' },
      { name: '_admin', internalType: 'address', type: 'address' },
      { name: '_decimals', internalType: 'uint8', type: 'uint8' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AddressEmptyCode',
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  { type: 'error', inputs: [], name: 'FailedInnerCall' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnerAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnerRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [{ name: '_address', internalType: 'address', type: 'address' }],
    name: 'addOwner',
    outputs: [{ name: 'success', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'value', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'burnFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_address', internalType: 'address', type: 'address' }],
    name: 'isOwner',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'listOwners',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_address', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
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
    inputs: [],
    name: 'ownerCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_address', internalType: 'address', type: 'address' }],
    name: 'removeOwner',
    outputs: [{ name: 'success', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatTokenAbi}__
 */
export const useReadRahatToken = /*#__PURE__*/ createUseReadContract({
  abi: rahatTokenAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatTokenAbi}__ and `functionName` set to `"allowance"`
 */
export const useReadRahatTokenAllowance = /*#__PURE__*/ createUseReadContract({
  abi: rahatTokenAbi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatTokenAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadRahatTokenBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: rahatTokenAbi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatTokenAbi}__ and `functionName` set to `"decimals"`
 */
export const useReadRahatTokenDecimals = /*#__PURE__*/ createUseReadContract({
  abi: rahatTokenAbi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatTokenAbi}__ and `functionName` set to `"isOwner"`
 */
export const useReadRahatTokenIsOwner = /*#__PURE__*/ createUseReadContract({
  abi: rahatTokenAbi,
  functionName: 'isOwner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatTokenAbi}__ and `functionName` set to `"listOwners"`
 */
export const useReadRahatTokenListOwners = /*#__PURE__*/ createUseReadContract({
  abi: rahatTokenAbi,
  functionName: 'listOwners',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatTokenAbi}__ and `functionName` set to `"name"`
 */
export const useReadRahatTokenName = /*#__PURE__*/ createUseReadContract({
  abi: rahatTokenAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatTokenAbi}__ and `functionName` set to `"ownerCount"`
 */
export const useReadRahatTokenOwnerCount = /*#__PURE__*/ createUseReadContract({
  abi: rahatTokenAbi,
  functionName: 'ownerCount',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatTokenAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadRahatTokenSymbol = /*#__PURE__*/ createUseReadContract({
  abi: rahatTokenAbi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatTokenAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadRahatTokenTotalSupply = /*#__PURE__*/ createUseReadContract(
  { abi: rahatTokenAbi, functionName: 'totalSupply' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatTokenAbi}__
 */
export const useWriteRahatToken = /*#__PURE__*/ createUseWriteContract({
  abi: rahatTokenAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatTokenAbi}__ and `functionName` set to `"addOwner"`
 */
export const useWriteRahatTokenAddOwner = /*#__PURE__*/ createUseWriteContract({
  abi: rahatTokenAbi,
  functionName: 'addOwner',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatTokenAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteRahatTokenApprove = /*#__PURE__*/ createUseWriteContract({
  abi: rahatTokenAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatTokenAbi}__ and `functionName` set to `"burn"`
 */
export const useWriteRahatTokenBurn = /*#__PURE__*/ createUseWriteContract({
  abi: rahatTokenAbi,
  functionName: 'burn',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatTokenAbi}__ and `functionName` set to `"burnFrom"`
 */
export const useWriteRahatTokenBurnFrom = /*#__PURE__*/ createUseWriteContract({
  abi: rahatTokenAbi,
  functionName: 'burnFrom',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatTokenAbi}__ and `functionName` set to `"mint"`
 */
export const useWriteRahatTokenMint = /*#__PURE__*/ createUseWriteContract({
  abi: rahatTokenAbi,
  functionName: 'mint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatTokenAbi}__ and `functionName` set to `"multicall"`
 */
export const useWriteRahatTokenMulticall = /*#__PURE__*/ createUseWriteContract(
  { abi: rahatTokenAbi, functionName: 'multicall' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatTokenAbi}__ and `functionName` set to `"removeOwner"`
 */
export const useWriteRahatTokenRemoveOwner =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatTokenAbi,
    functionName: 'removeOwner',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatTokenAbi}__ and `functionName` set to `"transfer"`
 */
export const useWriteRahatTokenTransfer = /*#__PURE__*/ createUseWriteContract({
  abi: rahatTokenAbi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatTokenAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteRahatTokenTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatTokenAbi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatTokenAbi}__
 */
export const useSimulateRahatToken = /*#__PURE__*/ createUseSimulateContract({
  abi: rahatTokenAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatTokenAbi}__ and `functionName` set to `"addOwner"`
 */
export const useSimulateRahatTokenAddOwner =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatTokenAbi,
    functionName: 'addOwner',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatTokenAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateRahatTokenApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatTokenAbi,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatTokenAbi}__ and `functionName` set to `"burn"`
 */
export const useSimulateRahatTokenBurn =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatTokenAbi,
    functionName: 'burn',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatTokenAbi}__ and `functionName` set to `"burnFrom"`
 */
export const useSimulateRahatTokenBurnFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatTokenAbi,
    functionName: 'burnFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatTokenAbi}__ and `functionName` set to `"mint"`
 */
export const useSimulateRahatTokenMint =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatTokenAbi,
    functionName: 'mint',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatTokenAbi}__ and `functionName` set to `"multicall"`
 */
export const useSimulateRahatTokenMulticall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatTokenAbi,
    functionName: 'multicall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatTokenAbi}__ and `functionName` set to `"removeOwner"`
 */
export const useSimulateRahatTokenRemoveOwner =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatTokenAbi,
    functionName: 'removeOwner',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatTokenAbi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateRahatTokenTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatTokenAbi,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatTokenAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateRahatTokenTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatTokenAbi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatTokenAbi}__
 */
export const useWatchRahatTokenEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: rahatTokenAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatTokenAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchRahatTokenApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatTokenAbi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatTokenAbi}__ and `eventName` set to `"OwnerAdded"`
 */
export const useWatchRahatTokenOwnerAddedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatTokenAbi,
    eventName: 'OwnerAdded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatTokenAbi}__ and `eventName` set to `"OwnerRemoved"`
 */
export const useWatchRahatTokenOwnerRemovedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatTokenAbi,
    eventName: 'OwnerRemoved',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatTokenAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchRahatTokenTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatTokenAbi,
    eventName: 'Transfer',
  })
