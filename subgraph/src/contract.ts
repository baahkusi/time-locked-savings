import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  Contract,
  Deposit as DepositEvent,
  VaultCreated as VaultCreatedEvent,
  Withdrawal as WithdrawalEvent,
} from "../generated/Contract/Contract";
import { AggregateVault, Owner, OwnerAction, Vault } from "../generated/schema";

const AGGREGATE_TOTAL = "total";

export function handleDeposit(event: DepositEvent): void {
  const actionId = event.transaction.hash
    .concatI32(event.logIndex.toI32())
    .toHexString();
  upsertVault(
    event.address,
    event.params.vaultId,
    actionId,
    "Deposit",
    event.transaction.from,
    event.transaction.value,
    event.block.timestamp
  );
}

export function handleVaultCreated(event: VaultCreatedEvent): void {
  const actionId = event.transaction.hash
    .concatI32(event.logIndex.toI32())
    .toHexString();
  upsertVault(
    event.address,
    event.params.vaultId,
    actionId,
    "Create",
    event.transaction.from,
    event.transaction.value,
    event.block.timestamp
  );
}

export function handleWithdrawal(event: WithdrawalEvent): void {
  const actionId = event.transaction.hash
    .concatI32(event.logIndex.toI32())
    .toHexString();
  upsertVault(
    event.address,
    event.params.vaultId,
    actionId,
    "Withdraw",
    event.transaction.from,
    event.transaction.value,
    event.block.timestamp
  );
}

function upsertVault(
  contractAddress: Address,
  vaultId: BigInt,
  actionId: string,
  actionType: string,
  actor: Address,
  amount: BigInt,
  timeStamp: BigInt,
): void {
  const timeLocked = Contract.bind(contractAddress);
  const vaultOnContract = timeLocked.vaults(vaultId);
  let vault = Vault.load(vaultId.toString());
  if (vault == null) {
    vault = new Vault(vaultId.toString());
    vault.depositAmount = vaultOnContract.getDepositAmount();
    vault.targetAmount = vaultOnContract.getTargetAmount();
    vault.lockStartTime = timeStamp;
    vault.lockEndTime = vaultOnContract.getLockEndTime();
    vault.purpose = vaultOnContract.getPurpose();
    vault.withdrawn = vaultOnContract.getWithdrawn();
    vault.owner = vaultOnContract.getOwner().toHexString();
  } else {
    vault.depositAmount = vaultOnContract.getDepositAmount();
    vault.withdrawn = vaultOnContract.getWithdrawn();
  }
  let totalDeposit: BigInt = BigInt.fromI32(0);
  let totalTarget: BigInt = BigInt.fromI32(0);
  let totalWithdrawn: BigInt = BigInt.fromI32(0);
  let saveAction = true;
  if (actionType == "Create") {
    totalDeposit = amount;
    totalTarget = vaultOnContract.getTargetAmount();
  } else if (actionType == "Deposit") {
    totalDeposit = amount;
  } else if (actionType == "Withdraw") {
    totalWithdrawn = vaultOnContract.getDepositAmount();
  } else {
    saveAction = false;
  }
  updateOwner(
    vaultOnContract.getOwner(),
    totalDeposit,
    totalTarget,
    totalWithdrawn
  );
  updateAggregate(totalDeposit, totalTarget, totalWithdrawn);
  if (saveAction) {
    const action = new OwnerAction(actionId);
    action.action = actionType;
    action.actor = actor.toHexString();
    action.amount = amount;
    action.owner = vaultOnContract.getOwner().toHexString();
    action.vault = vaultId.toString();
    action.save();
  }
  vault.save();
}

function updateOwner(
  owner: Address,
  totalDeposit: BigInt,
  totalTarget: BigInt,
  totalWithdrawn: BigInt
): void {
  let ownerAggregate = Owner.load(owner.toHexString());
  if (ownerAggregate == null) {
    ownerAggregate = new Owner(owner.toHexString());
    ownerAggregate.totalDeposit = totalDeposit;
    ownerAggregate.totalTarget = totalTarget;
    ownerAggregate.totalWithdrawn = totalWithdrawn;
  } else {
    ownerAggregate.totalDeposit = ownerAggregate.totalDeposit.plus(totalDeposit);
    ownerAggregate.totalTarget = ownerAggregate.totalTarget.plus(totalTarget);
    ownerAggregate.totalWithdrawn = ownerAggregate.totalWithdrawn.plus(totalWithdrawn);
  }
  ownerAggregate.save();
}

function updateAggregate(
  totalDeposit: BigInt,
  totalTarget: BigInt,
  totalWithdrawn: BigInt
): void {
  let aggregate = AggregateVault.load(AGGREGATE_TOTAL);
  if (aggregate == null) {
    aggregate = new AggregateVault(AGGREGATE_TOTAL);
    aggregate.totalDeposit = totalDeposit;
    aggregate.totalTarget = totalTarget;
    aggregate.totalWithdrawn = totalWithdrawn;
  } else {
    aggregate.totalDeposit = aggregate.totalDeposit.plus(totalDeposit);
    aggregate.totalTarget = aggregate.totalTarget.plus(totalTarget);
    aggregate.totalWithdrawn = aggregate.totalWithdrawn.plus(totalWithdrawn);
  }
  aggregate.save();
}
