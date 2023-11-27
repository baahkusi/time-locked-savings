import {
  Deposit as DepositEvent,
  VaultCreated as VaultCreatedEvent,
  Withdrawal as WithdrawalEvent
} from "../generated/Contract/Contract"
import { Deposit, VaultCreated, Withdrawal } from "../generated/schema"

export function handleDeposit(event: DepositEvent): void {
  let entity = new Deposit(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.vaultId = event.params.vaultId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleVaultCreated(event: VaultCreatedEvent): void {
  let entity = new VaultCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.vaultId = event.params.vaultId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWithdrawal(event: WithdrawalEvent): void {
  let entity = new Withdrawal(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.vaultId = event.params.vaultId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
