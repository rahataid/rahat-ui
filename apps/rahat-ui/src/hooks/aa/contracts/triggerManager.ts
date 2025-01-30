// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TriggerManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const triggerManagerAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_requiredTriggers', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sourceId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'triggerAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'TriggerInitialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sourceId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'sourceName',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'sourceDetails',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'triggerAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'TriggerSourceUpdated',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTriggerCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'hasTriggered',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'sourceId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'removeTriggerSource',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'requiredTriggers',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_requiredTriggers', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setRequiredTriggers',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'sourceId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'trigger',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'triggerSources',
    outputs: [
      { name: 'sourceName', internalType: 'string', type: 'string' },
      { name: 'sourceDetails', internalType: 'string', type: 'string' },
      { name: 'triggerAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'triggers',
    outputs: [
      { name: 'sourceId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'triggerAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sourceId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'sourceName', internalType: 'string', type: 'string' },
      { name: 'sourceDetails', internalType: 'string', type: 'string' },
      { name: 'triggerAddress', internalType: 'address', type: 'address' },
    ],
    name: 'updateTriggerSource',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link triggerManagerAbi}__
 */
export const useReadTriggerManager = /*#__PURE__*/ createUseReadContract({
  abi: triggerManagerAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link triggerManagerAbi}__ and `functionName` set to `"getTriggerCount"`
 */
export const useReadTriggerManagerGetTriggerCount =
  /*#__PURE__*/ createUseReadContract({
    abi: triggerManagerAbi,
    functionName: 'getTriggerCount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link triggerManagerAbi}__ and `functionName` set to `"hasTriggered"`
 */
export const useReadTriggerManagerHasTriggered =
  /*#__PURE__*/ createUseReadContract({
    abi: triggerManagerAbi,
    functionName: 'hasTriggered',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link triggerManagerAbi}__ and `functionName` set to `"requiredTriggers"`
 */
export const useReadTriggerManagerRequiredTriggers =
  /*#__PURE__*/ createUseReadContract({
    abi: triggerManagerAbi,
    functionName: 'requiredTriggers',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link triggerManagerAbi}__ and `functionName` set to `"triggerSources"`
 */
export const useReadTriggerManagerTriggerSources =
  /*#__PURE__*/ createUseReadContract({
    abi: triggerManagerAbi,
    functionName: 'triggerSources',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link triggerManagerAbi}__ and `functionName` set to `"triggers"`
 */
export const useReadTriggerManagerTriggers =
  /*#__PURE__*/ createUseReadContract({
    abi: triggerManagerAbi,
    functionName: 'triggers',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link triggerManagerAbi}__
 */
export const useWriteTriggerManager = /*#__PURE__*/ createUseWriteContract({
  abi: triggerManagerAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link triggerManagerAbi}__ and `functionName` set to `"removeTriggerSource"`
 */
export const useWriteTriggerManagerRemoveTriggerSource =
  /*#__PURE__*/ createUseWriteContract({
    abi: triggerManagerAbi,
    functionName: 'removeTriggerSource',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link triggerManagerAbi}__ and `functionName` set to `"setRequiredTriggers"`
 */
export const useWriteTriggerManagerSetRequiredTriggers =
  /*#__PURE__*/ createUseWriteContract({
    abi: triggerManagerAbi,
    functionName: 'setRequiredTriggers',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link triggerManagerAbi}__ and `functionName` set to `"trigger"`
 */
export const useWriteTriggerManagerTrigger =
  /*#__PURE__*/ createUseWriteContract({
    abi: triggerManagerAbi,
    functionName: 'trigger',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link triggerManagerAbi}__ and `functionName` set to `"updateTriggerSource"`
 */
export const useWriteTriggerManagerUpdateTriggerSource =
  /*#__PURE__*/ createUseWriteContract({
    abi: triggerManagerAbi,
    functionName: 'updateTriggerSource',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link triggerManagerAbi}__
 */
export const useSimulateTriggerManager =
  /*#__PURE__*/ createUseSimulateContract({ abi: triggerManagerAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link triggerManagerAbi}__ and `functionName` set to `"removeTriggerSource"`
 */
export const useSimulateTriggerManagerRemoveTriggerSource =
  /*#__PURE__*/ createUseSimulateContract({
    abi: triggerManagerAbi,
    functionName: 'removeTriggerSource',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link triggerManagerAbi}__ and `functionName` set to `"setRequiredTriggers"`
 */
export const useSimulateTriggerManagerSetRequiredTriggers =
  /*#__PURE__*/ createUseSimulateContract({
    abi: triggerManagerAbi,
    functionName: 'setRequiredTriggers',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link triggerManagerAbi}__ and `functionName` set to `"trigger"`
 */
export const useSimulateTriggerManagerTrigger =
  /*#__PURE__*/ createUseSimulateContract({
    abi: triggerManagerAbi,
    functionName: 'trigger',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link triggerManagerAbi}__ and `functionName` set to `"updateTriggerSource"`
 */
export const useSimulateTriggerManagerUpdateTriggerSource =
  /*#__PURE__*/ createUseSimulateContract({
    abi: triggerManagerAbi,
    functionName: 'updateTriggerSource',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link triggerManagerAbi}__
 */
export const useWatchTriggerManagerEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: triggerManagerAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link triggerManagerAbi}__ and `eventName` set to `"TriggerInitialized"`
 */
export const useWatchTriggerManagerTriggerInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: triggerManagerAbi,
    eventName: 'TriggerInitialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link triggerManagerAbi}__ and `eventName` set to `"TriggerSourceUpdated"`
 */
export const useWatchTriggerManagerTriggerSourceUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: triggerManagerAbi,
    eventName: 'TriggerSourceUpdated',
  })
