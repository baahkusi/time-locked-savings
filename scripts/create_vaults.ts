import { ethers } from "hardhat";
import "dotenv/config";

async function main() {
  try {
    const lockedSaving = await ethers.getContractAt(
      "TimeLockedSavings",
      process.env.CONTRACT_ADDRESS!
    );

    const ONE_DAY = 60 * 60 * 24;

    let tx = await lockedSaving.createVault(
      ethers.parseEther("0.1"),
      ONE_DAY,
      "range rover",
      { value: ethers.parseEther("0.01") }
    );
    console.log(tx);

    tx = await lockedSaving.createVault(
      ethers.parseEther("0.3"),
      ONE_DAY * 3,
      "mansion",
      { value: ethers.parseEther("0.03") }
    );
    console.log(tx);

    tx = await lockedSaving.createVault(
      ethers.parseEther("1"),
      ONE_DAY * 15,
      "wife",
      { value: ethers.parseEther("0.1") }
    );
    console.log(tx);
    console.log("Done creating vault tokens");
  } catch (error) {
    console.log(error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
