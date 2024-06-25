import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RahatDonor
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rahatDonorAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_admin', internalType: 'address', type: 'address' },
      { name: '_accessManager', internalType: 'address', type: 'address' },
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
    name: 'IID_RAHAT_DONOR',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'RahatTreasury',
    outputs: [
      { name: '', internalType: 'contract IRahatTreasury', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: '_registeredProject',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
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
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_ownerAddress', internalType: 'address', type: 'address' },
    ],
    name: 'addTokenOwner',
    outputs: [],
    stateMutability: 'nonpayable',
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
      { name: '_tokenFree', internalType: 'address', type: 'address' },
      { name: '_tokenReferral', internalType: 'address', type: 'address' },
      { name: '_projectAddress', internalType: 'address', type: 'address' },
      { name: '_amountFree', internalType: 'uint256', type: 'uint256' },
      { name: '_referralLimit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mintTokenAndApprove',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_tokenFree', internalType: 'address', type: 'address' },
      { name: '_tokenReferral', internalType: 'address', type: 'address' },
      { name: '_projectAddress', internalType: 'address', type: 'address' },
      { name: '_amountFree', internalType: 'uint256', type: 'uint256' },
      { name: '_descriptionFree', internalType: 'string', type: 'string' },
      { name: '_descriptionReferral', internalType: 'string', type: 'string' },
      { name: '_priceFree', internalType: 'uint256', type: 'uint256' },
      { name: '_priceReferral', internalType: 'uint256', type: 'uint256' },
      { name: '_referralLimit', internalType: 'uint256', type: 'uint256' },
      { name: '_currency', internalType: 'string', type: 'string' },
    ],
    name: 'mintTokenAndApproveDescription',
    outputs: [],
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
    name: 'ownerCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_projectAddress', internalType: 'address', type: 'address' },
      { name: 'status', internalType: 'bool', type: 'bool' },
    ],
    name: 'registerProject',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenToDollarValue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatDonorAbi}__
 */
export const useReadRahatDonor = /*#__PURE__*/ createUseReadContract({
  abi: rahatDonorAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatDonorAbi}__ and `functionName` set to `"AccessManager"`
 */
export const useReadRahatDonorAccessManager =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatDonorAbi,
    functionName: 'AccessManager',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatDonorAbi}__ and `functionName` set to `"IID_RAHAT_DONOR"`
 */
export const useReadRahatDonorIidRahatDonor =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatDonorAbi,
    functionName: 'IID_RAHAT_DONOR',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatDonorAbi}__ and `functionName` set to `"RahatTreasury"`
 */
export const useReadRahatDonorRahatTreasury =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatDonorAbi,
    functionName: 'RahatTreasury',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatDonorAbi}__ and `functionName` set to `"_registeredProject"`
 */
export const useReadRahatDonorRegisteredProject =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatDonorAbi,
    functionName: '_registeredProject',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatDonorAbi}__ and `functionName` set to `"getAllowanceAndBalance"`
 */
export const useReadRahatDonorGetAllowanceAndBalance =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatDonorAbi,
    functionName: 'getAllowanceAndBalance',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatDonorAbi}__ and `functionName` set to `"isOwner"`
 */
export const useReadRahatDonorIsOwner = /*#__PURE__*/ createUseReadContract({
  abi: rahatDonorAbi,
  functionName: 'isOwner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatDonorAbi}__ and `functionName` set to `"listOwners"`
 */
export const useReadRahatDonorListOwners = /*#__PURE__*/ createUseReadContract({
  abi: rahatDonorAbi,
  functionName: 'listOwners',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatDonorAbi}__ and `functionName` set to `"ownerCount"`
 */
export const useReadRahatDonorOwnerCount = /*#__PURE__*/ createUseReadContract({
  abi: rahatDonorAbi,
  functionName: 'ownerCount',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatDonorAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadRahatDonorSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatDonorAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatDonorAbi}__ and `functionName` set to `"tokenToDollarValue"`
 */
export const useReadRahatDonorTokenToDollarValue =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatDonorAbi,
    functionName: 'tokenToDollarValue',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatDonorAbi}__
 */
export const useWriteRahatDonor = /*#__PURE__*/ createUseWriteContract({
  abi: rahatDonorAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatDonorAbi}__ and `functionName` set to `"addOwner"`
 */
export const useWriteRahatDonorAddOwner = /*#__PURE__*/ createUseWriteContract({
  abi: rahatDonorAbi,
  functionName: 'addOwner',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatDonorAbi}__ and `functionName` set to `"addTokenOwner"`
 */
export const useWriteRahatDonorAddTokenOwner =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatDonorAbi,
    functionName: 'addTokenOwner',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatDonorAbi}__ and `functionName` set to `"approveToken"`
 */
export const useWriteRahatDonorApproveToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatDonorAbi,
    functionName: 'approveToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatDonorAbi}__ and `functionName` set to `"claimToken"`
 */
export const useWriteRahatDonorClaimToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatDonorAbi,
    functionName: 'claimToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatDonorAbi}__ and `functionName` set to `"mintToken"`
 */
export const useWriteRahatDonorMintToken = /*#__PURE__*/ createUseWriteContract(
  { abi: rahatDonorAbi, functionName: 'mintToken' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatDonorAbi}__ and `functionName` set to `"mintTokenAndApprove"`
 */
export const useWriteRahatDonorMintTokenAndApprove =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatDonorAbi,
    functionName: 'mintTokenAndApprove',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatDonorAbi}__ and `functionName` set to `"mintTokenAndApproveDescription"`
 */
export const useWriteRahatDonorMintTokenAndApproveDescription =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatDonorAbi,
    functionName: 'mintTokenAndApproveDescription',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatDonorAbi}__ and `functionName` set to `"multicall"`
 */
export const useWriteRahatDonorMulticall = /*#__PURE__*/ createUseWriteContract(
  { abi: rahatDonorAbi, functionName: 'multicall' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatDonorAbi}__ and `functionName` set to `"registerProject"`
 */
export const useWriteRahatDonorRegisterProject =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatDonorAbi,
    functionName: 'registerProject',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatDonorAbi}__ and `functionName` set to `"removeOwner"`
 */
export const useWriteRahatDonorRemoveOwner =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatDonorAbi,
    functionName: 'removeOwner',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatDonorAbi}__ and `functionName` set to `"transferFromToken"`
 */
export const useWriteRahatDonorTransferFromToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatDonorAbi,
    functionName: 'transferFromToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatDonorAbi}__ and `functionName` set to `"transferToken"`
 */
export const useWriteRahatDonorTransferToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatDonorAbi,
    functionName: 'transferToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatDonorAbi}__
 */
export const useSimulateRahatDonor = /*#__PURE__*/ createUseSimulateContract({
  abi: rahatDonorAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatDonorAbi}__ and `functionName` set to `"addOwner"`
 */
export const useSimulateRahatDonorAddOwner =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatDonorAbi,
    functionName: 'addOwner',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatDonorAbi}__ and `functionName` set to `"addTokenOwner"`
 */
export const useSimulateRahatDonorAddTokenOwner =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatDonorAbi,
    functionName: 'addTokenOwner',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatDonorAbi}__ and `functionName` set to `"approveToken"`
 */
export const useSimulateRahatDonorApproveToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatDonorAbi,
    functionName: 'approveToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatDonorAbi}__ and `functionName` set to `"claimToken"`
 */
export const useSimulateRahatDonorClaimToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatDonorAbi,
    functionName: 'claimToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatDonorAbi}__ and `functionName` set to `"mintToken"`
 */
export const useSimulateRahatDonorMintToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatDonorAbi,
    functionName: 'mintToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatDonorAbi}__ and `functionName` set to `"mintTokenAndApprove"`
 */
export const useSimulateRahatDonorMintTokenAndApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatDonorAbi,
    functionName: 'mintTokenAndApprove',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatDonorAbi}__ and `functionName` set to `"mintTokenAndApproveDescription"`
 */
export const useSimulateRahatDonorMintTokenAndApproveDescription =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatDonorAbi,
    functionName: 'mintTokenAndApproveDescription',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatDonorAbi}__ and `functionName` set to `"multicall"`
 */
export const useSimulateRahatDonorMulticall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatDonorAbi,
    functionName: 'multicall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatDonorAbi}__ and `functionName` set to `"registerProject"`
 */
export const useSimulateRahatDonorRegisterProject =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatDonorAbi,
    functionName: 'registerProject',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatDonorAbi}__ and `functionName` set to `"removeOwner"`
 */
export const useSimulateRahatDonorRemoveOwner =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatDonorAbi,
    functionName: 'removeOwner',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatDonorAbi}__ and `functionName` set to `"transferFromToken"`
 */
export const useSimulateRahatDonorTransferFromToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatDonorAbi,
    functionName: 'transferFromToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatDonorAbi}__ and `functionName` set to `"transferToken"`
 */
export const useSimulateRahatDonorTransferToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatDonorAbi,
    functionName: 'transferToken',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatDonorAbi}__
 */
export const useWatchRahatDonorEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: rahatDonorAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatDonorAbi}__ and `eventName` set to `"OwnerAdded"`
 */
export const useWatchRahatDonorOwnerAddedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatDonorAbi,
    eventName: 'OwnerAdded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatDonorAbi}__ and `eventName` set to `"OwnerRemoved"`
 */
export const useWatchRahatDonorOwnerRemovedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatDonorAbi,
    eventName: 'OwnerRemoved',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatDonorAbi}__ and `eventName` set to `"TokenCreated"`
 */
export const useWatchRahatDonorTokenCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatDonorAbi,
    eventName: 'TokenCreated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatDonorAbi}__ and `eventName` set to `"TokenMintedAndApproved"`
 */
export const useWatchRahatDonorTokenMintedAndApprovedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatDonorAbi,
    eventName: 'TokenMintedAndApproved',
  })
