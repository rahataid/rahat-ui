export const redemptionsAbi =[
    
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_manager",
              "type": "address"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "authority",
              "type": "address"
            }
          ],
          "name": "AccessManagedInvalidAuthority",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "caller",
              "type": "address"
            },
            {
              "internalType": "uint32",
              "name": "delay",
              "type": "uint32"
            }
          ],
          "name": "AccessManagedRequiredDelay",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "caller",
              "type": "address"
            }
          ],
          "name": "AccessManagedUnauthorized",
          "type": "error"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "authority",
              "type": "address"
            }
          ],
          "name": "AuthorityUpdated",
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
          "name": "TokenRedeemed",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_token",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "_amount",
              "type": "uint256"
            }
          ],
          "name": "approveToken",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "authority",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_token",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_from",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "_amount",
              "type": "uint256"
            }
          ],
          "name": "claimToken",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_token",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_from",
              "type": "address"
            }
          ],
          "name": "getAllowanceAndBalance",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "allowance",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "balance",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "isConsumingScheduledOp",
          "outputs": [
            {
              "internalType": "bytes4",
              "name": "",
              "type": "bytes4"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_tokenAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_from",
              "type": "address"
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
              "internalType": "address",
              "name": "newAuthority",
              "type": "address"
            }
          ],
          "name": "setAuthority",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_token",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_from",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "_amount",
              "type": "uint256"
            }
          ],
          "name": "transferFromToken",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_token",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "_amount",
              "type": "uint256"
            }
          ],
          "name": "transferToken",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      
] as const;