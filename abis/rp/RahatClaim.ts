export const RahatClaimAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'target',
        type: 'address',
      },
    ],
    name: 'AddressEmptyCode',
    type: 'error',
  },
  {
    inputs: [],
    name: 'FailedInnerCall',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'claimId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'claimer',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'claimee',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'otpServer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'ClaimCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'claimId',
        type: 'uint256',
      },
    ],
    name: 'ClaimProcessed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'claimId',
        type: 'uint256',
      },
    ],
    name: 'OtpAddedToClaim',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_claimId',
        type: 'uint256',
      },
      {
        internalType: 'bytes32',
        name: '_otpHash',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: '_expiryDate',
        type: 'uint256',
      },
    ],
    name: 'addOtpToClaim',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'claimCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'claims',
    outputs: [
      {
        internalType: 'address',
        name: 'ownerAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'claimerAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'claimeeAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'otpServerAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'tokenAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'expiryDate',
        type: 'uint256',
      },
      {
        internalType: 'bytes32',
        name: 'otpHash',
        type: 'bytes32',
      },
      {
        internalType: 'bool',
        name: 'isProcessed',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_claimerAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_claimeeAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_otpServerAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_tokenAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'createClaim',
    outputs: [
      {
        internalType: 'uint256',
        name: 'claimId',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_data',
        type: 'string',
      },
    ],
    name: 'findHash',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes[]',
        name: 'data',
        type: 'bytes[]',
      },
    ],
    name: 'multicall',
    outputs: [
      {
        internalType: 'bytes[]',
        name: 'results',
        type: 'bytes[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_claimId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_otp',
        type: 'string',
      },
    ],
    name: 'processClaim',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'ownerAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'claimerAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'claimeeAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'otpServerAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'tokenAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'expiryDate',
            type: 'uint256',
          },
          {
            internalType: 'bytes32',
            name: 'otpHash',
            type: 'bytes32',
          },
          {
            internalType: 'bool',
            name: 'isProcessed',
            type: 'bool',
          },
        ],
        internalType: 'struct IRahatClaim.Claim',
        name: 'claim_',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
