import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt } from "@graphprotocol/graph-ts"
import {
  Deposit,
  VaultCreated,
  Withdrawal
} from "../generated/Contract/Contract"

export function createDepositEvent(vaultId: BigInt): Deposit {
  let depositEvent = changetype<Deposit>(newMockEvent())

  depositEvent.parameters = new Array()

  depositEvent.parameters.push(
    new ethereum.EventParam(
      "vaultId",
      ethereum.Value.fromUnsignedBigInt(vaultId)
    )
  )

  return depositEvent
}

export function createVaultCreatedEvent(vaultId: BigInt): VaultCreated {
  let vaultCreatedEvent = changetype<VaultCreated>(newMockEvent())

  vaultCreatedEvent.parameters = new Array()

  vaultCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "vaultId",
      ethereum.Value.fromUnsignedBigInt(vaultId)
    )
  )

  return vaultCreatedEvent
}

export function createWithdrawalEvent(vaultId: BigInt): Withdrawal {
  let withdrawalEvent = changetype<Withdrawal>(newMockEvent())

  withdrawalEvent.parameters = new Array()

  withdrawalEvent.parameters.push(
    new ethereum.EventParam(
      "vaultId",
      ethereum.Value.fromUnsignedBigInt(vaultId)
    )
  )

  return withdrawalEvent
}
