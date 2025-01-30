// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CVAProject
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const cvaProjectAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_defaultToken', internalType: 'address', type: 'address' },
      { name: '_rahatClaim', internalType: 'address', type: 'address' },
      { name: '_otpServerAddress', internalType: 'address', type: 'address' },
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
        name: 'amount',
        internalType: 'int256',
        type: 'int256',
        indexed: false,
      },
    ],
    name: 'ClaimAdjusted',
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
        name: 'amount',
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
    name: 'ClaimProcessed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OtpServerUpdated',
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
      { name: '_from', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'acceptToken',
    outputs: [],
    stateMutability: 'nonpayable',
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
      { name: '_address', internalType: 'address', type: 'address' },
      { name: '_claimAmount', internalType: 'uint256', type: 'uint256' },
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
    name: 'defaultToken',
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
    inputs: [],
    name: 'otpServerAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_benAddress', internalType: 'address', type: 'address' },
      { name: '_otp', internalType: 'string', type: 'string' },
    ],
    name: 'processTokenRequest',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [
      { name: '_benAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
      { name: '_otpServerAddress', internalType: 'address', type: 'address' },
    ],
    name: 'requestTokenFromBeneficiary',
    outputs: [{ name: 'requestId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_benAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'requestTokenFromBeneficiary',
    outputs: [{ name: 'requestId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_benAddress', internalType: 'address', type: 'address' },
      { name: '_vendorAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'sendBeneficiaryTokenToVendor',
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
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'tokenRequestIds',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalClaimsAssgined',
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
  {
    type: 'function',
    inputs: [{ name: '_address', internalType: 'address', type: 'address' }],
    name: 'updateOtpServer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_withdrawAddress', internalType: 'address', type: 'address' },
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cvaProjectAbi}__
 */
export const useReadCvaProject = /*#__PURE__*/ createUseReadContract({
  abi: cvaProjectAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"IID_RAHAT_PROJECT"`
 */
export const useReadCvaProjectIidRahatProject =
  /*#__PURE__*/ createUseReadContract({
    abi: cvaProjectAbi,
    functionName: 'IID_RAHAT_PROJECT',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"RahatClaim"`
 */
export const useReadCvaProjectRahatClaim = /*#__PURE__*/ createUseReadContract({
  abi: cvaProjectAbi,
  functionName: 'RahatClaim',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"beneficiaryClaims"`
 */
export const useReadCvaProjectBeneficiaryClaims =
  /*#__PURE__*/ createUseReadContract({
    abi: cvaProjectAbi,
    functionName: 'beneficiaryClaims',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"beneficiaryCount"`
 */
export const useReadCvaProjectBeneficiaryCount =
  /*#__PURE__*/ createUseReadContract({
    abi: cvaProjectAbi,
    functionName: 'beneficiaryCount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"defaultToken"`
 */
export const useReadCvaProjectDefaultToken =
  /*#__PURE__*/ createUseReadContract({
    abi: cvaProjectAbi,
    functionName: 'defaultToken',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"isBeneficiary"`
 */
export const useReadCvaProjectIsBeneficiary =
  /*#__PURE__*/ createUseReadContract({
    abi: cvaProjectAbi,
    functionName: 'isBeneficiary',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"isDonor"`
 */
export const useReadCvaProjectIsDonor = /*#__PURE__*/ createUseReadContract({
  abi: cvaProjectAbi,
  functionName: 'isDonor',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"isTrustedForwarder"`
 */
export const useReadCvaProjectIsTrustedForwarder =
  /*#__PURE__*/ createUseReadContract({
    abi: cvaProjectAbi,
    functionName: 'isTrustedForwarder',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"name"`
 */
export const useReadCvaProjectName = /*#__PURE__*/ createUseReadContract({
  abi: cvaProjectAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"otpServerAddress"`
 */
export const useReadCvaProjectOtpServerAddress =
  /*#__PURE__*/ createUseReadContract({
    abi: cvaProjectAbi,
    functionName: 'otpServerAddress',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadCvaProjectSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: cvaProjectAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"tokenBudget"`
 */
export const useReadCvaProjectTokenBudget = /*#__PURE__*/ createUseReadContract(
  { abi: cvaProjectAbi, functionName: 'tokenBudget' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"tokenRequestIds"`
 */
export const useReadCvaProjectTokenRequestIds =
  /*#__PURE__*/ createUseReadContract({
    abi: cvaProjectAbi,
    functionName: 'tokenRequestIds',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"totalClaimsAssgined"`
 */
export const useReadCvaProjectTotalClaimsAssgined =
  /*#__PURE__*/ createUseReadContract({
    abi: cvaProjectAbi,
    functionName: 'totalClaimsAssgined',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"trustedForwarder"`
 */
export const useReadCvaProjectTrustedForwarder =
  /*#__PURE__*/ createUseReadContract({
    abi: cvaProjectAbi,
    functionName: 'trustedForwarder',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link cvaProjectAbi}__
 */
export const useWriteCvaProject = /*#__PURE__*/ createUseWriteContract({
  abi: cvaProjectAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"acceptToken"`
 */
export const useWriteCvaProjectAcceptToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: cvaProjectAbi,
    functionName: 'acceptToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"addBeneficiary"`
 */
export const useWriteCvaProjectAddBeneficiary =
  /*#__PURE__*/ createUseWriteContract({
    abi: cvaProjectAbi,
    functionName: 'addBeneficiary',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"assignClaims"`
 */
export const useWriteCvaProjectAssignClaims =
  /*#__PURE__*/ createUseWriteContract({
    abi: cvaProjectAbi,
    functionName: 'assignClaims',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"multicall"`
 */
export const useWriteCvaProjectMulticall = /*#__PURE__*/ createUseWriteContract(
  { abi: cvaProjectAbi, functionName: 'multicall' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"processTokenRequest"`
 */
export const useWriteCvaProjectProcessTokenRequest =
  /*#__PURE__*/ createUseWriteContract({
    abi: cvaProjectAbi,
    functionName: 'processTokenRequest',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"removeBeneficiary"`
 */
export const useWriteCvaProjectRemoveBeneficiary =
  /*#__PURE__*/ createUseWriteContract({
    abi: cvaProjectAbi,
    functionName: 'removeBeneficiary',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"requestTokenFromBeneficiary"`
 */
export const useWriteCvaProjectRequestTokenFromBeneficiary =
  /*#__PURE__*/ createUseWriteContract({
    abi: cvaProjectAbi,
    functionName: 'requestTokenFromBeneficiary',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"sendBeneficiaryTokenToVendor"`
 */
export const useWriteCvaProjectSendBeneficiaryTokenToVendor =
  /*#__PURE__*/ createUseWriteContract({
    abi: cvaProjectAbi,
    functionName: 'sendBeneficiaryTokenToVendor',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"updateOtpServer"`
 */
export const useWriteCvaProjectUpdateOtpServer =
  /*#__PURE__*/ createUseWriteContract({
    abi: cvaProjectAbi,
    functionName: 'updateOtpServer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"withdrawToken"`
 */
export const useWriteCvaProjectWithdrawToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: cvaProjectAbi,
    functionName: 'withdrawToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link cvaProjectAbi}__
 */
export const useSimulateCvaProject = /*#__PURE__*/ createUseSimulateContract({
  abi: cvaProjectAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"acceptToken"`
 */
export const useSimulateCvaProjectAcceptToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: cvaProjectAbi,
    functionName: 'acceptToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"addBeneficiary"`
 */
export const useSimulateCvaProjectAddBeneficiary =
  /*#__PURE__*/ createUseSimulateContract({
    abi: cvaProjectAbi,
    functionName: 'addBeneficiary',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"assignClaims"`
 */
export const useSimulateCvaProjectAssignClaims =
  /*#__PURE__*/ createUseSimulateContract({
    abi: cvaProjectAbi,
    functionName: 'assignClaims',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"multicall"`
 */
export const useSimulateCvaProjectMulticall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: cvaProjectAbi,
    functionName: 'multicall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"processTokenRequest"`
 */
export const useSimulateCvaProjectProcessTokenRequest =
  /*#__PURE__*/ createUseSimulateContract({
    abi: cvaProjectAbi,
    functionName: 'processTokenRequest',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"removeBeneficiary"`
 */
export const useSimulateCvaProjectRemoveBeneficiary =
  /*#__PURE__*/ createUseSimulateContract({
    abi: cvaProjectAbi,
    functionName: 'removeBeneficiary',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"requestTokenFromBeneficiary"`
 */
export const useSimulateCvaProjectRequestTokenFromBeneficiary =
  /*#__PURE__*/ createUseSimulateContract({
    abi: cvaProjectAbi,
    functionName: 'requestTokenFromBeneficiary',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"sendBeneficiaryTokenToVendor"`
 */
export const useSimulateCvaProjectSendBeneficiaryTokenToVendor =
  /*#__PURE__*/ createUseSimulateContract({
    abi: cvaProjectAbi,
    functionName: 'sendBeneficiaryTokenToVendor',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"updateOtpServer"`
 */
export const useSimulateCvaProjectUpdateOtpServer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: cvaProjectAbi,
    functionName: 'updateOtpServer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link cvaProjectAbi}__ and `functionName` set to `"withdrawToken"`
 */
export const useSimulateCvaProjectWithdrawToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: cvaProjectAbi,
    functionName: 'withdrawToken',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link cvaProjectAbi}__
 */
export const useWatchCvaProjectEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: cvaProjectAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link cvaProjectAbi}__ and `eventName` set to `"BeneficiaryAdded"`
 */
export const useWatchCvaProjectBeneficiaryAddedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: cvaProjectAbi,
    eventName: 'BeneficiaryAdded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link cvaProjectAbi}__ and `eventName` set to `"BeneficiaryRemoved"`
 */
export const useWatchCvaProjectBeneficiaryRemovedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: cvaProjectAbi,
    eventName: 'BeneficiaryRemoved',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link cvaProjectAbi}__ and `eventName` set to `"ClaimAdjusted"`
 */
export const useWatchCvaProjectClaimAdjustedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: cvaProjectAbi,
    eventName: 'ClaimAdjusted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link cvaProjectAbi}__ and `eventName` set to `"ClaimAssigned"`
 */
export const useWatchCvaProjectClaimAssignedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: cvaProjectAbi,
    eventName: 'ClaimAssigned',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link cvaProjectAbi}__ and `eventName` set to `"ClaimProcessed"`
 */
export const useWatchCvaProjectClaimProcessedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: cvaProjectAbi,
    eventName: 'ClaimProcessed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link cvaProjectAbi}__ and `eventName` set to `"OtpServerUpdated"`
 */
export const useWatchCvaProjectOtpServerUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: cvaProjectAbi,
    eventName: 'OtpServerUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link cvaProjectAbi}__ and `eventName` set to `"TokenBudgetDecrease"`
 */
export const useWatchCvaProjectTokenBudgetDecreaseEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: cvaProjectAbi,
    eventName: 'TokenBudgetDecrease',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link cvaProjectAbi}__ and `eventName` set to `"TokenBudgetIncrease"`
 */
export const useWatchCvaProjectTokenBudgetIncreaseEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: cvaProjectAbi,
    eventName: 'TokenBudgetIncrease',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link cvaProjectAbi}__ and `eventName` set to `"TokenReceived"`
 */
export const useWatchCvaProjectTokenReceivedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: cvaProjectAbi,
    eventName: 'TokenReceived',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link cvaProjectAbi}__ and `eventName` set to `"TokenRegistered"`
 */
export const useWatchCvaProjectTokenRegisteredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: cvaProjectAbi,
    eventName: 'TokenRegistered',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link cvaProjectAbi}__ and `eventName` set to `"TokenTransfer"`
 */
export const useWatchCvaProjectTokenTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: cvaProjectAbi,
    eventName: 'TokenTransfer',
  })
