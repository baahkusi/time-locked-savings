import { ethers } from "hardhat";
import "dotenv/config";

async function main() {
  try {
    const lockedSaving = await ethers.getContractAt(
      "TimeLockedSavings",
      process.env.CONTRACT_ADDRESS!
    );

    const vaultIds = [0, 1, 2];

    for (const id of vaultIds) {
      const tx = await lockedSaving.depositVault(id, {
        value: ethers.parseEther("0.01"),
      });
      console.log(tx);
    }
    console.log("Done depositing vaults");
  } catch (error) {
    console.log(error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
