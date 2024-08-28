import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AccessManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const accessManagerAbi = [
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link accessManagerAbi}__
 */
export const useReadAccessManager = /*#__PURE__*/ createUseReadContract({
  abi: accessManagerAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"ADMIN_ROLE"`
 */
export const useReadAccessManagerAdminRole =
  /*#__PURE__*/ createUseReadContract({
    abi: accessManagerAbi,
    functionName: 'ADMIN_ROLE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"PUBLIC_ROLE"`
 */
export const useReadAccessManagerPublicRole =
  /*#__PURE__*/ createUseReadContract({
    abi: accessManagerAbi,
    functionName: 'PUBLIC_ROLE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"canCall"`
 */
export const useReadAccessManagerCanCall = /*#__PURE__*/ createUseReadContract({
  abi: accessManagerAbi,
  functionName: 'canCall',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"expiration"`
 */
export const useReadAccessManagerExpiration =
  /*#__PURE__*/ createUseReadContract({
    abi: accessManagerAbi,
    functionName: 'expiration',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"getAccess"`
 */
export const useReadAccessManagerGetAccess =
  /*#__PURE__*/ createUseReadContract({
    abi: accessManagerAbi,
    functionName: 'getAccess',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"getNonce"`
 */
export const useReadAccessManagerGetNonce = /*#__PURE__*/ createUseReadContract(
  { abi: accessManagerAbi, functionName: 'getNonce' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"getRoleAdmin"`
 */
export const useReadAccessManagerGetRoleAdmin =
  /*#__PURE__*/ createUseReadContract({
    abi: accessManagerAbi,
    functionName: 'getRoleAdmin',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"getRoleGrantDelay"`
 */
export const useReadAccessManagerGetRoleGrantDelay =
  /*#__PURE__*/ createUseReadContract({
    abi: accessManagerAbi,
    functionName: 'getRoleGrantDelay',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"getRoleGuardian"`
 */
export const useReadAccessManagerGetRoleGuardian =
  /*#__PURE__*/ createUseReadContract({
    abi: accessManagerAbi,
    functionName: 'getRoleGuardian',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"getSchedule"`
 */
export const useReadAccessManagerGetSchedule =
  /*#__PURE__*/ createUseReadContract({
    abi: accessManagerAbi,
    functionName: 'getSchedule',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"getTargetAdminDelay"`
 */
export const useReadAccessManagerGetTargetAdminDelay =
  /*#__PURE__*/ createUseReadContract({
    abi: accessManagerAbi,
    functionName: 'getTargetAdminDelay',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"getTargetFunctionRole"`
 */
export const useReadAccessManagerGetTargetFunctionRole =
  /*#__PURE__*/ createUseReadContract({
    abi: accessManagerAbi,
    functionName: 'getTargetFunctionRole',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"hasRole"`
 */
export const useReadAccessManagerHasRole = /*#__PURE__*/ createUseReadContract({
  abi: accessManagerAbi,
  functionName: 'hasRole',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"hashOperation"`
 */
export const useReadAccessManagerHashOperation =
  /*#__PURE__*/ createUseReadContract({
    abi: accessManagerAbi,
    functionName: 'hashOperation',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"isTargetClosed"`
 */
export const useReadAccessManagerIsTargetClosed =
  /*#__PURE__*/ createUseReadContract({
    abi: accessManagerAbi,
    functionName: 'isTargetClosed',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"minSetback"`
 */
export const useReadAccessManagerMinSetback =
  /*#__PURE__*/ createUseReadContract({
    abi: accessManagerAbi,
    functionName: 'minSetback',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessManagerAbi}__
 */
export const useWriteAccessManager = /*#__PURE__*/ createUseWriteContract({
  abi: accessManagerAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"cancel"`
 */
export const useWriteAccessManagerCancel = /*#__PURE__*/ createUseWriteContract(
  { abi: accessManagerAbi, functionName: 'cancel' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"consumeScheduledOp"`
 */
export const useWriteAccessManagerConsumeScheduledOp =
  /*#__PURE__*/ createUseWriteContract({
    abi: accessManagerAbi,
    functionName: 'consumeScheduledOp',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"execute"`
 */
export const useWriteAccessManagerExecute =
  /*#__PURE__*/ createUseWriteContract({
    abi: accessManagerAbi,
    functionName: 'execute',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"grantRole"`
 */
export const useWriteAccessManagerGrantRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: accessManagerAbi,
    functionName: 'grantRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"labelRole"`
 */
export const useWriteAccessManagerLabelRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: accessManagerAbi,
    functionName: 'labelRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"multicall"`
 */
export const useWriteAccessManagerMulticall =
  /*#__PURE__*/ createUseWriteContract({
    abi: accessManagerAbi,
    functionName: 'multicall',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useWriteAccessManagerRenounceRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: accessManagerAbi,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useWriteAccessManagerRevokeRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: accessManagerAbi,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"schedule"`
 */
export const useWriteAccessManagerSchedule =
  /*#__PURE__*/ createUseWriteContract({
    abi: accessManagerAbi,
    functionName: 'schedule',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"setGrantDelay"`
 */
export const useWriteAccessManagerSetGrantDelay =
  /*#__PURE__*/ createUseWriteContract({
    abi: accessManagerAbi,
    functionName: 'setGrantDelay',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"setRoleAdmin"`
 */
export const useWriteAccessManagerSetRoleAdmin =
  /*#__PURE__*/ createUseWriteContract({
    abi: accessManagerAbi,
    functionName: 'setRoleAdmin',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"setRoleGuardian"`
 */
export const useWriteAccessManagerSetRoleGuardian =
  /*#__PURE__*/ createUseWriteContract({
    abi: accessManagerAbi,
    functionName: 'setRoleGuardian',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"setTargetAdminDelay"`
 */
export const useWriteAccessManagerSetTargetAdminDelay =
  /*#__PURE__*/ createUseWriteContract({
    abi: accessManagerAbi,
    functionName: 'setTargetAdminDelay',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"setTargetClosed"`
 */
export const useWriteAccessManagerSetTargetClosed =
  /*#__PURE__*/ createUseWriteContract({
    abi: accessManagerAbi,
    functionName: 'setTargetClosed',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"setTargetFunctionRole"`
 */
export const useWriteAccessManagerSetTargetFunctionRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: accessManagerAbi,
    functionName: 'setTargetFunctionRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"updateAuthority"`
 */
export const useWriteAccessManagerUpdateAuthority =
  /*#__PURE__*/ createUseWriteContract({
    abi: accessManagerAbi,
    functionName: 'updateAuthority',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessManagerAbi}__
 */
export const useSimulateAccessManager = /*#__PURE__*/ createUseSimulateContract(
  { abi: accessManagerAbi },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"cancel"`
 */
export const useSimulateAccessManagerCancel =
  /*#__PURE__*/ createUseSimulateContract({
    abi: accessManagerAbi,
    functionName: 'cancel',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"consumeScheduledOp"`
 */
export const useSimulateAccessManagerConsumeScheduledOp =
  /*#__PURE__*/ createUseSimulateContract({
    abi: accessManagerAbi,
    functionName: 'consumeScheduledOp',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"execute"`
 */
export const useSimulateAccessManagerExecute =
  /*#__PURE__*/ createUseSimulateContract({
    abi: accessManagerAbi,
    functionName: 'execute',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"grantRole"`
 */
export const useSimulateAccessManagerGrantRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: accessManagerAbi,
    functionName: 'grantRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"labelRole"`
 */
export const useSimulateAccessManagerLabelRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: accessManagerAbi,
    functionName: 'labelRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"multicall"`
 */
export const useSimulateAccessManagerMulticall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: accessManagerAbi,
    functionName: 'multicall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useSimulateAccessManagerRenounceRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: accessManagerAbi,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useSimulateAccessManagerRevokeRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: accessManagerAbi,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"schedule"`
 */
export const useSimulateAccessManagerSchedule =
  /*#__PURE__*/ createUseSimulateContract({
    abi: accessManagerAbi,
    functionName: 'schedule',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"setGrantDelay"`
 */
export const useSimulateAccessManagerSetGrantDelay =
  /*#__PURE__*/ createUseSimulateContract({
    abi: accessManagerAbi,
    functionName: 'setGrantDelay',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"setRoleAdmin"`
 */
export const useSimulateAccessManagerSetRoleAdmin =
  /*#__PURE__*/ createUseSimulateContract({
    abi: accessManagerAbi,
    functionName: 'setRoleAdmin',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"setRoleGuardian"`
 */
export const useSimulateAccessManagerSetRoleGuardian =
  /*#__PURE__*/ createUseSimulateContract({
    abi: accessManagerAbi,
    functionName: 'setRoleGuardian',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"setTargetAdminDelay"`
 */
export const useSimulateAccessManagerSetTargetAdminDelay =
  /*#__PURE__*/ createUseSimulateContract({
    abi: accessManagerAbi,
    functionName: 'setTargetAdminDelay',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"setTargetClosed"`
 */
export const useSimulateAccessManagerSetTargetClosed =
  /*#__PURE__*/ createUseSimulateContract({
    abi: accessManagerAbi,
    functionName: 'setTargetClosed',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"setTargetFunctionRole"`
 */
export const useSimulateAccessManagerSetTargetFunctionRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: accessManagerAbi,
    functionName: 'setTargetFunctionRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"updateAuthority"`
 */
export const useSimulateAccessManagerUpdateAuthority =
  /*#__PURE__*/ createUseSimulateContract({
    abi: accessManagerAbi,
    functionName: 'updateAuthority',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link accessManagerAbi}__
 */
export const useWatchAccessManagerEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: accessManagerAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link accessManagerAbi}__ and `eventName` set to `"OperationCanceled"`
 */
export const useWatchAccessManagerOperationCanceledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: accessManagerAbi,
    eventName: 'OperationCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link accessManagerAbi}__ and `eventName` set to `"OperationExecuted"`
 */
export const useWatchAccessManagerOperationExecutedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: accessManagerAbi,
    eventName: 'OperationExecuted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link accessManagerAbi}__ and `eventName` set to `"OperationScheduled"`
 */
export const useWatchAccessManagerOperationScheduledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: accessManagerAbi,
    eventName: 'OperationScheduled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link accessManagerAbi}__ and `eventName` set to `"RoleAdminChanged"`
 */
export const useWatchAccessManagerRoleAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: accessManagerAbi,
    eventName: 'RoleAdminChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link accessManagerAbi}__ and `eventName` set to `"RoleGrantDelayChanged"`
 */
export const useWatchAccessManagerRoleGrantDelayChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: accessManagerAbi,
    eventName: 'RoleGrantDelayChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link accessManagerAbi}__ and `eventName` set to `"RoleGranted"`
 */
export const useWatchAccessManagerRoleGrantedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: accessManagerAbi,
    eventName: 'RoleGranted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link accessManagerAbi}__ and `eventName` set to `"RoleGuardianChanged"`
 */
export const useWatchAccessManagerRoleGuardianChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: accessManagerAbi,
    eventName: 'RoleGuardianChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link accessManagerAbi}__ and `eventName` set to `"RoleLabel"`
 */
export const useWatchAccessManagerRoleLabelEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: accessManagerAbi,
    eventName: 'RoleLabel',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link accessManagerAbi}__ and `eventName` set to `"RoleRevoked"`
 */
export const useWatchAccessManagerRoleRevokedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: accessManagerAbi,
    eventName: 'RoleRevoked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link accessManagerAbi}__ and `eventName` set to `"TargetAdminDelayUpdated"`
 */
export const useWatchAccessManagerTargetAdminDelayUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: accessManagerAbi,
    eventName: 'TargetAdminDelayUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link accessManagerAbi}__ and `eventName` set to `"TargetClosed"`
 */
export const useWatchAccessManagerTargetClosedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: accessManagerAbi,
    eventName: 'TargetClosed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link accessManagerAbi}__ and `eventName` set to `"TargetFunctionRoleUpdated"`
 */
export const useWatchAccessManagerTargetFunctionRoleUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: accessManagerAbi,
    eventName: 'TargetFunctionRoleUpdated',
  })
