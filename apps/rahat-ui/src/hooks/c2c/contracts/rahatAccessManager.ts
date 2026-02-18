import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RahatAccessManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rahatAccessManagerAbi = [
  {
    type: 'constructor',
    inputs: [{ name: '_manager', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [{ name: 'operationId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'AccessManagerAlreadyScheduled',
  },
  { type: 'error', inputs: [], name: 'AccessManagerBadConfirmation' },
  {
    type: 'error',
    inputs: [{ name: 'operationId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'AccessManagerExpired',
  },
  {
    type: 'error',
    inputs: [
      { name: 'initialAdmin', internalType: 'address', type: 'address' },
    ],
    name: 'AccessManagerInvalidInitialAdmin',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'AccessManagerLockedAccount',
  },
  {
    type: 'error',
    inputs: [{ name: 'roleId', internalType: 'uint64', type: 'uint64' }],
    name: 'AccessManagerLockedRole',
  },
  {
    type: 'error',
    inputs: [{ name: 'operationId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'AccessManagerNotReady',
  },
  {
    type: 'error',
    inputs: [{ name: 'operationId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'AccessManagerNotScheduled',
  },
  {
    type: 'error',
    inputs: [
      { name: 'msgsender', internalType: 'address', type: 'address' },
      { name: 'roleId', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'AccessManagerUnauthorizedAccount',
  },
  {
    type: 'error',
    inputs: [
      { name: 'caller', internalType: 'address', type: 'address' },
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'selector', internalType: 'bytes4', type: 'bytes4' },
    ],
    name: 'AccessManagerUnauthorizedCall',
  },
  {
    type: 'error',
    inputs: [
      { name: 'msgsender', internalType: 'address', type: 'address' },
      { name: 'caller', internalType: 'address', type: 'address' },
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'selector', internalType: 'bytes4', type: 'bytes4' },
    ],
    name: 'AccessManagerUnauthorizedCancel',
  },
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AccessManagerUnauthorizedConsume',
  },
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AddressEmptyCode',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'AddressInsufficientBalance',
  },
  { type: 'error', inputs: [], name: 'FailedInnerCall' },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SafeCastOverflowedUintDowncast',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operationId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      { name: 'nonce', internalType: 'uint32', type: 'uint32', indexed: true },
    ],
    name: 'OperationCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operationId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      { name: 'nonce', internalType: 'uint32', type: 'uint32', indexed: true },
    ],
    name: 'OperationExecuted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operationId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      { name: 'nonce', internalType: 'uint32', type: 'uint32', indexed: true },
      {
        name: 'schedule',
        internalType: 'uint48',
        type: 'uint48',
        indexed: false,
      },
      {
        name: 'caller',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'target',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'OperationScheduled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'roleId', internalType: 'uint64', type: 'uint64', indexed: true },
      { name: 'admin', internalType: 'uint64', type: 'uint64', indexed: true },
    ],
    name: 'RoleAdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'roleId', internalType: 'uint64', type: 'uint64', indexed: true },
      { name: 'delay', internalType: 'uint32', type: 'uint32', indexed: false },
      { name: 'since', internalType: 'uint48', type: 'uint48', indexed: false },
    ],
    name: 'RoleGrantDelayChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'roleId', internalType: 'uint64', type: 'uint64', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'delay', internalType: 'uint32', type: 'uint32', indexed: false },
      { name: 'since', internalType: 'uint48', type: 'uint48', indexed: false },
      { name: 'newMember', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'RoleGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'roleId', internalType: 'uint64', type: 'uint64', indexed: true },
      {
        name: 'guardian',
        internalType: 'uint64',
        type: 'uint64',
        indexed: true,
      },
    ],
    name: 'RoleGuardianChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'roleId', internalType: 'uint64', type: 'uint64', indexed: true },
      { name: 'label', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'RoleLabel',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'roleId', internalType: 'uint64', type: 'uint64', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleRevoked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'target',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'delay', internalType: 'uint32', type: 'uint32', indexed: false },
      { name: 'since', internalType: 'uint48', type: 'uint48', indexed: false },
    ],
    name: 'TargetAdminDelayUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'target',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'closed', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'TargetClosed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'target',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'selector',
        internalType: 'bytes4',
        type: 'bytes4',
        indexed: false,
      },
      { name: 'roleId', internalType: 'uint64', type: 'uint64', indexed: true },
    ],
    name: 'TargetFunctionRoleUpdated',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'PUBLIC_ROLE',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'caller', internalType: 'address', type: 'address' },
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'selector', internalType: 'bytes4', type: 'bytes4' },
    ],
    name: 'canCall',
    outputs: [
      { name: 'immediate', internalType: 'bool', type: 'bool' },
      { name: 'delay', internalType: 'uint32', type: 'uint32' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'caller', internalType: 'address', type: 'address' },
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'cancel',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'caller', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'consumeScheduledOp',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'execute',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'expiration',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'roleId', internalType: 'uint64', type: 'uint64' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'getAccess',
    outputs: [
      { name: 'since', internalType: 'uint48', type: 'uint48' },
      { name: 'currentDelay', internalType: 'uint32', type: 'uint32' },
      { name: 'pendingDelay', internalType: 'uint32', type: 'uint32' },
      { name: 'effect', internalType: 'uint48', type: 'uint48' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getNonce',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'roleId', internalType: 'uint64', type: 'uint64' }],
    name: 'getRoleAdmin',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'roleId', internalType: 'uint64', type: 'uint64' }],
    name: 'getRoleGrantDelay',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'roleId', internalType: 'uint64', type: 'uint64' }],
    name: 'getRoleGuardian',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getSchedule',
    outputs: [{ name: '', internalType: 'uint48', type: 'uint48' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'getTargetAdminDelay',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'selector', internalType: 'bytes4', type: 'bytes4' },
    ],
    name: 'getTargetFunctionRole',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'roleId', internalType: 'uint64', type: 'uint64' },
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'executionDelay', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'roleId', internalType: 'uint64', type: 'uint64' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [
      { name: 'isMember', internalType: 'bool', type: 'bool' },
      { name: 'executionDelay', internalType: 'uint32', type: 'uint32' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'caller', internalType: 'address', type: 'address' },
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'hashOperation',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'isTargetClosed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'roleId', internalType: 'uint64', type: 'uint64' },
      { name: 'label', internalType: 'string', type: 'string' },
    ],
    name: 'labelRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'minSetback',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
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
    inputs: [
      { name: 'roleId', internalType: 'uint64', type: 'uint64' },
      { name: 'callerConfirmation', internalType: 'address', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'roleId', internalType: 'uint64', type: 'uint64' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'when', internalType: 'uint48', type: 'uint48' },
    ],
    name: 'schedule',
    outputs: [
      { name: 'operationId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'nonce', internalType: 'uint32', type: 'uint32' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'roleId', internalType: 'uint64', type: 'uint64' },
      { name: 'newDelay', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'setGrantDelay',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'roleId', internalType: 'uint64', type: 'uint64' },
      { name: 'admin', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'setRoleAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'roleId', internalType: 'uint64', type: 'uint64' },
      { name: 'guardian', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'setRoleGuardian',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'newDelay', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'setTargetAdminDelay',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'closed', internalType: 'bool', type: 'bool' },
    ],
    name: 'setTargetClosed',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'selectors', internalType: 'bytes4[]', type: 'bytes4[]' },
      { name: 'roleId', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'setTargetFunctionRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'newAuthority', internalType: 'address', type: 'address' },
    ],
    name: 'updateAuthority',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__
 */
export const useReadRahatAccessManager = /*#__PURE__*/ createUseReadContract({
  abi: rahatAccessManagerAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"ADMIN_ROLE"`
 */
export const useReadRahatAccessManagerAdminRole =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatAccessManagerAbi,
    functionName: 'ADMIN_ROLE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"PUBLIC_ROLE"`
 */
export const useReadRahatAccessManagerPublicRole =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatAccessManagerAbi,
    functionName: 'PUBLIC_ROLE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"canCall"`
 */
export const useReadRahatAccessManagerCanCall =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatAccessManagerAbi,
    functionName: 'canCall',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"expiration"`
 */
export const useReadRahatAccessManagerExpiration =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatAccessManagerAbi,
    functionName: 'expiration',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"getAccess"`
 */
export const useReadRahatAccessManagerGetAccess =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatAccessManagerAbi,
    functionName: 'getAccess',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"getNonce"`
 */
export const useReadRahatAccessManagerGetNonce =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatAccessManagerAbi,
    functionName: 'getNonce',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"getRoleAdmin"`
 */
export const useReadRahatAccessManagerGetRoleAdmin =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatAccessManagerAbi,
    functionName: 'getRoleAdmin',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"getRoleGrantDelay"`
 */
export const useReadRahatAccessManagerGetRoleGrantDelay =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatAccessManagerAbi,
    functionName: 'getRoleGrantDelay',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"getRoleGuardian"`
 */
export const useReadRahatAccessManagerGetRoleGuardian =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatAccessManagerAbi,
    functionName: 'getRoleGuardian',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"getSchedule"`
 */
export const useReadRahatAccessManagerGetSchedule =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatAccessManagerAbi,
    functionName: 'getSchedule',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"getTargetAdminDelay"`
 */
export const useReadRahatAccessManagerGetTargetAdminDelay =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatAccessManagerAbi,
    functionName: 'getTargetAdminDelay',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"getTargetFunctionRole"`
 */
export const useReadRahatAccessManagerGetTargetFunctionRole =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatAccessManagerAbi,
    functionName: 'getTargetFunctionRole',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"hasRole"`
 */
export const useReadRahatAccessManagerHasRole =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatAccessManagerAbi,
    functionName: 'hasRole',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"hashOperation"`
 */
export const useReadRahatAccessManagerHashOperation =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatAccessManagerAbi,
    functionName: 'hashOperation',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"isTargetClosed"`
 */
export const useReadRahatAccessManagerIsTargetClosed =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatAccessManagerAbi,
    functionName: 'isTargetClosed',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"minSetback"`
 */
export const useReadRahatAccessManagerMinSetback =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatAccessManagerAbi,
    functionName: 'minSetback',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__
 */
export const useWriteRahatAccessManager = /*#__PURE__*/ createUseWriteContract({
  abi: rahatAccessManagerAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"cancel"`
 */
export const useWriteRahatAccessManagerCancel =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatAccessManagerAbi,
    functionName: 'cancel',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"consumeScheduledOp"`
 */
export const useWriteRahatAccessManagerConsumeScheduledOp =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatAccessManagerAbi,
    functionName: 'consumeScheduledOp',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"execute"`
 */
export const useWriteRahatAccessManagerExecute =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatAccessManagerAbi,
    functionName: 'execute',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"grantRole"`
 */
export const useWriteRahatAccessManagerGrantRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatAccessManagerAbi,
    functionName: 'grantRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"labelRole"`
 */
export const useWriteRahatAccessManagerLabelRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatAccessManagerAbi,
    functionName: 'labelRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"multicall"`
 */
export const useWriteRahatAccessManagerMulticall =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatAccessManagerAbi,
    functionName: 'multicall',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useWriteRahatAccessManagerRenounceRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatAccessManagerAbi,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useWriteRahatAccessManagerRevokeRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatAccessManagerAbi,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"schedule"`
 */
export const useWriteRahatAccessManagerSchedule =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatAccessManagerAbi,
    functionName: 'schedule',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"setGrantDelay"`
 */
export const useWriteRahatAccessManagerSetGrantDelay =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatAccessManagerAbi,
    functionName: 'setGrantDelay',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"setRoleAdmin"`
 */
export const useWriteRahatAccessManagerSetRoleAdmin =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatAccessManagerAbi,
    functionName: 'setRoleAdmin',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"setRoleGuardian"`
 */
export const useWriteRahatAccessManagerSetRoleGuardian =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatAccessManagerAbi,
    functionName: 'setRoleGuardian',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"setTargetAdminDelay"`
 */
export const useWriteRahatAccessManagerSetTargetAdminDelay =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatAccessManagerAbi,
    functionName: 'setTargetAdminDelay',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"setTargetClosed"`
 */
export const useWriteRahatAccessManagerSetTargetClosed =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatAccessManagerAbi,
    functionName: 'setTargetClosed',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"setTargetFunctionRole"`
 */
export const useWriteRahatAccessManagerSetTargetFunctionRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatAccessManagerAbi,
    functionName: 'setTargetFunctionRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"updateAuthority"`
 */
export const useWriteRahatAccessManagerUpdateAuthority =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatAccessManagerAbi,
    functionName: 'updateAuthority',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__
 */
export const useSimulateRahatAccessManager =
  /*#__PURE__*/ createUseSimulateContract({ abi: rahatAccessManagerAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"cancel"`
 */
export const useSimulateRahatAccessManagerCancel =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatAccessManagerAbi,
    functionName: 'cancel',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"consumeScheduledOp"`
 */
export const useSimulateRahatAccessManagerConsumeScheduledOp =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatAccessManagerAbi,
    functionName: 'consumeScheduledOp',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"execute"`
 */
export const useSimulateRahatAccessManagerExecute =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatAccessManagerAbi,
    functionName: 'execute',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"grantRole"`
 */
export const useSimulateRahatAccessManagerGrantRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatAccessManagerAbi,
    functionName: 'grantRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"labelRole"`
 */
export const useSimulateRahatAccessManagerLabelRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatAccessManagerAbi,
    functionName: 'labelRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"multicall"`
 */
export const useSimulateRahatAccessManagerMulticall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatAccessManagerAbi,
    functionName: 'multicall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useSimulateRahatAccessManagerRenounceRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatAccessManagerAbi,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useSimulateRahatAccessManagerRevokeRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatAccessManagerAbi,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"schedule"`
 */
export const useSimulateRahatAccessManagerSchedule =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatAccessManagerAbi,
    functionName: 'schedule',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"setGrantDelay"`
 */
export const useSimulateRahatAccessManagerSetGrantDelay =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatAccessManagerAbi,
    functionName: 'setGrantDelay',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"setRoleAdmin"`
 */
export const useSimulateRahatAccessManagerSetRoleAdmin =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatAccessManagerAbi,
    functionName: 'setRoleAdmin',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"setRoleGuardian"`
 */
export const useSimulateRahatAccessManagerSetRoleGuardian =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatAccessManagerAbi,
    functionName: 'setRoleGuardian',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"setTargetAdminDelay"`
 */
export const useSimulateRahatAccessManagerSetTargetAdminDelay =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatAccessManagerAbi,
    functionName: 'setTargetAdminDelay',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"setTargetClosed"`
 */
export const useSimulateRahatAccessManagerSetTargetClosed =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatAccessManagerAbi,
    functionName: 'setTargetClosed',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"setTargetFunctionRole"`
 */
export const useSimulateRahatAccessManagerSetTargetFunctionRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatAccessManagerAbi,
    functionName: 'setTargetFunctionRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `functionName` set to `"updateAuthority"`
 */
export const useSimulateRahatAccessManagerUpdateAuthority =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatAccessManagerAbi,
    functionName: 'updateAuthority',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatAccessManagerAbi}__
 */
export const useWatchRahatAccessManagerEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: rahatAccessManagerAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `eventName` set to `"OperationCanceled"`
 */
export const useWatchRahatAccessManagerOperationCanceledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatAccessManagerAbi,
    eventName: 'OperationCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `eventName` set to `"OperationExecuted"`
 */
export const useWatchRahatAccessManagerOperationExecutedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatAccessManagerAbi,
    eventName: 'OperationExecuted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `eventName` set to `"OperationScheduled"`
 */
export const useWatchRahatAccessManagerOperationScheduledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatAccessManagerAbi,
    eventName: 'OperationScheduled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `eventName` set to `"RoleAdminChanged"`
 */
export const useWatchRahatAccessManagerRoleAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatAccessManagerAbi,
    eventName: 'RoleAdminChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `eventName` set to `"RoleGrantDelayChanged"`
 */
export const useWatchRahatAccessManagerRoleGrantDelayChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatAccessManagerAbi,
    eventName: 'RoleGrantDelayChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `eventName` set to `"RoleGranted"`
 */
export const useWatchRahatAccessManagerRoleGrantedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatAccessManagerAbi,
    eventName: 'RoleGranted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `eventName` set to `"RoleGuardianChanged"`
 */
export const useWatchRahatAccessManagerRoleGuardianChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatAccessManagerAbi,
    eventName: 'RoleGuardianChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `eventName` set to `"RoleLabel"`
 */
export const useWatchRahatAccessManagerRoleLabelEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatAccessManagerAbi,
    eventName: 'RoleLabel',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `eventName` set to `"RoleRevoked"`
 */
export const useWatchRahatAccessManagerRoleRevokedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatAccessManagerAbi,
    eventName: 'RoleRevoked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `eventName` set to `"TargetAdminDelayUpdated"`
 */
export const useWatchRahatAccessManagerTargetAdminDelayUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatAccessManagerAbi,
    eventName: 'TargetAdminDelayUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `eventName` set to `"TargetClosed"`
 */
export const useWatchRahatAccessManagerTargetClosedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatAccessManagerAbi,
    eventName: 'TargetClosed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatAccessManagerAbi}__ and `eventName` set to `"TargetFunctionRoleUpdated"`
 */
export const useWatchRahatAccessManagerTargetFunctionRoleUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatAccessManagerAbi,
    eventName: 'TargetFunctionRoleUpdated',
  })
