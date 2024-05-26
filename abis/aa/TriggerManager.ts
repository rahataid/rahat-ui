export const TriggerManagerABI = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_requiredTriggers",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "sourceId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "triggerAddress",
          "type": "address"
        }
      ],
      "name": "TriggerInitialized",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "sourceId",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "sourceName",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "sourceDetails",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "triggerAddress",
          "type": "address"
        }
      ],
      "name": "TriggerSourceUpdated",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "getTriggerCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "hasTriggered",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "sourceId",
          "type": "bytes32"
        }
      ],
      "name": "removeTriggerSource",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "requiredTriggers",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_requiredTriggers",
          "type": "uint256"
        }
      ],
      "name": "setRequiredTriggers",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "sourceId",
          "type": "bytes32"
        }
      ],
      "name": "trigger",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "name": "triggerSources",
      "outputs": [
        {
          "internalType": "string",
          "name": "sourceName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "sourceDetails",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "triggerAddress",
          "type": "address"
        }
      ],
      "stateMutability": "view",
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
      "name": "triggers",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "sourceId",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "triggerAddress",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "sourceId",
          "type": "bytes32"
        },
        {
          "internalType": "string",
          "name": "sourceName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "sourceDetails",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "triggerAddress",
          "type": "address"
        }
      ],
      "name": "updateTriggerSource",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ] as const;