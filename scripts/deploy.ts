import { ethers } from "hardhat";
import 'dotenv/config'

async function main() {

  const saving = await ethers.deployContract("TimeLockedSavings");

  const { ...tx} = saving.deploymentTransaction()?.toJSON();
  tx.data = "";
  tx.contractAddress = await saving.getAddress();

  console.log(`deployed to ${JSON.stringify(tx, null, 2)}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
