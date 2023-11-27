# Time Locked Savings

- This smart contract will force you to save no cap.
- It will lock your money for a specified time.
- Within that time you cannot withdraw the money until the time is over.
- No Defi antics, no profit or anything, just pure locked savings.


## How does it work?

- Create a vault and deposit and make an initial deposit.
- A vault asks you three questions;
    - How long you want to save?
    - What are you saving for?
    - What is your target?

### How is it designed?

- It uses one smart contract to hold several vaults.
- It uses proxy pattern for upgradable deployment.
- It uses subgraphs & The Graph for processing &  reading data offchain.

### Data Available

- Total value locked.
- Total value locked per user.
- Total value locked per user per vault.
- Deposits and withdraw transactions.
- User vaults.


#### Deployments
- `npx hardhat run scripts/deploy.ts --network sepolia` to deploy to sepolia network
- `npx hardhat verify --network sepolia [contract address]`


Sepolia
========
```json
{
  "_type": "TransactionReceipt",
  "accessList": [],
  "blockNumber": null,
  "blockHash": null,
  "chainId": "11155111",
  "data": "",
  "from": "0xb3fAED28554eF9F249873Bae907564cFB20410b6",
  "gasLimit": "970152",
  "gasPrice": "1626751378",
  "hash": "0xa409cae51699a8a9fa241a485f13a631c9e3c4b97a7667985efe3feda1e75d33",
  "maxFeePerGas": "1626751378",
  "maxPriorityFeePerGas": "1500000000",
  "nonce": 136,
  "signature": {
    "_type": "signature",
    "networkV": null,
    "r": "0x8805b5fd6b523a4f400ea0ff3c673998a486f46d81db6e204b23873615094e51",
    "s": "0x4788cd5ed76dc431c30b65e85342172a040549ef4bd3f8f85439ac6d388b1a71",
    "v": 27
  },
  "to": null,
  "type": 2,
  "value": "0",
  "contractAddress": "0xC6912704c199B40Aa95E609068d255a2Ca09AF14"
}
```

#### Graph Studio Deployment

https://api.studio.thegraph.com/query/52116/locked-saving/version/latest 