import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lock", function () {

  async function deployTimeLockedSavings() {
    const [owner, otherAccount] = await ethers.getSigners();

    const ONE_DAY = 60 * 60 * 24;

    const ONE_ETH = ethers.parseEther('1');

    const TWO_ETH = ethers.parseEther('2');

    const TEN_ETH = ethers.parseEther('10');

    const TWENTY_ETH = ethers.parseEther('20');

    const TLS = await ethers.getContractFactory("TimeLockedSavings");
    const tls = await TLS.deploy();

    return { tls, owner, otherAccount, ONE_DAY, ONE_ETH, TWO_ETH, TEN_ETH, TWENTY_ETH };
  }

  async function createTimelockedVaults() {
    const { tls, owner, otherAccount, ONE_DAY, ONE_ETH, TWO_ETH, TEN_ETH, TWENTY_ETH } = await loadFixture(deployTimeLockedSavings);

    await tls.createVault(TEN_ETH, ONE_DAY * 30, "school fees.", { value: ONE_ETH });

    await tls.createVault(TWENTY_ETH, ONE_DAY * 60, "range rover.", { value: TWO_ETH });

    return { tls, owner, otherAccount, ONE_DAY, ONE_ETH, TWO_ETH, TEN_ETH, TWENTY_ETH };
  }

  describe("Deployment", function () {
    it("Should Deploy", async function () {
      await loadFixture(deployTimeLockedSavings);
    });
  });

  describe("Create Vault", function () {
    it("Should create vault successfully", async function () {
      await loadFixture(createTimelockedVaults);
    });
    it("Should fail with zero value", async function () {
      const { tls, ONE_DAY, TEN_ETH } = await loadFixture(deployTimeLockedSavings);
      await expect(tls.createVault(TEN_ETH, ONE_DAY * 30, "school fees.", { value: 0 })).to.revertedWithCustomError(tls, "ZeroValue");
    });
    it("Should fail with zero target", async function () {
      const { tls, ONE_DAY, TEN_ETH } = await loadFixture(deployTimeLockedSavings);
      await expect(tls.createVault(0, ONE_DAY * 30, "school fees.", { value: TEN_ETH })).to.revertedWithCustomError(tls, "ZeroTargetAmount");
    });
    it("Should fail with invalid deposit", async function () {
      const { tls, ONE_DAY, ONE_ETH, TWENTY_ETH } = await loadFixture(deployTimeLockedSavings);
      await expect(tls.createVault(TWENTY_ETH, ONE_DAY * 30, "school fees.", { value: ONE_ETH })).to.revertedWithCustomError(tls, "InvalidDepositAmount");
    });
    it("Should fail with invalid duration", async function () {
      const { tls, ONE_DAY, TWO_ETH, TWENTY_ETH } = await loadFixture(deployTimeLockedSavings);
      await expect(tls.createVault(TWENTY_ETH, ONE_DAY / 2, "school fees.", { value: TWO_ETH })).to.revertedWithCustomError(tls, "InvalidDuration");
    });
    it("Should fail with empty purpose", async function () {
      const { tls, ONE_DAY, TWO_ETH, TWENTY_ETH } = await loadFixture(deployTimeLockedSavings);
      await expect(tls.createVault(TWENTY_ETH, ONE_DAY, "", { value: TWO_ETH })).to.revertedWithCustomError(tls, "EmptyPurpose");
    });
  });

  describe("Deposit Vault", function () {
    it("Should deposit successfully", async function () {
      const { tls, ONE_ETH, TWO_ETH } = await loadFixture(createTimelockedVaults);

      await tls.depositVault(0, {value: ONE_ETH});
      

      expect((await tls.vaults(0))[1]).to.equal(TWO_ETH);
    });
    it("Should fail with zero value", async function () {
      const { tls } = await loadFixture(createTimelockedVaults);      

      await expect(tls.depositVault(0, {value: 0})).to.revertedWithCustomError(tls, "ZeroValue");
    });
    it("Should fail with inactive vault", async function () {
      const { tls, ONE_ETH, ONE_DAY } = await loadFixture(createTimelockedVaults);
      
      await time.increase(ONE_DAY * 30);

      await tls.withdrawVault(0);

      await expect(tls.depositVault(0, {value: ONE_ETH})).to.revertedWithCustomError(tls, "VaultInactive");
    });
  });

  describe("Withdraw Vault", function () {
    it("Should withdraw successfully", async function () {
      const { tls, ONE_ETH, ONE_DAY } = await loadFixture(createTimelockedVaults);
      
      await time.increase(ONE_DAY * 30);

      await tls.withdrawVault(0);

      expect((await tls.vaults(0))[5]).to.equal(true);
    });
    it("Should fail with not vault owner", async function () {
      const { tls, otherAccount, ONE_DAY } = await loadFixture(createTimelockedVaults);
      
      await time.increase(ONE_DAY * 30);

      await expect(tls.connect(otherAccount).withdrawVault(0)).to.revertedWithCustomError(tls, "NotVaultOwner");

    });
    it("Should fail with vault locked", async function () {
      const { tls, otherAccount, ONE_DAY } = await loadFixture(createTimelockedVaults);
      
      await time.increase(ONE_DAY * 30);

      await expect(tls.connect(otherAccount).withdrawVault(1)).to.revertedWithCustomError(tls, "NotVaultOwner");
    });
    it("Should fail with inactive vault", async function () {
      const { tls, ONE_ETH, ONE_DAY } = await loadFixture(createTimelockedVaults);
      
      await time.increase(ONE_DAY * 60);

      await tls.withdrawVault(1);

      await expect(tls.withdrawVault(1)).to.revertedWithCustomError(tls, "VaultInactive");
    });
  });
});
