import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RahatCommunity
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rahatCommunityAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_admin', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'AccessControlBadConfirmation' },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'neededRole', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'AccessControlUnauthorizedAccount',
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
        name: 'requestor',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'project',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ProjectApprovalRequest',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'ProjectApproved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'ProjectRevoked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '', internalType: 'address', type: 'address', indexed: false },
      { name: '', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Received',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'previousAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'newAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'RoleAdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleRevoked',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
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
    name: 'VENDOR_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
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
      { name: '_projectAddress', internalType: 'address', type: 'address' },
    ],
    name: 'approveProject',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_role', internalType: 'bytes32', type: 'bytes32' },
      { name: '_account', internalType: 'address', type: 'address' },
    ],
    name: 'grantRoleWithEth',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_address', internalType: 'address', type: 'address' }],
    name: 'isAdmin',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'isBeneficiary',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'isProject',
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
    inputs: [{ name: '_address', internalType: 'address', type: 'address' }],
    name: 'removeBeneficiary',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'callerConfirmation', internalType: 'address', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_projectAddress', internalType: 'address', type: 'address' },
    ],
    name: 'requestProjectApproval',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_projectAddress', internalType: 'address', type: 'address' },
    ],
    name: 'revokeProject',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'revokeRole',
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
    inputs: [{ name: '_to', internalType: 'address payable', type: 'address' }],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'payable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCommunityAbi}__
 */
export const useReadRahatCommunity = /*#__PURE__*/ createUseReadContract({
  abi: rahatCommunityAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCommunityAbi}__ and `functionName` set to `"DEFAULT_ADMIN_ROLE"`
 */
export const useReadRahatCommunityDefaultAdminRole =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatCommunityAbi,
    functionName: 'DEFAULT_ADMIN_ROLE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCommunityAbi}__ and `functionName` set to `"IID_RAHAT_PROJECT"`
 */
export const useReadRahatCommunityIidRahatProject =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatCommunityAbi,
    functionName: 'IID_RAHAT_PROJECT',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCommunityAbi}__ and `functionName` set to `"VENDOR_ROLE"`
 */
export const useReadRahatCommunityVendorRole =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatCommunityAbi,
    functionName: 'VENDOR_ROLE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCommunityAbi}__ and `functionName` set to `"getRoleAdmin"`
 */
export const useReadRahatCommunityGetRoleAdmin =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatCommunityAbi,
    functionName: 'getRoleAdmin',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCommunityAbi}__ and `functionName` set to `"hasRole"`
 */
export const useReadRahatCommunityHasRole = /*#__PURE__*/ createUseReadContract(
  { abi: rahatCommunityAbi, functionName: 'hasRole' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCommunityAbi}__ and `functionName` set to `"isAdmin"`
 */
export const useReadRahatCommunityIsAdmin = /*#__PURE__*/ createUseReadContract(
  { abi: rahatCommunityAbi, functionName: 'isAdmin' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCommunityAbi}__ and `functionName` set to `"isBeneficiary"`
 */
export const useReadRahatCommunityIsBeneficiary =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatCommunityAbi,
    functionName: 'isBeneficiary',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCommunityAbi}__ and `functionName` set to `"isProject"`
 */
export const useReadRahatCommunityIsProject =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatCommunityAbi,
    functionName: 'isProject',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCommunityAbi}__ and `functionName` set to `"name"`
 */
export const useReadRahatCommunityName = /*#__PURE__*/ createUseReadContract({
  abi: rahatCommunityAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatCommunityAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadRahatCommunitySupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatCommunityAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatCommunityAbi}__
 */
export const useWriteRahatCommunity = /*#__PURE__*/ createUseWriteContract({
  abi: rahatCommunityAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatCommunityAbi}__ and `functionName` set to `"addBeneficiary"`
 */
export const useWriteRahatCommunityAddBeneficiary =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatCommunityAbi,
    functionName: 'addBeneficiary',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatCommunityAbi}__ and `functionName` set to `"approveProject"`
 */
export const useWriteRahatCommunityApproveProject =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatCommunityAbi,
    functionName: 'approveProject',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatCommunityAbi}__ and `functionName` set to `"grantRole"`
 */
export const useWriteRahatCommunityGrantRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatCommunityAbi,
    functionName: 'grantRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatCommunityAbi}__ and `functionName` set to `"grantRoleWithEth"`
 */
export const useWriteRahatCommunityGrantRoleWithEth =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatCommunityAbi,
    functionName: 'grantRoleWithEth',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatCommunityAbi}__ and `functionName` set to `"multicall"`
 */
export const useWriteRahatCommunityMulticall =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatCommunityAbi,
    functionName: 'multicall',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatCommunityAbi}__ and `functionName` set to `"removeBeneficiary"`
 */
export const useWriteRahatCommunityRemoveBeneficiary =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatCommunityAbi,
    functionName: 'removeBeneficiary',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatCommunityAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useWriteRahatCommunityRenounceRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatCommunityAbi,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatCommunityAbi}__ and `functionName` set to `"requestProjectApproval"`
 */
export const useWriteRahatCommunityRequestProjectApproval =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatCommunityAbi,
    functionName: 'requestProjectApproval',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatCommunityAbi}__ and `functionName` set to `"revokeProject"`
 */
export const useWriteRahatCommunityRevokeProject =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatCommunityAbi,
    functionName: 'revokeProject',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatCommunityAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useWriteRahatCommunityRevokeRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatCommunityAbi,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatCommunityAbi}__ and `functionName` set to `"withdraw"`
 */
export const useWriteRahatCommunityWithdraw =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatCommunityAbi,
    functionName: 'withdraw',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatCommunityAbi}__
 */
export const useSimulateRahatCommunity =
  /*#__PURE__*/ createUseSimulateContract({ abi: rahatCommunityAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatCommunityAbi}__ and `functionName` set to `"addBeneficiary"`
 */
export const useSimulateRahatCommunityAddBeneficiary =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatCommunityAbi,
    functionName: 'addBeneficiary',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatCommunityAbi}__ and `functionName` set to `"approveProject"`
 */
export const useSimulateRahatCommunityApproveProject =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatCommunityAbi,
    functionName: 'approveProject',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatCommunityAbi}__ and `functionName` set to `"grantRole"`
 */
export const useSimulateRahatCommunityGrantRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatCommunityAbi,
    functionName: 'grantRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatCommunityAbi}__ and `functionName` set to `"grantRoleWithEth"`
 */
export const useSimulateRahatCommunityGrantRoleWithEth =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatCommunityAbi,
    functionName: 'grantRoleWithEth',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatCommunityAbi}__ and `functionName` set to `"multicall"`
 */
export const useSimulateRahatCommunityMulticall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatCommunityAbi,
    functionName: 'multicall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatCommunityAbi}__ and `functionName` set to `"removeBeneficiary"`
 */
export const useSimulateRahatCommunityRemoveBeneficiary =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatCommunityAbi,
    functionName: 'removeBeneficiary',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatCommunityAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useSimulateRahatCommunityRenounceRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatCommunityAbi,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatCommunityAbi}__ and `functionName` set to `"requestProjectApproval"`
 */
export const useSimulateRahatCommunityRequestProjectApproval =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatCommunityAbi,
    functionName: 'requestProjectApproval',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatCommunityAbi}__ and `functionName` set to `"revokeProject"`
 */
export const useSimulateRahatCommunityRevokeProject =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatCommunityAbi,
    functionName: 'revokeProject',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatCommunityAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useSimulateRahatCommunityRevokeRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatCommunityAbi,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatCommunityAbi}__ and `functionName` set to `"withdraw"`
 */
export const useSimulateRahatCommunityWithdraw =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatCommunityAbi,
    functionName: 'withdraw',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatCommunityAbi}__
 */
export const useWatchRahatCommunityEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: rahatCommunityAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatCommunityAbi}__ and `eventName` set to `"BeneficiaryAdded"`
 */
export const useWatchRahatCommunityBeneficiaryAddedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatCommunityAbi,
    eventName: 'BeneficiaryAdded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatCommunityAbi}__ and `eventName` set to `"BeneficiaryRemoved"`
 */
export const useWatchRahatCommunityBeneficiaryRemovedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatCommunityAbi,
    eventName: 'BeneficiaryRemoved',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatCommunityAbi}__ and `eventName` set to `"ProjectApprovalRequest"`
 */
export const useWatchRahatCommunityProjectApprovalRequestEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatCommunityAbi,
    eventName: 'ProjectApprovalRequest',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatCommunityAbi}__ and `eventName` set to `"ProjectApproved"`
 */
export const useWatchRahatCommunityProjectApprovedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatCommunityAbi,
    eventName: 'ProjectApproved',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatCommunityAbi}__ and `eventName` set to `"ProjectRevoked"`
 */
export const useWatchRahatCommunityProjectRevokedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatCommunityAbi,
    eventName: 'ProjectRevoked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatCommunityAbi}__ and `eventName` set to `"Received"`
 */
export const useWatchRahatCommunityReceivedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatCommunityAbi,
    eventName: 'Received',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatCommunityAbi}__ and `eventName` set to `"RoleAdminChanged"`
 */
export const useWatchRahatCommunityRoleAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatCommunityAbi,
    eventName: 'RoleAdminChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatCommunityAbi}__ and `eventName` set to `"RoleGranted"`
 */
export const useWatchRahatCommunityRoleGrantedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatCommunityAbi,
    eventName: 'RoleGranted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatCommunityAbi}__ and `eventName` set to `"RoleRevoked"`
 */
export const useWatchRahatCommunityRoleRevokedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatCommunityAbi,
    eventName: 'RoleRevoked',
  })
