export const RahatTreasuryABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "treasuryId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "increasedamount",
          "type": "uint256"
        }
      ],
      "name": "BudgetIncreased",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "treasuryId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "BudgetRedeemed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "string",
          "name": "year",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "budget",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "string",
          "name": "country",
          "type": "string"
        }
      ],
      "name": "TreasuryCreated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_treasuryId",
          "type": "uint256"
        }
      ],
      "name": "checkBudget",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "year",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "budget",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "country",
              "type": "string"
            }
          ],
          "internalType": "struct IRahatTreasury.Treasury",
          "name": "treasuryDetails",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_year",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_budget",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_country",
          "type": "string"
        }
      ],
      "name": "createTreasury",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "treasuryId",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_treasuryId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "increaseBudget",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_treasuryId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "redeemToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "treasury",
      "outputs": [
        {
          "internalType": "string",
          "name": "year",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "budget",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "country",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "treasuryCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ] as const;