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