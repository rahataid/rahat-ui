export const ELAbi = [
    {
      "inputs": [
        { "internalType": "string", "name": "_name", "type": "string" },
        { "internalType": "address", "name": "_defaultToken", "type": "address" },
        {
          "internalType": "address",
          "name": "_referredToken",
          "type": "address"
        },
        { "internalType": "address", "name": "_rahatClaim", "type": "address" },
        {
          "internalType": "address",
          "name": "_otpServerAddress",
          "type": "address"
        },
        { "internalType": "address", "name": "_forwarder", "type": "address" },
        { "internalType": "uint256", "name": "_referralLimit", "type": "uint256" }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "target", "type": "address" }
      ],
      "name": "AddressEmptyCode",
      "type": "error"
    },
    { "inputs": [], "name": "FailedInnerCall", "type": "error" },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "BeneficiaryAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_referrerVendor",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_referrerBeneficiaries",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "beneficiaryAddress",
          "type": "address"
        }
      ],
      "name": "BeneficiaryReferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "BeneficiaryRemoved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "beneficiary",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "tokenAddress",
          "type": "address"
        }
      ],
      "name": "ClaimAssigned",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "beneficiary",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "vendor",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "ClaimProcessed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "newaddress",
          "type": "address"
        }
      ],
      "name": "OtpServerUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_benAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_removedBy",
          "type": "address"
        }
      ],
      "name": "ReferredBeneficiaryRemoved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "tokenAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "TokenBudgetDecrease",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "tokenAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "TokenBudgetIncrease",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "TokenReceived",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_vendorAddress",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_tokenAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "TokenRedeem",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "tokenAddress",
          "type": "address"
        }
      ],
      "name": "TokenRegistered",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "TokenTransfer",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "vendor",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "VendorAllowance",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "vendor",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "token",
          "type": "address"
        }
      ],
      "name": "VendorAllowanceAccept",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "vendorAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "status",
          "type": "bool"
        }
      ],
      "name": "VendorUpdated",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "IID_RAHAT_PROJECT",
      "outputs": [{ "internalType": "bytes4", "name": "", "type": "bytes4" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "RahatClaim",
      "outputs": [
        { "internalType": "contract IRahatClaim", "name": "", "type": "address" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "name": "_registeredTokens",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "_address", "type": "address" }
      ],
      "name": "addBeneficiary",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "_account", "type": "address" },
        { "internalType": "address", "name": "_benAddress", "type": "address" },
        { "internalType": "address", "name": "_vendorAddress", "type": "address" }
      ],
      "name": "addReferredBeneficiaries",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_claimerAddress",
          "type": "address"
        }
      ],
      "name": "assignClaims",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_claimerAddress",
          "type": "address"
        },
        { "internalType": "address", "name": "_refereedToken", "type": "address" }
      ],
      "name": "assignRefereedClaims",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "", "type": "address" },
        { "internalType": "address", "name": "", "type": "address" }
      ],
      "name": "beneficiaryClaimStatus",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "beneficiaryCount",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "name": "beneficiaryEyeVoucher",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "name": "beneficiaryReferredByBeneficiary",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "name": "beneficiaryReferredByVendor",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "name": "beneficiaryReferredVoucher",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "_address", "type": "address" }
      ],
      "name": "checkAdminStatus",
      "outputs": [{ "internalType": "bool", "name": "_status", "type": "bool" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "_address", "type": "address" }
      ],
      "name": "checkVendorStatus",
      "outputs": [
        { "internalType": "bool", "name": "_vendorStatus", "type": "bool" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "closeProject",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "defaultToken",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "eyeVoucherAssigned",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "eyeVoucherClaimed",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "name": "eyeVoucherRedeemedByVendor",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getProjectVoucherDetail",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "eyeVoucherAssigned",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "referredVoucherAssigned",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "eyeVoucherClaimed",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "referredVoucherClaimed",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "eyeVoucherBudget",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "referredVoucherBudget",
              "type": "uint256"
            }
          ],
          "internalType": "struct IELProject.ProjectVoucherDetails",
          "name": "projectVoucherDetails",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTotalBeneficiaries",
      "outputs": [
        { "internalType": "uint256", "name": "enrolledBen", "type": "uint256" },
        { "internalType": "uint256", "name": "referredBen", "type": "uint256" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "_vendor", "type": "address" }
      ],
      "name": "getVendorVoucherDetail",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "freeVoucherRedeemed",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "referredVoucherRedeemed",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "beneficiaryReferred",
              "type": "uint256"
            }
          ],
          "internalType": "struct IELProject.VoucherDetailByVendor",
          "name": "voucherDetails",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "_amount", "type": "uint256" },
        { "internalType": "address", "name": "_tokenAddress", "type": "address" }
      ],
      "name": "increaseTokenBudget",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "_address", "type": "address" }
      ],
      "name": "isBeneficiary",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "forwarder", "type": "address" }
      ],
      "name": "isTrustedForwarder",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "bytes[]", "name": "data", "type": "bytes[]" }
      ],
      "name": "multicall",
      "outputs": [
        { "internalType": "bytes[]", "name": "results", "type": "bytes[]" }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "otpServerAddress",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "_benAddress", "type": "address" },
        { "internalType": "string", "name": "_otp", "type": "string" }
      ],
      "name": "processTokenRequest",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "_tokenAddress", "type": "address" },
        { "internalType": "uint256", "name": "_amount", "type": "uint256" },
        { "internalType": "address", "name": "_vendorAddress", "type": "address" }
      ],
      "name": "redeemTokenByVendor",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "referralLimit",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "name": "referredBenficiaries",
      "outputs": [
        { "internalType": "address", "name": "account", "type": "address" },
        {
          "internalType": "address",
          "name": "referrerVendor",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "referrerBeneficiaries",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "referredToken",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "referredVoucherAssigned",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "referredVoucherClaimed",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "name": "referredVoucherRedeemedByVendor",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "_address", "type": "address" }
      ],
      "name": "removeBeneficiary",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "_account", "type": "address" }
      ],
      "name": "removeReferredBeneficiaries",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "_benAddress", "type": "address" },
        { "internalType": "address", "name": "_tokenAddress", "type": "address" }
      ],
      "name": "requestReferredTokenFromBeneficiary",
      "outputs": [
        { "internalType": "uint256", "name": "requestId", "type": "uint256" }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "_benAddress", "type": "address" },
        { "internalType": "address", "name": "_tokenAddress", "type": "address" },
        { "internalType": "address", "name": "_otpServer", "type": "address" }
      ],
      "name": "requestTokenFromBeneficiary",
      "outputs": [
        { "internalType": "uint256", "name": "requestId", "type": "uint256" }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "_benAddress", "type": "address" }
      ],
      "name": "requestTokenFromBeneficiary",
      "outputs": [
        { "internalType": "uint256", "name": "requestId", "type": "uint256" }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }
      ],
      "name": "supportsInterface",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "_tokenAddress", "type": "address" }
      ],
      "name": "tokenBudget",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "", "type": "address" },
        { "internalType": "address", "name": "", "type": "address" }
      ],
      "name": "tokenRequestIds",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "trustedForwarder",
      "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "_admin", "type": "address" },
        { "internalType": "bool", "name": "_status", "type": "bool" }
      ],
      "name": "updateAdmin",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "_address", "type": "address" }
      ],
      "name": "updateOtpServer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "_address", "type": "address" },
        { "internalType": "bool", "name": "_status", "type": "bool" }
      ],
      "name": "updateVendor",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ] as const
  