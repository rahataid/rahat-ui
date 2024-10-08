import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AccessManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const accessManagerAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_adminAddress', internalType: 'address[]', type: 'address[]' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_address', internalType: 'address', type: 'address' }],
    name: 'isAdmin',
    outputs: [{ name: '_status', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_address', internalType: 'address', type: 'address' }],
    name: 'isDonor',
    outputs: [{ name: '_status', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_address', internalType: 'address', type: 'address' }],
    name: 'isProjectManager',
    outputs: [{ name: '_status', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_address', internalType: 'address', type: 'address' },
      { name: '_status', internalType: 'bool', type: 'bool' },
    ],
    name: 'updateAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_address', internalType: 'address', type: 'address' },
      { name: '_status', internalType: 'bool', type: 'bool' },
    ],
    name: 'updateDonor',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_address', internalType: 'address', type: 'address' },
      { name: '_status', internalType: 'bool', type: 'bool' },
    ],
    name: 'updateProjectManager',
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"isAdmin"`
 */
export const useReadAccessManagerIsAdmin = /*#__PURE__*/ createUseReadContract({
  abi: accessManagerAbi,
  functionName: 'isAdmin',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"isDonor"`
 */
export const useReadAccessManagerIsDonor = /*#__PURE__*/ createUseReadContract({
  abi: accessManagerAbi,
  functionName: 'isDonor',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"isProjectManager"`
 */
export const useReadAccessManagerIsProjectManager =
  /*#__PURE__*/ createUseReadContract({
    abi: accessManagerAbi,
    functionName: 'isProjectManager',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessManagerAbi}__
 */
export const useWriteAccessManager = /*#__PURE__*/ createUseWriteContract({
  abi: accessManagerAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"updateAdmin"`
 */
export const useWriteAccessManagerUpdateAdmin =
  /*#__PURE__*/ createUseWriteContract({
    abi: accessManagerAbi,
    functionName: 'updateAdmin',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"updateDonor"`
 */
export const useWriteAccessManagerUpdateDonor =
  /*#__PURE__*/ createUseWriteContract({
    abi: accessManagerAbi,
    functionName: 'updateDonor',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"updateProjectManager"`
 */
export const useWriteAccessManagerUpdateProjectManager =
  /*#__PURE__*/ createUseWriteContract({
    abi: accessManagerAbi,
    functionName: 'updateProjectManager',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessManagerAbi}__
 */
export const useSimulateAccessManager = /*#__PURE__*/ createUseSimulateContract(
  { abi: accessManagerAbi },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"updateAdmin"`
 */
export const useSimulateAccessManagerUpdateAdmin =
  /*#__PURE__*/ createUseSimulateContract({
    abi: accessManagerAbi,
    functionName: 'updateAdmin',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"updateDonor"`
 */
export const useSimulateAccessManagerUpdateDonor =
  /*#__PURE__*/ createUseSimulateContract({
    abi: accessManagerAbi,
    functionName: 'updateDonor',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessManagerAbi}__ and `functionName` set to `"updateProjectManager"`
 */
export const useSimulateAccessManagerUpdateProjectManager =
  /*#__PURE__*/ createUseSimulateContract({
    abi: accessManagerAbi,
    functionName: 'updateProjectManager',
  })
