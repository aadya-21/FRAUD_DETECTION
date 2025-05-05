const contractABI = [
    {
      "inputs": [
        { "internalType": "address", "name": "_receiver", "type": "address" },
        { "internalType": "uint256", "name": "_amount", "type": "uint256" },
        { "internalType": "bool", "name": "_isFraud", "type": "bool" }
      ],
      "name": "logTransaction",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "address", "name": "sender", "type": "address" },
        { "indexed": true, "internalType": "address", "name": "receiver", "type": "address" },
        { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
        { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" },
        { "indexed": false, "internalType": "bool", "name": "isFraud", "type": "bool" }
      ],
      "name": "TransactionLogged",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "getAllTransactions",
      "outputs": [
        {
          "components": [
            { "internalType": "address", "name": "sender", "type": "address" },
            { "internalType": "address", "name": "receiver", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" },
            { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
            { "internalType": "bool", "name": "isFraud", "type": "bool" }
          ],
          "internalType": "struct FraudDetectionLogger.Transaction[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  
  export default contractABI;
  