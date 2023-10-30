import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lock", function () {
  async function deployTimeLocked() {
    const [owner, otherAccount] = await ethers.getSigners();

    const TLS = await ethers.getContractFactory("TimeLockedSavings");
    const tls = await TLS.deploy();

    return { tls, owner, otherAccount };
  }

  async function createTestVaults() {
    const [owner, kofi, ama, yaw] = await ethers.getSigners();

    const TLS = await ethers.getContractFactory("TimeLockedSavings");
    const tls = await TLS.deploy();

    return { tls, owner, kofi, ama, yaw };
  }

  describe("Deployment", function () {
    it("", async function () {
      const { tls, owner, otherAccount } = await loadFixture(deployTimeLocked);

      const ONE_DAY = 60 * 60 * 24;

      expect(await tls.minDuration()).equals(ONE_DAY);

      const DEPOSIT_AMNT = BigInt(1e18);

      const MIN_DEPOSIT_AMNT = DEPOSIT_AMNT / BigInt(10);

      expect(await tls.minDeposit(DEPOSIT_AMNT)).equals(MIN_DEPOSIT_AMNT);
    });
  });

  describe("Create Vault", function () {
    it("Should create vault successfully", async function () {
      const { tls, owner, otherAccount } = await loadFixture(deployTimeLocked);
    });
    it("Should fail with zero value", async function () {
      const { tls, owner, otherAccount } = await loadFixture(deployTimeLocked);
    });
    it("Should fail with zero target", async function () {
      const { tls, owner, otherAccount } = await loadFixture(deployTimeLocked);
    });
    it("Should fail with invalid deposit", async function () {
      const { tls, owner, otherAccount } = await loadFixture(deployTimeLocked);
    });
    it("Should fail with invalid duration", async function () {
      const { tls, owner, otherAccount } = await loadFixture(deployTimeLocked);
    });
    it("Should fail with empty purpose", async function () {
      const { tls, owner, otherAccount } = await loadFixture(deployTimeLocked);
    });
    it("Should fail with vault inactive", async function () {
      const { tls, owner, otherAccount } = await loadFixture(deployTimeLocked);
    });
  });

  describe("Deposit Vault", function () {
    it("Should deposit successfully", async function () {
      const { tls, owner, kofi, ama, yaw } = await loadFixture(createTestVaults);
    });
    it("Should fail with zero value", async function () {
      const { tls, owner, kofi, ama, yaw } = await loadFixture(createTestVaults);
    });
    it("Should fail with inactive vault", async function () {
      const { tls, owner, kofi, ama, yaw } = await loadFixture(createTestVaults);
    });
  });

  describe("Withdraw Vault", function () {
    it("Should withdraw successfully", async function () {
      const { tls, owner, kofi, ama, yaw } = await loadFixture(createTestVaults);
    });
    it("Should fail with not vault owner", async function () {
      const { tls, owner, kofi, ama, yaw } = await loadFixture(createTestVaults);
    });
    it("Should fail with vault locked", async function () {
      const { tls, owner, kofi, ama, yaw } = await loadFixture(createTestVaults);
    });
    it("Should fail with inactive vault", async function () {
      const { tls, owner, kofi, ama, yaw } = await loadFixture(createTestVaults);
    });
  });
});
