import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  Contract,
  Deposit as DepositEvent,
  VaultCreated as VaultCreatedEvent,
  Withdrawal as WithdrawalEvent,
} from "../generated/Contract/Contract";
import { AggregateVault, Owner, OwnerAction, Vault } from "../generated/schema";

const AGGREGATE_TOTAL = "total";

const enum ActionType {
  Create,
  Deposit,
  Withdraw,
}

export function handleDeposit(event: DepositEvent): void {
  const actionId = event.transaction.hash
    .concatI32(event.logIndex.toI32())
    .toHexString();
  upsertVault(
    event.address,
    event.params.vaultId,
    actionId,
    ActionType.Deposit,
    event.transaction.from,
    event.transaction.value
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
    ActionType.Create,
    event.transaction.from,
    event.transaction.value
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
    ActionType.Withdraw,
    event.transaction.from,
    event.transaction.value
  );
}

function upsertVault(
  contractAddress: Address,
  vaultId: BigInt,
  actionId: string,
  actionType: ActionType,
  actor: Address,
  amount: BigInt
): void {
  const timeLocked = Contract.bind(contractAddress);
  const vaultOnContract = timeLocked.vaults(vaultId);
  let vault = Vault.load(vaultId.toString());
  if (vault == null) {
    vault = new Vault(vaultId.toString());
    vault.depositAmount = vaultOnContract.getDepositAmount();
    vault.targetAmount = vaultOnContract.getTargetAmount();
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
  switch (actionType) {
    case ActionType.Create:
      totalDeposit = amount;
      totalTarget = vaultOnContract.getTargetAmount();
      break;
    case ActionType.Deposit:
      totalDeposit = amount;
      break;
    case ActionType.Withdraw:
      totalWithdrawn = vaultOnContract.getDepositAmount();
      break;
    default:
      break;
  }
  updateOwner(
    vaultOnContract.getOwner(),
    totalDeposit,
    totalTarget,
    totalWithdrawn
  );
  updateAggregate(totalDeposit, totalTarget, totalWithdrawn);
  const action = new OwnerAction(actionId);
  action.action = actionType.toString();
  action.actor = actor.toHexString();
  action.amount = amount;
  vault.save();
}

function updateOwner(
  owner: Address,
  totalDeposit: BigInt,
  totalTarget: BigInt,
  totalWithdrawn: BigInt
): void {
  let aggregate = Owner.load(owner.toHexString());
  if (aggregate == null) {
    aggregate = new Owner(AGGREGATE_TOTAL);
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
