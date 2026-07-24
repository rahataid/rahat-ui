import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Vendor
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const vendorAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_rahatProject', internalType: 'address', type: 'address' },
      { name: '_rahatClaim', internalType: 'address', type: 'address' },
      { name: '_forwarder', internalType: 'address', type: 'address' },
      { name: '_otpServerAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
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
    inputs: [],
    name: 'RahatProject',
    outputs: [
      { name: '', internalType: 'contract IRahatProject', type: 'address' },
    ],
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
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vendorAbi}__
 */
export const useReadVendor = /*#__PURE__*/ createUseReadContract({
  abi: vendorAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vendorAbi}__ and `functionName` set to `"RahatClaim"`
 */
export const useReadVendorRahatClaim = /*#__PURE__*/ createUseReadContract({
  abi: vendorAbi,
  functionName: 'RahatClaim',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vendorAbi}__ and `functionName` set to `"RahatProject"`
 */
export const useReadVendorRahatProject = /*#__PURE__*/ createUseReadContract({
  abi: vendorAbi,
  functionName: 'RahatProject',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vendorAbi}__ and `functionName` set to `"isTrustedForwarder"`
 */
export const useReadVendorIsTrustedForwarder =
  /*#__PURE__*/ createUseReadContract({
    abi: vendorAbi,
    functionName: 'isTrustedForwarder',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vendorAbi}__ and `functionName` set to `"otpServerAddress"`
 */
export const useReadVendorOtpServerAddress =
  /*#__PURE__*/ createUseReadContract({
    abi: vendorAbi,
    functionName: 'otpServerAddress',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vendorAbi}__ and `functionName` set to `"tokenRequestIds"`
 */
export const useReadVendorTokenRequestIds = /*#__PURE__*/ createUseReadContract(
  { abi: vendorAbi, functionName: 'tokenRequestIds' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vendorAbi}__ and `functionName` set to `"trustedForwarder"`
 */
export const useReadVendorTrustedForwarder =
  /*#__PURE__*/ createUseReadContract({
    abi: vendorAbi,
    functionName: 'trustedForwarder',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vendorAbi}__
 */
export const useWriteVendor = /*#__PURE__*/ createUseWriteContract({
  abi: vendorAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vendorAbi}__ and `functionName` set to `"processTokenRequest"`
 */
export const useWriteVendorProcessTokenRequest =
  /*#__PURE__*/ createUseWriteContract({
    abi: vendorAbi,
    functionName: 'processTokenRequest',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vendorAbi}__ and `functionName` set to `"requestTokenFromBeneficiary"`
 */
export const useWriteVendorRequestTokenFromBeneficiary =
  /*#__PURE__*/ createUseWriteContract({
    abi: vendorAbi,
    functionName: 'requestTokenFromBeneficiary',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vendorAbi}__
 */
export const useSimulateVendor = /*#__PURE__*/ createUseSimulateContract({
  abi: vendorAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vendorAbi}__ and `functionName` set to `"processTokenRequest"`
 */
export const useSimulateVendorProcessTokenRequest =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vendorAbi,
    functionName: 'processTokenRequest',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vendorAbi}__ and `functionName` set to `"requestTokenFromBeneficiary"`
 */
export const useSimulateVendorRequestTokenFromBeneficiary =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vendorAbi,
    functionName: 'requestTokenFromBeneficiary',
  })
