import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RahatTreasury
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const rahatTreasuryAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'treasuryId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'increasedamount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BudgetIncreased',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'treasuryId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BudgetRedeemed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'year', internalType: 'string', type: 'string', indexed: true },
      {
        name: 'budget',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'country',
        internalType: 'string',
        type: 'string',
        indexed: true,
      },
    ],
    name: 'TreasuryCreated',
  },
  {
    type: 'function',
    inputs: [{ name: '_treasuryId', internalType: 'uint256', type: 'uint256' }],
    name: 'checkBudget',
    outputs: [
      {
        name: 'treasuryDetails',
        internalType: 'struct IRahatTreasury.Treasury',
        type: 'tuple',
        components: [
          { name: 'year', internalType: 'string', type: 'string' },
          { name: 'budget', internalType: 'uint256', type: 'uint256' },
          { name: 'country', internalType: 'string', type: 'string' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_year', internalType: 'string', type: 'string' },
      { name: '_budget', internalType: 'uint256', type: 'uint256' },
      { name: '_country', internalType: 'string', type: 'string' },
    ],
    name: 'createTreasury',
    outputs: [{ name: 'treasuryId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_treasuryId', internalType: 'uint256', type: 'uint256' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'increaseBudget',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_treasuryId', internalType: 'uint256', type: 'uint256' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'redeemToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'treasury',
    outputs: [
      { name: 'year', internalType: 'string', type: 'string' },
      { name: 'budget', internalType: 'uint256', type: 'uint256' },
      { name: 'country', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'treasuryCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatTreasuryAbi}__
 */
export const useReadRahatTreasury = /*#__PURE__*/ createUseReadContract({
  abi: rahatTreasuryAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `functionName` set to `"checkBudget"`
 */
export const useReadRahatTreasuryCheckBudget =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatTreasuryAbi,
    functionName: 'checkBudget',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `functionName` set to `"treasury"`
 */
export const useReadRahatTreasuryTreasury = /*#__PURE__*/ createUseReadContract(
  { abi: rahatTreasuryAbi, functionName: 'treasury' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `functionName` set to `"treasuryCount"`
 */
export const useReadRahatTreasuryTreasuryCount =
  /*#__PURE__*/ createUseReadContract({
    abi: rahatTreasuryAbi,
    functionName: 'treasuryCount',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatTreasuryAbi}__
 */
export const useWriteRahatTreasury = /*#__PURE__*/ createUseWriteContract({
  abi: rahatTreasuryAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `functionName` set to `"createTreasury"`
 */
export const useWriteRahatTreasuryCreateTreasury =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatTreasuryAbi,
    functionName: 'createTreasury',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `functionName` set to `"increaseBudget"`
 */
export const useWriteRahatTreasuryIncreaseBudget =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatTreasuryAbi,
    functionName: 'increaseBudget',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `functionName` set to `"redeemToken"`
 */
export const useWriteRahatTreasuryRedeemToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: rahatTreasuryAbi,
    functionName: 'redeemToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatTreasuryAbi}__
 */
export const useSimulateRahatTreasury = /*#__PURE__*/ createUseSimulateContract(
  { abi: rahatTreasuryAbi },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `functionName` set to `"createTreasury"`
 */
export const useSimulateRahatTreasuryCreateTreasury =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatTreasuryAbi,
    functionName: 'createTreasury',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `functionName` set to `"increaseBudget"`
 */
export const useSimulateRahatTreasuryIncreaseBudget =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatTreasuryAbi,
    functionName: 'increaseBudget',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `functionName` set to `"redeemToken"`
 */
export const useSimulateRahatTreasuryRedeemToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: rahatTreasuryAbi,
    functionName: 'redeemToken',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatTreasuryAbi}__
 */
export const useWatchRahatTreasuryEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: rahatTreasuryAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `eventName` set to `"BudgetIncreased"`
 */
export const useWatchRahatTreasuryBudgetIncreasedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatTreasuryAbi,
    eventName: 'BudgetIncreased',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `eventName` set to `"BudgetRedeemed"`
 */
export const useWatchRahatTreasuryBudgetRedeemedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatTreasuryAbi,
    eventName: 'BudgetRedeemed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link rahatTreasuryAbi}__ and `eventName` set to `"TreasuryCreated"`
 */
export const useWatchRahatTreasuryTreasuryCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: rahatTreasuryAbi,
    eventName: 'TreasuryCreated',
  })
