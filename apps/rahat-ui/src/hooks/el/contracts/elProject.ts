import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ELProject
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const elProjectAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_defaultToken', internalType: 'address', type: 'address' },
      { name: '_referredToken', internalType: 'address', type: 'address' },
      { name: '_rahatClaim', internalType: 'address', type: 'address' },
      { name: '_otpServerAddress', internalType: 'address', type: 'address' },
      { name: '_forwarder', internalType: 'address', type: 'address' },
      { name: '_referralLimit', internalType: 'uint256', type: 'uint256' },
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
    name: 'BeneficiaryAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_referrerVendor',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_referrerBeneficiaries',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'beneficiaryAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'BeneficiaryReferred',
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
        name: 'tokenAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'assigner',
        internalType: 'address',
        type: 'address',
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
    ],
    name: 'ClaimProcessed',
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
        name: 'tokenAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'ClaimRevert',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newaddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OtpServerUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_benAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_removedBy',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'ReferredBeneficiaryRemoved',
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
        name: '_vendorAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_tokenAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TokenRedeem',
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
    type: 'event',
    anonymous: false,
    inputs: [
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
    ],
    name: 'VendorAllowance',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
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
    ],
    name: 'VendorAllowanceAccept',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'vendorAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'status', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'VendorUpdated',
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
    inputs: [{ name: '_address', internalType: 'address', type: 'address' }],
    name: 'addBeneficiary',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_account', internalType: 'address', type: 'address' },
      { name: '_benAddress', internalType: 'address', type: 'address' },
      { name: '_vendorAddress', internalType: 'address', type: 'address' },
    ],
    name: 'addReferredBeneficiaries',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_claimerAddress', internalType: 'address', type: 'address' },
    ],
    name: 'assignClaims',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_claimerAddress', internalType: 'address', type: 'address' },
      { name: '_referralben', internalType: 'address', type: 'address' },
      { name: '_referralVendor', internalType: 'address', type: 'address' },
      { name: '_refereedToken', internalType: 'address', type: 'address' },
    ],
    name: 'assignRefereedClaims',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'beneficiaryClaimStatus',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
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
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'beneficiaryEyeVoucher',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'beneficiaryReferredByBeneficiary',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'beneficiaryReferredByVendor',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'beneficiaryReferredVoucher',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'beneficiaryRevertStatus',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_address', internalType: 'address', type: 'address' }],
    name: 'checkAdminStatus',
    outputs: [{ name: '_status', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_address', internalType: 'address', type: 'address' }],
    name: 'checkVendorStatus',
    outputs: [{ name: '_vendorStatus', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'closeProject',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [],
    name: 'eyeVoucherAssigned',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'eyeVoucherClaimed',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'eyeVoucherRedeemedByVendor',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'eyeVoucherReverted',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_benAddress', internalType: 'address', type: 'address' }],
    name: 'getBeneficiaryVoucherDetail',
    outputs: [
      {
        name: 'beneficiaryVoucherDetails',
        internalType: 'struct IELProject.BeneficiaryVoucherDetails',
        type: 'tuple',
        components: [
          {
            name: 'freeVoucherAddress',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'referredVoucherAddress',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'freeVoucherClaimStatus',
            internalType: 'bool',
            type: 'bool',
          },
          {
            name: 'referredVoucherClaimStatus',
            internalType: 'bool',
            type: 'bool',
          },
          {
            name: 'freeVoucherRevertStatus',
            internalType: 'bool',
            type: 'bool',
          },
          {
            name: 'referredVoucherRevertStatus',
            internalType: 'bool',
            type: 'bool',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getProjectVoucherDetail',
    outputs: [
      {
        name: 'projectVoucherDetails',
        internalType: 'struct IELProject.ProjectVoucherDetails',
        type: 'tuple',
        components: [
          {
            name: 'eyeVoucherAssigned',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'referredVoucherAssigned',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'eyeVoucherClaimed',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'referredVoucherClaimed',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'eyeVoucherBudget',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'referredVoucherBudget',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalBeneficiaries',
    outputs: [
      { name: 'enrolledBen', internalType: 'uint256', type: 'uint256' },
      { name: 'referredBen', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_vendor', internalType: 'address', type: 'address' }],
    name: 'getVendorVoucherDetail',
    outputs: [
      {
        name: 'voucherDetails',
        internalType: 'struct IELProject.VoucherDetailByVendor',
        type: 'tuple',
        components: [
          {
            name: 'freeVoucherRedeemed',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'referredVoucherRedeemed',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'beneficiaryReferred',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
      { name: '_tokenAddress', internalType: 'address', type: 'address' },
    ],
    name: 'increaseTokenBudget',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [
      { name: '_tokenAddress', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
      { name: '_vendorAddress', internalType: 'address', type: 'address' },
      { name: '_adminAddress', internalType: 'address', type: 'address' },
    ],
    name: 'redeemTokenByVendor',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'referralLimit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'referredBenficiaries',
    outputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'referrerVendor', internalType: 'address', type: 'address' },
      {
        name: 'referrerBeneficiaries',
        internalType: 'address',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'referredToken',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'referredVoucherAssigned',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'referredVoucherClaimed',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'referredVoucherRedeemedByVendor',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'referredVoucherReverted',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'registeredTokens',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
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
    inputs: [{ name: '_account', internalType: 'address', type: 'address' }],
    name: 'removeReferredBeneficiaries',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_benAddress', internalType: 'address', type: 'address' },
      { name: '_tokenAddress', internalType: 'address', type: 'address' },
    ],
    name: 'requestReferredTokenFromBeneficiary',
    outputs: [{ name: 'requestId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_benAddress', internalType: 'address', type: 'address' }],
    name: 'requestTokenFromBeneficiary',
    outputs: [{ name: 'requestId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_claimerAddress', internalType: 'address', type: 'address' },
    ],
    name: 'revertedClaims',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_claimerAddress', internalType: 'address', type: 'address' },
      { name: '_refereedToken', internalType: 'address', type: 'address' },
    ],
    name: 'revertedRefereedClaims',
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
    name: 'trustedForwarder',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_admin', internalType: 'address', type: 'address' },
      { name: '_status', internalType: 'bool', type: 'bool' },
    ],
    name: 'updateAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
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
      { name: '_address', internalType: 'address', type: 'address' },
      { name: '_status', internalType: 'bool', type: 'bool' },
    ],
    name: 'updateVendor',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__
 */
export const useReadElProject = /*#__PURE__*/ createUseReadContract({
  abi: elProjectAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"AccessManager"`
 */
export const useReadElProjectAccessManager =
  /*#__PURE__*/ createUseReadContract({
    abi: elProjectAbi,
    functionName: 'AccessManager',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"IID_RAHAT_PROJECT"`
 */
export const useReadElProjectIidRahatProject =
  /*#__PURE__*/ createUseReadContract({
    abi: elProjectAbi,
    functionName: 'IID_RAHAT_PROJECT',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"RahatClaim"`
 */
export const useReadElProjectRahatClaim = /*#__PURE__*/ createUseReadContract({
  abi: elProjectAbi,
  functionName: 'RahatClaim',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"beneficiaryClaimStatus"`
 */
export const useReadElProjectBeneficiaryClaimStatus =
  /*#__PURE__*/ createUseReadContract({
    abi: elProjectAbi,
    functionName: 'beneficiaryClaimStatus',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"beneficiaryCount"`
 */
export const useReadElProjectBeneficiaryCount =
  /*#__PURE__*/ createUseReadContract({
    abi: elProjectAbi,
    functionName: 'beneficiaryCount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"beneficiaryEyeVoucher"`
 */
export const useReadElProjectBeneficiaryEyeVoucher =
  /*#__PURE__*/ createUseReadContract({
    abi: elProjectAbi,
    functionName: 'beneficiaryEyeVoucher',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"beneficiaryReferredByBeneficiary"`
 */
export const useReadElProjectBeneficiaryReferredByBeneficiary =
  /*#__PURE__*/ createUseReadContract({
    abi: elProjectAbi,
    functionName: 'beneficiaryReferredByBeneficiary',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"beneficiaryReferredByVendor"`
 */
export const useReadElProjectBeneficiaryReferredByVendor =
  /*#__PURE__*/ createUseReadContract({
    abi: elProjectAbi,
    functionName: 'beneficiaryReferredByVendor',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"beneficiaryReferredVoucher"`
 */
export const useReadElProjectBeneficiaryReferredVoucher =
  /*#__PURE__*/ createUseReadContract({
    abi: elProjectAbi,
    functionName: 'beneficiaryReferredVoucher',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"beneficiaryRevertStatus"`
 */
export const useReadElProjectBeneficiaryRevertStatus =
  /*#__PURE__*/ createUseReadContract({
    abi: elProjectAbi,
    functionName: 'beneficiaryRevertStatus',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"checkAdminStatus"`
 */
export const useReadElProjectCheckAdminStatus =
  /*#__PURE__*/ createUseReadContract({
    abi: elProjectAbi,
    functionName: 'checkAdminStatus',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"checkVendorStatus"`
 */
export const useReadElProjectCheckVendorStatus =
  /*#__PURE__*/ createUseReadContract({
    abi: elProjectAbi,
    functionName: 'checkVendorStatus',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"defaultToken"`
 */
export const useReadElProjectDefaultToken = /*#__PURE__*/ createUseReadContract(
  { abi: elProjectAbi, functionName: 'defaultToken' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"eyeVoucherAssigned"`
 */
export const useReadElProjectEyeVoucherAssigned =
  /*#__PURE__*/ createUseReadContract({
    abi: elProjectAbi,
    functionName: 'eyeVoucherAssigned',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"eyeVoucherClaimed"`
 */
export const useReadElProjectEyeVoucherClaimed =
  /*#__PURE__*/ createUseReadContract({
    abi: elProjectAbi,
    functionName: 'eyeVoucherClaimed',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"eyeVoucherRedeemedByVendor"`
 */
export const useReadElProjectEyeVoucherRedeemedByVendor =
  /*#__PURE__*/ createUseReadContract({
    abi: elProjectAbi,
    functionName: 'eyeVoucherRedeemedByVendor',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"eyeVoucherReverted"`
 */
export const useReadElProjectEyeVoucherReverted =
  /*#__PURE__*/ createUseReadContract({
    abi: elProjectAbi,
    functionName: 'eyeVoucherReverted',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"getBeneficiaryVoucherDetail"`
 */
export const useReadElProjectGetBeneficiaryVoucherDetail =
  /*#__PURE__*/ createUseReadContract({
    abi: elProjectAbi,
    functionName: 'getBeneficiaryVoucherDetail',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"getProjectVoucherDetail"`
 */
export const useReadElProjectGetProjectVoucherDetail =
  /*#__PURE__*/ createUseReadContract({
    abi: elProjectAbi,
    functionName: 'getProjectVoucherDetail',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"getTotalBeneficiaries"`
 */
export const useReadElProjectGetTotalBeneficiaries =
  /*#__PURE__*/ createUseReadContract({
    abi: elProjectAbi,
    functionName: 'getTotalBeneficiaries',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"getVendorVoucherDetail"`
 */
export const useReadElProjectGetVendorVoucherDetail =
  /*#__PURE__*/ createUseReadContract({
    abi: elProjectAbi,
    functionName: 'getVendorVoucherDetail',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"isBeneficiary"`
 */
export const useReadElProjectIsBeneficiary =
  /*#__PURE__*/ createUseReadContract({
    abi: elProjectAbi,
    functionName: 'isBeneficiary',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"isTrustedForwarder"`
 */
export const useReadElProjectIsTrustedForwarder =
  /*#__PURE__*/ createUseReadContract({
    abi: elProjectAbi,
    functionName: 'isTrustedForwarder',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"name"`
 */
export const useReadElProjectName = /*#__PURE__*/ createUseReadContract({
  abi: elProjectAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"otpServerAddress"`
 */
export const useReadElProjectOtpServerAddress =
  /*#__PURE__*/ createUseReadContract({
    abi: elProjectAbi,
    functionName: 'otpServerAddress',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"referralLimit"`
 */
export const useReadElProjectReferralLimit =
  /*#__PURE__*/ createUseReadContract({
    abi: elProjectAbi,
    functionName: 'referralLimit',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"referredBenficiaries"`
 */
export const useReadElProjectReferredBenficiaries =
  /*#__PURE__*/ createUseReadContract({
    abi: elProjectAbi,
    functionName: 'referredBenficiaries',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"referredToken"`
 */
export const useReadElProjectReferredToken =
  /*#__PURE__*/ createUseReadContract({
    abi: elProjectAbi,
    functionName: 'referredToken',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"referredVoucherAssigned"`
 */
export const useReadElProjectReferredVoucherAssigned =
  /*#__PURE__*/ createUseReadContract({
    abi: elProjectAbi,
    functionName: 'referredVoucherAssigned',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"referredVoucherClaimed"`
 */
export const useReadElProjectReferredVoucherClaimed =
  /*#__PURE__*/ createUseReadContract({
    abi: elProjectAbi,
    functionName: 'referredVoucherClaimed',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"referredVoucherRedeemedByVendor"`
 */
export const useReadElProjectReferredVoucherRedeemedByVendor =
  /*#__PURE__*/ createUseReadContract({
    abi: elProjectAbi,
    functionName: 'referredVoucherRedeemedByVendor',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"referredVoucherReverted"`
 */
export const useReadElProjectReferredVoucherReverted =
  /*#__PURE__*/ createUseReadContract({
    abi: elProjectAbi,
    functionName: 'referredVoucherReverted',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"registeredTokens"`
 */
export const useReadElProjectRegisteredTokens =
  /*#__PURE__*/ createUseReadContract({
    abi: elProjectAbi,
    functionName: 'registeredTokens',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadElProjectSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: elProjectAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"tokenBudget"`
 */
export const useReadElProjectTokenBudget = /*#__PURE__*/ createUseReadContract({
  abi: elProjectAbi,
  functionName: 'tokenBudget',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"tokenRequestIds"`
 */
export const useReadElProjectTokenRequestIds =
  /*#__PURE__*/ createUseReadContract({
    abi: elProjectAbi,
    functionName: 'tokenRequestIds',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"trustedForwarder"`
 */
export const useReadElProjectTrustedForwarder =
  /*#__PURE__*/ createUseReadContract({
    abi: elProjectAbi,
    functionName: 'trustedForwarder',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link elProjectAbi}__
 */
export const useWriteElProject = /*#__PURE__*/ createUseWriteContract({
  abi: elProjectAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"addBeneficiary"`
 */
export const useWriteElProjectAddBeneficiary =
  /*#__PURE__*/ createUseWriteContract({
    abi: elProjectAbi,
    functionName: 'addBeneficiary',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"addReferredBeneficiaries"`
 */
export const useWriteElProjectAddReferredBeneficiaries =
  /*#__PURE__*/ createUseWriteContract({
    abi: elProjectAbi,
    functionName: 'addReferredBeneficiaries',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"assignClaims"`
 */
export const useWriteElProjectAssignClaims =
  /*#__PURE__*/ createUseWriteContract({
    abi: elProjectAbi,
    functionName: 'assignClaims',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"assignRefereedClaims"`
 */
export const useWriteElProjectAssignRefereedClaims =
  /*#__PURE__*/ createUseWriteContract({
    abi: elProjectAbi,
    functionName: 'assignRefereedClaims',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"closeProject"`
 */
export const useWriteElProjectCloseProject =
  /*#__PURE__*/ createUseWriteContract({
    abi: elProjectAbi,
    functionName: 'closeProject',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"increaseTokenBudget"`
 */
export const useWriteElProjectIncreaseTokenBudget =
  /*#__PURE__*/ createUseWriteContract({
    abi: elProjectAbi,
    functionName: 'increaseTokenBudget',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"multicall"`
 */
export const useWriteElProjectMulticall = /*#__PURE__*/ createUseWriteContract({
  abi: elProjectAbi,
  functionName: 'multicall',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"processTokenRequest"`
 */
export const useWriteElProjectProcessTokenRequest =
  /*#__PURE__*/ createUseWriteContract({
    abi: elProjectAbi,
    functionName: 'processTokenRequest',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"redeemTokenByVendor"`
 */
export const useWriteElProjectRedeemTokenByVendor =
  /*#__PURE__*/ createUseWriteContract({
    abi: elProjectAbi,
    functionName: 'redeemTokenByVendor',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"removeBeneficiary"`
 */
export const useWriteElProjectRemoveBeneficiary =
  /*#__PURE__*/ createUseWriteContract({
    abi: elProjectAbi,
    functionName: 'removeBeneficiary',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"removeReferredBeneficiaries"`
 */
export const useWriteElProjectRemoveReferredBeneficiaries =
  /*#__PURE__*/ createUseWriteContract({
    abi: elProjectAbi,
    functionName: 'removeReferredBeneficiaries',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"requestReferredTokenFromBeneficiary"`
 */
export const useWriteElProjectRequestReferredTokenFromBeneficiary =
  /*#__PURE__*/ createUseWriteContract({
    abi: elProjectAbi,
    functionName: 'requestReferredTokenFromBeneficiary',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"requestTokenFromBeneficiary"`
 */
export const useWriteElProjectRequestTokenFromBeneficiary =
  /*#__PURE__*/ createUseWriteContract({
    abi: elProjectAbi,
    functionName: 'requestTokenFromBeneficiary',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"revertedClaims"`
 */
export const useWriteElProjectRevertedClaims =
  /*#__PURE__*/ createUseWriteContract({
    abi: elProjectAbi,
    functionName: 'revertedClaims',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"revertedRefereedClaims"`
 */
export const useWriteElProjectRevertedRefereedClaims =
  /*#__PURE__*/ createUseWriteContract({
    abi: elProjectAbi,
    functionName: 'revertedRefereedClaims',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"updateAdmin"`
 */
export const useWriteElProjectUpdateAdmin =
  /*#__PURE__*/ createUseWriteContract({
    abi: elProjectAbi,
    functionName: 'updateAdmin',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"updateOtpServer"`
 */
export const useWriteElProjectUpdateOtpServer =
  /*#__PURE__*/ createUseWriteContract({
    abi: elProjectAbi,
    functionName: 'updateOtpServer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"updateVendor"`
 */
export const useWriteElProjectUpdateVendor =
  /*#__PURE__*/ createUseWriteContract({
    abi: elProjectAbi,
    functionName: 'updateVendor',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link elProjectAbi}__
 */
export const useSimulateElProject = /*#__PURE__*/ createUseSimulateContract({
  abi: elProjectAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"addBeneficiary"`
 */
export const useSimulateElProjectAddBeneficiary =
  /*#__PURE__*/ createUseSimulateContract({
    abi: elProjectAbi,
    functionName: 'addBeneficiary',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"addReferredBeneficiaries"`
 */
export const useSimulateElProjectAddReferredBeneficiaries =
  /*#__PURE__*/ createUseSimulateContract({
    abi: elProjectAbi,
    functionName: 'addReferredBeneficiaries',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"assignClaims"`
 */
export const useSimulateElProjectAssignClaims =
  /*#__PURE__*/ createUseSimulateContract({
    abi: elProjectAbi,
    functionName: 'assignClaims',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"assignRefereedClaims"`
 */
export const useSimulateElProjectAssignRefereedClaims =
  /*#__PURE__*/ createUseSimulateContract({
    abi: elProjectAbi,
    functionName: 'assignRefereedClaims',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"closeProject"`
 */
export const useSimulateElProjectCloseProject =
  /*#__PURE__*/ createUseSimulateContract({
    abi: elProjectAbi,
    functionName: 'closeProject',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"increaseTokenBudget"`
 */
export const useSimulateElProjectIncreaseTokenBudget =
  /*#__PURE__*/ createUseSimulateContract({
    abi: elProjectAbi,
    functionName: 'increaseTokenBudget',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"multicall"`
 */
export const useSimulateElProjectMulticall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: elProjectAbi,
    functionName: 'multicall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"processTokenRequest"`
 */
export const useSimulateElProjectProcessTokenRequest =
  /*#__PURE__*/ createUseSimulateContract({
    abi: elProjectAbi,
    functionName: 'processTokenRequest',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"redeemTokenByVendor"`
 */
export const useSimulateElProjectRedeemTokenByVendor =
  /*#__PURE__*/ createUseSimulateContract({
    abi: elProjectAbi,
    functionName: 'redeemTokenByVendor',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"removeBeneficiary"`
 */
export const useSimulateElProjectRemoveBeneficiary =
  /*#__PURE__*/ createUseSimulateContract({
    abi: elProjectAbi,
    functionName: 'removeBeneficiary',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"removeReferredBeneficiaries"`
 */
export const useSimulateElProjectRemoveReferredBeneficiaries =
  /*#__PURE__*/ createUseSimulateContract({
    abi: elProjectAbi,
    functionName: 'removeReferredBeneficiaries',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"requestReferredTokenFromBeneficiary"`
 */
export const useSimulateElProjectRequestReferredTokenFromBeneficiary =
  /*#__PURE__*/ createUseSimulateContract({
    abi: elProjectAbi,
    functionName: 'requestReferredTokenFromBeneficiary',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"requestTokenFromBeneficiary"`
 */
export const useSimulateElProjectRequestTokenFromBeneficiary =
  /*#__PURE__*/ createUseSimulateContract({
    abi: elProjectAbi,
    functionName: 'requestTokenFromBeneficiary',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"revertedClaims"`
 */
export const useSimulateElProjectRevertedClaims =
  /*#__PURE__*/ createUseSimulateContract({
    abi: elProjectAbi,
    functionName: 'revertedClaims',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"revertedRefereedClaims"`
 */
export const useSimulateElProjectRevertedRefereedClaims =
  /*#__PURE__*/ createUseSimulateContract({
    abi: elProjectAbi,
    functionName: 'revertedRefereedClaims',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"updateAdmin"`
 */
export const useSimulateElProjectUpdateAdmin =
  /*#__PURE__*/ createUseSimulateContract({
    abi: elProjectAbi,
    functionName: 'updateAdmin',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"updateOtpServer"`
 */
export const useSimulateElProjectUpdateOtpServer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: elProjectAbi,
    functionName: 'updateOtpServer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link elProjectAbi}__ and `functionName` set to `"updateVendor"`
 */
export const useSimulateElProjectUpdateVendor =
  /*#__PURE__*/ createUseSimulateContract({
    abi: elProjectAbi,
    functionName: 'updateVendor',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link elProjectAbi}__
 */
export const useWatchElProjectEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: elProjectAbi },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link elProjectAbi}__ and `eventName` set to `"BeneficiaryAdded"`
 */
export const useWatchElProjectBeneficiaryAddedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: elProjectAbi,
    eventName: 'BeneficiaryAdded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link elProjectAbi}__ and `eventName` set to `"BeneficiaryReferred"`
 */
export const useWatchElProjectBeneficiaryReferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: elProjectAbi,
    eventName: 'BeneficiaryReferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link elProjectAbi}__ and `eventName` set to `"BeneficiaryRemoved"`
 */
export const useWatchElProjectBeneficiaryRemovedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: elProjectAbi,
    eventName: 'BeneficiaryRemoved',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link elProjectAbi}__ and `eventName` set to `"ClaimAssigned"`
 */
export const useWatchElProjectClaimAssignedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: elProjectAbi,
    eventName: 'ClaimAssigned',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link elProjectAbi}__ and `eventName` set to `"ClaimProcessed"`
 */
export const useWatchElProjectClaimProcessedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: elProjectAbi,
    eventName: 'ClaimProcessed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link elProjectAbi}__ and `eventName` set to `"ClaimRevert"`
 */
export const useWatchElProjectClaimRevertEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: elProjectAbi,
    eventName: 'ClaimRevert',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link elProjectAbi}__ and `eventName` set to `"OtpServerUpdated"`
 */
export const useWatchElProjectOtpServerUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: elProjectAbi,
    eventName: 'OtpServerUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link elProjectAbi}__ and `eventName` set to `"ReferredBeneficiaryRemoved"`
 */
export const useWatchElProjectReferredBeneficiaryRemovedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: elProjectAbi,
    eventName: 'ReferredBeneficiaryRemoved',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link elProjectAbi}__ and `eventName` set to `"TokenBudgetDecrease"`
 */
export const useWatchElProjectTokenBudgetDecreaseEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: elProjectAbi,
    eventName: 'TokenBudgetDecrease',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link elProjectAbi}__ and `eventName` set to `"TokenBudgetIncrease"`
 */
export const useWatchElProjectTokenBudgetIncreaseEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: elProjectAbi,
    eventName: 'TokenBudgetIncrease',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link elProjectAbi}__ and `eventName` set to `"TokenReceived"`
 */
export const useWatchElProjectTokenReceivedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: elProjectAbi,
    eventName: 'TokenReceived',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link elProjectAbi}__ and `eventName` set to `"TokenRedeem"`
 */
export const useWatchElProjectTokenRedeemEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: elProjectAbi,
    eventName: 'TokenRedeem',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link elProjectAbi}__ and `eventName` set to `"TokenRegistered"`
 */
export const useWatchElProjectTokenRegisteredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: elProjectAbi,
    eventName: 'TokenRegistered',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link elProjectAbi}__ and `eventName` set to `"TokenTransfer"`
 */
export const useWatchElProjectTokenTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: elProjectAbi,
    eventName: 'TokenTransfer',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link elProjectAbi}__ and `eventName` set to `"VendorAllowance"`
 */
export const useWatchElProjectVendorAllowanceEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: elProjectAbi,
    eventName: 'VendorAllowance',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link elProjectAbi}__ and `eventName` set to `"VendorAllowanceAccept"`
 */
export const useWatchElProjectVendorAllowanceAcceptEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: elProjectAbi,
    eventName: 'VendorAllowanceAccept',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link elProjectAbi}__ and `eventName` set to `"VendorUpdated"`
 */
export const useWatchElProjectVendorUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: elProjectAbi,
    eventName: 'VendorUpdated',
  })
